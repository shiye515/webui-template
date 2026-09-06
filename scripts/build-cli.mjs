import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const distRoot = path.join(root, 'dist');
const serverSource = path.join(root, 'apps', 'server', 'dist');
const webSource = path.join(root, 'apps', 'web', 'dist');
const packageJsonPath = path.join(root, 'package.json');
const defaultCommandName = 'myapp';

function sanitizeCommandName(value) {
  const sanitized = String(value || defaultCommandName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return sanitized || defaultCommandName;
}

function readCommandName() {
  if (!fs.existsSync(packageJsonPath)) {
    return defaultCommandName;
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const candidate = pkg.cliName || pkg.name;
    return sanitizeCommandName(candidate);
  } catch {
    return defaultCommandName;
  }
}

const cliName = readCommandName();
const appDataDir = path.join(root, `.${cliName}`);

fs.rmSync(distRoot, { recursive: true, force: true });
fs.mkdirSync(path.join(distRoot, 'server'), { recursive: true });
fs.mkdirSync(path.join(distRoot, 'web'), { recursive: true });

if (fs.existsSync(serverSource)) {
  fs.cpSync(serverSource, path.join(distRoot, 'server'), { recursive: true });
}

if (fs.existsSync(webSource)) {
  fs.cpSync(webSource, path.join(distRoot, 'web'), { recursive: true });
}

const cliSource = [
  '#!/usr/bin/env node',
  "import fs from 'node:fs';",
  "import os from 'node:os';",
  "import path from 'node:path';",
  "import { fileURLToPath } from 'node:url';",
  "import { spawn, spawnSync } from 'node:child_process';",
  '',
  "const __filename = fileURLToPath(import.meta.url);",
  "const __dirname = path.dirname(__filename);",
  "const cliName = '" + cliName + "';",
  "const serverEntry = path.join(__dirname, 'server', 'index.js');",
  "const dataDir = path.join(os.homedir(), '.' + cliName);",
  '',
  'function printHelp() {',
  "  console.log('Usage: ' + cliName + ' <command>\\n\\nCommands:\\n  serve\\n  service start\\n  service stop\\n  --help\\n');",
  '}',
  '',
  'function sanitizeName(value) {',
  "  const sanitized = String(value || cliName)\n    .trim()\n    .toLowerCase()\n    .replace(/[^a-z0-9-]+/g, '-')\n    .replace(/^-+|-+$/g, '');",
  "  return sanitized || cliName;",
  '}',
  '',
  'function appendGitignore(entry) {',
  "  const gitignorePath = path.join(process.cwd(), '.gitignore');",
  "  if (!fs.existsSync(gitignorePath)) {",
  "    fs.writeFileSync(gitignorePath, entry + '\\n', 'utf8');",
  "    return;",
  '  }',
  "  const content = fs.readFileSync(gitignorePath, 'utf8');",
  "  if (!content.split(/\\r?\\n/).includes(entry)) {",
  "    fs.appendFileSync(gitignorePath, '\\n' + entry + '\\n');",
  '  }',
  '}',
  '',
  'function runServe() {',
  "  const child = spawn(process.execPath, [serverEntry], {",
  "    stdio: 'inherit',",
  "    env: {",
  "      ...process.env,",
  "      PORT: '8073',",
  "      NODE_ENV: 'production',",
  "      APP_NAME: cliName,",
  "      APP_DATA_DIR: dataDir",
  '    }',
  '  });',
  '',
  "  child.on('exit', (code) => {",
  '    process.exit(code ?? 0);',
  '  });',
  '}',
  '',
  'function plistPath() {',
  "  return path.join(os.homedir(), 'Library', 'LaunchAgents', 'com.webui.template.plist');",
  '}',
  '',
  'function startService() {',
  "  if (process.platform !== 'darwin') {",
  "    console.log('Service lifecycle is implemented for macOS launchd in this template.');",
  '    return;',
  '  }',
  '',
  '  const filePath = plistPath();',
  '  const launchDir = path.dirname(filePath);',
  '  fs.mkdirSync(launchDir, { recursive: true });',
  '',
  "  const plist = [",
  "    '<?xml version=\"1.0\" encoding=\"UTF-8\"?>',",
  "    '<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" \"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">',",
  "    '<plist version=\"1.0\">',",
  "    '<dict>',",
  "    '  <key>Label</key>',",
  "    '  <string>com.webui.template</string>',",
  "    '  <key>ProgramArguments</key>',",
  "    '  <array>',",
  "    `    <string>${process.execPath}</string>`,",
  "    `    <string>${serverEntry}</string>`,",
  "    '  </array>',",
  "    '  <key>EnvironmentVariables</key>',",
  "    '  <dict>',",
  "    '    <key>PORT</key>',",
  "    '    <string>8073</string>',",
  "    '    <key>NODE_ENV</key>',",
  "    '    <string>production</string>',",
  "    '    <key>APP_NAME</key>',",
  "    '    <string>' + cliName + '</string>',",
  "    '    <key>APP_DATA_DIR</key>',",
  "    '    <string>' + dataDir + '</string>',",
  "    '  </dict>',",
  "    '  <key>RunAtLoad</key>',",
  "    '  <true/>',",
  "    '</dict>',",
  "    '</plist>'",
  '  ].join(\'\\n\');',
  '',
  "  fs.writeFileSync(filePath, plist, 'utf8');",
  "  const load = spawnSync('launchctl', ['load', '-w', filePath], { stdio: 'inherit' });",
  "  if (load.status !== 0) {",
  "    console.error('Failed to start service.');",
  '    process.exit(load.status ?? 1);',
  '  }',
  '',
  "  console.log('Service started. Hono is serving the built frontend at http://localhost:8073');",
  '}',
  '',
  'function stopService() {',
  "  if (process.platform !== 'darwin') {",
  "    console.log('Service lifecycle is implemented for macOS launchd in this template.');",
  '    return;',
  '  }',
  '',
  '  const filePath = plistPath();',
  "  if (!fs.existsSync(filePath)) {",
  "    console.log('No service is currently registered.');",
  '    return;',
  '  }',
  '',
  "  const unload = spawnSync('launchctl', ['unload', '-w', filePath], { stdio: 'inherit' });",
  "  if (unload.status !== 0) {",
  "    console.error('Failed to stop service.');",
  '    process.exit(unload.status ?? 1);',
  '  }',
  '',
  "  fs.unlinkSync(filePath);",
  "  console.log('Service stopped.');",
  '}',
  '',
  "const [command, subCommand] = process.argv.slice(2);",
  '',
  "if (!command || command === '--help' || command === '-h') {",
  '  printHelp();',
  '  process.exit(0);',
  '}',
  '',
  "if (command === 'serve') {",
  '  runServe();',
  "} else if (command === 'service') {",
  "  if (subCommand === 'start') {",
  '    startService();',
  "  } else if (subCommand === 'stop') {",
  '    stopService();',
  '  } else {',
  '    printHelp();',
  '    process.exit(1);',
  '  }',
  '} else {',
  '  printHelp();',
  '  process.exit(1);',
  '}',
  ''
].join('\n');

fs.writeFileSync(path.join(distRoot, 'cli.js'), cliSource, 'utf8');
fs.chmodSync(path.join(distRoot, 'cli.js'), 0o755);

const packageJsonContent = {
  name: cliName,
  version: '1.0.0',
  private: false,
  type: 'module',
  cliName,
  bin: { [cliName]: './cli.js' },
  main: './server/index.js',
  scripts: {
    start: 'node ./server/index.js'
  },
  dependencies: {
    '@hono/node-server': '^1.0.0',
    hono: '^4.6.3'
  }
};

fs.writeFileSync(path.join(distRoot, 'package.json'), `${JSON.stringify(packageJsonContent, null, 2)}\n`);

const runtimeModules = ['hono', '@hono/node-server'];
for (const moduleName of runtimeModules) {
  const sourcePath = path.join(root, 'apps', 'server', 'node_modules', moduleName);
  const targetPath = path.join(distRoot, 'node_modules', moduleName);
  if (fs.existsSync(sourcePath)) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    fs.rmSync(targetPath, { recursive: true, force: true });
    fs.cpSync(fs.realpathSync(sourcePath), targetPath, { recursive: true });
  }
}

console.log(`CLI package assembled in ${distRoot}`);
