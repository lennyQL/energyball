// Class
function Ball() {
    this.radius = 5;
    this.mass = 1.0;
    this.friction = 0.01;
    this.color = createVector(255, 255, 255);
    // motion
    this.location = createVector(0.0, 0.0);
    this.velocity = createVector(0.0, 0.0);
    this.acceleration = createVector(0.0, 0.0);
    this.gravity = createVector(0.0, 0.0);
    // moving range
    this.min = createVector(0.0, 0.0);
    this.max = createVector(width, height);
}

Ball.prototype.bounceOffWalls = function () {
    if (this.location.x > this.max.x) {
        this.location.x = this.max.x;
        this.velocity.x *= -1;
    }
    if (this.location.x < this.min.x) {
        this.location.x = this.min.x;
        this.velocity.x *= -1;
    }
    if (this.location.y > this.max.y) {
        this.location.y = this.max.y;
        this.velocity.y *= -1;
    }
    if (this.location.y < this.min.y) {
        this.location.y = this.min.y;
        this.velocity.y *= -1;
    }
};

Ball.prototype.update = function () {
    this.acceleration.add(this.gravity);
    this.velocity.add(this.acceleration);
    this.velocity.mult(1.0 - this.friction);
    this.location.add(this.velocity);
    this.acceleration.set(0, 0);
};

Ball.prototype.draw = function () {
    fill(this.color.x, this.color.y, this.color.z);
    //stroke(this.color.x, this.color.y, this.color.z);
    noStroke();
    ellipse(this.location.x, this.location.y, this.radius, this.radius);
};

// extend Energy
function Energy() {
    this.uber = Ball.prototype;
    Ball.call(this);
}

Energy.prototype = Object.create(Ball.prototype);
Energy.prototype.constructor = Energy;


// extend Fireball
function Fireball() {
    this.uber = Ball.prototype;
    Ball.call(this);
}

Fireball.prototype = Object.create(Ball.prototype);
Fireball.prototype.constructor = Fireball;

Fireball.prototype.draw = function () {
    fill(this.color.x, this.color.y, this.color.z);
    stroke(255);
    ellipse(this.location.x, this.location.y, this.radius, this.radius);
};