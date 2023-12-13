import { Injectable } from '@angular/core';
import { LoadingController, ToastController } from '@ionic/angular';
import { Plugins } from '@capacitor/core';

@Injectable({
  providedIn: 'root'
})
export class UIService {
  private loadingElement: HTMLIonLoadingElement | undefined;

  constructor(
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {}

  async showLoading(msg?: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (this.loadingElement) {
        resolve();
      } else {
        this.loadingElement = await this.loadingController.create({ message: msg });
        this.loadingElement.present();
        resolve();
      }
    });
  }

  async hideLoading(): Promise<void> {
    if (!this.loadingElement) return;
    await this.loadingElement.dismiss();
    this.loadingElement = undefined;
  }

  async showToast(
    msg: string,
    color: string = 'primary',
    duration: number = 3000,
    position: 'top' | 'bottom' | 'middle' | undefined = 'bottom'
  ): Promise<void> {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration,
      position: position,
      color: color,
      translucent: true
    });
    toast.present();
  }

  async getCurrentPosition(): Promise<GeolocationPosition> {
    try {
      const { Geolocation } = Plugins;
      const position = await Geolocation['getCurrentPosition']();
      return position;
    } catch (error) {
      console.error('Error al obtener la posición:', error);
      throw error;
    }
  }
}
