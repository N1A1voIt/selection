import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {Observable} from "rxjs";
import {Firestore, collection, collectionData, addDoc} from '@angular/fire/firestore';
import {addIcons} from "ionicons";
import {addCircleOutline, arrowBack} from "ionicons/icons";
import {query} from "@angular/animations";
import {GroupService} from "../../services/group.service";
import {Router} from "@angular/router";
import {SpinnerComponent} from "../../shared/spinner/spinner.component";
export interface Users {
  username:string,
  email:string,
  photo:string,
  selected?:boolean,
}
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, SpinnerComponent]
})
export class CreateGroupPage implements OnInit {
  users:Users[] = [];
  showButtons:boolean = false;
  filteredUsers: Users[] = [];
  searchQuery: string = '';
  isLoading:boolean = false;
  filterUsers() {
    const query = this.searchQuery.toLowerCase().trim();

    if (!query) {
      this.filteredUsers = [...this.users]; // Reset if input is empty
      return;
    }

    this.filteredUsers = this.users.filter(user =>
        user.username.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
    );
  }

  constructor(private firestore:Firestore,private groupService: GroupService,private router:Router) {
    addIcons({
      arrowBack,
      addCircleOutline
    })
  }
  toggleSelection(user: any) {
    if (this.showButtons) {
      console.log("Bebna boy")
      user.selected = !user.selected;
    }
  }


  ngOnInit() {
    this.isLoading = true;
    this.getUsers().subscribe({
      next: data => {
        this.users = <Users[]>data;
        this.filteredUsers = this.users;
        console.log(data);
        this.isLoading = false;
      },error:error => {
        console.log(error);
        this.isLoading = false;
      }
    })
  }




  getUsers() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef);
  }

  async getGroupPrompt(): Promise<string> {
    return new Promise((resolve, reject) => {
      this.groupService.getPrompt().subscribe({
        next: (data) => {
          localStorage.setItem('prompt', JSON.stringify(data.detail));
          resolve(data.detail); // Resolve the promise with the updated prompt
        },
        error: (err) => {
          reject(err); // Reject the promise in case of error
        }
      });
    });
  }


  groupName: string = '';

  async createGroup() {
    if (!this.groupName.trim()) {
      alert("Group name cannot be empty!");
      return;
    }

    const selectedUsers = this.users.filter(user => user.selected);
    if (selectedUsers.length === 0) {
      alert("Select at least one member for the group!");
      return;
    }

    const groupData = {
      name: this.groupName,
      members: selectedUsers.map(user => ({ username: user.username, email: user.email, photo: "" })),
      prompt: await this.getGroupPrompt(),
      createdAt: new Date().toISOString(),
    };

    try {
      console.log(groupData)
      const groupRef = collection(this.firestore, 'groups');
      await addDoc(groupRef, groupData);

      this.groupName = '';
      this.showButtons = false;
      this.users.forEach(user => user.selected = false);
      this.router.navigate(['/list-group']);
    } catch (error) {
      console.error("Error creating group: ", error);
      alert("Failed to create group. Please try again.");
    }
  }
}
