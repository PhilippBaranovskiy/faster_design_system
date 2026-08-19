import { useEffect } from 'react';

type BodyStyleProperty = 'left' | 'overflow' | 'position' | 'right' | 'top' | 'width';

type ScrollLockSnapshot = {
  scrollX: number;
  scrollY: number;
  styles: Record<BodyStyleProperty, string>;
};

const bodyStyleProperties: BodyStyleProperty[] = [
  'overflow',
  'position',
  'top',
  'left',
  'right',
  'width',
];

let lockCount = 0;
let scrollLockSnapshot: ScrollLockSnapshot | undefined;

/**
 * Prevents document scrolling while preserving the current viewport position.
 *
 * The returned cleanup is reference-counted, so independently mounted overlay
 * components can share the lock without restoring document scrolling early.
 */
export function lockBodyScroll() {
  if (typeof document === 'undefined') {
    return () => undefined;
  }

  const body = document.body;

  if (lockCount === 0) {
    scrollLockSnapshot = {
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      styles: Object.fromEntries(
        bodyStyleProperties.map((property) => [property, body.style[property]]),
      ) as Record<BodyStyleProperty, string>,
    };

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollLockSnapshot.scrollY}px`;
    body.style.left = `-${scrollLockSnapshot.scrollX}px`;
    body.style.right = '0';
    body.style.width = '100%';
  }

  lockCount += 1;
  let released = false;

  return () => {
    if (released) {
      return;
    }

    released = true;
    lockCount -= 1;

    if (lockCount > 0 || !scrollLockSnapshot) {
      return;
    }

    const snapshot = scrollLockSnapshot;

    bodyStyleProperties.forEach((property) => {
      body.style[property] = snapshot.styles[property];
    });
    window.scrollTo(snapshot.scrollX, snapshot.scrollY);
    scrollLockSnapshot = undefined;
  };
}

/** Locks document scrolling for as long as `locked` is true. */
export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    return lockBodyScroll();
  }, [locked]);
}
