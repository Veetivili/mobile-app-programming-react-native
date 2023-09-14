import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, ScrollView, Text, Image, Button} from 'react-native';
import { Header, Input, Card } from 'react-native-elements';
import Dialog from "react-native-dialog";
import useAxios from 'axios-hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import '@ant-design/icons-react-native'
const WeatherForecast = (params) => {
  const city = params.city;
  const API_KEY = 'c3c8232af7048e62e15653db99991cb6';
  const URL = 'https://api.openweathermap.org/data/2.5/weather?q=';

  var date = moment()
      .utcOffset('+03:00')
      .format('hh:mm:ss a DD/MM/YY');

  const [{ data, loading, error }, refetch] = useAxios(
    URL+city.name+'&appid='+API_KEY+'&units=metric'
  )

  const refreshForecast = () => {
    refetch();
  }

  const deleteCity = () => {
    params.deleteCity(city.id);
  }

  if (loading) return (
    <Card>
      <Card.Title>Loading....</Card.Title>
    </Card>
  )

  if (error) return (
    <Card>
      <Card.Title>Error loading weather forecast!</Card.Title>
    </Card>
  )

  // just for testing
  //console.log(URL+city.name+'&appid='+API_KEY+'&units=metric')
  //console.log(data);

  return (
    <Card>
      <Card.Title>{city.name}</Card.Title>
      <Card.Title>Last update: {date}</Card.Title>
      <Text>Main: {data.weather[0].main}</Text>
      <Text>Temp: {data.main.temp} °C</Text>
      <Text>Feels:{data.main.feels_like} °C</Text>
      <Text>Description: {data.weather[0].description}</Text>
        <Image 
          source={{uri: 'http://openweathermap.org/img/w/'+data.weather[0].icon+'.png'}}
          style={{
            width: 80,
            height: 80,
            alignSelf: 'center',
            paddingBottom: 10,
        }} />
        <View style={{flex: 1, flexDirection: 'row-reverse', justifyContent: 'space-between'}}>
        <Button onPress={refreshForecast} title="Refresh" />
        <Button onPress={deleteCity} title="Delete" />
        </View>
    </Card>

  );
}


const App: () => React.ReactNode = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [cityName, setCityName] = useState(""); 
  const [cities, setCities] = useState([]);

  // load cities when app starts
useEffect(() => {
  getData();
},[]); 

// save cities if cities state changes
useEffect(() => {
  storeData();
},[cities]); 

  const openDialog = () => {
    setModalVisible(true);
  };

  const addCity = () => {
    setCities([...cities, {id: Math.random(), name: cityName}]);
    setModalVisible(false);
  }

  const cancelCity = () => {
    setModalVisible(false);
  };

  const deleteCity = (cityId) => {
    let filteredArray = cities.filter(city => city.id !== cityId);
    setCities(filteredArray);
  }

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@cities', JSON.stringify(cities));
    } catch (e) {
      // saving error
      console.log("Cities saving error!");
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cities')
      if(value !== null) {
        setCities(JSON.parse(value));
      }
    } catch(e) {
      console.log("Cities loading error!");
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <Header
        centerComponent={{ text: 'Weather App', style: { color: '#fff' } }}
        rightComponent={{ icon: 'add', color: '#fff', onPress: openDialog }}
      />

      <ScrollView >
      {cities.map(city => (
    <WeatherForecast key={city.id} city={city} deleteCity={deleteCity} />
))}

      </ScrollView>

      <Dialog.Container visible={modalVisible}>
        <Dialog.Title>Add a new city</Dialog.Title>

        <View>
          <Input
            onChangeText={(text) => setCityName(text)}
            placeholder='Type city name here'
          />
        </View>

        <Dialog.Button label="Cancel" onPress={cancelCity} />
        <Dialog.Button label="Add" onPress={addCity} />
      </Dialog.Container>

      

    </SafeAreaView>
  );
};

export default App;