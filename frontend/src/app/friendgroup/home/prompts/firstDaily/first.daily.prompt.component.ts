import {Component, Input, OnInit} from "@angular/core";
import {addIcons} from "ionicons";
import {camera, mic} from "ionicons/icons";
import {IonicModule} from "@ionic/angular";
import {Camera, CameraResultType, CameraSource, PermissionStatus} from "@capacitor/camera";
import {Capacitor} from "@capacitor/core";
import {NgIf} from "@angular/common";
import { createClient } from '@supabase/supabase-js';
import {GroupService} from "../../../../services/group.service";
import {data} from "autoprefixer";
import {Score} from "../../../../interfaces/theme";
import { Router } from '@angular/router';
const supabase = createClient('https://raurqxjoiivhjjbhoojn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdXJxeGpvaWl2aGpqYmhvb2puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQzMDEzNSwiZXhwIjoyMDU5MDA2MTM1fQ.5CBJ0_3fOk0Ze06SU5w9-1yVkHQdq8nRzSbNZAhnhU4',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
@Component({
  selector: 'app-first-daily-prompt',
  templateUrl: './first.daily.prompt.component.html',
  styleUrls: ['./first.daily.prompt.component.scss'],
  imports: [
    IonicModule,
    NgIf
  ]
})
export class FirstDailyPromptComponent{
  @Input() actualPrompt: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper';
  @Input() category: string = 'Photographie et dessin';
  @Input() categoryId: string = 'photo';

  image: string | null = null; // State variable
  uploadedImageUrl: string | null = null;

  mediaRecorder: MediaRecorder | null = null;
  audioChunks: Blob[] = [];
  audioUrl: string | null = null;
  uploadedAudioUrl: string | null = null;
  score:Score = new class implements Score {
    match: string="";
    similarity_score: number=0;
  };

  async checkMicrophonePermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true; // Skip for web

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop()); // Release access
      return true;
    } catch (error) {
      console.error('Microphone access denied:', error);
      return false;
    }
  }

  async startRecording() {


    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);

      this.audioChunks = [];
      this.mediaRecorder.ondataavailable = (event) => {
        this.audioChunks.push(event.data);
      };

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        this.audioUrl = URL.createObjectURL(audioBlob);

        // // Upload to Supabase
        // const fileName = `audio-${Date.now()}.wav`;
        // const filePath = await this.supabaseService.uploadAudio(audioBlob, fileName);
        //
        // if (filePath) {
        //   this.uploadedAudioUrl = this.supabaseService.getPublicUrl(filePath);
        // }
      };

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Recording error:', error);
    }
  }

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

      const formData = new FormData();
      const fileName = `photo-${Date.now()}.jpg`;
      formData.append('image', fileBlob, fileName);
      formData.append('prompt', "Un chat");
      let imageOk = false;

      this.groupService.validateImage(formData).subscribe({
        next: async (result) => {
          console.log('Result from validateImage:', result);
          this.score.similarity_score = result.similarity_score;
          this.score.match = result.match;

          if (this.score.similarity_score > 0.5) {
            imageOk = true;
            console.log(`${this.score.similarity_score}%`);
            console.log("match");

            const {data, error} = await supabase
              .storage
              .from('photos')  // Replace 'photos' with your Supabase storage bucket
              .upload(fileName, fileBlob, {
                cacheControl: '3600', // Cache for 1 hour
                upsert: true, // Overwrite if the file already exists
              });
            if (error) {
              console.error('Error uploading file:', error.message);
            } else {
              console.log('File uploaded successfully:', data);
            }
          } else {
            console.log("not ok")
            console.log(`${this.score.match}%`);
            console.log(`${this.score.similarity_score}%`);
          }
          console.log(result)
          await this.router.navigate(['/validation'], {
            state: {
              image: this.image,
              score: result,
              isImageOkay: imageOk,
            },
          });
        }
      });


      console.log("bello");

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

  constructor(private groupService:GroupService,private router:Router) {
    addIcons({ 'camera': camera });
    addIcons({'microphone': mic})
  }
}
