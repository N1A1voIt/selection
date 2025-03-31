import { Component, Input } from '@angular/core';
import { KapiComponent } from "../kapi.component";
import { Location, NgTemplateOutlet } from '@angular/common';
import { IonIcon } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { arrowBack } from 'ionicons/icons';

@Component({
  selector: 'app-kapi-header',
  templateUrl: './kapi.header.component.html',
  standalone: true, // Make sure this is added if you're using standalone components
  imports: [
    KapiComponent,
    NgTemplateOutlet,
    IonIcon,
  ],
  styleUrls: ['./kapi.header.component.scss'],
})
export class KapiHeaderComponent {
  @Input() headerContent: any; // Add headerContent input for passing child elements

  constructor(private location: Location) {
    // Register the arrow-back icon
    addIcons({ 'arrow-back': arrowBack });
  }

  goBack(): void {
    this.location.back(); // Navigates to the previous page
  }
}
