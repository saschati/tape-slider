import type Shift from "./shift";

export default class ShiftY implements Shift {
    /**
     * The css method for moving the tape along the y-axis.
     */
    public shift(item: ElementCSSInlineStyle, to: number): void {
        item.style.transform = `translate3d(0, ${to}px, 0)`;
    }
}