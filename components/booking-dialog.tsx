"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";
import { useModalLock } from "@/hooks/use-modal-lock";

type BookingDialogProps = {
  trigger: ReactNode;
};

export function BookingDialog({ trigger }: BookingDialogProps) {
  const [open, setOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [highlightClose, setHighlightClose] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const dialogPanelRef = useRef<HTMLElement | null>(null);

  const openDialog = useCallback(() => {
    setHasInteracted(false);
    setHighlightClose(false);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
    setHasInteracted(false);
    setHighlightClose(false);
  }, []);

  useModalLock({
    isOpen: open,
    onRequestClose: closeDialog,
    scrollContainerRef: dialogPanelRef,
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleBlur = () => {
      if (document.activeElement?.tagName === "IFRAME") {
        setHasInteracted(true);
      }
    };

    const handleMessage = (event: MessageEvent) => {
      let payload = "";
      try {
        payload = typeof event.data === "string" ? event.data : JSON.stringify(event.data);
      } catch {
        payload = "";
      }

      if (payload.includes("date_and_time_selected")) {
        setHasInteracted(true);
      }
    };

    window.addEventListener("blur", handleBlur);
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("message", handleMessage);
    };
  }, [open]);

  const handleOutsideClick = () => {
    if (!hasInteracted) {
      closeDialog();
      return;
    }

    setHighlightClose(true);
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setHighlightClose(false);
    }, 800);
  };

  return (
    <>
      <span
        className="booking-trigger"
        onClick={openDialog}
        role="button"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openDialog();
          }
        }}
      >
        {trigger}
      </span>

      {open && (
        <div className="overlay" role="dialog" aria-modal="true" aria-label="Schedule a call" data-lenis-prevent>
          <div className="overlay__backdrop" onClick={handleOutsideClick} />
          <article ref={dialogPanelRef} className="overlay__panel overlay__panel--booking">
            <header className="overlay__header">
              <h3>Schedule a Call</h3>
              <button
                type="button"
                className={`icon-button ${highlightClose ? "icon-button--alert" : ""}`}
                onClick={closeDialog}
                aria-label="Close booking dialog"
              >
                <CloseIcon className="icon" />
              </button>
            </header>

            <div className="overlay__media overlay__media--booking">
              <iframe
                src="https://calendly.com/ljdstechva/30min"
                title="Schedule a call"
                allow="autoplay"
                loading="lazy"
              />
            </div>
          </article>
        </div>
      )}
    </>
  );
}
