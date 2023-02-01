// Init
const sketch = require('sketch');
const Settings = require('sketch/settings');
const UI = require('sketch/ui');
import BrowserWindow from 'sketch-module-web-view';
import { getWebview, isWebviewPresent, sendToWebview } from 'sketch-module-web-view/remote';

import Vector2d from './ddMath.js';
const uniqueCommIdentifier = 'comm.ddSpiral.webview';
const uniqueSettingIdentifier = 'ddSpiralID';

const _openShapes = ['MSShapePathLayer','MSRectangleShape','MSOvalShape','MSTriangleShape','MSPolygonShape','MSStarShape'];
const openShapes = ['Custom','Rectangle','Oval','Triangle','Polygon','Star'];
const shapeNames = ['custom shape', 'rectangle', 'oval', 'triangle', 'polygon', 'star'];
		
const settingIdentifiers = ['loops', 'points', 'smooth', 'timing', 'power', 'squeeze', 'mirror', 'clockwise', 'auto'];

// Not working with skpm BrowserWindow
// var fiber;

export default function (context) {

	// Keep script alive after js finish
	// if(!fiber) {
	// 	fiber = Async.createFiber();
	// 	fiber.onCleanup(() => {
	// 		UI.cleanup();
	// 	});
	// }

	// Webview options
	const options = {
		identifier: uniqueCommIdentifier,
		width: 240,
		height: 517,
		show: false,
		backgroundColor: '#ffffffff',
		alwaysOnTop: true,
		resizable: false,
		titleBarStyle: 'default',
		maximizable: false,
		minimizable: false
	}
	const browserWindow = new BrowserWindow(options)

	// Only show the window when the page has loaded to avoid a white flash
	browserWindow.once('ready-to-show', () => {
		// Activate plugin
		Settings.setSettingForKey(uniqueSettingIdentifier+'window', true);
		// Show window
		browserWindow.show();
	});

	// Only show the window when the page has loaded to avoid a white flash
	browserWindow.once('close', () => {
		// Deactivate plugin
		Settings.setSettingForKey(uniqueSettingIdentifier+'window', false);
	});

	const webContents = browserWindow.webContents;

	// Do something after page load
	webContents.on('did-finish-load', () => {
		// Handle current selection and tell webview 
		handleSelection();
	});

	// Listener for calls from the webview
	webContents.on('internalRequest', requestData => {
		requestData = JSON.parse(requestData);
		if(requestData.action) {
			switch(requestData.action) {
				case "getSelection":
					// The webview may ask for the current selection
					handleSelection();
					break;
				case "spiralise":
					// The webview may ask for the current selection
					spiral(requestData);
					break;
			}
		}
	});

	// Load webview
	browserWindow.loadURL(require('../resources/webview.html'));
}

