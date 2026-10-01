/* JourneysByRohit: site behaviour
   Deliberately small: navigation, filters, justified galleries, lightbox, form.
   No scroll-linked animation. Images simply fade in once loaded. */
(function () {
  "use strict";
  var S = window.SITE, M = window.MEDIA, P = window.PROJECTS, POSTS = window.POSTS || [];
  document.documentElement.classList.add("js");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var page = document.body.getAttribute("data-page") || "home";
  var wa = function (msg) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(msg || "Hi Rohit, I found your portfolio and would love to talk about our wedding."); };
  var tel = S.phone.replace(/\s/g, "");
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  var links = [["Work", "work.html", "work"], ["Gallery", "gallery.html", "gallery"], ["Journal", "blog.html", "blog"], ["About", "about.html", "about"], ["Contact", "contact.html", "contact"]];

  /* ---------- shared chrome ---------- */
  function chrome() {
    var cur = function (k) { return k === page || (page === "project" && k === "work") || (page === "post" && k === "blog"); };
    document.body.insertAdjacentHTML("afterbegin",
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="header" id="header"><a class="logo" href="index.html" aria-label="' + S.brand + ' home">' + S.brand + '</a>' +
      '<nav class="nav" aria-label="Primary">' + links.map(function (l) { return '<a href="' + l[1] + '"' + (cur(l[2]) ? ' aria-current="page"' : "") + ">" + l[0] + "</a>"; }).join("") + "</nav>" +
      '<button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><i></i><i></i><i></i></button></header>' +
      '<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Site menu"><nav class="menu-links" aria-label="Mobile">' +
      links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + "</a>"; }).join("") + '</nav><div class="menu-sub"><a href="https://instagram.com/' + S.instagram + '" target="_blank" rel="noopener">Instagram</a><a href="' + wa() + '" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:' + S.email + '">Email</a></div></div>');
    var main = $("main"); if (main && !main.id) main.id = "main";
    var f = $("#footer");
    if (f) f.outerHTML = '<footer class="footer"><div class="wrap"><div class="foot-grid">' +
      '<div><a class="logo" href="index.html">' + S.brand + '</a><p>' + S.tagline + '</p></div>' +
      '<div><h4>Explore</h4>' + links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + "</a>"; }).join("") + "</div>" +
      '<div><h4>Follow</h4><a href="https://instagram.com/' + S.instagram + '" target="_blank" rel="noopener">Instagram</a><a href="' + wa() + '" target="_blank" rel="noopener">WhatsApp</a>' + (S.vimeo ? '<a href="' + S.vimeo + '" target="_blank" rel="noopener">Vimeo</a>' : "") + "</div>" +
      '<div><h4>Contact</h4><a href="mailto:' + S.email + '">' + S.email + '</a><a href="tel:' + tel + '">' + S.phone + "</a><p>" + S.base + "</p></div></div>" +
      '<div class="foot-bot"><span>© ' + new Date().getFullYear() + " " + S.brand + '. All rights reserved.</span><a href="#top">Back to top</a></div></div></footer>';
  }

  function header() {
    var h = $("#header"), hero = $(".hero"), b = $("#burger"), m = $("#menu");
    function state() {
      var y = window.scrollY, past = hero ? y > hero.offsetHeight - 80 : true;
      h.classList.toggle("on-hero", !!hero && !past && !m.classList.contains("open"));
      h.classList.toggle("solid", past && !m.classList.contains("open"));
    }
    var tick = 0; window.addEventListener("scroll", function () { if (!tick) tick = requestAnimationFrame(function () { tick = 0; state(); }); }, { passive: true });
    function set(open) {
      m.classList.toggle("open", open); h.classList.toggle("menu-open", open); b.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : ""; state();
    }
    b.addEventListener("click", function () { set(!m.classList.contains("open")); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("open")) set(false); });
    matchMedia("(min-width:900px)").addEventListener("change", function (e) { if (e.matches) set(false); });
    state();
  }

  /* ---------- images ---------- */
  function srcsetOf(src) {
    var m = /^media\/img\/(p\d+\.jpg)$/.exec(src || ""); if (!m) return "";
    return ' srcset="media/img/w600/' + m[1] + " 600w, media/img/w1000/" + m[1] + " 1000w, " + src + ' 1600w"';
  }
  function imgTag(src, alt, sizes, eager) {
    var ss = srcsetOf(src);
    return '<img src="' + esc(src) + '"' + ss + (ss ? ' sizes="' + (sizes || "(min-width:1000px) 34vw, (min-width:640px) 50vw, 100vw") + '"' : "") + ' alt="' + esc(alt) + '" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">';
  }
  function ph(label) { return '<div class="ph"><span>' + esc(label) + "</span></div>"; }
  function knownRatio(src) { var m = /p(\d+)\.jpg/.exec(src || ""), d = m && window.DIMS && window.DIMS[m[1]]; return d ? d[0] / d[1] : null; }
  function box(cls, src, alt, fallbackAr, sizes, eager) {
    var r = knownRatio(src) || fallbackAr;
    return '<div class="' + cls + '" data-ar style="--ar:' + r.toFixed(4) + '">' + (src ? imgTag(src, alt, sizes, eager) : ph(alt)) + "</div>";
  }
  var jt = 0;
  function queueJustify() { cancelAnimationFrame(jt); jt = requestAnimationFrame(justify); }
  function onImg(img) {
    img.classList.add("ld");
    if (!img.naturalWidth) return;
    var r = (img.naturalWidth / img.naturalHeight).toFixed(4), b = img.closest("[data-ar]");
    if (b) b.style.setProperty("--ar", r);
    var j = img.closest(".jg"); if (j) { j.setAttribute("data-r", r); queueJustify(); }
  }
  document.addEventListener("load", function (e) { if (e.target && e.target.tagName === "IMG") onImg(e.target); }, true);

  /* justified rows: every picture keeps its own proportions */
  function justify() {
    $$(".jgal").forEach(function (c) {
      var W = c.clientWidth; if (!W) return;
      var vw = window.innerWidth, gap = vw < 700 ? 4 : 6, H = vw < 700 ? 210 : vw < 1100 ? 270 : 330, row = [], sum = 0;
      function flush(last) {
        var avail = W - gap * (row.length - 1), h = (last && sum * H + gap * (row.length - 1) < W * 0.62) ? H : avail / sum;
        row.forEach(function (it) { var r = +it.getAttribute("data-r"); it.style.width = Math.floor(r * h) + "px"; it.style.height = Math.round(h) + "px"; });
        row = []; sum = 0;
      }
      $$(".jg:not(.is-hidden)", c).forEach(function (it) { var r = +it.getAttribute("data-r"); row.push(it); sum += r; if (sum * H + gap * (row.length - 1) >= W) flush(false); });
      if (row.length) flush(true);
    });
  }

  /* ---------- tabs filter ---------- */
  function tabs(sel, cats, itemSel, scope, emptySel) {
    var el = $(sel); if (!el) return;
    var items = $$(itemSel, scope);
    el.innerHTML = cats.map(function (c, i) { return '<button class="tab" type="button" aria-pressed="' + (i === 0) + '" data-f="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest(".tab"); if (!b) return;
      $$(".tab", el).forEach(function (t) { t.setAttribute("aria-pressed", t === b); });
      var f = b.getAttribute("data-f"), n = 0;
      items.forEach(function (it) { var show = f === cats[0] || it.getAttribute("data-cat") === f; it.classList.toggle("is-hidden", !show); if (show) n++; });
      var em = emptySel && $(emptySel); if (em) em.classList.toggle("show", n === 0);
      justify();
    });
  }

  /* ---------- builders ---------- */
  function card(p, i) {
    return '<a class="card" href="project.html?p=' + p.slug + '" data-cat="' + esc(p.cat) + '">' + box("im", p.cover, p.title, 0.8, "(min-width:1000px) 31vw, (min-width:640px) 48vw, 100vw") +
      '<div class="cap"><b>' + esc(p.title) + "</b><span>" + esc(p.location) + " · " + esc(p.year) + "</span></div></a>";
  }
  function fmtDate(d) { return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  function postCard(p) {
    return '<a class="post" href="post.html?p=' + p.slug + '" data-cat="' + esc(p.cat) + '">' + box("im", p.cover, p.title, 1.5) +
      '<div class="meta">' + esc(p.cat) + " · " + fmtDate(p.date) + "</div><h3>" + esc(p.title) + "</h3><p>" + esc(p.excerpt) + "</p></a>";
  }
  function galleryItems() {
    var seen = {}, out = [];
    P.forEach(function (p) { (p.gallery || []).forEach(function (src) { if (seen[src]) return; seen[src] = 1; out.push({ src: src, title: p.title, cat: p.cat, loc: p.location, slug: p.slug, r: knownRatio(src) || 0.8 }); }); });
    return out;
  }
  function jItem(g, i) {
    return '<button class="jg" type="button" data-r="' + g.r.toFixed(4) + '" data-cat="' + esc(g.cat) + '" data-i="' + i + '" aria-label="Open photograph: ' + esc(g.title) + '">' + imgTag(g.src, g.title + " — " + g.loc, "(min-width:1100px) 25vw, 50vw") + "</button>";
  }
  function bindGallery(grid, all) {
    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".jg"); if (!b) return;
      var vis = $$(".jg:not(.is-hidden)", grid), items = vis.map(function (el) { var g = all[+el.getAttribute("data-i")]; return { src: g.src, ratio: g.r, label: g.title + " · " + g.loc, href: "project.html?p=" + g.slug }; });
      openLB(items, vis.indexOf(b), b);
    });
  }

  /* ---------- pages ---------- */
  function home() {
    var st = $("#stories"); if (st) st.innerHTML = P.slice(0, 6).map(card).join("");
    var all = galleryItems(), hg = $("#homeGallery");
    if (hg) { var pick = []; for (var k = 0; k < all.length && pick.length < 12; k += 2) pick.push(all[k]); hg.innerHTML = pick.map(function (g) { return jItem(g, all.indexOf(g)); }).join(""); bindGallery(hg, all); }
    var jr = $("#journal"); if (jr) jr.innerHTML = POSTS.slice(0, 3).map(postCard).join("");
    $$("[data-portrait]").forEach(function (el) { el.innerHTML = M.portrait ? imgTag(M.portrait, "Portrait of Rohit", "(min-width:860px) 40vw, 90vw") : ph("Portrait"); var b = el.closest("[data-ar]"); if (b) b.style.setProperty("--ar", (knownRatio(M.portrait) || 0.8).toFixed(4)); });
    var rl = $("#reel");
    if (rl) {
      rl.innerHTML = (M.showreel ? '<video src="' + esc(M.showreel) + '" muted loop playsinline preload="metadata" aria-hidden="true"></video>' : ph("Showreel")) + '<span class="play" aria-hidden="true">' + PLAY + "</span>";
      var rv = $("video", rl); if (rv) new IntersectionObserver(function (es) { es[es.length - 1].isIntersecting ? rv.play().catch(function () {}) : rv.pause(); }).observe(rv);
      rl.addEventListener("click", function () { openLB([{ embed: M.showreel || "", label: "Showreel" }], 0, rl); });
      rl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); rl.click(); } });
    }
    heroVideo();
  }
  function heroVideo() {
    var hero = $(".hero"); if (!hero) return;
    var src = innerWidth < 720 && M.heroVideoMobile ? M.heroVideoMobile : M.heroVideo;
    var poster = innerWidth < 720 && M.heroPosterMobile ? M.heroPosterMobile : M.heroPoster;
    if (!src) { if (poster) hero.insertAdjacentHTML("afterbegin", '<img src="' + esc(poster) + '" alt="" fetchpriority="high">'); return; }
    var v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = "auto"; v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
    if (poster) v.poster = poster; v.src = src; hero.insertBefore(v, hero.firstChild);
    var inView = true, kick = function () { if (inView && v.paused && !document.hidden) v.play().catch(function () {}); };
    new IntersectionObserver(function (es) { inView = es[es.length - 1].isIntersecting; inView ? kick() : v.pause(); }).observe(v);
    v.addEventListener("canplay", kick); document.addEventListener("visibilitychange", kick); window.addEventListener("pageshow", kick);
    document.addEventListener("touchstart", kick, { once: true, passive: true }); kick();
  }
  function work() {
    var g = $("#workGrid"); if (!g) return;
    g.innerHTML = P.map(card).join("");
    tabs("#workTabs", window.CATEGORIES, ".card", g, "#workEmpty");
  }
  function gallery() {
    var g = $("#galGrid"); if (!g) return;
    var all = galleryItems(); g.innerHTML = all.map(jItem).join(""); bindGallery(g, all);
    tabs("#galTabs", window.CATEGORIES, ".jg", g, "#galEmpty");
  }
  function blog() {
    var g = $("#postGrid"); if (!g) return;
    var sorted = POSTS.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    g.innerHTML = sorted.map(postCard).join("");
    tabs("#postTabs", window.POST_CATS, ".post", g, "#postEmpty");
  }
  function post() {
    var host = $("#article"); if (!host) return;
    var slug = new URLSearchParams(location.search).get("p");
    var idx = Math.max(0, POSTS.findIndex(function (p) { return p.slug === slug; })), p = POSTS[idx];
    document.title = p.title + " — " + S.brand;
    var body = p.body.map(function (b) {
      if (b[0] === "h") return "<h2>" + esc(b[1]) + "</h2>";
      if (b[0] === "q") return "<blockquote>" + esc(b[1]) + "</blockquote>";
      if (b[0] === "img") return "<figure>" + box("im", b[1], b[2], 1.5) + "<figcaption>" + esc(b[2]) + "</figcaption></figure>";
      return "<p>" + esc(b[1]) + "</p>";
    }).join("");
    var rel = POSTS.filter(function (x) { return x.slug !== p.slug; }).sort(function (a, b) { return (b.cat === p.cat) - (a.cat === p.cat); }).slice(0, 3);
    host.innerHTML = '<header class="page-head wrap"><a class="label" href="blog.html">Journal</a><h1 class="title">' + esc(p.title) + '</h1><p class="label">' + esc(p.cat) + " · " + fmtDate(p.date) + " · " + p.read + ' min read</p></header>' +
      '<div class="wrap">' + box("pj-cover", p.cover, p.title, 1.6, "100vw", true) + "</div>" +
      '<article class="article">' + body + '<div class="share"><span class="label">Share</span><a class="link" href="https://wa.me/?text=' + encodeURIComponent(p.title + " " + location.href) + '" target="_blank" rel="noopener">WhatsApp</a></div></article>' +
      '<section class="wrap sec"><div class="sec-head"><h2 class="title">Keep reading</h2></div><div class="cards">' + rel.map(postCard).join("") + "</div></section>";
  }
  function project() {
    var host = $("#project"); if (!host) return;
    var slug = new URLSearchParams(location.search).get("p");
    var idx = Math.max(0, P.findIndex(function (p) { return p.slug === slug; })), p = P[idx], next = P[(idx + 1) % P.length];
    document.title = p.title + " — " + S.brand;
    var ratios = [0.8, 1.5, 1, 0.667, 1.5, 0.8], srcs = p.gallery && p.gallery.length ? p.gallery : [];
    var gal = srcs.map(function (src, i) {
      return '<button class="jg" type="button" data-r="' + (knownRatio(src) || ratios[i % ratios.length]).toFixed(4) + '" data-i="' + i + '" aria-label="Open photograph ' + (i + 1) + '">' + imgTag(src, p.title + " — photograph " + (i + 1), "(min-width:1100px) 25vw, 50vw") + "</button>";
    }).join("");
    var films = (p.films || []).map(function (f, i) {
      var vid = f.embed && /\.(mp4|webm)(\?|$)/i.test(f.embed);
      return '<button class="film" type="button" data-film="' + i + '" aria-label="Play ' + esc(f.title) + '">' + (f.poster ? imgTag(f.poster, f.title, "50vw") : vid ? '<video src="' + esc(f.embed) + '#t=2" muted playsinline preload="metadata" aria-hidden="true"></video>' : ph(f.title)) + '<span class="play" aria-hidden="true">' + PLAY + '</span><span class="cap">' + esc(f.title) + "</span></button>";
    }).join("");
    host.innerHTML = '<div class="wrap" style="padding-top:calc(var(--nav-h) + 16px)">' + box("pj-cover", p.cover, p.title, 1.6, "100vw", true) + "</div>" +
      '<div class="wrap"><header class="pj-head"><p class="label">' + esc(p.cat) + '</p><h1 class="title">' + esc(p.title) + '</h1><div class="pj-credits"><span>' + esc(p.location) + " · " + esc(p.year) + '</span><span><b>Photography</b> ' + esc(p.photo) + '</span><span><b>Videography</b> ' + esc(p.video) + '</span></div><p class="pj-story">' + esc(p.story) + "</p></header>" +
      '<div class="jgal" id="gallery">' + gal + "</div></div>" +
      (films ? '<section class="wrap sec"><div class="sec-head"><h2 class="title">Films</h2></div><div class="films">' + films + "</div></section>" : "") +
      '<a class="next" href="project.html?p=' + next.slug + '"><span class="label">Next story</span><div class="title">' + esc(next.title) + "</div></a>";
    var items = srcs.map(function (s, i) { return { src: s, ratio: knownRatio(s) || 1.5, label: p.title + " · " + (i + 1) + " / " + srcs.length }; });
    host.addEventListener("click", function (e) {
      var g = e.target.closest(".jg"); if (g) return openLB(items, +g.getAttribute("data-i"), g);
      var fm = e.target.closest("[data-film]"); if (fm) { var f = p.films[+fm.getAttribute("data-film")]; openLB([{ embed: f.embed, label: f.title }], 0, fm); }
    });
  }
  function about() {
    $$("[data-portrait]").forEach(function (el) { el.innerHTML = M.portrait ? imgTag(M.portrait, "Portrait of Rohit", "(min-width:860px) 40vw, 90vw") : ph("Portrait"); var b = el.closest("[data-ar]"); if (b) b.style.setProperty("--ar", (knownRatio(M.portrait) || 0.8).toFixed(4)); });
    var b = $("#bts"); if (b) b.innerHTML = M.bts.map(function (s, i) { return box("im", s, "Behind the scenes " + (i + 1), 0.8, "(min-width:800px) 25vw, 50vw"); }).join("");
    var n = $("#stats"); if (n) n.innerHTML = window.NUMBERS.map(function (x) { return "<div><b>" + x.n + x.suffix + "</b><span>" + x.label + "</span></div>"; }).join("");
  }
  function contact() {
    $$("[data-site]").forEach(function (el) { var k = el.getAttribute("data-site"); el.textContent = k === "instagram" ? "@" + S.instagram : S[k]; });
    $$("[data-site-href]").forEach(function (a) { var k = a.getAttribute("data-site-href"); a.href = k === "instagram" ? "https://instagram.com/" + S.instagram : k === "email" ? "mailto:" + S.email : "tel:" + tel; });
    $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); });
    var f = $("#enquiry"); if (!f) return;
    var rules = {
      name: function (v) { return v.trim().length > 1 || "Please tell us your name."; },
      phone: function (v) { return v.replace(/\D/g, "").length >= 8 || "Enter a valid phone / WhatsApp number."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address."; },
      type: function (v) { return !!v || "Choose the type of event."; }
    };
    function check(inp) { var r = rules[inp.name]; if (!r) return true; var res = r(inp.value), b = inp.closest(".field"), ok = res === true; b.classList.toggle("bad", !ok); inp.setAttribute("aria-invalid", String(!ok)); if (!ok) b.querySelector(".err").textContent = res; return ok; }
    $$("input,select,textarea", f).forEach(function (i) { i.addEventListener("blur", function () { check(i); }); i.addEventListener("input", function () { if (i.closest(".bad")) check(i); }); });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = $$("input,select,textarea", f).filter(function (i) { return !check(i); });
      if (bad.length) { bad[0].focus(); return; }
      var d = {}; new FormData(f).forEach(function (v, k) { d[k] = v; });
      var btn = $("button[type=submit]", f); btn.disabled = true; btn.textContent = "Sending…";
      var done = function () { f.hidden = true; var ok = $("#formOk"); ok.classList.add("show"); ok.setAttribute("tabindex", "-1"); ok.focus(); };
      if (S.formEndpoint) {
        fetch(S.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) })
          .then(function (r) { if (!r.ok) throw 0; done(); })
          .catch(function () { btn.disabled = false; btn.textContent = "Submit Enquiry"; alert("Sorry, that didn't send. Please use WhatsApp or email instead."); });
      } else {
        var body = ["Name: " + d.name, "Phone/WhatsApp: " + d.phone, "Email: " + d.email, "Event date: " + (d.date || "-"), "Location: " + (d.location || "-"), "Event type: " + d.type, "", d.message || ""].join("\n");
        location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Enquiry — " + d.type + " — " + d.name) + "&body=" + encodeURIComponent(body);
        done();
      }
    });
  }

  /* ---------- lightbox ---------- */
  var lb, lbItems = [], lbIdx = 0, lbOpener;
  function buildLB() {
    document.body.insertAdjacentHTML("beforeend", '<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Viewer"><span class="lb-count" id="lbCount"></span><button class="lb-btn lb-close" id="lbClose" type="button" aria-label="Close">Close</button><button class="lb-btn lb-prev" id="lbPrev" type="button" aria-label="Previous">←</button><div class="lb-stage" id="lbStage"></div><div class="lb-cap" id="lbCap"></div><button class="lb-btn lb-next" id="lbNext" type="button" aria-label="Next">→</button></div>');
    lb = $("#lb");
    $("#lbClose").onclick = closeLB; $("#lbPrev").onclick = function () { stepLB(-1); }; $("#lbNext").onclick = function () { stepLB(1); };
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener("keydown", function (e) { if (!lb.classList.contains("open")) return; if (e.key === "Escape") closeLB(); if (e.key === "ArrowLeft") stepLB(-1); if (e.key === "ArrowRight") stepLB(1); });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) stepLB(dx < 0 ? 1 : -1); x0 = null; });
  }
  function showLB() {
    var it = lbItems[lbIdx], st = $("#lbStage"), html;
    if (it.embed) { html = /\.(mp4|webm|mov)(\?|$)/i.test(it.embed) ? '<video src="' + esc(it.embed) + '" controls autoplay playsinline></video>' : '<iframe src="' + esc(it.embed) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + esc(it.label) + '"></iframe>'; st.style.setProperty("--ar", "16/9"); }
    else if (it.embed === "") { html = '<div class="ph" style="width:100%;height:100%"><span>' + esc(it.label) + " — add the video in js/data.js</span></div>"; st.style.setProperty("--ar", "16/9"); }
    else { html = '<img class="ld" src="' + esc(it.src) + '" alt="' + esc(it.label) + '">'; st.style.setProperty("--ar", String(it.ratio || 1.5)); }
    st.innerHTML = html;
    $("#lbCap").innerHTML = it.href ? esc(it.label) + ' <a href="' + it.href + '">View story</a>' : esc(it.label || "");
    $("#lbCount").textContent = lbItems.length > 1 ? (lbIdx + 1) + " / " + lbItems.length : "";
    $("#lbPrev").style.display = $("#lbNext").style.display = lbItems.length > 1 ? "" : "none";
  }
  function openLB(items, i, opener) { lbItems = items; lbIdx = i; lbOpener = opener; showLB(); lb.classList.add("open"); document.body.style.overflow = "hidden"; $("#lbClose").focus(); }
  function closeLB() { lb.classList.remove("open"); $("#lbStage").innerHTML = ""; document.body.style.overflow = ""; if (lbOpener) lbOpener.focus(); }
  function stepLB(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; showLB(); }

  /* ---------- boot ---------- */
  function boot() {
    if ("scrollRestoration" in history && !location.hash) history.scrollRestoration = "manual";
    chrome(); buildLB(); header();
    home(); work(); gallery(); blog(); post(); project(); about(); contact();
    $$("img").forEach(function (i) { if (i.complete && i.naturalWidth) onImg(i); });
    justify();
    window.addEventListener("resize", queueJustify);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(justify);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
