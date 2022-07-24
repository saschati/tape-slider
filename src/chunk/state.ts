enum State {
  /**
   * Undefined status when instantiating tape or destroyed plugin.
   */
  UNSPECIFIED = "unspecified",
  /**
   * At the beginning of the initialization of the tape.
   */
  START = "start",
  /**
   * Indicates that the tape is up and running.
   */
  WORK = "work",
  /**
   * Indicates that the tape is paused.
   */
  PAUSE = "pause",
}

export default State;
