## 1. CLI scaffolding

- [ ] 1.1 Define the binary entrypoint and package metadata for the custom command name
- [ ] 1.2 Create the `serve` command and ensure it binds to the expected web UI port
- [ ] 1.3 Add the `service` command with `start` and `stop` subcommands

## 2. Build and install flow

- [ ] 2.1 Configure `pnpm build` to emit the distributable package in `dist`
- [ ] 2.2 Verify `pnpm install -g ./dist` installs the command globally
- [ ] 2.3 Confirm the installed command resolves to the configured template name

## 3. Development and runtime validation

- [ ] 3.1 Ensure `pnpm dev` exposes frontend and backend on ports `8871` and `8872`
- [ ] 3.2 Validate `serve` opens the Web UI at `http://localhost:8073`
- [ ] 3.3 Validate `service start` and `service stop` manage the running process correctly

## 4. Template experience

- [ ] 4.1 Define the init-time parameter for the custom CLI name
- [ ] 4.2 Document the template contract for downstream users
- [ ] 4.3 Auditing and smoke test the full lifecycle for first-run installation and service startup
