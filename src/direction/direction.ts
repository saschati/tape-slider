import type Shift from "./shift/shift";

export default abstract class Direction {
  protected item: HTMLElement;
  protected shift: Shift;
  protected distance: number;

  protected finish: boolean = false;
  protected trigger: boolean = false;

  protected proggressed: number = 0;
  protected step: number = 0;
  protected prevProggressed: number = 0;
  protected passed: number = 0;
  protected needDistance: number = 0;
  protected triggerDistance: number = 0;

  protected clone: HTMLElement | null = null;
  protected clonePassed: number | null = null;

  constructor({
    item,
    distance,
    shift,
  }: {
    item: HTMLElement;
    distance: number;
    shift: Shift;
  }) {
    this.item = item;
    this.shift = shift;
    this.distance = distance;

    this.refresh();
  }

  /**
   * The distance of the element from its beginning to complete concealment.
   */
  protected abstract getNeedDistance(): number;

  /**
   * The distance from the element to the first entry into the edge of the tape.
   */
  protected abstract getTriggerDistance(): number;

  /**
   * The distance the element needs to come for a full circle.
   */
  protected abstract getDistance(): number;

  /**
   * The coordinates of the element to move to the location of the clone.
   */
  protected abstract getNewPassed(): number;

  /**
   * The position of the clone when creating and adding to the feed.
   */
  protected abstract getClonePassed(): number;

  /**
   * The step with which the tape moves.
   */
  protected abstract getStep(): number;

  /**
   * Checks if the tape is over the horizon.
   */
  protected isFinished(): boolean {
    return this.finish === false;
  }

  /**
   * Checks if the tape has reached the horizon.
   */
  protected isTrigger(): boolean {
    return this.trigger === false;
  }

  /**
   * Hide completely behind the horizon.
   */
  protected finished(): void {
    this.clone!.remove();
    this.clone = null;

    this.passed = this.getNewPassed();

    this.shift.shift(this.item, this.passed);

    this.finish = true;
  }

  /**
   * Reset attributes.
   */
  protected refresh(): void {
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
  public progress(progress: number): boolean {
    this.proggressed = progress * this.getDistance();

    this.step = this.getStep();
    this.prevProggressed = this.proggressed;

    this.passed += this.step;

    if (this.isTrigger()) {
      this.trigger = true;

      this.item.dispatchEvent(
        new CustomEvent("tapeAnimateClone", {
          bubbles: true,
          detail: {
            direction: this,
          },
        })
      );
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

      this.item.dispatchEvent(
        new CustomEvent("tapeAnimateEnd", {
          bubbles: true,
          detail: {
            direction: this,
          },
        })
      );

      return false;
    }

    return true;
  }

  /**
   * The function of creating a clone and adding it to the tape at the specified position.
   */
  public showClone(func: (clone: HTMLElement) => void): void {
    this.clone = this.item.cloneNode(true) as HTMLElement;

    func(this.clone);

    this.clonePassed = this.getClonePassed();

    this.shift.shift(this.clone, this.clonePassed);
  }

  /**
   * Return current item.
   */
  public getItem(): HTMLElement {
    return this.item;
  }

  /**
   * Return the sorted order of items.
   */
  public static sort(items: HTMLCollection): Array<Element> {
    return Array.from(items);
  }
}
