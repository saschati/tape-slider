import Direction from "./direction";
export default class Up extends Direction {
    getNeedDistance() {
        return this.item.offsetHeight + this.item.offsetTop;
    }
    getTriggerDistance() {
        return this.needDistance - this.item.offsetHeight;
    }
    getDistance() {
        return this.distance;
    }
    getNewPassed() {
        return this.distance - this.item.offsetTop - this.item.offsetHeight;
    }
    getClonePassed() {
        return this.distance - this.clone.offsetTop;
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
