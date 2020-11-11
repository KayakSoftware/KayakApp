import Service from "../Services/tripService";
import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import Sensor from "../components/AccelerometerSensor";
import { ActivityIndicator, Button, Colors } from 'react-native-paper';

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
        setData(result)

        setLoading(false);
    }

    const renderItem = ({item, key}) => {
        return <List.Item key={key} onPress={() => navigation.navigate("TripOverview", {tripId: item._id})} title={`${item.startTime}:${item.tripStatus}`}/>
    }

    const render = () => {
        return <View style={{height: "100%", display: "flex", justifyContent: "center"}}>
            {loading 
            ? <ActivityIndicator animating={true} color={Colors.red800} />
            : <FlatList
            style={{height: "100%"}}
            data={data}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            />}
        </View>
    }

    return render();
}

export default TripListScreen;
