document.addEventListener("DOMContentLoaded", () => {
  const musica = document.querySelector("#musica-fundo");
  const btn = document.querySelector("#play-pause");
  const volume = document.querySelector("#volume");

  // Define volume inicial
  musica.volume = parseFloat(volume.value);

  // Controle de volume
  volume.addEventListener("input", () => {
    musica.volume = parseFloat(volume.value);
  });

  // Play / Pause
  btn.addEventListener("click", () => {
    if (musica.paused) {
      musica.play().catch(() => {}); // ignora erro de autoplay
      btn.textContent = "⏸";
    } else {
      musica.pause();
      btn.textContent = "▶︎";
    }
  });
});