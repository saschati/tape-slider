export default class ShiftX {
    /**
     * The css method for moving the tape along the x-axis.
     */
    shift(item, to) {
        item.style.transform = `translate3d(${to}px, 0, 0)`;
    }
}
