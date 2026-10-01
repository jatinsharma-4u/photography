/* JourneysByRohit — site behaviour
   Smooth scroll (Lenis), split-text reveals, image reveals, parallax, menu, lightbox, forms.
   One rAF-driven scroll loop; transforms/opacity only. */
(function () {
  "use strict";
  var S = window.SITE, M = window.MEDIA, P = window.PROJECTS;
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M4 12h16M14 6l6 6-6 6"/></svg>';
  var UPRIGHT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9"/></svg>';
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';

  var page = document.body.getAttribute("data-page") || "home";
  var wa = function (msg) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(msg || "Hi Rohit, I found your portfolio and would love to talk about our wedding."); };

  /* ---------- shared layout ---------- */
  var links = [["Home", "index.html", "home"], ["Work", "work.html", "work"], ["Gallery", "gallery.html", "gallery"], ["Journal", "blog.html", "blog"], ["About", "about.html", "about"], ["Contact", "contact.html", "contact"]];

  function buildChrome() {
    var skip = '<a class="skip" href="#main">Skip to content</a>';
    var header =
      '<header class="header" id="header"><a class="logo" href="index.html" aria-label="' + S.brand + ' home">Journeys<em>By</em>Rohit</a>' +
      '<nav class="nav" aria-label="Primary">' + links.map(function (l) { return '<a href="' + l[1] + '"' + (l[2] === page || (page === "project" && l[2] === "work") || (page === "post" && l[2] === "blog") ? ' aria-current="page"' : "") + ">" + l[0] + "</a>"; }).join("") + "</nav>" +
      '<a class="btn head-cta" href="contact.html">Enquire</a>' +
      '<button class="burger" id="burger" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span class="lines" aria-hidden="true"><i></i><i></i><i></i></span></button></header>';
    var menu =
      '<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Site menu"><nav class="menu-links" aria-label="Mobile">' +
      links.map(function (l, i) { return '<a href="' + l[1] + '" style="--i:' + i + '"><span>' + l[0] + "</span></a>"; }).join("") +
      '</nav><div class="menu-foot"><div class="row"><a href="https://instagram.com/' + S.instagram + '" target="_blank" rel="noopener">Instagram</a><a href="' + wa() + '" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:' + S.email + '">Email</a><a href="tel:' + S.phone.replace(/\s/g, "") + '">Call</a></div><a class="menu-cta" href="contact.html"><span>Enquire for your date</span><span class="d">' + ARROW + '</span></a></div></div>';
    var cl = function (t, i, it) { return '<span class="cl' + (it ? " it" : "") + '" style="--i:' + i + '">' + t + "</span>"; };
    var curtain = '<div class="curtain" id="curtain" aria-hidden="true"><span class="cn">' + cl("Journeys", 0) + cl("By", 1, true) + cl("Rohit", 2) + '</span><span class="cs">Wedding photography &amp; films</span></div><div class="progress" id="progress"></div><div class="cursor" id="cursor" aria-hidden="true"></div>';
    document.body.insertAdjacentHTML("afterbegin", skip + header + menu + curtain);
    var main = $("main"); if (main && !main.id) main.id = "main";

    var f = $("#footer");
    if (f) {
      var mark = "JourneysByRohit".split("").map(function (c, i) { return '<span class="c' + (i >= 8 && i < 10 ? " it" : "") + '" style="--i:' + i + '">' + c + "</span>"; }).join("");
      f.outerHTML =
        '<footer class="footer" data-theme="dark"><div class="wrap">' +
        '<div class="foot-cta"><p class="eyebrow" data-fade>Now booking dates</p><a class="foot-big" href="contact.html" data-cursor="Enquire"><span class="display" data-split>Let&rsquo;s make something <em>timeless.</em></span><span class="foot-arrow">' + ARROW + "</span></a></div>" +
        '<div class="foot-top"><div class="foot-brand"><a class="logo" href="index.html">Journeys<em>By</em>Rohit</a><p>' + S.tagline + '</p><div class="foot-social"><a href="https://instagram.com/' + S.instagram + '" target="_blank" rel="noopener" aria-label="Instagram">Instagram</a><a href="' + wa() + '" target="_blank" rel="noopener" aria-label="WhatsApp">WhatsApp</a>' + (S.vimeo ? '<a href="' + S.vimeo + '" target="_blank" rel="noopener">Vimeo</a>' : "") + "</div></div>" +
        '<div class="foot-cols"><div><h4>Explore</h4>' + links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + "</a>"; }).join("") + "</div>" +
        '<div><h4>Work</h4><a href="work.html">Weddings</a><a href="work.html">Pre-Weddings</a><a href="work.html">Wedding Films</a><a href="work.html">Events</a></div>' +
        '<div class="contact"><h4>Contact</h4><a href="mailto:' + S.email + '">' + S.email + '</a><a href="tel:' + S.phone.replace(/\s/g, "") + '">' + S.phone + "</a><p>" + S.base + "</p></div></div></div>" +
        '<div class="foot-bot"><span>© ' + new Date().getFullYear() + " " + S.brand + '. All rights reserved.</span><a class="to-top" href="#top" id="toTop">Back to top ↑</a></div></div>' +
        '<div class="foot-mark" id="footMark" aria-hidden="true">' + mark + "</div></footer>";
    }
  }

  /* ---------- media helpers ---------- */
  var SIZES = "(min-width:1100px) 34vw, (min-width:700px) 50vw, 100vw";
  function srcsetOf(src) {
    var m = /^media\/img\/(p\d+\.jpg)$/.exec(src || ""); if (!m) return "";
    return ' srcset="media/img/w600/' + m[1] + " 600w, media/img/w1000/" + m[1] + " 1000w, " + src + ' 1600w"';
  }
  function imgTag(src, alt, sizes, eager) {
    return '<img src="' + esc(src) + '"' + srcsetOf(src) + (srcsetOf(src) ? ' sizes="' + (sizes || SIZES) + '"' : "") + ' alt="' + esc(alt) + '" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">';
  }
  function mediaInner(src, label, i, sizes, eager) {
    return src ? imgTag(src, label, sizes, eager) : '<div class="ph t' + (((i || 0) % 6) + 1) + '" role="img" aria-label="' + esc(label) + ' placeholder"><span>' + esc(label) + "</span></div>";
  }
  function card(p, i) {
    return '<a class="proj" href="project.html?p=' + p.slug + '" data-cat="' + esc(p.cat) + '" data-cursor="View"><div class="media" data-reveal><div class="inner">' + mediaInner(p.cover, p.title, i) +
      '</div><span class="veil"></span><span class="proj-tag">' + esc(p.cat) + '</span><span class="proj-go">' + UPRIGHT + '</span></div><div class="proj-meta"><h3 class="proj-title">' + esc(p.title) + '</h3><span class="proj-info">' + esc(p.location) + " · " + esc(p.year) + "</span></div></a>";
  }

  function fmtDate(d) { return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  function postCard(p, i, big) {
    return '<a class="post' + (big ? " post-feature" : "") + '" href="post.html?p=' + p.slug + '" data-cat="' + esc(p.cat) + '" data-title="' + esc((p.title + " " + p.excerpt).toLowerCase()) + '" data-cursor="Read">' +
      '<div class="media" data-reveal><div class="inner">' + mediaInner(p.cover, p.title, i) + '</div></div><div><div class="post-meta"><span>' + esc(p.cat) + "</span><i></i><span>" + fmtDate(p.date) + "</span><i></i><span>" + p.read + ' min read</span></div>' +
      '<h3 class="post-title">' + esc(p.title) + '</h3><p class="post-ex">' + esc(p.excerpt) + "</p></div></a>";
  }

  /* ---------- gallery ---------- */
  function knownRatio(src) { var m = /p(\d+)\.jpg/.exec(src || ""), d = m && window.DIMS && window.DIMS[m[1]]; return d ? d[0] / d[1] : null; }
  /* every picture keeps its own proportions: no cropping, any orientation */
  function fitAll() {
    $$(".sv-img,.sw-thumb,.portrait,.intro-portrait,.pj-cover,.art-cover,.proj .media,.post .media,.sw-row .media,.strip .media,.bts .media,.gal,.split .media,.article figure .media").forEach(function (el) { el.classList.add("fit"); });
    $$(".fit").forEach(function (m) {
      var img = $("img", m); if (!img) return;
      var set = function () { if (img.naturalWidth) m.style.setProperty("--ar", (img.naturalWidth / img.naturalHeight).toFixed(4)); };
      var k = knownRatio(img.getAttribute("src")); if (k) m.style.setProperty("--ar", k.toFixed(4));
      if (img.complete) set(); else img.addEventListener("load", set, { once: true });
    });
  }
  function ratioOf(src) { var m = /p(\d+)\.jpg/.exec(src || ""), d = m && window.DIMS && window.DIMS[m[1]]; return d ? d[0] / d[1] : 2 / 3; }
  function galleryItems() {
    var seen = {}, out = [];
    P.forEach(function (p) { (p.gallery || []).forEach(function (src) { if (seen[src]) return; seen[src] = 1; out.push({ src: src, title: p.title, cat: p.cat, loc: p.location, slug: p.slug, ratio: ratioOf(src) }); }); });
    return out;
  }
  function galItem(g, i) {
    return '<button class="media gal" type="button" data-reveal data-cat="' + esc(g.cat) + '" data-cursor="View" style="--ar:' + g.ratio.toFixed(4) + ';--d:' + ((i % 4) * 90) + 'ms" data-i="' + i + '" aria-label="Open photograph: ' + esc(g.title) + '"><div class="inner">' + imgTag(g.src, g.title + " — " + g.loc, "(min-width:1300px) 25vw, (min-width:900px) 33vw, 50vw") + '</div><span class="shade"></span><span class="cap"><b>' + esc(g.title) + "</b><small>" + esc(g.cat) + " · " + esc(g.loc) + '</small></span><span class="plus"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></span></button>';
  }
  function bindGallery(grid, all) {
    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".gal"); if (!b) return;
      var vis = $$(".gal:not(.is-hidden)", grid), items = vis.map(function (el) { var g = all[+el.getAttribute("data-i")]; return { src: g.src, ratio: g.ratio, label: g.title + " · " + g.loc, href: "project.html?p=" + g.slug }; });
      openLB(items, vis.indexOf(b), b);
    });
  }
  function renderGalleries() {
    var all = galleryItems();
    var hg = $("#homeGallery");
    if (hg) {
      var pick = [0, 3, 6, 9, 12, 15, 18, 21, 24].map(function (n, i) { return all[(n + i) % all.length]; });
      var idx = pick.map(function (g) { return all.indexOf(g); });
      hg.innerHTML = pick.map(function (g, i) { return galItem(g, idx[i]); }).join("");
      bindGallery(hg, all);
    }
    var gg = $("#galGrid");
    if (gg) {
      gg.innerHTML = all.map(galItem).join("");
      bindGallery(gg, all);
      setupFilter({ grid: "#galGrid", card: ".gal", chips: "#galChips", cats: window.CATEGORIES, items: all, live: "#galLive", empty: "#galEmpty", noun: "frame" });
      var lv = $("#galLive"); if (lv) lv.textContent = all.length + " frames shown";
    }
  }

  /* ---------- page renderers ---------- */
  function renderHome() {
    var jr = $("#journal"); if (jr) jr.innerHTML = window.POSTS.slice(0, 3).map(function (p, i) { return postCard(p, i); }).join("");
    $$("[data-portrait]").forEach(function (el) { el.innerHTML = mediaInner(M.portrait, "Portrait of Rohit", 1); });
    var rl = $("#reelInner");
    if (rl && M.showreel) { rl.innerHTML = '<video src="' + esc(M.showreel) + '" muted loop playsinline preload="metadata" ' + (M.showreelPoster ? 'poster="' + esc(M.showreelPoster) + '"' : "") + ' aria-hidden="true"></video>'; var rv = $("video", rl); new IntersectionObserver(function (es) { es[0].isIntersecting ? rv.play().catch(function () {}) : rv.pause(); }).observe(rv); }
    var f = $("#featured");
    if (f) {
      var fl = P.slice(0, 6);
      f.innerHTML = '<div class="sw2"><div class="sw2-list">' + fl.map(function (p, i) {
        return '<a class="sw-item' + (i === 0 ? " on" : "") + '" href="project.html?p=' + p.slug + '" data-i="' + i + '" data-cursor="View" data-fade style="--d:' + (i * 60) + 'ms">' +
          '<span class="sw-thumb media" data-reveal>' + '<span class="inner">' + mediaInner(p.cover, p.title, i, "100vw") + '</span></span>' +
          '<span class="sw-n">0' + (i + 1) + '</span><span class="sw-t">' + esc(p.title) + '</span><span class="sw-m">' + esc(p.cat) + '<i></i>' + esc(p.location) + " · " + esc(p.year) + '</span><span class="sw-go">' + UPRIGHT + "</span></a>";
      }).join("") + '</div><a class="sw2-prev" href="project.html?p=' + fl[0].slug + '" data-cursor="View" aria-hidden="true" tabindex="-1">' + fl.map(function (p, i) {
        return '<figure class="sw-pv' + (i === 0 ? " on" : "") + '">' + (p.cover ? '<img src="' + esc(p.cover) + '"' + srcsetOf(p.cover) + ' sizes="46vw" alt=""' + (i === 0 ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">' : '<div class="ph t' + (i % 6 + 1) + '"><span>' + esc(p.title) + "</span></div>") + "</figure>";
      }).join("") + "</a></div>";
      var items = $$(".sw-item", f), pvs = $$(".sw-pv", f), pl = $(".sw2-prev", f);
      var setOn = function (i) { items.forEach(function (x, k) { x.classList.toggle("on", k === i); }); pvs.forEach(function (x, k) { x.classList.toggle("on", k === i); }); pl.href = items[i].href; };
      if (fine) items.forEach(function (it, i) { it.addEventListener("mouseenter", function () { setOn(i); }); it.addEventListener("focus", function () { setOn(i); }); });
    }
    var s = $("#strip"); if (s) s.innerHTML = M.strip.map(function (src, i) { return '<div class="media" data-reveal data-cursor="">' + '<div class="inner">' + mediaInner(src, "Frame " + (i + 1), i + 2) + "</div></div>"; }).join("");
    var n = $("#nums"); if (n) n.innerHTML = window.NUMBERS.map(function (x, i) { return '<div class="num" data-fade style="--d:' + (i * 90) + 'ms"><small>0' + (i + 1) + '</small><b data-count="' + x.n + '" data-suffix="' + x.suffix + '">0' + x.suffix + "</b><span>" + x.label + '</span><i class="num-bar"></i></div>'; }).join("");
    var mq = $("#marquee"); if (mq) { var t = ["Weddings", "Pre-Weddings", "Wedding Films", "Events", "Destination Stories", "Candid Moments"]; var h = t.map(function (x) { return "<span>" + x + "</span>"; }).join(""); mq.innerHTML = h + h; }
  }
  /* generic chip + select + search filter for card grids */
  function setupFilter(o) {
    var g = $(o.grid), fl = $(o.chips); if (!g || !fl) return;
    var state = { cat: "All", year: "all", q: "" };
    fl.innerHTML = o.cats.map(function (c, i) {
      var count = c === "All" ? o.items.length : o.items.filter(function (p) { return p.cat === c; }).length;
      return '<button class="chip" type="button" aria-pressed="' + (i === 0) + '" data-f="' + c + '">' + c + "<sup>" + count + "</sup></button>";
    }).join("");
    function apply() {
      var k = 0;
      $$(o.card, g).forEach(function (c) {
        var show = (state.cat === "All" || c.getAttribute("data-cat") === state.cat) && (state.year === "all" || c.getAttribute("data-year") === state.year) && (!state.q || (c.getAttribute("data-title") || "").indexOf(state.q) > -1);
        c.classList.toggle("is-hidden", !show); c.classList.remove("pop");
        if (show) { void c.offsetWidth; c.style.animationDelay = (k++ * 70) + "ms"; c.classList.add("pop"); }
      });
      var live = $(o.live); if (live) live.textContent = k + (k === 1 ? " " + o.noun : " " + o.noun + "s") + " shown";
      var em = $(o.empty); if (em) em.classList.toggle("show", k === 0);
      refresh();
    }
    fl.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      $$(".chip", fl).forEach(function (c) { c.setAttribute("aria-pressed", c === b); });
      state.cat = b.getAttribute("data-f"); apply();
    });
    var ys = $(o.year); if (ys) ys.addEventListener("change", function () { state.year = ys.value; apply(); });
    var sr = $(o.search); if (sr) sr.addEventListener("input", function () { state.q = sr.value.trim().toLowerCase(); apply(); });
    var rs = $(o.reset); if (rs) rs.addEventListener("click", function () { state = { cat: "All", year: "all", q: "" }; if (ys) ys.value = "all"; if (sr) sr.value = ""; $$(".chip", fl).forEach(function (c, i) { c.setAttribute("aria-pressed", i === 0); }); apply(); });
  }
  function renderWork() {
    var g = $("#workGrid"); if (!g) return;
    g.innerHTML = P.map(card).join("");
    $$(".proj", g).forEach(function (c, i) { c.setAttribute("data-year", P[i].year); c.setAttribute("data-title", (P[i].title + " " + P[i].location).toLowerCase()); });
    var ys = $("#yearSel");
    if (ys) { var yrs = P.map(function (p) { return p.year; }).filter(function (v, i, a) { return a.indexOf(v) === i; }).sort().reverse(); ys.innerHTML = '<option value="all">All years</option>' + yrs.map(function (y) { return "<option>" + y + "</option>"; }).join(""); }
    setupFilter({ grid: "#workGrid", card: ".proj", chips: "#filters", cats: window.CATEGORIES, items: P, year: "#yearSel", search: "#workSearch", live: "#liveCount", empty: "#workEmpty", reset: "#workReset", noun: "project" });
    var live = $("#liveCount"); if (live) live.textContent = P.length + " projects shown";
  }
  function renderBlog() {
    var g = $("#postGrid"); if (!g) return;
    var sorted = window.POSTS.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    var ft = $("#postFeature"); if (ft) ft.innerHTML = postCard(sorted[0], 0, true);
    g.innerHTML = sorted.slice(1).map(function (p, i) { return postCard(p, i + 1); }).join("");
    setupFilter({ grid: "#postGrid", card: ".post", chips: "#postChips", cats: window.POST_CATS, items: sorted.slice(1), search: "#postSearch", live: "#postLive", empty: "#postEmpty", reset: "#postReset", noun: "article" });
    var live = $("#postLive"); if (live) live.textContent = sorted.length - 1 + " articles shown";
  }
  function renderPost() {
    var host = $("#article"); if (!host) return;
    var slug = new URLSearchParams(location.search).get("p");
    var list = window.POSTS, idx = Math.max(0, list.findIndex(function (p) { return p.slug === slug; })), p = list[idx];
    document.title = p.title + " — " + S.brand;
    var body = p.body.map(function (b) {
      if (b[0] === "h") return "<h2>" + esc(b[1]) + "</h2>";
      if (b[0] === "q") return "<blockquote>" + esc(b[1]) + "</blockquote>";
      if (b[0] === "img") return '<figure><div class="media" data-reveal><div class="inner" style="inset:0">' + mediaInner(b[1], b[2], 2) + "</div></div><figcaption>" + esc(b[2]) + "</figcaption></figure>";
      return "<p>" + esc(b[1]) + "</p>";
    }).join("");
    var related = list.filter(function (x) { return x.slug !== p.slug; }).sort(function (a, b) { return (b.cat === p.cat) - (a.cat === p.cat); }).slice(0, 3);
    host.innerHTML =
      '<section class="art-head wrap"><a class="eyebrow" href="blog.html" data-fade>Journal</a><h1 class="display" data-split data-hero>' + esc(p.title) + '</h1><div class="post-meta" data-fade data-d="300"><span>' + esc(p.cat) + "</span><i></i><span>" + fmtDate(p.date) + "</span><i></i><span>" + p.read + " min read</span></div></section>" +
      '<div class="media art-cover" data-reveal data-hero><div class="inner">' + mediaInner(p.cover, p.title, 1) + "</div></div>" +
      '<article class="article">' + body + '<div class="share"><span class="eyebrow">Share</span><a class="ulink" href="https://wa.me/?text=' + encodeURIComponent(p.title + " " + location.href) + '" target="_blank" rel="noopener">WhatsApp</a><button class="ulink" type="button" id="copyLink">Copy link</button></div></article>' +
      '<section class="wrap pad" style="padding-top:0"><div class="sec-head"><h2 class="display h-lg" data-split>Keep <em>reading</em></h2><a class="ulink" href="blog.html">All articles</a></div><div class="post-grid">' + related.map(function (r, i) { return postCard(r, i); }).join("") + "</div></section>";
    var cl = $("#copyLink"); if (cl) cl.addEventListener("click", function () { (navigator.clipboard ? navigator.clipboard.writeText(location.href) : Promise.reject()).then(function () { cl.textContent = "Copied ✓"; }).catch(function () { cl.textContent = "Press Ctrl+C"; }); });
  }
  function renderProject() {
    var host = $("#project"); if (!host) return;
    var slug = new URLSearchParams(location.search).get("p");
    var idx = Math.max(0, P.findIndex(function (p) { return p.slug === slug; }));
    var p = P[idx], next = P[(idx + 1) % P.length];
    document.title = p.title + " — " + S.brand;
    var gal = (p.gallery && p.gallery.length ? p.gallery : Array.apply(null, Array(p.count || 8))).map(function (src, i) {
      var ratios = [0.8, 1.5, 1, 0.667, 1.5, 0.8, 1.6, 1], r = (src && knownRatio(src)) || ratios[i % ratios.length];
      return '<div class="media jg" data-reveal data-lb="' + i + '" data-r="' + r.toFixed(4) + '" data-cursor="Zoom" tabindex="0" role="button" aria-label="Open photograph ' + (i + 1) + '" style="--d:' + ((i % 3) * 70) + 'ms"><div class="inner">' + (src ? imgTag(src, p.title + " — photograph " + (i + 1), "(min-width:1100px) 34vw, 70vw") : mediaInner("", "Photograph " + String(i + 1).padStart(2, "0"), i)) + "</div></div>";
    }).join("");
    var films = (p.films || []).map(function (f, i) {
      var isVid = f.embed && /\.(mp4|webm)(\?|$)/i.test(f.embed);
      return '<button class="film" type="button" data-film="' + i + '" data-cursor="Play" aria-label="Play ' + esc(f.title) + '">' + (f.poster ? '<img src="' + esc(f.poster) + '" alt="" loading="lazy">' : isVid ? '<video src="' + esc(f.embed) + '#t=2" muted loop playsinline preload="metadata" aria-hidden="true"></video>' : '<div class="ph t' + (i + 5) + '"><span></span></div>') +
        '<span class="play">' + '<span>' + PLAY + "Play</span></span><span class=\"cap\">" + esc(f.title) + "</span></button>";
    }).join("");
    host.innerHTML =
      '<section class="pj-hero"><div class="wrap"><a class="eyebrow" href="work.html" data-fade>All work</a><h1 class="display h-xl pj-title" data-split data-hero>' + esc(p.title) + '</h1></div>' +
      '<div class="media pj-cover" data-reveal data-hero><div class="inner">' + mediaInner(p.cover, p.title + " cover", idx) + '</div></div></section>' +
      '<div class="wrap"><dl class="pj-meta"><div data-fade><dt>Couple / Project</dt><dd>' + esc(p.title) + '</dd></div><div data-fade style="--d:60ms"><dt>Location</dt><dd>' + esc(p.location) + '</dd></div><div data-fade style="--d:120ms"><dt>Year</dt><dd>' + esc(p.year) + '</dd></div><div data-fade style="--d:180ms"><dt>Photography</dt><dd>' + esc(p.photo) + '</dd></div><div data-fade style="--d:240ms"><dt>Videography</dt><dd>' + esc(p.video) + "</dd></div></dl>" +
      '<div class="pj-story"><p class="eyebrow" data-fade>' + esc(p.cat) + '</p><p class="display h-md" data-split>' + esc(p.story) + "</p></div></div>" +
      '<section class="wrap" aria-labelledby="gt"><div class="sec-head"><h2 class="display h-lg" id="gt" data-split>The <em>gallery</em></h2><span class="eyebrow" data-fade>' + (p.gallery && p.gallery.length ? p.gallery.length : p.count || 8) + " frames</span></div><div class=\"jgal\" id=\"gallery\">" + gal + "</div></section>" +
      (films ? '<section class="wrap pad" aria-labelledby="ft"><div class="sec-head"><h2 class="display h-lg" id="ft" data-split>The <em>film</em></h2><span class="eyebrow" data-fade>Videography</span></div><div class="films">' + films + "</div></section>" : "") +
      '<a class="next" href="project.html?p=' + next.slug + '" data-cursor="Next"><div class="wrap"><span class="eyebrow" data-fade>Next project</span><div class="display h-xl" style="margin-top:20px">' + esc(next.title) + "</div></div></a>";

    var items = $$("#gallery .media").map(function (el, i) {
      var img = $("img", el); return { src: img ? img.src : "", ratio: img ? ratioOf(img.getAttribute("src")) : 1.5, label: p.title + " · photograph " + (i + 1) };
    });
    host.addEventListener("click", function (e) {
      var g = e.target.closest("[data-lb]"); if (g) return openLB(items, +g.getAttribute("data-lb"), g);
      var fm = e.target.closest("[data-film]"); if (fm) { var f = p.films[+fm.getAttribute("data-film")]; openLB([{ embed: f.embed, label: f.title }], 0, fm); }
    });
    host.addEventListener("keydown", function (e) { if ((e.key === "Enter" || e.key === " ") && e.target.hasAttribute("data-lb")) { e.preventDefault(); e.target.click(); } });
  }
  function renderAbout() {
    $$("[data-portrait]").forEach(function (el) { el.innerHTML = mediaInner(M.portrait, "Portrait of Rohit", 1); });
    var b = $("#bts"); if (b) b.innerHTML = M.bts.map(function (s, i) { return '<div class="media" data-reveal><div class="inner">' + mediaInner(s, "Behind the scenes " + (i + 1), i + 1) + "</div></div>"; }).join("");
  }

  /* ---------- lightbox ---------- */
  var lb, lbItems = [], lbIdx = 0, lbOpener;
  function buildLB() {
    document.body.insertAdjacentHTML("beforeend", '<div class="lb" id="lb" role="dialog" aria-modal="true" aria-label="Viewer"><span class="lb-count" id="lbCount"></span><button class="lb-btn lb-close" id="lbClose" aria-label="Close">Close ✕</button><button class="lb-btn lb-prev" id="lbPrev" aria-label="Previous">←</button><div class="lb-stage" id="lbStage"></div><div class="lb-cap" id="lbCap"></div><button class="lb-btn lb-next" id="lbNext" aria-label="Next">→</button></div>');
    lb = $("#lb");
    $("#lbClose").onclick = closeLB;
    $("#lbPrev").onclick = function () { stepLB(-1); };
    $("#lbNext").onclick = function () { stepLB(1); };
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLB(); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("open")) return;
      if (e.key === "Escape") closeLB(); if (e.key === "ArrowLeft") stepLB(-1); if (e.key === "ArrowRight") stepLB(1);
    });
    var x0 = null;
    lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) stepLB(dx < 0 ? 1 : -1); x0 = null; });
  }
  function showLB() {
    var it = lbItems[lbIdx], st = $("#lbStage"), html;
    if (it.embed) {
      html = /\.(mp4|webm|mov)(\?|$)/i.test(it.embed) ? '<video src="' + esc(it.embed) + '" controls autoplay playsinline></video>' : '<iframe src="' + esc(it.embed) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + esc(it.label) + '"></iframe>';
      st.style.setProperty("--ar", "16/9");
    } else if (it.src) { html = '<img src="' + esc(it.src) + '" alt="' + esc(it.label) + '">'; st.style.setProperty("--ar", String(it.ratio || 1.5)); }
    else { html = '<div class="ph t' + ((lbIdx % 6) + 1) + '" style="color:rgba(16,16,16,.6)"><span>' + esc(it.label) + (it.embed === "" ? " — add the video link in js/data.js" : "") + "</span></div>"; st.style.setProperty("--ar", it.embed === "" ? "16/9" : "3/2"); }
    st.innerHTML = html;
    $("#lbCap").innerHTML = it.href ? esc(it.label) + ' <a href="' + it.href + '">View project →</a>' : "";
    $("#lbCount").textContent = lbItems.length > 1 ? (lbIdx + 1) + " / " + lbItems.length : "";
    $("#lbPrev").style.display = $("#lbNext").style.display = lbItems.length > 1 ? "" : "none";
  }
  function openLB(items, i, opener) { lbItems = items; lbIdx = i; lbOpener = opener; showLB(); lb.classList.add("open"); if (lenis) lenis.stop(); document.body.style.overflow = "hidden"; $("#lbClose").focus(); }
  function closeLB() { lb.classList.remove("open"); $("#lbStage").innerHTML = ""; if (lenis) lenis.start(); document.body.style.overflow = ""; if (lbOpener) lbOpener.focus(); }
  function stepLB(d) { lbIdx = (lbIdx + d + lbItems.length) % lbItems.length; showLB(); }

  /* ---------- text splitting ---------- */
  function split(el) {
    var i = 0;
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    (function walk(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (t) {
            if (!t) return;
            if (/^\s+$/.test(t)) { frag.appendChild(document.createTextNode(" ")); return; }
            var w = document.createElement("span"); w.className = "w"; w.setAttribute("aria-hidden", "true");
            var wi = document.createElement("span"); wi.className = "wi"; wi.style.setProperty("--i", i++); wi.textContent = t;
            w.appendChild(wi); frag.appendChild(w);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== "BR") walk(n);
      });
    })(el);
  }

  /* ---------- justified gallery: rows keep every photo's own proportions ---------- */
  function justify() {
    var c = $("#gallery.jgal"); if (!c) return;
    var W = c.clientWidth; if (!W) return;
    var vw = window.innerWidth, gap = vw < 700 ? 4 : 6, H = vw < 700 ? 250 : vw < 1100 ? 320 : 400;
    var row = [], sum = 0;
    function flush(last) {
      var avail = W - gap * (row.length - 1), h = (last && sum * H + gap * (row.length - 1) < W * 0.72) ? H : avail / sum;
      row.forEach(function (it) { var r = +it.getAttribute("data-r"); it.style.width = Math.floor(r * h) + "px"; it.style.height = Math.round(h) + "px"; });
      row = []; sum = 0;
    }
    $$(".jg", c).forEach(function (it) { var r = +it.getAttribute("data-r"); row.push(it); sum += r; if (sum * H + gap * (row.length - 1) >= W) flush(false); });
    if (row.length) flush(true);
  }
  function initJustify() {
    var c = $("#gallery.jgal"); if (!c) return;
    $$(".jg img", c).forEach(function (img) { var set = function () { if (img.naturalWidth) { img.closest(".jg").setAttribute("data-r", (img.naturalWidth / img.naturalHeight).toFixed(4)); justify(); } }; if (img.complete) set(); else img.addEventListener("load", set, { once: true }); });
    justify(); var t; window.addEventListener("resize", function () { cancelAnimationFrame(t); t = requestAnimationFrame(justify); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(justify);
  }

  /* ---------- scroll engine ---------- */
  var reelEl = null, vw0 = function () { return window.innerWidth; }, pending = new Set(), lastSweep = 0, lenis = null, vh = innerHeight, io, tracked = [], visible = new Set(), darkEls = [], lastY = 0;
  var hero, heroMedia, heroCopy, header, progress, scrubs = [], strip, stripWrap;

  function refresh() { observeAll(); update(); }

  function observeAll(scope) {
    $$("[data-split]:not([data-ready])", scope).forEach(function (el) { split(el); el.setAttribute("data-ready", ""); });
    $$("[data-split],[data-fade],[data-reveal]", scope).forEach(function (el) { if (!el._obs) { el._obs = 1; pending.add(el); io.observe(el); } });
    $$(".media .inner", scope).forEach(function (inner) {
      var m = inner.parentNode;
      if (m._px || m.classList.contains("no-px") || m.classList.contains("fit") || m.closest(".strip,.gallery,.jgal,.bts,.masonry")) return;
      m._px = 1; tracked.push({ el: m, inner: inner }); pxIO.observe(m);
    });
    darkEls = $$("[data-theme='dark']");
  }
  var pxIO = new IntersectionObserver(function (es) { es.forEach(function (e) { e.isIntersecting ? visible.add(e.target) : visible.delete(e.target); }); }, { rootMargin: "20% 0px" });

  function update() {
    var y = window.scrollY; vh = innerHeight;
    if (progress) progress.style.transform = "scaleX(" + clamp(y / Math.max(1, document.documentElement.scrollHeight - vh), 0, 1) + ")";

    if (!reduce) {
      var reads = [];
      tracked.forEach(function (t) { if (visible.has(t.el)) reads.push([t, t.el.getBoundingClientRect()]); });
      reads.forEach(function (x) {
        var r = x[1], p = clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1);
        x[0].inner.style.transform = "translate3d(0," + (p * -6).toFixed(2) + "%,0)";
      });
      if (heroMedia && y < vh * 1.2) {
        heroMedia.style.transform = "translate3d(0," + (y * 0.22).toFixed(1) + "px,0) scale(" + (1 + y / vh * 0.06).toFixed(4) + ")";
        heroCopy.style.transform = "translate3d(0," + (y * -0.12).toFixed(1) + "px,0)";
        heroCopy.style.opacity = clamp(1 - y / (vh * 0.7), 0, 1);
      }
      if (strip) {
        var r2 = stripWrap.getBoundingClientRect();
        var p2 = clamp((vh - r2.top) / (vh + r2.height), 0, 1);
        strip.style.transform = "translate3d(" + (-p2 * Math.max(0, strip.scrollWidth - innerWidth)).toFixed(1) + "px,0,0)";
      }
    }
    if (reelEl && !reduce) {
      var rr = reelEl.getBoundingClientRect();
      if (rr.bottom > -100 && rr.top < vh + 100) {
        var pp = clamp((vh - rr.top) / (vh * 0.78), 0, 1), e = 1 - Math.pow(1 - pp, 3), mob = vw0() < 720;
        reelEl.style.transform = "scale(" + ((mob ? 0.84 : 0.6) + (mob ? 0.16 : 0.4) * e).toFixed(4) + ")";
        reelEl.style.borderRadius = ((1 - e) * 26).toFixed(1) + "px";
        var rv = reelEl.firstElementChild; if (rv) rv.style.transform = "scale(" + (1.18 - 0.18 * e).toFixed(4) + ")";
      }
    }
    scrubs.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      var p = clamp((vh * 0.82 - r.top) / (r.height + vh * 0.1), 0, 1), n = Math.round(p * s.words.length);
      if (n !== s.n) { s.words.forEach(function (w, i) { w.classList.toggle("on", i < n); }); s.n = n; }
    });

    /* header: hide on scroll down, flip colour over dark sections */
    if (header && !header.classList.contains("menu-open")) {
      header.classList.toggle("hide", y > 120 && y > lastY + 2);
      if (y < lastY - 2 || y < 120) header.classList.remove("hide");
      var on = darkEls.some(function (d) { var r = d.getBoundingClientRect(); return r.top < 38 && r.bottom > 38; });
      header.classList.toggle("on-dark", on);
      header.classList.toggle("solid", y > 40 && !(on && y < vh * 0.9));
    }
    lastY = y;
    /* safety net: anything that was scrolled past without being seen (fast flicks, jump links) is revealed */
    var now = performance.now();
    if (now - lastSweep > 120) {
      lastSweep = now;
      pending.forEach(function (el) { if (el.getBoundingClientRect().bottom < -40) { el.classList.add("is-in"); pending.delete(el); io.unobserve(el); } });
    }
  }

  function counters() {
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return; cio.unobserve(e.target);
        var el = e.target, to = +el.getAttribute("data-count"), suf = el.getAttribute("data-suffix") || "", t0 = performance.now(), d = 1800;
        if (reduce) { el.textContent = to + suf; return; }
        (function f(t) { var k = clamp((t - t0) / d, 0, 1), v = 1 - Math.pow(1 - k, 4); el.textContent = Math.round(to * v) + suf; if (k < 1) requestAnimationFrame(f); })(t0);
      });
    }, { threshold: 0.6 });
    $$("[data-count]").forEach(function (el) { cio.observe(el); });
  }

  /* ---------- hero video ---------- */
  function heroVideo() {
    var slot = $("#heroMedia .ph"), v;
    if (!slot) return;
    var src = innerWidth < 720 && M.heroVideoMobile ? M.heroVideoMobile : M.heroVideo;
    var snd = $("#sound");
    var poster = innerWidth < 720 && M.heroPosterMobile ? M.heroPosterMobile : M.heroPoster;
    if (!src) { if (snd) snd.hidden = true; if (M.heroPoster) slot.outerHTML = '<img src="' + esc(M.heroPoster) + '" alt="" style="width:100%;height:100%;object-fit:cover">'; return; }
    v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true; v.preload = "auto"; v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    if (poster) v.poster = poster;
    v.src = src; v.setAttribute("aria-hidden", "true");
    slot.replaceWith(v);
    v.play().catch(function () {});
    var inView = true, kick = function () { if (inView && v.paused && !document.hidden) v.play().catch(function () {}); };
    new IntersectionObserver(function (es) { inView = es[es.length - 1].isIntersecting; inView ? kick() : v.pause(); }).observe(v);
    v.addEventListener("canplay", kick); v.addEventListener("loadeddata", kick);
    document.addEventListener("visibilitychange", kick);
    window.addEventListener("pageshow", kick);
    document.addEventListener("touchstart", kick, { once: true, passive: true });
    if (snd) snd.addEventListener("click", function () { v.muted = !v.muted; snd.setAttribute("aria-pressed", String(!v.muted)); snd.querySelector("span").textContent = v.muted ? "Sound off" : "Sound on"; });
  }

  /* ---------- menu ---------- */
  function menu() {
    var b = $("#burger"), m = $("#menu"); if (!b) return;
    function set(open) {
      m.classList.toggle("open", open); header.classList.toggle("menu-open", open);
      b.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : ""; if (lenis) open ? lenis.stop() : lenis.start();
      if (open) setTimeout(function () { var a = $("a", m); a && a.focus({ preventScroll: true }); }, 400);
    }
    b.addEventListener("click", function () { set(!m.classList.contains("open")); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("open")) { set(false); b.focus(); } });
    matchMedia("(min-width:1000px)").addEventListener("change", function (e) { if (e.matches) set(false); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) { m.classList.remove("open"); b.setAttribute("aria-expanded", "false"); } });
  }

  /* ---------- page transitions ---------- */
  function transitions() {
    var c = $("#curtain");
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      var h = a.getAttribute("href"); if (!h || a.target === "_blank" || h.charAt(0) === "#" || /^(mailto|tel|https?):/i.test(h) || a.hasAttribute("download")) return;
      e.preventDefault(); if (reduce) { location.href = h; return; }
      c.classList.add("leave"); if (lenis) lenis.stop(); setTimeout(function () { location.href = h; }, 780);
    });
    window.addEventListener("pageshow", function (e) { if (e.persisted) { c.classList.remove("leave"); document.body.style.overflow = ""; } });
  }

  /* ---------- custom cursor label ---------- */
  function cursor() {
    var c = $("#cursor"); if (!c || !fine || reduce) return;
    var x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener("mousemove", function (e) { x = e.clientX; y = e.clientY; });
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest("[data-cursor]"); var l = t && t.getAttribute("data-cursor");
      if (l) { c.textContent = l; c.classList.add("on"); } else c.classList.remove("on");
    });
    (function f() { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; c.style.translate = cx.toFixed(1) + "px " + cy.toFixed(1) + "px"; requestAnimationFrame(f); })();
  }

  /* ---------- contact form ---------- */
  function form() {
    var f = $("#enquiry"); if (!f) return;
    var rules = {
      name: function (v) { return v.trim().length > 1 || "Please tell us your name."; },
      phone: function (v) { return v.replace(/\D/g, "").length >= 8 || "Enter a valid phone / WhatsApp number."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Enter a valid email address."; },
      type: function (v) { return !!v || "Choose the type of event."; },
    };
    function check(inp) {
      var r = rules[inp.name]; if (!r) return true;
      var res = r(inp.value), box = inp.closest(".field"), ok = res === true;
      box.classList.toggle("bad", !ok); inp.setAttribute("aria-invalid", String(!ok));
      if (!ok) box.querySelector(".err").textContent = res; return ok;
    }
    $$("input,select,textarea", f).forEach(function (i) { i.addEventListener("blur", function () { check(i); }); i.addEventListener("input", function () { if (i.closest(".bad")) check(i); }); });
    var wab = $("#waBtn"); if (wab) wab.href = wa();
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var bad = $$("input,select,textarea", f).filter(function (i) { return !check(i); });
      if (bad.length) { bad[0].focus(); return; }
      var d = {}; new FormData(f).forEach(function (v, k) { d[k] = v; });
      var btn = $("button[type=submit]", f); btn.disabled = true; btn.firstChild.textContent = "Sending…";
      var done = function () { f.hidden = true; var ok = $("#formOk"); ok.classList.add("show"); ok.setAttribute("tabindex", "-1"); ok.focus(); };
      if (S.formEndpoint) {
        fetch(S.formEndpoint, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(d) })
          .then(function (r) { if (!r.ok) throw 0; done(); })
          .catch(function () { btn.disabled = false; btn.firstChild.textContent = "Submit Enquiry"; alert("Sorry, that didn't send. Please use WhatsApp or email instead."); });
      } else {
        var body = ["Name: " + d.name, "Phone/WhatsApp: " + d.phone, "Email: " + d.email, "Event date: " + (d.date || "-"), "Location: " + (d.location || "-"), "Event type: " + d.type, "", d.message || ""].join("\n");
        location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Enquiry — " + d.type + " — " + d.name) + "&body=" + encodeURIComponent(body);
        done();
      }
    });
  }

  /* ---------- boot ---------- */
  function boot() {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    if (!location.hash) window.scrollTo(0, 0);
    buildChrome(); buildLB();
    renderHome(); renderGalleries(); renderWork(); renderBlog(); renderPost(); renderProject(); renderAbout();
    $$(".film video").forEach(function (v) { var b = v.parentNode; b.addEventListener("mouseenter", function () { v.play().catch(function () {}); }); b.addEventListener("mouseleave", function () { v.pause(); }); });
    if (fine && !reduce) $$("[data-magnetic], .btn:not(.head-cta)").forEach(function (el) {
      el.addEventListener("mousemove", function (e) { var r = el.getBoundingClientRect(); el.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px)"; el.style.transition = "transform .15s"; });
      el.addEventListener("mouseleave", function () { el.style.transform = ""; el.style.transition = "transform .7s cubic-bezier(.22,1,.36,1)"; });
    });
    $$(".article p,.article h2,.article blockquote,.prose p,.about-copy p,.ap,.intro-side p,.timeline li,.svc-row,.pj-story p:not(.display)").forEach(function (el) { if (!el.hasAttribute("data-fade") && !el.hasAttribute("data-split")) el.setAttribute("data-fade", ""); });
    $$(".nav a, .foot-cols a, .foot-social a, .ulink, .menu-foot a").forEach(function (a) {
      if (a.children.length || a.childNodes.length !== 1 || a.firstChild.nodeType !== 3) return;
      var t = a.textContent; a.innerHTML = '<span class="roll" style="display:inline-block;overflow:hidden;position:relative;vertical-align:top;height:1.4em;line-height:1.4"><span style="display:block">' + esc(t) + '</span><span aria-hidden="true" style="display:block;position:absolute;left:0;top:100%;white-space:nowrap">' + esc(t) + "</span></span>";
    });
    var fm0 = $("#footMark");
    if (fm0) { var fit = function () { fm0.style.fontSize = "100px"; var w = 0; $$(".c", fm0).forEach(function (c) { w += c.getBoundingClientRect().width; }); var cw = fm0.clientWidth - 2 * 12; if (w) fm0.style.fontSize = Math.floor(100 * cw / w * 0.985) + "px"; }; fit(); window.addEventListener("resize", fit); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit); }
    var fm = $("#footMark"); if (fm) new IntersectionObserver(function (es, o) { if (es[0].isIntersecting) { fm.classList.add("in"); o.disconnect(); } }, { threshold: 0.2 }).observe(fm);
    fitAll(); reelEl = $("#reel"); initJustify();
    header = $("#header"); progress = $("#progress");
    hero = $(".hero"); heroMedia = $("#heroMedia"); heroCopy = $("#heroCopy");
    strip = $("#strip"); stripWrap = $("#stripWrap");
    $$("[data-scrub]").forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/); el.setAttribute("aria-label", words.join(" "));
      el.innerHTML = words.map(function (w) { return '<span class="sw" aria-hidden="true">' + esc(w) + "</span>"; }).join(" ");
      scrubs.push({ el: el, words: $$(".sw", el), n: -1 });
    });

    function show(el) { el.classList.add("is-in"); pending.delete(el); }
    io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, d = el.hasAttribute("data-hero") ? 480 : 0;
        if (el.hasAttribute("data-fade") && el.getAttribute("data-d")) el.style.setProperty("--d", el.getAttribute("data-d") + "ms");
        io.unobserve(el);
        var img = el.hasAttribute("data-reveal") ? $("img", el) : null;
        if (img && !(img.complete && img.naturalWidth)) {
          var done = false, go = function () { if (done) return; done = true; setTimeout(function () { show(el); }, d); };
          img.addEventListener("load", go, { once: true }); img.addEventListener("error", go, { once: true });
          setTimeout(go, 2500);
          if (img.loading === "lazy") img.loading = "eager";
        } else setTimeout(function () { show(el); }, d);
      });
    }, { threshold: 0, rootMargin: "0px 0px 22% 0px" });

    (function services() {
      var list = $$(".sv"); if (!list.length) return;
      function set(sv, open) { sv.classList.toggle("open", open); $(".sv-head", sv).setAttribute("aria-expanded", String(open)); }
      function only(sv) { list.forEach(function (x) { set(x, x === sv); }); }
      list.forEach(function (sv) {
        var head = $(".sv-head", sv), t;
        head.addEventListener("click", function () { var o = sv.classList.contains("open"); list.forEach(function (x) { set(x, false); }); if (!o) set(sv, true); });
        if (fine) { head.addEventListener("mouseenter", function () { clearTimeout(t); t = setTimeout(function () { if (!sv.classList.contains("open")) only(sv); }, 110); }); head.addEventListener("mouseleave", function () { clearTimeout(t); }); }
      });
      set(list[0], true);
    })();
    heroVideo(); menu(); transitions(); cursor(); form(); counters();
    observeAll();

    if (window.Lenis && !reduce) {
      lenis = new Lenis({ duration: 1.3, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true, wheelMultiplier: 0.95 });
      lenis.on("scroll", update);
      (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0);
    } else window.addEventListener("scroll", update, { passive: true });
    var raf1 = 0; window.addEventListener("scroll", function () { if (raf1) return; raf1 = requestAnimationFrame(function () { raf1 = 0; update(); }); }, { passive: true });
    window.addEventListener("resize", update);
    update();

    var tt = $("#toTop"); if (tt) tt.addEventListener("click", function (e) { e.preventDefault(); lenis ? lenis.scrollTo(0, { duration: 1.6 }) : scrollTo({ top: 0, behavior: "smooth" }); });
    var rl = $("#showreel"); if (rl) rl.addEventListener("click", function () { openLB([{ embed: M.showreel, label: "Showreel" }], 0, rl); });
    $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); });
    $$("[data-site]").forEach(function (el) { var k = el.getAttribute("data-site"); el.textContent = k === "instagram" ? "@" + S.instagram : S[k]; });
    $$("[data-site-href]").forEach(function (a) {
      var k = a.getAttribute("data-site-href");
      a.href = k === "instagram" ? "https://instagram.com/" + S.instagram : k === "email" ? "mailto:" + S.email : "tel:" + S.phone.replace(/\s/g, "");
    });
    if (window.location.hash && $(window.location.hash)) setTimeout(function () { $(window.location.hash).scrollIntoView(); }, 50);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})();
