import {Component, OnInit} from '@angular/core';
import {RecapComponent} from "../recap/recap.component";
import {KapiHeaderComponent} from "../../kapi/header/kapi.header.component";
import {Router} from "@angular/router";
import {SupabaseService} from "../../services/supabase.service";
import {createClient} from "@supabase/supabase-js";
const supabase = createClient('https://raurqxjoiivhjjbhoojn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdXJxeGpvaWl2aGpqYmhvb2puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQzMDEzNSwiZXhwIjoyMDU5MDA2MTM1fQ.5CBJ0_3fOk0Ze06SU5w9-1yVkHQdq8nRzSbNZAhnhU4',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
@Component({
  selector: 'app-recap-page',
  templateUrl: './recap.page.component.html',
  styleUrls: ['./recap.page.component.scss'],
  imports: [
    RecapComponent,
    KapiHeaderComponent
  ]
})
export class RecapPageComponent implements OnInit {

  constructor(private supabase: SupabaseService) { }

  images: { alt: string; url: any }[] = [
    {
      url: '',
      alt: 'Mountain landscape'
    },
    {
      url: '',
      alt: 'River through mountains'
    },
    {
      url: '',
      alt: 'Forest landscape'
    },
    {
      url: '',
      alt: 'Lake view'
    }
  ];

  ngOnInit(): void {
    this.loadImages();
  }
  loadImages():  void {
    this.supabase.getImagesUploadedToday().subscribe((imagesData) => {
      console.log("From supabase",imagesData)
      this.images = imagesData.map((imageData) => {
        const publicUrl = supabase
          .storage
          .from('edits')
          .getPublicUrl(imageData.name)
        console.log('publicUrl ::: ', publicUrl);
        return {
          url: publicUrl.data.publicUrl,
          alt: 'Uploaded Image',
        };
      });

      console.log('Images Loaded:', this.images);
    }, (error) => {
      console.error('Error loading images:', error);
    });
  }


}
