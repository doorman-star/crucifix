/* ==========================================================================
   maison's corner of the internet — script.js
   --------------------------------------------------------------------------
   three tiny modules, no dependencies, no build step:
     1 · ascii night sky  (twinkling stars, a satellite, a rare comet)
     2 · visitor counter  (fake-retro, stored in localStorage)
     3 · typewriter       (types the hero line once, then stops)
   everything here respects prefers-reduced-motion.
   ========================================================================== */

(function () {
  "use strict";

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;


  /* ------------------------------------------------------------------------
     1 · ascii night sky
     ------------------------------------------------------------------------
     the sky is a grid of characters re-rendered ~8 times per second.
     stars are hand-placed (composed, not random) and fade between
     " " -> "." -> "+" -> "*". the moon never moves.                     */

  function initNightSky() {
    var pre = document.getElementById("ascii-sky");
    if (!pre) return;

    var W = 38;              /* interior width, in characters  */
    var H = 12;              /* interior height, in characters */

    var MOON_X = 28;
    var MOON_Y = 1;
    var MOON = [
      '  .-""-.',
      " /      \\",
      " \\      /",
      "  '-..-'"
    ];

    /* [x, y] — placed by hand so the sky feels intentional */
    var STARS = [
      [3, 1], [8, 3], [14, 2], [20, 4], [26, 1], [31, 3],
      [5, 6], [11, 8], [17, 6], [23, 9], [29, 7], [35, 8],
      [36, 4], [2, 9], [19, 11], [33, 11], [7, 11], [36, 10]
    ];

    function repeat(s, n) {
      var out = "";
      for (var i = 0; i < n; i++) out += s;
      return out;
    }

    function render(t) {
      /* start with an empty grid */
      var grid = [];
      var x, y, i;
      for (y = 0; y < H; y++) {
        var row = [];
        for (x = 0; x < W; x++) row.push(" ");
        grid.push(row);
      }

      /* twinkling stars — each fades in and out on its own rhythm */
      for (i = 0; i < STARS.length; i++) {
        var sx = STARS[i][0];
        var sy = STARS[i][1];
        var v = (Math.sin(t * (0.6 + (i % 3) * 0.35) + i * 0.7) + 1) / 2;
        grid[sy][sx] = v < 0.2 ? " " : v < 0.45 ? "." : v < 0.7 ? "+" : "*";
      }

      /* the moon, stamped over whatever is behind it */
      for (var r = 0; r < MOON.length; r++) {
        for (var c = 0; c < MOON[r].length; c++) {
          var ch = MOON[r].charAt(c);
          if (ch !== " ") grid[MOON_Y + r][MOON_X + c] = ch;
        }
      }

      /* a comet falls out of the top-left every so often */
      var comet = t % 140;
      if (comet < 10) {
        var hx = 4 + comet * 3;
        var hy = 1 + Math.floor(comet / 3);
        if (hx < W && hy < H)                 grid[hy][hx]     = "*";
        if (hx - 2 >= 0 && hx - 2 < W && hy < H) grid[hy][hx - 2] = "-";
        if (hx - 4 >= 0 && hx - 4 < W && hy < H) grid[hy][hx - 4] = ".";
      }

      /* a satellite drifts right-to-left along the top row */
      var sat = t % 90;
      if (sat < W + 2) {
        var px = W - sat;
        if (px >= 1 && px <= W - 2) {
          grid[0][px - 1] = "-";
          grid[0][px]     = "o";
          grid[0][px + 1] = "-";
        }
      }

      /* frame it and print */
      var out = "+" + repeat("-", W) + "+\n";
      for (y = 0; y < H; y++) out += "|" + grid[y].join("") + "|\n";
      out += "+" + repeat("-", W) + "+";
      pre.textContent = out;
    }

    if (reduceMotion) {
      render(30);           /* a single, composed still frame */
    } else {
      var t = 0;
      render(t);
      setInterval(function () {
        t++;
        render(t);
      }, 125);              /* ~8fps: calm, not flashy */
    }
  }


  /* ------------------------------------------------------------------------
     2 · visitor counter
     ------------------------------------------------------------------------
     counts visits in localStorage, zero-padded like an old hit counter.
     entirely fake, entirely sincere.                                     */

  function initHitCounter() {
    var el = document.getElementById("hit-counter");
    if (!el) return;

    var n = 1;
    try {
      n = parseInt(localStorage.getItem("maison_corner_hits") || "0", 10) + 1;
      localStorage.setItem("maison_corner_hits", String(n));
    } catch (err) {
      /* localStorage unavailable (privacy mode etc.) — just show 1 */
    }

    var padded = String(n);
    while (padded.length < 6) padded = "0" + padded;
    el.textContent = padded;
  }


  /* ------------------------------------------------------------------------
     3 · typewriter
     ------------------------------------------------------------------------
     the hero line already exists in the html (so the page works without
     javascript); we simply erase it and type it back out, once.          */

  function initTypewriter() {
    var el = document.getElementById("typewriter");
    if (!el) return;

    var text = el.textContent;
    if (reduceMotion) return;   /* leave the text as-is */

    el.textContent = "";
    var i = 0;
    (function tick() {
      i++;
      el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(tick, 38);
    })();
  }


  /* ------------------------------------------------------------------------ */

  initNightSky();
  initHitCounter();
  initTypewriter();

})();
