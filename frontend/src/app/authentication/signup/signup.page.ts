import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {getAuth, GoogleAuthProvider, signInWithPopup,FacebookAuthProvider,TwitterAuthProvider,AuthProvider} from "firebase/auth";
import {Router} from "@angular/router";
import {createUserWithEmailAndPassword, updateProfile} from "@angular/fire/auth";
import {get, getDatabase, set,ref as databaseRef } from "@angular/fire/database";
import { ref } from "@angular/fire/storage";
import {InputDSquareComponent} from "../../shared/input-d-square/input-d-square.component";
import {ioniconContent} from "ionicons/dist/types/components/icon/request";
import {addIcons} from "ionicons";
import {logoFacebook, logoGoogle, logoTwitter} from "ionicons/icons";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonInput, IonButton, InputDSquareComponent, IonIcon, ReactiveFormsModule]
})
export class SignupPage implements OnInit {
  formGroup:FormGroup;
  errorMessage: string = '';

  constructor(private router:Router,fb:FormBuilder) {
    this.formGroup = fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(6)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
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


  signup() {
    const auth = getAuth();
    if (this.formGroup.value.password != this.formGroup.value.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    createUserWithEmailAndPassword(auth, this.formGroup.value.email, this.formGroup.value.password)
      .then((userCredential) => {
        const user = userCredential.user;
        return this.updateUserProfile(user);
      })
      .then((user) => this.checkUsernameAvailability(user))
      .then((user) => this.storeUserData(user))
      .then(() => this.router.navigate(['/main/watchlist']))
      .catch((error) => {
        console.error('Error during signup:', error);
        alert('Error during signup. Please try again.');
      });
  }

  private updateUserProfile(user: any) {
    return updateProfile(user, { displayName: this.formGroup.value.username })
      .then(() => user)
      .catch((error) => {
        console.error('Error updating profile:', error);
        throw error;
      });
  }

  private checkUsernameAvailability(user: any) {
    const db = getDatabase();
    const usernameRef = databaseRef(db, 'usernames/' + this.formGroup.value.username);
    return get(usernameRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          alert('Username is already taken, please choose another.');
          throw new Error('Username taken');
        } else {
          set(usernameRef, user.uid);
          return user;
        }
      })
      .catch((error) => {
        console.error('Error checking username availability:', error);
        throw error;
      });
  }

  private storeUserData(user: any) {
    const db = getDatabase();
    // const usersRef = databaseRef(db, 'users/' + userId);
    return set(databaseRef(db, 'users/' + user.uid), {
      username: this.formGroup.value.username,
      email: this.formGroup.value.email,
    }).catch((error) => {
      console.error('Error storing user data:', error);
      throw error;
    });
  }

}
