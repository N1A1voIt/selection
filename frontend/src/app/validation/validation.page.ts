import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonContent, IonButton, IonIcon, IonToolbar, IonTitle, IonHeader } from '@ionic/angular/standalone';
import { FormsModule } from '@angular/forms';
import {KapiComponent} from "../kapi/kapi.component";
import {Score} from "../interfaces/theme";
import {ActivatedRoute, Router, RouterLink, RouterLinkActive} from "@angular/router";


@Component({
  selector: 'app-validation',
  templateUrl: './validation.page.html',
  styleUrls: ['./validation.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonIcon, IonButton, CommonModule, FormsModule, KapiComponent, RouterLink, RouterLinkActive]
})
export class ValidationPage implements OnInit {
  image: string | undefined;
  score: Score | undefined;
  isImageOkay: boolean = false;

  constructor() { }

  ngOnInit() {
    if (history.state) {
      this.image = history.state.image;
      this.score = history.state.score;
      this.isImageOkay = history.state.isImageOkay;
    }
  }

}
