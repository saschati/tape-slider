import Direction from "./direction";

export default class Left extends Direction {
  protected getNeedDistance(): number {
    return this.item.offsetWidth + this.item.offsetLeft;
  }

  protected getTriggerDistance(): number {
    return this.needDistance - this.item.offsetWidth;
  }

  protected getDistance(): number {
    return this.distance;
  }

  protected getNewPassed(): number {
    return this.distance - this.item.offsetLeft - this.item.offsetWidth;
  }

  protected getClonePassed(): number {
    return this.distance - this.clone!.offsetLeft + Math.abs(this.step);
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
