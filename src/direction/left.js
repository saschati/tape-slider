import Direction from "./direction";

export default class Left extends Direction {
    constructor({item, distance, shift}) {
        super({item, distance, shift});
    }

    /**
     * @returns {number}
     */
    getNeedDistance() {
        return (this.item.offsetWidth + this.item.offsetLeft);
    }

    /**
     * @returns {number}
     */
    getTriggerDistance() {
        return (this.needDistance - this.item.offsetWidth);
    }

    /**
     * @returns {number}
     */
    getDistance() {
        return (this.distance)
    }

    /**
     * @returns {number}
     */
    getNewPassed() {
        return (this.distance - this.item.offsetLeft - this.item.offsetWidth);
    }

    /**
     * @returns {number}
     */
    getClonePassed() {
        if (this.clonePassed === null) {
            this.clonePassed = (this.distance - this.clone.offsetLeft + Math.abs(this.step));
        }

        return this.clonePassed;
    }

    /**
     * @returns {number}
     */
    getStep() {
        return -(this.proggressed - this.prevProggressed);
    }

    /**
     * @returns {boolean}
     */
    isFinished() {
        return (super.isFinished() && (0 >= (this.needDistance + this.passed)));
    }

    /**
     * @returns {boolean}
     */
    isTrigger() {
        return (super.isTrigger() && (0 > (this.triggerDistance + this.passed)));
    }
}
