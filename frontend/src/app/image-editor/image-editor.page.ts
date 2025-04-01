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
import {createClient} from "@supabase/supabase-js";
import {GroupService} from "../services/group.service";
import {ActivatedRoute, Router} from "@angular/router";
import {NgStyle} from "@angular/common";
import {KapiComponent} from "../kapi/kapi.component";
import {collection, collectionData, Firestore, getDocs, query, where} from "@angular/fire/firestore";
import firebase from "firebase/compat";
import CollectionReference = firebase.firestore.CollectionReference;
import {map, Observable} from "rxjs";
import {DocumentData} from "@angular/fire/compat/firestore";

const supabase = createClient('https://raurqxjoiivhjjbhoojn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdXJxeGpvaWl2aGpqYmhvb2puIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MzQzMDEzNSwiZXhwIjoyMDU5MDA2MTM1fQ.5CBJ0_3fOk0Ze06SU5w9-1yVkHQdq8nRzSbNZAhnhU4',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);
@Component({
  selector: 'app-image-editor',
  templateUrl: './image-editor.page.html',
  styleUrls: ['./image-editor.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonIcon,
    NgStyle,
    KapiComponent

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
  public prompt: string = localStorage.getItem("secondPrompt") ?? "Placeholder prompt";
  private imgName: string | null = null;
  private collectionRef: CollectionReference;
  public photoInfo: any | null = null;

  constructor(private groupService: GroupService, private router: Router, private route: ActivatedRoute, private firestore: Firestore) {
    addIcons({ checkmarkOutline, cloudUploadOutline });
    // @ts-ignore
    this.collectionRef = collection(this.firestore, 'photos');
  }

  findFirstByFileName(fileName: string): Observable<DocumentData | null> {
    const q = query(this.collectionRef, where('supabaseUrl', '==', fileName));
    return collectionData(q, { idField: 'id' }).pipe(
      map(results => (results.length > 0 ? results[0] : null))
    );
  }

  // async findFirstByFileName(fileName: string) {
  //   const q = query(this.collectionRef, where('fileName', '==', fileName));
  //   const querySnapshot = await getDocs(q);
  //
  //   if (!querySnapshot.empty) {
  //     return querySnapshot.docs[0].data(); // Returns the first matching document's data
  //   } else {
  //     return null; // No match found
  //   }
  // }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');

    if (this.ctx) {
      this.ctx.fillStyle = 'white';
      this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Prevent scrolling when touching the canvas
    canvas.addEventListener('touchmove', (event) => event.preventDefault(), { passive: false });

    // Load the image from the query parameter
    this.route.queryParams.subscribe((params: { [x: string]: any; }) => {
      const imageUrl = params['imageUrl'];
      if (imageUrl) {
        this.loadImageFromUrl(imageUrl);
      }
    });
  }

  loadImageFromUrl(imageUrl: string): void {
    this.imgName = imageUrl.split('photos/')[1];
    console.log(this.imgName);
    this.image.crossOrigin = 'Anonymous'; // Set crossOrigin attribute
    this.image.src = imageUrl;
    this.findFirstByFileName(this.imgName).subscribe(result => {
      this.photoInfo = result;
      console.log(this.photoInfo);
    });
    this.image.onload = () => {
      this.redrawCanvas();
    };
    this.image.onerror = () => {
      console.error('Failed to load image with CORS enabled.');
    };
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
    const fileName = `photo-${Date.now()}.jpg`;
    const canvas = this.canvasRef.nativeElement;
    canvas.toBlob(async (blob) => {
      let imageOk = false;
      if (blob) {
        const fileBlob = blob;

        const formData = new FormData();
        const fileName = `drawing-${Date.now()}.png`;
        formData.append('image', fileBlob, fileName);
        formData.append('prompt', this.prompt);

        console.log(formData);
        this.groupService.validateImage(formData).subscribe({
          next: async (result) => {
            console.log('Result from validateImage:', result);

            if (result.similarity_score > 0.2) {
              imageOk = true;
              try {
                const { data, error } = await supabase
                  .storage
                  .from('photos')
                  .upload(fileName, fileBlob, {
                    cacheControl: '3600',
                    upsert: true,
                  });

                if (error) {
                  console.error('Error uploading file:', error.message);
                } else {
                  console.log('File uploaded successfully:', data);
                }
              } catch (err) {
                console.error('Error during upload:', err);
              }
            } else {
              console.error("Not valid picture");
            }
            await this.router.navigate(['/validation'], {
              state: {
                image: URL.createObjectURL(blob),
                score: result,
                isImageOkay: imageOk,
              },
            });
          }
        });
      }
    }, 'image/png');

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
