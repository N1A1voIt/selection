import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-paint',
  templateUrl: './paint.component.html',
  styleUrls: ['./paint.component.scss'],
})
export class PaintComponent {
  @Input() size: string = '24px';
  @Input() color: string = 'currentColor';
}
