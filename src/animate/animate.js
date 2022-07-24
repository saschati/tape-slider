export default class Animate {
    constructor({ duration, timing, draw, }) {
        this.prevTF = 0;
        this.isStop = false;
        this.start = 0;
        this.timeFraction = 0;
        this.time = 0;
        this.duration = duration;
        this.timing = timing;
        this.draw = draw;
    }
    /**
     * Launch the animation at the start of the tape
     */
    begin() {
        this.start = performance.now();
        requestAnimationFrame(this.animation.bind(this));
    }
    /**
     * Pause animation
     */
    wait() {
        if (this.isStop) {
            throw new Error("The animation is currently paused.");
        }
        this.isStop = true;
    }
    /**
     * Continue the animation from the moment the pause was made
     */
    continue() {
        if (!this.isStop) {
            throw new Error("The animation is not paused.");
        }
        this.isStop = false;
        this.start = performance.now();
        this.prevTF = this.timeFraction;
        requestAnimationFrame(this.animation.bind(this));
    }
    /**
     * Private element animation calculation function
     */
    animation(time) {
        if (this.isStop) {
            return;
        }
        this.time = time;
        this.timeFraction = this.prevTF + (this.time - this.start) / this.duration;
        if (this.timeFraction > 1) {
            this.timeFraction = 1;
        }
        const progress = this.timing(this.timeFraction);
        if (this.draw(progress) && this.timeFraction < 1) {
            requestAnimationFrame(this.animation.bind(this));
        }
    }
}
