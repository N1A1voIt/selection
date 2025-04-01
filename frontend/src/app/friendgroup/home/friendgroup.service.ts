import { Injectable } from '@angular/core';
import {Firestore} from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class FriendgroupService {

  constructor(private firestore: Firestore) { }

  streakVerifier(): number {
    return 2;
  }


}
