/* =========================================================
   JourneysByRohit: site content & media config
   Everything the client needs to edit lives in this file.
   Photos and videos are the client's own files in /media.
   ========================================================= */
window.SITE = {
  brand: "JourneysByRohit",
  tagline: "Making films with love, for love.",
  // TODO(client): confirm the real contact details
  phone: "+91 00000 00000",
  whatsapp: "910000000000",            // country code + number, digits only
  email: "hello@journeysbyrohit.com",
  instagram: "journeysbyrohit",
  vimeo: "",
  base: "Wedding photographer & filmmaker · India and worldwide",
  formEndpoint: "",                    // optional Formspree-style URL; empty = opens the visitor's email app
  /* Optional Cloudinary delivery (auto format, auto quality, exact widths).
     Leave cloud empty to serve the local files.
     mode "fetch":  Cloudinary pulls the images from siteUrl (no upload needed). Set siteUrl to the live site, e.g. "https://journeysbyrohit.vercel.app".
     mode "upload": upload the /media/img files to a folder in Cloudinary and set folder, e.g. "journeysbyrohit". */
  cloudinary: { cloud: "", mode: "fetch", siteUrl: "", folder: "" },
};

var I = function (n) { return "media/img/" + n + ".jpg"; };
var range = function (prefix, n) { var a = []; for (var i = 1; i <= n; i++) a.push(I(prefix + "-" + (i < 10 ? "0" : "") + i)); return a; };

window.MEDIA = {
  heroVideo: "media/video/hero.mp4",
  heroVideoMobile: "media/video/hero-mobile.mp4",
  heroPoster: I("hero-poster"),
  heroPosterMobile: I("hero-poster"),
  showreel: "media/video/sid-aditi.mp4",
  showreelPoster: I("film-poster"),
  portrait: I("about"),
  /* landscape (3:2) frames for the home slider */
  /* hand-picked order for the home gallery */
  homeGallery: [I("js-02"), I("js-12"), I("js-01"), I("js-06"), I("js-18"), I("js-14"), I("js-19"), I("js-10"), I("js-15"), I("js-08"), I("js-04"), I("js-09"), I("js-13"), I("js-16"), I("js-20"), I("js-21")],
  /* tiles of the opening screen */
  entryTiles: [I("js-04"), I("ra-01"), I("js-12"), I("film-card"), I("js-01"), I("js-09"), I("js-10"), I("js-15"), I("js-19"), I("ra-03"), I("js-20"), I("js-03"), I("js-07"), I("js-02"), I("js-14")],
  heroStart: 4,                 // seconds trimmed from the start of the hero video
  bts: [I("js-13"), I("js-17"), I("ra-02"), I("js-21")],
};

/* cover: image path. gallery: image paths. films: [{title, embed (mp4 or Vimeo/YouTube embed URL), poster}] */
window.PROJECTS = [
  {
    slug: "jaidev-and-shaily", title: "Jaidev & Shaily", cat: "Weddings", location: "Delhi", year: "",
    photo: "Rohit", video: "Rohit", cover: I("js-12"), wide: I("js-04"), card: I("js-04"), focus: "50% 45%",
    gallery: [I("js-12")].concat(range("js", 21).filter(function (s) { return s !== I("js-12"); })),
    story: "A wedding told through glances, laughter and the quiet moments in between. Natural light, real emotion and very little posing.",
    films: [],
  },
  {
    slug: "sid-and-aditi", title: "Sid & Aditi", cat: "Pre-Weddings", location: "", year: "",
    photo: "Rohit", video: "Rohit", cover: I("film-card"), wide: I("film-poster"), card: I("film-card"), focus: "50% 50%",
    gallery: [I("film-card"), I("film-poster")],
    story: "A pre-wedding story shot like a short film: walks through old streets, easy laughter and a couple who stopped noticing the camera.",
    films: [{ title: "Pre-wedding film · 1:43", embed: "media/video/sid-aditi.mp4", poster: I("film-poster") }],
  },
  {
    slug: "the-delhi-evening", title: "The Delhi Evening", cat: "Weddings", location: "Delhi", year: "",
    photo: "Rohit", video: "Rohit", cover: I("js-02"), wide: I("js-02"), card: I("js-02"), focus: "50% 0%",
    gallery: [I("js-02"), I("js-05"), I("js-06"), I("js-08"), I("js-13"), I("js-16"), I("js-17"), I("js-21")],
    story: "The light going gold, the families arriving and a long evening that ended the way the best ones do: late, loud and full of people they love.",
    films: [],
  },
  {
    slug: "golden-hour", title: "Golden Hour", cat: "Weddings", location: "Delhi", year: "",
    photo: "Rohit", video: "Rohit", cover: I("js-14"), wide: I("js-14"), card: I("js-14"), focus: "50% 0%",
    gallery: [I("js-14"), I("js-04"), I("js-02"), I("js-09"), I("js-10"), I("js-11")],
    story: "Ten quiet minutes before sunset, just the two of them, and almost nothing for me to direct.",
    films: [],
  },
  {
    slug: "rohit-and-ambika", title: "Rohit & Ambika", cat: "Engagements", location: "", year: "",
    photo: "Rohit", video: "Rohit", cover: I("ra-01"), wide: I("ra-01"), card: I("ra-01"), focus: "50% 24%",
    gallery: range("ra", 4),
    story: "Ivory lace, a double-breasted suit and an archway they walked through hand in hand.",
    films: [],
  },
];

