# Troubleshooting

Common issues and their solutions when running Waldorf.

---

## Installer Issues

These issues apply when installing Waldorf from a [pre-built release](https://github.com/JFW201/open-source-view/releases).

### macOS Gatekeeper warning

**Symptoms:** "Waldorf can't be opened because it is from an unidentified developer" or "Waldorf is damaged and can't be opened."

**Fix:**
1. Right-click (or Control-click) the **Waldorf** app in your Applications folder
2. Select **Open** from the context menu
3. Click **Open** in the dialog that appears
4. Waldorf will launch normally from now on — this step is only needed once

If that doesn't work:
```bash
# Remove the quarantine attribute (open Terminal.app just this once)
xattr -cr /Applications/Waldorf.app
```

**Why this happens:** Unsigned or notarization-pending apps trigger Gatekeeper. This does not indicate malware — Waldorf is open source and you can [inspect the code](https://github.com/JFW201/open-source-view) or build it yourself.

### Windows SmartScreen warning

**Symptoms:** "Windows protected your PC" / "Microsoft Defender SmartScreen prevented an unrecognized app from starting."

**Fix:**
1. Click **More info** in the SmartScreen dialog
2. Click **Run anyway**

**Why this happens:** SmartScreen flags apps that don't have an Extended Validation (EV) code-signing certificate. This is normal for open-source software. You can verify the source on [GitHub](https://github.com/JFW201/open-source-view).

### Linux AppImage won't run

**Symptoms:** Double-clicking the `.AppImage` file does nothing or shows a permission error.

**Fix:**
```bash
# Make the AppImage executable
chmod +x Waldorf_*.AppImage

# Run it
./Waldorf_*.AppImage
```

Some desktop environments also let you right-click → Properties → Permissions → check "Allow executing file as a program."

### Linux `.deb` or `.rpm` install fails

**Debian/Ubuntu:**
```bash
# Install with dependency resolution
sudo apt install ./waldorf_*.deb
```

**Fedora/RHEL:**
```bash
sudo dnf install ./waldorf_*.rpm
```

If WebKit dependencies are missing, install them first:
```bash
# Debian/Ubuntu
sudo apt install -y libwebkit2gtk-4.1-0 libayatana-appindicator3-1

# Fedora
sudo dnf install webkit2gtk4.1 libappindicator-gtk3
```

---

## Build Issues (Development)

These issues apply when building Waldorf from source. If you installed from a [pre-built release](https://github.com/JFW201/open-source-view/releases), see [Installer Issues](#installer-issues) above.

### Rust compilation fails

**Symptoms:** `cargo build` errors, missing libraries, linker errors.

**macOS:**
```bash
# Ensure Xcode CLT is installed
xcode-select --install

# Update Rust
rustup update stable
```

**Linux (Debian/Ubuntu):**
```bash
# Install all required system libraries
sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget \
  file libssl-dev libayatana-appindicator3-dev librsvg2-dev \
  libgtk-3-dev libsoup-3.0-dev libjavascriptcoregtk-4.1-dev
```

**Linux (Fedora):**
```bash
sudo dnf install webkit2gtk4.1-devel openssl-devel curl wget \
  file libappindicator-gtk3-devel librsvg2-devel gtk3-devel \
  libsoup3-devel javascriptcoregtk4.1-devel
```

**Windows:**
- Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the "Desktop development with C++" workload
- Install [WebView2](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) runtime

### `npm install` fails

```bash
# Clear npm cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# If node-gyp errors occur, ensure Python 3 and build tools are installed
# macOS: xcode-select --install
# Linux: sudo apt install build-essential python3
# Windows: npm install --global windows-build-tools
```

### Tauri CLI not found

```bash
# Install Tauri CLI globally via cargo
cargo install tauri-cli@^2

# Or use npx (recommended — uses the project's pinned version)
npx tauri dev
npx tauri build
```

---

## Runtime Issues

### Blank map / map tiles not loading

**Cause:** No internet connection, or map tile provider is down.

**Fix:**
1. Check your internet connection
2. Waldorf uses CartoCDN for tiles — check if `basemaps.cartocdn.com` is accessible
3. Try switching map style in Settings (Dark / Light / Satellite)
4. Open the Debug panel to check connection status

### No data appearing on the map

**Cause:** Layers may be toggled off, or API keys are not configured.

**Fix:**
1. Expand the Layer Panel in the sidebar (bottom section) and toggle layers on
2. Check Settings panel to ensure API keys are configured for the data sources you want
3. Open the Debug panel and run the connection tester to verify API access
4. Check browser console (F12) or Debug panel log viewer for error messages

### CORS errors in browser mode

**Cause:** Running via `npm run dev` (browser-only) — external APIs block cross-origin requests.

**Fix:**
- Use `npm run tauri:dev` instead — the Rust backend proxies all requests, bypassing CORS
- Browser mode is intended for UI development, not full data access

### API rate limits

**Cause:** Polling too frequently or free-tier API key limits exceeded.

**Fix:**
1. Increase the refresh interval in Settings (try 2m or 5m)
2. Check the Debug panel's cache inspector — cached data reduces API calls
3. Consider upgrading API keys to paid tiers for higher limits
4. GDELT and NASA FIRMS have generous free limits; ACLED requires a free API key

### High memory usage

**Cause:** Large datasets (many aircraft, vessels, or OSINT events).

**Fix:**
1. Toggle off layers you're not actively using
2. Reduce the number of active data feeds
3. Check Debug panel's store state viewer for unusually large datasets
4. Restart the app to clear in-memory caches

### `tsc` type errors

```bash
# Check for type errors
npx tsc --noEmit

# If errors are in node_modules, try:
rm -rf node_modules
npm install
```

### Vite build fails

```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run build

# If out of memory:
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Tauri build fails

```bash
# Ensure Rust is up to date
rustup update stable

# Clean Rust build artifacts and rebuild
cd src-tauri && cargo clean && cd ..
npm run tauri:build

# On macOS, if codesigning fails:
# The app builds unsigned by default — this is normal for development
```

---

## Data Source Issues

### GDELT returns no events

- GDELT GEO API requires no API key
- Check that the "GDELT Events" layer is enabled in the Layer Panel
- GDELT data may be sparse for certain regions — zoom into areas with known activity
- Open Debug panel and run the GDELT connection test

### ACLED returns no data

- ACLED requires both an API key AND email address
- Configure both in Settings: "ACLED (Conflict Data)" and "ACLED Email"
- Register for a free key at [acleddata.com](https://acleddata.com)
- Check Debug panel for error messages from the ACLED API

### NASA FIRMS shows no fires

- FIRMS works without an API key (at reduced rate limits)
- For higher limits, register at [firms.modaps.eosdis.nasa.gov](https://firms.modaps.eosdis.nasa.gov)
- Fire data updates with satellite passes (~every 12 hours per region)
- Check that "Fire Detection (FIRMS)" layer is enabled

### Air/sea traffic not updating

- Requires API keys: Aviation Stack (or OpenSky) for air, AIS Stream (or AISHub) for sea
- OpenSky works without a key but has strict rate limits
- Check connection status in the Debug panel
- Verify API keys in Settings panel

---

## Debug Panel

Waldorf includes a built-in debug panel accessible from the sidebar (bug icon). It provides:

1. **Connection Tester** — Tests connectivity to each API endpoint
2. **Cache Inspector** — Shows all cached entries with their TTL status
3. **Store State** — Displays Zustand store data counts and sizes
4. **Log Viewer** — Captures console errors, warnings, and info messages
5. **System Info** — Browser, platform, Tauri status, memory usage

To access: Click the bug icon in the sidebar, or navigate to the Debug panel.

---

## Getting Help

If your issue isn't covered here:
1. Check the Debug panel for diagnostic information (bug icon in the sidebar)
2. Search [existing issues](https://github.com/JFW201/open-source-view/issues) on GitHub
3. Open a new issue with:
   - OS and version
   - How you installed (pre-built release or built from source)
   - Steps to reproduce
   - Error messages from the Debug panel
   - For developers: Node.js version (`node -v`) and Rust version (`rustc --version`)
