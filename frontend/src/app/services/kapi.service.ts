import { Injectable, ElementRef, NgZone, OnDestroy } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

@Injectable({
  providedIn: 'root'
})
export class ThreeService implements OnDestroy {
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;
  private animationMixer!: THREE.AnimationMixer;
  private clock: THREE.Clock = new THREE.Clock();
  private frameId: number | null = null;
  private resizeListener: (() => void) | null = null;
  private width: number = 150;
  private height: number = 150;

  constructor(private ngZone: NgZone) {}

  public initialize(canvas: ElementRef<HTMLCanvasElement>, modelPath: string, width: number = 150, height: number = 150): void {
    this.width = width;
    this.height = height;
    this.setupScene();
    this.setupCamera();
    this.setupRenderer(canvas);
    this.setupLights();
    this.setupControls();
    this.loadModel(modelPath);
    this.setupResizeListener();
  }

  private setupScene(): void {
    this.scene = new THREE.Scene();
    // Remove the background color to make it transparent
  }

  private setupCamera(): void {
    this.camera = new THREE.PerspectiveCamera(
      35,
      this.width / this.height,
      0.1,
      1000
    );
    this.camera.position.set(0, 5, 10);
  }

  private setupRenderer(canvas: ElementRef<HTMLCanvasElement>): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: canvas.nativeElement,
      antialias: true,
      alpha: true // Enable transparency
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setClearColor(0x000000, 0); // Set clear color with 0 alpha (fully transparent)
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.5);
    directionalLight.position.set(0, 10, 17.5);
    directionalLight.castShadow = true;
    this.scene.add(directionalLight);
  }

  private setupControls(): void {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
  }

  private loadModel(modelPath: string): void {
    const loader = new GLTFLoader();

    loader.load(
      modelPath,
      (gltf: any) => this.onModelLoaded(gltf),
      (progress: any) => this.onLoadProgress(progress),
      (error: any) => this.onLoadError(error)
    );
  }

  private onModelLoaded(gltf: any): void {
    const model = gltf.scene;

    // Center the model
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    this.scene.add(model);

    // Setup animation mixer
    this.animationMixer = new THREE.AnimationMixer(model);

    // Get animations from the GLB
    const animations = gltf.animations;
    if (animations && animations.length > 0) {
      // Play only the first animation in a loop
      const firstAnimation = animations[0];
      const action = this.animationMixer.clipAction(firstAnimation);
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.play();

      console.log(`Playing animation: ${firstAnimation.name}`);
    } else {
      console.warn('No animations found in the GLB file');
    }

    // Start the animation loop outside Angular's zone
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private onLoadProgress(progress: any): void {
    const percentComplete = (progress.loaded / progress.total) * 100;
    console.log(`Model loading: ${Math.round(percentComplete)}% complete`);
  }

  private onLoadError(error: any): void {
    console.error('Error loading GLB model:', error);
  }

  private animate(): void {
    this.frameId = requestAnimationFrame(() => this.animate());

    // Update the animation mixer with the delta time
    if (this.animationMixer) {
      const delta = this.clock.getDelta();
      this.animationMixer.update(delta);
    }

    this.renderer.render(this.scene, this.camera);
  }

  private setupResizeListener(): void {
    this.resizeListener = () => this.onWindowResize();
    window.addEventListener('resize', this.resizeListener);
  }

  private onWindowResize(): void {
    if (!this.camera || !this.renderer) return;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  public ngOnDestroy(): void {
    this.dispose();
  }

  public dispose(): void {
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }

    if (this.resizeListener) {
      window.removeEventListener('resize', this.resizeListener);
      this.resizeListener = null;
    }

    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
