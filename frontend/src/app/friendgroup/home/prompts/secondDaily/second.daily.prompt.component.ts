import {Component, Input} from "@angular/core";
import {IonicModule} from "@ionic/angular";
import {NgIf} from "@angular/common";
import {addIcons} from "ionicons";
import {brush} from "ionicons/icons";

@Component({
  selector: 'app-second-daily-prompt',
  templateUrl: './second.daily.prompt.component.html',
  imports: [
    IonicModule,
    NgIf
  ]
})
export class SecondDailyPromptComponent {
  @Input() public actualPrompt: string = 'Dessinez une petite fleur';
  constructor() {
    addIcons({ 'brush': brush });
  }
}
