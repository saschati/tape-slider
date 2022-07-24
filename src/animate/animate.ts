export default class Animate {
  protected readonly duration: number;
  protected readonly timing: (timeFraction: number) => number;
  protected readonly draw: (progress: number) => boolean;

  protected prevTF: number = 0;
  protected isStop: boolean = false;
  protected start: number = 0;

  protected timeFraction: number = 0;
  protected time: number = 0;

  constructor({
    duration,
    timing,
    draw,
  }: {
    duration: number;
    timing: (timeFraction: number) => number;
    draw: (progress: number) => boolean;
  }) {
    this.duration = duration;
    this.timing = timing;
    this.draw = draw;
  }

  /**
   * Launch the animation at the start of the tape
   */
  begin(): void {
    this.start = performance.now();

    requestAnimationFrame(this.animation.bind(this));
  }

  /**
   * Pause animation
   */
  wait(): void {
    if (this.isStop) {
      throw new Error("The animation is currently paused.");
    }

    this.isStop = true;
  }

  /**
   * Continue the animation from the moment the pause was made
   */
  continue(): void {
    if (!this.isStop) {
      throw new Error("The animation is not paused.");
    }

    this.isStop = false;

    this.start = performance.now();
    this.prevTF = this.timeFraction;

    requestAnimationFrame(this.animation.bind(this));
  }

  /**
   * Private element animation calculation function
   */
  animation(time: number): void {
    if (this.isStop) {
      return;
    }

    this.time = time;
    this.timeFraction = this.prevTF + (this.time - this.start) / this.duration;

    if (this.timeFraction > 1) {
      this.timeFraction = 1;
    }

    const progress: number = this.timing(this.timeFraction);

    if (this.draw(progress) && this.timeFraction < 1) {
      requestAnimationFrame(this.animation.bind(this));
    }
  }
}
