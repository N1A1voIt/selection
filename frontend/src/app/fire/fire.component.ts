import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  numberAttribute,
  OnDestroy,
  ViewChild
} from '@angular/core';
import {FireService} from "../services/fire.service";

@Component({
  selector: 'app-fire',
  templateUrl: './fire.component.html',
  styleUrls: ['./fire.component.scss'],
})
export class FireComponent  implements AfterViewInit, OnDestroy {

  @Input() number: number = 0;

  @ViewChild('fire') private canvasRef!: ElementRef;

  // Add input properties
  @Input() modelPath: string = '../../../assets/other/fire.glb';
  @Input({transform: numberAttribute}) width: number = 50;
  @Input({transform: numberAttribute}) height: number = 50;
  @Input() className: string = ''; // Add class input property

  constructor(private threeService: FireService) { }

  public ngAfterViewInit(): void {
    this.threeService.initialize(this.canvasRef, this.modelPath, this.width, this.height);
  }


  public ngOnDestroy(): void {
    // The service implements OnDestroy, but we call dispose explicitly as a safeguard
    this.threeService.dispose();
  }

}
