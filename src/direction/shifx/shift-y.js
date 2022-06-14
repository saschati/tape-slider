export default class ShiftY {
    /**
     * The css method for moving the tape along the y-axis
     *
     * @param {ElementCSSInlineStyle} item
     * @param {number} to
     *
     * @return {void}
     */
    shift(item, to) {
        item.style.transform = `translate(0, ${to}px)`;
    }
}