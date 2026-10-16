"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

type TurnstileAPI = {
  render: (element: HTMLElement, options: {
    sitekey: string;
    action: string;
    theme: "light" | "dark";
    callback: (token: string) => void;
    "expired-callback": () => void;
    "error-callback": () => void;
  }) => string;
  remove: (id: string) => void;
  reset: (id: string) => void;
};

declare global { interface Window { turnstile?: TurnstileAPI } }

export function Turnstile({ siteKey, onChange, resetSignal }: {
  siteKey: string;
  onChange: (token: string) => void;
  resetSignal: number;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<string | null>(null);
  const onChangeRef = useRef(onChange);
  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  const mount = useCallback(() => {
    if (widgetRef.current || !elementRef.current || !window.turnstile) return;
    widgetRef.current = window.turnstile.render(elementRef.current, {
      sitekey: siteKey,
      action: "lead_registration",
      theme: "light",
      callback: (token) => onChangeRef.current(token),
      "expired-callback": () => onChangeRef.current(""),
      "error-callback": () => onChangeRef.current(""),
    });
  }, [siteKey]);

  useEffect(() => {
    mount();
    return () => {
      if (widgetRef.current && window.turnstile) window.turnstile.remove(widgetRef.current);
      widgetRef.current = null;
    };
  }, [mount]);

  useEffect(() => {
    if (resetSignal > 0 && widgetRef.current && window.turnstile) {
      window.turnstile.reset(widgetRef.current);
    }
  }, [resetSignal]);

  return <div className="turnstile-box">
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={mount} />
    <div ref={elementRef} aria-label="Verificación de seguridad" />
  </div>;
}
