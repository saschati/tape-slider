export default interface Shift {
    /**
     * The css method for moving the tape along the axis.
     */
    shift(item: ElementCSSInlineStyle, to: number): void;
}