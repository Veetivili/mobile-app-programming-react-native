import React, {useState} from 'react';
import {View, StyleSheet, Button, TextInput} from 'react-native';
import {Callout, Marker} from 'react-native-maps';
import {enableLatestRenderer} from 'react-native-maps';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'; 
import axios, { AxiosResponse } from 'axios';
import { Text } from 'react-native-elements';
import { FloatingAction } from "react-native-floating-action";
import { Dialog } from 'react-native-simple-dialogs';

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

interface Place {
  lat: string;
  lon: string;
  name: string;
}

const App = () => {
  const [place, setPlace] = useState<Place[]>([]);
  const [city, setCity] = useState('');
  const [showDialog, setShowDialog] = useState(false);

  enableLatestRenderer();

  const URL = 'https://nominatim.openstreetmap.org/search?city=';
  const City = city;
  const format = '&format=json&limit=1';


  const dialogView = () => {
  
    if (showDialog) {
      return (
        <Dialog
          visible={showDialog}
          title="Add a new place"
          onTouchOutside={() => setShowDialog(false)}
        >
          <View style={{zIndex: 2, width: 100, height: 100}}>
            <Text>City</Text>
            <TextInput
              style={styles.input}
              onChangeText={text => setCity(text)}
              value={city}
            />
            <View style={{display: 'flex', flexDirection: 'row-reverse', gap: 3, justifyContent: 'space-between', width: 300}}>
            <Button title="Add" onPress={newPlace} />
            <Button title="Cancel" onPress={() => setShowDialog(false)} />
            </View>
          </View>
        </Dialog>
      );
    }
  };


  const newPlace = () => {
    setShowDialog(false);
    axios
      .get(URL + City + format)
      .then(response => {
        console.log(response.data);
        const { lat, lon } = response.data[0];
        setPlace([...place, { lat, lon, name: City}]);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const position = {
    latitude: 65,
    longitude: 26,
    latitudeDelta: 11,
    longitudeDelta: 14,
  };

  return(
    
    <View style={styles.container}>
      <Text>My Places</Text>
      {dialogView()}
     <MapView 
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={styles.map}
       initialRegion={position}
       zoomEnabled={true}
       zoomControlEnabled={true}
     >
      {place.map((p, index) => (
        <Marker key={index} coordinate={{latitude: parseFloat(p.lat), longitude: parseFloat(p.lon)}}>
          <Callout>
            <Text>{p.name}</Text>
          </Callout>
          </Marker>
      ))}
     </MapView>
     <View style={{position: "absolute", bottom: 70, right: -25, backgroundColor: "black"}}>
      {locationActions()}
      <FloatingAction onPressMain={() => setShowDialog(true)} />
     </View>
     
   </View>
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
  input: {
    height: 40,
    width: 300,
    marginBottom: 4,
    borderColor: 'gray',
    borderWidth: 1,
  },
 });



export default App;




