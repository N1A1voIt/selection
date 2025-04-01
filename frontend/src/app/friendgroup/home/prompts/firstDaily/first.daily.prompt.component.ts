import {Component, Input, OnInit} from "@angular/core";
import {addIcons} from "ionicons";
import {camera, mic} from "ionicons/icons";
import {IonicModule} from "@ionic/angular";
import {Camera, CameraResultType, CameraSource, PermissionStatus} from "@capacitor/camera";
import {Capacitor} from "@capacitor/core";
import {NgIf} from "@angular/common";
import {createClient, User} from '@supabase/supabase-js';
import {GroupService} from "../../../../services/group.service";
import {data} from "autoprefixer";
import {Score} from "../../../../interfaces/theme";
import { Router } from '@angular/router';
import {addDoc, collection, collectionData, Firestore, query} from "@angular/fire/firestore";
import {Auth, onAuthStateChanged} from "@angular/fire/auth";
import {getAuth} from "firebase/auth";
import { CameraComponent } from "../../../../components/camera/camera.component";
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
    NgIf,
    CameraComponent
]
})
export class FirstDailyPromptComponent{
  @Input() actualPrompt: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper';
  @Input() category: string = 'Photographie et dessin';
  @Input() categoryId: string = 'photo';
  @Input() groupData: any = {};
  @Input() imageUrl!:string;
  score: Score = new class implements Score {
    match = "";
    similarity_score= 0;
  };
  image: string | null = null; // State variable
  uploadedImageUrl: string | null = null;
  currentUser: any = {};

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
      formData.append('prompt', this.actualPrompt);
      let imageOk = false;

      this.groupService.validateImage(formData).subscribe({
        next: async (result) => {
          console.log('Result from validateImage:', result);
          this.score.similarity_score = result.similarity_score;
          this.score.match = result.match;

          if (this.score.similarity_score > 0.2) {
            imageOk = true;
            console.log(`${this.score.similarity_score}%`);
            console.log("match");

            const {data, error} = await supabase
              .storage
              .from('photos')  // Replace 'photos' with your Supabase storage bucket
              .upload(fileName, fileBlob, {
                cacheControl: '0', // Cache for 1 hour
                upsert: true, // Overwrite if the file already exists
              });

            await this.addToFirebase(fileName);
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


      console.log("bello beh");

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

  async getCurrentUser() {
    const authInstance = getAuth(); // Get Firebase Auth instance

    // @ts-ignore
    onAuthStateChanged(authInstance, (user: User | null) => {
      if (user) {
        this.currentUser = user;
        console.log("ETO OHHHHH", this.currentUser);
      } else {
        console.log("No user logged in");
      }
    });
  }

  // getUserGroups() {
  //   const groupsRef = collection(this.firestore, 'users');
  //   const groupsQuery = query(groupsRef);
  //
  //   collectionData(groupsQuery, { idField: 'id' }).subscribe({
  //     next: data => {
  //       this.currentUser = data.filter(group =>
  //         group['members'].some((member: { email: string; }) => member.email === this.currentUserEmail)
  //       );
  //     },
  //     error: error => console.log('Error fetching user:', error)
  //   });
  // }

  async addToFirebase (fileName: string): Promise<void> {
    await this.getCurrentUser();
    const userToFireBase = {
      email: this.currentUser.email,
      username: this.currentUser.displayName
    }
    const photoData = {
      groupId: this.groupData,
      userId: userToFireBase,
      photoUrl: fileName,
      detailUrl: "vide",
      isOkay: false
    };
    const groupRef = collection(this.firestore, 'photos');
    await addDoc(groupRef, photoData);
  }

  constructor(private groupService:GroupService, protected router:Router, private auth: Auth, private firestore: Firestore) {
    addIcons({ 'camera': camera });
    addIcons({'microphone': mic})
  }
}
