export default class ShiftY {
    /**
     * The css method for moving the tape along the y-axis.
     */
    shift(item, to) {
        item.style.transform = `translate3d(0, ${to}px, 0)`;
    }
}
