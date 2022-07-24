import Direction from "./direction";
export default class Down extends Direction {
    getNeedDistance() {
        return this.distance - this.item.offsetTop;
    }
    getTriggerDistance() {
        return this.needDistance - this.item.offsetHeight;
    }
    getDistance() {
        return this.distance;
    }
    getNewPassed() {
        return -this.item.offsetTop;
    }
    getClonePassed() {
        return -this.clone.offsetTop - this.clone.offsetHeight - this.step;
    }
    getStep() {
        return Number(this.proggressed - this.prevProggressed);
    }
    isFinished() {
        return super.isFinished() && this.proggressed >= this.needDistance;
    }
    isTrigger() {
        return super.isTrigger() && this.proggressed > this.triggerDistance;
    }
    static sort(items) {
        return Array.from(items).reverse();
    }
}
