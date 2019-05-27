import React from 'react';
import firebase from 'firebase';
import { config } from '../../src/config';
import { ApiAiClient } from 'api-ai-javascript';
import { serverUrl } from '../serverUrl';
const client = new ApiAiClient({
  accessToken: '6915b3341eb848ca9b44e9fbcf41a3a2'
});
var rootRef = null;
var deviceRef = null;
var recognition = new (window.SpeechRecognition ||
  window.webkitSpeechRecognition ||
  window.mozSpeechRecognition ||
  window.msSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 5;
var speaker = new (window.SpeechSynthesisUtterance ||
  window.webkitSpeechSynthesisUtterance ||
  window.mozSpeechSynthesisUtterance ||
  window.msSpeechSynthesisUtterance)();
speaker.lang = 'en-US';

export default class Device extends React.Component {
  state = {
    device: {},
    device_state: 0
  };

  componentDidMount() {
    this.setState({
      device: this.props.device,
      device_state: this.props.device.status
    });
    deviceRef = rootRef
      .child('devices/-LbEg4LS47zn5vT3D_yb')
      .orderByKey()
      .equalTo(this.props.device.device_id);
    deviceRef.on('value', data => {
      data.forEach(item => {
        this.setState({ device_state: item.val().status });
      });
    });
  }

  componentWillMount() {
    if (!firebase.apps.length) {
      firebase.initializeApp(config);
    }
    rootRef = firebase.database().ref();
  }

  componentWillUmount() {
    deviceRef.off('value');
  }

  handleSpeechToggle = async device_id => {
    let text = '';
    recognition.start();
    recognition.onresult = e => {
      if (
        e.results[0][0].transcript.toString().search(this.state.device.name) ===
        -1
      ) {
        text =
          ' ' +
          e.results[0][0].transcript +
          ' ' +
          this.state.device.name +
          ` of ${this.state.device.room_type}`;
      } else {
        text =
          ' ' +
          e.results[0][0].transcript +
          ' ' +
          ` of ${this.state.device.room_type}`;
      }

      client
        .textRequest(text)
        .then(response => {
          let decision = true;
          let parameters = Object.values(response.result.parameters);
          decision = parameters.length === 0 ? false : true;
          for (let i = 0; i < parameters.length; i++) {
            decision = parameters[i] === '' ? false : true;
            if (decision === false) {
              break;
            }
          }

          if (decision) {
            if (
              response.result.parameters.electrical_appliance !==
              this.state.device.name
            ) {
              speaker.text =
                'Sorry... this electrial device is not a' +
                response.result.parameters.electrical_appliance;
              window.speechSynthesis.speak(speaker);
            } else {
              if (response.result.parameters.onn_off === 'on') {
                if (this.state.device_state === 1) {
                  speaker.text = 'It Is Already Onn';
                  window.speechSynthesis.speak(speaker);
                } else {
                  rootRef
                    .child(
                      `devices/-LbEg4LS47zn5vT3D_yb/${
                        this.state.device.device_id
                      }`
                    )
                    .update({
                      status: 1
                    });
                  fetch(`${serverUrl}/command/${device_id}/1`)
                    .then(res => res.json())
                    .then(data => {})
                    .catch(err => console.log(err));
                  speaker.text =
                    response.result.parameters.electrical_appliance +
                    ' Is Switched Onn ..';
                  window.speechSynthesis.speak(speaker);
                }
              } else {
                if (this.state.device_state === 0) {
                  speaker.text = 'It Is Already Offf ';
                  window.speechSynthesis.speak(speaker);
                } else {
                  rootRef
                    .child(
                      `devices/-LbEg4LS47zn5vT3D_yb/${
                        this.state.device.device_id
                      }`
                    )
                    .update({
                      status: 0
                    });
                  fetch(`${serverUrl}/command/${device_id}/0`)
                    .then(res => res.json())
                    .then(data => {})
                    .catch(err => console.log(err));
                  speaker.text =
                    response.result.parameters.electrical_appliance +
                    '  Is Switched Offf ..';
                  window.speechSynthesis.speak(speaker);
                }
              }
            }
          } else {
            speaker.text = response.result.fulfillment.speech;
            window.speechSynthesis.speak(speaker);
            speaker.onend = e => {};
          }
        })
        .catch(err => {
          console.log(err);
        });
    };
  };

  handleToggle = device_id => {
    let current_state = this.state.device_state === 0 ? 1 : 0;
    fetch(`${serverUrl}/command/${device_id}/${current_state}`)
      .then(res => res.json())
      .then(data => {})
      .catch(err => console.log(err));
    rootRef.child(`devices/-LbEg4LS47zn5vT3D_yb/${device_id}`).update({
      status: current_state
    });
  };

  render() {
    let item = this.props.device;
    let class_var = this.state.device_state === 1 ? 'bg-success' : 'bg-danger';
    return (
      <div
        className={'card text-white ' + class_var + ' mb-3'}
        style={{ width: '18rem' }}
      >
        <div
          className='card-header'
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h3>{item.name}</h3>
          </div>
          <div style={{ textAlign: 'right', paddingRight: '10%' }}>
            <img
              width='30%'
              height='10%'
              src='data:image/png;base64,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'
              onClick={() => {
                this.handleSpeechToggle(item.device_id);
              }}
            />
          </div>
        </div>
        <button
          style={{ margin: '5%' }}
          onClick={() => this.handleToggle(item.device_id)}
        >
          <div className='card-body'>
            <img width='100%' height='40%' src={item.image} />
          </div>
        </button>
      </div>
    );
  }
}
