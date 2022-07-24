import Direction from "./direction";

export default class Up extends Direction {
  protected getNeedDistance(): number {
    return this.item.offsetHeight + this.item.offsetTop;
  }

  protected getTriggerDistance(): number {
    return this.needDistance - this.item.offsetHeight;
  }

  protected getDistance(): number {
    return this.distance;
  }

  protected getNewPassed(): number {
    return this.distance - this.item.offsetTop - this.item.offsetHeight;
  }

  protected getClonePassed(): number {
    return this.distance - this.clone!.offsetTop;
  }

  protected getStep(): number {
    return -(this.proggressed - this.prevProggressed);
  }

  protected override isFinished(): boolean {
    return super.isFinished() && 0 >= this.needDistance + this.passed;
  }

  protected override isTrigger(): boolean {
    return super.isTrigger() && 0 > this.triggerDistance + this.passed;
  }
}
