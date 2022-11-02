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

//************************************************************************************************//
//************************************************************************************************//

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
                //const artistInfo = document.createTextNode("Name " + e.artist_name)
                //item.appendChild(artistInfo);
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
                //const artistInfo = document.createTextNode("Name " + e.artist_name)
                //item.appendChild(artistInfo);
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

// function passValues() {
//     localStorage.setItem("textvalue", list)
// }