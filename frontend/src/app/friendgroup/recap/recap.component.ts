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
    <div class="w-[250px] h-[350px] relative rounded-lg">
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

      <!-- Previous/Next Navigation Buttons -->
      <div class="absolute inset-0 flex items-center justify-between z-10 pointer-events-none">
<!--        <button-->
<!--          (click)="prevSlide()"-->
<!--          class="ml-2 w-8 h-8 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center pointer-events-auto focus:outline-none"-->
<!--          aria-label="Previous slide"-->
<!--        >-->
<!--          <ion-icon name="chevron-back-outline" class="text-black"></ion-icon>-->
<!--        </button>-->

<!--        <button-->
<!--          (click)="nextSlide()"-->
<!--          class="mr-2 w-8 h-8 rounded-full bg-white bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center pointer-events-auto focus:outline-none"-->
<!--          aria-label="Next slide"-->
<!--        >-->
<!--          <ion-icon name="chevron-forward-outline" class="text-black"></ion-icon>-->
<!--        </button>-->
      </div>

<!--      &lt;!&ndash; Pagination buttons &ndash;&gt;-->
<!--      <div *ngIf="showPagination" class="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">-->
<!--        <button-->
<!--          *ngFor="let image of images; let i = index"-->
<!--          (click)="slideTo(i)"-->
<!--          class="px-2 py-1 text-xs rounded-md transition-colors"-->
<!--          [ngClass]="currentIndex === i ? 'bg-white text-black' : 'bg-black bg-opacity-50 text-white hover:bg-opacity-70'"-->
<!--        >-->
<!--          {{ i + 1 }}-->
<!--        </button>-->
<!--      </div>-->
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
