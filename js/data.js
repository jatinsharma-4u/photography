/* =========================================================
   JourneysByRohit — site content & media config
   Everything the client needs to edit lives in this file.
   Media: stock photos/videos from Pexels (free licence) are used
   as stand-ins. Replace the paths with Rohit's own work in /media.
   An empty media field ("") renders a neutral placeholder frame.
   ========================================================= */
window.SITE = {
  brand: "JourneysByRohit",
  tagline: "Wedding photography & films, told like a story.",
  // TODO(client): replace with real details
  phone: "+91 00000 00000",
  whatsapp: "910000000000",            // country code + number, digits only
  email: "hello@journeysbyrohit.com",
  instagram: "journeysbyrohit",
  vimeo: "",
  base: "Based in India · Travelling worldwide",
  formEndpoint: "",                    // optional Formspree-style URL; empty = opens email app
};

var I = function (id) { return "media/img/p" + id + ".jpg"; };

window.MEDIA = {
  heroVideo: "media/video/hero-sd.mp4",
  heroVideoMobile: "media/video/hero-mobile.mp4",
  heroPoster: "media/img/hero-poster.jpg",
  heroPosterMobile: "media/img/hero-poster-m.jpg",
  showreel: "media/video/reel.mp4",
  showreelPoster: "",
  portrait: I(7872628),
  strip: [I(30138422), I(15536066), I(18220881), I(17794569), I(30739866), I(5804239), I(37151132)],
  bts: [I(17057198), I(3990404), I(16197836), I(38765470)],
  aboutHero: I(32060316),
};

/* cover: image path. gallery: image paths. films: [{title, embed (mp4 or Vimeo/YouTube embed URL), poster}] */
window.PROJECTS = [
  {
    slug: "aanya-and-kabir", title: "Aanya & Kabir", cat: "Weddings", location: "Udaipur, Rajasthan", year: "2025",
    photo: "Rohit", video: "Rohit & team", cover: I(18322558),
    gallery: [I(18322558), I(18322549), I(18220881), I(15536066), I(15291907), I(13434418), I(14856471), I(30138422)],
    story: "Three days on the water, a palace courtyard lit entirely by candles, and a baraat that took over the old city. We stayed close to the quiet in-betweens: a mother adjusting a veil, a father wiping his eyes behind his sunglasses.",
    films: [{ title: "The Wedding Film", embed: "media/video/film1.mp4" }, { title: "Highlights · 90 sec", embed: "media/video/film3.mp4" }],
  },
  {
    slug: "meera-and-arjun", title: "Meera & Arjun", cat: "Pre-Weddings", location: "Spiti Valley", year: "2025",
    photo: "Rohit", video: "Rohit", cover: I(37439314),
    gallery: [I(37439314), I(27529922), I(30453001), I(17794569), I(37298841), I(37151132), I(32705154)],
    story: "A pre-wedding shot at 4,000 metres: thin air, a huge sky and two people who laughed through every take. We let the landscape do the talking and kept the direction light.",
    films: [{ title: "Pre-Wedding Film", embed: "media/video/film2.mp4" }],
  },
  {
    slug: "rhea-and-dev", title: "Rhea & Dev", cat: "Wedding Films", location: "Goa", year: "2024",
    photo: "Rohit", video: "Rohit & team", cover: I(30273657),
    gallery: [I(30273657), I(30138422), I(32113397), I(27912963), I(30739866), I(11320033), I(10476122)],
    story: "A beachside ceremony at golden hour, vows written by the couple and read over the film. Built around sound: waves, laughter and a speech that had the whole room in tears.",
    films: [{ title: "Feature Film", embed: "media/video/film2.mp4" }, { title: "Vows Teaser", embed: "media/video/film1.mp4" }],
  },
  {
    slug: "ishita-and-vihaan", title: "Ishita & Vihaan", cat: "Weddings", location: "Jaipur, Rajasthan", year: "2024",
    photo: "Rohit", video: "Rohit & team", cover: I(34955448),
    gallery: [I(34955448), I(32060316), I(6679832), I(5804238), I(5804239), I(5824565), I(14856471)],
    story: "Marigolds, brass bands and four generations under one roof. A wedding that felt like a festival, and a family that never stopped dancing.",
    films: [{ title: "The Wedding Film", embed: "media/video/film3.mp4" }],
  },
  {
    slug: "the-sundowner-gala", title: "The Sundowner Gala", cat: "Events", location: "Mumbai", year: "2024",
    photo: "Rohit", video: "Rohit", cover: I(13434418),
    gallery: [I(13434418), I(14856471), I(10476122), I(15601692), I(15291907), I(18220881)],
    story: "A private celebration for 300 guests on a rooftop above the city. Candid, fast and elegant: coverage that lets the host enjoy the night.",
    films: [{ title: "Event Recap", embed: "media/video/film1.mp4" }],
  },
  {
    slug: "naina-and-samar", title: "Naina & Samar", cat: "Weddings", location: "Jim Corbett", year: "2023",
    photo: "Rohit", video: "Rohit & team", cover: I(37298841),
    gallery: [I(37298841), I(37151132), I(15536066), I(32705154), I(5804238), I(6679832)],
    story: "An intimate forest wedding with forty guests, long tables and no schedule. We photographed it the way it felt: slow, warm and unhurried.",
    films: [{ title: "The Wedding Film", embed: "media/video/film3.mp4" }],
  },
  {
    slug: "tara-and-zayan", title: "Tara & Zayan", cat: "Pre-Weddings", location: "Lisbon, Portugal", year: "2023",
    photo: "Rohit", video: "Rohit", cover: I(27529922),
    gallery: [I(27529922), I(37439314), I(30453001), I(17794569), I(27912963), I(30273657)],
    story: "Tiled streets, tram rides and espresso on a windy terrace. A pre-wedding story shot like a short travel film.",
    films: [{ title: "Pre-Wedding Film", embed: "media/video/film2.mp4" }],
  },
  {
    slug: "kavya-and-aarav", title: "Kavya & Aarav", cat: "Wedding Films", location: "Kerala", year: "2023",
    photo: "Rohit", video: "Rohit & team", cover: I(32060316),
    gallery: [I(32060316), I(34955448), I(5804239), I(5824565), I(32113397), I(11320033)],
    story: "A backwater ceremony at sunrise, a film built on soft light, slow motion and the sound of temple bells.",
    films: [{ title: "Feature Film", embed: "media/video/film1.mp4" }],
  },
];

