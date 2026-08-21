/* =========================================================
   GT650 — Audio-only YouTube playlist player
   Real titles + thumbnails preloaded via YouTube oEmbed API
   ========================================================= */

const PLAYLIST_ID = "PLYKPXq99tkmM";

let player;
let isPlaying = false;
let currentIndex = 0;
let playlistData = []; // {videoId, title, thumbnail}
let seekInterval;

const trackTitleEl   = document.getElementById('trackTitle');
const trackIndexEl   = document.getElementById('trackIndex');
const discEl         = document.getElementById('disc');
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
      playsinline: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

function onPlayerReady() {
  setTimeout(async () => {
    const ids = player.getPlaylist();
    if (!ids || !ids.length) return;
    await loadAllTrackDetails(ids);
    renderPlaylist();
    currentIndex = 0;
    updateTrackInfo(); // show first track's real name before play is even pressed
  }, 1000);
}

function onPlayerError(e) {
  console.warn('YouTube player error:', e.data);
  nextBtn.click();
}

// Fetch real title + thumbnail for every video BEFORE playing, using YouTube's public oEmbed endpoint
async function loadAllTrackDetails(ids) {
  const requests = ids.map(async (id) => {
    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      const data = await res.json();
      return { videoId: id, title: data.title, thumbnail: data.thumbnail_url };
    } catch (err) {
      return { videoId: id, title: 'Unknown Track', thumbnail: '' };
    }
  });
  playlistData = await Promise.all(requests);
}

function renderPlaylist() {
  playlistListEl.innerHTML = '';
  playlistData.forEach((track, i) => {
    const li = document.createElement('li');
    li.dataset.index = i;
    li.innerHTML = `
      <img class="track-thumb" src="${track.thumbnail}" alt="">
      <span class="track-num">${i + 1}</span>
      <span class="track-name">${track.title}</span>
    `;
    li.addEventListener('click', () => player.playVideoAt(i));
    playlistListEl.appendChild(li);
  });
  highlightActiveTrack();
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    isPlaying = true;
    setPlayIcon(true);
    discEl.classList.add('spinning');
    startSeekLoop();
    updateTrackInfo();
  } else if (e.data === YT.PlayerState.PAUSED) {
    isPlaying = false;
    setPlayIcon(false);
    discEl.classList.remove('spinning');
    stopSeekLoop();
  } else if (e.data === YT.PlayerState.ENDED) {
    isPlaying = false;
    setPlayIcon(false);
    discEl.classList.remove('spinning');
  } else if (e.data === YT.PlayerState.CUED) {
    updateTrackInfo();
  }
}

function setPlayIcon(playing) {
  playIcon.style.display = playing ? 'none' : 'block';
  pauseIcon.style.display = playing ? 'block' : 'none';
}

// Uses preloaded playlistData instead of waiting on player.getVideoData()
function updateTrackInfo() {
  if (!player || !player.getPlaylistIndex) return;
  currentIndex = player.getPlaylistIndex();
  if (currentIndex < 0) currentIndex = 0;

  const track = playlistData[currentIndex];
  if (track) {
    trackTitleEl.textContent = track.title;
    trackIndexEl.textContent = `Track ${currentIndex + 1} of ${playlistData.length}`;
    if (track.thumbnail) discEl.style.backgroundImage = `url(${track.thumbnail})`;
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
  setTimeout(updateTrackInfo, 600);
});

nextBtn.addEventListener('click', () => {
  if (!player) return;
  player.nextVideo();
  setTimeout(updateTrackInfo, 600);
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

/* Playlist popup toggle — same slide+fade animation as before */
playlistToggle.addEventListener('click', () => {
  playlistPanel.classList.toggle('open');
  playlistToggle.classList.toggle('active-toggle');
});
