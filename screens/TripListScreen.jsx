import Service from "../Services/tripService";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar, Dimensions } from 'react-native';
import Sensor from "../components/AccelerometerSensor";
import { ActivityIndicator, Button, Colors } from 'react-native-paper';
import Moment from 'moment';
import { List } from 'react-native-paper';
import tripService from "../Services/tripService";

const TripListScreen = ({navigation}) => {
    
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    
    


    useEffect(() => {
        downloadTrips()
    }, [])
    
    const downloadTrips = async () => {
        setLoading(true);
        // Call api here to fetch trips
        var result = await Service.getTrips();
        result.forEach(element => {
            var start = convertTime(element.startTime)
            var end = convertTime(element.endTime)
            var duration = Moment.duration(element.endTime - element.startTime).asSeconds();
            element.startTime = start;
            element.endTime = end; 
            element.duration = duration;
        });
        setData(result)
        setLoading(false);
    }

    const convertTime = (ticks) => {
        var date = Moment(new Date(ticks)).format('MM/DD/YYYY hh:MM');
        return date;
    }

    const renderItem = ({item, key}) => {
        return (
            <View style={{
                width: Dimensions.get("window").width-20, 
                backgroundColor:"#babab8", 
                padding:10, margin: 10,
                borderRadius:"20%", 
                shadowColor: "#000",
                shadowOffset: {
                    width: 0,
                    height: 2,},
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,}}>
                {item.tripStatus === "Analyzing"?
                <List.Item 
                    key={key} 
                    onPress={() => navigation.navigate("TripOverview", {tripId: item._id})}
                    titleStyle={{fontWeight:"900"}}
                    title={`${item.startTime}:${" Trip status: "+ item.tripStatus}`}
                    description={`${"Distance: "+item.distanceTotal}:${"  Duration: "+item.duration+"sec"}:${" Average speed: "+item.averageSpeed}`}
                    >
                </List.Item>
                : 
                <List.Item 
                    key={key} 
                    onPress={() => navigation.navigate("TripOverview", {tripId: item._id})}
                    titleStyle={{fontWeight:"900"}}
                    title={`${item.startTime}`}
                    description={`${"Distance: "+item.distanceTotal}:${"  Duration: "+item.duration+"sec"}:${" Average speed: "+item.averageSpeed}`}
                    >
                </List.Item>}
            </View>
        )
    }

    const render = () => {
        return <View style={{height: "100%", display: "flex", justifyContent: "center"}}>
            {loading 
            ? <ActivityIndicator animating={true} color={Colors.red800} />
            : <FlatList
            style={{height: "100%"}}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            />}
        </View>
    }

    return render();
}

export default TripListScreen;
