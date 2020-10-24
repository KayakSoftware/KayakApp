import Service from "../Services/tripService";
import React, { Fragment, useEffect, useState } from "react";
import { View, Text} from "react-native";
import { ActivityIndicator, Button, Colors } from 'react-native-paper';

const TripOverviewScreen = ({ route, navigation }) => {

    const [loading, setLoading] = useState(false);
    const [data, setData] = useState()

    const { tripId } = route.params;

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setLoading(true)
        var result = await Service.getTrip(tripId);
        setData(result);
        setLoading(false)
    }

    const renderBody = () => {
        if(loading) {
            return <View>
                <ActivityIndicator animating={true} color={Colors.red800} />
            </View>
        } else {
            if(data) {
                return (
                    <View>
                        <Text>id: {data._id}</Text>
                        <Text>tripStatus: {data.tripStatus}</Text>
                        <Text>startTime: {data.startTime}</Text>
                        <Text>endTime: {data.endTime ? data.endTime : null}</Text>
                    </View>
                )
            }
        }
    }
 
    const render = () => {
        return <View style={{width: "100%", height: "100%"}}>
            {renderBody()}
        </View>
    }

    return render();
}

export default TripOverviewScreen;