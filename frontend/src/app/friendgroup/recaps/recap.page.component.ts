import { Component } from '@angular/core';
import {RecapComponent} from "../recap/recap.component";
import {KapiHeaderComponent} from "../../kapi/header/kapi.header.component";

@Component({
  selector: 'app-recap-page',
  templateUrl: './recap.page.component.html',
  styleUrls: ['./recap.page.component.scss'],
  imports: [
    RecapComponent,
    KapiHeaderComponent
  ]
})
export class RecapPageComponent {

  images = [
    {
      url: 'https://picsum.photos/id/1018/800/600',
      alt: 'Mountain landscape',
      caption: 'Beautiful mountain view'
    },
    {
      url: 'https://picsum.photos/id/1015/800/600',
      alt: 'River through mountains',
      caption: 'Serene river landscape'
    },
    {
      url: 'https://picsum.photos/id/1019/800/600',
      alt: 'Forest landscape',
      caption: 'Lush green forest'
    },
    {
      url: 'https://picsum.photos/id/1039/800/600',
      alt: 'Lake view',
      caption: 'Tranquil lake at sunset'
    }
  ];

}
