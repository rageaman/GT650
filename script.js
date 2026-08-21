/* =========================================================
   GT650 — Audio-only YouTube player (smooth + low-lag)
   ========================================================= */

const PLAYLIST_ID = "PLYKPXq99tkmM";

let player;
let isPlaying = false;
let currentIndex = 0;
let playlistData = [];
let seekInterval;

const trackTitleEl   = document.getElementById('trackTitle');
const trackIndexEl   = document.getElementById('trackIndex');
const trackThumbEl   = document.getElementById('trackThumb');
const playBtn        = document.getElementById('playBtn');
const playIcon       = document.getElementById('playIcon');
const pauseIcon      = document.getElementById('pauseIcon');
const prevBtn        = document.getElementById('prevBtn');
const nextBtn        = document.getElementById('nextBtn');
const muteBtn        = document.getElementById('muteBtn');
const volIcon        = document.getElementById('volIcon');
const seekBar        = document.getElementById('seekBar');
const curTimeEl      = document.getElementById('curTime');
const durTimeEl      = document.getElementById('durTime');
const playlistToggle = document.getElementById('playlistToggle');
const playlistPanel  = document.getElementById('playlistPanel');
const playlistListEl = document.getElementById('playlistList');

function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '1',
    width: '1',
    playerVars: {
      listType: 'playlist',
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      modestbranding: 1,
      playsinline: 1,
      iv_load_policy: 3,   // annotations off — thoda aur load fast
      rel: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

function onPlayerReady() {
  // Video kabhi dikhta nahi, isliye lowest possible quality force karo —
  // isse buffering/lag bahut kam ho jaata hai kyunki bandwidth sirf audio pe kharch hota hai
  try {
    player.setPlaybackQuality('small');
  } catch (e) {}

  setTimeout(async () => {
    const ids = player.getPlaylist();
    if (!ids || !ids.length) return;

    // Pehle sirf current track ki detail turant fetch karo (fast start)
    await loadTrackDetail(0, ids[0]);
    updateTrackInfo();

    // Baaki saare tracks background mein, ek-ek karke (parallel nahi) load karo
    // taaki network/browser pe ek saath load na aaye aur lag na ho
    for (let i = 1; i < ids.length; i++) {
      await loadTrackDetail(i, ids[i]);
      const li = playlistListEl.children[i];
      if (li) {
        li.querySelector('.track-name').textContent = playlistData[i].title;
        li.querySelector('.track-thumb').src = playlistData[i].thumbnail;
      }
    }
  }, 800);

  buildEmptyPlaylistShell();
}

function buildEmptyPlaylistShell() {
  const ids = player.getPlaylist() || [];
  playlistListEl.innerHTML = '';
  ids.forEach((id, i) => {
    playlistData[i] = { videoId: id, title: 'Loading...', thumbnail: '' };
    const li = document.createElement('li');
    li.dataset.index = i;
    li.innerHTML = `
      <img class="track-thumb" src="" alt="">
      <span class="track-num">${i + 1}</span>
      <span class="track-name">Loading...</span>
    `;
    li.addEventListener('click', () => player.playVideoAt(i));
    playlistListEl.appendChild(li);
  });
}

async function loadTrackDetail(index, videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    const data = await res.json();
    playlistData[index] = { videoId, title: data.title, thumbnail: data.thumbnail_url };
  } catch (err) {
    playlistData[index] = { videoId, title: `Track ${index + 1}`, thumbnail: '' };
  }
}

function onPlayerError(e) {
  console.warn('YouTube player error:', e.data);
  nextBtn.click();
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    setPlayIcon(true);
    startSeekLoop();
    updateTrackInfo();
  } else if (e.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    setPlayIcon(false);
    stopSeekLoop();
  } else if (e.data === YT.PlayerState.ENDED) {
    isPlaying = false;
    setPlayIcon(false);
  } else if (e.data === YT.PlayerState.CUED) {
    updateTrackInfo();
  }
}

function setPlayIcon(playing) {
  playIcon.style.display = playing ? 'none' : 'block';
  pauseIcon.style.display = playing ? 'block' : 'none';
}

function updateTrackInfo() {
  if (!player || !player.getPlaylistIndex) return;
  currentIndex = player.getPlaylistIndex();
  if (currentIndex < 0) currentIndex = 0;

  const track = playlistData[currentIndex];
  if (track) {
    trackTitleEl.textContent = track.title;
    trackIndexEl.textContent = `${currentIndex + 1} / ${playlistData.length}`;
    trackThumbEl.src = track.thumbnail || '';
  }
  highlightActiveTrack();
}

function highlightActiveTrack() {
  [...playlistListEl.children].forEach((li, i) => {
    li.classList.toggle('active', i === currentIndex);
  });
}

/* Controls */
playBtn.addEventListener('click', () => {
  if (!player) return;
  isPlaying ? player.pauseVideo() : player.playVideo();
});

prevBtn.addEventListener('click', () => {
  if (!player) return;
  player.previousVideo();
  setTimeout(updateTrackInfo, 500);
});

nextBtn.addEventListener('click', () => {
  if (!player) return;
  player.nextVideo();
  setTimeout(updateTrackInfo, 500);
});

let isMuted = false;
muteBtn.addEventListener('click', () => {
  if (!player) return;
  isMuted = !isMuted;
  isMuted ? player.mute() : player.unMute();
  volIcon.style.opacity = isMuted ? '0.4' : '1';
});

/* Seek bar */
function startSeekLoop() {
  stopSeekLoop();
  seekInterval = setInterval(() => {
    if (!player || !player.getDuration) return;
    const dur = player.getDuration();
    const cur = player.getCurrentTime();
    if (dur > 0) {
      seekBar.value = (cur / dur) * 100;
      curTimeEl.textContent = formatTime(cur);
      durTimeEl.textContent = formatTime(dur);
    }
  }, 500);
}
function stopSeekLoop(){ clearInterval(seekInterval); }

seekBar.addEventListener('input', () => {
  if (!player) return;
  const dur = player.getDuration();
  player.seekTo((seekBar.value / 100) * dur, true);
});

function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* Playlist popup toggle */
playlistToggle.addEventListener('click', () => {
  playlistPanel.classList.toggle('open');
  playlistToggle.classList.toggle('active-toggle');
});
