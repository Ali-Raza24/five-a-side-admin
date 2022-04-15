import React, { Component } from "react";
import {Map, Marker, GoogleApiWrapper} from 'google-maps-react';
import config from '../../config';

class LocationMap extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locationLat: '',
      locationLng: ''
    }
  }

  onMapClicked(mapProps, map, clickEvent) {
    let lat = clickEvent.latLng.lat();
    let lng = clickEvent.latLng.lng();
    mapProps.setCoordinates({lat: lat, lng: lng});
  }

  render() {
    const style = {
      // width: '500px',
      height: '470px'
    };

    return (
      <Map
        google={this.props.google}
        style={style}
        initialCenter={{
          lat: 53.8544138,
          lng: -8.3161296
        }}
        center={{
          lat: this.props.coordinates ? this.props.coordinates.lat : 53.8544138,
          lng: this.props.coordinates ? this.props.coordinates.lng : -8.3161296,
        }}
        zoom={6}
        setCoordinates={this.props.setCoordinates}
        onClick={this.onMapClicked}
        scrollwheel={false}
      >
        {this.props.coordinates &&
          <Marker
            name={'Current location'}
            position={{lat: this.props.coordinates.lat, lng: this.props.coordinates.lng}}
          />
        }

        {/*<InfoWindow onClose={this.onInfoWindowClose}>*/}
          {/*<div>*/}
            {/*<h1>{this.state.selectedPlace.name}</h1>*/}
          {/*</div>*/}
        {/*</InfoWindow>*/}
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (config.GOOGLE_MAP_KEY),
  props: this.props
})(LocationMap)