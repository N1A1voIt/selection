import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {Observable} from "rxjs";
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import {addIcons} from "ionicons";
import {addCircleOutline, arrowBack} from "ionicons/icons";
export interface Users {
  username:string,
  email:string,
  photo:string,
}
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon]
})
export class CreateGroupPage implements OnInit {
  users:Users[] = [];
  showButtons:boolean = false;
  constructor(private firestore:Firestore) {
    addIcons({
      arrowBack,
      addCircleOutline
    })
  }

  ngOnInit() {
    this.getUsers().subscribe({
      next: data => {
        this.users = <Users[]>data;
        console.log(data);
      },error:error => {
        console.log(error);
      }
    })
  }



  getUsers() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef);
  }
}
