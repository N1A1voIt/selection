import { Component, OnInit } from '@angular/core';
import {addIcons} from "ionicons";
import {
  brush,
  brushOutline,
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
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    IonIcon,
    RouterLink
  ]
})
export class NavbarComponent  implements OnInit {

  constructor() {
    addIcons({
      home,
      people,
      person,
      create,
      homeOutline,
      personOutline,
      peopleOutline,
      brushOutline,
      brush
    })
  }

  ngOnInit() {}

}
