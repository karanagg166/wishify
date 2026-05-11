import { animate, stagger, createTimeline } from "animejs";

/**
 * Stagger fade-in for canvas layer elements after render
 */
export function animateCanvasLayers(elements: HTMLElement[]): void {
  animate(elements, {
    opacity: [0, 1],
    translateY: [20, 0],
    ease: "outExpo",
    duration: 600,
    delay: stagger(120),
  });
}

/**
 * Particle burst on successful share action
 */
export function particleBurst(container: HTMLElement): void {
  const particles = Array.from({ length: 24 }, () => {
    const el = document.createElement("div");
    el.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: hsl(${Math.random() * 360}, 80%, 60%);
      top: 50%;
      left: 50%;
      pointer-events: none;
      transform: translate(-50%, -50%);
    `;
    container.style.position = "relative";
    container.appendChild(el);
    return el;
  });

  animate(particles, {
    translateX: () => (Math.random() - 0.5) * 240,
    translateY: () => (Math.random() - 0.5) * 240,
    scale: [1, 0],
    opacity: [1, 0],
    ease: "outExpo",
    duration: 900,
    delay: stagger(30),
    onComplete: () => particles.forEach((p) => p.remove()),
  });
}

/**
 * Animated number counter roll (for subscription stats)
 */
export function countUp(element: HTMLElement, to: number): void {
  const obj = { value: 0 };
  animate(obj, {
    value: to,
    ease: "outExpo",
    duration: 1200,
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    },
  });
}

/**
 * Avatar ring pulse animation
 */
export function pulseRing(element: HTMLElement): void {
  const tl = createTimeline({ loop: true });
  tl.add(element, {
    scale: [1, 1.08],
    ease: "inOutSine",
    duration: 800,
    alternate: true,
  });
}
