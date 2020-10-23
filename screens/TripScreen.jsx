import axios from "../configurations/networkClient";
import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Button } from 'react-native-paper';
import { ActivityIndicator, Colors } from 'react-native-paper';

const TripScreen = ({navigation}) => {

    const [creatingTrip, setCreatingTrip] = useState(false);
    const [currentTrip, setCurrentTrip] = useState()

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            if (!currentTrip) {
              // If we don't have unsaved changes, then we don't need to do anything
              return;
            }
    
            // Prevent default behavior of leaving the screen
            e.preventDefault();
    
            // Prompt the user before leaving the screen
            Alert.alert(
              'Discard changes?',
              'You have unsaved changes. Are you sure to discard them and leave the screen?',
              [
                { text: "Don't leave", style: 'cancel', onPress: () => {} },
                {
                  text: 'Discard',
                  style: 'destructive',
                  // If the user confirmed, then we dispatch the action we blocked earlier
                  // This will continue the action that had triggered the removal of the screen
                  onPress: () => navigation.dispatch(e.data.action),
                },
              ]
            );
          })
    }, [])

    const startTrip = async () => {
        setCreatingTrip(true)

        try {
            var creationResult = await axios.post("https://192.168.87.35:5001/trips/");
            setCurrentTrip(creationResult.data);
        } catch (err) {
            console.error(err);
        }
        setCreatingTrip(false)
    }

    const renderStartTripButton = () => {
        if(!currentTrip) {
            if(creatingTrip) {
                return <ActivityIndicator animating={true} color={Colors.red800} />
            } else {
                return <Button onPress={startTrip} style={{width: "50%", marginTop: "5%"}} mode="contained">
                    Start Trip!
                </Button>
            }
        }
    }

    const renderOngoingTrip = () => {
        if(currentTrip) {
            <Button style={{width: "50%", marginTop: "5%"}} mode="contained">
                Immitate kayak data
            </Button>
        }
    }


    const render = () => {
        return <View style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100%"}}>
            {renderStartTripButton()}
            {renderOngoingTrip()}
        </View>
    }

    return render();
}

export default TripScreen;