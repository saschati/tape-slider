import linage from "./animate/timing/linage";
import ShiftX from "./direction/shift/shift-x";
import Right from "./direction/right";
import Animate from "./animate/animate";
import Options from "./chunk/options";
import State from "./chunk/state";
import Direction from "./direction/direction";
import Shift from "./direction/shift/shift";
import TapeTarget from "./chunk/event/tape/target";

export default class Tape {
  /**
   * Plugin options.
   */
  protected readonly options: Options = {
    duration: 20000,
    timing: linage,
    animate: Animate,
    insert: "append",
    shift: ShiftX,
    elasticDistance: true,
    optimize: true,
  };

  /**
   * Plugin status.
   */
  protected state: State = State.UNSPECIFIED;

  /**
   * Collection of directions with the value of the ribbon element and its direction.
   */
  protected directionCollection: WeakMap<HTMLElement, Direction> =
    new WeakMap();

  /**
   * A collection of animations with the value of direction and animation that is responsible for this direction.
   */
  animateCollection: WeakMap<Direction, Animate> = new WeakMap();

  /**
   * Tape wrapper with elements.
   */
  protected wrapper: TapeTarget & HTMLElement;

  /**
   * Directions tape.
   */
  protected direction: typeof Direction;

  /**
   * Tape abort events.
   */
  protected tapeAbort?: AbortController;

  /**
   * Tape items.
   */
  protected items?: Array<HTMLElement>;

  /**
   * Tape observer.
   */
  protected observer?: IntersectionObserver;

  constructor({
    wrapper,
    direction = Right,
    options = undefined,
  }: {
    wrapper: TapeTarget & HTMLElement;
    direction: typeof Direction;
    options?: Options;
  }) {
    this.wrapper = wrapper;
    this.direction = direction;

    Object.assign(this.options, options ?? {});
  }

  /**
   * A public method that runs the entire tape.
   */
  public async run(): Promise<void> {
    if (this.state !== State.UNSPECIFIED) {
      throw new Error(
        `The feed is currently running and its status does not match the uncertainty. Current status of the tape: '${this.state}'`
      );
    }

    this.state = State.START;
    this.tapeAbort = new AbortController();

    const shift: Shift = new (this.options.shift as any)();

    this.items = this.direction.sort(this.wrapper.children) as HTMLElement[];
    const distance = this.getDistance(shift);

    this.events();

    this.items.forEach((item) =>
      this.moveTapeItem(new (this.direction as any)({ item, distance, shift }))
    );

    if (this.options.optimize === true) {
      this.observer = new IntersectionObserver(
        ([entity]: IntersectionObserverEntry[]): void => {
          if (entity?.isIntersecting === true) {
            if (this.state === State.WORK) {
              return;
            }

            this.resume();
          } else {
            if (this.state === State.PAUSE) {
              return;
            }

            this.pause();
          }
        }
      );

      this.observer.observe(this.wrapper);
    }

    this.state = State.WORK;
  }

  /**
   * Public method that will suspend the tape.
   */
  public async pause(): Promise<void> {
    if (State.WORK !== this.state) {
      throw new Error(
        `The tape does not move so it cannot be stopped. Current status of the tape: '${this.state}'`
      );
    }

    this.state = State.PAUSE;

    this.items!.forEach((item) => {
      const direction: Direction = this.directionCollection.get(
        item
      ) as Direction;
      const animation: Animate = this.animateCollection.get(
        direction
      ) as Animate;

      animation.wait();
    });
  }

  /**
   * Public method for removing tape from pause.
   */
  public async resume(): Promise<void> {
    if (this.state !== State.PAUSE) {
      throw new Error(
        `The tape is not paused at this time. Current status of the tape: '${this.state}'`
      );
    }

    this.state = State.WORK;

    this.items!.forEach((item) => {
      const direction: Direction = this.directionCollection.get(
        item
      ) as Direction;
      const animation: Animate = this.animateCollection.get(
        direction
      ) as Animate;

      animation.continue();
    });
  }

  /**
   * Destroy the plug-in environment, used when switching between windows, and can be useful after adding and removing ribbon dynamically.
   */
  public destroy(): void {
    if (this.state === State.UNSPECIFIED) {
      throw new Error(
        "The plugin has not yet started, there is nothing to destroy."
      );
    }

    this.tapeAbort!.abort();
    this.observer?.disconnect();

    this.directionCollection = new WeakMap();
    this.animateCollection = new WeakMap();


    this.state = State.UNSPECIFIED;
  }

  /**
   * A private method for setting baseline tape events.
   */
  protected events(): void {
    const signal = this.tapeAbort!.signal;

    this.wrapper.addEventListener(
      "tapeAnimateClone",
      (evt) => {
        const direction = evt.detail.direction;

        direction.showClone((clone: HTMLElement): void => {
          (this.wrapper as ParentNode)[this.options.insert](clone);
        });
      },
      { signal }
    );
    this.wrapper.addEventListener(
      "tapeAnimateEnd",
      (evt) => {
        const direction = evt.detail.direction;

        this.moveTapeItem(direction);
      },
      { signal }
    );
  }

  /**
   * A private method that runs a tape animation.
   */
  protected async moveTapeItem(direction: Direction): Promise<void> {
    const animation = new this.options.animate({
      duration: this.options.duration,
      timing: this.options.timing,
      draw: (progress) => direction.progress(progress),
    });

    this.directionCollection.set(direction.getItem(), direction);
    this.animateCollection.set(direction, animation);

    animation.begin();
  }

  /**
   * A private method that determines the length of the tape according to which offset line.
   */
  protected getDistance(shift: Shift): number {
    let distance;

    const getItemDistance = (
      positionProperty: "offsetTop" | "offsetLeft" = "offsetLeft",
      sizeProperty: "offsetHeight" | "offsetWidth" = "offsetWidth"
    ): number => {
      if (!(this.items!.length > 0)) {
        return 0;
      }

      const [itemFirst] = this.items as HTMLElement[];
      const itemLast = this.items![this.items!.length - 1] as HTMLElement;

      const firstDistance =
        itemFirst![positionProperty] + itemFirst![sizeProperty];
      const lastDistance = itemLast[positionProperty] + itemLast[sizeProperty];

      return firstDistance > lastDistance ? firstDistance : lastDistance;
    };

    if (shift instanceof ShiftX) {
      distance = this.wrapper.clientWidth;

      if (this.options.elasticDistance === true) {
        const itemDistance = getItemDistance();

        if (itemDistance > distance) {
          distance = itemDistance;
        }
      }

      return distance;
    }

    distance = this.wrapper.clientHeight;

    if (this.options.elasticDistance === true) {
      const itemDistance = getItemDistance("offsetTop", "offsetHeight");

      if (itemDistance > distance) {
        distance = itemDistance;
      }
    }

    return distance;
  }
}
