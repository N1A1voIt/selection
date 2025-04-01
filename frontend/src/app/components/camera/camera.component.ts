import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-camera',
  templateUrl: './camera.component.html',
  styleUrls: ['./camera.component.scss'],
})
export class CameraComponent {
  @Input() size: string = '24px';
  @Input() color: string = 'currentColor';
}
