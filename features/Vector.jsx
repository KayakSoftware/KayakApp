export class Vector {

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    scale = (scalar) => {
        this.x *= scalar;
        this.y *= scalar;
    }

    add = (vector) => {
        this.x += vector.x;
        this.y += vector.y;
    }

    copy = () => {
        return new Vector(this.x, this.y);
    }

    rotate = (angle) => {

        let theta = (Math.PI / 180) * angle;

        let cs = Math.cos(theta);
        let sn = Math.sin(theta);

        let newX = this.x * cs - this.y * sn; 
        let newY = this.x * sn + this.y * cs;

        this.x = newX;
        this.y = newY;
    }

    toString = () => {
        console.log(`x: ${this.x}, y: ${this.y}`);
    }
}