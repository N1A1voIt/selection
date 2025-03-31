import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-friends',
  templateUrl: './list-friends.page.html',
  styleUrls: ['./list-friends.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonIcon,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
  ],
})
export class ListFriendsPage implements OnInit {
  friends = [
    { name: 'John Doe', description: 'A déjà dessiné avec user1234' },
    { name: 'Jane Smith', description: 'A déjà dessiné avec user5678' },
    { name: 'John Doe', description: 'A déjà dessiné avec user1234' },
    { name: 'Jane Smith', description: 'A déjà dessiné avec user5678' },
    { name: 'John Doe', description: 'A déjà dessiné avec user1234' },
    { name: 'Jane Smith', description: 'A déjà dessiné avec user5678' },
    { name: 'John Doe', description: 'A déjà dessiné avec user1234' },
    { name: 'Jane Smith', description: 'A déjà dessiné avec user5678' },
  ];

  constructor() {}

  ngOnInit() {}
}
