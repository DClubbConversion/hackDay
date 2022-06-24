
var cache = new LastFMCache();
var lastfm = new LastFM({
    apiKey    : '767b44e8774eb78edc8cdd34c6d2f6db',
    apiSecret : 'c58f453e341f858e86a9277736ba91f9',
    cache     : cache
});

let storeCurrentSong;

const currentElements = {
    title: document.querySelector('.currentlyPlaying p'),
    img: document.querySelector('.currentlyPlaying img'),
    artist: document.querySelector('.currentlyPlaying small'),
}

function showNowPlaying(){
    lastfm.user.getRecentTracks({user: 'jacktoothill'}, {success: function(data){
        console.log(data);
        if(storeCurrentSong === data.recenttracks.track[0].name) return

        const artistName = data.recenttracks.track[0].artist['#text'];
        const trackName = data.recenttracks.track[0].name;
        const imgSrc = data.recenttracks.track[0].image[1]['#text'];

        storeCurrentSong = trackName;


        currentElements.title.textContent = trackName;
        currentElements.artist.textContent = artistName;
        currentElements.img.src = imgSrc;


    }, error: function(code, message){
        console.log(message);
    }});
}

setInterval(showNowPlaying, 1000);