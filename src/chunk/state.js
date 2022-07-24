var State;
(function (State) {
    /**
     * Undefined status when instantiating tape or destroyed plugin.
     */
    State["UNSPECIFIED"] = "unspecified";
    /**
     * At the beginning of the initialization of the tape.
     */
    State["START"] = "start";
    /**
     * Indicates that the tape is up and running.
     */
    State["WORK"] = "work";
    /**
     * Indicates that the tape is paused.
     */
    State["PAUSE"] = "pause";
})(State || (State = {}));
export default State;
