import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {IonContent, IonHeader, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {AppComponent} from "../../app.component";
import {InputDSquareComponent} from "../../shared/input-d-square/input-d-square.component";
import {
  AuthProvider,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  TwitterAuthProvider
} from "firebase/auth";
import {signInWithEmailAndPassword} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {addIcons} from "ionicons";
import {logoFacebook, logoGoogle, logoTwitter} from "ionicons/icons";
import {SignupPage} from "../signup/signup.page";
import {doc, getFirestore, setDoc} from "@angular/fire/firestore";

@Component({
  selector: 'app-signin',
  templateUrl: './signin.page.html',
  styleUrls: ['./signin.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, InputDSquareComponent, IonIcon, ReactiveFormsModule]
})
export class SigninPage implements OnInit {
  formGroup:FormGroup;
  errorMessage: string = '';

  constructor(private router:Router,fb:FormBuilder) {
    this.formGroup = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
    addIcons({
      logoGoogle,logoFacebook,logoTwitter
    })
  }
  ngOnInit() {
  }
  signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    this.handleAuthPopup(provider);
  }
  signInWithFacebook() {
    const provider = new FacebookAuthProvider();
    provider.addScope('email');
    this.handleAuthPopup(provider);
  }
  signInWithTwitter() {
    const provider = new TwitterAuthProvider();
    this.handleAuthPopup(provider);
  }
  private handleAuthPopup(provider: AuthProvider) {
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user);
        return result.user;
      })
      .then(async (user) => {
        await this.storeUserData(user);
        let idToken = await user.getIdToken();
        console.log('ID Token:',idToken);
        localStorage.setItem('idToken', JSON.stringify(idToken));
        this.router.navigate(['/intro']);
      }).catch((error) => {
        console.error('Authentication error:', error);
        alert(error.message);
      });
  }
  private storeUserData(user: any) {
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    return setDoc(userRef, {
      username: user.displayName,
      email: user.email,
    })
      .then(() => console.log("User data stored successfully"))
      .catch((error) => {
        console.error("Error storing user data:", error);
        throw error;
      });
  }
  signIn(){
    const auth = getAuth();
    signInWithEmailAndPassword(auth, this.formGroup.value.email, this.formGroup.value.password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User signed in:', user);
        user.getIdToken().then((idToken) => {
          localStorage.setItem('idToken', JSON.stringify(idToken));
        });
        this.router.navigate(['/intro']);
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
        this.errorMessage = error.message;
      });
  }
}
