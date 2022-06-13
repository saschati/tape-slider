<h1><img src="https://saschati.github.io/tape-slider-docs/img/logo.png" alt="@saschati/tape-slider" width="400"></h1>

[![NPM version][npm-image]][npm-url] [![npm download][download-image]][download-url] 

[npm-image]: https://img.shields.io/npm/v/@saschati/tape-slider.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@saschati/tape-slider
[download-image]: https://img.shields.io/npm/dm/@saschati/tape-slider.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/@saschati/tape-slider

This is a small library that will allow the elements of your tape to move in a given direction at different speeds,
and with the effect of teleportation, with the ability to specify timing function for motion like on the Bezier curve.
Read the [documentation and demo](https://saschati.github.io/tape-slider-docs/index.html).

## Before use:
 - This plugin does not style the tape container and its internal blocks, but only makes them move.
 - For the teleportation effect, the plugin creates a copy of the element, which simulates the element from the other end, after the full passage of the tape, the original element is moved to the place of copy.
 - Due to the fact that the plugin calculates the distances for the path, you need to follow some style rules for the correct use of the plugin, which are described [below](https://saschati.github.io/tape-slider-docs/#styling-tips).
 - If you need a simple slider, it is better to choose another plugin.

## Install:
```
npm i @saschati/tape-slider
```

## Usage:
```
import Tape from "@saschati/tape-slider";

// This event is required for the plugin to work correctly
window.addEventListener('load', function () {
   // By default, the ribbon moves to the right
   const tape = new Tape({wrapper: document.querySelector('.tape')});

   tape.run();
});
```

## Advanced:
```
// Tape direction classes, they implement methods for calculating and distance to the desired point
import Right from "@saschati/tape-slider/src/direction/right";
import Left from "@saschati/tape-slider/src/direction/left";
import Up from "@saschati/tape-slider/src/direction/up";
import Down from "@saschati/tape-slider/src/direction/down";
// Offset classes, these classes are responsible for reproducing the movement of the object in the tape
import ShiftY from "@saschati/tape-slider/src/direction/shifx/shift-y";
import ShiftX from "@saschati/tape-slider/src/direction/shifx/shift-x";
// A linear function for calculating how progress should be calculated
import linage from "@saschati/tape-slider/src/animate/timing/linage";
// The class of the tape itself
import Tape from "@saschati/tape-slider";

// This event is required for the plugin to work correctly
window.addEventListener('load', function () {
    const tape = new Tape({
        wrapper: document.querySelector('.tape'), // The wrapper field must be a DOM Element object
        direction: Right, // "Right | Left | Up | Down" The field responsible for the direction currently has 4 directions, by default Right
        options: {
            shift: ShiftX, // "ShiftX | ShiftY" The field responsible for the movement of the ribbon for horizontal is ShiftX and vertical ShiftY
            duration: 20000, // The field responsible for the scroll speed of the tape, the default is 20000
            timing: linage, // This field is responsible for linear functions for which time will be calculated according to the example of cubic-bezier from css
            insert: 'append' // The field responsible for the method of adding clones to the tape is required in some cases which will be described below
        }
    });

    // Run tape
    tape.run();
});
```

You can find **documentation** and examples of usage at the [link](https://saschati.github.io/tape-slider-docs/index.html).

## worth to know:
Before using the plugin, you should know some of its behavior/bugs that may be the reason for not using this library at this time.
Problems will be solved as a way is found, and the author has free time.
If there is a problem in this section, then it has not been solved yet :)
You can view the list at the [link](https://saschati.github.io/tape-slider-docs/peculiarity.html).
