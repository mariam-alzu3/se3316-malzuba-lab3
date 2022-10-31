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

                //const title = `<div>` + genre.title + `</div>`
                //main.insertAdjacentHTML("beforeend", title)
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



// const artistBtn = document.getElementById('search-artist');

// async function loadArtists(searchTerm) {
//     const URL = `http://localhost:3000/api/data/artist?searchterm3=${searchTerm}`
//     const res = await fetch(`${URL}`);
//     const data = await res.json();
//     console.log(data)
//     console.log(searchTerm)
//     const item = `<div>` + data.searchTerm + `</div>`
//     main.insertAdjacentHTML("beforeend", item);
// }

// artistBtn.onclick = function () {
//     loadArtists();
// }