import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { MouseSensor as LibMouseSensor } from "@dnd-kit/core";
import type { MouseEvent } from "react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class MouseSensor extends LibMouseSensor {
  static activators = [
    {
      eventName: "onMouseDown" as const,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        return shouldHandleEvent(event.target as HTMLElement);
      },
    },
  ];
}

function shouldHandleEvent(element: HTMLElement | null) {
  let cur = element;

  while (cur) {
    if (cur.dataset && cur.dataset.slot === "button") {
      return false;
    }
    cur = cur.parentElement;
  }

  return true;
}
