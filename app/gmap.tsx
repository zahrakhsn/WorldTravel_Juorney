import { db } from '@/app/(tabs)/firebaseConfig';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { router, useLocalSearchParams } from 'expo-router';
import { onValue, ref } from 'firebase/database';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
// @ts-ignore
import polyline from 'polyline';

export default function MapScreen() {
 const params = useLocalSearchParams();
 const targetLat = params.lat ? parseFloat(params.lat as string) : null;
 const targetLng = params.lng ? parseFloat(params.lng as string) : null;

 const mapRef = useRef<any>(null);
 const [markers, setMarkers] = useState<any>([]);
 const [loading, setLoading] = useState(true);
 const [currentLocation, setCurrentLocation] = useState<any>(null);
 const [routeCoordinates, setRouteCoordinates] = useState<any>([]);
 const [routeInfo, setRouteInfo] = useState<any>(null);
 // Initialize as empty, as it will be removed


 useEffect(() => {
   const getLocation = async () => {
     try {
       const { status } = await Location.requestForegroundPermissionsAsync();
       if (status === 'granted') {
         const location = await Location.getCurrentPositionAsync({});
         setCurrentLocation({
           latitude: location.coords.latitude,
           longitude: location.coords.longitude,
         });
       }
     } catch (error) {
       console.error('Error getting location:', error);
     }
   };

   getLocation();

   const pointsRef = ref(db, 'points/');
  
   const unsubscribe = onValue(pointsRef, (snapshot: any) => {
     const data = snapshot.val();
     if (data) {
       const parsedMarkers = Object.keys(data)
         .map(key => {
           const point = data[key];
           // Ensure coordinates is a string and not empty
           if (typeof point.coordinates !== 'string' || point.coordinates.trim() === '') {
             return null;
           }
           const [latitude, longitude] = point.coordinates.split(',').map(Number);
          
           // Validate that parsing was successful
           if (isNaN(latitude) || isNaN(longitude)) {
             console.warn(`Invalid coordinates for point ${key}:`, point.coordinates);
             return null;
           }


           return {
             id: key,
             name: point.name,
             latitude,
             longitude,
             // imageUrl: point.imageUrl || null, // Removed imageUrl
           };
         })
         .filter(Boolean); // Filter out any null entries from invalid data


       // @ts-ignore
       setMarkers(parsedMarkers);
     } else {
       setMarkers([]);
     }
     setLoading(false);
   }, (error: any) => {
     console.error(error);
     setLoading(false);
   });


 }, []);

 useEffect(() => {
   if (targetLat && targetLng && currentLocation) {
     // Fetch route from Google Maps Directions API
     const fetchRoute = async () => {
       try {
         const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${currentLocation.latitude},${currentLocation.longitude}&destination=${targetLat},${targetLng}&key=AIzaSyCj4GAAaqgVzcteMmxz9tw1s_rbfTolJ54&mode=driving`;
         
         const response = await fetch(url);
         const data = await response.json();

         if (data.routes.length > 0) {
           const points = polyline.toGeoJSON(data.routes[0].overview_polyline.points);
           const decodedPoints = points.coordinates.map((coord: any) => ({
             latitude: coord[1],
             longitude: coord[0],
           }));
           setRouteCoordinates(decodedPoints);
           
           // Extract route info
           const route = data.routes[0];
           const distance = route.legs[0].distance.text;
           const duration = route.legs[0].duration.text;
           setRouteInfo({ distance, duration });
         } else {
           // Fallback: direct line if no route found
           setRouteCoordinates([
             {
               latitude: currentLocation.latitude,
               longitude: currentLocation.longitude,
             },
             {
               latitude: targetLat,
               longitude: targetLng,
             },
           ]);
         }
       } catch (error) {
         console.error('Error fetching route:', error);
         // Fallback: direct line
         setRouteCoordinates([
           {
             latitude: currentLocation.latitude,
             longitude: currentLocation.longitude,
           },
           {
             latitude: targetLat,
             longitude: targetLng,
           },
         ]);
       }
     };

     fetchRoute();
   }
 }, [targetLat, targetLng, currentLocation]);

 useEffect(() => {
   if (targetLat && targetLng && currentLocation && routeCoordinates.length > 0 && mapRef.current) {
     // Animate map to fit both current location and target
     const coordinates = [
       { latitude: currentLocation.latitude, longitude: currentLocation.longitude },
       { latitude: targetLat, longitude: targetLng }
     ];
     
     setTimeout(() => {
       mapRef.current?.fitToCoordinates(coordinates, {
         edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
         animated: true,
       });
     }, 500);
   }
 }, [targetLat, targetLng, currentLocation, routeCoordinates]);


 if (loading) {
   return (
     <View style={styles.container}>
       <ActivityIndicator size="large" />
       <Text>Loading map data...</Text>
     </View>
   );
 }


 // Render the map on native platforms
 return (
   <View style={styles.container}>
     <MapView
       ref={mapRef}
       style={styles.map}
       initialRegion={{
         latitude: currentLocation?.latitude || -7.7956,
         longitude: currentLocation?.longitude || 110.3695,
         latitudeDelta: 0.02,
         longitudeDelta: 0.01,
       }}
       zoomControlEnabled={true}
     >
       {currentLocation && (
         <Marker
           coordinate={currentLocation}
           title="Lokasi Anda"
           pinColor="blue"
         >
           <View style={styles.currentLocationMarker}>
             <View style={styles.currentLocationDot} />
           </View>
         </Marker>
       )}

       {markers.map((marker: any) => (
         <Marker
           key={marker.id}
           coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
           title={marker.name}
           description={`Coords: ${marker.latitude}, ${marker.longitude}`}
         >
           {/* Removed image display for markers */}
         </Marker>
       ))}

       {routeCoordinates.length > 1 && (
         <Polyline
           coordinates={routeCoordinates}
           strokeColor="#0275d8"
           strokeWidth={3}
           geodesic
         />
       )}
     </MapView>

     {/* Route Info Card - Google Maps Style */}
     {routeInfo && (
       <View style={styles.routeInfoCard}>
         <View style={styles.routeHeader}>
           <FontAwesome5 name="route" size={20} color="#0275d8" />
           <Text style={styles.routeTitle}>Rute ke Destinasi</Text>
         </View>
         <View style={styles.routeDetails}>
           <View style={styles.routeItem}>
             <FontAwesome5 name="road" size={16} color="#666" />
             <Text style={styles.routeText}>{routeInfo.distance}</Text>
           </View>
           <View style={styles.routeItem}>
             <FontAwesome5 name="clock" size={16} color="#666" />
             <Text style={styles.routeText}>{routeInfo.duration}</Text>
           </View>
         </View>
         <TouchableOpacity 
           style={styles.navigateButton}
           onPress={() => {
             const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${targetLat},${targetLng}`;
             router.back();
             // Open Google Maps after returning
             setTimeout(() => {
               Linking.openURL(googleMapsUrl);
             }, 300);
           }}
         >
           <FontAwesome5 name="play-circle" size={20} color="white" />
           <Text style={styles.navigateButtonText}>Mulai Navigasi</Text>
         </TouchableOpacity>
       </View>
     )}
     <TouchableOpacity style={styles.fab} onPress={() => router.push('/forminputlocation')}>
             <FontAwesome name="plus" size={24} color="white" />
           </TouchableOpacity>
   </View>
 );
}


