export default class Animate {
    constructor({duration, timing, draw}) {
        this.duration = duration;
        this.timing = timing;
        this.draw = draw;

        this.prevTF = 0;
    }

    /**
     * Launch the animation at the start of the tape
     * @return {void}
     */
    begin() {
        this.stop = false;
        this.start = performance.now();

        requestAnimationFrame(this.animation.bind(this));
    }

    /**
     * Pause animation
     *
     * @return {void}
     */
    wait() {
        if (this.stop === true) {
            throw new Error('The animation is currently paused.');
        }

        this.stop = true;
    }

    /**
     * Continue the animation from the moment the pause was made
     *
     * @return {void}
     */
    continue() {
        if (this.stop === false) {
            throw new Error('The animation is not paused.');
        }

        this.stop = false;

        this.start = performance.now();
        this.prevTF = this.timeFraction;

        requestAnimationFrame(this.animation.bind(this));
    }

    /**
     * Private element animation calculation function
     *
     * @param {number} time
     */
    animation(time) {
        if (this.stop === true) {
            return;
        }

        this.time = time;
        this.timeFraction = (this.prevTF + ((this.time - this.start) / this.duration));

        if (this.timeFraction > 1) {
            this.timeFraction = 1;
        }

        let progress =  this.timing(this.timeFraction);

        if (this.draw(progress) && this.timeFraction < 1) {
            requestAnimationFrame(this.animation.bind(this));
        }
    }
}