import React from "react";
import GPS from "../components/Gps";
import Gyroscope from "../components/GyroSensor";
import Magnetometer from "../components/MagnetometerSensor";
import Accelerometer from "../components/AccelerometerSensor";
import Battery from "../components/Battery"; 
import { View } from "react-native";
import { LocationAccuracy } from "expo-location";
import { getPositionAccuracyInMeter } from "./SensorUtilities";
import { HeadingMonitor } from "./HeadingMonitor";

class SensorHandler extends React.Component {

    gps = React.createRef();
    gyroscope = React.createRef();
    accelerometer = React.createRef();
    magnetometer = React.createRef();
    battery = React.createRef();

    debug = true;

    constructor(props) {
        super(props);
        this.state = {
            lastPosition: null,
            isStill: false,
            batteryLevel: null,
            speedHistory: [],
            sensorParameters: {
                usePositionCache: false,
                cacheValidationRule: {maxAge: 0, requiredAccuracy: 1},
                locationAccuracy: LocationAccuracy.High,
                positionThreshold: 30,
                trajectoryThreshold: 40
            },
            headingMonitor: null
        }
    }

    // COMMON Section
    startEnabledSensors = () => {
        this.log("Starting Enabled Sensors")
        this.requestPosition();

        // simple subscribe sensors
        this.gyroscope.current?.startSampling();
        this.accelerometer.current?.startSampling();
        this.magnetometer.current?.startSampling();
        this.battery.current?.subscribe();
    }

    requestPosition = async () => {

        // Request initial GPS update
        try {
            this.log("Requesting Position update with accuracy level of: " + `${this.state.sensorParameters.locationAccuracy}`)
            const position = await this.gps.current?.getPositionAsync(
                this.state.sensorParameters.usePositionCache, 
                this.state.sensorParameters.cacheValidationRule, 
                this.state.sensorParameters.locationAccuracy);
            this.setState({lastKnownSpeed: position.coords.speed})
            this.state.speedHistory.push(position.coords.speed < 0 ? 0 : position.coords.speed)
            if(this.props.subscribeGpsUpdates)this.props.subscribeGpsUpdates(position);
            this.setState({lastPosition: position})
            
            // Run update strategy flow
            this.chooseUpdateStrategy("requestPosition");
            
        } catch (err) {
            console.error(err)
            this.log("Couldn't retreive position update - Request position again in 3 seconds")
            // If we do not aquire a position even though it was requested do a retry after x seconds
            setTimeout(() => {
                this.requestPosition()
            }, 3000)
        }
    }

    chooseUpdateStrategy = (origin) => {

        this.log("Attach heading monitor")
        this.monitorHeading();
        return;

        // Evaluate battery level and adjust parameters respectively
        this.evaluateSensorParameters();

        this.log("Choosing update strategy from: " + origin)

        // If phone is still dont do updates
        if(this.state.isStill) {
            this.log("Phone is still, monitorWakeUp before continuing")
            this.accelerometer.current?.monitorWakeUp(() => this.chooseUpdateStrategy());
            return;
        }

        const speed = this.collectSpeed();

        if (speed > 0) {
            if (true) {
                // Monitor heading
                this.log("Attach heading monitor")
                this.monitorHeading();
            } else {
                // Dynamic duty cycle
                const deltaT = this.dynamicDutyCycle(speed);
                this.log(`DynamicDutyCyling with deltaT of: ` + deltaT);
                setTimeout(() => {
                    this.requestPosition();
                }, deltaT * 1000)
            }
        } else {
            this.log("Scheduling Static duty cycle: 5 secs")
            setTimeout(() => {
                this.requestPosition();
            }, 5000)
        }
    }

    dynamicDutyCycle = (speed) => {
        return ((Math.min(this.state.sensorParameters.positionThreshold, this.state.sensorParameters.trajectoryThreshold)) - getPositionAccuracyInMeter(this.state.sensorParameters.locationAccuracy)) / speed;
    }

    // Returns the speed in m/s
    collectSpeed = () => {
        if(this.state.speedHistory.length > 0) {

            // if speed higher than normal distribution threshold then sample from normal distribution instead

            return this.state.speedHistory[this.state.speedHistory.length -1];
        }
        return 0;
    }