window.CATEGORIES = ["All", "Weddings", "Pre-Weddings", "Wedding Films", "Events"];

window.NUMBERS = [
  // TODO(client): replace with real figures
  { n: 150, suffix: "+", label: "Weddings & events" },
  { n: 12, suffix: "", label: "Years behind the lens" },
  { n: 40, suffix: "+", label: "Destinations" },
  { n: 300, suffix: "+", label: "Films delivered" },
];

/* Journal posts. body blocks: ["p", text] | ["h", heading] | ["q", quote] | ["img", path, caption] */
window.POSTS = [
  {
    slug: "questions-to-ask-your-wedding-photographer", title: "Ten questions to ask before you book a wedding photographer", cat: "Planning Guides",
    date: "2026-09-12", read: 6, cover: I(17057198),
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
    date: "2026-08-20", read: 5, cover: I(27912963),
    excerpt: "Soft window light, open shade and golden hour: how we plan a day around light.",
    body: [
      ["p", "Light does more for a photograph than any camera. A modest lens in beautiful light will beat an expensive one in a bad room, every time. So before we plan a single portrait, we plan the light."],
      ["h", "Window light is the secret"],
      ["p", "A large north-facing window gives soft, flattering light that wraps gently around faces. We use it for getting-ready shots, rings, details and quiet portraits. It is the easiest way to get calm, honest pictures."],
      ["img", I(32113397), "Veil light: a single window and nothing else."],
      ["h", "When the sun is harsh"],
      ["p", "At noon, the light is hard and unforgiving. We move people into open shade, or use a translucent scrim to soften it. Sometimes the answer is simply to go inside and come back out in an hour."],
      ["h", "When there is no light at all"],
      ["p", "Night receptions and candle-lit ceremonies are beautiful, but they need care. We use fast lenses, warm off-camera light kept low and subtle, and we protect the mood. The goal is always to keep the room feeling the way you remember it."],
    ],
  },
  {
    slug: "what-makes-a-wedding-film-cinematic", title: "What makes a wedding film feel cinematic", cat: "Filmmaking",
    date: "2026-07-30", read: 7, cover: I(3990404),
    excerpt: "It's not slow motion or drone shots. It is sound, patience and a point of view.",
    body: [
      ["p", "The word cinematic gets used for any video with a filter and a piano track. But the films that make people cry at their own wedding anniversary are built differently: with sound, restraint and a clear point of view."],
      ["h", "Sound is half the film"],
      ["p", "Vows, speeches, laughter and the noise of a baraat are what take you back. We record clean audio from the ceremony, from lapel mics on the groom and the officiant, and build the film around real voices."],
      ["h", "Coverage over gimmicks"],
      ["p", "A drone shot is wonderful when it earns its place. But a well-framed close-up of a father adjusting his sherwani is worth more than ten fly-overs. We shoot long lenses for intimacy and wide lenses for place."],
      ["q", "Cinematic is not a look. It is a feeling of being there."],
      ["h", "Edit for rhythm"],
      ["p", "We cut to the music and to the emotion of the day, not to a template. A highlight film should breathe, with room for stillness between the big moments."],
    ],
  },
  {
    slug: "three-days-in-udaipur", title: "Three days in Udaipur: Aanya & Kabir", cat: "Wedding Stories",
    date: "2026-06-18", read: 4, cover: I(18220881),
    excerpt: "A lake palace, a candle-lit courtyard and a baraat that took over the old city.",
    body: [
      ["p", "Aanya and Kabir met in college and spent six years planning a wedding that would feel like a long dinner with everyone they love. Udaipur gave them a stage: a lake, a palace and a sky that changed colour every hour."],
      ["h", "Day one: the sangeet"],
      ["p", "Four hundred guests, one courtyard and a choreography the cousins had rehearsed for two months. We kept the lights low and the cameras close, and let the family steal the show."],
      ["img", I(18322558), "Evening ceremony, lit entirely by candles."],
      ["h", "Day two: the ceremony"],
      ["p", "The ceremony took place at dusk. Candles lined the aisle and the lake turned gold. Aanya's father read a letter he had written for her, and not one person kept dry eyes."],
      ["h", "Day three: the farewell"],
      ["p", "A long breakfast, a slow boat ride and a lot of goodbyes. Those are often the pictures couples love the most: the quiet ones taken when the party is over."],
    ],
  },
  {
    slug: "a-day-in-the-life-of-a-wedding-crew", title: "A day in the life of a wedding crew", cat: "Behind the Scenes",
    date: "2026-05-27", read: 5, cover: I(38765470),
    excerpt: "From a 4 a.m. alarm to the last dance: what really happens on our side of the camera.",
    body: [
      ["p", "People see the finished gallery and film. Few see the 4 a.m. alarm, the cold chai and the three bags of gear carried across a palace courtyard. Here is what a typical wedding day looks like for our crew."],
      ["h", "The morning"],
      ["p", "We arrive before the couple wakes up. Details come first: rings, invitations, outfits, shoes. This is also when we settle the room, so by the time the family is awake we are part of the furniture."],
      ["h", "The ceremony"],
      ["p", "Two photographers and two filmmakers, each with a role. One watches the couple, one the family, one the wide scene, one the reactions. Between us we try to miss nothing."],
      ["q", "The best frames come when nobody remembers we are there."],
      ["h", "The night"],
      ["p", "Dinner, speeches, dancing. The energy drops for no one, and neither do we. We finish with a quick backup of every card on site before a single person goes to bed."],
    ],
  },
  {
    slug: "a-wedding-day-timeline-that-leaves-room-for-portraits", title: "A wedding day timeline that leaves room for portraits", cat: "Planning Guides",
    date: "2026-04-14", read: 5, cover: I(5804238),
    excerpt: "A few small changes to your schedule will give you calmer mornings and better pictures.",
    body: [
      ["p", "The best wedding photographs are rarely rushed. Yet most timelines squeeze portraits into twenty minutes between the ceremony and dinner. A few small changes will give you more time and more beautiful light."],
      ["h", "Start getting ready earlier than you think"],
      ["p", "Hair and makeup always run long. Build in a forty-minute cushion, and you will enjoy the morning instead of racing through it."],
      ["h", "Schedule portraits for golden hour"],
      ["p", "If you can, plan your couple portraits for the hour before sunset. The light is soft and warm, and everyone is relaxed after the ceremony. Even twenty unhurried minutes can give you the best photographs of the day."],
      ["img", I(30453001), "Twenty unhurried minutes at sunset."],
      ["h", "Do the family group photos early"],
      ["p", "Keep your family list to ten or twelve groups, and ask one confident relative to help gather people. It will take fifteen minutes instead of an hour."],
    ],
  },
  {
    slug: "black-and-white-when-and-why", title: "Black and white: when we convert, and why", cat: "Photography",
    date: "2026-03-03", read: 4, cover: I(10476122),
    excerpt: "Colour tells you what a day looked like. Black and white tells you how it felt.",
    body: [
      ["p", "We never turn a photograph black and white because it is trendy. We do it when colour is getting in the way of the emotion."],
      ["h", "When the colour is a distraction"],
      ["p", "Mixed lighting, a neon sign or a clashing outfit can pull the eye away from the real subject. Removing colour puts the focus back on expression, gesture and light."],
      ["h", "When the moment is quiet"],
      ["p", "A held hand, a toast, a long look across a room. These feel timeless in monochrome, and they age beautifully."],
      ["q", "Colour is the day. Black and white is the memory of it."],
      ["p", "In every gallery we deliver, you will find a small set of black-and-white frames chosen by hand. Ask us to leave them out and we will, but most couples end up printing them first."],
    ],
  },
];

window.POST_CATS = ["All", "Wedding Stories", "Photography", "Filmmaking", "Planning Guides", "Behind the Scenes"];
