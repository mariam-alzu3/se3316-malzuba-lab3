//frontend

const main = document.getElementById('main');
let tableData = [];
const table = document.getElementById('table');
const btn = document.getElementById('seeMoreRecords')

var start = 0;
var num = 20;

function getData() {
    fetch('http://localhost:3000/api/data/tracks')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            tableData.push(data)
            data.slice(start, num).forEach(track => {
                const item = `<tr><th>` + track.track_id + `</th><th>` + track.track_title + `</th></tr>`
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
