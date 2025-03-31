import { Component } from '@angular/core';
import { KapiHeaderComponent } from "../../kapi/header/kapi.header.component";
import {FirstDailyPromptComponent} from "./prompts/firstDaily/first.daily.prompt.component";
import {SecondDailyPromptComponent} from "./prompts/secondDaily/second.daily.prompt.component";
import {NgIf} from "@angular/common";

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
export class FriendGroupPage {
  actualPrompt: string = "Prendre en photo la vue depuis votre chambre.";
  category: string = "Photographie et dessin";
  categoryId: string = "musique";
  everyoneHasUploaded = false;
}
