export default class State {
    /**
     * Undefined status when instantiating tape or destroyed plugin
     *
     * @return {string}
     * @constructor
     */
    static get UNSPECIFIED() {
        return 'unspecified';
    }
    /**
     * At the beginning of the initialization of the tape
     *
     * @return {string}
     * @constructor
     */
    static get START() {
        return 'start';
    }
    /**
     * Indicates that the tape is up and running
     *
     * @return {string}
     * @constructor
     */
    static get WORK() {
        return 'work';
    }

    /**
     * Indicates that the tape is paused
     *
     * @return {string}
     * @constructor
     */
    static get PAUSE() {
        return 'pause';
    }
}