import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {collection, collectionData, Firestore,query, where} from "@angular/fire/firestore";
import {Auth, onAuthStateChanged} from "@angular/fire/auth";
import {getAuth} from "firebase/auth";
import {User} from "@supabase/supabase-js";
import {addIcons} from "ionicons";
import {addCircleOutline, arrowBack} from "ionicons/icons";
import {Router} from "@angular/router";

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.page.html',
  styleUrls: ['./list-group.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon]
})
export class ListGroupPage implements OnInit {
  users: any[] = [];
  userGroups: any[] = [];
  currentUserEmail!: string;


  goToGroup(group: any) {
    // console.log(group);
    this.router.navigateByUrl('/friend-group/'+group.id); // Navigate to group details page
  }

  constructor(private firestore: Firestore, private auth: Auth,protected router:Router) {
    addIcons({
      arrowBack,
      addCircleOutline
    })
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    const authInstance = getAuth(); // Get Firebase Auth instance

    // @ts-ignore
    onAuthStateChanged(authInstance, (user: User | null) => {
      console.log(user);
      if (user) {
        this.currentUserEmail = user.email || '';
        this.getUserGroups();
      } else {
        console.log("No user logged in");
      }
    });
  }

  getUserGroups() {
    if (!this.currentUserEmail) return;

    const groupsRef = collection(this.firestore, 'groups');
    const groupsQuery = query(groupsRef);

    collectionData(groupsQuery, { idField: 'id' }).subscribe({
      next: data => {
        this.userGroups = data.filter(group =>
          group['members'].some((member: { email: string; }) => member.email === this.currentUserEmail)
        );
      },
      error: error => console.log('Error fetching groups:', error)
    });
  }

}
