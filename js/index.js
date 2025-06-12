import { data } from "./data.js";
import { convertMilliseconds } from "./millisecondsConverter.js";

//Function to create table headers
const createTableHeaders = () => {
  const thead = document.createElement("thead");
  thead.classList.add("header-table");
  const headerRow = document.createElement("tr");
  const headers = ["#", "Title", "Plays", "Duration"];

  headerRow.classList.add("header-table");

  for (let i = 0; i < headers.length; i++) {
    const th = document.createElement("th");
    th.classList.add("table-header-cell");
    th.textContent = headers[i];
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  return thead;
};

const createSongArtistCell = (trackName, artists) => {
  const songCell = document.createElement("td");
  songCell.classList.add("album-cell");

  const [
    {
      profile: { name: artistName },
    },
  ] = artists.items || [{ profile: { name: "Unknown artist" } }];

  if (trackName && artistName) {
    const song = document.createElement("span");
    song.classList.add("song-name");
    song.textContent = trackName;

    const artist = document.createElement("span");
    artist.classList.add("band-name");
    artist.textContent = artistName;

    songCell.appendChild(song);
    songCell.appendChild(document.createElement("br"));
    songCell.appendChild(artist);
  } else if (trackName) {
    songCell.textContent = trackName;
  } else if (artistName) {
    const artist = document.createElement("span");
    artist.classList.add("band-name");
    artist.textContent = artistName;
    songCell.appendChild(artist);
  } else {
    songCell.textContent = "Unknown song";
  }

  return songCell;
};

//Function to create each row of the table with the track number, name of the song, playcount and duration
const createTrackRow = ({
  trackNumber,
  name: trackName,
  playcount,
  duration,
  artists,
}) => {
  const { totalMilliseconds } = duration;
  const { minutes, seconds } = convertMilliseconds(totalMilliseconds);

  const rowInfo = [
    trackNumber,
    trackName,
    parseInt(playcount).toLocaleString(),
    `${minutes}:${seconds}`,
  ];

  const row = document.createElement("tr");
  row.classList.add("row-album");

  for (let i = 0; i < rowInfo.length; i++) {
    let cell =
      i === 1
        ? createSongArtistCell(trackName, artists)
        : document.createElement("td");

    if (i !== 1) {
      cell.classList.add("album-cell");
      cell.textContent = rowInfo[i];
    }

    row.appendChild(cell);
  }

  return row;
};

//Function to create the table by adding the headers and body of the table with the rows
const createAlbumTable = (tracks) => {
  const divTable = document.createElement("div");
  divTable.classList.add("table-container");

  const table = document.createElement("table");
  table.classList.add("album-table");
  table.appendChild(createTableHeaders());

  const tbody = document.createElement("tbody");
  tracks.items.forEach(({ track }) => {
    tbody.appendChild(createTrackRow(track));
  });

  table.appendChild(tbody);
  divTable.appendChild(table);

  return divTable;
};

const artistPage = () => {
  const body = document.getElementById("body-spotify");
  body.classList.add("body-spotify");

  const { artistUnion } = data;
  const { profile, stats, discography } = artistUnion;
  const { name: artistName, verified } = profile;
  const { monthlyListeners } = stats;
  const { albums } = discography;

  const header = document.createElement("header");
  const coverImageUrl = artistUnion.visuals.headerImage.sources[0].url;

  header.style.backgroundImage = `url(${coverImageUrl})`;
  header.style.backgroundSize = "cover";
  header.style.backgroundPosition = "center";
  header.classList.add("header-artist");
  //Verified
  const verifiedArtist = document.createElement("span");
  verifiedArtist.classList.add("header-info");
  //Veriffied Icon
  const verifiedIcon = document.createElement("span");
  verifiedIcon.classList.add("material-symbols-outlined", "verified-icon");
  verifiedIcon.textContent = "verified";
  const text = document.createElement("span");
  text.textContent = verified ? " Verified Artist" : " Unverified";
  text.classList.add("info-header-text");
  verifiedArtist.appendChild(verifiedIcon);
  verifiedArtist.appendChild(text);
  header.appendChild(verifiedArtist);

  //Artist Name
  const artistTitle = document.createElement("h1");
  artistTitle.classList.add("artist-title", "header-info");
  artistTitle.textContent = artistName;
  header.appendChild(artistTitle);

  //Monthly listeners
  const listenersInfo = document.createElement("span");
  listenersInfo.classList.add("header-info", "info-header-text");
  listenersInfo.textContent = `${monthlyListeners.toLocaleString()} monthly listeners`;
  header.appendChild(listenersInfo);

  body.appendChild(header);

  //Container for the albums
  const albumContainer = document.createElement("div");
  albumContainer.classList.add("artist-container");

  body.appendChild(albumContainer);

  albums.items.forEach(({ releases }) => {
    const { items } = releases;
    const { name: albumName, coverArt, tracks, type, date } = items[0];

    //Div container for the album
    const albumInfo = document.createElement("div");
    albumInfo.classList.add("album-info");

    //Container for the image and details
    const albumContent = document.createElement("div");
    albumContent.classList.add("album-content");

    //Div for the album img
    const divAlbumInfo = document.createElement("div");
    divAlbumInfo.classList.add("album-image-container");

    const { url: coverUrl } = coverArt.sources[0];
    const albumCover = document.createElement("img");
    albumCover.src = coverUrl;
    albumCover.setAttribute("alt", "Album cover");
    albumCover.classList.add("cover-album");
    divAlbumInfo.appendChild(albumCover);

    albumContent.appendChild(divAlbumInfo);

    //Div for album details
    const albumDetails = document.createElement("div");
    albumDetails.classList.add("album-details");

    //Album title
    const albumTitle = document.createElement("a");
    albumTitle.classList.add("album-title");
    albumTitle.textContent = albumName;
    albumDetails.appendChild(albumTitle);

    //Album details
    const pDetails = document.createElement("p");
    pDetails.classList.add("details");
    const { year } = date;
    const { totalCount } = tracks;
    pDetails.textContent = `${type} • ${year} • ${totalCount} tracks`;
    albumDetails.appendChild(pDetails);

    albumContent.appendChild(albumDetails);

    albumInfo.appendChild(albumContent);

    //Album play button
    const playButton = document.createElement("button");
    playButton.classList.add("album-play-button");
    playButton.innerHTML = `<span class="material-symbols-outlined">play_arrow</span>`;
    albumDetails.appendChild(playButton);
    //Album library button
    const libraryButton = document.createElement("button");
    libraryButton.classList.add("album-library-button");
    libraryButton.innerHTML = `<span class="material-symbols-outlined">add_circle</span>`;
    albumDetails.appendChild(libraryButton);
    //Album download button
    const downloadButton = document.createElement("button");
    downloadButton.classList.add("album-download-button");
    downloadButton.innerHTML = `<span class="material-symbols-outlined">enable</span>`;
    albumDetails.appendChild(downloadButton);
    //Album 'more options' button
    const optionsButton = document.createElement("button");
    optionsButton.classList.add("album-options-button");
    optionsButton.innerHTML = `<span class="material-symbols-outlined">more_horiz</span>`;
    albumDetails.appendChild(optionsButton);

    albumInfo.appendChild(createAlbumTable(tracks));
    albumContainer.appendChild(albumInfo);
  });
};

artistPage();
