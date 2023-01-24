# ddSpiral
Produce amazing spirals between objects and along open paths in [Sketch](https:www.sketch.com).

## TODO's
check - sent all data to webview and back (location info and target.id)
check - Create spiral
check - Plugin setting
check - var theme = UI.getTheme();if (theme === 'dark') {} else {}
check - Make rotation work correctly
check - Store spiral path
check - Clear stored path on new selection
check - Make exception for 2 object spiral -> draw in document instead of parent
check - Add buymeacoffee
- Add squeeze (force) option (see below)
- Update github
- Create logo
- Create examples
- Publish

## Dependencies
This is a plugin for Sketch, so you need [Sketch](https://www.sketch.com). No other tool needed.

It was created with Sketch Plugin Manager, so if you use the source code you'll probably need [SKPM](https://github.com/skpm/skpm) too.

## Installation
Download and double-click the plugin. Or drop it on the Sketch app. 

## What it does
You can make almost any spiral you want. Just select up to 2 objects and/or an open path and run ddSpiral from the plugin menu. The plugin presents you with an overlay for adjustments. You can update the spiral as long as you stay in the overlay.

## How it works
You can select up to 2 objects and an open path. The spiral will behave slightly differently accordingly. In any case, you can change the direction (clockwise or counterclockwise), the number of rotations (loops), the number of points per loop (tangents), the timing (linear, ease, ease-in or ease-out) and change the smoothness (0=sharp, 100=smooth, >100=experimental). The size and rotation of both start and finish is determined by the selected object(s), but you can also change these numbers.

### 1. Select a singel object, like an image, a group or symbol
If you select a single object, not a path, the spiral rotates from the bounding box to the center of the object. It is drawn on top of the object in the same group.

![Screenshot](single-object.svg)

### 2. Select a closed shape, like a rectangle, oval, star, polygon or any other custom closed path
Selecting a single closed path is basically the same as #1 but the option 'Force spiral into shape' becomes available. Once checked, the spiral extends from top to bottom, staying within the outline of the object as much as possible rather than inside the bounding box. If you need a forced spiral in a different direction within the closed shape, you must first rotate your selected object and then flatten the shape before running ddSpiral.

### 3. Select an open path, thus a line
Choosing an open path stretches the spiral along that line. The start size and rotation are also used for the end. The second set, normally the end, is used for the halfway point in this case.

### 4. Select two shapes or objects
The spiral is stretched from the first object to the second, using their coordinates, size and rotation. The first object is the object behind all others, not necessarily the first selected object. The spiral is drawn at the document level, on top of everything, if both objects belong to a different group.

### 5. Select an open path and 1 or 2 other shapes or objects
This last option will also stretch the spiral along the path's route, like #3, but the dimensions are determined by the selected objects.

## Bugs and known issues
The plugin should be bug free. If you find one, let me know! There is a known issues though. Paths are made with bézier curves. The smoothness depends on both the number of loops and the number of points per loop. If one of them is too low, you can get unexpected bends. Especially if the route along an open path contains sharp turns. Try changing the path, the number of loops and points for a better result. Updating the tangents manually later is of course also an option.

## Free
This plugin is free. You can use it as long as the Sketch API remains unchanged and you can also use the code to develop your own plugin. The code is as consistent as possible. ddSpiral was my first plugin and the Sketch API documentation is, well, as good as it gets. Important bits and pieces are missing, the examples that exist online are mostly outdated, and the forum has recently been abandoned. Fortunately, there are quite a few well-written example plugins around that you can learn from also.

If you like it you may also consider [buying me a coffee](https://www.buymeacoffee.com/Mastermek).

Have fun and thanks.
Mek
