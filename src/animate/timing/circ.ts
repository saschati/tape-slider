export default function circ(timeFraction: number): number {
  return 1 - Math.sin(Math.acos(timeFraction));
}
