import {Component, OnInit} from '@angular/core';
import { KapiHeaderComponent } from "../../kapi/header/kapi.header.component";
import {FirstDailyPromptComponent} from "./prompts/firstDaily/first.daily.prompt.component";
import {SecondDailyPromptComponent} from "./prompts/secondDaily/second.daily.prompt.component";
import {NgIf} from "@angular/common";
import {FriendgroupService} from "./friendgroup.service";
import {FireComponent} from "../../fire/fire.component";
import {HttpClient} from "@angular/common/http";
import {GroupService} from "../../services/group.service";
import {ActivatedRoute} from "@angular/router";
import {collection, collectionData, doc, docData, Firestore, query, where} from "@angular/fire/firestore";
import {createClient} from "@supabase/supabase-js";
import {map, Observable} from "rxjs";
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from "firebase/compat";
import CollectionReference = firebase.firestore.CollectionReference;

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

export class FriendGroupPage  implements OnInit {
  groupId: string = '';
  groupData: any;
  private collectionRef: CollectionReference;
  streak: number = 0;
  actualPrompt: string = "Prendre en photo la vue depuis votre chambre.";
  secondPrompt: string = "Dessinez un arbre.";
  category: string = "Photographie et dessin";
  categoryId: string = "musique";
  everyoneHasUploaded = false;
  constructor(private groupService: GroupService,private route: ActivatedRoute, private firestore: Firestore, private friendGroupService: FriendgroupService,private store:AngularFirestore) {
    // @ts-ignore
    this.collectionRef = collection(this.firestore, 'photos');
  }

  randomImageUrl!:string;

  getGroupDetails() {
    const groupRef = doc(this.firestore, `groups/${this.groupId}`);
    docData(groupRef).subscribe(data => {
      this.groupData = data;
      // @ts-ignore
      this.actualPrompt = data['prompt'];
      this.getRandomPhotoUrl(this.groupData['name']);
    });
  }

   ngOnInit(){
    this.groupId = this.route.snapshot.paramMap.get('id')!;
    this.getGroupDetails();
    this.actualPrompt = localStorage.getItem("prompt") ? JSON.parse(<string>localStorage.getItem("prompt")) : "";
    this.groupService.getModifPrompt(this.actualPrompt).subscribe({
      next:data =>{
        this.secondPrompt = data.detail;
        localStorage.setItem('secondPrompt', JSON.stringify(this.secondPrompt));
      }
    });

    this.streak = this.friendGroupService.streakVerifier();
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
  getRandomPhotoUrl(groupName: string)  {
    console.log(groupName)
    const q = query(this.collectionRef, where('groupId.name', '==', "BEBNAGROUP"));
    var c = collectionData(q, { idField: 'id' }).pipe(
      map(results => (results.length > 0 ? results[0] : null))
    );
    c.subscribe({
      next: data => {
        if(data!=null){
          console.log(data);
          console.log(data['photoUrl'])
            this.randomImageUrl= data['photoUrl'];
        }
      }
    });
  }
}
