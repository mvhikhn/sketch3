var main;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0, 51, 255);
	main = makeGrid(windowWidth, windowHeight, 50);
	noStroke();
}

function draw() {
	background(0, 51, 255);
	fill(0);
	textSize(20);

	main.forEach(elem => {
		elem.update();
		elem.draw(15);
	});
}

function mouseDragged() {
	burst();
}

function mousePressed() {
	burst();
}

function burst() {
	var mouse = new Posn(mouseX, mouseY);
	main.forEach(elem => {
		elem.applyForce(elem.pos.offset(mouse).mul(pow(2, -(elem.pos.dist(mouse) * 0.04))));
	});
}

function makeGrid(width, height, blockSize) {
	var arr = [];
	
	for (var i = blockSize; i < width; i += blockSize) {
		for (var j = blockSize; j < height; j += blockSize) {
			arr.push(new Point(i, j, Math.random().toString(20)[3]));
		}
	}
	
	return arr;
}

function Point(x, y, letter, mass) {
	this.supposed = new Posn(x, y);
	this.pos = new Posn(x, y);
	this.vel = new Posn(0, 0);
	this.acc = new Posn(0, 0);
	this.shape = random(["circle", "square", "triangle", "diamond"]);
	this.mass = mass == null ? 1 : mass;
	
	this.draw = (size) => {
		switch(this.shape) {
			case "circle":
				ellipse(this.pos.x, this.pos.y, size, size);
				break;
			case "square":
				rect(this.pos.x - size / 2, this.pos.y - size / 2, size, size);
				break;
			case "triangle":
				triangle(
					this.pos.x, this.pos.y - size / 2,
					this.pos.x - size / 2, this.pos.y + size / 2,
					this.pos.x + size / 2, this.pos.y + size / 2
				);
				break;
			case "diamond":
				push();
				translate(this.pos.x, this.pos.y);
				rotate(PI / 4);
				rect(-size / 2, -size / 2, size, size);
				pop();
				break;
		}
	};

	this.update = () => {
		this.applyForce(new Posn(random(-0.01, 0.01), random(-0.01, 0.01)));
		this.seek(this.supposed);

		var distToMouse = this.pos.dist(new Posn(mouseX, mouseY));

		this.vel.add(this.acc);
		this.pos.add(this.vel);
		this.vel.mul(0.95);
		this.acc.mul(0);
	};
	
	this.seek = (target) => {
		this.applyForce(this.pos.offset(target).mul(this.pos.dist(target)).mul(-0.0001));
	};
	
	this.applyForce = (force) => {
		this.acc.add(force);
	}
}

function Posn(x, y) {
	this.x = x;
	this.y = y;
	
	this.get = () => {
		return new Posn(this.x, this.y);
	};
	
	this.apply = (f) => {
		this.x = f(this.x);
		this.y = f(this.y);
		
		return new Posn(this.x, this.y);
	}
	
	this.add = (other) => {
		this.x += other.x;
		this.y += other.y;
		
		return this.get();
	};
	
	this.mul = (c) => {
		this.x *= c;
		this.y *= c;
		
		return this.get();
	}
	
	this.offset = (other) => {
		return new Posn(this.x - other.x, this.y - other.y);
	}
	
	this.dist = (other) => {
		return sqrt(sq(other.x - this.x) + sq(other.y - this.y));
	}
}
