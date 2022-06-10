export default class ShiftX {
    shift(item, to) {
        item.style.transform = `translate(${to}px, 0)`;
    }
}