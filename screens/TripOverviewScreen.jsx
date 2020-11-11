import Service from "../Services/tripService";
import React, { Fragment, useEffect, useState } from "react";
import { View, Text, Dimensions, Alert, TouchableOpacity} from 'react-native'
import { ActivityIndicator, Button, Colors } from 'react-native-paper';
import MapView, {Polyline, Marker} from 'react-native-maps';

const TripOverviewScreen = (props) => {

    const mapView = React.createRef();

    const { route, navigation } = props;
    const { tripId } = route.params;

    const [loading, setLoading] = useState(false)
    const [data, setData] = useState()
    const [region, setRegion] = useState()

    useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        setLoading(true)
        var result = await Service.getTrip(tripId);
        setData(result);
        console.log(result)
        setLoading(false)
    }
    

    const render = () => {
        
        if(!data) {
            return <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <ActivityIndicator></ActivityIndicator>
        </View>
        }

        if(!loading && data) {
            if(data.trip.tripStatus === "Analyzing") {
                return <View>
                <Text> Proccesing your trip! Come back later...</Text>
            </View>
            }
        }
        
        
        return <View>
            {loading 
            ? <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <ActivityIndicator></ActivityIndicator>
            </View>
            : <View>
                <View style={{display: "flex", justifyContent: "space-evenly", width: Dimensions.get('window').width, height: "25%", padding: 10, backgroundColor: "white"}}>
                    <View style={{width: Dimensions.get('window').width, backgroundColor: "white", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <View style={{display: "flex", flexDirection: "column", width: "33%"}}>
                            <Text style={{fontSize: 20, fontWeight: "300",textAlign: "center"}}>Walking:</Text>
                            <Text style={{textAlign: "center"}}>{data.trip.distanceLand} Km</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "column", width: "33%"}}>
                            <Text style={{fontSize: 20, fontWeight: "300",textAlign: "center"}}>Total:</Text>
                            <Text style={{textAlign: "center"}}>{data.trip.distanceTotal} Km</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "column", width: "33%"}}>
                            <Text style={{fontSize: 20, fontWeight: "300",textAlign: "center"}}>Sailing:</Text>
                            <Text style={{textAlign: "center"}}>{data.trip.distanceWater} Km</Text>
                        </View>
                    </View>
                    <View style={{width: Dimensions.get('window').width, backgroundColor: "white", display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
                        <View style={{display: "flex", flexDirection: "column", width: "33%"}}>
                            <Text style={{fontSize: 20, fontWeight: "300",textAlign: "center"}}>Avg. Speed:</Text>
                            <Text style={{textAlign: "center"}}>{data.trip.distanceLand} Km/t</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "column", width: "33%"}}>
                            <Text style={{fontSize: 20, fontWeight: "300",textAlign: "center"}}>Avg. Speed:</Text>
                            <Text style={{textAlign: "center"}}>{data.trip.distanceTotal} Km/t</Text>
                        </View>
                        <View style={{display: "flex", flexDirection: "column", width: "33%"}}>
                            <Text style={{fontSize: 20, fontWeight: "300",textAlign: "center"}}>Avg. Speed:</Text>
                            <Text style={{textAlign: "center"}}>{data.trip.distanceWater} Km/t</Text>
                        </View>
                    </View>
                </View>
                <MapView
                region={region}
                ref={mapView}
                zoomEnabled={true}
                showsCompass={true}
                style={{width: Dimensions.get('window').width, height: "75%", zIndex:1, padding: 50}}>
                    {data 
                    ? <Polyline
                    coordinates={data.coordinates.map((ele, key) => {
                        return {latitude: ele.coords.latitude, longitude: ele.coords.longitude}
                    })}
                    strokeWidth={2}
                    strokeColors={data.coordinates.map(ele => {
                        return ele.activity === "unknown" ? "#000" :
                        ele.activity === "Walking" 
                        ? "#8b4513" : "blue"
                    })}
                    />
                    : null}
                </MapView>    
            </View>}
        </View>
    }

    return render();
}

export default TripOverviewScreen;