const styles = StyleSheet.create({
 container: {
   flex: 1,
   justifyContent: 'center',
   alignItems: 'center',
 },
 map: {
   // ...StyleSheet.absoluteFillObject,
   width: '100%',
   height: '100%',
 },
 fab: {
   position: 'absolute',
   width: 56,
   height: 56,
   alignItems: 'center',
   justifyContent: 'center',
   left: 20,
   bottom: 20,
   backgroundColor: '#0275d8',
   borderRadius: 30,
   elevation: 8,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: 2 },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
 },
 currentLocationMarker: {
   width: 44,
   height: 44,
   borderRadius: 22,
   backgroundColor: '#0275d8',
   justifyContent: 'center',
   alignItems: 'center',
   borderWidth: 3,
   borderColor: 'white',
   elevation: 5,
 },
 currentLocationDot: {
   width: 12,
   height: 12,
   borderRadius: 6,
   backgroundColor: 'white',
 },
 routeInfoCard: {
   position: 'absolute',
   bottom: 0,
   left: 0,
   right: 0,
   backgroundColor: 'white',
   borderTopLeftRadius: 16,
   borderTopRightRadius: 16,
   paddingHorizontal: 16,
   paddingVertical: 16,
   elevation: 5,
   shadowColor: '#000',
   shadowOffset: { width: 0, height: -2 },
   shadowOpacity: 0.1,
   shadowRadius: 4,
 },
 routeHeader: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 12,
 },
 routeTitle: {
   fontSize: 18,
   fontWeight: '600',
   marginLeft: 12,
   color: '#000',
 },
 routeDetails: {
   flexDirection: 'row',
   justifyContent: 'space-around',
   marginBottom: 16,
   paddingVertical: 12,
   borderTopWidth: 1,
   borderBottomWidth: 1,
   borderColor: '#f0f0f0',
 },
 routeItem: {
   flexDirection: 'row',
   alignItems: 'center',
 },
 routeText: {
   fontSize: 16,
   fontWeight: '500',
   marginLeft: 8,
   color: '#333',
 },
 navigateButton: {
   flexDirection: 'row',
   backgroundColor: '#0275d8',
   paddingVertical: 12,
   paddingHorizontal: 24,
   borderRadius: 8,
   alignItems: 'center',
   justifyContent: 'center',
 },
 navigateButtonText: {
   color: 'white',
   fontSize: 16,
   fontWeight: '600',
   marginLeft: 8,
 },
});