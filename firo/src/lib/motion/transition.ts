/**
 * Shared state between the page transition overlay and the page intros,
 * so an incoming page waits for the overlay to lift before it animates in.
 */
export const transitionState = {
    active: false
}

/** Seconds a page intro should wait before playing. */
export const getIntroDelay = (): number => (transitionState.active ? 0.55 : 0.15)
