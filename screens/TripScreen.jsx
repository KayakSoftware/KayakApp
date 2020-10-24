import Service from '../Services/tripService'
import React, { useEffect, useState } from "react";
import { View, Text, Alert } from "react-native";
import { Button } from 'react-native-paper';
import { ActivityIndicator, Colors } from 'react-native-paper';
import Stopwatch from '../components/Stopwatch';
import Sensor from '../components/Sensor';
import GPS from '../components/Gps';

const TripScreen = ({navigation}) => {
    const [creatingTrip, setCreatingTrip] = useState(false);
    const [currentTrip, setCurrentTrip] = useState(undefined)
    const [sampleSlow, setSampleSlow] = useState();
    const [sampleFast, setSampleFast] = useState();
    const [ref] = useState(React.createRef());
    const [gpsRef] = useState(React.createRef());
    const [currentSample, setCurrentSample] = useState([])
    const [currentGpsSample, setCurrenGpsSample] = useState([])
    const [currentPredictions, setCurrentPredictions] = useState();
    const [imitatingKayak, toggleImitatingKayak] = useState(false);

    useEffect(() => {
        navigation.addListener('beforeRemove', navigationEvent)
    }, [currentTrip])

    const navigationEvent = (e) => {
        if (!currentTrip) {
            // If we don't have unsaved changes, then we don't need to do anything
            return;
          }
  
          // Prevent default behavior of leaving the screen
          e.preventDefault();
  
          // Prompt the user before leaving the screen
          Alert.alert(
            'End trip?',
            'A trip is ongoing... Sure you want to end trip and save?',
            [
              { text: "Don't leave", style: 'cancel', onPress: () => {} },
              {
                text: 'End trip and save!',
                style: 'destructive',
                // If the user confirmed, then we dispatch the action we blocked earlier
                // This will continue the action that had triggered the removal of the screen
                onPress: () => {
                  // Stop trip and navigate back
                  endTrip();
                  navigation.dispatch(e.data.action)
                },
              },
            ]
        );
    }

    const endTrip = async () => {
        var result = Service.endTrip(currentTrip._id);
        setCurrentTrip(undefined);
    }

    const startTrip = async () => {
        setCreatingTrip(true)

        try {
            var creationResult = await Service.createTrip();
            setCurrentTrip(creationResult);
        } catch (err) {
            console.error(err);
        }
        setCreatingTrip(false)
    }

    const sensorData = (data) => {
        
        currentSample.push(data);

        if(currentSample.length === 100) {
            let data = [...currentSample];
            let gpsData = [...currentGpsSample]
            while(currentSample.length > 0) {
                currentSample.pop()
            }
            while(currentGpsSample.length > 0) {
                currentGpsSample.pop();
            }
            updateTripActivity({accelerometerData: data, gpsData: gpsData})
        }
    }

    const gpsSensorData = (data) => {
        currentGpsSample.push(data);
    }

    const updateTripActivity = async (data) => {
        if(currentTrip) {
            var result = await Service.updateTripActivity(currentTrip._id, data);
            setCurrentPredictions(result);
        }
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

    const sensorFast = () => {
        ref.current?._setSampleRatePrSecond(40);
        gpsRef.current?.setSamplingFrequency(1)
    }

    const sensorSlow = () => {
        ref.current?._setSampleRatePrSecond(10);
        gpsRef.current?.setSamplingFrequency(1000)
    }

    const renderOngoingTrip = () => {
        if(currentTrip) {
            return (
                <View style={{width: "100%", height: "100%", display: "flex", justifyContent: "space-between"}}>
                    <View style={{height: "75%", paddingTop: "5%"}}>
                        <Text style={{fontSize: 25, textAlign: "center"}}>Duration</Text>
                        <Stopwatch></Stopwatch>
                        {currentPredictions 
                        ? currentPredictions.map((ele, key) => {
                            return <Text key={key} style={{textAlign: "center"}}>{ele.activity}:{ele.confidence}</Text>
                        })
                        : null}
                        <Sensor
                        immitatingKayak={imitatingKayak}
                        ref={ref}
                        subscribeSensorInput={sensorData}
                        verboseSensor={true}></Sensor>
                        { true ? <View style={{alignItems: "center"}}>
                            <Button style={{width: "50%"}} onPress={sensorFast} mode="contained">Fast</Button>
                            <Button style={{width: "50%"}} onPress={sensorSlow} mode="contained">Slow</Button>
                        </View> : null}
                        <GPS initialSamplingFrequency={5000} subscribeSensorInput={gpsSensorData} ref={gpsRef} verboseSensor={true}></GPS>
                    </View>
                    <View style={{width: "100%", alignItems: "center", paddingBottom: "10%", height: "25%"}}>
                        <Button onPress={() => toggleImitatingKayak(!imitatingKayak)} style={{width: "80%", marginTop: "5%"}} mode="contained">
                            {imitatingKayak ? "Stop immitating kayak" : "Immitate kayak"}
                        </Button>
                        <Button onPress={() => {
                            Alert.alert(
                                'End trip?',
                                'A trip is ongoing... Sure you want to end trip and save?',
                                [
                                { text: "I regret", style: 'cancel', onPress: () => {} },
                                {
                                    text: 'End Trip and save!',
                                    style: 'destructive',
                                    // If the user confirmed, then we dispatch the action we blocked earlier
                                    // This will continue the action that had triggered the removal of the screen
                                    onPress: () => {
                                    // Stop trip and navigate back
                                    endTrip();
                                    },
                                },
                                ]
                            );
                        }} style={{width: "80%", marginTop: "5%"}} mode="contained">
                            End trip!
                        </Button>
                    </View>
                </View>
            )
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
