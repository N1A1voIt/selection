import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon, IonToolbar, IonTitle, IonHeader } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-validation',
  templateUrl: './validation.page.html',
  styleUrls: ['./validation.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonIcon]
})
export class ValidationPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
