import React from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import Sensor from "../components/Sensor";
import { Button } from 'react-native-paper';

const HomeScreen = ({ navigation }) => {

    const render = () => {
        return <View>
            <ImageBackground style={{height: "100%"}} source={require("./kayakBackground.jpg")}>
                <View style={{position: "absolute", backgroundColor: "#333333", height: "100%", width: "100%", opacity: "0.5"}}></View>
                <View style={{display: "flex", justifyContent: "space-between",height: "100%", paddingBottom: "20%", flexDirection: "column"}}>
                    <View style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%", marginTop: "5%"}}>
                        <Image source={require('./kaykenLogo.png')}></Image>
                    </View>
                    <View style={{width: "100%"}}>
                        <View style={{display: "flex", justifyContent: "center", alignItems: "center" }}>
                            <Button style={{width: "50%"}} mode="contained" onPress={() => navigation.navigate("Trips")}>
                                See Your Trips
                            </Button>
                            <Button style={{width: "50%", marginTop: "5%"}} mode="contained" onPress={() => navigation.navigate("StartTrip")}>
                                Start New Trip
                            </Button>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    }

    return render();
}

export default HomeScreen;