

import React from 'react'
import SwipeableViews from 'react-swipeable-views'
export default class ________ extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }
    componentDidMount(){}
    
    render() {
        return(
            <SwipeableViews enableMouseEvents>
            <div className="card" style = {{width:'100%'}}>
              <img src = 'data:image/jpeg;base64,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' className="card-img-top"  style = {{ width : '100%' , height : '100%'}}
              />
              <div className="card-body">
                <h4 className="card-title">John Doe</h4>
                <a href="#" className="btn btn-primary">See Profile</a>
              </div>
            </div>
            <div className="card" style = {{width:'100%'}}>
              <img src = 'https://images.wallpaperscraft.com/image/bedroom_furniture_tenderness_romance_comfort_70085_3840x2400.jpg' className="card-img-top"  style = {{ width : '100%' , height : '100%'}}
              />
              <div className="card-body">
                <h4 className="card-title">John Doe</h4>
                <a href="#" className="btn btn-primary">See Profile</a>
              </div>
            </div>
            <div className="card" style = {{width:'100%'}}>
              <img src = 'https://ak3.picdn.net/shutterstock/videos/845233/thumb/1.jpg?i10c=img.resize(height:160)' className="card-img-top"  style = {{ width : '100%' , height : '100%'}}
              />
              <div className="card-body">
                <h4 className="card-title">John Doe</h4>
                <a href="#" className="btn btn-primary">See Profile</a>
              </div>
            </div>
          </SwipeableViews>
        )    
    }
}