import linage from './animate/timing/linage';
import animate from './animate/animate';
import ShiftX from './direction/shifx/shift-x';
import Right from './direction/right';

export default class Tape {
    /**
     * @type {
     *  {
     *      duration: number,
     *      timing: (function(*): *)|*,
     *      shift: ShiftX,
     *      insert: string,
     *      animate: animate
     *   }
     * }
     */
    options = {
        duration: 20000,
        timing: linage,
        animate: animate,
        insert: 'append',
        shift: ShiftX,
    }

    /**
     * @param DOMElement wrapper
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

    run() {
        const shift = new this.options.shift();
        const distance = shift instanceof ShiftX ? this.wrapper.clientWidth : this.wrapper.clientHeight;

        this.items = this.wrapper.children;

        this.events();

        this.each(item => this.moveTapeItem(new this.direction({item, distance, shift})));
    }

    events() {
        this.wrapper.addEventListener('tape-animate-clone', (evt) => {
            const direction = evt.detail.direction;
            direction.showClone((clone) => {
                this.wrapper[this.options.insert](clone);
            });
        });

        this.wrapper.addEventListener('tape-animate-end',  (evt) => {
            const direction = evt.detail.direction;

            direction.finished();

            this.moveTapeItem(direction);
        });
    }

    each(func) {
        for (const item of this.direction.sort(this.items)) {
            func(item);
        }
    }

    async moveTapeItem(direction) {
        this.options.animate({
            duration: this.options.duration,
            timing: this.options.timing,
            draw: progress => direction.progress(progress)
        });
    }
}