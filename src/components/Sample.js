import React from 'react';
import { serverUrl } from '../serverUrl.js';

export default class Sample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: 0
    };
  }
  componentDidMount() {}
  changeStatus = status => {
    this.setState({ status: status });
    fetch(serverUrl + `?action=${'D01'}`)
      .then(res => res.json())
      .then(data => console.log(data))
      .catch(err => console.log(err));
  };
  render() {
    return (
      <table>
        <tr>
          <td>
            <button onClick={() => this.changeStatus(1)}>Onn</button>
          </td>
          <td>
            <button onClick={() => this.changeStatus(0)}>Off</button>
          </td>
        </tr>
        <tr style={{ color: 'white' }}>
          {this.state.status === 0 ? 'Led Is Off' : 'Led Is Onn'}
        </tr>
      </table>
    );
  }
}
