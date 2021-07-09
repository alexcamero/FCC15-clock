import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const LengthSetter = (props) => {
  const id = props.name.toLowerCase();
  
  return (
    <div id={id} className="lengthSetter">
      <h2 id={id + "-label"}>{props.name + " Length"}</h2>
      <div className="setterRow">
        <button id={id + "-decrement"} onClick={props.dec}><i className="fa fa-arrow-circle-o-down"></i></button>
        <h3 id={id+"-length"}>{props.time}</h3>
        <button id={id+"-increment"} onClick={props.inc}><i className="fa fa-arrow-circle-o-up"></i></button>
      </div>
    </div>
  );
}

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionLength: 25,
      breakLength: 5,
      currentMode: "Session",
      timeLeft: '25:00',
      running: false,
      remaining: 25*60000
    };
    this.incSession = this.incSession.bind(this);
    this.decSession = this.decSession.bind(this);
    this.incBreak = this.incBreak.bind(this);
    this.decBreak = this.decBreak.bind(this);
    this.stopStart = this.stopStart.bind(this);
    this.reset = this.reset.bind(this);
    this.makeTimeString = this.makeTimeString.bind(this);
    this.go = this.go.bind(this);
  }
  
  makeTimeString(ms) {
    let s = Math.floor(ms/1000);
    let m = Math.floor(s/60);
    s = s - (60 * m);
    let m_str = '0' + m.toString();
    let s_str = '0' + s.toString();
    let newTimeString = m_str.slice(-2) + ':' + s_str.slice(-2);
    return newTimeString;
  }
  
  incSession() {
    this.setState(state => {
      if ((!state.running) && (state.sessionLength < 60)) {
        let newLength = state.sessionLength + 1;
        if (state.currentMode == "Session") {
          return {sessionLength: newLength, remaining: 60000*newLength, timeLeft: this.makeTimeString(60000*newLength)};
        } else {
          return {sessionLength: newLength};
        }
      }
    });
  }
  
  decSession() {
    this.setState(state => {
      if ((!state.running) && (state.sessionLength > 1)) {
        let newLength = state.sessionLength - 1;
        if (state.currentMode == "Session") {
          return {sessionLength: newLength, remaining: 60000*newLength, timeLeft: this.makeTimeString(60000*newLength)};
        } else {
          return {sessionLength: newLength};
        }
      }
    });
  }
  
  incBreak() {
    this.setState(state => {
      if ((!state.running) && (state.breakLength < 60)) {
        let newLength = state.breakLength + 1;
        if (state.currentMode == "Break") {
          return {
            breakLength: newLength,
            remaining: 60000*newLength,
            timeLeft: this.makeTimeString(60000*newLength)
          }
        } else {
          return {breakLength: newLength};
        }
      }
    });
  }
  
  decBreak() {
    this.setState(state => {
      if ((!state.running) && (state.breakLength > 1)) {
        let newLength = state.breakLength - 1;
        if (state.currentMode == "Break") {
          return {
            breakLength: newLength,
            remaining: 60000*newLength,
            timeLeft: this.makeTimeString(60000*newLength)
          }
        } else {
          return {breakLength: newLength};
        }
      }
    });
    
  }
  
  go() {
    console.log('hey');
    this.setState(state => {
      let newRemaining = state.remaining - 1000;
      if (newRemaining >= 0) {
        if (newRemaining == 0) {
          document.getElementById("beep").play();
        }
        return {remaining: newRemaining, timeLeft: this.makeTimeString(newRemaining)};
      } else {
        let newMode = state.currentMode == "Session" ? "Break" : "Session";
        newRemaining = newMode == "Session" ? state.sessionLength * 60000 : state.breakLength * 60000;
        let newTimeStr = this.makeTimeString(newRemaining);
        return {
          remaining: newRemaining,
          timeLeft: newTimeStr,
          currentMode: newMode
        };
      }
    });
  }
  
  stopStart() {
    this.setState(state => {
      if (state.running) {
        clearInterval(this.timer);
      } else {
        this.timer = setInterval(this.go, 1000);
      }
      return {running: !state.running};
    });
  }
  
  reset() {
    let sound = document.getElementById("beep");
    sound.pause();
    sound.currentTime = 0;
    clearInterval(this.timer);
    this.setState(
      {
      sessionLength: 25,
      breakLength: 5,
      currentMode: "Session",
      timeLeft: '25:00',
      running: false,
      remaining: 25*60000
    });
  }
  
  render() {
    return (
      <div id="clock">
        <audio id="beep" src='https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3' preload="auto" />
        <h1>25 + 5 Clock</h1>
        <div id="lengthSetters">
          <LengthSetter name="Break" time={this.state.breakLength} inc={this.incBreak} dec={this.decBreak} />
          <LengthSetter name="Session" time={this.state.sessionLength} inc={this.incSession} dec={this.decSession} />
        </div>
        <div id="countdown">
          <h2 id="timer-label">{this.state.currentMode}</h2>
          <p id="time-left">{this.state.timeLeft}</p>
        </div>
        <div id="controls">
          <button id="start_stop" onClick={this.stopStart}><i className={this.state.running ? "fa fa-pause" : "fa fa-play"}></i></button>
          <button id="reset" onClick={this.reset}><i class="fa fa-history"></i></button>
        </div>
      </div>
      );
  }
}

ReactDOM.render(<Clock />, document.getElementById("root"));
