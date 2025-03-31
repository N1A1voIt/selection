import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import {Observable} from "rxjs";
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.page.html',
  styleUrls: ['./create-group.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class CreateGroupPage implements OnInit {

  constructor(private firestore:Firestore) { }

  ngOnInit() {
    this.getUsers().subscribe({
      next: data => {
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
