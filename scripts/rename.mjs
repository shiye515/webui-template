#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline/promises';

const root = process.cwd();
const defaultName = 'yourcli';
const packagePath = path.join(root, 'package.json');

function sanitizeName(value) {
  const sanitized = String(value || defaultName)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return sanitized || defaultName;
}

function readPackageJson() {
  if (!fs.existsSync(packagePath)) {
    return { cliName: defaultName };
  }

  try {
    return JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  } catch {
    return { cliName: defaultName };
  }
}

function appendGitignore(entry) {
  const gitignorePath = path.join(root, '.gitignore');
  if (!fs.existsSync(gitignorePath)) {
    fs.writeFileSync(gitignorePath, `${entry}\n`, 'utf8');
    return;
  }

  const content = fs.readFileSync(gitignorePath, 'utf8');
  if (!content.split(/\r?\n/).includes(entry)) {
    fs.appendFileSync(gitignorePath, `\n${entry}\n`, 'utf8');
  }
}

function replaceInFile(filePath, targetName) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const original = fs.readFileSync(filePath, 'utf8');
  const updated = original.replace(/yourcli/g, targetName);
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function updateDistPackage(targetName) {
  const distPackagePath = path.join(root, 'dist', 'package.json');
  const distCliPath = path.join(root, 'dist', 'cli.js');

  if (fs.existsSync(distPackagePath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(distPackagePath, 'utf8'));
      pkg.cliName = targetName;
      pkg.bin = { [targetName]: './cli.js' };
      fs.writeFileSync(distPackagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');
    } catch {
      // no-op: dist package is not guaranteed to exist yet
    }
  }

  if (fs.existsSync(distCliPath)) {
    const cliSource = fs.readFileSync(distCliPath, 'utf8');
    const updatedCli = cliSource.replace(/const cliName = '.*?';/, `const cliName = '${targetName}';`);
    if (updatedCli !== cliSource) {
      fs.writeFileSync(distCliPath, updatedCli, 'utf8');
    }
  }
}

const currentPackage = readPackageJson();
const providedName = process.argv[2];

const targetName = sanitizeName(
  providedName || (
    await (async () => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      try {
        const answer = await rl.question(`请输入 CLI 名称 [${currentPackage.cliName || defaultName}]: `);
        return answer.trim() || currentPackage.cliName || defaultName;
      } finally {
        rl.close();
      }
    })()
  )
);

const pkg = currentPackage;
pkg.cliName = targetName;
fs.writeFileSync(packagePath, `${JSON.stringify(pkg, null, 2)}\n`, 'utf8');

for (const filePath of [
  path.join(root, 'README.md'),
  path.join(root, 'scripts', 'build-cli.mjs')
]) {
  replaceInFile(filePath, targetName);
}

appendGitignore(`.${targetName}`);
appendGitignore('.yourcli');
updateDistPackage(targetName);

console.log(`Renamed project to CLI command: ${targetName}`);
console.log(`Local data dir: ${path.join(root, '.' + targetName)}`);
console.log(`Global data dir: ${path.join(process.env.HOME || process.env.USERPROFILE || '~', '.' + targetName)}`);
