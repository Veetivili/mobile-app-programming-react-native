import React, {useState} from "react";
import { SafeAreaView, TextInput, TouchableOpacity, Text, View} from "react-native";
import { Linking, Platform } from "react-native";
import LinearGradient from 'react-native-linear-gradient';

function App() {
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);


  const launchMap = () => {
    const location = `${latitude},${longitude}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });
    Linking.openURL(url);
  }
  

  return(
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={{flex: 1}}>
      <View style={{backgroundColor: 'blue', padding: 10}}>
        <Text style={{color: 'white', textAlign: 'center'}}>Launch a Map</Text>
      </View>
      <SafeAreaView style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <TextInput  
          style={{borderWidth: 1, borderRadius: 10, backgroundColor: 'white', borderColor: 'gray', padding: 10, width: '80%', marginBottom: 10}} 
          placeholder='Latitude' 
          onChangeText={text => setLatitude(text)}
        />
        <TextInput 
          style={{borderWidth: 1, borderRadius: 10, backgroundColor: 'white', borderColor: 'gray', padding: 10, width: '80%', marginBottom: 10}} 
          placeholder='Longitude' 
          onChangeText={text => setLongitude(text)}
        />
        <TouchableOpacity 
          style={{backgroundColor: 'blue', padding: 10, borderRadius: 5}} 
          onPress={launchMap}
        >
          <Text style={{color: 'white'}}>Launch a Map</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  )

}

export default App;