// Close webview plugin is shutdown by Sketch
export function onShutdown() {
  const existingWebview = getWebview(uniqueCommIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

// Return message to the corresponding listener in the webview
function respondToWebview(message, listener = 'internalResponse') {
  message = JSON.stringify(message);
  if (isWebviewPresent(uniqueCommIdentifier)) {
    sendToWebview(uniqueCommIdentifier, `${listener}(${message})`);
  }
}

// Listens to Sketch event
export function onSelectionChanged(context) {
	// Forget about context = oldschool
	// Only handle selection changes if plugin is active
	if(Settings.settingForKey(uniqueSettingIdentifier+'window')) {
		handleSelection();
	}
}

// Handle current selection data and send to webview
function handleSelection() {

	// Get selected document and layers from Sketch API
	const document = sketch.getSelectedDocument();
	const selectedLayers = document.selectedLayers.layers;
	
	// Reset spiralID
	Settings.setSettingForKey(uniqueSettingIdentifier, false);

	// Local data collection
	let collection = {
		objects: 0,
		shapes: 0,
		rects: 0,
		paths: 0,
		parentObj: false,
		startObj: false,
		endObj: false
	}
	
	// Collect settings for webview
	let selection = {
		theme: 'light',
		type: 0,
		shape: '',
		clear: false,
		isSpiral: false,
		startID: '',
		endID: '',
		pathID: '',
		parentID: ''
	}
	for(let i in settingIdentifiers) {
		let getSetting = Settings.settingForKey(uniqueSettingIdentifier+settingIdentifiers[i]);
		selection[settingIdentifiers[i]] = getSetting || getSetting === false ? getSetting : 'undefined';
	}
	let start_val = {
		x:0,
		y:0,
		w:0,
		h:0,
		deg:0,
		worldDeg: 0
	}
	let end_val = {
		x:0,
		y:0,
		w:0,
		h:0,
		deg:0,
		worldDeg: 0
	}

	// Keep track of first object
	var firstObj = true;
	
	// Loop through selected layers and collect start and end values
	for (var i=0; i<selectedLayers.length; i++) {
		// Get the layer
		let selectedLayer = selectedLayers[i];
		// Get layer type
		let typeName = selectedLayer.shapeType;
		
		// Open shape?
		if(openShapes.indexOf(typeName) > -1 && !selectedLayer.closed) {
			// Count paths
			collection.paths ++;
			if(collection.paths == 1) {
				// Is shape spiral
				selection.isSpiral = Settings.layerSettingForKey(selectedLayer, uniqueSettingIdentifier);
				// Store parent
				collection.parentObj = selectedLayer.parent;
				selection.parentID = selectedLayer.parent.id;
				// Get the native Sketch object
				let nativeLayer = selectedLayer.sketchObject;
				// Get the path as CG object
				let path = NSBezierPath.bezierPathWithCGPath(nativeLayer.pathInFrameWithTransforms().CGPath());
				// Set default radius based on length
				let defaultRadius = path.length() / 10;
				defaultRadius = defaultRadius > 50 ? 50 : defaultRadius;
				// Remember paths layer id
				selection.pathID = selectedLayer.id;
				// Use 
				if(firstObj) {
					start_val.w = defaultRadius;
					start_val.h = defaultRadius;
					start_val.deg = Math.degrees( selectedLayer.transform.rotation - 0 );
					end_val.w = defaultRadius;
					end_val.h = defaultRadius;
					end_val.deg = Math.degrees( selectedLayer.transform.rotation - 0 );
				}
			}

		} else {
			// Do we have a closed shape?
			if(openShapes.indexOf(typeName) > -1) {
				collection.shapes ++;
				// Remember the name of the shape
				selection.shape = shapeNames[openShapes.indexOf( typeName )];
				if(typeName == 'Rectangle') collection.rects ++;
			} else {
				// Some other object
				collection.objects ++;
			}
			if(!collection.paths) {
				// Store parent if we don't have a path yet
				collection.parentObj = selectedLayer.parent;
				selection.parentID = selectedLayer.parent.id;
			}
			if(firstObj) { // First object is starting point
				firstObj = false;
				// Store start object parent
				collection.startObj = selectedLayer.parent;
				selection.startID = selectedLayer.id;
				// Store start position, sizenand rotation
				start_val.x = selectedLayer.frame.x + (selectedLayer.frame.width / 2);
				start_val.y = selectedLayer.frame.y + (selectedLayer.frame.height / 2);
				start_val.w = selectedLayer.frame.width * 0.5;
				start_val.h = selectedLayer.frame.height * 0.5;
				start_val.deg = Math.degrees( selectedLayer.transform.rotation - 0 );
				// Store end position, size and rotation
				end_val.x = selectedLayer.frame.x + (selectedLayer.frame.width / 2);
				end_val.y = selectedLayer.frame.y + (selectedLayer.frame.height / 2);
				end_val.w = 0;
				end_val.h = 0;
				end_val.deg = Math.degrees( selectedLayer.transform.rotation - 0 );
				
			} else { // Last object becomes target
				// Store end object parent
				collection.endObj = selectedLayer.parent;
				selection.endID = selectedLayer.id;
				// Update end position, size and rotation
				end_val.x = selectedLayer.frame.x + (selectedLayer.frame.width / 2);
				end_val.y = selectedLayer.frame.y + (selectedLayer.frame.height / 2);
				end_val.w = selectedLayer.frame.width * 0.5;
				end_val.h = selectedLayer.frame.height * 0.5;
				end_val.deg = Math.degrees( selectedLayer.transform.rotation - 0 );
				
			}
		}
	}
	
	// Set selection type
	let o = collection.objects;
	let s = collection.shapes;
	let p = collection.paths;
	let r = collection.rects;
	selection.type = 0;
	if( o==1 && !s && !p ) {
		selection.type = 1; // single object
	} else if( !o && s==1 && !r && !p ) {
		selection.type = 2; // single shape, no rect
	} else if( !o && s==1 && r && !p ) {
		selection.type = 2; // single shape, rect
		// always send type 2, change to 3 in webview if squeeze is true
	} else if( o+s<2 && p==1 ) {
		selection.type = 4; // zero or single object + path (center ease allowed)
	} else if( o+s==2 && !p ) {
		selection.type = 5; // two objects
	} else if( o+s+p==3 && p==1 ) {
		selection.type = 4; // two objects + path (is now same as #4)
	}
	
	// Set world coordinates
	collection.parentObj = worldOrientation(collection.parentObj);
	collection.startObj = worldOrientation(collection.startObj);
	collection.endObj = worldOrientation(collection.endObj);
	
	// Set world rotation for display in webview
	start_val.worldDeg = collection.startObj.r;
	end_val.worldDeg = collection.startObj.r;
	
	// Relocate both objects to document level if parents differ
	if(selection.type == 5 && collection.startObj && collection.endObj && collection.startObj.id != collection.endObj.id) {
		start_val.x += collection.startObj.x;
		start_val.y += collection.startObj.y;
		start_val.deg = Math.degrees(start_val.deg + collection.startObj.r);
		start_val.worldDeg = 0;
		end_val.x += collection.endObj.x;
		end_val.y += collection.endObj.y;
		end_val.deg = Math.degrees(end_val.deg + collection.endObj.r);
		end_val.worldDeg = 0;
		selection.parentID = ''; //collection.endObj.id; // document level
	}
	// Relocate first objects in combination with path
	if(selection.type == 4 && collection.startObj.id && collection.startObj.id != collection.parentObj.id) {
		start_val.x += collection.startObj.x - collection.parentObj.x;
		start_val.y += collection.startObj.y - collection.parentObj.y;
		start_val.deg = Math.degrees(start_val.deg + collection.startObj.r - collection.parentObj.r);
		start_val.worldDeg = collection.parentObj.r;
		if(selection.type == 4 && collection.endObj.id && collection.endObj.id != collection.parentObj.id) {
			end_val.x += collection.endObj.x - collection.parentObj.x;
			end_val.y += collection.endObj.y - collection.parentObj.y;
			end_val.deg = Math.degrees(end_val.deg + collection.endObj.r - collection.parentObj.r);
		} else {
			end_val.deg = start_val.deg;
		}
		end_val.worldDeg = collection.parentObj.r;
	}

	// Pass Sketch theme
	selection.theme = UI.getTheme();
	
	// Set the final message for the webview
	let message = { selection, start_val, end_val };
	
	// Tell webview about selection
	respondToWebview(message, 'setSelection');
	
}

// Set world coordinatates for object in target
function worldOrientation(obj) {
	var coor = {
		id: obj.id ? obj.id : false,
		x: 0,
		y: 0,
		r: 0
	};
	while(obj && obj.name) {
		coor.x += obj.frame.x;
		coor.y += obj.frame.y;
		coor.r += obj.transform.rotation;
		obj = obj.parent;
	};
	return coor;
}

// Create actual spiral
function spiral(data) {

	// Get selected document and layers from Sketch API
	let document = sketch.getSelectedDocument();

	// Passed data from webview
	var ret_start_val = data.start_val;
	var ret_end_val = data.end_val;
	var ret_settings = data.settings;
	
	// Save settings to plugin
	for(let i in settingIdentifiers) {
		Settings.setSettingForKey(uniqueSettingIdentifier+settingIdentifiers[i], ret_settings[settingIdentifiers[i]]);
	}
	
	// Preset radius
	var rad = {
		length: new Vector2d(
			ret_start_val.w,
			ret_start_val.h
		),
		step: new Vector2d(),
		target: new Vector2d(
			ret_end_val.w,
			ret_end_val.h
		),
		total: 0,
		array: []
	}
	// Preset rotation
	var rot = {
		angle: Math.degrees( ret_start_val.deg ),
		step: 0,
		target: Math.degrees( ret_end_val.deg )
	}
	// Preset translation
	var trans = {
		center: new Vector2d(
			ret_start_val.x,
			ret_start_val.y
		),
		step: 0,
		target: new Vector2d(
			ret_end_val.x,
			ret_end_val.y
		),
		total: 0,
		array: []
	}
	
	// Total steps
	var steps = ret_settings.loops * ret_settings.points;

	// Ease timing
	var transition = Math.easePower(ret_settings.timing, ret_settings.power / 35, steps);

	// GAP, fix for half paths from rectangles
	var gap = {
		first: false,
		start: new Vector2d(),
		length: 0
	}
	// Squeeze spiral into shape
	if(ret_settings.squeeze) {

		// Get the shape as js object
		const jsShape = document.getLayerWithID(ret_settings.startID);
		const nativeShape = jsShape.sketchObject;
		// Path from shape object
		const pathInFrame = nativeShape.pathInFrameWithTransforms();
		// Collection of point on path
		let outl = {
			top: false,
			bottom: 0,
			array: []
		}
		// Collect all horizontal max and min points on the path
		for(var j=0; j<=Math.round(pathInFrame.length()); j++) {
			var point = pathInFrame.pointOnPathAtLength( j );
			let x = Math.round(point.x);
			let y = Math.round(point.y);
			
			//GAP
			if(!gap.first) {
				gap.first = new Vector2d( x, y );
			}
			if(x == gap.start.x && y == gap.start.y && j != Math.round(pathInFrame.length())) {
				gap.length++;
			} else if(gap.length > 2 || j == Math.round(pathInFrame.length())) {
				const gapDistance = Math.sqrt( (gap.first.x - gap.start.x)*(gap.first.x - gap.start.x) + (gap.first.y - gap.start.y)*(gap.first.y - gap.start.y) );
				const gapStep = new Vector2d(
					(gap.first.x - gap.start.x) / gapDistance,
					(gap.first.y - gap.start.y) / gapDistance,
				);
				for(let d=0; d<gapDistance; d++) {
					const xx = Math.round( gap.start.x + d * gapStep.x );
					const yy = Math.round( gap.start.y + d * gapStep.y );
					const high = Math.ceil( outl.array[yy] ? xx > outl.array[yy].high ? xx : outl.array[yy].high : xx );
					const low = Math.floor( outl.array[yy] ? xx < outl.array[yy].low ? xx : outl.array[yy].low : xx );
					const radius = (high - low) / 2;
					const center = low + radius;
					outl.array[yy] = {
						high: high,
						low: low,
						center: center,
						radius: radius
					}
				}
				gap.start = new Vector2d( x, y );
				gap.length = 0;
			} else {
				gap.start = new Vector2d( x, y );
				gap.length = 0;
				const high = Math.ceil( outl.array[y] ? x > outl.array[y].high ? x : outl.array[y].high : x );
				const low = Math.floor( outl.array[y] ? x < outl.array[y].low ? x : outl.array[y].low : x );
				const radius = (high - low) / 2;
				const center = low + radius;
				outl.top = y < outl.top || outl.top === false ? y : outl.top;
				outl.bottom = y > outl.bottom ? y : outl.bottom;
				outl.array[y] = {
					high: high,
					low: low,
					center: center,
					radius: radius
				}
			
			}
		};
	
		// Rotation
		rot.angle = 0;
		rot.target = 0;

		// Adjust loop setting
		ret_settings.loops = Math.round(ret_settings.loops) + 0.5;
		
		// Total distance
		let distanceY = rad.length.y;
		let radiusY = (distanceY / (ret_settings.loops + 0));

		// Prepare vertical translation
		const easeRadius = ret_settings.timing == 'linear' ? false : true;
		trans = {
			center: new Vector2d(
				outl.array[outl.top].center,
				outl.top + (easeRadius ? (ret_settings.timing == 'ease' || ret_settings.timing == 'ease-out' ? 0 : radiusY) : radiusY)
			),
			step: 0,
			target: new Vector2d(
				outl.array[outl.bottom].center,
				outl.bottom - (easeRadius ? (ret_settings.timing == 'ease' || ret_settings.timing == 'ease-in' ? 0 : radiusY) : radiusY)
			),
			total: 0,
			array: []
		}
		trans.total = new Vector2d(
			trans.target.x - trans.center.x,
			trans.target.y - trans.center.y
		);
		trans.step = new Vector2d(
			trans.total.x / steps,
			trans.total.y / steps
		);
		
		// Prepare vertical radius
		rad = {
			length: new Vector2d(
				outl.array[outl.top + 1].radius,
				easeRadius ? (ret_settings.timing == 'ease' || ret_settings.timing == 'ease-out' ? 0 : radiusY) : radiusY
			),
			step: new Vector2d(),
			target: new Vector2d(
				outl.array[outl.bottom].radius,
				easeRadius ? (ret_settings.timing == 'ease' || ret_settings.timing == 'ease-in' ? 0 : radiusY) : radiusY
			),
			total: 0,
			array: []
		}

		// Fill translation and radial arrays
		var transTotal = 0;
		var radTotal = 0;
		var largestStep = 0;
		for(var j=0; j<=steps; j++) {
			if(transition) {
				transTotal += transition[j] * trans.total.y;
				var transPoint = new Vector2d(
					ret_start_val.x,
					trans.center.y + transTotal
				);
				radTotal += transition[j];
				var radPoint = new Vector2d(
					rad.length.x,
					radiusY
				);
				if(easeRadius) {
					largestStep = transition[j] > largestStep ? transition[j] : largestStep;
					radPoint.y = transition[j];
				}
			} else {
				var transPoint = new Vector2d(
					ret_start_val.x,
					trans.center.y + j * trans.step.y
				);
				var radPoint = new Vector2d(
					rad.length.x,
					radiusY
				);
			}
			// Seek horizontal position and radius
			var seeker = Math.round(transPoint.y);
			if(outl.array[seeker]) {
				transPoint.x = outl.array[seeker].center;
				radPoint.x = outl.array[seeker].radius;
			}
			// Put points in arrays
			trans.array.push( transPoint );
			rad.array.push( radPoint );

		};

		// Rescale radius to max
		if(easeRadius) {
			for(let i=0; i<rad.array.length; i++) {
				// if(i < rad.array.length - 1) {
				// 	rad.array[i].x = (rad.array[i].x + rad.array[i+1].x) / 2;
				// }
				rad.array[i].y *= (radiusY / largestStep);
			}
		}
	}
	
	// Adjust step settings to user input
	var angle = (ret_settings.clockwise ? 1 : -1) * ret_settings.loops * 360 / steps; // angle per point

	// Rotation
	rot.step = ( Math.degrees(360 + rot.target) - Math.degrees(360 + rot.angle) ); // rotation from first to second object
	if( rot.step > 180 ) {
		rot.step = -(360 - rot.step);
	} else if( rot.step < -180 ) {
		rot.step = 360 + rot.step;
	}
	rot.step /= steps;
	// Translation
	trans.total = new Vector2d(
		trans.target.x - trans.center.x,
		trans.target.y - trans.center.y
	);
	trans.step = new Vector2d(
		trans.total.x / steps,
		trans.total.y / steps
	);

	// Get the points on an open path
	if(ret_settings.pathID != '') {
		// Get the path as js object
		const jsPath = document.getLayerWithID(ret_settings.pathID);
		const nativePath = jsPath.sketchObject;
		// Path object
		const pathInFrame = nativePath.pathInFrameWithTransforms();
		// Step length on path
		const pathStep = pathInFrame.length() / (steps);
		
		// First point at start of line
		point = pathInFrame.pointOnPathAtLength( 0 );
		trans.center = new Vector2d(
			point.x,
			point.y
		);
		if(transition) {
			trans.array.push(new Vector2d(
				point.x,
				point.y,
			));
		}

		var total = 0;
		for(var j=0; j<=steps; j++) {

			if(transition) {
				total += transition[j] * pathInFrame.length();
				var point = pathInFrame.pointOnPathAtLength( total );
			} else {
				var point = pathInFrame.pointOnPathAtLength( pathStep * j );

			}
			trans.array.push(new Vector2d(
				point.x,
				point.y,
			));
		};
	}

	// Radius
	rad.total = new Vector2d(
		rad.target.x - rad.length.x,
		rad.target.y - rad.length.y
	);
	rad.step = new Vector2d(
		rad.total.x / steps,
		rad.total.y / steps
	);
	rad.max = new Vector2d(
		rad.length.x,
		rad.length.y
	);

	// Setup path
	var path = NSBezierPath.bezierPath();

	// Fill path
	for(var s = 0; s <= steps; s++) {

		// Get current radius and scale factor
		var maxRadius = rad.length.x > rad.length.y ? rad.length.x : rad.length.y;
		var scale = new Vector2d(
			rad.length.x / maxRadius,
			rad.length.y / maxRadius
		);

		// Get degree and vector
		var deg = s * angle;
		var vec = new Vector2d(
			Math.sin( Math.rad * deg ) * rad.length.x, 
			Math.cos( Math.rad * deg ) * -rad.length.y
		);

		// Translate and rotate
		vec.add(trans.center);
		vec.rotate(trans.center, -rot.angle);

		// Tangents
		if(ret_settings.smooth) {
			// Tangent factor to current point
			const rotationDelta = rot.step + angle;
			var tangent = Math.tan( Math.PI / ( 2 * (360 / rotationDelta))) / 3 * 4;
			// Tangent length
			var vTangent = deg + 90;
			vTangent = Math.degrees( vTangent );
			var newTangent = new Vector2d(
				Math.sin( Math.rad * vTangent ) * (rad.length.x) * tangent,
				Math.cos( Math.rad * vTangent ) * (-rad.length.y) * tangent
			);
			// Get step factor from tangent
			const a = rad.length.x;
			const b = rad.length.y;
			const h = ( ((a - b) * (a - b)) / ((a + b) * (a + b)) ) * 3;
			const circumference = Math.PI * (a + b) * ( 1 + ( h / ( 10 + Math.sqrt( 4 - h ) )) );
			const tLength = Math.sqrt( (newTangent.x * newTangent.x) + (newTangent.y * newTangent.y) );
			const degInLoops = ret_settings.loops * ret_settings.clockwise ? 360 : -360;
			const rotationInDeg = steps * rot.step;
			const absoluteRotation = degInLoops + rotationInDeg;
			const rotationFactor = degInLoops / absoluteRotation;
			const stepFactor = tLength / (circumference / ret_settings.points) * rotationFactor;
			// Calculate translation vector
			let vTranslate = new Vector2d(0,0);
			if(trans.array.length) {
				if( s != steps ) {
					vTranslate = new Vector2d(
						(trans.array[s+1].x - trans.array[s].x) * stepFactor,
						(trans.array[s+1].y - trans.array[s].y) * stepFactor
					)
				} else { // Repat previous direction for last point
					vTranslate = new Vector2d(
						(trans.array[s].x - trans.array[s-1].x) * stepFactor,
						(trans.array[s].y - trans.array[s-1].y) * stepFactor
					)
				}
			} else {
				if(transition) {
					vTranslate = new Vector2d(
						transition[s] * trans.total.x * stepFactor,
						transition[s] * trans.total.y * stepFactor
					);
				} else {
					vTranslate = new Vector2d(
						trans.step.x * stepFactor,
						trans.step.y * stepFactor
					);
				}
			}
			vTranslate.rotate(new Vector2d(), rot.angle);
			// Add translation vector to tangent
			newTangent.add(vTranslate);

			// Calculate radius vector
			var centerVector2d = new Vector2d(
				vec.x,// - trans.center.x,
				vec.y// - trans.center.y
			);
			centerVector2d.substract(trans.center);
			centerVector2d.rotate(new Vector2d(), rot.angle);
			const radiusAngle = centerVector2d.angle(); // - deg;
			//const radiusAngle = deg;
			if(rad.array.length) {
				if( s != steps ) {
					radiusTangent = new Vector2d(
						(rad.array[s+1].x - rad.array[s].x) * stepFactor,
						(rad.array[s+1].y - rad.array[s].y) * stepFactor
					)
				} else { // Repat previous direction for last point
					radiusTangent = new Vector2d(
						(rad.array[s].x - rad.array[s-1].x) * stepFactor,
						(rad.array[s].y - rad.array[s-1].y) * stepFactor
					)
				}
			} else if(transition) {
				if(ret_settings.type == 4 && ret_settings.mirror) {
					if(s < (transition.length) / 2) {
						var radiusTangent = new Vector2d(
							Math.sin( Math.rad * radiusAngle ) * transition[s * 2] * rad.total.x * 2 * stepFactor, 
							Math.cos( Math.rad * radiusAngle ) * transition[s * 2] * -rad.total.y * 2 * stepFactor
						);
					} else {
						var radiusTangent = new Vector2d(
							Math.sin( Math.rad * radiusAngle ) * -(transition[(transition.length - 1 - s) * 2] * rad.total.x * 2) * stepFactor, 
							Math.cos( Math.rad * radiusAngle ) * -(transition[(transition.length - 1 - s) * 2] * -rad.total.y * 2) * stepFactor
						);
					}
				} else {
					var radiusTangent = new Vector2d(
						Math.sin( Math.rad * radiusAngle ) * transition[s] * rad.total.x * stepFactor, 
						Math.cos( Math.rad * radiusAngle ) * transition[s] * -rad.total.y * stepFactor
					);
				}
			} else {

				if(ret_settings.mirror) {
					if(s < steps / 2) {
						var radiusTangent = new Vector2d(
							Math.sin( Math.rad * radiusAngle ) * rad.step.x * 2 * stepFactor, 
							Math.cos( Math.rad * radiusAngle ) * -rad.step.y * 2 * stepFactor
						);
					} else {
						var radiusTangent = new Vector2d(
							Math.sin( Math.rad * radiusAngle ) * rad.step.x * -2 * stepFactor, 
							Math.cos( Math.rad * radiusAngle ) * -rad.step.y * -2 * stepFactor
						);
					}
				} else {
					var radiusTangent = new Vector2d(
						Math.sin( Math.rad * radiusAngle ) * rad.step.x * stepFactor, 
						Math.cos( Math.rad * radiusAngle ) * -rad.step.y * stepFactor
					);
				}
			}
			// Add radius vector to tangent
			newTangent.add(radiusTangent);

			// Scale according to smoothness
			newTangent.x *= (ret_settings.smooth / 100);
			newTangent.y *= (ret_settings.smooth / 100);

			// Temporary store tangent for next loop
			var tempTangent = new Vector2d(
				newTangent.x,
				newTangent.y
			);

			// Translate and rotate
			newTangent.add(vec);
			newTangent.rotate(vec, -rot.angle + 180);
		
		} else {
			oldTangent = vec;
			newTangent = vec;
			tempTangent = vec;
		}
		
		// Add point to path
		if(!s) {
			// First point
			path.moveToPoint(NSMakePoint(vec.x, vec.y));

		} else {
			// Other points
			//[path curveToPoint:NSMakePoint(vec.x,vec.y) controlPoint1:NSMakePoint(oldTangent.x,oldTangent.y) controlPoint2:NSMakePoint(newTangent.x,newTangent.y)];
			path.curveToPoint_controlPoint1_controlPoint2(NSMakePoint( vec.x, vec.y ), NSMakePoint( oldTangent.x, oldTangent.y ), NSMakePoint( newTangent.x, newTangent.y ));		
		}

		// store tangent for next loop
		var oldTangent = new Vector2d(
			tempTangent.x,
			tempTangent.y
		);

		if((trans.array.length && !s)) { // Forget about first tangent when array is used
			//oldTangent = new Vector2d();
		}

		oldTangent.add(vec);
		oldTangent.rotate(vec, -rot.angle); // vec + rotation

		// Add steps
		rot.angle += rot.step;
		if(trans.array.length) {
			if( s != steps ) {
				trans.center = new Vector2d(
					trans.array[s+1].x,
					trans.array[s+1].y
				)
			}
		} else {
			if(transition) {
				if(ret_settings.type == 4 && ret_settings.mirror) {
					trans.center.x += transition[s] * trans.total.x;
					trans.center.y += transition[s] * trans.total.y;
				} else {
					trans.center.x += transition[s] * trans.total.x;
					trans.center.y += transition[s] * trans.total.y;
				}
			} else {
				trans.center.add(trans.step);
			}
		}
		if(rad.array.length) {
			if( s != steps ) {
				rad.length = new Vector2d(
					rad.array[s+1].x,
					rad.array[s+1].y
				)
			}
		} else {
			if(transition) {
				if(ret_settings.type == 4 && ret_settings.mirror) {// && ret_settings.timing == 'ease') {
					if(s < (transition.length) / 2) {
						rad.length.x += transition[s * 2] * rad.total.x * 2;
						rad.length.y += transition[s * 2] * rad.total.y * 2;
					} else {
						rad.length.x -= transition[(transition.length - 1 - s) * 2] * rad.total.x * 2;
						rad.length.y -= transition[(transition.length - 1 - s) * 2] * rad.total.y * 2;
					}
				} else {
					rad.length.x += transition[s] * rad.total.x;
					rad.length.y += transition[s] * rad.total.y;
				}
			} else {
				if(ret_settings.mirror) {
					if(s < steps / 2) {
						rad.length.x += rad.step.x * 2;
						rad.length.y += rad.step.y * 2;
					} else {
						rad.length.x -= rad.step.x * 2;
						rad.length.y -= rad.step.y * 2;
					}
				} else {
					rad.length.x += rad.step.x;
					rad.length.y += rad.step.y;
				}
			}
		}

	}

	// Finalise path
	var shape = MSShapePathLayer.layerWithPath(MSPath.pathWithBezierPath(path));
	var border = shape.style().addStylePartOfType(1);
	//border.color = MSColor.colorWithRGBADictionary({r: 0.1, g: 0.1, b: 1, a: 1});
	border.thickness = 1;
	shape.style().borderOptions().setLineCapStyle(1);
	// Set layer as type spiral
	Settings.setLayerSettingForKey(shape, uniqueSettingIdentifier, 'spiral');

	// SEEK layer by id to remove it
	var activeSpiral = Settings.settingForKey(uniqueSettingIdentifier)
	if(activeSpiral) {
		let spiralLayer = document.getLayerWithID(activeSpiral);
		spiralLayer.remove();
	}

	// Save new shape id
	Settings.setSettingForKey(uniqueSettingIdentifier, shape.objectID());

	if(ret_settings.parentID != '') {
		// Get the parent as js object
		let parent = document.getLayerWithID(ret_settings.parentID);
		// Make it native
		parent = parent.sketchObject;
		parent.addLayers([shape]);
	} else {
		// Make doc native
		document = document.sketchObject;
		document.currentPage().addLayers([shape]);
	}

	// Clear objects if clear is set
	if(ret_settings.clear) {
		if(ret_settings.pathID != '') {
			let pathId = document.getLayerWithID(ret_settings.pathID);
			pathId.remove();
		}
		if(ret_settings.startID != '') {
			let startID = document.getLayerWithID(ret_settings.startID);
			startID.remove();
		}
		if(ret_settings.endID != '') {
			let endID = document.getLayerWithID(ret_settings.endID);
			endID.remove();
		}
	}
}