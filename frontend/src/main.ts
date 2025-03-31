import {bootstrapApplication, provideClientHydration} from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import {environment} from "./environments/environment";
import {importProvidersFrom} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {FIREBASE_OPTIONS} from "@angular/fire/compat";
import {provideFirebaseApp} from "@angular/fire/app";
import firebase from "firebase/compat";
import initializeApp = firebase.initializeApp;

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    { provide: FIREBASE_OPTIONS, useValue: environment.firebaseConfig },
    importProvidersFrom(IonicModule.forRoot()),
    provideClientHydration(),
    provideRouter(routes),
    provideFirebaseApp(() => {
      console.log("Initializing Firebase...");
      return initializeApp(environment.firebaseConfig);
    }),
  ],
});
