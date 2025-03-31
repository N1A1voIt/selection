// image-slider.component.ts
import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicSlides } from '@ionic/angular';
import Swiper from 'swiper';

@Component({
  selector: 'app-recap',
  standalone: true,
  imports: [CommonModule, IonicModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="w-[250px] h-[350px] rounded-lg">
      <swiper-container
        #swiperContainer
        class="w-full h-full"
        effect="cards"
        grabCursor="true"
      >
        <swiper-slide *ngFor="let image of images; let i = index" class="rounded-lg">
          <div class="w-full h-full flex items-center justify-center ">
            <img
              [src]="image.url"
              class="w-full h-full object-cover"
            />
          </div>
        </swiper-slide>
      </swiper-container>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
  `]
})
export class RecapComponent implements AfterViewInit {
  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  @Input() showPagination: boolean = true;
  @Input() showCaption: boolean = true;
  @Input() images: Array<{url: string, alt?: string, caption?: string}> = [];

  currentIndex: number = 0;
  private swiper?: Swiper;

  constructor() {}

  ngAfterViewInit() {
    // Register Ionic Swiper components
    const swiperEl = this.swiperContainer.nativeElement;

    // Register the Ionic Swiper bundle
    swiperEl.addEventListener('swiper', (event: any) => {
      this.swiper = event.detail[0];

      this.swiper?.on('slideChange', () => {
        this.currentIndex = this.swiper?.activeIndex || 0;
      });
    });

    // Initialize Swiper with IonicSlides module
    Object.assign(swiperEl, { modules: [IonicSlides] });
  }

  slideTo(index: number) {
    this.swiper?.slideTo(index);
  }

  prevSlide() {
    this.swiper?.slidePrev();
  }

  nextSlide() {
    this.swiper?.slideNext();
  }
}
