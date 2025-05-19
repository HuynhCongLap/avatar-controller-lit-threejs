import '../components/avatar-controller'; // Import the main component

export default {
  title: 'AvatarController',
  component: 'avatar-controller',
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# AvatarController

A Web Component for displaying and controlling 3D avatars with animation, powered by Three.js and Lit.

---

## Props

| Name    | Type    | Description                             |
|---------|---------|-----------------------------------------|
| glbUrl  | string  | URL of the GLB file to load (required)  |
| width   | number  | Width of the canvas (pixels, default: 400)  |
| height  | number  | Height of the canvas (pixels, default: 400) |

---

## Custom Events

- \`animation-start\` — Fired when an animation starts.  
  **detail:** \`{ index: number }\` (the animation index)
- \`animation-end\` — Fired when an animation ends.  
  **detail:** \`{ index: number }\` (the animation index)

**Usage example:**

\`\`\`js
const avatar = document.querySelector('avatar-controller');
avatar.addEventListener('animation-start', (e) => {
  console.log('Animation started:', e.detail.index);
});
avatar.addEventListener('animation-end', (e) => {
  console.log('Animation ended:', e.detail.index);
});
\`\`\`

---
        `,
      },
    },
  },
  argTypes: {
    width: { control: { type: 'number', min: 200, max: 800 }, description: "Width of the canvas (px)" },
    height: { control: { type: 'number', min: 200, max: 800 }, description: "Height of the canvas (px)" },
    glbUrl: { control: 'text', description: "URL to the GLB file (should be in /public/)" },
  },
};

/////////////////////////////
// 1. "Default" Story //
/////////////////////////////

/**
 * Default story – shows a sample avatar with fixed props, no controls.
 */
export const Default = {
  render: () => {
    const el = document.createElement('avatar-controller') as any;
    el.glbUrl = '/Manequin.glb'; // The GLB file should be placed in public/Manequin.glb
    el.width = 400;
    el.height = 400;
    return el;
  },
  parameters: {
    controls: { hideNoControlsWarning: true, disabled: true }, // Hide controls panel for Default
    docs: {
      description: {
        story: 'Default story with a sample avatar (fixed props, no controls panel).',
      },
    },
  },
};

/////////////////////////////
// 2. "Controls" Story //
/////////////////////////////

/**
 * Controls story – enables interactive props for URL and size.
 */
export const Controls = {
  args: {
    width: 400,
    height: 400,
    glbUrl: '/Manequin.glb', // The GLB file should be placed in public/Manequin.glb
  },
  render: (args: { glbUrl: string; width: number; height: number }) => {
    const el = document.createElement('avatar-controller') as any;
    el.glbUrl = args.glbUrl;
    el.width = args.width;
    el.height = args.height;
    return el;
  },
  parameters: {
    docs: {
      description: {
        story: 'Controls story with interactive props for URL and canvas size.',
      },
    },
  },
};
