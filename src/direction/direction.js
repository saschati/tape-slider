export default class Direction {
    constructor({item, distance, shift}) {
        this.item = item;
        this.shift = shift;
        this.distance = distance;
        this.passed = 0;

        this.refresh();
    }

    getNeedDistance() {
        throw new Error('Not implemented');
    }

    getTriggerDistance() {
        throw new Error('Not implemented');
    }

    getDistance() {
        throw new Error('Not implemented');
    }

    getNewPassed() {
        throw new Error('Not implemented');
    }

    getClonePassed() {
        throw new Error('Not implemented');
    }

    getStep() {
        throw new Error('Not implemented');
    }

    isFinished() {
        throw new Error('Not implemented');
    }

    isTrigger() {
        return this.trigger === false;
    }

    progress(progress) {
        this.proggressed = (progress * this.getDistance());

        this.step = this.getStep();
        this.prevProggressed = this.proggressed;

        this.passed += this.step;

        if (this.isTrigger()) {
            this.trigger = true;

            this.item
                .dispatchEvent(
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

        if (this.isFinished() || progress === 1) {
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

    showClone(func) {
        this.clone = this.item.cloneNode(true);

        func(this.clone);

        this.shift.shift(this.clone, this.getClonePassed());
    }

    finished() {
        this.clone.remove();
        this.clone = null;

        this.passed = this.getNewPassed();

        this.shift.shift(this.item, this.passed);

        this.refresh();
    }

    refresh() {
        this.trigger = false;
        this.prevProggressed = 0;
        this.step = 0;
        this.proggressed = 0;

        this.clone = null;
        this.clonePassed = null;

        this.needDistance = this.getNeedDistance();
        this.triggerDistance = this.getTriggerDistance();
    }

    static sort(items) {
        return items;
    }
}