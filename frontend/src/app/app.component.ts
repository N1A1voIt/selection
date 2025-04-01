import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
// import { initializeApp } from 'firebase/app';  // Firebase initialization
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import {environment} from "../environments/environment";
import {NavbarComponent} from "./navbar/navbar.component";
import {NgIf} from "@angular/common";  // Auth imports

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, NavbarComponent, NgIf],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppComponent {

  isAuth: boolean = false;

  constructor(private afAuth: AngularFireAuth, private router: Router) {

    this.router.events.subscribe((event) => {
        this.isAuth = this.router.url !== '/';
    });
    // const firebaseConfig = environment.firebaseConfig;
    // initializeApp(firebaseConfig);
  }

  uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,  // Google sign-in option
    ],
    tosUrl: 'https://www.google.com/intl/en/policies/terms/',
    privacyPolicyUrl: 'https://www.google.com/intl/en/policies/privacy/',
  };

  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    this.handleAuthPopup(provider);
  }

  private handleAuthPopup(provider: GoogleAuthProvider) {
    const auth = getAuth();  // Get Auth instance after initializing the app
    signInWithPopup(auth, provider)  // Perform the popup sign-in
      .then((result) => {
        console.log(result.user);
        return result.user?.getIdToken();
      })
      .then((idToken) => {
        console.log('ID Token:', idToken);
        localStorage.setItem('idToken', JSON.stringify(idToken));  // Store the token
        this.router.navigate(['/main/watchlist']);
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        alert(error.message);
      });
  }
}
