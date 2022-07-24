import Animate from "../animate/animate";
import ShiftX from "../direction/shift/shift-x";
import ShiftY from "../direction/shift/shift-y";

export default interface Options {
  /**
   * Tape speed.
   */
  duration: number;

  /**
   * Time function for animations when moving the ribbon.
   */
  timing: (timeFraction: number) => number;

  /**
   * The animation class that will perform the animation action.
   */
  animate: typeof Animate;

  /**
   * The method of adding a clone to the tape.
   */
  insert: "append" | "prepend";

  /**
   * The class responsible for the output of the tape.
   */
  shift: typeof ShiftX | typeof ShiftY;

  /**
   * Whether to calculate the length of the tape that you need to pass the elements given the size of its content.
   */
  elasticDistance: boolean;

  /**
   * To optimize the work of the plugin, when the option is active, an observer will be thrown on the tape object relative to the window, when the user is not looking at the tape, it will not move.
   */
  optimize: boolean;
}
