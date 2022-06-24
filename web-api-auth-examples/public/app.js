const searchBox = document.querySelector('#searchBox');
searchBox.addEventListener('keyup', e => {
    getSuggestions(e.target.value);
});

function getSuggestions(value){
    var params = encodeURIComponent(value);
    fetch("https://api.spotify.com/v1/search?q="+ params +"&type=track%2Cartist&market=ES&limit=10&offset=5", {
        headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer BQB7pJ3nCCwF7jzOlCuyUXM9_DaYVAeBRKKUYfkYtAgm5xKs5NCs3Y-9dh-Y4UObozy2n79txhTFcqn0nWOc060Fd0quwQzHyI76gP-WR-m6407iJqp9xu2S0dZQptPc5DBW7qWBI-Tc0dIrL-W4p3qWWmGG6vXW1hzN-vtB-rkhZeNlPOlAEsFm8oUSDDL_0mFeITNd0KYjTqV49TIffw&refresh_token=AQASRUprTrvLgUA0Hyw7BqyT8t0BwfgQEHxboj8FQU1nWD8yCENoyoX1UZF8WEIX9mEE4PBAdKYUJ5DIEuXEynVMDixZEc87w0GxubD_IAfTXZ3fTaU4mbucRQ0clV7bNK8"
        }
    })
    .then(response => response.json())
    .then(data =>  {
        renderData(data);
    })
}

var suggestionTemplate = (data) => {
    return `
    <div class="suggestion">
        <img src="${data.albumImg}" > 
        <p>${data.trackName}</p>
        <small>${data.artist}</small>

        <a class="addToQueue" target="_blank" href="${data.mailTo}">Add to Queue</a>
    </div>
    `;
}

function renderData(data){
    console.log(data.tracks);
    const artistsElement = document.querySelector('#artists ul');
    const tracksElement = document.querySelector('#tracks');

    if(document.querySelector('.suggestion')){
        document.querySelectorAll('.suggestion').forEach(el => {
            el.remove();
        });
    }

    if(data.tracks){
        var tracks = data.tracks.items;

        tracks.forEach(track => {
            var data = {
                albumImg: track.album.images[1].url,
                songLength: track.duration_ms,
                trackName: track.name,
                artist: track.artists[0].name,
                mailTo: 'mailto:jack.toothill@conversion.com?subject=Play this please&body=' + track.name + ' - ' + track.artists[0].name,
            };

            var element = suggestionTemplate(data);

            tracksElement.insertAdjacentHTML('beforeend', element);
        });
    }

}

// function getNewToken(){
//     console.log('getnewtoken called');
//     fetch('/refresh_token')
//     .then(data => console.log(data));
//     // .then(data => console.log(data));
// }

// getNewToken();

document.addEventListener('click', e => {
    if(e.target.classList.contains('suggestion')){

    }
});