import {Component, ElementRef, OnDestroy, ViewChild, AfterViewInit, Input, numberAttribute} from '@angular/core';
import { ThreeService } from '../services/kapi.service';

@Component({
  selector: 'app-kapi',
  templateUrl: './kapi.component.html',
  styleUrls: ['./kapi.component.scss']
})
export class KapiComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  // Add input properties
  @Input() modelPath: string = '../../../assets/kapi/kapi_idle.glb';
  @Input({transform: numberAttribute}) width: number = 150;
  @Input({transform: numberAttribute}) height: number = 150;
  @Input() className: string = ''; // Add class input property

  constructor(private threeService: ThreeService) {}

  public ngAfterViewInit(): void {
    this.threeService.initialize(this.canvasRef, this.modelPath, this.width, this.height);
  }

  public ngOnDestroy(): void {
    // The service implements OnDestroy, but we call dispose explicitly as a safeguard
    this.threeService.dispose();
  }
}
