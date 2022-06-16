import React, { useState, useEffect } from "react";
import discoveryService from "./services/discoveryService";
import AuthModal from "./components/AuthModal"
import { authenticateUser, getAuthorizationHeader } from "./services/authService"
import Grid from "@material-ui/core/Grid";
import { TextField, Button } from "@material-ui/core";

const App = () => {
  const [userPlaylistsArtists, setUserPlaylistsArtists] = useState([]);

  const [header, setHeader] = useState(null);

  const [searchValue, setSearchValue] = useState("")

  const [sameArtists, setSameArtists] = useState([])

  const [searchEnabled, setSearchEnabled] = useState(false)

  const [isMainMenuVisible, setMainMenuVisibility] = useState(true);
  const [isAuthModalVisible, setAuthOpenVisibility] = useState(true);

  let retrieveAllArtistsAllPlaylists = discoveryService.retrieveAllArtistsAllPlaylists;

  const handleAuthClose = () => {
    setAuthOpenVisibility(false)
  }

  useEffect(() => {
    if (header !== null) {
      retrieveAllArtistsAllPlaylists(header, setUserPlaylistsArtists)
    }
  }, [header]);

  console.log('userPlayli')
    console.log(userPlaylistsArtists)

  useEffect(() => {
    getAuthorizationHeader(setHeader);
    if(window.location.href !== "https://alexndesousa.github.io/artist-search/") {
        handleAuthClose()
    }
    if(window.location.href.includes("access_token")) {
      handleAuthClose()
    }
    
  }, []);

  useEffect(() => {
    if (userPlaylistsArtists.length !== 0) {
      setSearchEnabled(true)
    }
  }, [userPlaylistsArtists])

  const handleSearch = event => {
    setSearchValue(event.target.value)
  }

  const calculateSameArtists = () => {
    const searchSet = new Set(searchValue.toLowerCase().split(",").map(artist => artist.trim()))
    const intersection = new Set([...userPlaylistsArtists].filter(element => searchSet.has(element)))

    setSameArtists(intersection)
  }

  const MainMenu = (
    <>
      {isMainMenuVisible ? (
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
          style={{ minHeight: "80vh", margin: "0", width: "100%" }}
        >          
          <Grid item>
            <TextField
              id="filled-basic"
              label="insert comma separated artists here"
              margin="normal"
              multiline
              variant="filled"
              value={searchValue}
              onChange={handleSearch}
            />
          </Grid>
          <Grid item>
            <Button disabled={!searchEnabled} variant="contained" onClick={() => calculateSameArtists()}>
              compare
            </Button>
          </Grid>
          <Grid item>
            {[...sameArtists].join(", ")}
          </Grid>
        </Grid>
      ) : null}
    </>
  );

  return (
    <div>
      <AuthModal open={isAuthModalVisible} handleClose={handleAuthClose} authFunction={authenticateUser}/>
      {MainMenu}
    </div>
  );
};

export default App;
