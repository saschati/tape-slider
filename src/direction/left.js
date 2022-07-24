import Direction from "./direction";
export default class Left extends Direction {
    getNeedDistance() {
        return this.item.offsetWidth + this.item.offsetLeft;
    }
    getTriggerDistance() {
        return this.needDistance - this.item.offsetWidth;
    }
    getDistance() {
        return this.distance;
    }
    getNewPassed() {
        return this.distance - this.item.offsetLeft - this.item.offsetWidth;
    }
    getClonePassed() {
        return this.distance - this.clone.offsetLeft + Math.abs(this.step);
    }
    getStep() {
        return -(this.proggressed - this.prevProggressed);
    }
    isFinished() {
        return super.isFinished() && 0 >= this.needDistance + this.passed;
    }
    isTrigger() {
        return super.isTrigger() && 0 > this.triggerDistance + this.passed;
    }
}
