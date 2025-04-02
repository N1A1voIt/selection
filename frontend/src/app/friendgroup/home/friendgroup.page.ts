import {AfterViewInit, Component, OnInit} from '@angular/core';
import {KapiHeaderComponent} from "../../kapi/header/kapi.header.component";
import {FirstDailyPromptComponent} from "./prompts/firstDaily/first.daily.prompt.component";
import {SecondDailyPromptComponent} from "./prompts/secondDaily/second.daily.prompt.component";
import {NgIf} from "@angular/common";
import {FriendgroupService} from "./friendgroup.service";
import {FireComponent} from "../../fire/fire.component";
import {GroupService} from "../../services/group.service";
import {ActivatedRoute} from "@angular/router";
import {collection, collectionData, doc, docData, Firestore, query, where} from "@angular/fire/firestore";
import {createClient, User} from "@supabase/supabase-js";
import {map} from "rxjs";
import {AngularFirestore} from '@angular/fire/compat/firestore';
import firebase from "firebase/compat";
import CollectionReference = firebase.firestore.CollectionReference;
import {getAuth} from "firebase/auth";
import {onAuthStateChanged} from "@angular/fire/auth";

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
  selector: 'app-friend-group',
  templateUrl: './friendgroup.page.html',
  imports: [
    KapiHeaderComponent,
    FirstDailyPromptComponent,
    SecondDailyPromptComponent,
    NgIf,
    FireComponent,
  ],
  styleUrls: ['./friendgroup.page.scss'],
  standalone: true,
})

export class FriendGroupPage  implements OnInit, AfterViewInit {
  groupId: string = '';
  groupData: any;
  private collectionRef: CollectionReference;
  streak: number = 0;
  actualPrompt: string = "Prendre en photo la vue depuis votre chambre.";
  secondPrompt: string = "Dessinez un arbre.";
  category: string = "Photographie et dessin";
  categoryId: string = "musique";
  everyoneHasUploaded = false;
  currentUser: any = {};
  constructor(private groupService: GroupService,private route: ActivatedRoute, private firestore: Firestore, private friendGroupService: FriendgroupService,private store:AngularFirestore) {
    // @ts-ignore
    this.collectionRef = collection(this.firestore, 'photos');
  }


  randomImageUrl!: string;
  async getGroupDetails(): Promise<void> {
    const groupRef = doc(this.firestore, `groups/${this.groupId}`);
    // Convert the observable to a promise to allow async/await
    const groupData = await new Promise<any>((resolve, reject) => {
      docData(groupRef).subscribe({
        next: data => {
          this.groupData = data;
          // @ts-ignore
          this.actualPrompt = data['prompt'];
          resolve(data);
        },
        error: (error) => reject(error)
      });
    });
  }

   async ngOnInit(){
    this.groupId = this.route.snapshot.paramMap.get('id')!;
    await this.getGroupDetails();
    this.getRandomPhotoUrl(this.groupData['name']);
     this.actualPrompt = localStorage.getItem("prompt") ? JSON.parse(<string>localStorage.getItem("prompt")) : "";
    this.groupService.getModifPrompt(this.actualPrompt).subscribe({
      next:data =>{
        this.secondPrompt = data.detail;
        localStorage.setItem('secondPrompt', JSON.stringify(this.secondPrompt));
      }
    });

  }

  async ngAfterViewInit(): Promise<void> {
    this.streak = await this.friendGroupService.streakVerifier(this.groupData);
  }

  async fetchRandomImage(): Promise<void> {
    try {
      // Replace 'your-bucket-name' with your actual bucket name
      const bucketName = 'photos';

      // List all files in the bucket
      const { data, error } = await supabase.storage.from(bucketName).list('', {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' }
      });

      if (error) {
        throw error;
      }

      if (data && data.length > 0) {
        // Select a random file
        const randomIndex = Math.floor(Math.random() * data.length);
        const randomFile = data[randomIndex];

        // Generate a public URL for the random file
        const publicUrl = supabase.storage.from(bucketName).getPublicUrl(randomFile.name).data.publicUrl;
        console.log(publicUrl)
        this.randomImageUrl = publicUrl;
      }
    } catch (error) {
      console.error('Error fetching random image', error);
    }
  }
   getPhotoUrl(fileName: string, bucketName: string) {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    return data.publicUrl;
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

  async getRandomPhotoUrl(groupName: string)  {
    await this.getCurrentUser();
    console.log(groupName)
    console.log("ETO OHHHHH", this.currentUser.email);
    const q = query(
      this.collectionRef,
      where('groupId.name', '==', groupName)
    );
    var c = collectionData(q, { idField: 'id' }).pipe(
      map(results => results)
    );
    c.subscribe({
      next: data => {
        if (data && data.length > 0) {
          console.log("ETO OHHHHH", this.currentUser.email);
          const filteredData = data.filter(item => {
            console.log("Checking:", item['userId']['email'], "against", this.currentUser.email);
            return item['userId']['email'] != this.currentUser.email;
          });

          console.log("huhu",filteredData);
          const randomIndex = Math.floor(Math.random() * filteredData.length);
          const randomUrl = filteredData[randomIndex];

          console.log("Random Photo URL:", randomUrl);
          this.randomImageUrl = this.getPhotoUrl(randomUrl['photoUrl'], "photos");
        }
      }
    });
  }

}
