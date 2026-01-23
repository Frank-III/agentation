// =============================================================================
// Svelte Component Detection
// =============================================================================
//
// Detects Svelte component hierarchy from DOM elements.
// Works with Svelte 5's internal structures and DevTools hooks.
//

export type SvelteDetectionMode = "filtered" | "smart" | "all" | "off";

interface SvelteComponentInfo {
  name: string;
  path: string[];
}

/**
 * Extended window interface for Svelte DevTools hooks
 */
interface SvelteDevToolsWindow extends Window {
  __svelte?: {
    v?: Set<unknown>;
  };
}

/**
 * Extended element interface for Svelte internals
 */
interface SvelteElement extends HTMLElement {
  __svelte_component_dev?: {
    $$?: {
      ctx?: unknown[];
    };
    constructor?: {
      name?: string;
    };
  };
  __svelte_meta?: {
    loc?: {
      file?: string;
      line?: number;
      column?: number;
    };
  };
}

/**
 * Check if Svelte DevTools or dev mode is available
 */
export function isSvelteDevMode(): boolean {
  if (typeof window === "undefined") return false;
  const win = window as SvelteDevToolsWindow;
  return Boolean(win.__svelte);
}

/**
 * Extract component name from Svelte-generated CSS class
 * Svelte adds classes like "svelte-1abc23" to scoped elements
 */
function extractComponentFromClass(element: HTMLElement): string | null {
  const className = element.className;
  if (typeof className !== "string") return null;

  // Match svelte-xxxxx pattern
  const match = className.match(/svelte-([a-z0-9]+)/i);
  if (!match) return null;

  // The hash itself doesn't give us the name, but we can use it
  // to group elements from the same component
  return `Component[${match[1]}]`;
}

/**
 * Try to get component name from Svelte's dev metadata
 */
function getComponentFromDevMeta(element: HTMLElement): string | null {
  const svelteEl = element as SvelteElement;
  
  // Check for dev component info (available in dev mode)
  if (svelteEl.__svelte_component_dev?.constructor?.name) {
    const name = svelteEl.__svelte_component_dev.constructor.name;
    // Filter out internal Svelte names
    if (!name.startsWith("$") && name !== "Object") {
      return name;
    }
  }

  // Check for source location metadata (Svelte DevTools)
  if (svelteEl.__svelte_meta?.loc?.file) {
    const file = svelteEl.__svelte_meta.loc.file;
    // Extract component name from file path
    const match = file.match(/([A-Z][a-zA-Z0-9]*(?:\.[a-zA-Z]+)?)\.svelte$/);
    if (match) {
      return match[1].replace(/\.svelte$/, "");
    }
  }

  return null;
}

/**
 * Infer component name from element structure and naming conventions
 */
function inferComponentFromStructure(element: HTMLElement): string | null {
  // Check data attributes that might indicate component
  const dataComponent = element.dataset.component || element.dataset.svelteComponent;
  if (dataComponent) return dataComponent;

  // Check for semantic class names that might indicate component boundaries
  const className = element.className;
  if (typeof className === "string") {
    // Common component naming patterns
    const componentPatterns = [
      /^([A-Z][a-zA-Z]+)(?:Container|Wrapper|Component)?$/,  // PascalCase
      /^(?:is-)?([a-z]+-)+[a-z]+$/,  // kebab-case like "nav-bar"
    ];

    const classes = className.split(/\s+/);
    for (const cls of classes) {
      // Skip Svelte hash classes
      if (cls.startsWith("svelte-")) continue;
      // Skip utility classes (usually short)
      if (cls.length < 4) continue;
      // Skip CSS module hashes
      if (/[_][a-zA-Z0-9]{5,}$/.test(cls)) continue;

      for (const pattern of componentPatterns) {
        if (pattern.test(cls)) {
          // Convert to PascalCase component name
          return cls
            .split(/[-_]/)
            .map(part => part.charAt(0).toUpperCase() + part.slice(1))
            .join("");
        }
      }
    }
  }

  return null;
}

/**
 * Check if this looks like a component root element
 */
function isLikelyComponentRoot(element: HTMLElement): boolean {
  // Has Svelte scoping class
  const className = element.className;
  if (typeof className === "string" && /svelte-[a-z0-9]+/i.test(className)) {
    // Check if parent has different Svelte scope (component boundary)
    const parent = element.parentElement;
    if (parent) {
      const parentClassName = parent.className;
      if (typeof parentClassName === "string") {
        const elementScope = className.match(/svelte-([a-z0-9]+)/i)?.[1];
        const parentScope = parentClassName.match(/svelte-([a-z0-9]+)/i)?.[1];
        if (elementScope && parentScope && elementScope !== parentScope) {
          return true;
        }
      }
    }
    return true;
  }

  // Has component data attribute
  if (element.dataset.component || element.dataset.svelteComponent) {
    return true;
  }

  return false;
}

/**
 * Framework-internal components to filter out
 */
const INTERNAL_COMPONENTS = new Set([
  "Fragment",
  "Slot",
  "Component",
  "SvelteComponent",
  "SvelteComponentDev",
  "SvelteElement",
  "Root",
  "App",
  "$",
]);

/**
 * Should we include this component in the filtered output?
 */
function shouldIncludeComponent(name: string, mode: SvelteDetectionMode): boolean {
  if (mode === "all") return true;
  if (mode === "off") return false;

  // Filter out internal/framework components
  if (INTERNAL_COMPONENTS.has(name)) return false;
  if (name.startsWith("$") || name.startsWith("_")) return false;
  if (name.length < 2) return false;

  // For "smart" mode, only include if it looks like a user component
  if (mode === "smart") {
    // Must start with uppercase (PascalCase convention)
    if (!/^[A-Z]/.test(name)) return false;
  }

  return true;
}

/**
 * Get Svelte component tree for an element
 */
export function getSvelteComponents(
  element: HTMLElement,
  mode: SvelteDetectionMode = "filtered"
): SvelteComponentInfo | null {
  if (mode === "off") return null;

  const components: string[] = [];
  let current: HTMLElement | null = element;

  while (current && current !== document.body) {
    let componentName: string | null = null;

    // Try different detection methods in order of reliability
    componentName = getComponentFromDevMeta(current);
    
    if (!componentName) {
      componentName = inferComponentFromStructure(current);
    }

    if (!componentName && isLikelyComponentRoot(current)) {
      componentName = extractComponentFromClass(current);
    }

    if (componentName && shouldIncludeComponent(componentName, mode)) {
      // Avoid duplicates
      if (components[components.length - 1] !== componentName) {
        components.push(componentName);
      }
    }

    current = current.parentElement;
  }

  if (components.length === 0) return null;

  // Reverse to get root -> leaf order
  components.reverse();

  return {
    name: components[components.length - 1],
    path: components,
  };
}

/**
 * Format component path for display
 */
export function formatSvelteComponentPath(info: SvelteComponentInfo | null): string {
  if (!info) return "";
  return info.path.join(" > ");
}

/**
 * Get component info as a string (for annotation output)
 */
export function getSvelteComponentsString(
  element: HTMLElement,
  mode: SvelteDetectionMode = "filtered"
): string {
  const info = getSvelteComponents(element, mode);
  return formatSvelteComponentPath(info);
}
