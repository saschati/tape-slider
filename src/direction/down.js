import Direction from "./direction";

export default class Down extends Direction {
    constructor({item, distance, shift}) {
        super({item, distance, shift});
    }

    /**
     * @returns {number}
     */
    getNeedDistance() {
        return (this.distance - this.item.offsetTop);
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
        return (this.distance);
    }

    /**
     * @returns {number}
     */
    getNewPassed() {
        return (-this.item.offsetTop);
    }

    /**
     * @returns {number}
     */
    getClonePassed() {
        if (this.clonePassed === null) {
            this.clonePassed = (-this.clone.offsetTop - this.clone.offsetHeight - this.step);
        }

        return this.clonePassed;
    }

    /**
     * @returns {number}
     */
    getStep() {
        return Number(this.proggressed - this.prevProggressed);
    }

    /**
     * @returns {boolean}
     */
    isFinished() {
        return (super.isFinished() && (this.proggressed >= this.needDistance));
    }

    /**
     * @returns {boolean}
     */
    isTrigger() {
        return (super.isTrigger() && this.proggressed > this.triggerDistance);
    }

    static sort(items) {
        return Array.from(items).reverse();
    }
}