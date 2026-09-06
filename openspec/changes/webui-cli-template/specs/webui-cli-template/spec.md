## Purpose

This capability defines the contract for a template-driven CLI that starts the Web UI, exposes a local service lifecycle, and packages itself for global installation without Electron.

## ADDED Requirements

### Requirement: Template users can install the compiled CLI globally
The system SHALL allow a template user to run `pnpm build` to create a distributable package and `pnpm install -g ./dist` to install the CLI under a custom command name.

#### Scenario: Successful global installation
- **WHEN** a user executes `pnpm build` and then installs the generated package globally
- **THEN** the CLI is available as a command on the PATH and can be invoked in the shell without a project-local script wrapper

### Requirement: CLI can start the Web UI in foreground mode
The system SHALL provide a `serve` command that starts the web UI in the foreground and exposes the app through `http://localhost:8073`.

#### Scenario: Serving the web UI
- **WHEN** a user runs the CLI `serve` command
- **THEN** the app starts in the foreground and the user can access the interface at `localhost:8073`

### Requirement: CLI can manage system service lifecycle
The system SHALL provide a `service` command with `start` and `stop` operations that register or remove a background service while preserving access to the same web UI endpoint.

#### Scenario: Starting the service
- **WHEN** a user runs `yourcli service start`
- **THEN** the system creates an operating-system service that starts the app and keeps the web UI accessible at `localhost:8073`

#### Scenario: Stopping the service
- **WHEN** a user runs `yourcli service stop`
- **THEN** the system removes the OS service and stops the app process

### Requirement: Template initialization accepts a custom CLI name
The system SHALL allow the template initializer to accept a user-supplied command name such as `{yourcli}` and generate the package metadata, binary name, and runtime commands using that custom name.

#### Scenario: Custom CLI naming
- **WHEN** a template user initializes the project with a custom command name
- **THEN** the resulting CLI command and package identity reflect the provided name while preserving the same behavior contract

### Requirement: Development workflow exposes frontend and backend ports
The system SHALL support a development mode where `pnpm dev` starts the frontend on port `8871` and the backend on port `8872` for local iterative work.

#### Scenario: Developer startup
- **WHEN** a developer runs `pnpm dev`
- **THEN** the frontend and backend services are available on their configured ports and the user can validate the app without packaging it globally
