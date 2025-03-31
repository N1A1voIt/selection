import {Component, OnInit} from '@angular/core';
import { KapiHeaderComponent } from "../../kapi/header/kapi.header.component";
import {FirstDailyPromptComponent} from "./prompts/firstDaily/first.daily.prompt.component";
import {SecondDailyPromptComponent} from "./prompts/secondDaily/second.daily.prompt.component";
import {NgIf} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {GroupService} from "../../services/group.service";

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

  constructor(private groupService: GroupService) { }
  ngOnInit(){
    console.log("belloooo");
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
  }
  actualPrompt: string = "Prendre en photo la vue depuis votre chambre.";
  secondPrompt: string = "Dessinez un arbre.";
  category: string = "Photographie et dessin";
  categoryId: string = "musique";
  everyoneHasUploaded = false;
}
