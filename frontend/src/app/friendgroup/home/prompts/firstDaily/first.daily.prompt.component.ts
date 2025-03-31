import {Component, Input} from "@angular/core";
import {addIcons} from "ionicons";
import {camera, mic} from "ionicons/icons";
import {IonicModule} from "@ionic/angular";
import {Camera, CameraResultType, CameraSource, PermissionStatus} from "@capacitor/camera";
import {Capacitor} from "@capacitor/core";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-first-daily-prompt',
  templateUrl: './first.daily.prompt.component.html',
  styleUrls: ['./first.daily.prompt.component.scss'],
  imports: [
    IonicModule,
    NgIf
  ]
})
export class FirstDailyPromptComponent {
  @Input() actualPrompt: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper';
  @Input() category: string = 'Photographie et dessin';
  @Input() categoryId: string = 'photo';

  image: string | null = null; // State variable
  uploadedImageUrl: string | null = null;

  async checkCameraPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true; // Skip for web

    const status: PermissionStatus = await Camera.checkPermissions();
    if (status.camera === 'granted') return true;

    const request = await Camera.requestPermissions();
    return request.camera === 'granted';
  }

  async takePhoto() {
    if (!(await this.checkCameraPermission())) {
      return;
    }
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera, // Force camera
      });

      this.image = `data:image/jpeg;base64,${image.base64String}`;

      // Convert to Blob
      const byteCharacters = atob(image.base64String!);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const fileBlob = new Blob([byteArray], { type: 'image/jpeg' });

      // // Upload to Supabase
      // const fileName = `photo-${Date.now()}.jpg`;
      // const filePath = await this.supabaseService.uploadImage(fileBlob, fileName);
      //
      // if (filePath) {
      //   this.uploadedImageUrl = this.supabaseService.getPublicUrl(filePath);
      // }
    } catch (error) {
      console.error('Camera error:', error);
    }
  }

  constructor() {
    addIcons({ 'camera': camera });
    addIcons({'microphone': mic})
  }
}
