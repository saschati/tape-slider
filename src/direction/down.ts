import Direction from "./direction";

export default class Down extends Direction {
  protected getNeedDistance(): number {
    return this.distance - this.item.offsetTop;
  }

  protected getTriggerDistance(): number {
    return this.needDistance - this.item.offsetHeight;
  }

  protected getDistance(): number {
    return this.distance;
  }

  protected getNewPassed(): number {
    return -this.item.offsetTop;
  }

  protected getClonePassed(): number {
    return -this.clone!.offsetTop - this.clone!.offsetHeight - this.step;
  }

  protected getStep(): number {
    return Number(this.proggressed - this.prevProggressed);
  }

  protected override isFinished(): boolean {
    return super.isFinished() && this.proggressed >= this.needDistance;
  }

  protected override isTrigger(): boolean {
    return super.isTrigger() && this.proggressed > this.triggerDistance;
  }

  public static override sort(items: HTMLCollection): Array<Element> {
    return Array.from(items).reverse();
  }
}
