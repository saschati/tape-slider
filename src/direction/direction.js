export default class Direction {
    constructor({item, distance, shift}) {
        this.item = item;
        this.shift = shift;
        this.distance = distance;

        this.refresh();
    }

    /**
     * The distance of the element from its beginning to complete concealment
     *
     * @return {number}
     */
    getNeedDistance() {
        throw new Error('Not implemented');
    }

    /**
     * The distance from the element to the first entry into the edge of the tape
     *
     * @return {number}
     */
    getTriggerDistance() {
        throw new Error('Not implemented');
    }

    /**
     * The distance the element needs to come for a full circle
     *
     * @return {number}
     */
    getDistance() {
        throw new Error('Not implemented');
    }

    /**
     * The coordinates of the element to move to the location of the clone
     *
     * @return {number}
     */
    getNewPassed() {
        throw new Error('Not implemented');
    }

    /**
     * The position of the clone when creating and adding to the feed
     *
     * @return {number}
     */
    getClonePassed() {
        throw new Error('Not implemented');
    }

    /**
     * The step with which the tape moves
     *
     * @return {number}
     */
    getStep() {
        throw new Error('Not implemented');
    }

    /**
     * Checks if the tape is over the horizon
     *
     * @return {boolean}
     */
    isFinished() {
        return this.finish === false;
    }

    /**
     * Checks if the tape has reached the horizon
     *
     * @return {boolean}
     */
    isTrigger() {
        return this.trigger === false;
    }

    /**
     * Progress through animation
     *
     * @param {number} progress
     * @return {boolean}
     */
    progress(progress) {
        this.proggressed = (progress * this.getDistance());

        this.step = this.getStep();
        this.prevProggressed = this.proggressed;

        this.passed += this.step;

        if (this.isTrigger()) {
            this.trigger = true;

            this.item.dispatchEvent(
                new CustomEvent('tape-animate-clone', {
                    bubbles: true,
                    detail: {
                        direction: this
                    }
                })
            );
        }

        this.shift.shift(this.item, this.passed);

        if (this.clone) {
            this.clonePassed += this.step;

            this.shift.shift(this.clone, this.clonePassed);
        }

        if (this.isFinished()) {
            this.finished();
        }

        if (progress === 1) {
            this.refresh();

            this.item.dispatchEvent(
                new CustomEvent('tape-animate-end', {
                    bubbles: true,
                    detail: {
                        direction: this
                    }
                })
            );

            return false;
        }

        return true;
    }

    /**
     * The function of creating a clone and adding it to the tape at the specified position
     *
     * @param func
     */
    showClone(func) {
        this.clone = this.item.cloneNode(true);

        func(this.clone);

        this.shift.shift(this.clone, this.getClonePassed());
    }

    /**
     * Hide completely behind the horizon
     *
     * @return {void}
     */
    finished() {
        this.clone.remove();
        this.clone = null;

        this.passed = this.getNewPassed();

        this.shift.shift(this.item, this.passed);

        this.finish = true;
    }

    /**
     * Reset attributes
     *
     * @return {void}
     */
    refresh() {
        this.trigger = false;
        this.finish = false;
        this.passed = 0;
        this.proggressed = 0;
        this.prevProggressed = 0;
        this.step = 0;

        this.clone = null;
        this.clonePassed = null;

        this.needDistance = this.getNeedDistance();
        this.triggerDistance = this.getTriggerDistance();
    }

    /**
     * @return {Element}
     */
    getItem() {
        return this.item;
    }

    /**
     * Return the sorted order of items
     *
     * @param items
     * @return {Element[]}
     */
    static sort(items) {
        return Array.from(items);
    }
}