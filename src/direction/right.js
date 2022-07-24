import Direction from "./direction";
export default class Right extends Direction {
    getNeedDistance() {
        return this.distance - this.item.offsetLeft;
    }
    getTriggerDistance() {
        return this.needDistance - this.item.offsetWidth;
    }
    getDistance() {
        return this.distance;
    }
    getNewPassed() {
        return -this.item.offsetLeft;
    }
    getClonePassed() {
        return -this.clone.offsetLeft - this.clone.offsetWidth - this.step;
    }
    getStep() {
        return this.proggressed - this.prevProggressed;
    }
    isFinished() {
        return super.isFinished() && this.proggressed >= this.needDistance;
    }
    isTrigger() {
        return super.isTrigger() && this.proggressed > this.triggerDistance;
    }
    static sort(items) {
        return super.sort(items).reverse();
    }
}
