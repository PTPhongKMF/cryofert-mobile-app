import type { Animation } from "@ionic/react";
import { createAnimation } from "@ionic/react";

/**
 * Router animation that slides the entering page:
 * - forward  -> entering comes from RIGHT (translateX(100%) -> 0)
 * - back     -> entering comes from LEFT  (translateX(-100%) -> 0)
 *
 * The leaving page gets a slight offset in the opposite direction for a nice parallax feel.
 *
 * Usage: pass this function as the animation builder to ion-router / useIonRouter().push(...) etc.
 */
const DEFAULT_DURATION = 280;
const DEFAULT_EASING = "cubic-bezier(0.36,0.66,0.04,1)";

const getElementToAnimate = (el: any) =>
  el?.querySelector?.(":scope > .ion-page, :scope > ion-content") ?? el;

export const slideDirectionRouter = (
  baseEl: any,
  opts: any = {},
): Animation => {
  // opts typically contains: enteringEl, leavingEl, direction ('forward'|'back'), progressAnimation
  const enteringEl = getElementToAnimate(opts.enteringEl ?? baseEl);
  const leavingEl = getElementToAnimate(opts.leavingEl);
  const direction = opts.direction === "back" ? "back" : "forward"; // default forward

  const duration = opts.duration ?? DEFAULT_DURATION;
  const easing = opts.easing ?? DEFAULT_EASING;

  // root container animation
  const root = createAnimation()
    .duration(duration)
    .easing(easing);

  // enter animation: from right if forward, from left if back
  const enterFrom = direction === "back" ? "-100%" : "100%";
  const enter = createAnimation()
    .addElement(enteringEl)
    .fromTo("transform", `translateX(${enterFrom})`, "translateX(0%)")
    .fromTo("opacity", "0.01", "1");

  // leaving animation: small offset opposite to enter direction (parallax)
  let leave;
  if (leavingEl) {
    const leaveTo = direction === "back" ? "25%" : "-25%"; // leaving moves slightly right on back, left on forward
    leave = createAnimation()
      .addElement(leavingEl)
      .fromTo("transform", "translateX(0%)", `translateX(${leaveTo})`)
      .fromTo("opacity", "1", "0.01");
    root.addAnimation([enter, leave]);
  } else {
    root.addAnimation(enter);
  }

  // If Ionic asks for a progress-driven animation (swipe-to-go-back), it will set opts.progressAnimation = true.
  // We just return the animation; Ionic will handle progress control. Do NOT call play() here.
  return root;
};
