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

//Function to insert the name of the song and/or artist
const createSongArtistCell = (trackName, artistName) => {
  const songCell = document.createElement("td");
  songCell.classList.add("album-cell");

  if (!trackName && !artistName) {
    songCell.textContent = "Unknown song";
    return songCell;
  }

  const songLink = document.createElement("a");
  songLink.classList.add("a-link");
  songLink.href = "#";
  songLink.textContent = trackName;

  songCell.appendChild(songLink);

  songCell.appendChild(document.createElement("br"));

  const artistLink = document.createElement("a");
  artistLink.classList.add("a-link");
  artistLink.href = "#";

  const artist = document.createElement("span");
  artist.classList.add("band-name");
  artist.textContent = artistName;
  artistLink.appendChild(artist);
  songCell.appendChild(artistLink);

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

  const [
    {
      profile: { name: artistName },
    },
  ] = artists.items;

  for (let i = 0; i < rowInfo.length; i++) {
    let cell =
      i === 1
        ? createSongArtistCell(trackName, artistName)
        : document.createElement("td");

    if (i !== 1) {
      cell.classList.add("album-cell");
      cell.textContent = rowInfo[i];
    }

    if (i === 3) {
      const buttonLikedSong = document.createElement("button");
      buttonLikedSong.classList.add("button-table");
      buttonLikedSong.setAttribute("title", "Add to liked songs");
      buttonLikedSong.innerHTML = `<span class="material-symbols-outlined">add_circle</span>`;

      const durationWrapper = document.createElement("div");
      durationWrapper.classList.add("duration-container");

      const durationText = document.createElement("span");
      durationText.textContent = rowInfo[i];

      const buttonOptionsSong = document.createElement("button");
      buttonOptionsSong.classList.add("button-table");
      buttonOptionsSong.setAttribute("title", "More options");
      buttonOptionsSong.innerHTML = `<span class="material-symbols-outlined">more_horiz</span>`;

      durationWrapper.appendChild(buttonLikedSong);
      durationWrapper.appendChild(durationText);
      durationWrapper.appendChild(buttonOptionsSong);

      cell.textContent = "";
      cell.appendChild(durationWrapper);
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
  verifiedIcon.classList.add(
    "material-symbols-outlined",
    "verified-icon",
    "filled-icon"
  );
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

  //Container for the play button, the follow button
  const divFollow = document.createElement("div");
  divFollow.classList.add("div-play-follow");
  //Button play
  const buttonPlayAll = document.createElement("button");
  buttonPlayAll.classList.add(
    "button-play-all",
    "filled-icon",
    "divFollow-element"
  );
  buttonPlayAll.innerHTML = `<span class="material-symbols-outlined">play_arrow</span>`;
  divFollow.appendChild(buttonPlayAll);
  //Button follow artist
  const buttonFollow = document.createElement("button");
  buttonFollow.classList.add("button-follow", "divFollow-element");
  buttonFollow.textContent = "Follow";
  divFollow.appendChild(buttonFollow);
  //Button more options
  const moreOptionsButton = document.createElement("button");
  moreOptionsButton.classList.add("album-options-button", "divFollow-element");
  moreOptionsButton.innerHTML = `<span class="material-symbols-outlined">more_horiz</span>`;
  divFollow.appendChild(moreOptionsButton);

  body.appendChild(divFollow);

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
    playButton.classList.add("album-play-button", "filled-icon");
    playButton.innerHTML = `<span class="material-symbols-outlined">play_arrow</span>`;
    albumDetails.appendChild(playButton);
    //Album library button
    const libraryButton = document.createElement("button");
    libraryButton.classList.add("album-library-button");
    libraryButton.setAttribute("title", "Save to your library");
    libraryButton.innerHTML = `<span class="material-symbols-outlined">add_circle</span>`;
    albumDetails.appendChild(libraryButton);
    //Album download button
    const downloadButton = document.createElement("button");
    downloadButton.classList.add("album-download-button");
    downloadButton.setAttribute("title", "Download");
    downloadButton.innerHTML = `<span class="material-symbols-outlined">enable</span>`;
    albumDetails.appendChild(downloadButton);
    //Album 'more options' button
    const optionsButton = document.createElement("button");
    optionsButton.classList.add("album-options-button");
    optionsButton.setAttribute("title", "More options");
    optionsButton.innerHTML = `<span class="material-symbols-outlined">more_horiz</span>`;
    albumDetails.appendChild(optionsButton);

    albumInfo.appendChild(createAlbumTable(tracks));
    albumContainer.appendChild(albumInfo);
  });
};

artistPage();