window.NUMBERS = [
  // TODO(client): replace with real figures
  { n: 150, suffix: "+", label: "Weddings & events" },
  { n: 12, suffix: "", label: "Years behind the lens" },
  { n: 40, suffix: "+", label: "Destinations" },
  { n: 300, suffix: "+", label: "Films delivered" },
];

/* Journal posts (sample articles: replace with Rohit's own writing).
   body blocks: ["p", text] | ["h", heading] | ["q", quote] | ["img", path, caption] */
window.POSTS = [
  {
    slug: "questions-to-ask-your-wedding-photographer", title: "Ten questions to ask before you book a wedding photographer", cat: "Planning Guides",
    date: "2026-09-12", read: 6, cover: I("js-04"),
    excerpt: "Portfolios all look beautiful. These questions tell you what working with someone is actually like.",
    body: [
      ["p", "A great portfolio is the starting point, not the decision. Every photographer shows you their best twenty frames. What you are really booking is how they behave at 7 a.m. when the bride is late, the light is wrong and a relative will not stop directing the group photo."],
      ["h", "Ask to see a full wedding, not a highlight reel"],
      ["p", "Ask for one complete gallery from a wedding similar to yours. You want to see the quiet moments, the bad light, the crowded rooms. Consistency across three hundred frames matters more than the brilliance of twenty."],
      ["h", "Ask who will actually be there"],
      ["p", "Many studios sell one name and send another person. Ask who the lead photographer is, who the second shooter is and whether you can meet them. You will spend more hours with this crew than with some of your guests."],
      ["q", "The best wedding photographers are part psychologist, part logistician and part friend."],
      ["h", "Ask about timelines and backups"],
      ["p", "How soon do you get a preview, a full gallery and a film? What happens if a camera fails or someone falls ill? Professionals have clear answers: dual card slots, backup gear and a replacement shooter on call."],
      ["h", "Ask how they direct, and how they don't"],
      ["p", "Some couples love being guided through poses. Others want to be left alone. Neither is wrong, but your photographer should know which they are good at, and be honest if it is not your style."],
    ],
  },
  {
    slug: "why-we-shoot-weddings-in-natural-light", title: "Why we shoot weddings in natural light, and what we do when there isn't any", cat: "Photography",
    date: "2026-08-20", read: 5, cover: I("js-14"),
    excerpt: "Soft window light, open shade and golden hour: how we plan a day around light.",
    body: [
      ["p", "Light does more for a photograph than any camera. A modest lens in beautiful light will beat an expensive one in a bad room, every time. So before we plan a single portrait, we plan the light."],
      ["h", "Window light is the secret"],
      ["p", "A large window gives soft, flattering light that wraps gently around faces. We use it for getting-ready shots, details and quiet portraits. It is the easiest way to get calm, honest pictures."],
      ["img", I("js-07"), "One window and nothing else."],
      ["h", "When the sun is harsh"],
      ["p", "At noon, the light is hard and unforgiving. We move people into open shade, or use a translucent scrim to soften it. Sometimes the answer is simply to go inside and come back out in an hour."],
      ["h", "When there is no light at all"],
      ["p", "Night receptions and candle-lit ceremonies are beautiful, but they need care. We use fast lenses and keep any extra light low and subtle. The goal is always to keep the room feeling the way you remember it."],
    ],
  },
  {
    slug: "what-makes-a-wedding-film-cinematic", title: "What makes a wedding film feel cinematic", cat: "Filmmaking",
    date: "2026-07-30", read: 7, cover: I("film-poster"),
    excerpt: "It's not slow motion or drone shots. It is sound, patience and a point of view.",
    body: [
      ["p", "The word cinematic gets used for any video with a filter and a piano track. But the films that make people cry at their own anniversary are built differently: with sound, restraint and a clear point of view."],
      ["h", "Sound is half the film"],
      ["p", "Vows, speeches, laughter and the noise of a baraat are what take you back. We record clean audio from the ceremony and build the film around real voices."],
      ["h", "Coverage over gimmicks"],
      ["p", "A drone shot is wonderful when it earns its place. But a well-framed close-up of a father adjusting his sherwani is worth more than ten fly-overs. We shoot long lenses for intimacy and wide lenses for place."],
      ["q", "Cinematic is not a look. It is a feeling of being there."],
      ["h", "Edit for rhythm"],
      ["p", "We cut to the music and to the emotion of the day, not to a template. A highlight film should breathe, with room for stillness between the big moments."],
    ],
  },
  {
    slug: "a-delhi-wedding-in-a-thousand-small-moments", title: "A Delhi wedding in a thousand small moments: Jaidev & Shaily", cat: "Wedding Stories",
    date: "2026-06-18", read: 4, cover: I("js-12"),
    excerpt: "Glances across a crowded room, a hand that won't let go, a laugh that arrives before the vows.",
    body: [
      ["p", "Jaidev and Shaily wanted a wedding that felt like them: warm, a little playful and full of the people they love. We stayed close, stayed quiet and let the day unfold."],
      ["h", "Before the ceremony"],
      ["p", "The morning is where the nerves live. Shaily by a window, Jaidev pacing the corridor, two families finding their rhythm. These are the pictures couples ask for years later."],
      ["img", I("js-03"), "Quiet minutes before the day begins."],
      ["h", "The portraits"],
      ["p", "We walked through the venue looking for plain walls and good light. Little direction, a lot of laughter, and photographs that feel like the two of them."],
      ["h", "What stays with you"],
      ["p", "Not the decor. The way he looked at her when she walked in, and the way she laughed at him a second later."],
    ],
  },
  {
    slug: "a-day-in-the-life-of-a-wedding-crew", title: "A day in the life of a wedding crew", cat: "Behind the Scenes",
    date: "2026-05-27", read: 5, cover: I("about"),
    excerpt: "From a 4 a.m. alarm to the last dance: what really happens on our side of the camera.",
    body: [
      ["p", "People see the finished gallery and film. Few see the 4 a.m. alarm, the cold chai and the bags of gear carried across a courtyard. Here is what a typical wedding day looks like for our crew."],
      ["h", "The morning"],
      ["p", "We arrive before the couple wakes up. Details come first: rings, invitations, outfits, shoes. This is also when we settle into the room, so by the time the family is awake we are part of the furniture."],
      ["h", "The ceremony"],
      ["p", "Each of us has a role. One watches the couple, one the family, one the wide scene, one the reactions. Between us we try to miss nothing."],
      ["q", "The best frames come when nobody remembers we are there."],
      ["h", "The night"],
      ["p", "Dinner, speeches, dancing. The energy drops for no one, and neither do we. We finish with a quick backup of every card on site before a single person goes to bed."],
    ],
  },
  {
    slug: "a-wedding-day-timeline-that-leaves-room-for-portraits", title: "A wedding day timeline that leaves room for portraits", cat: "Planning Guides",
    date: "2026-04-14", read: 5, cover: I("js-02"),
    excerpt: "A few small changes to your schedule will give you calmer mornings and better pictures.",
    body: [
      ["p", "The best wedding photographs are rarely rushed. Yet most timelines squeeze portraits into twenty minutes between the ceremony and dinner. A few small changes will give you more time and more beautiful light."],
      ["h", "Start getting ready earlier than you think"],
      ["p", "Hair and makeup always run long. Build in a forty-minute cushion, and you will enjoy the morning instead of racing through it."],
      ["h", "Schedule portraits for soft light"],
      ["p", "If you can, plan your couple portraits for the hour before sunset, or for a bright, shaded spot. The light is soft and everyone is relaxed. Even twenty unhurried minutes can give you the best photographs of the day."],
      ["img", I("js-05"), "Twenty unhurried minutes."],
      ["h", "Do the family group photos early"],
      ["p", "Keep your family list to ten or twelve groups, and ask one confident relative to help gather people. It will take fifteen minutes instead of an hour."],
    ],
  },
  {
    slug: "black-and-white-when-and-why", title: "Black and white: when we convert, and why", cat: "Photography",
    date: "2026-03-03", read: 4, cover: I("js-16"),
    excerpt: "Colour tells you what a day looked like. Black and white tells you how it felt.",
    body: [
      ["p", "We never turn a photograph black and white because it is trendy. We do it when colour is getting in the way of the emotion."],
      ["h", "When the colour is a distraction"],
      ["p", "Mixed lighting, a neon sign or a clashing outfit can pull the eye away from the real subject. Removing colour puts the focus back on expression, gesture and light."],
      ["h", "When the moment is quiet"],
      ["p", "A held hand, a long look across a room. These feel timeless in monochrome, and they age beautifully."],
      ["q", "Colour is the day. Black and white is the memory of it."],
      ["p", "In every gallery we deliver, you will find a small set of black-and-white frames chosen by hand. Ask us to leave them out and we will, but most couples end up printing them first."],
    ],
  },
];

