import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ThreeService } from '../../services/kapi.service';

@Component({
  selector: 'app-model-viewer',
  templateUrl: './kapi.html',
  styleUrls: ['./kapi.scss']
})
export class ModelViewerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  // Path to your GLB model - update this to your actual path
  private readonly modelPath = '../../../assets/kapi/kapi_shaking.glb';

  constructor(private threeService: ThreeService) {}

  public ngAfterViewInit(): void {
    this.threeService.initialize(this.canvasRef, this.modelPath);
  }

  public ngOnDestroy(): void {
    // The service implements OnDestroy, but we call dispose explicitly as a safeguard
    this.threeService.dispose();
  }
}
