import { Component, OnInit } from '@angular/core';
import {getAuth} from "firebase/auth";
import {signOut} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signout',
  templateUrl: './signout.component.html',
  styleUrls: ['./signout.component.scss'],
})
export class SignoutComponent  implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    this.logout();
  }
  logout() {
    const auth = getAuth();

    signOut(auth)
      .then(() => {
        localStorage.clear();
        this.router.navigate(['/signin']);
      })
      .catch((error) => {
        console.error('Error during logout:', error);
        alert('Error logging out. Please try again.');
      });
  }

}
