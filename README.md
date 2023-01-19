# ddSpiral
Produce amazing spirals between objects and along open paths in [Sketch](https:www.sketch.com).

## TODO's
- sent all data to webview and back (location info and target.id)
- Create spiral
- Plugin setting
- var theme = UI.getTheme();if (theme === 'dark') {} else {}
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

### 2. Select a closed shape, like a rectangle, oval, star, polygon or any other custom closed path
Selecting a single closed path stretches the spiral from top to bottom, squeezing it as far as possible inside the object's outline. Disabling the Squeeze option will make the shape a normal object, such as #1. By selecting a rectangle, the Squeeze option is turned off by default, just to make it easier/faster to generate a normal spiral and also because the squeezed spiral in a rectangle is not as exciting. If you need a squeezed spiral in a different direction, you should first rotate your selected object and then flatten the shape before running ddSpiral.

### 3. Select an open path, thus a line
Choosing an open path stretches the spiral along that line. The start size and rotation are also used for the end. The second set, normally the end, is used for the halfway point in this case.

### 4. Select two shapes or objects
The spiral is stretched from the first object to the second, using their coordinates, size and rotation. The first object is the object behind all others, not necessarily the first selected object. The spiral is drawn at the document level, on top of everything, if both objects belong to a different group.

### 5. Select an open path and 1 or 2 other shapes or objects
This last option will also stretch the spiral along the path's route, like #3, but the dimensions are determined by the selected objects.

## Bugs and known issues
The plugin should be bug free. If you find one, let me know! There are a few known issues though.
- When you run ddSpiral the settings overlay appears. You can then still return to Sketch and update any of the selected objects without loosing the selection. Actions in Sketch are not completely reliable, as objects in Sketch can be updated in different ways, not all of which trigger an action. For instance if you resize a rectangle by pulling the boundaries ddSpiral will get noticed. On the other hand, if you change the size using the inspector ddSpiral will NOT get notified. Luckily this is only a problem if an existing and selected object is changed. Get in the habit of deselecting and reselecting objects after any changes before returning to the ddSpiral overlay. Running ddSpiral again CTRL-SHIFT-S will also always work. Or just don't change any selected object after running ddSpiral and before clicking the Spiralise! button.
- Paths are made with bézier curves. The smoothness depends on both the number of loops and the number of points per loop. If one of them is too low, you can get unexpected bends. Especially if the route along an open path contains sharp turns. Try changing the path, the number of loops and points for a better result. Updating the tangents manually later is of course also an option.

## Free
This plugin is free. You can use it as long as the Sketch API remains unchanged and you can also use the code to develop your own plugin. However, the code is not very consistent. The Sketch API's documentation is as bad as our environmental awareness, to say the least, so it took quite a bit of duct tape to get it to work the way it should. Keep the hood closed and you won't notice.

If you like it you may also consider [buying me a coffee](https://www.buymeacoffee.com/Mastermek).

Have fun and thanks.
Mek
