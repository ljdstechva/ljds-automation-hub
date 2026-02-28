"use client";

import { RefObject, useEffect } from "react";

type UseModalLockOptions = {
  isOpen: boolean;
  onRequestClose?: () => void;
  scrollContainerRef?: RefObject<HTMLElement | null>;
};

type StyleSnapshot = {
  overflow: string;
};

const SCROLL_KEYS = new Set([" ", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"]);

let activeLocks = 0;
let bodySnapshot: StyleSnapshot | null = null;
let htmlSnapshot: { overflow: string; overscrollBehavior: string } | null = null;

function captureBodyStyles(body: HTMLElement): StyleSnapshot {
  return {
    overflow: body.style.overflow,
  };
}

function lockDocumentScroll() {
  const html = document.documentElement;
  const body = document.body;

  if (activeLocks === 0) {
    bodySnapshot = captureBodyStyles(body);
    htmlSnapshot = {
      overflow: html.style.overflow,
      overscrollBehavior: html.style.overscrollBehavior,
    };

    html.classList.add("is-modal-open");
    body.classList.add("is-modal-open");

    html.style.overflow = "hidden";
    html.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
  }

  activeLocks += 1;
}

function unlockDocumentScroll() {
  if (activeLocks === 0) {
    return;
  }

  activeLocks -= 1;
  if (activeLocks > 0) {
    return;
  }

  const html = document.documentElement;
  const body = document.body;

  html.classList.remove("is-modal-open");
  body.classList.remove("is-modal-open");

  if (htmlSnapshot) {
    html.style.overflow = htmlSnapshot.overflow;
    html.style.overscrollBehavior = htmlSnapshot.overscrollBehavior;
  } else {
    html.style.removeProperty("overflow");
    html.style.removeProperty("overscroll-behavior");
  }

  if (bodySnapshot) {
    body.style.overflow = bodySnapshot.overflow;
  } else {
    body.style.removeProperty("overflow");
  }

  bodySnapshot = null;
  htmlSnapshot = null;
}

function isInsideContainer(target: EventTarget | null, container: HTMLElement | null) {
  return Boolean(container && target instanceof Node && container.contains(target));
}

function isEditableTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tag = target.tagName;
  return target.isContentEditable || tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function getElementFromTarget(target: EventTarget | null) {
  if (target instanceof HTMLElement) {
    return target;
  }

  if (target instanceof Node) {
    const parent = target.parentElement;
    return parent instanceof HTMLElement ? parent : null;
  }

  return null;
}

function isScrollable(element: HTMLElement) {
  const style = window.getComputedStyle(element);
  const overflowY = style.overflowY;
  const canOverflow = overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay";
  return canOverflow && element.scrollHeight > element.clientHeight + 1;
}

function canScrollInDirection(element: HTMLElement, deltaY: number) {
  if (deltaY < 0) {
    return element.scrollTop > 0;
  }
  if (deltaY > 0) {
    return element.scrollTop + element.clientHeight < element.scrollHeight;
  }
  return true;
}

function canScrollWithinContainer(container: HTMLElement | null, target: EventTarget | null, deltaY: number) {
  if (!container || deltaY === 0) {
    return false;
  }

  let current: HTMLElement | null = getElementFromTarget(target);
  if (!current) {
    current = container;
  }

  while (current) {
    if (isScrollable(current) && canScrollInDirection(current, deltaY)) {
      return true;
    }

    if (current === container) {
      break;
    }

    current = current.parentElement;
  }

  return false;
}

function scrollContainerByKey(container: HTMLElement, event: KeyboardEvent) {
  const pageStep = Math.max(48, Math.round(container.clientHeight * 0.9));
  let delta = 0;

  switch (event.key) {
    case "ArrowDown":
      delta = 40;
      break;
    case "ArrowUp":
      delta = -40;
      break;
    case "PageDown":
      delta = pageStep;
      break;
    case "PageUp":
      delta = -pageStep;
      break;
    case " ":
      delta = event.shiftKey ? -pageStep : pageStep;
      break;
    case "Home":
      container.scrollTo({ top: 0, behavior: "auto" });
      return;
    case "End":
      container.scrollTo({ top: container.scrollHeight, behavior: "auto" });
      return;
    default:
      return;
  }

  container.scrollBy({ top: delta, behavior: "auto" });
}

export function useModalLock({ isOpen, onRequestClose, scrollContainerRef }: UseModalLockOptions) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    lockDocumentScroll();
    let lastTouchY: number | null = null;

    const onWheel = (event: WheelEvent) => {
      const container = scrollContainerRef?.current ?? null;
      if (!isInsideContainer(event.target, container)) {
        event.preventDefault();
        return;
      }

      if (!canScrollWithinContainer(container, event.target, event.deltaY)) {
        event.preventDefault();
      }
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        lastTouchY = null;
        return;
      }
      lastTouchY = event.touches[0]?.clientY ?? null;
    };

    const onTouchMove = (event: TouchEvent) => {
      const container = scrollContainerRef?.current ?? null;
      if (!isInsideContainer(event.target, container)) {
        event.preventDefault();
        return;
      }

      if (event.touches.length !== 1) {
        return;
      }

      const currentY = event.touches[0]?.clientY;
      if (currentY === undefined) {
        return;
      }

      if (lastTouchY === null) {
        lastTouchY = currentY;
        return;
      }

      const deltaY = lastTouchY - currentY;
      lastTouchY = currentY;

      if (!canScrollWithinContainer(container, event.target, deltaY)) {
        event.preventDefault();
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onRequestClose?.();
        return;
      }

      if (!SCROLL_KEYS.has(event.key)) {
        return;
      }

      const container = scrollContainerRef?.current ?? null;
      const isInModal = isInsideContainer(event.target, container) || isInsideContainer(document.activeElement, container);
      if (!isInModal || !container) {
        event.preventDefault();
        return;
      }

      if (isEditableTarget(event.target)) {
        return;
      }

      event.preventDefault();
      scrollContainerByKey(container, event);
    };

    document.addEventListener("wheel", onWheel, { passive: false, capture: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true, capture: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false, capture: true });
    window.addEventListener("keydown", onKeyDown, { capture: true });

    return () => {
      document.removeEventListener("wheel", onWheel, { capture: true });
      document.removeEventListener("touchstart", onTouchStart, { capture: true });
      document.removeEventListener("touchmove", onTouchMove, { capture: true });
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      unlockDocumentScroll();
    };
  }, [isOpen, onRequestClose, scrollContainerRef]);
}
