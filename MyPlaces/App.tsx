import React, {useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {Marker} from 'react-native-maps';
import {enableLatestRenderer} from 'react-native-maps';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
import axios from 'axios';
import { Text } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FloatingAction } from "react-native-floating-action";

enableLatestRenderer();

import { Icon } from 'react-native-elements';

const locationActions = () => {
  const actions = [
    {
      name: "Location",
      text: "Location",
      icon: <Icon name="location-pin" />,
    },
  ];

  return (
    <FloatingAction
      actions={actions}
      onPressItem={(name) => {
        console.log(`selected button: ${name}`);
      }}
    />
  );
};

const App = () => {
  const [place, setPlace] = useState([]);
  const [city, setCity] = useState('Helsinki');

  enableLatestRenderer();

  const URL = 'https://nominatim.openstreetmap.org/search?city=';
  const City = city;
  const format = '&format=json&limit=1';


  const newPlace = () => {
    axios
    .get(URL + City + format)
      .then(response => {
        console.log(response.data);
        setPlace(response.data);
      })
      .catch(error => {
        console.log(error);
      }
    );
  };

  const position = {
    latitude: 65,
    longitude: 26,
    latitudeDelta: 11,
    longitudeDelta: 14,
  };

  const newMarker = {
    latitude: 60.19,
    longitude: 24.94,
  };
  
  return(
    <SafeAreaView>
    <Text>My Places</Text>
    <View style={styles.container}>
     <MapView 
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       initialRegion={position}
       zoomEnabled={true}
       zoomControlEnabled={true}
     >
      <Marker coordinate={newMarker} />
      {locationActions()}
     </MapView>
   </View>
   </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
 });



export default App;




