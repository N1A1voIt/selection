import {Component, OnDestroy, OnInit} from '@angular/core';
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
import {SpinnerComponent} from "../../shared/spinner/spinner.component";

@Component({
  selector: 'app-list-group',
  templateUrl: './list-group.page.html',
  styleUrls: ['./list-group.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, SpinnerComponent]
})
export class ListGroupPage implements OnInit, OnDestroy {
  users: any[] = [];
  userGroups: any[] = [];
  currentUserEmail!: string;
  isLoading:boolean = false;

  goToGroup(group: any) {
    // console.log(group);
    this.router.navigateByUrl('/friend-group/'+group.id); // Navigate to group details page
  }

  constructor(private firestore: Firestore, private auth: Auth,private router: Router) {
    addIcons({
      arrowBack,
      addCircleOutline
    })
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  ngOnDestroy() {
    this.userGroups = [];
    this.users = [];
  }

  getCurrentUser() {
    const authInstance = getAuth(); // Get Firebase Auth instance
    this.isLoading = true;
    // @ts-ignore
    onAuthStateChanged(authInstance, (user: User | null) => {
      console.log(user);
      if (user) {
        this.currentUserEmail = user.email || '';
        this.getUserGroups();
        this.isLoading = false;
      } else {
        console.log("No user logged in");
        this.isLoading = false;
      }
    });
  }

  navigateToCreateGroup(groupId: string) {
    this.router.navigateByUrl('/create-group')
  }

  navigateToGroup(groupId: string) {
    this.router.navigateByUrl('/friend-group/' + groupId).then(() => {
      console.log("NANDENDE E")
    });
  }

  trackByGroupId(index: number, group: any): string {
    return group.id;
  }

  getUserGroups() {
    if (!this.currentUserEmail) return;

    const groupsRef = collection(this.firestore, 'groups');
    const groupsQuery = query(groupsRef);
    this.isLoading = true;
    collectionData(groupsQuery, { idField: 'id' }).subscribe({
      next: data => {
        this.userGroups = data.filter(group =>
          group['members'].some((member: { email: string; }) => member.email === this.currentUserEmail)
        );
        this.isLoading = false;
      },
      error: error => {
        this.isLoading = false;
        console.log('Error fetching groups:', error)
      }
    });
  }

}
