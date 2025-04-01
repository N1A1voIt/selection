import { Component, OnInit } from '@angular/core';
import {addIcons} from "ionicons";
import {
  brush,
  brushOutline,
  create,
  createOutline, gridOutline,
  home,
  homeOutline,
  logoFacebook,
  logoGoogle,
  logoTwitter, people,
  peopleOutline, person, personAdd,
  personOutline
} from "ionicons/icons";
import {IonIcon} from "@ionic/angular/standalone";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {NgClass} from "@angular/common";
import { HomeComponent } from "../components/home/home.component";
import { UserComponent } from "../components/user/user.component";
import { UsersComponent } from "../components/users/users.component";
import { MenuBurgerComponent } from "../components/menu-burger/menu-burger.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [
    IonIcon,
    RouterLink,
    RouterLinkActive,
    NgClass,
    HomeComponent,
    UserComponent,
    UsersComponent,
    MenuBurgerComponent
]
})
export class NavbarComponent {

  constructor(public router: Router) {
    addIcons({
      home,
      people,
      person,
      create,
      homeOutline,
      personOutline,
      peopleOutline,
      brushOutline,
      brush,
      personAdd,
      gridOutline
    })
  }

}
