# AvatarController

A modern Web Component for displaying animated 3D avatars (GLB format) with interactive animation controls, built with [Lit](https://lit.dev/) and [Three.js](https://threejs.org/).

---

## ✨ Features

- **Loads and displays GLB/GLTF avatars** via Three.js.
- **Async loading** from a given URL or local `/public/` asset.
- **Plays model animations** (if present) via animation buttons.
- **Custom events** emitted when animation starts or ends.
- **Fully documented and tested with Storybook.**
- **Strictly typed, modular codebase, code-splitting for performance.**

---

## 🚀 Getting Started

### 1. **Install dependencies**

```bash
npm install
```

### 2. **Run Storybook (demo & docs)**

```bash
npm run storybook
```

Then open [http://localhost:6006](http://localhost:6006) in your browser.

### 3. **Build for production**

```bash
npm run build
```

### 4. **Run tests**

```bash
npm test
```
## 🧪 Testing Notes – About Test Failures

> **ℹ️ Why are some UI interaction tests (with Jest) failing?**
>
> Lit and Three.js are distributed as modern ESM-only (ECMAScript Modules) packages.
> Jest (and ts-jest) is currently not fully compatible with ESM modules and cannot properly transform imports from node_modules like Lit and Three.js for component-level (UI) tests.
>
> Because of this, any Jest test that tries to render or interact with a Lit Web Component (that imports Three.js or Lit) will fail with errors such as:
> ```
> SyntaxError: Cannot use import statement outside a module
> ```
>
> **This is a known limitation in the JavaScript ecosystem.**
>
> - **All pure TypeScript services** (e.g., animation-manager, gltf-loader) are unit tested with Jest and will pass.
> - **Component/UI and interaction tests** are best run either manually (using Storybook) or with tools like [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) or Playwright.
>
> **Summary:**  
> Unit tests for logic services (with Jest) pass as expected.  
> UI/interaction tests for Web Components should be verified in Storybook, or with dedicated ESM-friendly tools (see above).
>
> For more info: [Jest ESM docs](https://jestjs.io/docs/ecmascript-modules), [Lit Testing docs](https://lit.dev/docs/testing/).
---

## 📦 Usage Example

Add your GLB file (e.g., `Manequin.glb`) to the `public/` folder.

```html
<avatar-controller glbUrl="/Manequin.glb" width="400" height="400"></avatar-controller>
```

Or in JavaScript:

```js
const avatar = document.createElement('avatar-controller');
avatar.glbUrl = '/Manequin.glb';
avatar.width = 400;
avatar.height = 400;
document.body.appendChild(avatar);
```

---

## ⚙️ Props

| Name   | Type   | Default | Description                            |
| ------ | ------ | ------- | -------------------------------------- |
| glbUrl | string | (none)  | URL of the GLB file to load            |
| width  | number | 400     | Width of the Three.js canvas (pixels)  |
| height | number | 400     | Height of the Three.js canvas (pixels) |

---

## 🔔 Custom Events

| Event Name      | Fired When               | Event Detail        |
| --------------- | ------------------------ | ------------------- |
| animation-start | An animation is started  | `{ index: number }` |
| animation-end   | An animation is finished | `{ index: number }` |

**How to listen for events:**

```js
const avatar = document.querySelector('avatar-controller');
avatar.addEventListener('animation-start', e => {
  console.log('Started animation:', e.detail.index);
});
avatar.addEventListener('animation-end', e => {
  console.log('Ended animation:', e.detail.index);
});
```

---

## 📝 Development Notes

- **Modular code:** GLTF loading and animation handling are in separate service files for maintainability.
- **Strict TypeScript:** The whole codebase is strictly typed (`strict: true` in `tsconfig.json`).
- **Lazy-load:** Three.js and GLTFLoader are loaded dynamically for optimal bundle size.
- **Tested:** Includes Jest unit tests for services and thorough Storybook documentation with manual interaction testing.
- **Bundle size analysis:** Use `npm run build` and `rollup-plugin-visualizer` (see Vite config).
- **ℹ️ Note:**  
  Due to the limitations of Jest with modern ESM-only modules (such as Lit and Three.js), automated interaction tests for the Web Component itself are best performed using Web Test Runner, Playwright, or manually verified in Storybook.  
  Jest unit tests for TypeScript services are included. For UI and interaction, please see the "Docs" and interactive controls in Storybook.

---

## 🏗️ Folder Structure

```
src/
  components/
    avatar-controller.ts        # Main component
  services/
    gltf-loader.ts              # Helper for loading GLB files
    animation-manager.ts        # Animation utilities
  stories/
    avatar-controller.stories.ts
public/
  Manequin.glb                  # Example GLB model
README.md
vite.config.ts
tsconfig.json
```

---

## 📚 Documentation

- All API and custom events are documented in [Storybook](http://localhost:6006) under the "Docs" tab.
- See `src/stories/avatar-controller.stories.ts` for usage examples.

---

## 📊 Bundle Size Analysis

- **Bundle analysis is done via [rollup-plugin-visualizer](https://www.npmjs.com/package/rollup-plugin-visualizer).**
- Run:
  ```bash
  npm run build
  ```
- Then open `bundle-stats.html` to view an interactive report of your bundle's composition, identify large dependencies, and optimize further if needed.

---

## 👤 Author

Cong Lap HUYNH
huynh.lap.co@gmail.com

---

