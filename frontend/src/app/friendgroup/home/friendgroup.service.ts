import { Injectable } from '@angular/core';
import {Firestore} from "@angular/fire/firestore";
import {createClient} from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class FriendgroupService {

  constructor(private firestore: Firestore) { }

  streakVerifier(): number {
    return 2;
  }


}
