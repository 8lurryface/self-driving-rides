var fs = require('fs');
class Ride {
    constructor(startX, startY, endX, endY, earlyStart, lateFinish){
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.earlyStart = earlyStart;
        this.lateFinish = lateFinish;
        this.distance = this.calculateDistance();
        this.executed = false;
        this.finished = false;
    }
    calculateDistance() {
        return Math.abs(this.endX - this.startX) + Math.abs(this.endY - this.startY);
    }
}
class Car {
    constructor() {
        this.currentX = 0;
        this.currentY = 0;
        this.currentRide = null;
        this.finishedRides = [];
        this.taken = false;
        this.distanceToRide = undefined;
    }
    addFinishedRide(ride) {
        this.finishedRides.push(ride);
    }
}


class Estimator {
    static canTakeARide(car, ride, stepsLeft) {
        return (Math.abs(car.currentX - ride.startX) + Math.abs(car.currentY - ride.startY)) +
            (Math.abs(ride.startX - ride.endX) + Math.abs(ride.startY - ride.endY)) < stepsLeft;
    }
    static distanceFromCarToRide(car, ride) {
        return (Math.abs(car.currentX - ride.startX) + Math.abs(car.currentY - ride.startY));
    }
    static findClosestRide(car, stepsLeft) {
        let closest = undefined;
        for (let i = 0; i < rides.length; i++) { // find first non-executed ride and set it as closest one to compare with the rest
            if (rides[i].executed === false && rides[i].finished === false) {
                closest = rides[i];
                break;
            }
        }

        for (let i = 0; i < rides.length; i++) {
            let tmp = 0;
            if (!rides[i].executed) {
                tmp = this.distanceFromCarToRide(car, rides[i]);
                if (tmp <= this.distanceFromCarToRide(car, closest)
                    && rides[i].finished === false
                    && this.canTakeARide(car, rides[i], rides[i].lateFinish)) {
                    closest = rides[i];
                }
            }
        }
        return rides.indexOf(closest);
    }
    static finishRide(car) {
        car.currentX = car.currentRide.endX;
        car.currentY = car.currentRide.endY;
        car.finishedRides.push(car.currentRide);
        car.currentRide.executed == false;
        car.currentRide.finished == true;
        car.currentRide == null;
        car.taken = false;
        car.distanceToRide = undefined;
    }
    static startRide(car, ride) {
        car.currentX = ride.startX;
        car.currentY = ride.startY;
        ride.executed = true;
    }

}

let rides = [];
let cars = [];
let streets = [];
let steps = 0;
read('c_no_hurry.in');
solve();
write('c_out.txt');

function read(filename) {
    let file = (fs.readFileSync(filename, 'utf8')).trim();
    let lines = file.split("\n");
    let tmp = lines[0].split(" ")
    for (let i = 0; i < tmp[2]; i++) {
        cars.push(new Car());
    }
    steps = tmp[5];
    for(let line = 1; line < lines.length; line++){
        let tmp = lines[line].split(" ");
        rides.push(new Ride(tmp[0], tmp[1], tmp[2], tmp[3], tmp[4], tmp[5]));
    }
}

function write(filename) {
    let content = '';
    for (let i = 0; i < cars.length; i++) {
        content += cars[i].finishedRides.length + ' ';
        for (let j = 0; j < cars[i].finishedRides.length; j++) {
            content += rides.indexOf(cars[i].finishedRides[j]) + ' ';
        }
        content += '\n';
    }
    fs.writeFileSync(filename, content);
}

function solve() {
    for (let i = 0; i <= steps; i++) {
        for (let j = 0; j < cars.length; j++) {

            if (cars[j].taken === false) { // if car is free - take a closest non-executed and non-finished ride that can be finished on time
                let rideIndex = Estimator.findClosestRide(cars[j], steps - i);
                if (rideIndex >= 0) {
                    cars[j].currentRide = rides[rideIndex];
                    cars[j].taken = true;
                    cars[j].distanceToRide = Estimator.distanceFromCarToRide(cars[j], rides[rideIndex]);
                    cars[j].currentRide.executed = true;
                    //cars[j].currentRide.executed = true;
                }
            }
            if (cars[j].taken === true && cars[j].currentRide.executed === true && cars[j].distanceToRide === 0) { //if ride is executed by a car
                Estimator.startRide(cars[j], cars[j].currentRide);
                cars[j].currentRide.distance--;
            }

            if (cars[j].taken === true && cars[j].currentRide.distance === 0) { //if ride is finished
                Estimator.finishRide(cars[j]);
                let rideIndex = Estimator.findClosestRide(cars[j], steps - i);
                if (rideIndex >= 0) {
                    cars[j].currentRide = rides[rideIndex];
                    cars[j].taken = true;
                    cars[j].distanceToRide = Estimator.distanceFromCarToRide(cars[j], rides[rideIndex]);
                    cars[j].currentRide.executed = true;
                }
            }

            else if (cars[j].taken === true && cars[j].distanceToRide > 0) {
                cars[j].distanceToRide--;
            }
        }

    }
}