/* Tabs are built from the data: only categories that have items are shown. */
window.POST_CATS = ["All", "Wedding Stories", "Photography", "Filmmaking", "Planning Guides", "Behind the Scenes"];

/* Recognition shown on the About page.
   TODO(client): SAMPLE entries. Replace with the real awards and features (title, awarding body, year) or delete the list to hide the section. */
window.AWARDS = [
  { title: "Wedding Photographer of the Year", by: "Awarding body", year: "2024" },
  { title: "Best Wedding Film", by: "Awarding body", year: "2023" },
  { title: "Featured Storyteller", by: "Publication", year: "2022" },
];

/* Home: story image, curated "frames" composition, services */
window.MEDIA.story = I("js-02");
window.MEDIA.frames = [
  { src: I("js-14"), cls: "a", alt: "Bride by the window" },
  { src: I("js-09"), cls: "b", alt: "Bride under her veil" },
  { src: I("js-18"), cls: "c", alt: "Bride beside a framed portrait" },
  { src: I("js-08"), cls: "d", alt: "A couple walking hand in hand" },
];
window.SERVICES = [
  { t: "Wedding Photography", d: "Candid coverage of the whole day.", img: I("js-01"), pos: "50% 30%", href: "gallery.html" },
  { t: "Wedding Films", d: "Cinematic films with real sound.", img: I("film-poster"), pos: "30% 50%", href: "work.html" },
  { t: "Pre-Wedding Photography", d: "Relaxed shoots in places you love.", img: I("ra-01"), pos: "50% 30%", href: "work.html" },
  { t: "Pre-Wedding Films", d: "A short film of the two of you.", img: I("film-card"), pos: "50% 40%", href: "project.html?p=sid-and-aditi" },
  { t: "Event Photography", d: "Sangeets, engagements, celebrations.", img: I("js-19"), pos: "50% 40%", href: "gallery.html" },
  { t: "Event Videography", d: "Highlights that keep the energy.", img: I("js-13"), pos: "30% 50%", href: "work.html" },
  { t: "Couple Portraits", d: "Quiet portraits in natural light.", img: I("js-12"), pos: "50% 30%", href: "gallery.html" },
  { t: "Cinematic Films", d: "Story-led films, carefully graded.", img: I("js-06"), pos: "25% 50%", href: "work.html" },
];

/* Home: a small editorial preview of one project */
window.SHOWCASE = {
  slug: "jaidev-and-shaily",
  a: I("js-02"), b: I("js-09"), c: I("js-14"),
  line: "Natural light, plain walls and a couple who forgot the camera.",
};

/* The about photograph is reused as the wide, short image of the home About block and the Contact header */
window.MEDIA.story = I("about");
window.MEDIA.storyPos = "50% 30%";
