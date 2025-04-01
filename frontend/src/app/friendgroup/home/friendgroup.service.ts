import { Injectable } from '@angular/core';
import {collection, Firestore, getDocs, updateDoc} from "@angular/fire/firestore";
import {createClient} from "@supabase/supabase-js";

@Injectable({
  providedIn: 'root'
})
export class FriendgroupService {

  constructor(private firestore: Firestore) { }

  async streakVerifier(groupData: any): Promise<number> {
    const photoRef = collection(this.firestore, 'photos');
    const querySnapshot = await getDocs(photoRef);

    // @ts-ignore
    const matchingDocs = querySnapshot.docs.filter(doc => doc.data().groupId.name === groupData.name);

    let nbIsOkay = 0
    for (const doc of matchingDocs) {
      const photoData = doc.data();
      // @ts-ignore
      if(photoData.isOkay) {
        nbIsOkay++;
      }
    }

    if(nbIsOkay === matchingDocs.length) {
      return 1;
    }
    return 0;
  }


}
