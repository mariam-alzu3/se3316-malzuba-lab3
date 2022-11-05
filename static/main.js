//frontend

const main = document.getElementById('main');
let tableData = [];
const table = document.getElementById('table');
const btn = document.getElementById('seeMoreRecords')

var start = 0;
var num = 22;

function getData() {
    fetch('http://localhost:3000/api/data/tracks')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            tableData.push(data)
            data.slice(start, num).forEach(track => {
                const item = `<tr><th>` + track.track_id + `</th><th>` + track.track_title + `</th><th>` + track.album_title + `</th></tr>`
                table.insertAdjacentHTML("beforeend", item)
            })
            start = num;
            num += 5;
        })
        .catch(err => console.log(err))
}

getData();

btn.onclick = function () {
    getData();
}


function loadArtists() {
    let searchInput = document.getElementById('search-artist');
    const list = document.getElementById('list');               //list to store in artists names
    let results = [];
    console.log(results)
    clearList(list);
    fetch('/api/data/artists')
        .then(res => res.json())
        .then(data => {
            for (i = 0; i < data.length; i++) {
                value = data[i].artist_name;
                if (value.toLowerCase().indexOf(searchInput.value.toLowerCase()) > -1) {
                    results[i] = data[i];
                }
            }
            console.log(results);

            results.forEach(e => {
                const item = document.createElement('li')
                item.classList.add('search-list-item')
                item.appendChild(document.createTextNode(`${e.artist_name}`));
                //const artistInfo = document.createTextNode("Name " + e.artist_name)
                //item.appendChild(artistInfo);
                list.appendChild(item);
            });
        })
}

function loadAlbums() {
    let searchInput = document.getElementById('search-album');
    const list = document.getElementById('list');               //list to store in artists names
    let results = [];
    console.log(results)
    clearList(list);
    fetch('/api/data/albums')
        .then(res => res.json())
        .then(data => {
            for (i = 0; i < data.length; i++) {
                value = data[i].album_title;
                if (value.toLowerCase().indexOf(searchInput.value.toLowerCase()) > -1) {
                    results[i] = data[i];
                }
            }
            console.log(results);

            results.forEach(e => {
                const item = document.createElement('li')
                item.classList.add('search-list-item')
                item.appendChild(document.createTextNode(`${e.album_title}`));
                list.appendChild(item);
            });
        })
}

function loadTracks() {
    let searchInput = document.getElementById('search-track');
    const list = document.getElementById('list');               //list to store in artists names
    let results = [];
    console.log(results)
    clearList(list);
    fetch('/api/data/tracks')
        .then(res => res.json())
        .then(data => {
            for (i = 0; i < data.length; i++) {
                value = data[i].track_title;
                if (value.toLowerCase().indexOf(searchInput.value.toLowerCase()) > -1) {
                    results[i] = data[i];
                }
            }
            console.log(results);

            results.forEach(e => {
                const item = document.createElement('li')
                item.classList.add('search-list-item')
                item.appendChild(document.createTextNode(`${e.track_title}`));
                list.appendChild(item);
            });
        })
}

