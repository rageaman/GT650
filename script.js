/* =========================================================
   GT 650 Music Zone — YouTube IFrame API powered player
   Real playlist control: play/pause/next/prev/seek/track-name
   ========================================================= */

const PLAYLIST_ID = "PLYKPXq99tkmM";

let player;
let isPlaying = false;
let currentIndex = 0;
let playlistData = []; // {index, videoId, title}
let seekInterval;

// DOM refs
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

// Called automatically by YouTube IFrame API script
function onYouTubeIframeAPIReady() {
  player = new YT.Player('yt-player', {
    height: '0',
    width: '0',
    playerVars: {
      listType: 'playlist',
      list: PLAYLIST_ID,
      autoplay: 0,
      controls: 0
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function onPlayerReady() {
  buildPlaylistUI();
  updateTrackInfo();
}

function buildPlaylistUI() {
  // Wait briefly for playlist to populate internally
  setTimeout(() => {
    const ids = player.getPlaylist();
    if (!ids) return;
    playlistData = ids.map((id, i) => ({ index: i, videoId: id, title: `Track ${i + 1}` }));
    renderPlaylist();
    fetchTitles();
  }, 800);
}

function renderPlaylist() {
  playlistListEl.innerHTML = '';
  playlistData.forEach((track) => {
    const li = document.createElement('li');
    li.dataset.index = track.index;
    li.innerHTML = `<span class="track-num">${track.index + 1}</span><span class="track-name">${track.title}</span>`;
    li.addEventListener('click', () => {
      player.playVideoAt(track.index);
    });
    playlistListEl.appendChild(li);
  });
  highlightActiveTrack();
}

// Get real video titles one by one using a temporary player state read
function fetchTitles() {
  const originalIndex = player.getPlaylistIndex();
  playlistData.forEach((track, i) => {
    setTimeout(() => {
      player.playVideoAt(i);
      setTimeout(() => {
        const data = player.getVideoData();
        if (data && data.title) {
          playlistData[i].title = data.title;
          const li = playlistListEl.children[i];
          if (li) li.querySelector('.track-name').textContent = data.title;
        }
        if (i === playlistData.length - 1) {
          player.playVideoAt(originalIndex);
          player.pauseVideo();
          updateTrackInfo();
        }
      }, 400);
    }, i * 700);
  });
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
  }
}

function setPlayIcon(playing) {
  playIcon.style.display = playing ? 'none' : 'block';
  pauseIcon.style.display = playing ? 'block' : 'none';
}

function updateTrackInfo() {
  currentIndex = player.getPlaylistIndex();
  const data = player.getVideoData();
  const title = (data && data.title) ? data.title : `Track ${currentIndex + 1}`;
  trackTitleEl.textContent = title;
  trackIndexEl.textContent = `Track ${currentIndex + 1} of ${playlistData.length || '...'}`;
  highlightActiveTrack();
}

function highlightActiveTrack() {
  [...playlistListEl.children].forEach((li, i) => {
    li.classList.toggle('active', i === currentIndex);
  });
}

/* ---------- Controls ---------- */
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

/* ---------- Seek bar ---------- */
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
function stopSeekLoop() {
  clearInterval(seekInterval);
}

seekBar.addEventListener('input', () => {
  if (!player) return;
  const dur = player.getDuration();
  const seekTo = (seekBar.value / 100) * dur;
  player.seekTo(seekTo, true);
});

function formatTime(sec) {
  sec = Math.floor(sec);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/* ---------- Playlist panel toggle ---------- */
playlistToggle.addEventListener('click', () => {
  playlistPanel.classList.toggle('open');
  playlistToggle.classList.toggle('open');
  const label = playlistToggle.querySelector('span');
  label.textContent = playlistPanel.classList.contains('open') ? 'Hide Playlist' : 'View Playlist';
});
