import Direction from "./direction";

export default class Right extends Direction {
  protected getNeedDistance(): number {
    return this.distance - this.item.offsetLeft;
  }

  protected getTriggerDistance(): number {
    return this.needDistance - this.item.offsetWidth;
  }

  protected getDistance(): number {
    return this.distance;
  }

  protected getNewPassed(): number {
    return -this.item.offsetLeft;
  }

  protected getClonePassed(): number {
    return -this.clone!.offsetLeft - this.clone!.offsetWidth - this.step;
  }

  protected getStep(): number {
    return this.proggressed - this.prevProggressed;
  }

  protected override isFinished(): boolean {
    return super.isFinished() && this.proggressed >= this.needDistance;
  }

  protected override isTrigger(): boolean {
    return super.isTrigger() && this.proggressed > this.triggerDistance;
  }

  public static override sort(items: HTMLCollection): Array<Element> {
    return super.sort(items).reverse();
  }
}
