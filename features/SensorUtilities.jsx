import { LocationAccuracy } from "expo-location"

export const getPositionAccuracyInMeter = (locationAccuracy) => {
    switch(locationAccuracy) {
        case LocationAccuracy.Highest:
            return 5;
        case LocationAccuracy.High:
            return 10;
        case LocationAccuracy.Balanced:
            return 100;
        case LocationAccuracy.Low:
            return 1000;
        case LocationAccuracy.Lowest:
            return 3000;
        default:
            return 3000;
    }
}