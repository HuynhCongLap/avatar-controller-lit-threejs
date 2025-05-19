// Import helpers from Testing Library
import { userEvent, waitFor } from '@storybook/testing-library';

// Import all stories to test them
import * as Stories from './avatar-controller.stories';

// Example: test the "Controls" story
describe('AvatarController Storybook interactions', () => {
  it('should render animation buttons and dispatch custom events', async () => {
    // Get the Controls story export
    const story = Stories.Controls;
    // Render the story into the DOM
    document.body.innerHTML = '';
    const el = story.render(story.args);
    document.body.appendChild(el);

    // Wait until the component renders animation buttons in the shadowRoot
    await waitFor(() => {
      const shadowRoot = (el as HTMLElement).shadowRoot!;
      const buttons = shadowRoot.querySelectorAll('button');
      expect(buttons.length).toBeGreaterThan(0);
    }, { timeout: 5000 });

    // Find the first animation button
    const shadowRoot = (el as HTMLElement).shadowRoot!;
    const firstButton = shadowRoot.querySelector('button')!;

    // Listen for custom events on the element
    let started = false;
    el.addEventListener('animation-start', () => { started = true; });
    

    // Simulate a user clicking the first button
    await userEvent.click(firstButton);

    // Assert that the custom event was dispatched
    await waitFor(() => {
      expect(started).toBe(true);
    }, { timeout: 2000 });

    // Optionally, you can wait for animation-end event if your animation is short
    // await waitFor(() => {
    //   expect(ended).toBe(true);
    // }, { timeout: 4000 });

    // Clean up after test
    document.body.removeChild(el);
  });
});
