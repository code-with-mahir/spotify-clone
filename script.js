// Fetch songs from songs folder
async function getSongs() {
    let a = await fetch('/songs');
    let response = await a.text();

    const div = document.createElement('div');
    div.innerHTML = response;

    let as = div.getElementsByTagName('a');

    let songs = [];
    for (let a of as) {
        if (a.href.endsWith('.mp3')) {
            songs.push(a.href);
        }
    }
    return songs;
}

// Duration Formatting
async function timeFormate(totalSeconds) {
    return new Promise((resolve) => {
        let min = Math.floor(totalSeconds / 60);
        let sec = Math.floor(totalSeconds % 60);
        let formatedTime = `${min}:${sec < 10 ? 0 : ''}${sec}`;

        resolve(formatedTime);
    });
}

async function main() {
    // Get the list of songs
    let songs = await getSongs();

    const songUL = document.querySelector('.song-ul');
    for (let song of songs) {
        let fixSongName = song.split('%5C')[2].replaceAll('%20', ' ').replace('.mp3', '');
        let songName = fixSongName.split('-')[0].trim();

        let artistName = fixSongName.split('-')[1];

        let li = `<li class="song-li left-playlist bg-zinc-800 hover:bg-zinc-600 transition-all duration-100 ease-in-out p-2 rounded-xl flex justify-center items-center gap-3 border-2 border-white/10 cursor-pointer" data-songSrc="${song}" data-songName="${songName}">
                            <img src="songs/thumbnail/${songName}.jpg" class="h-12 rounded-md" alt="">
                            <div class="w-full song-details flex justify-between">
                                <div class="song-name-singer-album flex flex-col">
                                <span class="songName font-medium">${songName}</span>
                                <span class="songDetail text-xs text-zinc-400">${artistName}</span>
                                </div>
                                <div class="song-control flex">
                                    <div class="song-controller flex justify-center items-center h-full gap-2">
                                        <div class="play-stop ">
                                            <i class="play-Btn fa-solid fa-circle-play fa-xl hover:text-green-600 transition-all duration-200 ease-in-out text-[rgb(24,210,55)]"></i>
                                            <i class="pause-Btn fa-solid fa-circle-pause fa-xl hover:text-green-600 transition-all duration-200 ease-in-out text-[rgb(24,210,55)] !hidden"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>`;

        songUL.innerHTML = songUL.innerHTML + li;
    }

    // Song Src
    let currentSrc;

    let playBtn = document.querySelector('.playBtn');
    function showPlay() {
        playBtn.classList.remove('!hidden');
        pauseBtn.classList.add('!hidden');
    }
    let pauseBtn = document.querySelector('.pauseBtn');
    function showPause() {
        pauseBtn.classList.remove('!hidden');
        playBtn.classList.add('!hidden');
    }

    let currentSong = new Audio();

    const playSong = (track, songName) => {
        currentSong.src = track;
        if (currentSong.paused) {
            currentSong.play();
            showPause();
        } else if (!currentSong.paused) {
            currentSong.pause();
            showPlay();
        }
        let trackName = document.querySelector('.songname');
        trackName.innerHTML = songName;
    };

    // Default song
    let li = document.querySelectorAll('.song-ul li')[1];
    let songName = li.getAttribute('data-songName'); // get clicked src
    playSong(songs[1], songName);
    currentSong.pause();
    showPlay();

    // Next Song
    let next = document.querySelector('.next');
    next.addEventListener('click', () => {
        playSong(songs[songs + 1], songName);
        showPause();
    });

    let lis = document.querySelectorAll('.song-li');
    lis.forEach((li) => {
        li.addEventListener('click', () => {
            currentSrc = li.getAttribute('data-songSrc'); // get clicked src
            let songName = li.getAttribute('data-songName'); // get clicked song name
            playSong(currentSrc, songName);
        });
    });

    let songTime = document.querySelector('.song-time');
    currentSong.addEventListener('timeupdate', async () => {
        let currTime = await timeFormate(currentSong.currentTime);
        let songDuration = await timeFormate(currentSong.duration);

        if (songDuration !== "NaN:NaN") {
            songTime.innerHTML = `${currTime}/${songDuration}`;
        }


        let circle = document.querySelector('.circle');
        let percent = ((currentSong.currentTime / currentSong.duration) * 100).toFixed(3);
        circle.style.left = `${percent}%`;
    });

    let seekbar = document.querySelector('.seekbar');
    seekbar.addEventListener('click', (e) => {
        let rect = seekbar.getBoundingClientRect();
        let rectWidth = rect.width;
        let offsetX = e.offsetX;
        let percent = (offsetX / rectWidth) * 100;

        let circle = document.querySelector('.circle');
        circle.style.left = `${percent}%`;

        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    playBtn.addEventListener('click', () => {
        currentSong.play();
        showPause();
    });

    pauseBtn.addEventListener('click', () => {
        currentSong.pause();
        showPlay();
    });

    const closeLeft = () => {
        leftSidebar.classList.add('max-[767px]:-left-[120%]', 'w-2/5');
        leftSidebar.classList.remove('w-full');

        hamburger.classList.remove('!hidden');
        closeBtn.classList.add('hidden');
    };

    let leftSidebar = document.querySelector('.left-contentBar');
    let hamburger = document.querySelector('.hamburger');
    let closeBtn = document.querySelector('.closeBtn');
    hamburger.addEventListener('click', () => {
        leftSidebar.classList.add('z-50', 'w-full');
        leftSidebar.classList.remove('max-[767px]:-left-[120%]', 'w-2/5');
        hamburger.classList.add('!hidden');
        closeBtn.classList.remove('hidden');

        let right = document.querySelector('.right');

        right.addEventListener('click', closeLeft);
    });

    closeBtn.addEventListener('click', closeLeft);
}

main();
