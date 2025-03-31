import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  ElementRef,
} from '@angular/core';
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.page.html',
  styleUrls: ['./image-editor.page.scss'],
  standalone: true,
  imports: [
    FormsModule

  ]
})
export class ImageEditorPage implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  drawColor = '#000000'; // Default color
  brushSize = 5; // Default brush size

  ngAfterViewInit() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = this.drawColor;
    this.ctx.lineWidth = this.brushSize;
  }

  startDrawing(e: MouseEvent | TouchEvent) {
    this.isDrawing = true;
    const pos = this.getCanvasCoordinates(e);
    [this.lastX, this.lastY] = [pos.x, pos.y];
  }

  draw(e: MouseEvent | TouchEvent) {
    if (!this.isDrawing) return;

    const pos = this.getCanvasCoordinates(e);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.strokeStyle = this.drawColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.stroke();

    [this.lastX, this.lastY] = [pos.x, pos.y];
  }

  private getCanvasCoordinates(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    if (e instanceof TouchEvent) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.offsetX,
        y: e.offsetY
      };
    }
  }

  stopDrawing() {
    this.isDrawing = false;
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvasRef.nativeElement.width,
      this.canvasRef.nativeElement.height);
  }

  saveImage() {
    const dataUrl = this.canvasRef.nativeElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'modified_image.png';
    link.href = dataUrl;
    link.click();
  }

  loadImage(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          this.canvasRef.nativeElement.width = img.width;
          this.canvasRef.nativeElement.height = img.height;
          this.ctx.drawImage(img, 0, 0);
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
}

