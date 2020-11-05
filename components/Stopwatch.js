// import all the components we are going to use

//import CountDown to show the timer
import CountDown from 'react-native-countdown-component';
import React, { Component } from 'react';
import { AppRegistry, StyleSheet,Text,View, TouchableHighlight } from 'react-native';
import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

class TestStopwatch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timerStart: false,
      stopwatchStart: false,
      totalDuration: 90000,
      timerReset: false,
      stopwatchReset: false,
    };
    this.toggleTimer = this.toggleTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.toggleStopwatch = this.toggleStopwatch.bind(this);
    this.resetStopwatch = this.resetStopwatch.bind(this);
  }

    componentDidMount() {
        this.toggleStopwatch()
    }
   
    toggleTimer() {
      this.setState({ timerStart: !this.state.timerStart, timerReset: false });
    }
   
    resetTimer() {
      this.setState({timerStart: false, timerReset: true});
    }
   
    toggleStopwatch() {
      this.setState({stopwatchStart: !this.state.stopwatchStart, stopwatchReset: false});
    }
   
    resetStopwatch() {
      this.setState({stopwatchStart: false, stopwatchReset: true});
    }
    
    getFormattedTime(time) {
        this.currentTime = time;
    };
   
    render() {
      return (
        <View style={{alignItems: "center", display: "flex", justifyContent: "center", alignContent: "center"}}>
          <Stopwatch laps start={this.state.stopwatchStart}
            reset={this.state.stopwatchReset}
            options={options}
          />
        </View>
      );
    }
  }
   
  const options = {
    container: {
      backgroundColor: '#ffffff',
      width: 90,
    },
    text: {
      fontSize: 18,
      marginLeft: 0,
      textAlign: "center"
    }
  };

  export default TestStopwatch;