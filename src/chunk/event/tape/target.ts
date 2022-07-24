import TapeEventMap from "./event-map";
import TapeInfo from "./info";

export default interface TapeTarget extends EventTarget {
  addEventListener<K extends keyof TapeEventMap>(
    type: K,
    listener: (this: TapeInfo, ev: TapeEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof TapeEventMap>(
    type: K,
    listener: (this: TapeInfo, ev: TapeEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}
