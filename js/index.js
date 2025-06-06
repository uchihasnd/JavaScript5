import { data } from "./data.js";

//Function to create table headers
const createTableHeaders = () => {
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headers = ["#", "Title", "Plays", "Duration"];

  headerRow.classList.add("header-table");

  for (let i = 0; i < headers.length; i++) {
    const th = document.createElement("th");
    th.textContent = headers[i];
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);
  return thead;
};

//Function to create each row of the table with the track number, name of the song, playcount and duration
const createTrackRow = ({
  trackNumber,
  name: trackName,
  playcount,
  duration,
}) => {
  const { totalMilliseconds } = duration;
  const minutes = Math.floor(totalMilliseconds / 60000);
  const seconds = ((totalMilliseconds / 1000) % 60).toFixed(0).padStart(2, "0");

  const rowInfo = [
    trackNumber,
    trackName,
    parseInt(playcount).toLocaleString(),
    `${minutes}:${seconds}`,
  ];

  const row = document.createElement("tr");
  row.classList.add(".row-album")

  for (let i = 0; i < rowInfo.length; i++) {
    const cell = document.createElement("td");
    cell.classList.add("album-cell");
    cell.textContent = rowInfo[i];
    row.appendChild(cell);
  }

  return row;
};

//Function to create the table by adding the headers and body of the table with the rows
const createAlbumTable = (tracks) => {
  const table = document.createElement("table");
  table.classList.add("album-table")
  table.appendChild(createTableHeaders());

  const tbody = document.createElement("tbody");
  tracks.items.forEach(({ track }) => {
    tbody.appendChild(createTrackRow(track));
  });

  table.appendChild(tbody);
  return table;
};

const artistPage = () => {
  const body = document.getElementById("body-spotify");

  const { artistUnion } = data;
  const { profile, stats, discography } = artistUnion;
  const { name: artistName, verified } = profile;
  const { monthlyListeners } = stats;
  const { albums } = discography;

  const header = document.createElement("header");
  //Verified
  const verifiedArtist = document.createElement("span");
  verifiedArtist.textContent = verified ? "✔ Verified Artist" : "Unverified";
  header.appendChild(verifiedArtist);

  //Artist Name
  const artistTitle = document.createElement("h1");
  artistTitle.classList.add("artist-title")
  artistTitle.textContent = artistName;
  header.appendChild(artistTitle);

  //Monthly listeners
  const listenersInfo = document.createElement("span");
  listenersInfo.textContent = `${monthlyListeners.toLocaleString()} monthly listeners`;
  header.appendChild(listenersInfo);

  body.appendChild(header);

  //Container for the albums
  const albumContainer = document.createElement("div");
  albumContainer.classList.add("artist-container");

  body.appendChild(albumContainer);

  albums.items.forEach(({ releases }) => {
    const { items } = releases;
    const { name: albumName, coverArt, tracks } = items[0];

    const albumInfo = document.createElement("div");

    const { url: coverUrl } = coverArt.sources[1];
    const albumCover = document.createElement("img");
    albumCover.src = coverUrl;
    albumInfo.appendChild(albumCover);

    const albumTitle = document.createElement("h2");
    albumTitle.classList.add("album-title");
    albumTitle.textContent = albumName;
    albumInfo.appendChild(albumTitle);

    albumInfo.appendChild(createAlbumTable(tracks));
    albumContainer.appendChild(albumInfo);
  });
};

artistPage();
