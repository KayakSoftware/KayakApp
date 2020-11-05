import React from "react";
import { Text} from "react-native"

const DistanceManager = (props) => {

    const calculateDistance = () => {
        return props.routeTrajectory.length;
    }

    const render = () => {
        return <Text style={{textAlign: "center"}}>{calculateDistance()} km</Text>
    }

    return render();
}

export default DistanceManager;