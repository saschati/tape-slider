export default class Direction {
    constructor({ item, distance, shift }) {
        this.finish = false;
        this.trigger = false;
        this.proggressed = 0;
        this.step = 0;
        this.prevProggressed = 0;
        this.passed = 0;
        this.needDistance = 0;
        this.triggerDistance = 0;
        this.clone = null;
        this.clonePassed = null;
        this.item = item;
        this.shift = shift;
        this.distance = distance;
        this.refresh();
    }
    /**
     * Checks if the tape is over the horizon.
     */
    isFinished() {
        return this.finish === false;
    }
    /**
     * Checks if the tape has reached the horizon.
     */
    isTrigger() {
        return this.trigger === false;
    }
    /**
     * Hide completely behind the horizon.
     */
    finished() {
        this.clone.remove();
        this.clone = null;
        this.passed = this.getNewPassed();
        this.shift.shift(this.item, this.passed);
        this.finish = true;
    }
    /**
     * Reset attributes.
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
     * Progress through animation.
     */
    progress(progress) {
        this.proggressed = progress * this.getDistance();
        this.step = this.getStep();
        this.prevProggressed = this.proggressed;
        this.passed += this.step;
        if (this.isTrigger()) {
            this.trigger = true;
            this.item.dispatchEvent(new CustomEvent("tapeAnimateClone", {
                bubbles: true,
                detail: {
                    direction: this,
                },
            }));
        }
        this.shift.shift(this.item, this.passed);
        if (this.clone) {
            if (this.clonePassed === null) {
                this.clonePassed = this.getClonePassed();
            }
            this.clonePassed += this.step;
            this.shift.shift(this.clone, this.clonePassed);
        }
        if (this.isFinished()) {
            this.finished();
        }
        if (progress === 1) {
            this.refresh();
            this.item.dispatchEvent(new CustomEvent("tapeAnimateEnd", {
                bubbles: true,
                detail: {
                    direction: this,
                },
            }));
            return false;
        }
        return true;
    }
    /**
     * The function of creating a clone and adding it to the tape at the specified position.
     */
    showClone(func) {
        this.clone = this.item.cloneNode(true);
        func(this.clone);
        this.clonePassed = this.getClonePassed();
        this.shift.shift(this.clone, this.clonePassed);
    }
    /**
     * Return current item.
     */
    getItem() {
        return this.item;
    }
    /**
     * Return passed.
     */
    getPassed() {
        return this.passed;
    }
    /**
     * Return the sorted order of items.
     */
    static sort(items) {
        return Array.from(items);
    }
}
