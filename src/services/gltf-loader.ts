export async function getGLTFLoader() {
  // Dynamic import to reduce bundle size
  const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
  return GLTFLoader;
}
