import {Vector} from "./Vector";

export class HeadingMonitor {

    constructor(collectSpeed, requestPosition, monitorSampleRate) {
        this.collectSpeed = collectSpeed;
        this.requestPositon = requestPosition;
        this.monitorSampleRate = monitorSampleRate;
        this.initialAngle = null;
        this.rightAngles = [];
        this.initalOpposite = null;
        this.leftAngles = [];
        this.totalLength = 0;
    }


    attachUpdates = (direction) => {
        let angle = 0;
        let {x, y, z} = direction;

        if (Math.atan2(y, x) >= 0) {
            angle = Math.atan2(y, x) * (180 / Math.PI);
        } else {
            angle = (Math.atan2(y, x) + 2 * Math.PI) * (180 / Math.PI);
        }

        if(this.initialAngle === null) {
            // Set the systems initial angle and wait for next update to plot
            this.initialAngle = Math.round(angle);
            this.initalOpposite = (this.initialAngle + 180) % 360;

            if(this.initialAngle - 180 < 0) {
                this.leftAngles.push([360+(this.initialAngle - 180), 360].sort((a,b) => a-b), [0, this.initialAngle])
                this.rightAngles.push([this.initialAngle, this.initialAngle + 179])
            } else {
                this.leftAngles.push([this.initialAngle, this.initialAngle - 179].sort((a,b) => a-b))
                this.rightAngles.push([this.initialAngle, 360], [0, (this.initialAngle + 180) % 360])
            }

            // Describe the initial direction with a vector of length 1 out of the xAxis.
            // representative of 1 meter in an arbitrary direction.
            this.position = new Vector(1,0)
            this.time = new Date().getTime();
            this.totalLength = 1;

            return;
        }

        let isRight = false;
        let bounds = [];

        angle = Math.round(angle);

        for(let i = 0; i < this.rightAngles.length; i++) {
            let angleBounds = this.rightAngles[i];
            if(angle >= angleBounds[0] && angle <= angleBounds[1]) {
                bounds.push(angleBounds);
                isRight = true;
                break;
            }
        }
        if(!isRight) {
            for(let i = 0; i < this.leftAngles.length; i++) {
                let angleBounds = this.leftAngles[i];
                if(angle >= angleBounds[0] && angle <= angleBounds[1]) {
                    bounds.push(angleBounds);
                    break;
                }
            }
        }

        let localAngle = 0; 

        if(isRight) {
            // This means we past 0/360 going right about the circle
            if(this.initialAngle > angle) {
                localAngle = (360-this.initialAngle + angle)
            } else {
                localAngle = (angle - this.initialAngle)
            }
        } else {
            // this means we past 0/360 going left about the circle
            if(angle > this.initialAngle) {
                localAngle = (-(360-angle + this.initialAngle))
            } else {
                localAngle = (-(this.initialAngle - angle))
            }
        }

        // get the sample speed
        //const speed = 2;//this.collectSpeed();
        //const time = new Date().getTime();
        //const elapsedTime = time - this.time;
        //this.time = time;

        //var velocity = new Vector(speed, 0);
        //velocity.multiply(time);
        //velocity.rotate(localAngle);
        //this.position.add(velocity);

        // Check if the y component of position is greater than a certain value...
        const now = new Date().getTime();
        const elapsedSeconds = (now - this.time) / 1000
        
        const speed = 2;//this.collectSpeed();
        const velocity = new Vector(speed, 0);

        // scale length of velocity proportional to the timeStep
        velocity.scale(elapsedSeconds);
        this.totalLength += velocity.magnitude();

        // rotate the vector
        velocity.rotate(localAngle);
        this.position.add(velocity);

        //console.log(`elapsedSeconds: ${elapsedSeconds}`);
        console.log("angle: " + localAngle)
        console.log("meters traveled: " + this.totalLength)
        console.log("positionMagnitude: " + this.position.magnitude())
        console.log("positionY: " + this.position.y);


        if(this.position.y > 30 || this.position.y < -30) {
            console.log("Out of bounds request new position!")
        }

        this.time = now;
    }

    cleanUp = () => {

    }
}



/*if (angle >= 22.5 && angle < 67.5) {
            console.log("NE")
          }
          else if (angle >= 67.5 && angle < 112.5) {
            console.log("E")
          }
          else if (angle >= 112.5 && angle < 157.5) {
            console.log("SE");
          }
          else if (angle >= 157.5 && angle < 202.5) {
            console.log("S")
          }
          else if (angle >= 202.5 && angle < 247.5) {
            console.log("SW");
          }
          else if (angle >= 247.5 && angle < 292.5) {
            console.log("W")
          }
          else if (angle >= 292.5 && angle < 337.5) {
            console.log("NW")
          }
          else {
            console.log("N")
          }*/