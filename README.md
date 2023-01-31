# ddSpiral
Make almost any kind of spiral appear magically in [Sketch](https:www.sketch.com).

![Screenshot](overlay.png)

## TODO's
- check - sent all data to webview and back (location info and target.id)
- check - Create spiral
- check - Plugin setting
- check - var theme = UI.getTheme();if (theme === 'dark') {} else {}
- check - Make rotation work correctly
- check - Store spiral path
- check - Clear stored path on new selection
- check - Make exception for 2 object spiral -> draw in document instead of parent
- check - Add buymeacoffee
- check - Store options like 'Auto update' in a setting
- check - Stable forced spiral
- check - Create logo
- check - Create examples
- Update github
- Publish

## Dependencies
ddSpiral is a plugin for Sketch, so you just need [Sketch](https://www.sketch.com).

The plugin was created with Sketch Plugin Manager, so if you are planning to use the source code you'll probably need [SKPM](https://github.com/skpm/skpm) too. Together with [sketch-module-web-view](https://github.com/skpm/sketch-module-web-view/tree/master/docs) as a bridge between the plugin and the overlay for user input.

## Installation
Download and double-click the latest version. Or drop it on the Sketch app icon. 

## What it does
You can make almost any spiral you can imagine. Just select up to 2 objects and/or an open path and run ddSpiral from the plugin menu. The plugin presents you with an overlay for adjustments.

## How it works
The spiral will behave slightly differently depending on the selected objects. As long as you stay in the overlay you can update the spiral by altering:
- size and rotation (preset by the selected objects)
- direction (clockwise or counterclockwise),
- number of revelutions (loops),
- number of points per loop (tangents),
- curve (0%=sharp corners, 100%=perfect curves, >100%=experimental).
- transition (linear, ease in and out, ease-in or ease-out),
- and (easing) velocity (0%=same as linear, 30%=smooth, 100%=exponetial).

### 1. Select a single object, such as an image, group, or symbol, and then run ddSpiral
If you select 1 object, not a path, the spiral rotates from the bounding box to the center of the object. Position, size and rotation are inherited from the selected object. The spiral is drawn on top of the object in the same group.

![Screenshot](object.svg)

### 2. Select a closed shape, like a rectangle, oval or any other custom closed path, and then run ddSpiral
Selecting a closed path is basically the same as #1 but the experimental option 'Force into shape' becomes available. When checked, the spiral extends from top to bottom, roughly staying within the object's outer perimeter rather than inside the bounding box.

![Screenshot](shape.svg)

### 3. Select an open path, i.e. a line, and then run ddSpiral
Choosing an open path, the spiral will stretch along the route of the line. By optionally selecting 1 or 2 other shapes/objects along with the open path, the size and rotation of these objects will be used as a preset. The option 'Mirror around midpoint' swaps the end point and half way point, creating a symmetrical spiral.

![Screenshot](path.svg)

### 4. Select two shapes or objects, and then run ddSpiral
The spiral is stretched from the first object to the second, using their coordinates, size and rotation. The first object is the object behind all others, not necessarily the first selected object. The spiral is drawn at the document level if both objects belong to a different group.

![Screenshot](objects.svg)

## Additional features
- Automatic update option (you can also press RETURN for a quick update).
- No overhead, the plugin does not respond to events from Sketch as long as the overlay is closed.
- You can leave the overlay open and make a new selection for another spiral.
- Adjustable logarithmic scale for transition options.
- User input is saved for the next spiral.
- Darkmode.

## Perhaps in the next version
- Option to clear the preselected objects.
- Rotating version of the forced spiral.
- Update notice for new versions or other information.

## Known issues
There is a known side effect that you can resolve yourself. Paths are made with bézier curves. The smoothness depends on the length of the path, in combination with the number of loops as well as the number of points per loop. If the combination doesn't match you can get unexpected turns and bends. Especially if the route along an open path contains long or sharp turns. Try changing the path, number of loops or points for a better result. If you set the number of points very high (for example at 100) you can see how the curve should actually run. However, that many points is completely unnecessary. 4 tangents is more than enough in most cases. Manually updating the tangents afterwards is also always an option.

The 'Force into shape' option is a work in progress. For now, the spiral will only run from top to bottom, not in any other direction. You can of course rotate your object before running ddSpiral. Remember, ddSpiral is not very good in tight spaces with many changing diameters, especially at the beginning and end where the direction is indeterminate. Subsequent adjustments are often necessary.

## Do you have any ideas or improvements?
The plugin should be bug free. If you find one, please let me know!

## Have fun
You can use it as long as the Sketch API remains unchanged and you can also use the code to develop your own plugin. The code is not minified with lot's of comments. It was written with the best of knowledge. ddSpiral was my first plugin and the Sketch API documentation is, well, as good as it gets: important bits and pieces are missing, the examples that exist online are mostly outdated and the forum has recently been abandoned. Fortunately, there are quite a few well-written example plugins around that you can learn from also. Don't hesitate to ask your questions.

If you like it you may consider [buying me a coffee](https://www.buymeacoffee.com/Mastermek).

[![Screenshot](coffee.svg)](https://www.buymeacoffee.com/Mastermek)

Thank you for using ddSpiral.
Mek