function clearList(element) {                                      //clears the list of older searches
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

document.getElementById('search-track-button').addEventListener('click', loadTracks);
document.getElementById('search-album-button').addEventListener('click', loadAlbums);
document.getElementById('search-artist-button').addEventListener('click', loadArtists);


//CREATE PLAYLIST
const popup = document.querySelector("#popup");                     //pop-up
const openPopUP = document.getElementById("create-playlist");       //search button to open the popup
const closePopUp = document.querySelector(".close-button");         //exit button closes the popup
const addMoreTrack = document.getElementById('add-more-tracks')

openPopUP.addEventListener("click", () => {                         //clicking the search button shows the popup
    popup.showModal();
});

closePopUp.addEventListener("click", () => {
    popup.close();                                                  //clicking the exit button closes the popup
});

const tracksFieldsList = document.getElementById('tracks-fields');
const addMoreTracks = document.getElementById('add-more-tracks');
const playlistName = document.getElementById('add-playlist-name');
const trackID = document.getElementById('add-tracks');
const savePlaylist = document.getElementById('save-button');


savePlaylist.onclick = function () {
    console.log(playlistName.value);
    console.log(trackID.value);
}


addMoreTracks.onclick = function () {
    var newField = document.createElement('input');
    newField.setAttribute('type', 'text');
    newField.setAttribute('maxlength', '20');
    newField.setAttribute('class', 'form-control');
    newField.setAttribute('id', 'add-tracks');
    newField.setAttribute('placeholder', 'Add a track ID');
    tracksFieldsList.appendChild(newField);
}

//create
function createPlaylist() {
    const createdPlaylist = { name: playlistName.value, tracks: [trackID.value] }

    fetch(`/api/data/playlist`, {
        method: "POST",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(createdPlaylist)
    })
        .then(res => {
            if (res.ok) {
                res.json()
            } else {
                console.log("Error: ", res.status);
            }
            return res;
        })
        .then(data => console.log(data))
        .catch(error => console.log(error))

}

savePlaylist.addEventListener('click', createPlaylist);


//load playlists onto homepage
function getPlaylists() {
    const list = document.getElementById('playlists');               //list to store in artists names
    let results = [];
    console.log(results)
    clearList(list);
    fetch('/api/data/playlist')
        .then(res => res.json())
        .then(data => {
            console.log(data);

            data.forEach(e => {
                const item = document.createElement('li')
                const link = document.createElement('a')
                item.id = "playlist-list-item"
                item.classList.add('playlist-list-item')

                link.setAttribute('id', 'list-name')
                link.setAttribute('href', '#')
                item.appendChild(link)

                link.appendChild(document.createTextNode(`${e.name}`));
                list.appendChild(item);
            });
        })
}

getPlaylists();


function loadPlaylistInfo() {
    const list = document.getElementById('info')
    const listName = document.getElementById('list-name')
    console.log(listName.textContent)
    clearList(list);
    fetch(`/api/data/playlist?name=${listName.textContent}`)
        .then(res => res.json())
        .then(data => {
            console.log(data)

            const item = document.createElement('li')
            item.classList.add('info-item')
            item.appendChild(document.createTextNode(`${data.name}`));
            item.appendChild(document.createTextNode("\n" + `${data.tracks}`));
            console.log(`${data.name}`);
            console.log(`${data.tracks}`);
            list.appendChild(item);
        })
}


const infoPopup = document.getElementById("playlist-info-popup");                     //pop-up
const closeInfo = document.getElementById("exit-info-button");         //exit button closes the popup

//click on playlist to view information
document.getElementById("playlists").addEventListener("click", function (e) {
    if (e.target && e.target.matches("li.playlist-list-item")) {
        //e.target.className = "foo"; // new class name here
        //alert("clicked " + e.target.innerText);
        infoPopup.showModal();
        loadPlaylistInfo();
    }
});

closeInfo.addEventListener("click", () => {
    infoPopup.close();                                                  //clicking the exit button closes the popup
});

//DELETE PLAYLIST
const delPopup = document.getElementById("delete-playlist-popup");                     //pop-up
const openBtn = document.getElementById("delete-playlist");           //search button to open the popup
const closeBtn = document.getElementById("exit-delete-button");         //exit button closes the popup

openBtn.addEventListener("click", () => {                         //clicking the search button shows the popup
    delPopup.showModal();
});

closeBtn.addEventListener("click", () => {
    delPopup.close();                                                  //clicking the exit button closes the popup
});

function deletePlaylist() {
    const deletePlaylistName = document.getElementById('delete-playlist-name');

    fetch(`/api/data/playlist/${deletePlaylistName.value}`, {
        method: "DELETE",
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(deletePlaylistName)
    })
        .then(res => {
            if (res.ok) {
                res.json()
            } else {
                console.log("Error: ", res.status);
            }
            return res;
        })
        .then(data => console.log(data))
        .catch(error => console.log(error))
}

document.getElementById('delete-button').addEventListener('click', deletePlaylist);
