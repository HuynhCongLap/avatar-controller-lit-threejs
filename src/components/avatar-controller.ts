import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import * as THREE from 'three';
import { getGLTFLoader } from '../services/gltf-loader';
// Import animation manager service
import { playAnimation, stopAnimation } from '../services/animation-manager';

/**
 * AvatarController Web Component
 *
 * Displays a 3D avatar loaded from a GLB file with animation controls.
 *
 * @fires animation-start - Fired when an animation starts. Detail: { index: number }
 * @fires animation-end - Fired when an animation ends. Detail: { index: number }
 *
 * @property {string} glbUrl - The URL to the GLB file to load.
 * @property {number} width - The width of the canvas in pixels.
 * @property {number} height - The height of the canvas in pixels.
 */
@customElement('avatar-controller')
export class AvatarController extends LitElement {
  @property({ type: String }) glbUrl: string = '';
  @property({ type: Number }) width = 400;
  @property({ type: Number }) height = 400;

  private renderer?: THREE.WebGLRenderer;
  private scene?: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private animationId?: number;

  private mixer?: THREE.AnimationMixer;
  private animations: THREE.AnimationClip[] = [];
  private currentAction?: THREE.AnimationAction;
  private loadedModel?: THREE.Object3D;
  private playingIndex: number | null = null;
  private clock = new THREE.Clock();

  static styles = css`
    :host {
      display: block;
      width: 100%;
      min-height: 400px;
    }
    #container canvas {
      display: block;
      width: 100% !important;
      height: 100% !important;
      border-radius: 16px;
      background: #222;
    }
    #controls {
      margin-top: 1.5em;
      text-align: center;
    }
    button {
      margin: 0 0.5em;
      padding: 0.5em 1.5em;
      border-radius: 0.5em;
      border: none;
      background: #339;
      color: white;
      font-size: 1em;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    button[disabled] {
      opacity: 0.6;
      cursor: not-allowed;
      background: #aaa;
    }
  `;

  render() {
    return html`
      <div id="container"></div>
      <div id="controls">
        ${this.animations.slice(0, 5).map((clip, i) => html`
          <button
            @click=${() => this.playAnimation(i)}
            ?disabled=${this.playingIndex === i}
          >
            ${clip.name || `Animation ${i+1}`}
          </button>
        `)}
      </div>
    `;
  }

  firstUpdated() {
    this.setupThree();
  }

  updated(changed: Map<string, any>) {
    if (changed.has('width') || changed.has('height')) {
      this.resizeRenderer();
    }
    if (changed.has('glbUrl')) {
      this.resetScene();
      this.setupThree();
    }
  }

  resetScene() {
    if (this.scene) {
      while(this.scene.children.length > 0) {
        this.scene.remove(this.scene.children[0]);
      }
    }
    const container = this.renderRoot.querySelector('#container') as HTMLDivElement;
    if (container && this.renderer) {
      container.innerHTML = '';
      this.renderer.dispose();
      this.renderer = undefined;
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = undefined;
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.animationId) cancelAnimationFrame(this.animationId);
    this.renderer?.dispose();
  }

  async setupThree() {
    const container = this.renderRoot.querySelector('#container') as HTMLDivElement;
    if (!container) return;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x222222);

    this.camera = new THREE.PerspectiveCamera(50, this.width / this.height, 0.1, 1000);
    this.camera.position.set(0, 1, 3);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(this.width, this.height);
    container.appendChild(this.renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 4);
    this.scene.add(light);

    if (this.glbUrl) {
      const GLTFLoader = await getGLTFLoader();
      const loader = new GLTFLoader();
      loader.load(
        this.glbUrl,
        (gltf: any) => {
          if (this.loadedModel && this.scene) {
            this.scene.remove(this.loadedModel);
          }
          this.loadedModel = gltf.scene;
          if (this.loadedModel) {
              this.scene!.add(this.loadedModel);
            }

          this.animations = gltf.animations || [];
          if (this.animations.length > 0) {
            this.mixer = new THREE.AnimationMixer(gltf.scene);
          }
          this.requestUpdate();
        },
        undefined,
        (error: any) => {
          console.error('Failed to load GLB', error);
          this.scene!.add(this.getFallbackMesh());
        }
      );
    } else {
      this.scene.add(this.getFallbackMesh());
    }

    const animate = () => {
      const delta = this.clock.getDelta();
      if (this.mixer) {
        this.mixer.update(delta);
      }
      this.renderer?.render(this.scene!, this.camera!);
      this.animationId = requestAnimationFrame(animate);
    };
    animate();
  }

  // Using animation-manager service
  playAnimation(index: number) {
    if (!this.mixer || !this.animations[index] || !this.loadedModel) return;

    // Stop current action if any (using service)
    stopAnimation(this.currentAction);

    // Play new animation (using service)
    this.currentAction = playAnimation(
      this.mixer,
      this.animations[index],
      this.loadedModel,
      () => {
        // Callback when animation ends
        this.playingIndex = null;
        this.requestUpdate();
        this.dispatchEvent(new CustomEvent('animation-end', { detail: { index } }));
      }
    );
    this.playingIndex = index;

    // Dispatch event when animation starts
    this.dispatchEvent(new CustomEvent('animation-start', { detail: { index } }));

    this.requestUpdate();
  }

  getFallbackMesh() {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({ color: 0x55aaff });
    return new THREE.Mesh(geo, mat);
  }

  resizeRenderer() {
    if (this.renderer && this.camera) {
      this.renderer.setSize(this.width, this.height);
      this.camera.aspect = this.width / this.height;
      this.camera.updateProjectionMatrix();
    }
  }
}
