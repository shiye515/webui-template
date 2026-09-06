## Context

This project is a reusable software template for launching a web UI from a CLI without Electron. The design should support both local development and packaged runtime use, while preserving the ability to customize the final command name when the template is initialized.

## Goals / Non-Goals

**Goals:**
- Offer a consistent CLI entrypoint for local serve and service management.
- Support both development and packaged runtime flows.
- Keep the project portable across platforms without relying on Electron.

**Non-Goals:**
- Building a full desktop app shell with native OS widgets.
- Supporting arbitrary plugin ecosystems or extension APIs.
- Replacing the web frontend architecture with a desktop-only runtime.

## Decisions

### 1. Use a Node-based CLI wrapper around the web app runtime
The CLI will act as the process entrypoint and orchestrator while the actual UI remains a web application served over HTTP. This keeps the template portable and avoids the maintenance burden of native desktop packaging.

**Alternatives considered:**
- Electron wrapper: rejected because the goal is to avoid Electron and keep the product lighter and cross-platform by default.
- Shell script wrappers: rejected because they are harder to package, install, and maintain across platforms.

### 2. Separate dev mode from packaged runtime mode
Development should continue to use `pnpm dev` with explicit frontend/backend ports (`8871`, `8872`), while packaged runtime should use the CLI binary to serve the app on `localhost:8073` and manage OS service registration.

**Why this works:**
- It preserves a familiar developer experience.
- It keeps runtime behavior explicit and stable for users outside the source tree.

### 3. Service lifecycle will be OS-aware but platform-generic in behavior
The service command will abstract the common lifecycle operations (`start` / `stop`) so the implementation can target OS-specific service managers without changing the user-facing contract.

**Alternatives considered:**
- Hardcoding one OS service manager: rejected because it would make the template less portable.
- Requiring a manual shell script for each OS: rejected because it would increase setup friction.

## Risks / Trade-offs

- [Port conflicts] → Validate port availability and fail with a clear message when `8073` is already in use.
- [Service management differences across OSes] → Standardize command semantics while isolating OS-specific implementation details behind a service adapter layer.
- [Template customization drift] → Keep the binary name and metadata generation centralized so initialization time parameters remain consistent.

## Migration Plan

1. Define the CLI contract and packaging model in the build pipeline.
2. Implement the local serve mode and service lifecycle handlers.
3. Add installation metadata and custom command-name generation for template initialization.
4. Verify development, build, and global installation workflows with smoke tests.

## Open Questions

- Which package manager runtime is the primary supported target: pnpm-only or dual support with npm as well?
- Should service startup include auto-recovery or only a simple one-shot registration flow?
- For packaging, should the app be served from a built static bundle or via a local Node HTTP server proxying the UI assets?
