# Releasing Waldorf

This guide covers how to create GitHub Releases with downloadable installers for all platforms.

## One-Time Setup

### 1. Generate Tauri Updater Signing Keys

The updater signs release artifacts so the app can verify updates are authentic.

```bash
npx @tauri-apps/cli signer generate -w ~/.tauri/waldorf.key
```

This creates two files:
- **Private key** (`~/.tauri/waldorf.key`) — keep this secret
- **Public key** (printed to stdout) — add to `tauri.conf.json`

Copy the public key into `src-tauri/tauri.conf.json`:

```json
"updater": {
  "endpoints": [
    "https://github.com/JFW201/open-source-view/releases/latest/download/latest.json"
  ],
  "pubkey": "dW50cnVzdGVkIGNvbW1lbnQ6IG1pbmlzaWduI..."
}
```

### 2. Add GitHub Secrets

Go to **Settings → Secrets and variables → Actions** in your GitHub repository and add:

**Required:**

| Secret | Value |
|--------|-------|
| `TAURI_SIGNING_PRIVATE_KEY` | Full contents of `~/.tauri/waldorf.key` |
| `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` | Password you chose during key generation |

**Optional (macOS code signing — prevents Gatekeeper warnings):**

| Secret | Value |
|--------|-------|
| `APPLE_CERTIFICATE` | Base64-encoded `.p12` Developer ID certificate |
| `APPLE_CERTIFICATE_PASSWORD` | Password for the `.p12` file |
| `KEYCHAIN_PASSWORD` | Any strong password (used for temporary build keychain) |
| `APPLE_ID` | Your Apple ID email |
| `APPLE_PASSWORD` | App-specific password (generate at [appleid.apple.com](https://appleid.apple.com)) |
| `APPLE_TEAM_ID` | 10-character Team ID from [developer.apple.com](https://developer.apple.com/account) |

Without the Apple secrets, macOS builds will still work — they'll just be unsigned (users will need to right-click → Open on first launch).

## Creating a Release

### 1. Bump the Version

Update the version in **all three files** (they must match):

- `package.json` → `"version": "X.Y.Z"`
- `src-tauri/Cargo.toml` → `version = "X.Y.Z"`
- `src-tauri/tauri.conf.json` → `"version": "X.Y.Z"`

### 2. Commit and Tag

```bash
git add package.json src-tauri/Cargo.toml src-tauri/tauri.conf.json
git commit -m "chore: release vX.Y.Z"
git tag vX.Y.Z
git push origin main vX.Y.Z
```

### 3. Wait for the Build

The tag push triggers the **"Build & Release Waldorf"** GitHub Actions workflow, which:

1. Builds in parallel on 4 runners (macOS ARM64, macOS Intel, Windows x64, Linux x64)
2. Creates installers: `.dmg` (macOS), `.exe`/`.msi` (Windows), `.AppImage`/`.deb`/`.rpm` (Linux)
3. Signs all artifacts with your Tauri updater key
4. Signs macOS builds with your Apple certificate (if secrets are configured)
5. Creates a **draft** GitHub Release with all artifacts attached

Build time is typically 10–15 minutes.

### 4. Publish the Release

1. Go to your repo's **Releases** page
2. Find the draft release ("Waldorf vX.Y.Z")
3. Edit the release notes if desired
4. Uncheck "Set as a pre-release" if applicable
5. Click **Publish release**

Users can now download installers from the Releases page — no terminal needed.

## Alternative: Manual Trigger

You can also trigger a release build without tagging:

1. Go to **Actions → "Build & Release Waldorf"**
2. Click **Run workflow**
3. Choose whether to create as draft (default: yes)
4. Click **Run workflow**

This uses the version from `tauri.conf.json` as the release tag.

## What Gets Built

| Platform | Installer | Notes |
|----------|-----------|-------|
| macOS (Apple Silicon) | `Waldorf_X.Y.Z_aarch64.dmg` | M1/M2/M3/M4 |
| macOS (Intel) | `Waldorf_X.Y.Z_x64.dmg` | Older Macs |
| Windows | `Waldorf_X.Y.Z_x64-setup.exe`, `.msi` | Windows 10/11 |
| Linux | `Waldorf_X.Y.Z_amd64.AppImage`, `.deb`, `.rpm` | Most distros |

A `latest.json` file is also uploaded for the in-app auto-updater.

## Troubleshooting

**Build fails on macOS signing:**
Check that all 6 Apple secrets are set. If you don't need signing, the workflow falls back to unsigned builds automatically.

**Version mismatch errors:**
Ensure `package.json`, `Cargo.toml`, and `tauri.conf.json` all have the same version string.

**No artifacts in the release:**
Check the Actions tab for build logs. Common issues: missing GitHub Secrets, Rust compilation errors, or npm dependency failures.

**Auto-updater not working:**
Verify that `tauri.conf.json` has the correct `pubkey` (matching your `TAURI_SIGNING_PRIVATE_KEY`) and the `endpoints` URL points to your repo.
