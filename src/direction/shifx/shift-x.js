export default class ShiftX {
    /**
     * The css method for moving the tape along the x-axis
     *
     * @param {ElementCSSInlineStyle} item
     * @param {number} to
     *
     * @return {void}
     */
    shift(item, to) {
        item.style.transform = `translate(${to}px, 0)`;
    }
}