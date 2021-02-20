import logo from './logo.svg';
import './App.css';
import Amplify, {API, graphqlOperation} from 'aws-amplify';
import awsconfig from './aws-exports';
import {AmplifySignOut, withAuthenticator} from '@aws-amplify/ui-react'
import { listSongs } from './graphql/queries';
import { useEffect, useState } from 'react';
import { Paper, IconButton } from '@material-ui/core';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { updateSong } from './graphql/mutations';

Amplify.configure(awsconfig)

function App() {

  const [songs, setSongs] = useState([]);

  useEffect (()=>{
    fetchSongs()
  },[])

  const fetchSongs = async () =>{
    try{
       const songData = await API.graphql(graphqlOperation(listSongs))
       const songList = songData.data.listSongs.items;
       console.log('songList', songList)
       setSongs(songList)
    }
    catch (error) {
        console.error(error);
    }
  }

  const addLike = async (id) => {

    try{
         const song = songs[id];
         song.like = song.like+1;
         delete song.createdAt;
         delete song.updatedAt;

         const songData = await API.graphql(graphqlOperation(updateSong,{input: song}));
         const songList = [...songs]
         songList[id] = songData.data.updateSong;
         setSongs(songList);
    }
    catch (error) {
          console.error(error)
    }

  }

  const listData = songs.map((song, idx)=>(
    <div className="songList" >
      <Paper variant="outlined"  elevation={2} key={idx}>
        <div className="songCard">
        <IconButton aria-label="play">
            <PlayCircleOutlineIcon />
         </IconButton>
            <div>
              <div className="songTitle">{song.title}</div>
              <div className="songOwner">{song.owner}</div>
            </div>
            <div>
            <IconButton aria-label="like" onClick={() => addLike(idx)}>
                                        <FavoriteIcon />
                                    </IconButton>
                                    {song.like}
                                </div>
            <div className="songDescription">
            {song.description}
            </div>


        </div>
      </Paper>
  
    </div>
  ))

  return (
    <div className="App">
      <header className="App-header">
        <AmplifySignOut />
        <h2>Content</h2>
      </header>
      {listData}
    </div>
  );
}

export default withAuthenticator(App);
