import type { RouterDirection } from "@ionic/react";

type PushFn = (path: string, direction?: RouterDirection | undefined) => void;

let _push: PushFn | null = null;

export function setGlobalPush(fn: PushFn) {
  _push = fn;
}

export function globalPush(
  path: string,
  direction?: RouterDirection | undefined
) {
  if (_push) {
    _push(path, direction);
  } else {
    if (typeof window !== "undefined") {
      window.location.href = path;
    }
  }
}
