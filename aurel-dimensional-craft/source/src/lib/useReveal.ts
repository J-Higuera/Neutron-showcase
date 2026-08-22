import { useCallback, useRef } from "react";

// Scroll reveals, JS-owned: elements carry .reveal in markup but are only
// hidden once html.js exists; this hook flips .in when they enter view.
// One shared observer; elements unobserve after their first entrance.

let observer: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!observer) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            observer?.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
  }
  return observer;
}

export function useReveal<T extends HTMLElement>() {
  const prev = useRef<T | null>(null);
  return useCallback((node: T | null) => {
    if (prev.current) getObserver().unobserve(prev.current);
    prev.current = node;
    if (node) getObserver().observe(node);
  }, []);
}
