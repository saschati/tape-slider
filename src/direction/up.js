import Direction from "./direction";

export default class Up extends Direction {
    constructor({item, distance, shift}) {
        super({item, distance, shift});
    }

    /**
     * @returns {number}
     */
    getNeedDistance() {
        return (this.item.offsetHeight + this.item.offsetTop);
    }

    /**
     * @returns {number}
     */
    getTriggerDistance() {
        return (this.needDistance - this.item.offsetHeight);
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
        return (this.distance - this.item.offsetTop - this.item.offsetHeight);
    }

    /**
     * @returns {number}
     */
    getClonePassed() {
        if (this.clonePassed === null) {
            this.clonePassed = (this.distance - this.clone.offsetTop);
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