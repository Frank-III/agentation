## Cursor Cloud specific instructions

### Project overview

Agentation is a visual feedback/annotation toolbar for AI coding agents. This monorepo has two packages:

- **`agentation-svelte`** (`_package-export/`) — the publishable Svelte 5 npm library. Built with `bun tsdown`.
- **`feedback-tool-example`** (`_package-export/example/`) — a Next.js 14 demo/docs site at agentation.dev.

See `CLAUDE.md` files at root, `_package-export/`, and `_package-export/example/` for project rules and conventions.

### Porting status

The library has been ported from React (`agentation` on npm) to Svelte 5 (`agentation-svelte`). The example app is a SvelteKit app consuming `agentation-svelte` directly.

### Running services

Both services start together via `pnpm dev` from the root (library watch + SvelteKit dev). Alternatively:

- Library only: `pnpm --filter agentation-svelte build` (or `watch`)
- Example app only: `pnpm --filter agentation-example dev`

### Non-obvious caveats

- **bun is required** — the library build runs `bun tsdown`, so `bun` must be on `PATH` (`~/.bun/bin`).
- **No lint/test scripts** — there are no `lint`, `test`, or `typecheck` scripts configured in any `package.json`. Validation is: `pnpm --filter agentation-svelte build` compiles, and the example app loads without errors.
- **SSR guard required** — the `<Agentation />` component uses `$effect` and DOM APIs, so it must be wrapped in `{#if browser}` in SvelteKit layouts to avoid SSR errors.
- **`tsc --noEmit` will show errors** — running `tsc` directly on the Svelte library produces false positives because it lacks the Svelte language plugin. The `tsdown` build handles Svelte files correctly.
- **`pnpm.onlyBuiltDependencies`** in root `package.json` allows `@parcel/watcher` and `rolldown` build scripts to run non-interactively during `pnpm install`.
