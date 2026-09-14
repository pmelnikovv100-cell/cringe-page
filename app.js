/* eslint-env browser */
(function () {
  "use strict";
  const C = window.BDAY_CONFIG;
  const $ = (id) => document.getElementById(id);
  const done = { c1: false, c2: false, c3: false };

  /* ================= HERO ================= */
  $("heroTitle").textContent = C.hero.title;
  $("heroName").textContent = C.hero.name;
  $("heroSub").textContent = C.hero.subtitle;
  $("marqueeText").textContent = C.hero.marquee.repeat(3);
  $("marqueeText2").textContent = C.hero.marquee.repeat(3);
  $("c1title").textContent = " " + C.cards.title;
  $("c1instr").textContent = C.cards.instruction;
  $("c2title").textContent = " " + C.roulette.title;
  $("c2instr").textContent = C.roulette.instruction;
  $("c3title").textContent = " " + C.photo.title;
  $("c3instr").textContent = C.photo.instruction;
  $("riddleQ").textContent = C.riddle.question;
  $("riddleA").textContent = C.riddle.answer;
  $("riddleNote").textContent = C.riddle.note || "";
  $("buyBtn").textContent = C.transcription.buttonLabel;
  $("priceLabel").textContent = C.transcription.price;
  $("modalPrice").textContent = C.transcription.price;
  $("uploadHint").textContent = C.transcription.uploadHint;
  $("recSecLabel").textContent = C.roulette.recordSeconds;
  $("recSecLabel2").textContent = C.roulette.recordSeconds;
  $("photoCounter").textContent = "0 / " + C.transcription.requiredPhotos;

  /* ================= TOUCH ================= */
  const isTouch = matchMedia("(hover: none), (pointer: coarse)").matches;
  if (isTouch) {
    document.documentElement.classList.add("touch");
    if (C.cards.instructionTouch) $("c1instr").textContent = C.cards.instructionTouch;
  }

  /* ================= CONFETTI ================= */
  const cvs = $("confetti"), ctx2 = cvs.getContext("2d");
  let parts = [];
  function sizeCanvas() { cvs.width = innerWidth; cvs.height = innerHeight; }
  sizeCanvas(); addEventListener("resize", sizeCanvas);
  function boom(n) {
    const cols = ["#ff2d95", "#ffd200", "#00e5ff", "#7c00ff", "#c6ff00", "#ffffff"];
    for (let i = 0; i < (n || 120); i++) {
      parts.push({
        x: Math.random() * cvs.width, y: -20 - Math.random() * cvs.height * 0.4,
        vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 4,
        s: 5 + Math.random() * 8, r: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25, c: cols[(Math.random() * cols.length) | 0], life: 1
      });
    }
  }
  (function loop() {
    ctx2.clearRect(0, 0, cvs.width, cvs.height);
    parts = parts.filter((p) => p.y < cvs.height + 40 && p.life > 0);
    parts.forEach((p) => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr; p.vy += 0.03;
      ctx2.save(); ctx2.translate(p.x, p.y); ctx2.rotate(p.r);
      ctx2.fillStyle = p.c; ctx2.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6); ctx2.restore();
    });
    requestAnimationFrame(loop);
  })();

  /* ================= POPUP BANNER ================= */
  (function initBanner() {
    const B = C.banner;
    const back = $("bannerBack");
    if (!B || B.enabled === false) { back.remove(); return; }

    const box = $("banner");
    $("bannerTitle").textContent = B.title || "";
    $("bannerText").textContent = B.text || "";
    if (!B.text) $("bannerText").hidden = true;

    // гифка / картинка
    if (B.gif) {
      const img = $("bannerGif");
      img.alt = B.gifAlt || "";
      img.addEventListener("load", () => { $("bannerGifWrap").hidden = false; });
      img.addEventListener("error", () => { $("bannerGifWrap").hidden = true; });
      img.src = B.gif;
    }

    // крестик
    const x = $("bannerX");
    if (B.showX === false) x.remove(); else x.addEventListener("click", close);

    const evasiveButtons = new Set();

    // кнопки
    bindBtn($("bannerBtn1"), B.primary);
    bindBtn($("bannerBtn2"), B.secondary);

    function bindBtn(el, cfg) {
  if (!cfg || !cfg.label) { el.remove(); return; }
  el.textContent = cfg.label;

  let fixedInited = false;

  const rectsOverlap = (a, b, margin = 12) =>
    a.left < b.right + margin &&
    a.right + margin > b.left &&
    a.top < b.bottom + margin &&
    a.bottom + margin > b.top;

const initFixed = () => {
  const rect = el.getBoundingClientRect();
  el.style.margin = "0";
  el.style.boxSizing = "border-box";
  el.style.position = "fixed";
  el.style.left = rect.left + "px";
  el.style.top = rect.top + "px";
  el.style.width = rect.width + "px";
  el.style.height = rect.height + "px";
  el.style.transition = "left 0.4s ease-out, top 0.4s ease-out";
  evasiveButtons.add(el);
  fixedInited = true;
};


const dodge = () => {
  if (!fixedInited) {
    initFixed();
    void el.offsetHeight; // форсирует reflow, "фиксирует" стартовое состояние для transition
  }

  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const maxX = window.innerWidth - w - 8;
  const maxY = window.innerHeight - h - 8;

  const others = [...evasiveButtons]
    .filter((b) => b !== el && document.body.contains(b))
    .map((b) => b.getBoundingClientRect());

  let candidate;
  for (let i = 0; i < 20; i++) {
    const x2 = 8 + Math.random() * (maxX - 8);
    const y2 = 8 + Math.random() * (maxY - 8);
    candidate = { left: x2, top: y2, right: x2 + w, bottom: y2 + h };
    const collides = others.some((o) => rectsOverlap(candidate, o));
    if (!collides) break;
  }

  el.style.left = candidate.left + "px";
  el.style.top = candidate.top + "px";
};

  el.addEventListener("click", (e) => {
    if (cfg.confetti) boom(140);
    const act = cfg.action || "close";

    if (act === "link" && cfg.href) {
      if (cfg.newTab === false) { location.href = cfg.href; return; }
      window.open(cfg.href, "_blank", "noopener");
      close();
      return;
    }

    if (act === "close") {
      dodge();
      return;
    }

    close();
    if (act === "scroll") {
      const t = document.querySelector(cfg.target || "#ch1");
      if (t) setTimeout(() => t.scrollIntoView({ behavior: "smooth", block: "start" }), 60);
    }
  });
}

    if (B.closeOnBackdrop !== false) {
      back.addEventListener("click", (e) => { if (!box.contains(e.target)) close(); });
    }
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !back.hidden) close(); });

    function close() {
      back.hidden = true;
      document.body.style.overflow = "";
    }
    function open() {
      back.hidden = false;
      document.body.style.overflow = "hidden";
      const first = box.querySelector(".btn");
      if (first) first.focus({ preventScroll: true });
    }

    setTimeout(open, Math.max(0, Number(B.delayMs) || 0));
  })();

  /* ================= PROGRESS / UNLOCK ================= */
  function markStep(step) {
    const pill = document.querySelector('.pill[data-step="' + step + '"]');
    if (pill) { pill.classList.add("done"); pill.querySelector("b").textContent = "✔"; }
  }
  function refreshLocks() {
    $("ch2").classList.toggle("locked", !done.c1);
    $("ch3").classList.toggle("locked", !done.c2);
    $("final").classList.toggle("locked", !(done.c1 && done.c2 && done.c3));
  }
  function complete(key, step, nextId) {
    if (done[key]) return;
    done[key] = true; markStep(step); refreshLocks(); boom(180);
    if (nextId) setTimeout(() => $(nextId).scrollIntoView({ behavior: "smooth", block: "start" }), 500);
  }
  refreshLocks();

  /* ================= 1. CARDS ================= */
  const grid = $("cardsGrid");
  let order = C.cards.items.slice();
  let picked = null;

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }
  function isSorted() { return order.every((it, i) => it.n === i + 1); }
  function renderCards() {
    grid.innerHTML = "";
    order.forEach((item, idx) => {
      const el = document.createElement("div");
      el.className = "card"; el.draggable = !isTouch; el.dataset.idx = idx;
      el.innerHTML =
        '<span class="slot">' + (idx + 1) + "</span>" +
        '<span class="txt"></span>' +
        (C.cards.showNumbers ? '<span class="real">номер: ' + item.n + "</span>" : "");
      el.querySelector(".txt").textContent = item.text;
      grid.appendChild(el);
    });
  }
  do { shuffle(order); } while (isSorted());
  renderCards();

  grid.addEventListener("dragstart", (e) => {
    const card = e.target.closest(".card"); if (!card) return;
    card.classList.add("dragging");
    e.dataTransfer.setData("text/plain", card.dataset.idx);
    e.dataTransfer.effectAllowed = "move";
  });
  grid.addEventListener("dragend", (e) => {
    const card = e.target.closest(".card"); if (card) card.classList.remove("dragging");
  });
  grid.addEventListener("dragover", (e) => e.preventDefault());
  grid.addEventListener("drop", (e) => {
    e.preventDefault();
    const to = e.target.closest(".card"); if (!to) return;
    const from = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const t = parseInt(to.dataset.idx, 10);
    if (isNaN(from) || from === t) return;
    const moved = order.splice(from, 1)[0];
    order.splice(t, 0, moved);
    picked = null; renderCards(); $("c1status").textContent = "";
  });
  grid.addEventListener("click", (e) => {
    const card = e.target.closest(".card"); if (!card) return;
    const idx = parseInt(card.dataset.idx, 10);
    if (picked === null) { picked = idx; card.classList.add("picked"); return; }
    if (picked === idx) { picked = null; card.classList.remove("picked"); return; }
    [order[picked], order[idx]] = [order[idx], order[picked]];
    picked = null; renderCards(); $("c1status").textContent = "";
  });

  $("shuffleCards").addEventListener("click", () => {
    do { shuffle(order); } while (isSorted());
    picked = null; renderCards(); $("c1status").textContent = "";
  });

  $("checkCards").addEventListener("click", () => {
    const cards = [...grid.children];
    let bad = 0;
    order.forEach((it, i) => {
      const ok = it.n === i + 1;
      cards[i].classList.toggle("good", ok);
      cards[i].classList.toggle("wrong", !ok);
      if (!ok) bad++;
    });
    const st = $("c1status");
    if (bad === 0) {
      st.className = "status ok";
      st.textContent = "Порядок верный. Испытание №1 пройдено.";
      complete("c1", 1, "ch2");
    } else {
      st.className = "status bad";
      st.textContent = "Неверных позиций: " + bad + ". Красные карточки стоят не на своих местах.";
    }
  });

  /* ================= 2. ROULETTE ================= */
  const WHEEL = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5,
    24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  const RED = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const colorOf = (n) => (n === 0 ? "green" : RED.has(n) ? "red" : "black");
  const STEP = (Math.PI * 2) / WHEEL.length;

  (function drawWheel() {
    const cv = $("wheel"), g = cv.getContext("2d");
    const R = cv.width / 2, cx = R, cy = R;
    WHEEL.forEach((n, i) => {
      const a0 = -Math.PI / 2 - STEP / 2 + i * STEP;
      const col = colorOf(n);
      g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R - 6, a0, a0 + STEP); g.closePath();
      g.fillStyle = col === "green" ? "#0a9d3f" : col === "red" ? "#e00034" : "#141414";
      g.fill(); g.strokeStyle = "#ffd200"; g.lineWidth = 1.5; g.stroke();
      g.save();
      g.translate(cx, cy); g.rotate(a0 + STEP / 2); g.fillStyle = "#fff";
      g.font = 'bold 20px "Russo One", Impact, sans-serif'; g.textAlign = "right"; g.textBaseline = "middle";
      g.fillText(String(n), R - 16, 0);
      g.restore();
    });
    g.beginPath(); g.arc(cx, cy, R - 6, 0, Math.PI * 2); g.strokeStyle = "#160024"; g.lineWidth = 10; g.stroke();
  })();

  let tokens = 0, rotation = 0, spinning = false, fallbackMode = false;
  const recordings = [];
  const setTokens = (v) => { tokens = v; $("tokenCount").textContent = v; $("spinBtn").disabled = v < 1 || spinning; };

  function addSong(url, idx) {
    const wrap = document.createElement("div");
    const label = document.createElement("div");
    label.className = "tiny"; label.textContent = "Трек №" + idx + " (оплата)";
    wrap.appendChild(label);
    if (url) { const a = document.createElement("audio"); a.controls = true; a.src = url; wrap.appendChild(a); }
    else { const p = document.createElement("div"); p.className = "tiny"; p.textContent = "спето вживую, без записи"; wrap.appendChild(p); }
    $("songs").appendChild(wrap);
  }

  /* ---- песня играет, пока крутится колесо ---- */
  const spinAudio = new Audio();
  spinAudio.loop = true;
  spinAudio.preload = "auto";
  let fadeTimer = null;

  function pickSong() {
    const real = recordings.filter(Boolean);
    if (!real.length) return null;
    return (C.roulette.songPick === "random")
      ? real[(Math.random() * real.length) | 0]
      : real[real.length - 1];
  }
  function playSpinSong() {
    if (C.roulette.playSongWhileSpinning === false) return;
    const url = pickSong();
    if (!url) return;
    clearInterval(fadeTimer);
    if (spinAudio.src !== url) spinAudio.src = url;
    spinAudio.currentTime = 0;
    spinAudio.volume = 1;
    spinAudio.play().catch(() => {});
  }
  function stopSpinSong() {
    clearInterval(fadeTimer);
    const ms = C.roulette.songFadeOutMs == null ? 700 : C.roulette.songFadeOutMs;
    if (spinAudio.paused) return;
    if (ms <= 0) { spinAudio.pause(); return; }
    const step = 1 / Math.max(1, Math.round(ms / 50));
    fadeTimer = setInterval(() => {
      spinAudio.volume = Math.max(0, spinAudio.volume - step);
      if (spinAudio.volume <= 0.01) {
        clearInterval(fadeTimer);
        spinAudio.pause();
        spinAudio.currentTime = 0;
        spinAudio.volume = 1;
      }
    }, 50);
  }

  const recBtn = $("recBtn"), recFill = $("recFill"), recStatus = $("recStatus");
  let recBusy = false;

  async function recordPayment() {
    if (recBusy) return;
    const secs = C.roulette.recordSeconds;
    recBusy = true; recBtn.disabled = true;
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) throw new Error("no mic api");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      const stopped = new Promise((res) => { rec.onstop = res; });
      rec.start();
      recStatus.textContent = "Идёт запись. Пой.";
      await countdown(secs);
      rec.stop(); stream.getTracks().forEach((t) => t.stop());
      await stopped;
      const url = URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || "audio/webm" }));
      recordings.push(url);
      addSong(url, recordings.length);
      setTokens(tokens + 1);
      recStatus.textContent = "Оплата принята: " + secs + " сек вокала. +1 жетон.";
    } catch (err) {
      fallbackMode = true;
      recStatus.textContent = "Микрофон недоступен. Режим доверия: пой " + secs + " сек, засекаем время.";
      await countdown(secs);
      recordings.push(null);
      addSong(null, recordings.length);
      setTokens(tokens + 1);
      recStatus.textContent = "Поверили на слово. +1 жетон.";
    } finally {
      recBusy = false; recBtn.disabled = false; recFill.style.width = "0%";
      if (fallbackMode) recBtn.innerHTML = "🎤 Петь " + C.roulette.recordSeconds + " сек (режим доверия)";
    }
  }
  function countdown(secs) {
    return new Promise((res) => {
      const t0 = performance.now();
      (function tick(now) {
        const p = Math.min(1, ((now || t0) - t0) / (secs * 1000));
        recFill.style.width = (p * 100).toFixed(1) + "%";
        recBtn.textContent = "🎤 " + Math.ceil(secs * (1 - p)) + "…";
        if (p < 1) requestAnimationFrame(tick);
        else { recBtn.innerHTML = "🎤 Записать " + secs + " сек песни"; res(); }
      })(t0);
    });
  }
  recBtn.addEventListener("click", recordPayment);

  const spinBtn = $("spinBtn"), rotor = $("wheelRotor");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const REDS = WHEEL.map((n, i) => (colorOf(n) === "red" ? i : -1)).filter((i) => i >= 0);
  let spinCount = 0;

  spinBtn.addEventListener("click", () => {
    if (spinning || tokens < 1) return;
    spinning = true; setTokens(tokens - 1);
    $("c2status").className = "status"; $("c2status").textContent = "Колесо крутится…";

    const secs = reduceMotion ? 1.2 : (C.roulette.spinSeconds == null ? 12 : C.roulette.spinSeconds);
    const turns = C.roulette.spinTurns == null ? 14 : C.roulette.spinTurns;
    const rigRed = C.roulette.firstSpinAlwaysRed !== false && spinCount === 0 && REDS.length > 0;
    spinCount++;

    const k = rigRed ? REDS[(Math.random() * REDS.length) | 0] : (Math.random() * WHEEL.length) | 0;
    const num = WHEEL[k], col = colorOf(num);
    const sectorDeg = 360 / WHEEL.length;
    const need = ((360 - k * sectorDeg) % 360 + 360) % 360;
    const cur = ((rotation % 360) + 360) % 360;
    rotation += 360 * turns + ((need - cur) + 360) % 360;
    rotor.style.transitionDuration = secs + "s";
    rotor.style.transform = "rotate(" + rotation + "deg)";
    $("wheelHub").textContent = "🎲";
    playSpinSong();

    setTimeout(() => {
      spinning = false; setTokens(tokens);
      stopSpinSong();
      $("wheelHub").textContent = num;
      const banner = document.createElement("div");
      banner.className = "result-banner " + col;
      const label = col === "red" ? "КРАСНОЕ" : col === "black" ? "ЧЁРНОЕ" : "ЗЕЛЁНОЕ";
      banner.textContent = num + " — " + label;
      const side = $("c2status");
      side.parentNode.insertBefore(banner, side);
      if (C.roulette.winColors.indexOf(col) !== -1) {
        side.className = "status ok";
        side.textContent = "Испытание №2 пройдено. Казино в шоке.";
        spinBtn.disabled = true; recBtn.disabled = true;
        complete("c2", 2, "ch3");
      } else {
        side.className = "status bad";
        side.textContent = "Красное. Жетон сгорел. Нужна новая песня.";
      }
    }, secs * 1000 + 100);
  });

  /* ================= 3. PHOTO ================= */
  const crop = $("photoCrop");
  let zoom = C.photo.zoom, hintsUsed = 0, revealed = false;
  function applyCrop() {
    crop.style.backgroundImage = 'url("' + C.photo.image + '")';
    crop.style.backgroundSize = (zoom * 100).toFixed(0) + "%";
    crop.style.backgroundPosition = C.photo.cropX + "% " + C.photo.cropY + "%";
  }
  applyCrop();

  const norm = (s) => s.toLowerCase().replace(/ё/g, "е").replace(/[^a-zа-я0-9 ]/gi, " ").replace(/\s+/g, " ").trim();

  $("hintBtn").addEventListener("click", () => {
    if (revealed) return;
    const hints = C.photo.hints || [];
    if (hintsUsed >= hints.length) { $("c3status").className = "status bad"; $("c3status").textContent = "Подсказки закончились. Дальше только интуиция."; return; }
    const li = document.createElement("li");
    li.textContent = hints[hintsUsed];
    $("hintList").appendChild(li);
    hintsUsed++;
    zoom = Math.max(1.4, zoom * 0.72); applyCrop();
    $("c3status").className = "status"; $("c3status").textContent = "Подсказка взята, кадр стал шире (−репутация).";
  });

  function revealPhoto() {
    revealed = true;
    crop.style.backgroundSize = "cover";
    crop.style.backgroundPosition = "center";
    $("photoFrame").classList.add("revealed");
    const cap = document.createElement("p");
    cap.className = "photo-caption"; cap.textContent = C.photo.successCaption || "";
    $("photoFrame").after(cap);
  }
  function tryGuess() {
    if (revealed) return;
    const val = norm($("guessInput").value);
    const st = $("c3status");
    if (!val) { st.className = "status bad"; st.textContent = "Пустой ответ не считается."; return; }
    const hit = C.photo.answers.some((a) => {
      const t = norm(a);
      return val.indexOf(t) !== -1 || (val.length >= 4 && t.indexOf(val) !== -1);
    });
    if (hit) {
      st.className = "status ok";
      st.textContent = "Верно. Испытание №3 пройдено" + (hintsUsed ? " (с " + hintsUsed + " подсказк" + (hintsUsed === 1 ? "ой" : "ами") + ")" : " без подсказок") + ".";
      revealPhoto(); complete("c3", 3, "final");
    } else {
      st.className = "status bad"; st.textContent = "Не то. Попробуй ещё или возьми подсказку.";
    }
  }
  $("guessBtn").addEventListener("click", tryGuess);
  $("guessInput").addEventListener("keydown", (e) => { if (e.key === "Enter") tryGuess(); });

  /* ================= FINAL + MODAL ================= */
  const back = $("modalBack"), fileInput = $("fileInput"), thumbs = $("thumbs");
  let photos = [];
  const need = C.transcription.requiredPhotos;

  function openModal() { back.hidden = false; document.body.style.overflow = "hidden"; }
  function closeModal() { back.hidden = true; document.body.style.overflow = ""; }
  $("buyBtn").addEventListener("click", openModal);
  $("modalClose").addEventListener("click", closeModal);
  back.addEventListener("click", (e) => { if (e.target === back) closeModal(); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && !back.hidden) closeModal(); });

  function renderThumbs() {
    thumbs.innerHTML = "";
    photos.forEach((p) => { const img = document.createElement("img"); img.src = p; img.alt = ""; thumbs.appendChild(img); });
    $("photoCounter").textContent = photos.length + " / " + need;
    $("payBtn").disabled = photos.length < need;
    $("payBtn").textContent = photos.length < need
      ? "Не хватает фото: " + (need - photos.length)
      : "Оплатить и получить транскрипцию";
  }
  function addFiles(list) {
    [...list].filter((f) => f.type.startsWith("image/")).forEach((f) => photos.push(URL.createObjectURL(f)));
    renderThumbs();
  }
  fileInput.addEventListener("change", (e) => addFiles(e.target.files));
  const drop = $("drop");
  ["dragenter", "dragover"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add("over"); }));
  ["dragleave", "drop"].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
  drop.addEventListener("drop", (e) => { if (e.dataTransfer.files) addFiles(e.dataTransfer.files); });
  $("clearPhotos").addEventListener("click", () => { photos = []; fileInput.value = ""; renderThumbs(); $("transcript").hidden = true; });
  renderThumbs();

  $("payBtn").addEventListener("click", () => {
    if (photos.length < need) return;
    $("transcriptText").textContent = C.transcription.text;
    const box = $("songs2"); box.innerHTML = "";
    if (recordings.filter(Boolean).length === 0) {
      const p = document.createElement("div");
      p.className = "tiny"; p.style.color = "#fff";
      p.textContent = "Аудио не сохранилось (режим доверия), но мы всё слышали.";
      box.appendChild(p);
    } else {
      recordings.filter(Boolean).forEach((url, i) => {
        const l = document.createElement("div"); l.className = "tiny"; l.style.color = "#fff";
        l.textContent = "Оригинал, трек №" + (i + 1);
        const a = document.createElement("audio"); a.controls = true; a.src = url;
        box.appendChild(l); box.appendChild(a);
      });
    }
    $("transcript").hidden = false;
    $("payBtn").disabled = true; $("payBtn").textContent = "Оплачено";
    boom(260);
    $("transcript").scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  $("replaySongs").addEventListener("click", () => {
    const urls = recordings.filter(Boolean);
    if (!urls.length) { alert("Записей нет — оплата шла в режиме доверия."); return; }
    let i = 0;
    const a = new Audio(urls[0]);
    a.onended = () => { i++; if (i < urls.length) { a.src = urls[i]; a.play(); } };
    a.play();
  });
})();
