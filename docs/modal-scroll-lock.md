# Modal Scroll Lock Utility

## Purpose

`hooks/use-modal-lock.ts` enforces strict modal behavior:

- When a modal is open, background page scrolling is fully disabled.
- Wheel/touch/scroll-key input is only allowed inside the active modal panel.
- Escape closes the modal through the provided callback.

## Why It Exists

The site uses smooth scrolling (`lenis`) for the main document. Without strict lock handling, aggressive scroll input can chain from a modal panel into the page background.

`useModalLock` prevents that by:

- locking document scroll (`html/body`) with overflow snapshot/restore
- adding capture-phase `wheel` and `touchmove` guards
- blocking scroll chain when a modal scroll area reaches its edge
- preventing scroll keys outside the modal panel
- handling modal scroll keys inside the panel
- supporting nested/overlapping modal locks safely with a lock counter
- pairing with Lenis nested-scroll prevention (`data-lenis-prevent` on overlays)

## Usage

```tsx
const panelRef = useRef<HTMLElement | null>(null);

useModalLock({
  isOpen: Boolean(selectedItem),
  onRequestClose: closeModal,
  scrollContainerRef: panelRef,
});

// ...
<article ref={panelRef} className="overlay__panel">...</article>
```
