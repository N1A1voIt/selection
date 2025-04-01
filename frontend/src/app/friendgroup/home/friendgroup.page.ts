import {Component, OnInit} from '@angular/core';
import { KapiHeaderComponent } from "../../kapi/header/kapi.header.component";
import {FirstDailyPromptComponent} from "./prompts/firstDaily/first.daily.prompt.component";
import {SecondDailyPromptComponent} from "./prompts/secondDaily/second.daily.prompt.component";
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {GroupService} from "../../services/group.service";
import {ActivatedRoute} from "@angular/router";
import {doc, docData, Firestore} from "@angular/fire/firestore";

@Component({
  selector: 'app-friend-group',
  templateUrl: './friendgroup.page.html',
  imports: [
    KapiHeaderComponent,
    FirstDailyPromptComponent,
    SecondDailyPromptComponent,
    NgIf,
  ],
  styleUrls: ['./friendgroup.page.scss'],
  standalone: true,
})
export class FriendGroupPage  implements OnInit {
  groupId: string = '';
  groupData: any;
  constructor(private groupService: GroupService,private route: ActivatedRoute, private firestore: Firestore) { }

  getGroupDetails() {
    const groupRef = doc(this.firestore, `groups/${this.groupId}`);
    docData(groupRef).subscribe(data => {
      this.groupData = data;
    });
  }

  ngOnInit(){
    console.log("belloooo");
    this.groupId = this.route.snapshot.paramMap.get('id')!;
    this.getGroupDetails();
    this.groupService.getPrompt().subscribe({
      next:data =>{
        this.actualPrompt = data.detail;
        localStorage.setItem('prompt', JSON.stringify(this.actualPrompt));
        this.category = data.theme;
      }
    });

    this.groupService.getModifPrompt(this.actualPrompt).subscribe({
      next:data =>{
        this.secondPrompt = data.theme +" "+data.detail;
      }
    });
  }
  actualPrompt: string = "Prendre en photo la vue depuis votre chambre.";
  secondPrompt: string = "Dessinez un arbre.";
  category: string = "Photographie et dessin";
  categoryId: string = "musique";
  everyoneHasUploaded = false;
}
