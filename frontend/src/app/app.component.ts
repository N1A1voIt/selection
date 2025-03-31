import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import {firebase} from "firebaseui-angular";
import {AngularFireAuth} from "@angular/fire/compat/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(private afAuth: AngularFireAuth,private router: Router,) {}
  uiConfig = {
    signInSuccessUrl: '/',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
    tosUrl: 'https://www.google.com/intl/en/policies/terms/',
    privacyPolicyUrl: 'https://www.google.com/intl/en/policies/privacy/',
  };

  signInWithGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('email');
    this.handleAuthPopup(provider);
  }
  // @ts-ignore
  private handleAuthPopup(provider: firebase.auth.AuthProvider) {
    this.afAuth.signInWithPopup(provider)
      .then((result) => {
        console.log(result.user);
        return result.user?.getIdToken();
      })
      .then((idToken) => {
        console.log('ID Token:', idToken);

        localStorage.setItem('idToken', JSON.stringify(idToken));
        this.router.navigate(['/main/watchlist']);
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        alert(error.message);
      });
  }
}
