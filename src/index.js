import linage from './animate/timing/linage';
import ShiftX from './direction/shifx/shift-x';
import Right from './direction/right';
import State from './chunk/state';
import Animate from './animate/animate'

export default class Tape {
    /**
     * Plugin options
     *
     * @type {
     *  {
     *      duration: number,
     *      timing: (function(*): *)|*,
     *      shift: ShiftX,
     *      insert: string,
     *      animate: Animate
     *      elasticDistance: boolean
     *   }
     * }
     */
    options = {
        /**
         * Tape speed
         */
        duration: 20000,
        /**
         * Time function for animations when moving the ribbon
         */
        timing: linage,
        /**
         * The animation class that will perform the animation action
         */
        animate: Animate,
        /**
         * The method of adding a clone to the tape
         */
        insert: 'append',
        /**
         * The class responsible for the output of the tape
         */
        shift: ShiftX,
        /**
         * Whether to calculate the length of the tape that you need to pass the elements given the size of its content
         */
        elasticDistance: true,
    }

    /**
     * Plugin status
     *
     * @type {string}
     */
    state = State.UNSPECIFIED;

    /**
     * Collection of directions with the value of the ribbon element and its direction
     *
     * @type {WeakMap<Element, Right>}
     */
    directionCollection = new WeakMap();

    /**
     * A collection of animations with the value of direction and animation that is responsible for this direction
     *
     * @type {WeakMap<Right, Animate>}
     */
    animateCollection = new WeakMap();

    /**
     * @param {Element} wrapper
     * @param {Right} direction
     * @param {
     *  {
     *      duration: number,
     *      timing: (function(*): *)|*,
     *      shift: ShiftX,
     *      insert: string,
     *      animate: animate
     *   }
     * } options
     */
    constructor({wrapper, direction = Right, options = {}}) {
        this.wrapper = wrapper;
        this.direction = direction;

        Object.assign(this.options, options);
    }

    /**
     * A public method that runs the entire tape
     *
     * @return {Promise<void>}
     */
    async run() {
        if (this.state !== State.UNSPECIFIED) {
            throw new Error(`The feed is currently running and its status does not match the uncertainty. Current status of the tape: '${this.state}'`);
        }

        this.state = State.START;
        this.tapeAbort = new AbortController();

        const shift = new this.options.shift();

        this.items = this.direction.sort(this.wrapper.children);
        const distance = this.getDistance(shift);

        this.events();

        this.items.forEach(item => this.moveTapeItem(new this.direction({item, distance, shift})));

        this.state = State.WORK;
    }

    /**
     * Public method that will suspend the tape
     *
     * @return {Promise<void>}
     */
    async pause() {
        if (State.WORK !== this.state) {
            throw new Error(`The tape does not move so it cannot be stopped. Current status of the tape: '${this.state}'`);
        }

        this.state = State.PAUSE;

        this.items.forEach(item => {
            const direction = this.directionCollection.get(item);
            const animation = this.animateCollection.get(direction);

            animation.wait();
        });
    }

    /**
     * Public method for removing tape from pause
     *
     * @return {void}
     */
    async unpause() {
        if (this.state !== State.PAUSE) {
            throw new Error(`The tape is not paused at this time. Current status of the tape: '${this.state}'`);
        }

        this.state = State.WORK;

        this.items.forEach(item => {
            const direction = this.directionCollection.get(item);
            const animation = this.animateCollection.get(direction);

            animation.continue();
        });
    }

    /**
     * Destroy the plug-in environment, used when switching between windows, and can be useful after adding and removing ribbon dynamically
     *
     * @return {void}
     */
    destroy() {
        if (this.state === State.UNSPECIFIED) {
            throw new Error('The plugin has not yet started, there is nothing to destroy.');
        }

        this.tapeAbort.abort();

        this.directionCollection = new WeakMap();
        this.animateCollection = new WeakMap();

        this.state = State.UNSPECIFIED;
    }

    /**
     * A private method for setting baseline tape events
     *
     * @return {void}
     */
    events() {
        const signal = this.tapeAbort.signal;

        this.wrapper.addEventListener('tape-animate-clone', evt => {
            const direction = evt.detail.direction;

            direction.showClone((clone) => {
                this.wrapper[this.options.insert](clone);
            });
        }, {signal});
        this.wrapper.addEventListener('tape-animate-end', evt => {
            const direction = evt.detail.direction;

            this.moveTapeItem(direction);
        }, {signal});
    }

    /**
     * A private method that runs a tape animation
     *
     * @param direction
     *
     * @return {Promise<void>}
     */
    async moveTapeItem(direction) {
        const animation = new this.options.animate({
            duration: this.options.duration,
            timing: this.options.timing,
            draw: progress => direction.progress(progress)
        });

        this.directionCollection.set(direction.getItem(), direction);
        this.animateCollection.set(direction, animation);

        animation.begin();
    }

    /**
     * A private method that determines the length of the tape according to which offset line
     *
     * @param {ShiftX} shift
     * @return {number}
     */
    getDistance(shift) {
        let distance;

        const getItemDistance = (positionProperty = 'offsetLeft', sizeProperty = 'offsetWidth') => {
            const [itemFirst] = this.items;
            const itemLast = this.items[this.items.length - 1];

            const firstDistance = itemFirst[positionProperty] + itemFirst[sizeProperty];
            const lastDistance = itemLast[positionProperty] + itemLast[sizeProperty];

            return firstDistance > lastDistance ? firstDistance : lastDistance;
        }

        if (shift instanceof ShiftX) {
            distance = this.wrapper.clientWidth;

            if (this.options.elasticDistance === true) {
                const itemDistance = getItemDistance();

                if (itemDistance > distance) {
                    distance = itemDistance;
                }
            }

            return distance;
        }

        distance = this.wrapper.clientHeight;

        if (this.options.elasticDistance === true) {
            const itemDistance = getItemDistance('offsetTop', 'offsetHeight');

            if (itemDistance > distance) {
                distance = itemDistance;
            }
        }

        return distance;
    }
}