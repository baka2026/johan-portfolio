(function () {
  "use strict";
  var S = window.SITE, $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var art = {
    builder: '<div class="ui"><div class="h sel">Settings</div><div class="cb"><b class="on"></b>Enable overlay</div><div class="sl"></div><div class="bt">Run script</div><div class="mono" style="color:#8b877d">Component · Heading · 3 props</div></div>',
    overlay: '<div class="ui"><div class="mono" style="color:#8b877d">Overlay · injected</div><div class="cb"><b class="on"></b>Auto-refresh</div><div class="cb"><b></b>Highlight changes</div><div class="lg"><i>›</i> page loaded<br><i>›</i> overlay mounted<br><i>›</i> waiting…</div></div>'
  };
  var home = !!$("#featured");

  /* nav */
  var links = [["Home", "home"], ["About", "about"], ["Work", "work"], ["Experiments", "experiments"], ["Cybersecurity", "cybersecurity"], ["Contact", "contact"]];
  var p = home ? "" : "/";
  $("#nav-mount").outerHTML = '<nav id="nav" aria-label="Main"><a class="logo" href="' + p + '#home" aria-label="Johan Arpin, home">J<i>.</i>A</a><button id="menu" aria-expanded="false" aria-controls="nl">Menu</button><ul id="nl">' +
    links.map(function (l) { return '<li><a href="' + p + "#" + l[1] + '" data-s="' + l[1] + '">' + l[0] + "</a></li>"; }).join("") + "</ul></nav>";
  var nl = $("#nl"), mb = $("#menu");
  mb.onclick = function () { var o = nl.classList.toggle("open"); mb.setAttribute("aria-expanded", o); };
  nl.onclick = function (e) { if (e.target.tagName === "A") { nl.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { nl.classList.remove("open"); mb.setAttribute("aria-expanded", "false"); } });

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function reveal() {
    var els = document.querySelectorAll(".rv:not(.in)");
    if (reduce || !("IntersectionObserver" in window)) return els.forEach(function (e) { e.classList.add("in"); });
    var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }); }, { threshold: .12 });
    els.forEach(function (e) { io.observe(e); });
  }

  if (home) {
    /* projects */
    var feat = S.projects.filter(function (x) { return x.featured; });
    $("#featured").innerHTML = feat.map(function (x, i) {
      return '<article class="feat rv"><a class="art" href="/project?p=' + x.slug + '" aria-label="' + esc(x.name) + ' case study">' + art[x.art] + '</a><div class="txt"><p class="mono">0' + (i + 1) + ' — ' + esc(x.category) + ' · <span class="st">' + esc(x.status) + '</span></p><h3>' + esc(x.name) + '</h3><p>' + esc(x.blurb) + '</p><div class="tags mono">' + x.tech.map(esc).join(" / ") + '</div><p><a class="lnk" href="/project?p=' + x.slug + '">Read case study →</a></p></div></article>';
    }).join("");
    $("#index").innerHTML = S.projects.filter(function (x) { return !x.featured && !x.cyber; }).map(function (x, i) {
      return '<a class="rv" href="/project?p=' + x.slug + '"><span class="mono">0' + (i + 1) + '</span><h3>' + esc(x.name) + '</h3><p>' + esc(x.blurb) + '</p><span class="mono">' + esc(x.status) + "</span></a>";
    }).join("");
    $("#tech").innerHTML = S.tech.map(function (t) { return '<div class="rv"><span class="mono">' + esc(t[0]) + "</span><p>" + esc(t[1]) + "</p></div>"; }).join("");
    if (S.writeups.length) $("#wu").textContent = S.writeups.length + " published";
    var L = ['<li><span>GitHub</span><a href="' + S.github + '" rel="me noopener">github.com/baka2026 ↗</a></li>'];
    L.push(S.email ? '<li><span>Email</span><a href="mailto:' + esc(S.email) + '">' + esc(S.email) + "</a></li>" : '<li><span>Email</span><span class="mono">Not published yet</span></li>');
    L.push(S.linkedin ? '<li><span>LinkedIn</span><a href="' + esc(S.linkedin) + '" rel="me noopener">Profile ↗</a></li>' : '<li><span>LinkedIn</span><span class="mono">Not published yet</span></li>');
    $("#links").innerHTML = L.join("");

    /* hero crosshair */
    var m = $("#mark"), cx = $("#cx");
    if (!reduce && matchMedia("(hover:hover)").matches) {
      m.addEventListener("pointermove", function (e) {
        var r = m.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        cx.style.display = ""; $("#ch").setAttribute("y1", y * 460); $("#ch").setAttribute("y2", y * 460); $("#cv").setAttribute("x1", x * 400); $("#cv").setAttribute("x2", x * 400);
        $("#ro").textContent = "X " + x.toFixed(2) + "  Y " + y.toFixed(2);
      });
      m.addEventListener("pointerleave", function () { cx.style.display = "none"; });
    }
    /* active nav + progress */
    var secs = links.map(function (l) { return document.getElementById(l[1]); });
    var bar = $("#bar");
    function onScroll() {
      var h = document.documentElement, y = h.scrollTop + 120, cur = "home";
      bar.style.transform = "scaleX(" + (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) + ")";
      secs.forEach(function (s) { if (s && s.offsetTop <= y) cur = s.id; });
      document.querySelectorAll("#nl a").forEach(function (a) { a.toggleAttribute("aria-current", a.dataset.s === cur); });
    }
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
  } else {
    /* case study */
    var slug = new URLSearchParams(location.search).get("p"), x = S.projects.filter(function (q) { return q.slug === slug; })[0], root = $("#cs");
    if (!x) { root.innerHTML = '<p>That project doesn’t exist. <a class="lnk" href="/#work">Back to work</a></p>'; }
    else {
      document.title = x.name + " — Johan Arpin"; $("link[rel=canonical]").href = S.url + "/project?p=" + x.slug; $("meta[name=description]").content = x.blurb;
      var row = function (k, v) { return v ? '<div class="grid"><h3 class="mono">' + k + "</h3><div>" + v + "</div></div>" : ""; };
      var btns = (x.github ? '<a class="btn" href="' + esc(x.github) + '" rel="noopener">GitHub ↗</a> ' : "") + (x.live ? '<a class="btn" href="' + esc(x.live) + '" rel="noopener">Live preview ↗</a>' : "");
      root.innerHTML = '<p class="mono">' + esc(x.category) + ' · <span class="st">' + esc(x.status) + "</span></p><h1>" + esc(x.name) + "</h1><p style=\"font:400 clamp(24px,3vw,40px)/1.2 var(--serif);max-width:28em\">" + esc(x.blurb) + '</p><div class="art" role="img" aria-label="Project artwork">' + (art[x.art] || '<span class="num">' + esc(x.name.charAt(0)) + "</span>") + "</div>" +
        row("Idea", "<p>" + esc(x.idea) + "</p>") + row("Objectives", "<ul>" + x.objectives.map(function (o) { return "<li>" + esc(o) + "</li>"; }).join("") + "</ul>") + row("Implementation", "<p>" + esc(x.implementation) + "</p>") + row("Technologies", x.tech.map(esc).join(" / ")) + row("Links", btns || '<span class="mono">No public repository or demo yet</span>') +
        '<p style="margin-top:40px"><a class="lnk" href="/#work">← All work</a></p>';
    }
  }
  reveal();

  /* J.A.R.V.I.S. */
  var hist = []; try { hist = JSON.parse(sessionStorage.getItem("jv") || "[]"); } catch (e) {}
  var d = document.createElement("div");
  d.innerHTML = '<button id="jv-btn" aria-expanded="false" aria-controls="jv"><i></i>J.A.R.V.I.S.</button><div id="jv" role="dialog" aria-label="J.A.R.V.I.S. assistant"><header><b>J.A.R.V.I.S.</b><button id="jv-x" aria-label="Close">Close</button></header><div id="jv-log" role="log" aria-live="polite"></div><div class="sug" id="jv-s"></div><form id="jv-f"><input id="jv-i" maxlength="500" autocomplete="off" placeholder="Ask about Johan…" aria-label="Your question"><button>Send</button></form></div>';
  document.body.appendChild(d);
  var box = $("#jv"), log = $("#jv-log"), inp = $("#jv-i"), busy = false;
  function add(t, c) { var e = document.createElement("div"); e.className = "msg " + (c || ""); e.textContent = t; log.appendChild(e); log.scrollTop = log.scrollHeight; return e; }
  function save() { try { sessionStorage.setItem("jv", JSON.stringify(hist.slice(-12))); } catch (e) {} }
  function open(o) { box.classList.toggle("open", o); $("#jv-btn").setAttribute("aria-expanded", o); if (o) inp.focus(); }
  $("#jv-btn").onclick = function () { open(!box.classList.contains("open")); };
  $("#jv-x").onclick = function () { open(false); $("#jv-btn").focus(); };
  box.addEventListener("keydown", function (e) { if (e.key === "Escape") open(false); });
  if (hist.length) hist.forEach(function (h) { add(h.content, h.role === "user" ? "u" : ""); });
  else add("Hello. I’m J.A.R.V.I.S., Johan’s assistant. Ask me about his projects, interests or how to reach him.");
  ["Who is Johan?", "What projects has he built?", "What is he learning in cybersecurity?"].forEach(function (q) { var b = document.createElement("button"); b.type = "button"; b.textContent = q; b.onclick = function () { send(q); }; $("#jv-s").appendChild(b); });
  $("#jv-f").onsubmit = function (e) { e.preventDefault(); send(inp.value); };
  var msgs = { unconfigured: "The assistant isn’t switched on yet. Everything else on this site works as normal.", rate_limited: "Too many questions in a short time. Please wait a minute and try again.", upstream: "The AI service didn’t respond. Please try again shortly." };
  function send(t) {
    t = (t || "").trim(); if (!t || busy) return; busy = true; inp.value = ""; $("#jv-s").style.display = "none";
    hist.push({ role: "user", content: t }); add(t, "u"); save();
    var w = add("", ""); w.innerHTML = '<span class="dots"><span></span><span></span><span></span></span>';
    fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: hist.slice(-8) }) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (o) {
        if (o.ok && o.j.reply) { w.textContent = o.j.reply; hist.push({ role: "assistant", content: o.j.reply }); save(); }
        else { w.className = "msg e"; w.textContent = msgs[o.j.error] || "Something went wrong. Please try again."; hist.pop(); save(); }
      })
      .catch(function () { w.className = "msg e"; w.textContent = "Couldn’t reach the server. Check your connection and try again."; hist.pop(); save(); })
      .then(function () { busy = false; log.scrollTop = log.scrollHeight; });
  }
})();
