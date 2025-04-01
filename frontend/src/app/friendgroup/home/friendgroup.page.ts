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
import { KapiHeaderComponent } from "../../kapi/header/kapi.header.component";
import {FirstDailyPromptComponent} from "./prompts/firstDaily/first.daily.prompt.component";
import {SecondDailyPromptComponent} from "./prompts/secondDaily/second.daily.prompt.component";
import {NgIf} from "@angular/common";
import {FriendgroupService} from "./friendgroup.service";
import {ThreeService} from "../../services/kapi.service";
import {FireComponent} from "../../fire/fire.component";

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
export class FriendGroupPage implements OnInit {
  actualPrompt: string = "Prendre en photo la vue depuis votre chambre.";
  category: string = "Photographie et dessin";
  categoryId: string = "musique";
  everyoneHasUploaded = false;
  streak: number = 0;

  constructor(private friendGroupService: FriendgroupService) {
  }

  ngOnInit(): void {
    this.streak = this.friendGroupService.streakVerifier();
  }

}
