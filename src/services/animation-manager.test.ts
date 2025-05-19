import * as THREE from 'three';
import { playAnimation, stopAnimation } from './animation-manager';

describe('animation-manager', () => {
  it('should play and stop an animation without throwing', () => {
    const scene = new THREE.Group();
    const mixer = new THREE.AnimationMixer(scene);
    const clip = new THREE.AnimationClip('test', 1, []);
    const action = playAnimation(mixer, clip, scene);

    expect(action).toBeDefined();
    // Only check that stopAnimation does not throw an error, do not check .paused
    expect(() => stopAnimation(action)).not.toThrow();
  });
});
