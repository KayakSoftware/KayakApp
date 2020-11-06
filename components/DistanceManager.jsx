import React from "react";
import { Text} from "react-native"
import turf from "@turf/distance";

const DistanceManager = (props) => {

    // longitude and latitude
    const calculateDistance = () => {
        var totalLength = 0;
        var previousPoint = undefined;
        for(let i = 0; i < props.routeTrajectory.length; i++) {
            if(!previousPoint) {
                previousPoint = [props.routeTrajectory[i].coords.longitude, props.routeTrajectory[i].coords.latitude]
                continue;
            }
            var currentPoint = [props.routeTrajectory[i].coords.longitude, props.routeTrajectory[i].coords.latitude]
            totalLength += turf(previousPoint, currentPoint, "kilometers")
        }
        return Math.floor(totalLength * 100) / 100;
    }

    const render = () => {
        return <Text style={{textAlign: "center"}}>{calculateDistance()} km</Text>
    }

    return render();
}

export default DistanceManager;