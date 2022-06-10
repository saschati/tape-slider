export default function animate({timing, draw, duration}) {
    let start = performance.now();

    requestAnimationFrame(function animate(time) {
        let timeFraction = (time - start) / duration;
        if (timeFraction > 1) {
            timeFraction = 1;
        }

        let progress = timing(timeFraction);

        if (draw(progress) && timeFraction < 1) {
            requestAnimationFrame(animate);
        }
    });
}