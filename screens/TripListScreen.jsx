import React, { useEffect, useState } from "react";
import { SafeAreaView, View, FlatList, StyleSheet, Text, StatusBar } from 'react-native';
import Sensor from "../components/Sensor";
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

        setTimeout(() => {
            setLoading(false)
            setData([
                {
                  id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
                  title: 'First Item',
                },
                {
                  id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
                  title: 'Second Item',
                },
                {
                  id: '58694a0f-3da1-471f-bd96-145571e29d72',
                  title: 'Third Item',
                  
                },
            ])
        }, 2000)
    }

    

    const renderItem = ({item}) => {
        return <List.Item onPress={() => navigation.navigate("TripOverview", {userId: item.id})} title={item.title}/>
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
