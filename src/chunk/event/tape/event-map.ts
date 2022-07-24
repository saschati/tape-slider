import TapeInfo from "./info";

export default interface TapeEventMap {
  tapeAnimateClone: CustomEvent<TapeInfo>;
  tapeAnimateEnd: CustomEvent<TapeInfo>;
}
