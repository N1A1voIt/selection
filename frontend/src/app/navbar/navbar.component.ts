import { Component, OnInit } from '@angular/core';
import {addIcons} from "ionicons";
import {
  create,
  createOutline,
  home,
  homeOutline,
  logoFacebook,
  logoGoogle,
  logoTwitter, people,
  peopleOutline, person,
  personOutline
} from "ionicons/icons";
import {IonIcon} from "@ionic/angular/standalone";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    IonIcon
  ]
})
export class NavbarComponent  implements OnInit {

  constructor() {
    addIcons({
      home,
      people,
      person,
      create
    })
  }

  ngOnInit() {}

}