    monitorHeading = () => {
        this.setState({headingMonitor: new HeadingMonitor(this.collectSpeed, this.requestPosition, 1000)});
    }

    evaluateSensorParameters = () => {
        
        if(this.state.batteryLevel === null) {
            return;
        }

        //GPS accuracy management
        this.setState({
            usePositionCache: false,
            cacheValidationRule: {maxAge: 0, requiredAccuracy: 1},
            locationAccuracy: this.getLocationAccuracy(this.state.batteryLevel)
        })

        // Lower Accelerometer sampling frequency
        this.determineRelevantAccelerometerSampleRate(this.state.batteryLevel);

    }

    determineRelevantAccelerometerSampleRate = (level) => {
        if(level.batteryLevel >= 0.6) {
            this.accelerometer.current?.setSampleRatePrSecond(60);
        }
        if(level.batteryLevel >= 0.2) {
            this.accelerometer.current?.setSampleRatePrSecond(30);
        }
        this.accelerometer.current?.setSampleRatePrSecond(15);
    }

    getLocationAccuracy = (level) => {
        if(level.batteryLevel >= 0.6) {
            return LocationAccuracy.Highest;
        }
        if(level.batteryLevel >= 0.2) {
            return LocationAccuracy.High
        }
        return LocationAccuracy.Balanced;
    }

    stopEnabledSensors = () => {
        this.gps.current?.stopSampling();
        this.gyroscope.current?.stopSampling();
        this.accelerometer.current?.stopSampling();
        this.magnetometer.current?.stopSampling();
        this.battery.current?.unsubscribe();
    }

    // ******** Battery level ********* //
    onBatteryLevelUpdate = (level) => {
        if(this.props.subscribeBatteryUpdates)
        {
            this.props.subscribeBatteryUpdates(level);
            this.setState({batteryLevel: level})
        }
    }

    renderBattery = () => {
        return <Battery ref={this.battery} subscribeBatteryUpdates={level => this.onBatteryLevelUpdate(level)} />
    }

    // ***** Magnetometer START *****

    renderMagnetometer = () => {
        if(this.state.headingMonitor) {
            return <Magnetometer ref={this.magnetometer} headingMonitor={this.state.headingMonitor}/>  
        }
    }
    // ***** Magnetometer END *****

    // ***** Accelerometer START *****
    onAccelerationUpdate = (accelerations) => {
        if(!this.state.isStill) {
            if(this.props.subscribeAccelerationUpdate) {
                this.props.subscribeAccelerationUpdates(accelerations);
            }
        }
    }

    renderAccelerometer = () => {
        if(this.props.enableAccelerometer) {
            return <Accelerometer ref={this.accelerometer} immitateKayak={this.props.immitateKayak} subscribeIsStill={movement => this.setState({isStill: movement})} subscribeUpdates={accelerations => this.onAccelerationUpdate(accelerations)}/>
        }
    }

    // ***** Accelerometer END *****

    // ***** Gyroscope START *****
    onGyroUpdate = (angleVelocities) => {
        if(this.props.subscribeGyroUpdates) {
            this.props.subscribeGyroUpdates(angleVelocities);
        }
    }

    renderGyroscope = () => {
        if(this.props.enableGyro) {
            return <Gyroscope ref={this.gyroscope} subscribeUpdates={angleVelocities => this.onGyroUpdate(angleVelocities)} />
        }
    }
    // ***** Gyroscope END *****

    // ***** GPS START ***** 
    onLocationUpdate = (location) => {
        if(this.props.subscribeGpsUpdates) {
            this.props.subscribeGpsUpdates(location)
        }
    }

    onGpsInit = (location) => {
        if(this.props.subscribeGpsInit) {
            this.props.subscribeGpsInit(location)
        }
    }

    renderGPS = () => {
        if(this.props.enableGPS) {
            return <GPS ref={this.gps} subscribeUpdates={location => this.onLocationUpdate(location)} subscribeInitLocation={(location) => this.onGpsInit(location)}></GPS>
        }
    }
    // ***** GPS END ***** 

    render = () => {
        return <View>
            {this.renderGPS()}
            {this.renderGyroscope()}
            {this.renderAccelerometer()}
            {this.renderMagnetometer()}
            {this.renderBattery()}
        </View>
    }

    log = (args) => {
        if(this.debug) {
            console.log(args);
        }
    }
}

export default SensorHandler;
