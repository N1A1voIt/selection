import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  ElementRef,
} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {IonIcon} from "@ionic/angular/standalone";
import {addIcons} from "ionicons";
import {checkmarkOutline, cloudUploadOutline} from "ionicons/icons";


@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.page.html',
  styleUrls: ['./image-editor.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonIcon

  ]
})
export class ImageEditorPage implements AfterViewInit {
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D | null;
  private isDrawing = false;
  private isPanning = false;
  private startX = 0;
  private startY = 0;
  private translateX = 0;
  private translateY = 0;
  private lastTranslateX = 0;
  private lastTranslateY = 0;
  private image = new Image();
  public drawColor: string = '#000000';
  public brushSize: number = 5;

  constructor() {
    addIcons({
      checkmarkOutline,cloudUploadOutline
    })
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    if (this.ctx) {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Prevent scrolling when touching the canvas
    canvas.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });
  }

  startDrawing(event: MouseEvent | TouchEvent) {
    const touch = event instanceof TouchEvent ? event.touches[0] : event;
    const { offsetX, offsetY } = this.getCoordinates(touch);

    if (event instanceof TouchEvent && event.touches.length > 1) {
      // Multi-touch detected (for panning)
      this.isPanning = true;
      this.startX = offsetX;
      this.startY = offsetY;
      return;
    }

    this.isDrawing = true;
    if (this.ctx) {
      this.ctx.beginPath();
      this.ctx.moveTo(offsetX - this.translateX, offsetY - this.translateY);
      this.ctx.lineWidth = this.brushSize;
      this.ctx.strokeStyle = this.drawColor;
      this.ctx.lineCap = 'round';
    }
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.ctx) return;

    const touch = event instanceof TouchEvent ? event.touches[0] : event;
    const { offsetX, offsetY } = this.getCoordinates(touch);

    if (this.isPanning && event instanceof TouchEvent && event.touches.length > 1) {
      // Move the image
      this.translateX = this.lastTranslateX + (offsetX - this.startX);
      this.translateY = this.lastTranslateY + (offsetY - this.startY);
      this.redrawCanvas();
    } else if (this.isDrawing) {
      // Draw on the canvas
      this.ctx.lineTo(offsetX - this.translateX, offsetY - this.translateY);
      this.ctx.stroke();
    }
  }

  stopDrawing() {
    this.isDrawing = false;
    this.isPanning = false;
    this.lastTranslateX = this.translateX;
    this.lastTranslateY = this.translateY;
    if (this.ctx) this.ctx.closePath();
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    if (this.ctx) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    this.translateX = this.translateY = this.lastTranslateX = this.lastTranslateY = 0;
  }

  saveImage() {
    const canvas = this.canvasRef.nativeElement;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'drawing.png';
    link.click();
  }

  loadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = () => {
        this.image.src = reader.result as string;
        this.image.onload = () => {
          this.translateX = this.translateY = 0;
          this.lastTranslateX = this.lastTranslateY = 0;
          this.redrawCanvas();
        };
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  private redrawCanvas() {
    const canvas = this.canvasRef.nativeElement;
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.ctx.save();
    this.ctx.translate(this.translateX, this.translateY);
    this.ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height);
    this.ctx.restore();
  }

  private getCoordinates(event: MouseEvent | Touch) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    return {
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
    };
  }
}
