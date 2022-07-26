var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import linage from "./animate/timing/linage";
import ShiftX from "./direction/shift/shift-x";
import Right from "./direction/right";
import Animate from "./animate/animate";
import State from "./chunk/state";
export default class Tape {
    constructor({ wrapper, direction = Right, options = undefined, }) {
        /**
         * Plugin options.
         */
        this.options = {
            duration: 20000,
            timing: linage,
            animate: Animate,
            insert: "append",
            shift: ShiftX,
            elasticDistance: true,
            optimize: true,
        };
        /**
         * Plugin status.
         */
        this.state = State.UNSPECIFIED;
        /**
         * Collection of directions with the value of the ribbon element and its direction.
         */
        this.directionCollection = new WeakMap();
        /**
         * A collection of animations with the value of direction and animation that is responsible for this direction.
         */
        this.animateCollection = new WeakMap();
        this.wrapper = wrapper;
        this.direction = direction;
        Object.assign(this.options, options !== null && options !== void 0 ? options : {});
    }
    /**
     * A public method that runs the entire tape.
     */
    run() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== State.UNSPECIFIED) {
                throw new Error(`The feed is currently running and its status does not match the uncertainty. Current status of the tape: '${this.state}'`);
            }
            this.state = State.START;
            this.tapeAbort = new AbortController();
            const shift = new this.options.shift();
            this.items = this.direction.sort(this.wrapper.children);
            this.distance = this.getDistance(shift);
            this.events();
            this.items.forEach((item) => this.moveTapeItem(new this.direction({ item, distance: this.distance, shift })));
            if (this.options.optimize === true) {
                this.observer = new IntersectionObserver(([entity]) => this.optimizeIf((entity === null || entity === void 0 ? void 0 : entity.isIntersecting) === false));
                this.observer.observe(this.wrapper);
            }
            this.state = State.WORK;
        });
    }
    /**
     * Public method that will suspend the tape.
     */
    pause() {
        return __awaiter(this, void 0, void 0, function* () {
            if (State.WORK !== this.state) {
                throw new Error(`The tape does not move so it cannot be stopped. Current status of the tape: '${this.state}'`);
            }
            this.state = State.PAUSE;
            this.items.forEach((item) => {
                const direction = this.directionCollection.get(item);
                const animation = this.animateCollection.get(direction);
                animation.wait();
            });
        });
    }
    /**
     * Public method for removing tape from pause.
     */
    resume() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.state !== State.PAUSE) {
                throw new Error(`The tape is not paused at this time. Current status of the tape: '${this.state}'`);
            }
            this.state = State.WORK;
            this.items.forEach((item) => {
                const direction = this.directionCollection.get(item);
                const animation = this.animateCollection.get(direction);
                animation.continue();
            });
        });
    }
    /**
     * Destroy the plugin environment, used when switching between windows, and can be useful after adding and removing ribbon dynamically.
     */
    destroy() {
        var _a;
        if (this.state === State.UNSPECIFIED) {
            throw new Error("The plugin has not yet started, there is nothing to destroy.");
        }
        this.tapeAbort.abort();
        (_a = this.observer) === null || _a === void 0 ? void 0 : _a.disconnect();
        this.directionCollection = new WeakMap();
        this.animateCollection = new WeakMap();
        this.state = State.UNSPECIFIED;
    }
    /**
     * A private method for setting baseline tape events.
     */
    events() {
        const signal = this.tapeAbort.signal;
        this.wrapper.addEventListener("tapeAnimateClone", (evt) => {
            const direction = evt.detail.direction;
            direction.showClone((clone) => {
                this.wrapper[this.options.insert](clone);
            });
        }, { signal });
        this.wrapper.addEventListener("tapeAnimateEnd", (evt) => {
            const direction = evt.detail.direction;
            this.moveTapeItem(direction);
        }, { signal });
        if (this.options.optimize === true) {
            document.addEventListener("visibilitychange", () => this.optimizeIf(document.visibilityState === "hidden"), {
                signal,
            });
        }
    }
    /**
     * A private method that runs a tape animation.
     */
    moveTapeItem(direction) {
        return __awaiter(this, void 0, void 0, function* () {
            const animation = new this.options.animate({
                duration: this.options.duration,
                timing: this.options.timing,
                draw: direction.progress.bind(direction),
            });
            this.directionCollection.set(direction.getItem(), direction);
            this.animateCollection.set(direction, animation);
            animation.begin();
        });
    }
    /**
     * A private method that determines the length of the tape according to which offset line.
     */
    getDistance(shift) {
        let distance;
        const getItemDistance = (positionProperty = "offsetLeft", sizeProperty = "offsetWidth") => {
            if (!(this.items.length > 0)) {
                return 0;
            }
            const [itemFirst] = this.items;
            const itemLast = this.items[this.items.length - 1];
            const firstDistance = itemFirst[positionProperty] + itemFirst[sizeProperty];
            const lastDistance = itemLast[positionProperty] + itemLast[sizeProperty];
            return firstDistance > lastDistance ? firstDistance : lastDistance;
        };
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
            const itemDistance = getItemDistance("offsetTop", "offsetHeight");
            if (itemDistance > distance) {
                distance = itemDistance;
            }
        }
        return distance;
    }
    /**
     * The tape optimization function turns it on or off as needed by logical definition
     */
    optimizeIf(condition) {
        if (condition === true) {
            if (this.state !== State.WORK) {
                return;
            }
            this.pause();
        }
        else {
            if (this.state !== State.PAUSE) {
                return;
            }
            this.resume();
        }
    }
}
