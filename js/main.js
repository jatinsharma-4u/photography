/* JourneysByRohit: site behaviour
   Navigation, filters, justified galleries, immersive viewer, slider, enquiry form.
   Motion is limited to gentle fades. Images load lazily (optionally through Cloudinary). */
(function () {
  "use strict";
  var S = window.SITE, M = window.MEDIA, P = window.PROJECTS, POSTS = window.POSTS || [];
  document.documentElement.classList.add("js");
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var page = document.body.getAttribute("data-page") || "home";
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  var wa = function (msg) { return "https://wa.me/" + S.whatsapp + "?text=" + encodeURIComponent(msg || "Hi Rohit, I found your portfolio and would love to talk about our wedding."); };
  var tel = S.phone.replace(/\s/g, "");
  var PLAY = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  var CHEV_L = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M15 4 7 12l8 8"/></svg>';
  var CHEV_R = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="m9 4 8 8-8 8"/></svg>';
  var links = [["Work", "work.html", "work"], ["Gallery", "gallery.html", "gallery"], ["Journal", "blog.html", "blog"], ["About", "about.html", "about"], ["Contact", "contact.html", "contact"]];

  /* ---------- image delivery (local files, or Cloudinary when configured) ---------- */
  function cdn(src, w) {
    var C = S.cloudinary, m = /^media\/img\/([\w-]+)\.jpg$/.exec(src || "");
    if (!C || !C.cloud || !m) return src;
    var base = "https://res.cloudinary.com/" + C.cloud + "/image/";
    if (C.mode === "upload") return base + "upload/f_auto,q_auto,w_" + w + "/" + (C.folder ? C.folder.replace(/\/$/, "") + "/" : "") + m[1];
    return C.siteUrl ? base + "fetch/f_auto,q_auto,w_" + w + "/" + C.siteUrl.replace(/\/$/, "") + "/" + src : src;
  }
  function srcsetOf(src) {
    var m = /^media\/img\/([\w-]+\.jpg)$/.exec(src || ""); if (!m || /^hero-poster/.test(m[1])) return "";
    var C = S.cloudinary; if (C && C.cloud) return ' srcset="' + cdn(src, 600) + " 600w, " + cdn(src, 1000) + " 1000w, " + cdn(src, 1600) + ' 1600w"';
    return ' srcset="media/img/w600/' + m[1] + " 600w, media/img/w1000/" + m[1] + " 1000w, " + src + ' 1600w"';
  }
  function imgTag(src, alt, sizes, eager) {
    var ss = srcsetOf(src);
    return '<img src="' + esc(ss ? cdn(src, 1000) : src) + '"' + ss + (ss ? ' sizes="' + (sizes || "(min-width:1000px) 34vw, (min-width:640px) 50vw, 100vw") + '"' : "") + ' alt="' + esc(alt) + '" ' + (eager ? 'fetchpriority="high"' : 'loading="lazy"') + ' decoding="async">';
  }
  function ph(label) { return '<div class="ph"><span>' + esc(label) + "</span></div>"; }
  function knownRatio(src) { var m = /([\w-]+\.jpg)$/.exec(src || ""), d = m && window.DIMS && window.DIMS[m[1]]; return d ? d[0] / d[1] : null; }
  function box(cls, src, alt, fallbackAr, sizes, eager) {
    var r = knownRatio(src) || fallbackAr;
    return '<div class="' + cls + '" data-ar style="--ar:' + r.toFixed(4) + '">' + (src ? imgTag(src, alt, sizes, eager) : ph(alt)) + "</div>";
  }
  var meta = function (p) { return [p.location, p.year].filter(Boolean).join(", "); };
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M3 12h17M14 6l6 6-6 6"/></svg>';

  /* ---------- shared chrome ---------- */
  function chrome() {
    var navLink = function (l) { return '<a href="' + l[1] + '"' + (cur(l[2]) ? ' aria-current="page"' : "") + ">" + l[0] + "</a>"; };
    var cur = function (k) { return k === page || (page === "project" && k === "work") || (page === "post" && k === "blog"); };
    document.body.insertAdjacentHTML("afterbegin",
      '<a class="skip" href="#main">Skip to content</a>' +
      '<header class="header" id="header"><nav class="nav nav-l" aria-label="Primary">' + navLink(links[0]) + navLink(links[1]) + '</nav><a class="logo" href="index.html" aria-label="' + S.brand + ' home">' + S.brand + '</a>' +
      '<nav class="nav nav-r" aria-label="Secondary">' + navLink(links[2]) + navLink(links[3]) + navLink(links[4]) + "</nav>" +
      '<button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Menu"><i></i><i></i><i></i></button></header>' +
      '<div class="menu" id="menu" role="dialog" aria-modal="true" aria-label="Site menu"><nav class="menu-links" aria-label="Mobile">' +
      links.map(function (l, i) { return '<a href="' + l[1] + '" style="--i:' + i + '">' + l[0] + "</a>"; }).join("") + '</nav><div class="menu-sub"><a style="--i:5" href="https://instagram.com/' + S.instagram + '" target="_blank" rel="noopener">Instagram</a><a style="--i:6" href="' + wa() + '" target="_blank" rel="noopener">WhatsApp</a><a style="--i:7" href="mailto:' + S.email + '">Email</a></div></div>' +
      (fine ? '<div class="cursor" id="cursor" aria-hidden="true"><span><svg class="c-cam" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M3.5 8.5h3.2L8.2 6h7.6l1.5 2.5h3.2a1 1 0 0 1 1 1V18a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1z"/><circle cx="12" cy="13.4" r="3.6"/></svg><svg class="c-play" viewBox="0 0 24 24" fill="currentColor"><path d="M9 6.5v11l9-5.5z"/></svg></span></div>' : ""));
    var main = $("main"); if (main && !main.id) main.id = "main";
    var f = $("#footer");
    if (f) f.outerHTML = '<footer class="footer"><div class="wrap">' +
      '<a class="f-mark" href="index.html" aria-label="' + S.brand + '">' + S.brand + '</a>' +
      '<nav class="f-nav" aria-label="Footer">' + links.map(function (l) { return '<a href="' + l[1] + '">' + l[0] + "</a>"; }).join("") + "</nav>" +
      '<div class="f-contact"><a href="mailto:' + S.email + '">' + S.email + '</a><a href="https://instagram.com/' + S.instagram + '" target="_blank" rel="noopener">@' + S.instagram + "</a></div>" +
      '<div class="f-bot"><span>© ' + new Date().getFullYear() + " " + S.brand + '</span><a href="#top">Back to top</a></div></div></footer>';
  }

  function header() {
    var h = $("#header"), hero = $(".hero"), b = $("#burger"), m = $("#menu");
    function state() {
      var past = hero ? window.scrollY > hero.offsetHeight - 80 : true, open = m.classList.contains("open");
      h.classList.toggle("on-hero", !!hero && !past && !open);
      h.classList.toggle("solid", past && !open);
    }
    var tick = 0; window.addEventListener("scroll", function () { if (!tick) tick = requestAnimationFrame(function () { tick = 0; state(); }); }, { passive: true });
    function set(open) { m.classList.toggle("open", open); h.classList.toggle("menu-open", open); b.setAttribute("aria-expanded", String(open)); document.body.style.overflow = open ? "hidden" : ""; state(); }
    b.addEventListener("click", function () { set(!m.classList.contains("open")); });
    m.addEventListener("click", function (e) { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && m.classList.contains("open")) set(false); });
    matchMedia("(min-width:900px)").addEventListener("change", function (e) { if (e.matches) set(false); });
    state();
  }

  /* ---------- image load / ratios / justified rows ---------- */
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

  function justify() {
    $$(".jgal").forEach(function (c) {
      var W = c.clientWidth; if (!W) return;
      var vw = window.innerWidth, exhibit = c.hasAttribute("data-exhibit"), gap = vw < 700 ? 3 : (exhibit ? 6 : 3), H = vw < 700 ? (c.id === "homeGallery" ? 150 : 230) : vw < 1100 ? 320 : 400;
      var items = $$(".jg", c);
      items.forEach(function (it) { c.appendChild(it); });                       // flatten
      $$(".jrow", c).forEach(function (r) { r.remove(); });
      var vis = items.filter(function (it) { return !it.classList.contains("is-hidden") && window.getComputedStyle(it).display !== "none"; });
      var rows = [], row = [], sum = 0;
      if (exhibit) {
        /* an exhibition rhythm: a full-width frame, a pair, a trio, a pair ... every row still fills the width */
        var pat = vw < 700 ? [1, 2, 2, 1, 2] : [1, 2, 3, 2, 2, 1, 3, 2], k = 0, pi = 0, rest = vis.slice();
        while (rest.length) {
          var n = Math.min(pat[pi % pat.length], rest.length), first = +rest[0].getAttribute("data-r");
          if (n === 1 && first < 1.25 && rest.length > 1) n = 2;
          var group = rest.splice(0, n), sm = group.reduce(function (a2, it) { return a2 + (+it.getAttribute("data-r")); }, 0);
          rows.push({ items: group, sum: sm, last: !rest.length, fixed: true }); pi++;
        }
      } else {
        vis.forEach(function (it) { var r = +it.getAttribute("data-r"); row.push(it); sum += r; if (sum * H + gap * (row.length - 1) >= W) { rows.push({ items: row, sum: sum, last: false }); row = []; sum = 0; } });
        if (row.length) rows.push({ items: row, sum: sum, last: true });
      }
      rows.forEach(function (R) {
        var n = R.items.length, avail = W - gap * (n - 1) - 1, h = (!R.fixed && R.last && R.sum * H + gap * (n - 1) < W * 0.5) ? H : avail / R.sum;
        var maxH = R.fixed ? Math.min(W * 0.82, window.innerHeight * 1.08) : 1e6, centre = false;
        if (h > maxH) { h = maxH; centre = true; }
        var el = document.createElement("div"); el.className = "jrow"; el.style.cssText = "display:flex;flex-wrap:nowrap;align-items:flex-start;gap:" + gap + "px;margin-bottom:" + gap + "px" + (centre ? ";justify-content:center" : "");
        R.items.forEach(function (it) { var r = +it.getAttribute("data-r"); it.style.width = Math.floor(r * h) + "px"; it.style.height = Math.round(h) + "px"; el.appendChild(it); });
        c.appendChild(el);
      });
    });
  }

  /* ---------- tabs ---------- */
  function tabs(sel, itemSel, scope, emptySel, order) {
    var el = $(sel); if (!el) return;
    var items = $$(itemSel, scope), have = {};
    items.forEach(function (it) { have[it.getAttribute("data-cat")] = 1; });
    var cats = ["All"].concat((order || Object.keys(have)).filter(function (c) { return have[c]; }));
    if (cats.length < 3) { el.hidden = true; return; }
    el.innerHTML = cats.map(function (c, i) { return '<button class="tab" type="button" aria-pressed="' + (i === 0) + '" data-f="' + esc(c) + '">' + esc(c) + "</button>"; }).join("");
    el.addEventListener("click", function (e) {
      var b = e.target.closest(".tab"); if (!b) return;
      $$(".tab", el).forEach(function (t) { t.setAttribute("aria-pressed", t === b); });
      var f = b.getAttribute("data-f"), n = 0;
      items.forEach(function (it) { var show = f === "All" || it.getAttribute("data-cat") === f; it.classList.toggle("is-hidden", !show); if (show) n++; });
      var em = emptySel && $(emptySel); if (em) em.classList.toggle("show", n === 0);
      justify();
    });
  }

  /* ---------- builders ---------- */
  function card(p) {
    return '<a class="card" href="project.html?p=' + p.slug + '" data-cat="' + esc(p.cat) + '" data-cursor="View">' + box("im", p.card || p.cover, p.title, 0.8, "(min-width:1000px) 31vw, (min-width:640px) 48vw, 100vw") +
      '<div class="cap"><b>' + esc(p.title) + "</b><span>" + esc(p.cat) + (meta(p) ? ", " + esc(meta(p)) : "") + "</span><em>View project " + ARROW + "</em></div></a>";
  }
  function fmtDate(d) { return new Date(d + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }
  function postCard(p) {
    return '<a class="post" href="post.html?p=' + p.slug + '" data-cat="' + esc(p.cat) + '" data-cursor="Read">' + box("im", p.cover, p.title, 1.5) +
      '<div class="txt"><div class="meta">' + esc(p.cat) + ", " + fmtDate(p.date) + "</div><h3>" + esc(p.title) + "</h3><p>" + esc(p.excerpt) + "</p></div></a>";
  }
  function projectItems(p) {
    return (p.gallery || []).map(function (s, i, a) { return { src: s, ratio: knownRatio(s) || 1.5, label: p.title, sub: p.cat + (meta(p) ? ", " + meta(p) : ""), href: "project.html?p=" + p.slug, n: (i + 1) + " / " + a.length }; });
  }
  function galleryItems() {
    var seen = {}, out = [];
    P.forEach(function (p) { (p.gallery || []).forEach(function (src) { if (seen[src]) return; seen[src] = 1; out.push({ src: src, title: p.title, cat: p.cat, sub: meta(p), slug: p.slug, r: knownRatio(src) || 0.8 }); }); });
    return out;
  }
  function jItem(g, i, n) {
    return '<button class="jg" type="button" data-r="' + g.r.toFixed(4) + '" data-cat="' + esc(g.cat) + '" data-i="' + i + '" data-cursor="View" aria-label="Open photograph: ' + esc(g.title) + '">' + imgTag(g.src, g.title + (g.sub ? " — " + g.sub : ""), "(min-width:1100px) 25vw, 50vw").replace(' loading="lazy"', (n || 0) < 10 ? "" : ' loading="lazy"') + "</button>";
  }
  function bindGallery(grid, all) {
    grid.addEventListener("click", function (e) {
      var b = e.target.closest(".jg"); if (!b) return;
      var vis = $$(".jg:not(.is-hidden)", grid), items = vis.map(function (el, k) { var g = all[+el.getAttribute("data-i")]; return { src: g.src, ratio: g.r, label: g.title, sub: [g.cat, g.sub].filter(Boolean).join(", "), href: "project.html?p=" + g.slug, n: (k + 1) + " / " + vis.length }; });
      openViewer(items, vis.indexOf(b), b);
    });
  }

  /* ---------- pages ---------- */
  function home() {
    /* selected work: a collage on the 12-column grid. An intro block sits beside the lead story; the next two stories
       share a row at different widths, bottoms aligned. Every cover is the same 3:2 landscape, nothing is re-cropped. */
    var sw = $("#selected");
    if (sw) {
      var list = P.slice(0, 5);
      var intro = '<div class="sw6-intro"><p class="label">Selected work</p><h2 class="title">Real love stories</h2>' +
        '<p>A few weddings, pre-weddings and engagements, each told the way it felt: natural light, honest emotion and the small moments in between. Open any story for the full gallery and, where there is one, the film.</p>' +
        '<a class="link" href="work.html">View all stories</a></div>';
      var tile = function (p, i) {
        var src = p.card || p.wide || p.cover, r = knownRatio(src) || 1.5;
        return '<a class="sw6 p' + (i + 1) + '" style="--r:' + r.toFixed(3) + '" href="project.html?p=' + p.slug + '" data-cursor="View" aria-label="' + esc(p.title) + '"><div class="im" style="aspect-ratio:' + r.toFixed(3) + '">' +
          imgTag(src, p.title, i === 0 ? "(min-width:1000px) 64vw, 100vw" : "(min-width:1000px) 30vw, 50vw", i < 2) +
          '</div><div class="tx"><p class="label">' + esc([p.cat, meta(p)].filter(Boolean).join(", ")) + "</p><h3>" + esc(p.title) + '</h3><span class="go">View project ' + ARROW + "</span></div></a>";
      };
      /* one tight composition: lead story beside the intro, then rows whose tiles share a height (width follows each photo's own ratio) */
      sw.innerHTML = '<div class="sw6-grid"><div class="sw6-top">' + intro + tile(list[0], 0) + '</div>' +
        '<div class="sw6-row">' + [1, 2].map(function (i) { return tile(list[i], i); }).join("") + '</div>' +
        '<div class="sw6-row">' + [3, 4].map(function (i) { return tile(list[i], i); }).join("") + "</div></div>";
    }

    /* showcase: what one project feels like before opening it */
    var sc = $("#showcase");
    if (sc && window.SHOWCASE) {
      var SH = window.SHOWCASE, sp = P.filter(function (x) { return x.slug === SH.slug; })[0] || P[0], href = "project.html?p=" + sp.slug;
      sc.innerHTML = '<div class="sc-grid"><a class="sc a" href="' + href + '" data-cursor="View" aria-label="' + esc(sp.title) + '">' + imgTag(SH.a, sp.title, "(min-width:900px) 62vw, 100vw") + '</a>' +
        '<a class="sc b" href="' + href + '" data-cursor="View" aria-hidden="true" tabindex="-1">' + imgTag(SH.b, "", "(min-width:900px) 24vw, 46vw") + '</a>' +
        '<div class="sc t"><p class="label">' + esc([sp.cat, meta(sp)].filter(Boolean).join(", ")) + "</p><h3>" + esc(sp.title) + "</h3><p>" + esc(SH.line) + '</p><a class="link" href="' + href + '">Open the story</a></div>' +
        '<a class="sc c" href="' + href + '" data-cursor="View" aria-hidden="true" tabindex="-1">' + imgTag(SH.c, "", "(min-width:900px) 58vw, 100vw") + "</a></div>";
    }
    var si = $("#storyImg"); if (si && M.story) si.innerHTML = imgTag(M.story, "Rohit photographing his reflection", "(min-width:900px) 58vw, 100vw");
    var fr = $("#frames");
    if (fr && M.frames) {
      var fitems = M.frames.map(function (f) { return { src: f.src, ratio: knownRatio(f.src) || 1.5, label: "Jaidev & Shaily", sub: "Weddings, Delhi", href: "project.html?p=jaidev-and-shaily" }; });
      fr.innerHTML = M.frames.map(function (f, i) { return '<button class="fr ' + f.cls + '" type="button" data-i="' + i + '" data-cursor="View" aria-label="Open photograph: ' + esc(f.alt) + '">' + imgTag(f.src, f.alt, "(min-width:900px) 60vw, 100vw") + "</button>"; }).join("");
      fr.addEventListener("click", function (e) { var b = e.target.closest(".fr"); if (b) openViewer(fitems, +b.getAttribute("data-i"), b); });
    }
    var sv = $("#services");
    if (sv && window.SERVICES) sv.innerHTML = window.SERVICES.map(function (x) { return '<a class="svc" href="' + x.href + '"><div class="im">' + imgTag(x.img, x.t, "(min-width:900px) 22vw, 46vw").replace("<img ", '<img style="object-position:' + (x.pos || "50% 50%") + '" ') + "</div><div class=\"stx\"><h3>" + esc(x.t) + "</h3><p>" + esc(x.d) + "</p></div></a>"; }).join("");
    var all = galleryItems(), hg = $("#homeGallery");
    if (hg) { var order = M.homeGallery || [], pick = order.map(function (src) { return all.filter(function (g) { return g.src === src; })[0]; }).filter(Boolean); if (!pick.length) pick = all.slice(0, 10); hg.innerHTML = pick.map(function (g, k) { return jItem(g, all.indexOf(g), k).replace('class="jg"', 'class="jg' + (k >= 10 ? ' m-only' : '') + '"'); }).join(""); bindGallery(hg, all); }
    var jr = $("#journal"); if (jr) { var jp = POSTS.slice(0, 3); jr.innerHTML = '<div class="jfeat">' + postCard(jp[0]) + '<div class="jside">' + jp.slice(1).map(postCard).join("") + "</div></div>"; jr.classList.remove("cards"); }
    $$("[data-portrait]").forEach(function (el) { el.innerHTML = M.portrait ? imgTag(M.portrait, "Rohit photographing his reflection", "(min-width:860px) 40vw, 90vw") : ph("Portrait"); var b = el.closest("[data-ar]"); if (b) b.style.setProperty("--ar", (knownRatio(M.portrait) || 0.8).toFixed(4)); });
    var rl = $("#reel");
    if (rl) {
      rl.innerHTML = (M.showreelPoster ? imgTag(M.showreelPoster, "Pre-wedding film still", "(min-width:1100px) 1100px, 100vw") : ph("Film")) + '<span class="play" aria-hidden="true">' + PLAY + "</span>";
      var openReel = function () { openViewer([{ embed: M.showreel || "", label: "Sid & Aditi", sub: "Pre-wedding film" }], 0, rl); };
      rl.addEventListener("click", openReel); rl.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openReel(); } });
    }
    heroVideo();
  }
  function heroVideo() {
    var hero = $(".hero"); if (!hero) return;
    var lite = navigator.connection && (navigator.connection.saveData || /(^|-)2g$/.test(navigator.connection.effectiveType || "")), src = lite && M.heroVideoMobile ? M.heroVideoMobile : M.heroVideo, poster = innerWidth < 720 && M.heroPosterMobile ? M.heroPosterMobile : M.heroPoster, START = M.heroStart || 0;
    if (poster) hero.insertAdjacentHTML("afterbegin", '<img src="' + esc(poster) + '" alt="" fetchpriority="high">');
    if (!src) return;
    var v = document.createElement("video");
    v.muted = true; v.loop = false; v.playsInline = true; v.autoplay = true; v.preload = "auto"; v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("aria-hidden", "true");
    v.src = src + (START ? "#t=" + START : ""); hero.insertBefore(v, hero.firstChild.nextSibling || null);
    var inView = true, kick = function () { if (inView && v.paused && !document.hidden) v.play().catch(function () {}); };
    var restart = function () { try { v.currentTime = START; } catch (e) {} kick(); };
    v.addEventListener("loadedmetadata", function () { var can = v.seekable && v.seekable.length && v.seekable.end(0) > START + 0.5; if (!can) { START = 0; v.loop = true; return; } if (v.currentTime < START) { try { v.currentTime = START; } catch (e) {} } });
    v.addEventListener("ended", restart);
    v.addEventListener("timeupdate", function () { if (v.duration && v.currentTime >= v.duration - 0.08) restart(); });
    new IntersectionObserver(function (es) { inView = es[es.length - 1].isIntersecting; inView ? kick() : v.pause(); }).observe(v);
    v.addEventListener("playing", function () { v.classList.add("on"); }); v.addEventListener("canplay", kick);
    document.addEventListener("visibilitychange", kick); window.addEventListener("pageshow", kick); document.addEventListener("touchstart", kick, { once: true, passive: true }); kick();
  }
  function work() {
    var g = $("#workGrid"); if (!g) return;
    g.innerHTML = P.map(card).join("");
    tabs("#workTabs", ".card", g, "#workEmpty");
  }
  function gallery() {
    var g = $("#galGrid"); if (!g) return;
    var all = galleryItems(); g.innerHTML = all.map(function (g, i) { return jItem(g, i, i); }).join(""); bindGallery(g, all);
    tabs("#galTabs", ".jg", g, "#galEmpty");
  }
  function blog() {
    var g = $("#postGrid"); if (!g) return;
    g.innerHTML = POSTS.slice().sort(function (a, b) { return b.date.localeCompare(a.date); }).map(postCard).join("");
    tabs("#postTabs", ".post", g, "#postEmpty", window.POST_CATS.slice(1));
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
    host.innerHTML = '<header class="page-head wrap"><a class="label" href="blog.html">Journal</a><h1 class="title">' + esc(p.title) + '</h1><p class="label">' + esc(p.cat) + ", " + fmtDate(p.date) + ", " + p.read + ' min read</p></header>' +
      '<div class="wrap">' + box("pj-cover", p.cover, p.title, 1.6, "100vw", true) + "</div>" +
      '<article class="article">' + body + '<div class="share"><span class="label">Share</span><a class="link" href="https://wa.me/?text=' + encodeURIComponent(p.title + " " + location.href) + '" target="_blank" rel="noopener">WhatsApp</a></div></article>' +
      '<section class="wrap sec"><div class="sec-head"><h2 class="title">Keep reading</h2></div><div class="cards">' + rel.map(postCard).join("") + "</div></section>";
  }
  function project() {
    var host = $("#project"); if (!host) return;
    var slug = new URLSearchParams(location.search).get("p");
    var idx = Math.max(0, P.findIndex(function (p) { return p.slug === slug; })), p = P[idx], next = P[(idx + 1) % P.length], prev = P[(idx - 1 + P.length) % P.length];
    document.title = p.title + " — " + S.brand;
    var srcs = p.gallery || [], items = projectItems(p), closeIdx = -1;
    if (srcs.length > 6) { for (var kk = srcs.length - 1; kk >= 0; kk--) { if ((knownRatio(srcs[kk]) || 1) >= 1.3) { closeIdx = kk; break; } } }
    var gal = srcs.map(function (src, i) {
      if (i === closeIdx) return "";
      return '<button class="jg" type="button" data-r="' + (knownRatio(src) || 1.2).toFixed(4) + '" data-i="' + i + '" data-cursor="View" aria-label="Open photograph ' + (i + 1) + '">' + imgTag(src, p.title + " — photograph " + (i + 1), "(min-width:1100px) 25vw, 50vw").replace(' loading="lazy"', i < 10 ? "" : ' loading="lazy"') + "</button>";
    }).join("");
    var films = (p.films || []).map(function (f, i) {
      return '<button class="film" type="button" data-film="' + i + '" aria-label="Play ' + esc(f.title) + '">' + (f.poster ? imgTag(f.poster, f.title, "(min-width:800px) 50vw, 100vw") : ph(f.title)) + '<span class="play" aria-hidden="true">' + PLAY + '</span><span class="cap">' + esc(f.title) + "</span></button>";
    }).join("");
    var banner = p.wide || p.cover, pos = p.focus || "50% 50%";
    var noHref = function (it) { return Object.assign({}, it, { href: "" }); };
    host.innerHTML = '<div class="wrap pj-intro"><header class="pj-head"><p class="label">' + esc(p.cat) + '</p><h1 class="title">' + esc(p.title) + '</h1><div class="pj-credits">' + (meta(p) ? "<span>" + esc(meta(p)) + "</span>" : "") + '<span><b>Photography</b> ' + esc(p.photo) + '</span><span><b>Videography</b> ' + esc(p.video) + '</span></div></header></div>' +
      '<div class="wrap"><div class="pj-cover pj-banner" data-cursor="View">' + (banner ? imgTag(banner, p.title, "100vw", true) : ph(p.title)) + '</div></div>' +
      '<div class="wrap"><p class="pj-story">' + esc(p.story) + '</p></div>' +
      (films ? '<section class="wrap pj-sec"><div class="sec-head"><p class="label">Film</p></div><div class="films">' + films + "</div></section>" : "") +
      '<section class="wrap pj-sec"><div class="sec-head"><p class="label">Photography</p></div><div class="jgal" id="gallery" data-exhibit>' + gal + "</div></section>" +
      (closeIdx > -1 ? '<div class="wrap"><button class="pj-closing" type="button" data-i="' + closeIdx + '" data-cursor="View" aria-label="Open closing photograph" style="--ar:' + (knownRatio(srcs[closeIdx]) || 1.5).toFixed(3) + '">' + imgTag(srcs[closeIdx], p.title + " — closing photograph", "100vw") + "</button></div>" : "") +
      '<nav class="pj-nav wrap" aria-label="Stories"><a class="pj-prev" href="project.html?p=' + prev.slug + '"><span class="label">Previous</span><span class="pj-nt">' + esc(prev.title) + '</span></a><a class="pj-back link" href="index.html#work">Back to selected work</a><a class="pj-next" href="project.html?p=' + next.slug + '"><span class="label">Next</span><span class="pj-nt">' + esc(next.title) + "</span></a></nav>";
    host.addEventListener("click", function (e) {
      var g = e.target.closest(".jg, .pj-closing"); if (g) return openViewer(items.map(noHref), +g.getAttribute("data-i"), g);
      var c = e.target.closest(".pj-cover"); if (c && items.length) return openViewer(items.map(function (it) { return Object.assign({}, it, { href: "" }); }), 0, c);
      var fm = e.target.closest("[data-film]"); if (fm) { var f = p.films[+fm.getAttribute("data-film")]; openViewer([{ embed: f.embed, label: p.title, sub: f.title }], 0, fm); }
    });
  }
  function about() {
    $$("[data-portrait]").forEach(function (el) { el.innerHTML = M.portrait ? imgTag(M.portrait, "Rohit photographing his reflection", "(min-width:860px) 40vw, 90vw") : ph("Portrait"); var b = el.closest("[data-ar]"); if (b) b.style.setProperty("--ar", (knownRatio(M.portrait) || 0.8).toFixed(4)); });
    var b = $("#bts"); if (b) b.innerHTML = M.bts.map(function (s, i) { return box("im", s, "Photograph " + (i + 1), 0.8, "(min-width:800px) 25vw, 50vw"); }).join("");
    var aw = $("#awards");
    if (aw && window.AWARDS && window.AWARDS.length) {
      var leaf = function (side) { var out = ""; for (var k = 0; k < 9; k++) { var t = k / 8, y = 78 - t * 62, x = 40 - Math.sin(t * 1.5) * 20 - t * 6, rot = -40 + t * 70; out += '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="3.2" ry="7" transform="rotate(' + rot.toFixed(0) + " " + x.toFixed(1) + " " + y.toFixed(1) + ')"/>'; } return '<g transform="' + (side ? "translate(100 0) scale(-1 1)" : "") + '">' + out + "</g>"; };
      aw.innerHTML = window.AWARDS.map(function (a) {
        return '<div class="award"><svg viewBox="0 0 100 100" aria-hidden="true" fill="currentColor">' + leaf(0) + leaf(1) + '</svg><div class="award-in"><span>Winner</span><b>' + esc(a.title) + "</b><span>" + esc(a.by) + "</span><span>" + esc(a.year) + "</span></div></div>";
      }).join("");
    } else if (aw) { aw.closest("section").hidden = true; }
    var n = $("#stats"); if (n) n.innerHTML = window.NUMBERS.map(function (x) { return "<div><b>" + x.n + x.suffix + "</b><span>" + x.label + "</span></div>"; }).join("");
  }
  function contact() {
    $$("[data-site]").forEach(function (el) { var k = el.getAttribute("data-site"); el.textContent = k === "instagram" ? "@" + S.instagram : S[k]; });
    $$("[data-site-href]").forEach(function (a) { var k = a.getAttribute("data-site-href"); a.href = k === "instagram" ? "https://instagram.com/" + S.instagram : k === "email" ? "mailto:" + S.email : "tel:" + tel; });
    $$("[data-wa]").forEach(function (a) { a.href = wa(a.getAttribute("data-wa")); });
    var f = $("#enquiry"); if (!f) return;
    var rules = {
      name: function (v) { return v.trim().length > 1 || "Please tell us your name."; },
      email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || "Enter a valid email address."; },
      phone: function (v) { return !v.trim() || v.replace(/\D/g, "").length >= 8 || "Enter a valid phone / WhatsApp number."; }
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
          .catch(function () { btn.disabled = false; btn.textContent = "Send"; alert("Sorry, that didn't send. Please use WhatsApp or email instead."); });
      } else {
        var body = ["Name: " + d.name, "Email: " + d.email, "Phone/WhatsApp: " + (d.phone || "-"), "Event type: " + (d.type || "-"), "Event date: " + (d.date || "-"), "", d.message || ""].join("\n");
        location.href = "mailto:" + S.email + "?subject=" + encodeURIComponent("Enquiry: " + (d.type || "Wedding") + ", " + d.name) + "&body=" + encodeURIComponent(body);
        done();
      }
    });
  }

  /* ---------- immersive viewer ---------- */
  var vw, vItems = [], vIdx = 0, vOpener, vLayer = 0;
  function buildViewer() {
    document.body.insertAdjacentHTML("beforeend",
      '<div class="vw" id="vw" role="dialog" aria-modal="true" aria-label="Photo viewer"><div class="vw-top"><span class="vw-title" id="vwTitle"></span><span class="vw-count" id="vwCount"></span><button class="vw-btn vw-close" id="vwClose" type="button">Close</button></div>' +
      '<button class="vw-nav prev" id="vwPrev" type="button" aria-label="Previous">' + CHEV_L + '</button><div class="vw-stage" id="vwStage"><img class="vw-img" alt=""><img class="vw-img" alt=""><div class="vw-embed" id="vwEmbed"></div></div><button class="vw-nav next" id="vwNext" type="button" aria-label="Next">' + CHEV_R + '</button>' +
      '<div class="vw-bot"><span id="vwSub"></span><a id="vwLink" href="#">View full story</a></div></div>');
    vw = $("#vw");
    $("#vwClose").onclick = closeViewer; $("#vwPrev").onclick = function () { stepViewer(-1); }; $("#vwNext").onclick = function () { stepViewer(1); };
    vw.addEventListener("click", function (e) { if (e.target === vw || e.target.id === "vwStage") closeViewer(); });
    document.addEventListener("keydown", function (e) { if (!vw.classList.contains("open")) return; if (e.key === "Escape") closeViewer(); if (e.key === "ArrowLeft") stepViewer(-1); if (e.key === "ArrowRight") stepViewer(1); });
    var x0 = null;
    vw.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    vw.addEventListener("touchend", function (e) { if (x0 === null) return; var dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) stepViewer(dx < 0 ? 1 : -1); x0 = null; });
  }
  function showViewer() {
    var it = vItems[vIdx], layers = $$(".vw-img", vw), emb = $("#vwEmbed");
    $("#vwTitle").textContent = it.label || ""; $("#vwSub").textContent = it.sub || "";
    $("#vwCount").textContent = vItems.length > 1 ? (vIdx + 1) + " of " + vItems.length : "";
    var lk = $("#vwLink"); lk.hidden = !it.href; if (it.href) lk.href = it.href;
    $("#vwPrev").hidden = $("#vwNext").hidden = vItems.length < 2;
    if (it.embed !== undefined) {
      layers.forEach(function (l) { l.classList.remove("on"); });
      emb.innerHTML = it.embed ? (/\.(mp4|webm|mov)(\?|$)/i.test(it.embed) ? '<video src="' + esc(it.embed) + '" controls autoplay playsinline preload="metadata" controlsList="nodownload"></video>' : '<iframe src="' + esc(it.embed) + '" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="' + esc(it.label || "Film") + '"></iframe>') : '<p class="vw-none">Add the film in js/data.js</p>';
      emb.classList.add("on"); return;
    }
    emb.classList.remove("on"); emb.innerHTML = "";
    vLayer = 1 - vLayer; var nxt = layers[vLayer], prv = layers[1 - vLayer], mine = vIdx;
    nxt.onload = function () { if (mine !== vIdx) return; nxt.classList.add("on"); prv.classList.remove("on"); };
    nxt.alt = (it.label || "") + " photograph"; nxt.src = cdn(it.src, 2000);
    if (nxt.complete && nxt.naturalWidth) nxt.onload();
    [1, -1].forEach(function (d) { var n = vItems[(vIdx + d + vItems.length) % vItems.length]; if (n && n.src) { var im = new Image(); im.src = cdn(n.src, 2000); } });
  }
  function openViewer(items, i, opener) { var cu = $("#cursor"); if (cu) cu.classList.remove("on"); vItems = items; vIdx = i || 0; vOpener = opener; $$(".vw-img", vw).forEach(function (l) { l.classList.remove("on"); l.removeAttribute("src"); }); showViewer(); vw.classList.add("open"); document.body.style.overflow = "hidden"; $("#vwClose").focus(); }
  function closeViewer() { vw.classList.remove("open"); $("#vwEmbed").innerHTML = ""; document.body.style.overflow = ""; if (vOpener && vOpener.focus) vOpener.focus(); }
  function stepViewer(d) { vIdx = (vIdx + d + vItems.length) % vItems.length; showViewer(); }

  /* ---------- team: an editorial zig-zag, each portrait a different size ---------- */
  function team() {
    var host = $("#team"); if (!host || !window.TEAM) return;
    host.innerHTML = window.TEAM.slice(0, 3).map(function (m, i) {
      var ini = m.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2);
      var im = m.img ? imgTag(m.img, m.name, "(min-width:900px) 34vw, 78vw") : '<span class="tm-ph" aria-hidden="true">' + esc(ini) + "</span>";
      return '<article class="tm t' + (i + 1) + '"><div class="tm-im">' + im + '</div><div class="tm-tx"><p class="label">' + esc(m.role) + "</p><h3>" + esc(m.name) + "</h3><p>" + esc(m.bio) + '</p><p class="spec">' + esc(m.spec) + "</p></div></article>";
    }).join("");
  }

  /* ---------- gentle reveal + cursor ---------- */
  function reveal() {
    var sel = ".sec-head, .tm, .sw6, .sc, .story-im, .statement > *, .card, .post, .swc, .slider, .sl-text, .reel, .film, .split, .cols3 article, .stats > div, .bts .im, .pj-head, .pj-cover, .page-head > *, .cta > *";
    var els = $$(sel); if (!("IntersectionObserver" in window)) return;
    els.forEach(function (el) { el.classList.add("rv"); var sib = el.parentNode ? Array.prototype.indexOf.call(el.parentNode.children, el) : 0; el.style.setProperty("--d", (sib % 4) * 70 + "ms"); });
    var pending = new Set(els);
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); pending.delete(e.target); io.unobserve(e.target); } }); }, { rootMargin: "0px 0px 8% 0px" });
    els.forEach(function (el) { io.observe(el); });
    var t = 0; window.addEventListener("scroll", function () { if (t) return; t = setTimeout(function () { t = 0; pending.forEach(function (el) { if (el.getBoundingClientRect().bottom < 0) { el.classList.add("in"); pending.delete(el); io.unobserve(el); } }); }, 160); }, { passive: true });
  }
  function cursor() {
    var c = $("#cursor"); if (!c) return;
    var tx = -100, ty = -100, x = -100, y = -100, raf = 0;
    var tick = function () {
      x += (tx - x) * 0.2; y += (ty - y) * 0.2;
      c.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) ? requestAnimationFrame(tick) : 0;
    };
    document.addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(tick); });
    document.addEventListener("mouseover", function (e) {
      var t = e.target.closest("[data-cursor]"), native = e.target.closest("video, iframe, .vw, .vw-embed, a:not([data-cursor]), button:not([data-cursor]), input, select, textarea, label");
      c.classList.toggle("on", !!t && !native && !vw.classList.contains("open"));
    });
    document.addEventListener("mousedown", function () { c.classList.add("down"); });
    document.addEventListener("mouseup", function () { c.classList.remove("down"); });
    document.addEventListener("mouseleave", function () { c.classList.remove("on"); });
  }

  /* ---------- opening: an Enter screen, then a smooth scroll down into the hero ---------- */
  function entry() {
    var hero = $(".hero"); if (!hero) return false;
    var fromSite = false;
    try { fromSite = document.referrer && new URL(document.referrer).origin === location.origin && (performance.getEntriesByType("navigation")[0] || {}).type !== "reload"; } catch (e) {}
    if (fromSite || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    var ops = [0.4, 0.14, 0.5, 0.22, 0.36, 0.12, 0.44, 0.08, 0.46, 0.18, 0.38, 0.14, 0.5, 0.28, 0.2];
    var tiles = (M.entryTiles || []).map(function (src, i) { var m = /^media\/img\/([\w-]+\.jpg)$/.exec(src); return '<span style="background-image:url(' + (m ? "media/img/w600/" + m[1] : src) + ');opacity:' + ops[i % ops.length] + '"></span>'; }).join("");
    var el = document.createElement("section"); el.className = "enter"; el.id = "enter"; el.setAttribute("aria-label", "Welcome");
    el.innerHTML = '<div class="enter-tiles" aria-hidden="true">' + tiles + '</div><div class="enter-core"><p class="enter-name">' + esc(S.brand) + '</p><button class="enter-btn" type="button">Enter</button></div>';
    document.body.insertBefore(el, $("main"));
    var root = document.documentElement; root.classList.add("entering"); window.scrollTo(0, 0);
    var done = false;
    function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function go() {
      if (done) return; done = true; el.classList.add("leaving");
      var from = window.scrollY, to = el.offsetHeight, t0 = null, dur = 1500;
      setTimeout(function () {
        (function step(t) {
          if (t0 === null) t0 = t; var k = Math.min(1, (t - t0) / dur); window.scrollTo(0, from + (to - from) * ease(k));
          if (k < 1) requestAnimationFrame(step); else { el.remove(); root.classList.remove("entering"); window.scrollTo(0, 0); }
        })(performance.now());
      }, 250);
    }
    $(".enter-btn", el).addEventListener("click", go);
    window.addEventListener("wheel", function (e) { if (root.classList.contains("entering") && e.deltaY > 8) go(); }, { passive: true });
    var y0 = null; window.addEventListener("touchstart", function (e) { y0 = e.touches[0].clientY; }, { passive: true });
    window.addEventListener("touchmove", function (e) { if (root.classList.contains("entering") && y0 !== null && y0 - e.touches[0].clientY > 24) go(); }, { passive: true });
    return true;
  }

  /* ---------- boot ---------- */
  function boot() {
    if ("scrollRestoration" in history && !location.hash) history.scrollRestoration = "manual";
    chrome(); buildViewer(); entry(); header();
    home(); team(); work(); gallery(); blog(); post(); project(); about(); contact();
    $$("img").forEach(function (i) { if (i.complete && i.naturalWidth) onImg(i); });
    justify(); reveal(); cursor();
    [1500, 4000, 9000].forEach(function (ms) { setTimeout(function () { $$("img:not(.ld)").forEach(function (i) { if (i.complete && i.naturalWidth) onImg(i); }); }, ms); });
    window.addEventListener("resize", queueJustify);
    if (window.ResizeObserver) { var ro = new ResizeObserver(queueJustify); $$(".jgal").forEach(function (c) { ro.observe(c); }); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(justify);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();

  /* soft page transitions between internal pages */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0 || a.target === "_blank") return;
    var u = a.getAttribute("href"); if (!u || u.charAt(0) === "#" || /^(mailto:|tel:|https?:|javascript:)/i.test(u)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    e.preventDefault(); document.documentElement.classList.add("leaving");
    setTimeout(function () { window.location.href = u; }, 260);
  });
  window.addEventListener("pageshow", function (e) { if (e.persisted) document.documentElement.classList.remove("leaving"); });
})();
