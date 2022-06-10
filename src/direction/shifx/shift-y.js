export default class ShiftX {
    shift(item, to) {
        item.style.transform = `translate(0, ${to}px)`;
    }
}