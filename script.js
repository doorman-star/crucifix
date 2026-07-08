const audio = document.getElementById("audio");
const playBtn = document.getElementById("playBtn");
const scrubWrap = document.getElementById("scrubWrap");
const scrubFill = document.getElementById("scrubFill");
const scrubThumb = document.getElementById("scrubThumb");
const timeDisplay = document.getElementById("timeDisplay");

let playing = false;

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

playBtn.addEventListener("click", () => {
  if (playing) {
    audio.pause();
    playing = false;
    playBtn.textContent = "▶";
  } else {
    audio.play().catch(() => { });
    playing = true;
    playBtn.textContent = "||";
  }
});

audio.addEventListener("loadedmetadata", () => {
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const percent = (audio.currentTime / audio.duration) * 100;

  scrubFill.style.width = percent + "%";
  timeDisplay.textContent = formatTime(audio.currentTime);
});

audio.addEventListener("ended", () => {
  playing = false;
  playBtn.textContent = "▶";
});

scrubWrap.addEventListener("click", (e) => {
  if (!audio.duration) return;

  const rect = scrubWrap.getBoundingClientRect();
  const percent = Math.max(
    0,
    Math.min(1, (e.clientX - rect.left) / rect.width)
  );

  audio.currentTime = percent * audio.duration;
});

scrubWrap.addEventListener("mousemove", (e) => {
  const rect = scrubWrap.getBoundingClientRect();
  const percent = Math.max(
    0,
    Math.min(1, (e.clientX - rect.left) / rect.width)
  );

  scrubThumb.style.left = percent * 100 + "%";
});