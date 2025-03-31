import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from "ionicons";
import {arrowForwardOutline} from "ionicons/icons";
import {KapiHeaderComponent} from "../kapi/header/kapi.header.component";
import {KapiComponent} from "../kapi/kapi.component";

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonIcon, KapiHeaderComponent, KapiComponent]
})
export class IntroPage implements OnInit {

  constructor() {
    addIcons({
      arrowForwardOutline
    })
  }

  ngOnInit() {
  }

}
