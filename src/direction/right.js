import Direction from "./direction";

export default class Right extends Direction {
    constructor({item, distance, shift}) {
        super({item, distance, shift});
    }

    /**
     * @returns {number}
     */
    getNeedDistance() {
        return (this.distance - this.item.offsetLeft);
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
        return (-this.item.offsetLeft);
    }

    /**
     * @returns {number}
     */
    getClonePassed() {
        if (this.clonePassed === null) {
            this.clonePassed = (-this.clone.offsetLeft - this.clone.offsetWidth - this.step);
        }

        return this.clonePassed;
    }

    /**
     * @returns {number}
     */
    getStep() {
        return (this.proggressed - this.prevProggressed);
    }

    /**
     * @returns {boolean}
     */
    isFinished() {
        return (super.isFinished() && this.proggressed >= this.needDistance);
    }

    /**
     * @returns {boolean}
     */
    isTrigger() {
        return (super.isTrigger() && this.proggressed > this.triggerDistance);
    }

    static sort(items) {
        return super.sort(items).reverse();
    }
}