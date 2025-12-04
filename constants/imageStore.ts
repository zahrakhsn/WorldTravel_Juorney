// constants/imageStore.ts
import { ImageSourcePropType } from 'react-native';

interface StoredImage {
  uri: string;
  latitude: number;
  longitude: number;
}

class ImageStore {
  private static instance: ImageStore;
  private _images: StoredImage[] = [];
  private _listeners: (() => void)[] = [];

  private constructor() {}

  public static getInstance(): ImageStore {
    if (!ImageStore.instance) {
      ImageStore.instance = new ImageStore();
    }
    return ImageStore.instance;
  }

  public get images(): StoredImage[] {
    return this._images;
  }

  public addImage(image: StoredImage) {
    this._images.push(image);
    this.notifyListeners();
  }

  public setImages(images: StoredImage[]) {
    this._images = images;
    this.notifyListeners();
  }

  public addListener(listener: () => void) {
    this._listeners.push(listener);
  }

  public removeListener(listener: () => void) {
    this._listeners = this._listeners.filter((l) => l !== listener);
  }

  private notifyListeners() {
    this._listeners.forEach((listener) => listener());
  }
}

export const imageStore = ImageStore.getInstance();
