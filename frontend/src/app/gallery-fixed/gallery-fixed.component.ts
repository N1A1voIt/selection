import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as THREE from "three";
import {Reflector} from "three-stdlib";
// import * as TWEEN from '@tweenjs/tween.js';
import { Group as TweenGroup, Easing, Tween } from '@tweenjs/tween.js';
import {Observable} from "rxjs";
import {createClient} from "@supabase/supabase-js";
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
  selector: 'app-gallery-fixed',
  standalone: true,
  imports: [],
  templateUrl: './gallery-fixed.component.html',
  styleUrl: './gallery-fixed.component.css'
})
export class GalleryFixedComponent implements OnInit {
  @ViewChild('rendererCanvas', { static: true })
  rendererCanvas!: ElementRef<HTMLCanvasElement>;
  titleOpacity = 1;
  artistOpacity = 1;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private root!: THREE.Object3D;
  private mirror!: Reflector;
  textureLoader = new THREE.TextureLoader();
  private tweenGroup = new TweenGroup();
  private images = ['socrates.jpg', 'stars.jpg', 'wave.jpg', 'spring.jpg', 'mountain.jpg', 'sunday.jpg'];
  private titles = ['Kapic gallery', 'Kapic gallery', 'Kapic gallery',
    'Kapic gallery', 'Kapic gallery', 'Kapic gallery'];
  private artists = ['Kapic Davinci', 'Kapic Dali', 'Kapic Angelo',
    'Kapic Monet', 'Kapic van Gogh', 'Kapicasso'];

  currentTitle = '';
  currentArtist = '';

  constructor(private cd:ChangeDetectorRef) {
  }
  private currentIndex = 0;

  ngOnInit(): void {
    this.loadImages();
  }

  ngOnDestroy(): void {
    this.cleanUp();
  }

  private initThreeJS(): void {
    // Scene setup
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    // this.camera.position.set(0, 2, 5);

    // Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.rendererCanvas.nativeElement,
      antialias: true,
      // alpha:true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 2;
    // this.renderer.setClearColor(0xffffff, 0.01)
    this.root = new THREE.Object3D();
    this.scene.add(this.root);
  }

  private createGallery(): void {
    const leftArrowImage = this.textureLoader.load(`left.png`);
    const rightArrowImage = this.textureLoader.load(`right.png`);
    for (let i = 0; i < 6; i++) {
      const image = this.textureLoader.load(this.images[i]);

      const baseNode = new THREE.Object3D();
      baseNode.rotation.y = 2 * Math.PI * (i / 6);

      const border = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 2.2, 0.005),
        new THREE.MeshStandardMaterial({ color: 0x303030 })
      );
      border.position.z = -4;
      baseNode.add(border);

      const artwork = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 0.01),
        new THREE.MeshStandardMaterial({ map: image })
      );
      artwork.position.z = -4;
      baseNode.add(artwork);

      const leftArrow = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.01),
        new THREE.MeshStandardMaterial({ map: leftArrowImage, transparent: true })
      );
      leftArrow.name = 'left';
      //@ts-ignore
      leftArrow.userData = i;
      leftArrow.position.set(2.9, 0, -4);
      baseNode.add(leftArrow);

      const rightArrow = new THREE.Mesh(
        new THREE.BoxGeometry(0.3, 0.3, 0.01),
        new THREE.MeshStandardMaterial({ map: rightArrowImage, transparent: true })
      );
      rightArrow.name = 'right';
      //@ts-ignore
      rightArrow.userData = i;
      rightArrow.position.set(-2.9, 0, -4);
      baseNode.add(rightArrow);

      this.root.add(baseNode);
    }


    const spotlight = new THREE.SpotLight(0xffffff, 100.0, 10, 0.65, 1);
    spotlight.position.set(0, 5, 0);
    spotlight.target.position.set(0, 1, -5);
    this.scene.add(spotlight);
    this.scene.add(spotlight.target);

    const mirror = new Reflector(
      new THREE.CircleGeometry(40, 64),
      {
        color: 0x505050,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
      }
    );

    mirror.position.set(0, -1.1, 0);
    mirror.rotateX(-Math.PI / 2);
    this.scene.add(mirror);
  }

  private animate(): void {
    requestAnimationFrame((time) => {
      this.animate();
      this.tweenGroup.update(time);
    });
    this.renderer.render(this.scene, this.camera);
  }

  @HostListener('window:wheel', ['$event'])
  onWheelEvent(event: WheelEvent): void {
    this.root.rotation.y += event.deltaY * 0.001;
    event.preventDefault();
  }
  @HostListener('window:resize')
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.mirror) {
      this.mirror.getRenderTarget().setSize(
        window.innerWidth * window.devicePixelRatio,
        window.innerHeight * window.devicePixelRatio
      );
    }
  }

  private rotateGallery(direction: number): void {
    this.currentIndex = (this.currentIndex + direction + 6) % 6;
    const targetRotationY = this.currentIndex * (Math.PI / 3);

    new Tween(this.root.rotation, this.tweenGroup)
      .to({ y: targetRotationY }, 1500)
      .easing(Easing.Quadratic.InOut)
      .onStart(() => {
        console.log("init")
        this.artistOpacity = 0;
        this.titleOpacity = 0;
      })
      .onComplete(() => {
        this.currentArtist = this.artists[this.currentIndex];
        this.currentTitle = this.titles[this.currentIndex];
        this.titleOpacity = 1;
      })
      .start();
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent) {
    const mouse = new THREE.Vector2();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, this.camera);
    const intersects = raycaster.intersectObjects(this.root.children, true);

    if (intersects.length > 0) {
      const clickedObject = intersects[0].object;
      if (clickedObject.name === 'left' || clickedObject.name === 'right') {
        const direction = clickedObject.name === 'left' ? -1 : 1;
        this.rotateGallery(direction);
      }
    }
  }

  private cleanUp(): void {
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer.forceContextLoss();
    }
    if (this.scene) {
      this.scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) {
            object.geometry.dispose();
          }
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(m => {
                if (m.map) m.map.dispose();
                if (m instanceof THREE.Material) m.dispose();
              });
            } else {
              if (object.material.map) object.material.map.dispose();
              object.material.dispose();
            }
          }
        }

        if (object instanceof THREE.Light) {
          if (object.shadow?.map) {
            object.shadow.map.dispose();
          }
        }
      });

      while (this.scene.children.length > 0) {
        const object = this.scene.children[0];
        this.scene.remove(object);
      }
    }

    THREE.Cache.clear();
  }
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  loadImages() {
    this.getImagesUploadedToday().subscribe((imagesData) => {
      this.images = imagesData.map((imageData) => {
        const publicUrl = supabase
          .storage
          .from('photos')
          .getPublicUrl(imageData.name)

        return publicUrl.data.publicUrl;
      });
      this.images = this.shuffleArray(this.images);
      console.log('Images Loaded:', this.images);

      this.initThreeJS();
      this.createGallery();
      this.animate();
      this.currentTitle = this.titles[0];
      this.currentArtist = this.artists[0];
    }, (error) => {
      console.error('Error loading images:', error);
    });
  }
  getImagesUploadedToday(): Observable<any[]> {
    return new Observable((observer) => {
      // List all files in the "photos" bucket
      supabase
        .storage
        .from('photos')  // "photos" is the name of the bucket
        .list('', { limit: 100 })  // Empty string means no specific prefix, so it lists all files
        .then(({ data, error }) => {
          if (error) {
            observer.error(error);
          } else {
            // console.log(data);
            const images = data;
            observer.next(images);
          }
          observer.complete();
        });
    });
  }
}
