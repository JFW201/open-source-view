import { useEffect, useRef } from "react";

/**
 * Checks for app updates on launch using tauri-plugin-updater.
 * Shows a native dialog if an update is available, downloads it,
 * and relaunches the app. Runs once on mount, non-blocking.
 */
export function useAutoUpdater() {
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    (async () => {
      try {
        // Dynamic import so the app still works in browser dev mode
        const { check } = await import("@tauri-apps/plugin-updater");
        const { ask } = await import("@tauri-apps/plugin-dialog");
        const { relaunch } = await import("@tauri-apps/plugin-process");

        const update = await check();
        if (!update) return;

        const yes = await ask(
          `Waldorf v${update.version} is available.\n\n${update.body ?? "Bug fixes and improvements."}`,
          {
            title: "Update Available",
            kind: "info",
            okLabel: "Update Now",
            cancelLabel: "Later",
          }
        );

        if (yes) {
          await update.downloadAndInstall();
          await relaunch();
        }
      } catch {
        // Silently ignore — updater only works in bundled Tauri builds,
        // not in dev mode or browser-only environments.
      }
    })();
  }, []);
}
