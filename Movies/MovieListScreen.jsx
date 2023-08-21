import axios from 'axios';
import React, { useState, useEffect} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  ScrollView,
  View,
  Image,
  TouchableHighlight,
  itemPressed
} from 'react-native';

// Other imports


const MoviesList = (props) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
      axios
      .get('https://api.themoviedb.org/3/movie/now_playing?api_key=29725847b9558a283e8e8f82eec493d5&append_to_response=videos')
      .then(response => {
        console.log(response.data.results);
        setMovies(response.data.results);
      })
  }, [])

  if (movies.length === 0) {
    return(
      <View style={{flex: 1, padding: 20}}>
        <Text>Loading, please wait...</Text>
      </View>
    )
  }

  /* const itemPressed = (index) => {
    props.navigation.navigate('MovieDetails');
  } */

  let movieItems = movies.map(function(movie,index){

    const itemPressed = (index) => {
      props.navigation.navigate(
        'MovieDetails',
        { movie: movies[index] });
    }

    return (
      <TouchableHighlight onPress={_ => itemPressed(index)} underlayColor="lightgray" key={index}>
        <MovieListItem movie={movie} key={index}/>
      </TouchableHighlight>
    )
    
  });

  return (
    <ScrollView>
      {movieItems}
    </ScrollView>
  )
};

const MovieListItem = (movies) => {
  let IMAGEPATH = 'https://image.tmdb.org/t/p/w500'
  let imageurl = IMAGEPATH + movies.movie.poster_path;

  

  return(
    <View style={styles.movieItem}>
      <View style={styles.movieItemImage}>
        <Image source={{uri: imageurl}} style={{width: 99, height: 146}}/>
      </View>
      <View style={{marginRight: 50}}>
        <Text style={styles.movieItemTitle}>{movies.movie.title}</Text>
        <Text style={styles.movieItemText}>{movies.movie.release_date}</Text>
        <Text numberOfLines={6} ellipsizeMode='tail' style={styles.movieItemText}>{movies.movie.overview}</Text>
      </View>
    </View>
  )
}

const MovieListScreen: () => Node = ({ navigation }) => {

  return (
    <SafeAreaView>
      <StatusBar/>
        <ScrollView contentInsetAdjustmentBehavior="automatic">
        <MoviesList navigation={ navigation }/>
        </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  movieItem: {
    margin: 5,
    flex: 1,
    flexDirection: 'row'
  },
  movieItemImage: {
    marginRight: 5
  },
  movieItemTitle: {
    fontWeight: 'bold',
  },
  movieItemText: {
    flexWrap: 'wrap'
  }
});

export default MovieListScreen;