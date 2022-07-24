import Shift from "./shift";

export default class ShiftX implements Shift {
    /**
     * The css method for moving the tape along the x-axis.
     */
    public shift(item: HTMLElement, to: number): void {
        item.style.transform = `translate3d(${to}px, 0, 0)`;
    }
}