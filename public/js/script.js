let ENTER = 13;

let songsArray = [];
let playlistArray = [];
let submitButton = document.getElementById("submit-button");

function getSong() {
  let songTitle = document.getElementById("songTitleField").value.trim();
  if (!songTitle) {
    alert("Please enter a Song Title");
  }

  let xhr = new XMLHttpRequest();
  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      let response = JSON.parse(xhr.responseText);
      songsArray = response.results;
      searchResults(songsArray, songTitle);
    }
  };
  xhr.open("GET", `/songs?title=${songTitle}`, true);
  xhr.send();
}

function addToPlaylist(e) {
  let index = playlistArray.findIndex(
    (item) => item.trackId == e.srcElement.id
  );
  if (index <= -1) {
    let song = songsArray.find((song) => song.trackId == e.srcElement.id);
    playlistArray.push(song);
    playListTable();
  } else {
    alert("This song is already in the playlist");
  }
}
function removeFromPlaylist(e) {
  let index = playlistArray.findIndex(
    (item) => item.trackId == e.srcElement.id
  );
  if (index > -1) {
    playlistArray.splice(index, 1);
    playListTable();
  } else {
    alert("This song is not in the playlist");
  }
}

function moveTo(direction, e) {
  let index = playlistArray.findIndex(
    (item) => item.trackId == e.srcElement.id
  );
  if (
    index > -1 &&
    index != (direction == "up" ? 0 : playlistArray.length - 1)
  ) {
    let element = playlistArray.splice(index, 1)[0];
    playlistArray.splice(index + (direction == "up" ? -1 : 1), 0, element);
    playListTable();
  }
}

function moveToUp(e) {
  moveTo("up", e);
}

function moveToDown(e) {
  moveTo("down", e);
}

function searchResults(songList, songTitle) {
  let searchResultDiv = document.getElementById("songs");
  searchResultDiv.innerHTML = "";
  let songResult = document.createElement("h1");
  songResult.innerHTML = `Songs that match: ${songTitle}`;
  searchResultDiv.appendChild(songResult);
  if (songList.length === 0) {
    searchResultDiv.appendChild(
      document.createTextNode(`No songs match keyword: ${songTitle}`)
    );
  } else {
    let table = document.createElement("table");
    let tableBody = document.createElement("tbody");
    for (let j = 0; j < songList.length; j++) {
      let row = document.createElement("tr");
      for (let i = 0; i <= 3; i++) {
        let cell = document.createElement("td");
        if (i === 0) {
          let button = document.createElement("button");
          button.id = songList[j].trackId;
          button.innerHTML = "+";
          cell.appendChild(button);
        }
        if (i === 1) {
          cell.innerHTML = songList[j].trackCensoredName;
        }
        if (i === 2) {
          cell.innerHTML = songList[j].artistName;
        }
        if (i === 3) {
          let imageElement = document.createElement("img");
          imageElement.src = songList[j].artworkUrl60;
          cell.appendChild(imageElement);
        }
        row.appendChild(cell);
      }
      tableBody.appendChild(row);
    }
    table.appendChild(tableBody);
    searchResultDiv.appendChild(table);
    let buttonElements = searchResultDiv.getElementsByTagName("button");
    for (let i = 0; i < buttonElements.length; i++) {
      buttonElements[i].addEventListener("click", addToPlaylist);
    }
  }
}

function playListTable() {
  let playlistTableBody = document.getElementById("playlist-body");
  let playlistText = document.getElementById("playlists");
  playlistTableBody.innerHTML = "";
  playlistText.innerHTML = playlistArray.length > 0 ? `<h1>Playlist</h1>` : "";

  localStorage.setItem("playlist", JSON.stringify(playlistArray));

  for (let j = 0; j < playlistArray.length; j++) {
    let row = document.createElement("tr");

    for (let i = 0; i <= 3; i++) {
      let cell = document.createElement("td");

      if (i === 0) {
        cell.innerHTML = `
            <button id="${playlistArray[j].trackId}" class="remove-btn">-</button>
            <button id="${playlistArray[j].trackId}" class="up-arrow">&uarr;</button>
            <button id="${playlistArray[j].trackId}" class="down-arrow">&darr;</button>`;
      }
      if (i === 1) {
        cell.textContent = playlistArray[j].trackCensoredName;
      }
      if (i === 2) {
        cell.textContent = playlistArray[j].artistName;
      }
      if (i === 3) {
        let imageElement = document.createElement("img");
        imageElement.src = playlistArray[j].artworkUrl60;
        cell.appendChild(imageElement);
      }
      row.appendChild(cell);
    }
    playlistTableBody.appendChild(row);
  }

  playlistTableBody
    .querySelectorAll(".remove-btn")
    .forEach((btn) => btn.addEventListener("click", removeFromPlaylist));
  playlistTableBody
    .querySelectorAll(".up-arrow")
    .forEach((btn) => btn.addEventListener("click", moveToUp));
  playlistTableBody
    .querySelectorAll(".down-arrow")
    .forEach((btn) => btn.addEventListener("click", moveToDown));
}

window.addEventListener("load", () => {
  let playlist = localStorage.getItem("playlist");
  if (playlist) {
    playlistArray = JSON.parse(playlist);
    playListTable();
  }
});

let expiringDate = new Date();
expiringDate.setDate(expiringDate.getDate() + 3);
localStorage.setItem("playlistExpiringDate", expiringDate.toISOString());

let playlistExpiringDate = localStorage.getItem("playlistExpiringDate");
if (playlistExpiringDate) {
  let date = new Date(playlistExpiringDate);
  if (date < new Date()) {
    localStorage.removeItem("playlist");
    localStorage.removeItem("playlistExpiringDate");
  }
}

function handleKeyUp(event) {
  event.preventDefault();
  if (event.keyCode === ENTER) {
    submitButton.click();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  submitButton.addEventListener("click", getSong);

  //add key handler for the document as a whole, not separate elements.
  document.addEventListener("keyup", handleKeyUp);
});
