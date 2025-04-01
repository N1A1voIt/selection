import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  numberAttribute,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {Component, OnInit} from '@angular/core';
import { KapiHeaderComponent } from "../../kapi/header/kapi.header.component";
import {FirstDailyPromptComponent} from "./prompts/firstDaily/first.daily.prompt.component";
import {SecondDailyPromptComponent} from "./prompts/secondDaily/second.daily.prompt.component";
import {NgIf} from "@angular/common";
import {FriendgroupService} from "./friendgroup.service";
import {FireComponent} from "../../fire/fire.component";
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
    FireComponent,
  ],
  styleUrls: ['./friendgroup.page.scss'],
  standalone: true,
})

export class FriendGroupPage  implements OnInit {
  groupId: string = '';
  groupData: any;
  streak: number = 0;
  
  constructor(private groupService: GroupService,private route: ActivatedRoute, private firestore: Firestore, private friendGroupService: FriendgroupService) { }

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
        this.category = data.theme;
      }
    });

    this.groupService.getModifPrompt(this.actualPrompt).subscribe({
      next:data =>{
        this.secondPrompt = data.theme +" "+data.detail;
      }
    });
    this.streak = this.friendGroupService.streakVerifier();
  }

}
