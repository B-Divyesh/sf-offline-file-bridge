#!/usr/bin/env sh
# android-emulator-runner invokes its `script` value once per YAML line. Keep
# compound POSIX shell control flow here and call this file as a single command.
set -eu

attempt=1
while [ "$attempt" -le 90 ]; do
  boot_completed="$(adb shell getprop sys.boot_completed 2>/dev/null | tr -d '\r')"
  if [ "$boot_completed" = "1" ] && adb shell cmd package list packages android >/dev/null 2>&1; then
    exit 0
  fi
  if [ "$attempt" -eq 90 ]; then
    echo "Android Package Manager did not become ready."
    adb shell getprop || true
    adb shell cmd -l || true
    exit 1
  fi
  attempt=$((attempt + 1))
  sleep 2
done
