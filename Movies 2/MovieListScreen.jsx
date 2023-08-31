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

import { MOVIE_DB_API_KEY} from '@env';


// Declare a new component called MoviesList

const MoviesList = (props) => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
      axios
      .get(`https://api.themoviedb.org/3/movie/now_playing?api_key=${MOVIE_DB_API_KEY}&append_to_response=videos`)
      .then(response => {
        console.log(response.data.results);
        setMovies(response.data.results);
      })
  }, [])

 // If the movies array is empty, display a loading message

  if (movies.length === 0) {
    return(
      <View style={{flex: 1, padding: 20}}>
        <Text>Loading, please wait...</Text>
      </View>
    )
  }

  // Map the movies array to an array of MovieListItem components

  let movieItems = movies.map(function(movie,index){

    const itemPressed = (index) => {
      props.navigation.navigate(
        'MovieDetails',
        { movie: movies[index] });
    }

  // Return a touchable MovieListItem component for each movie in the array

    return (
      <TouchableHighlight onPress={_ => itemPressed(index)} underlayColor="lightgray" key={index}>
        <MovieListItem movie={movie} key={index}/>
      </TouchableHighlight>
    )
    
  });

  // Return the array of MovieListItem components wrapped in a ScrollView
  return (
    <ScrollView>
      {movieItems}
    </ScrollView>
  )
};

// Declare a new component called MovieListItem

const MovieListItem = (movies) => {
  let IMAGEPATH = 'https://image.tmdb.org/t/p/w500'
  let imageurl = IMAGEPATH + movies.movie.poster_path;


// Return a view containing the movie poster and title

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

// Declare a new component called MovieListScreen

const MovieListScreen: () => Node = ({ navigation }) => {
// Return a SafeAreaView containing the MoviesList component
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