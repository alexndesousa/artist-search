import axios from "axios";
import { authenticateUser } from "./authService"

const baseUrl = "https://api.spotify.com/v1";

const sleepRequest = (milliseconds, originalRequest) => {
  console.log("originalRequest", originalRequest);
  return new Promise((resolve, reject) => {
    setTimeout(
      () =>
        resolve(
          axios({
            method: originalRequest.method,
            url: originalRequest.url,
            data: originalRequest.data,
            headers: originalRequest.headers
          })
        ),
      milliseconds
    );
  });
};

axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    console.log("error.response", error.response);
    const {
      config,
      response: { status }
    } = error;
    const originalRequest = config;
    if (status === 429 || status === 500) {
      return sleepRequest(
        error.response.headers["retry-after"] * 1000,
        originalRequest
      );
    } else if (status === 401) {
      authenticateUser()
      return Promise.reject(error);
    } else {
      return Promise.reject(error)
    }
  }
);

const getUsersPlaylists = (header) => {
  return axios
    .get(baseUrl + "/me/playlists?limit=50", { headers: header })
    .then(response => response.data.items.map(info => info.id));
};

const getNumberOfTracksInPlaylist = (playlistID, header) => {
  return axios
    .get(baseUrl + "/playlists/" + playlistID, { headers: header })
    .then(response => {
      return response.data.tracks.total;
    });
};

const getPlaylistsArtists = (playlistID, amountOfTracks, header) => {
  const maxTracksPerPage = 100;
  let allArtists = [];
  let allPromises = [];

  for (let offset = 0; offset < amountOfTracks; offset += maxTracksPerPage) {
    allPromises.push(
      axios
        .get(
          baseUrl + "/playlists/" + playlistID + "/tracks?offset=" + offset,
          { headers: header }
        )
        .then(response => {
          const artistIDs = response.data.items
            .map(item => {
              const artists = item.track.artists.map(artists => artists.name.toLowerCase())
              return artists
            })
          allArtists = allArtists.concat(artistIDs);
          return response;
        })
    );
  }

  return Promise.all(allPromises).then(response => {
    return allArtists;
  });
};

const retrieveAllArtistsAllPlaylists = async (header, setUserPlaylistsArtists) => {
  const allUsersPlaylists = await getUsersPlaylists(header)
  const allArtists = await allUsersPlaylists.map(async playlistId => await retrieveAllArtistsPlaylist(header, playlistId))
  Promise.all(allArtists).then(resolved => {
    console.log(`resolved ${resolved}`)
    setUserPlaylistsArtists(new Set(resolved.flat().flat()))
    return resolved})
}


const retrieveAllArtistsPlaylist = async (header, id) => {
  const numberOfTracks = await getNumberOfTracksInPlaylist(id, header)
  return await getPlaylistsArtists(id, numberOfTracks, header)
}


export default {
  retrieveAllArtistsAllPlaylists: retrieveAllArtistsAllPlaylists
};
