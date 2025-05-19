// src/services/animation-manager.ts

import * as THREE from 'three';

/**
 * AnimationManager provides helper methods to play and manage animations
 * on Three.js models using AnimationMixer.
 */

/**
 * Plays a given animation clip on a model and handles end event.
 *
 * @param mixer - The THREE.AnimationMixer instance
 * @param clip - The animation clip to play
 * @param root - The Object3D root of the model
 * @param onEnd - Callback when animation finishes (optional)
 * @returns The AnimationAction object
 */
export function playAnimation(
  mixer: THREE.AnimationMixer,
  clip: THREE.AnimationClip,
  root: THREE.Object3D,
  onEnd?: () => void
): THREE.AnimationAction {
  const action = mixer.clipAction(clip, root);
  action.reset().play();

  // When animation finished, call onEnd if provided
  const handleFinish = () => {
    if (onEnd) onEnd();
    mixer.removeEventListener('finished', handleFinish);
  };
  mixer.addEventListener('finished', handleFinish);

  return action;
}

/**
 * Stops the currently playing action, if any.
 *
 * @param action - The AnimationAction to stop
 */
export function stopAnimation(action?: THREE.AnimationAction) {
  if (action) {
    action.stop();
  }
}
