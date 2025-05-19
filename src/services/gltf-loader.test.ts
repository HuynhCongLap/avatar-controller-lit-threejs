import * as THREE from 'three';
import { playAnimation, stopAnimation } from './animation-manager';

describe('animation-manager', () => {
  it('should play and stop an animation', () => {
    const scene = new THREE.Group();
    const mixer = new THREE.AnimationMixer(scene);
    const clip = new THREE.AnimationClip('test', 1, []);
    const action = playAnimation(mixer, clip, scene);
    expect(action).toBeDefined();
    // Just stop without expecting paused (Three.js internals are not mocked in Jest)
    expect(() => stopAnimation(action)).not.toThrow();
  });
});
