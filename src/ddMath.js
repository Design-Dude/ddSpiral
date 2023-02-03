// Extend Math //

Math.rad = Math.PI / 180;

Math.degrees = function (deg) {
	return (deg + 360) % 360;
};

Math.factorial = function (num) {
	var rval=1;
	for (var i = 2; i <= num; i++)
		rval = rval * i;
	return rval;
};

Math.triangle = function (num) {
	return (num*(num+1))/2;
};

Math.decimal = function (num, decimal = 0) {
	return Math.round(num * (Math.pow(10, decimal))) / Math.pow(10, decimal);
};
// Circulair easing
Math.ease = function (timing, steps) {
	var transition = {
		start: 0,
		step: 0,
		latter: 0,
		factor: 1,
		points: new Array()
	}
	switch(timing) {
		case "ease":
			transition.step = Math.PI / steps;
			transition.factor = 2;
			break;
		case "ease-in":
			transition.start = Math.PI / 2,
			transition.step = Math.PI / 2 / steps;
			break;
		case "ease-out":
			transition.step = Math.PI / 2 / steps;
			break;
		default:
	}
	if(transition.step) {
		transition.latter = (Math.cos(transition.start) + 1) / transition.factor;
		for(var i = 0; i <= steps; i++) {
			var cos = (Math.cos(transition.start) + 1) / transition.factor;
			var dif = i == 0 ? 0 : Math.abs(cos - transition.latter);
			transition.start += transition.step;
			transition.latter = cos;
			if(i) {
				transition.points.push(dif);
			}
		}
		transition.points.push(0);
		return transition.points;
	} else {
		return false;
	}
}
// Logarithmic easing
Math.easePower = function (timing, power, steps) {
	if(timing == 'linear') return false;
	var transition = new Array();
	var total = 0;
	for(let x=0; x<=steps; x++) {
		let y = timing == 'ease' && x > steps / 2 ? Math.pow( steps + 1 - x, power ) : Math.pow( x, power );
		if(x) {
			total += y;
			if(timing == 'ease-in') {
				transition.unshift(y);
			} else {
				transition.push(y);
			}
		}
	}
	for(let i=0; i<steps; i++) {
		transition[i] = Math.decimal(transition[i] /= total, 6);
	}
	transition.push(0);
	return transition;
}

// Vector 2D //

export default function Vector2d(x,y) {
	this.x = x || 0;
	this.y = y || 0;
}

Vector2d.prototype = {
	add: function(point) {
		this.x += point.x;
		this.y += point.y;
	},
	angle: function() {
		return Math.degrees(270 - ((Math.atan2(this.y, -this.x) * 180) / Math.PI));
	},
	multiplier: function(testAngle) {
		var angle = Math.degrees(this.angle() - testAngle);
		var radians = Math.rad * angle;

		var multiplier = Math.decimal(Math.cos(radians), 9);
		return multiplier;
	},
	radius: function() {
		return Math.sqrt( ( this.x * this.x ) + ( this.y * this.y) );
	},
	root: function() {
		if(Math.abs(this.x) > Math.abs(this.y)) {
			this.y = this.y / Math.abs(this.x);
			this.x = this.x / Math.abs(this.x);
		} else {
			this.x = this.x / Math.abs(this.y);
			this.y = this.y / Math.abs(this.y);
		}
	},
	rotate: function(center, angle) {
		var radians = Math.rad * angle,
			cos = Math.cos(radians),
			sin = Math.sin(radians),
			x = this.x,
			y = this.y;
		this.x = (cos * (x - center.x)) + (sin * (y - center.y)) + center.x;
		this.y = (cos * (y - center.y)) - (sin * (x - center.x)) + center.y;
	},
	substract: function(point) {
		this.x -= point.x;
		this.y -= point.y;
	}
}