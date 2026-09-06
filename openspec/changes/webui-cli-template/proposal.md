## Why

The project needs a cross-platform desktop-style distribution model without Electron. Today, the repo is only a template and has no packaged CLI workflow to launch a web UI, run dev services, or install globally. A single command-driven entrypoint is needed so users can start a local app, deploy it as a service, and package a reusable template without platform-specific shell or GUI dependencies.

## What Changes

- Add a CLI template that can bootstrap a custom command name at project init time.
- Provide a `serve` command for local foreground web UI startup on `localhost:8073`.
- Provide a `service` subcommand with `start` and `stop` behavior for self-hosted/system service lifecycle management.
- Add a build and install flow where `pnpm build` emits a distributable package and `pnpm install -g ./dist` installs the tool globally.
- Keep the developer workflow consistent with `pnpm dev` exposing front-end and back-end services on ports `8871` and `8872`.

## Capabilities

### New Capabilities
- `webui-cli-template`: Defines the CLI contract for bootstrapping, running, packaging, and servicing a web UI without Electron.

### Modified Capabilities
- None

## Impact

- Adds a new CLI entrypoint and runtime packaging workflow for the project template.
- Introduces service lifecycle management and web UI port assumptions.
- Affects the initial project scaffolding, build configuration, and any downstream template users who install the tool globally.
