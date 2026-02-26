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
  // Shadow DOM helpers
  closestCrossingShadow,
  isInShadowDOM,
  getShadowHost,
  // Forensic utilities
  getForensicComputedStyles,
  parseComputedStylesString,
  getDetailedComputedStyles,
  getComputedStylesSnapshot,
  getAccessibilityInfo,
  getFullElementPath,
  getNearbyElements,
} from "./utils/element-identification";

// Svelte component detection
export {
  getSvelteComponents,
  getSvelteComponentsString,
  formatSvelteComponentPath,
  isSvelteDevMode,
  type SvelteDetectionMode,
} from "./utils/svelte-detection";

// Storage utilities
export {
  loadAnnotations,
  saveAnnotations,
  getStorageKey,
  clearAnnotations,
  loadAllAnnotations,
  // Sync markers
  saveAnnotationsWithSyncMarker,
  getUnsyncedAnnotations,
  clearSyncMarkers,
  // Session storage
  getSessionStorageKey,
  loadSessionId,
  saveSessionId,
  clearSessionId,
} from "./utils/storage";

// Server sync utilities
export {
  listSessions,
  createSession,
  getSession,
  syncAnnotation,
  updateAnnotation,
  deleteAnnotation,
  requestAction,
  type ActionResponse,
} from "./utils/sync";

// Freeze animations utilities
export {
  freeze,
  unfreeze,
  originalSetTimeout,
  originalSetInterval,
} from "./utils/freeze-animations";

// Types
export type {
  Annotation,
  AnnotationIntent,
  AnnotationSeverity,
  AnnotationStatus,
  Session,
  SessionStatus,
  SessionWithAnnotations,
  ThreadMessage,
} from "./types";
