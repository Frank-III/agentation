// =============================================================================
// agentation-svelte
// =============================================================================
//
// A floating toolbar for annotating web pages and collecting structured feedback
// for AI coding agents. Svelte 5 version.
//
// Usage:
//   import { Agentation } from 'agentation-svelte';
//   <Agentation />
//
// =============================================================================

// Main components
export { default as Agentation } from "./components/page-toolbar-css/PageFeedbackToolbarCSS.svelte";
export { default as PageFeedbackToolbarCSS } from "./components/page-toolbar-css/PageFeedbackToolbarCSS.svelte";
export type { DemoAnnotation } from "./components/page-toolbar-css/PageFeedbackToolbarCSS.svelte";

// Props type alias (matches upstream API)
export type { Props as AgentationProps } from "./components/page-toolbar-css/PageFeedbackToolbarCSS.svelte";

// Shared components (for building custom UIs)
export { default as AnnotationPopupCSS } from "./components/annotation-popup-css/AnnotationPopupCSS.svelte";
export type { Props as AnnotationPopupCSSProps } from "./components/annotation-popup-css/AnnotationPopupCSS.svelte";

// Icons (Svelte components)
export * from "./components/icons.svelte";

// Utilities (for building custom UIs)
export {
  identifyElement,
  identifyAnimationElement,
  getElementPath,
  getNearbyText,
  getElementClasses,
} from "./utils/element-identification";

// Svelte component detection
export {
  getSvelteComponents,
  getSvelteComponentsString,
  formatSvelteComponentPath,
  isSvelteDevMode,
  type SvelteDetectionMode,
} from "./utils/svelte-detection";

export {
  loadAnnotations,
  saveAnnotations,
  getStorageKey,
} from "./utils/storage";

// Types
export type { Annotation } from "./types";
