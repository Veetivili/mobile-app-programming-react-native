import React, { useState, useEffect} from 'react';
import axios from 'axios';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity
} from 'react-native';
import { MOVIE_DB_API_KEY } from '@env';
import YoutubeIframe from 'react-native-youtube-iframe';

export default function MovieDetailScreen(props) {
  // Define State Variables
  const [movie, setMovie] = useState({});
  const [showPlayer, setShowPlayer] = useState(false);
  const [selectedVideoID, setSelectedVideoID] = useState(null);
  const [playing, setPlaying] = useState(false);

  // Fetch movie data from API when component mounts
  useEffect(() => {
    const { route } = props;
    const movieID = route.params.movie.id;

    axios.get('https://api.themoviedb.org/3/movie/' + movieID + `?api_key=${MOVIE_DB_API_KEY}&append_to_response=videos`)
    .then(response => {
      //console.log(response.data);
      setMovie(response.data);
    })
    .catch (error => {
      console.error("Error fetching movie data", error);
    })
  }, [])

  // Render video links for the selected movie
  const renderVideoLinks = () => {
    if (!movie.videos) return <Text>"Loading..."</Text>;

    return movie.videos.results.map(video => (
      <Text
        style={styles.link}
        key={video.id}
        onPress={() => handleVideoSelection(video.key)}
      >
        {video.name}
        
      </Text>
    ))
  }

  // Handle selection of video link
  const handleVideoSelection = (videoId) => {
    setSelectedVideoID(videoId);
    setShowPlayer(true);
  }

  // Close the video player
  const closeVideo = () => {
    setShowPlayer(false);
  }

  // Define the image URL for the selected movie
    const IMAGEPATH = 'https://image.tmdb.org/t/p/w500';
    const imageurl = IMAGEPATH + movie.poster_path;
    
// Render the movie details screen
    return (
      <View style={styles.container}>
        <Image source={{uri: imageurl}} style={styles.image}  />
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.subtitle}>{movie.release_date}</Text>
        <Text style={styles.text}>{movie.overview}</Text>
        <Text style={styles.subtitle}>Rating: <Text style={styles.text}>{movie.vote_average}</Text></Text>
        <Text style={styles.subtitle}>Runtime: <Text style={styles.text}>{movie.runtime} minutes</Text></Text>
        
        <Text style={styles.subtitle}>
        Genres: <Text style={styles.text}>{movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'Loading...'}</Text>
        </Text>

        <Text style={styles.subtitle}>Homepage: <Text style={styles.link}>{movie.homepage}</Text></Text>
        <Text style={styles.subtitle}>Videos:</Text>
        {renderVideoLinks()}

         {showPlayer && (
          <Modal
            animationType='slide'
            transparent={true}
            visible={showPlayer}
            onRequestClose={closeVideo}
            >
              <TouchableOpacity 
                style={styles.centeredView}
                activeOpacity={1}
                onPressOut={closeVideo}
                >
                <View style={styles.modalView} onStartShouldSetResponder={() => true}>
                  <YoutubeIframe
                    videoId={selectedVideoID}
                    height={300}
                    width={400}
                    play={playing} 
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          )} 
    </View>
    )
}
const styles = StyleSheet.create({
  image: {
    aspectRatio: 670/250
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    paddingBottom: 4
  },
  text: {
    color: '#212124',
    fontSize: 12,
    flexWrap: 'wrap',
    fontWeight: 'normal',
  },
  link: {
    color: 'blue',
    fontSize: 12,
    fontWeight: 'normal',
    paddingBottom: 0
  },
  subtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'black',
    paddingBottom: 4
  },
  container: {
    padding: 2
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 60,
    backgroundColor: 'rgba(0,0,0,0.7)' // semi-transparent background
  },
});