
// ======= MAPA LEAFLET ============
document.addEventListener("DOMContentLoaded", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const map = L.map("map").setView([lat, lng], 15);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution: "&copy; OpenStreetMap",
        }).addTo(map);

        L.marker([lat, lng]).addTo(map).bindPopup("Estás aquí").openPopup();
      },
      () => {
        document.getElementById("map").innerHTML =
          "<p>No se pudo obtener tu ubicación.</p>";
      }
    );
  } else {
    document.getElementById("map").innerHTML =
      "<p>Tu navegador no soporta geolocalización.</p>";
  }
});

// ======= AUDIO ============
const songs = [
  "https://ia801302.us.archive.org/13/items/salsa_202510/VARIOS.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/VALLENATOS.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/TIERRA%20CANELA.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/SALSA.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/REGGAETON%20VIEJO.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/REGGAETON%20MERENGUE.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/REGAETON%20Y%20DENBOW.mp3",
  "https://ia601302.us.archive.org/13/items/salsa_202510/MERENGUE.mp3",
  "https://ia601302.us.archive.org/13/items/salsa_202510/CUMBIA%20PERUANA.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/CUMBIA%20MEX%20Y%20MAX.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/CUMBIA%20ECUADOR.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/CHICHA%20PERUANA.mp3",
  "https://ia801302.us.archive.org/13/items/salsa_202510/BACHATA.mp3"
];

let currentIndex = 0;
const audio = document.getElementById("audio");
const trackName = document.getElementById("trackName");
const playPauseBtn = document.getElementById("playPauseBtn");

function loadSong(index) {
  audio.src = songs[index];
  updateTrackName(index);
  audio.play();
  playPauseBtn.textContent = "⏸️";
}

function updateTrackName(index) {
  const urlParts = songs[index].split("/");
  const fileName = decodeURIComponent(urlParts[urlParts.length - 1]);
  trackName.textContent = fileName.replace(".mp3", "");
}

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "⏸️";
  } else {
    audio.pause();
    playPauseBtn.textContent = "▶️";
  }
}

function nextSong() {
  currentIndex = (currentIndex + 1) % songs.length;
  loadSong(currentIndex);
}

function prevSong() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  loadSong(currentIndex);
}

audio.addEventListener("ended", nextSong);
loadSong(currentIndex); // Inicia con la primera canción

// ======= TAXI ANIMACIÓN ============
document.body.addEventListener("click", () => {
  const taxi = document.getElementById("taxi");
  taxi.classList.remove("mover-derecha", "mover-izquierda");

  if (Math.random() < 0.5) {
    taxi.classList.add("mover-derecha");
  } else {
    taxi.classList.add("mover-izquierda");
  }
});

// ======= PWA - BURBUJA E INSTALACIÓN ============
let deferredPrompt;
const isAndroid = /android/i.test(navigator.userAgent);
const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);

window.addEventListener("load", () => {
  if (isAndroid) {
    window.addEventListener("beforeinstallprompt", (e) => {
      e.preventDefault();
      deferredPrompt = e;

      const bubble = document.getElementById("install-bubble");
      if (bubble) {
        bubble.style.display = "block";

        bubble.addEventListener("click", () => {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => {
            deferredPrompt = null;
            bubble.style.display = "none";
          });
        });
      }
    });
  }

  // Mostrar cuadro informativo para iOS
  if (isIos && !window.matchMedia("(display-mode: standalone)").matches) {
    if (!document.getElementById("ios-info-box")) {
      const infoBox = document.createElement("div");
      infoBox.id = "ios-info-box";
      infoBox.innerHTML = `
        <div style="
          position: fixed;
          bottom: 20px;
          left: 20px;
          right: 20px;
          background: #fff;
          border: 2px solid #0D47A1;
          border-radius: 12px;
          padding: 15px;
          font-size: 14px;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          z-index: 10000;
        ">
          📲 Para instalar esta app, presiona <strong>Compartir</strong> y luego <strong>Agregar a pantalla de inicio</strong>.
          <div style="text-align: right; margin-top: 10px;">
            <button id="close-info-box" style="background:#0D47A1;color:white;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">Cerrar</button>
          </div>
        </div>
      `;
      document.body.appendChild(infoBox);

      document.getElementById("close-info-box").addEventListener("click", () => {
        infoBox.remove();
      });
    }
  }
});

// ======= REGISTRO DEL SERVICE WORKER ============
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("service-worker.js")
    .then(() => console.log("✅ Service Worker registrado"))
    .catch((err) => console.warn("❌ Error al registrar SW:", err));
}