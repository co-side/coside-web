import { useEffect, useRef } from "react";

interface UseIntersectionObserverParams {
  hasNext: boolean;
  onNext: () => void;
}

export const useIntersectionObserver = ({ hasNext, onNext }: UseIntersectionObserverParams) => {
  const nextPageElement = useRef<HTMLDivElement>(null)
  const observerStateRef = useRef({ hasNext, onNext });

  useEffect(() => {
    observerStateRef.current.hasNext = hasNext
    observerStateRef.current.onNext = () => onNext()
  }, [hasNext, onNext])

  useEffect(() => {
    const el = nextPageElement.current
    if (!el) {
      return
    }
    window.scrollTo(0, 0);
    const observer = new IntersectionObserver(
      (entries) => {
        const ref = observerStateRef.current
        entries.forEach(() => {
          if (ref.hasNext) ref.onNext()
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => {
      if (el) {
        observer.unobserve(el);
      }
    };
  }, [])

  return {
    ref: nextPageElement,
  }
}