import { Injectable } from '@angular/core';
import {createClient} from "@supabase/supabase-js";
import {Observable} from "rxjs";
const supabase = createClient('https://raurqxjoiivhjjbhoojn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdXJxeGpvaWl2aGpqYmhvb2puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQzMDEzNSwiZXhwIjoyMDU5MDA2MTM1fQ.5CBJ0_3fOk0Ze06SU5w9-1yVkHQdq8nRzSbNZAhnhU4',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  getTodayDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const day = String(today.getDate()-1).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  getTodaysDateInGMTPlus3(): string {
    const utcDate = new Date();
    const offsetInMillis = 3 * 60 * 60 * 1000; // GMT+3 offset
    utcDate.setTime(utcDate.getTime() + offsetInMillis);

    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0');
    const day = String(utcDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  getYesterdaysDateInGMTPlus3(): string {
    const utcDate = new Date();
    const offsetInMillis = 3 * 60 * 60 * 1000; // GMT+3 offset
    utcDate.setTime(utcDate.getTime() + offsetInMillis);

    // Subtract one day to get yesterday's date
    utcDate.setDate(utcDate.getDate() - 1);

    const year = utcDate.getFullYear();
    const month = String(utcDate.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(utcDate.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
  constructor() { }
  // Function to get images uploaded today
  getImagesUploadedToday(): Observable<any[]> {
    const todayDate = this.getYesterdaysDateInGMTPlus3();
    console.log(todayDate);
    return new Observable((observer) => {
      // List all files in the "photos" bucket
      supabase
        .storage
        .from('photos')  // "photos" is the name of the bucket
        .list('', { limit: 100 })  // Empty string means no specific prefix, so it lists all files
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            console.log(data);
            // Filter the images based on today's date or any other condition
            const images = data.filter((image) => image.created_at.startsWith(todayDate));  // Adjust this based on your metadata
            observer.next(images);
          }
          observer.complete();
        });
    });
  }
}
