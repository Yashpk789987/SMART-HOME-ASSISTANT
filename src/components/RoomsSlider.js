import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import firebase from 'firebase';
import { config } from '../../src/config';
import {
  Redirect,
  Link,
  Route,
  Switch,
  HashRouter as Router
} from 'react-router-dom';
import RoomById from './RoomById';
var speaker = new (window.SpeechSynthesisUtterance ||
  window.webkitSpeechSynthesisUtterance ||
  window.mozSpeechSynthesisUtterance ||
  window.msSpeechSynthesisUtterance)();
speaker.lang = 'en-US';

var rootRef = null;
class RoomsViewPager extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: []
    };
  }

  componentDidMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    rootRef = firebase.database().ref();
    rootRef.child('rooms').on('value', data => {
      let rooms = [];
      data.forEach(item => {
        rooms.push({ ...item.val(), room_id: item.key });
      });
      this.setState({ rooms: rooms });
    });
  }

  componentWillUnmount() {
    rootRef.child('rooms').off('value');
  }

  introduce = () => {
    speaker.text = ` Hello User . I am Smart Home Assistant . I can Control Electrical Appliances Of Your Home
      I am Progressive Web App Developed In ReactJS Developed By Facebook . I am using Real Time Database Firebase Developed By Google . 
      I am using nueral networks to communicate with You . 
      I am in learning phase .
      Please Forgive Me for any Mistakes
      Thank You. `;
    window.speechSynthesis.speak(speaker);
  };

  render() {
    if (this.props.match.url !== '/rooms') {
      return <Redirect to='/rooms' />;
    }
    if (this.state.rooms.length === 0) {
      return <h1 style={{ color: 'white' }}>Loading Rooms ....</h1>;
    } else {
      return (
        <Router basename={process.env.PUBLIC_URL}>
          <button
            onClick={this.introduce}
            style={{ width: '100%' }}
            type='button'
            className='btn btn-outline-light btn-lg'
          >
            Tap For Introduction
          </button>
          <br />
          <SwipeableViews enableMouseEvents>
            {this.state.rooms.map((item, index) => {
              return (
                <div
                  className='card'
                  key={item.room_id}
                  style={{ width: '100%', borderRadius: '3%' }}
                >
                  <img
                    src={item.image}
                    className='card-img-top'
                    style={{
                      width: '100%',
                      height: 200,
                      borderRadius: '3%'
                    }}
                  />
                  <div className='card-body'>
                    <h4 className='card-title'>{item.type}</h4>
                    <Link
                      className='btn btn-primary'
                      to={`${this.props.match.url}/roombyid/${item.room_id}`}
                    >
                      Tap To Navigate
                    </Link>
                  </div>
                </div>
              );
            })}
          </SwipeableViews>
        </Router>
      );
    }
  }
}

export default class RoomsSlider extends React.Component {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Switch>
          <Route
            exact
            path={`${this.props.match.url}/`}
            render={props => <RoomsViewPager {...props} />}
          />
          <Route
            path={`${this.props.match.url}/roombyid/:room_id`}
            render={props => <RoomById {...props} />}
          />
        </Switch>
      </Router>
    );
  }
}
