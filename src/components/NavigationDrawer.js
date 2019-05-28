import React from 'react';
import RoomsSlider from './RoomsSlider';

import { Link, Route, Switch, HashRouter as Router } from 'react-router-dom';
import { serverUrl } from '../serverUrl';
export default class NavigationDrawer extends React.Component {
  checkIsLogin = () => {
    let house = localStorage.getItem('house');
    if (house === null) {
      return false;
    } else {
      return true;
    }
  };

  logout = () => {
    localStorage.removeItem('house');
    this.props.changeParentState(false);
  };

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <div className='bmd-layout-container bmd-drawer-f-l bmd-drawer-overlay'>
          <header className='bmd-layout-header'>
            <div
              className='navbar navbar-light bg-faded'
              style={{ color: 'white' }}
            >
              <button
                className='navbar-toggler'
                style={{ color: 'white' }}
                type='button'
                data-toggle='drawer'
                data-target='#dw-p1'
              >
                <span className='sr-only' style={{ color: 'white' }}>
                  Toggle drawer
                </span>
                <i className='material-icons' styel={{ color: 'white' }}>
                  menu
                </i>
              </button>
              <ul className='nav navbar-nav'>
                <li className='nav-item' style={{ color: 'white' }}>
                  Smart Home Assistant
                </li>
              </ul>
            </div>
          </header>

          <div id='dw-p1' className='bmd-layout-drawer bg-faded'>
            <header>
              <a className='navbar-brand'>Navigate</a>
            </header>
            <ul className='list-group'>
              <Link className='list-group-item' to={`/rooms`}>
                Rooms
              </Link>
              <Link className='list-group-item' onClick={() => this.logout()}>
                Logout
              </Link>
            </ul>
          </div>
          <main className='bmd-layout-content'>
            <div className='container'>
              <Switch>
                <Route
                  exact
                  path='/'
                  render={props => <RoomsSlider {...props} />}
                />
                <Route
                  path='/rooms'
                  render={props => <RoomsSlider {...props} />}
                />
                <Route path='/house' render={props => <h1>House Details</h1>} />
                <Route
                  path='/consumption'
                  render={props => <h1>Consumption Details</h1>}
                />
              </Switch>
            </div>
          </main>
        </div>
      </Router>
    );
  }
}

// <div className='bmd-layout-container bmd-drawer-f-l bmd-drawer-overlay'>
//           <header className='bmd-layout-header'>
//             <div
//               className='navbar navbar-light bg-faded'
//               style={{ color: 'white' }}
//             >
//               <button
//                 className='navbar-toggler'
//                 style={{ color: 'white' }}
//                 type='button'
//                 data-toggle='drawer'
//                 data-target='#dw-s2'
//               >
//                 <span className='sr-only' style={{ color: 'white' }}>
//                   Toggle drawer
//                 </span>
//                 <i className='material-icons' style={{ color: 'white' }}>
//                   menu
//                 </i>
//               </button>
//               <ul className='nav navbar-nav'>
//                 <li className='nav-item' style={{ color: 'white' }}>
//                   Smart Home Assistant
//                 </li>
//               </ul>
//             </div>
//           </header>
//           <div id='dw-s2' className='bmd-layout-drawer bg-faded'>
//             <header>
//               <a className='navbar-brand'>Navigate</a>
//             </header>
//             <ul className='list-group'>
//               <Link className='list-group-item' to={`/rooms`}>
//                 Rooms
//               </Link>
//             </ul>
//           </div>
//           <main className='bmd-layout-content'>
//             <div className='container' style={{ paddingTop: '5%' }}>
//               <Switch>
//                 <Route
//                   exact
//                   path='/'
//                   render={props => <RoomsSlider {...props} />}
//                 />
//                 <Route
//                   path='/rooms'
//                   render={props => <RoomsSlider {...props} />}
//                 />
//                 <Route path='/house' render={props => <h1>House Details</h1>} />
//                 <Route
//                   path='/consumption'
//                   render={props => <h1>Consumption Details</h1>}
//                 />
//               </Switch>
//             </div>
//           </main>
//         </div>
