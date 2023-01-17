# ddSpiral
Produce amazing spirals between objects and along open paths in [Sketch](https:www.sketch.com).

## On the  whislist
- Update shape names in list
- Create spiral
- Make rotation work correctly
- Store spiral path
- Clear stored path on new selection
- Make exception for 2 object spiral -> draw in document instead of parent
- Add squeeze option (see below)
- Update github
- Add buymeacoffee
- Create logo
- Create examples
- Publish

## Dependencies
This is a plugin for [Sketch](https://www.sketch.com)
It was made with [Sketch Plugin Manager](https://github.com/skpm/skpm)

## Installation
Download and double click the plugin. Or drop it on the Sketch app.

## What it does
You can make almost any spiral you want. Just select a maximum of 2 objects and/or an open path and run ddPiral from the plugin menu. The plugin will present you an overlay for adjustments. You can update the spiral as long as you stay in the overlay.

## How it works
You can select 1 or 2 objects and als an open path. The spiral will behave somewhat different accordingly. In any case you can change the direction (clockwise or counterclockwise), the number of rotations (loops), the number of points per loop (tangents), the timing (linear, ease, ease-in or ease-out) and the smoothness (0=sharp, 100=smooth, >100=experimental). Width, height and rotation of both start and finish will be set by the selected object(s). You can change those numbers also.

### 1. Select 1 object, like an image, a group or symbol
If you select a single object, not a path, the spiral will rotate from the bounding box to the center of the object.

### 2. Select 1 closed shape, like a rectangle, oval, star, polygon or any other custom closed path
If you select a single closed path the spiral will be streched from to to bottom and squeezed within the outline of the object. By unchecking the Squeeze option the shape will become a normal object, like #1. By selecting a rectangle, the Squeeze option will be off by default, just to make it  easier to generate a normal spiral and also  because the squeezed spiral within a rectangle isn't that exciting. Squeezed spirals cannot be rotated at forehand. If you need a squeezed spiral in a differnt direction you should first rotate your selected object, then flatten the shape before running ddSPiral.

### 3. Select 1 open path, thus a line
By selecting an open path the spiral will be stretched along the line. The start width, height and rotation will also be used for the end. The second set, normally the end will be used for the half-way-point in this case.

### 4. Select 2 shapes or objects
In this case the spiral will be stretched form the first to the second object, adapting their coordinates, size and rotation. The first object is the one behind all others, not necessarily the one selected first. The spiral will be draw on document level, on top of everything, if both object belong to a different group.

### 5. Select 1 open path and 1 or 2 other shapes or objects
This final option will also stretch the spiral along the route of the path, like #3, but the dimensions will be set by the objects.

## Free but not free
This plugin is free. You can use it as long as the Sketch API will stay unchanged and you may also use it's code for developing your own plugin. If you like it you may also consider [buying me a coffee](https://www.buymeacoffee.com/Mastermek).

_Have fun spiralising and thanks._
