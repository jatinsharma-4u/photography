# JourneysByRohit: portfolio website

Static site: plain HTML, CSS and JavaScript. No build step.

## Run it locally

```bash
python -m http.server 5173
```

Then open http://localhost:5173

## Pages

| Page | File |
| --- | --- |
| Home | `index.html` |
| Work (filter + search) | `work.html`, project detail: `project.html?p=<slug>` |
| Gallery (masonry + filter) | `gallery.html` |
| Journal (blog) | `blog.html`, article: `post.html?p=<slug>` |
| About | `about.html` |
| Contact | `contact.html` |

## Where to edit things

Everything editable lives in **`js/data.js`**:

- `SITE`: phone, WhatsApp number (digits only, with country code), email, Instagram handle, optional `formEndpoint` (a Formspree-style URL; if empty the enquiry form opens the visitor's email app).
- `MEDIA`: hero video (desktop + mobile), hero poster, showreel, portrait, strip and behind-the-scenes photos.
- `PROJECTS`: couples/events. Each has `cover`, `gallery` (photos), `films` (mp4 path or Vimeo/YouTube embed URL), location, year, credits and story text. The Gallery page is built automatically from the project galleries.
- `NUMBERS`: the counters on Home and About.
- `POSTS`: Journal articles (`body` blocks: `p`, `h`, `q`, `img`).

## Replace the stock media

The photos and videos currently in `media/` are free-licence stock files from Pexels, used as stand-ins. Replace them with Rohit's own work:

1. Put new files in `media/` and change the paths in `js/data.js`.
2. Photos: export about 1600px wide JPG. For fast loading also add 600px and 1000px copies in `media/img/w600/` and `media/img/w1000/` (same file name). Images without those copies still work, just load slower.
3. Hero video: keep it under about 6 MB (1080p, muted, 10 to 15 seconds, H.264). Add a portrait cut for mobile in `heroVideoMobile`, and a poster image in `heroPoster` / `heroPosterMobile`.
4. After changing CSS/JS, bump the `?v=` number in the HTML files so visitors don't see a cached copy.

## Placeholders still to replace

- Phone, WhatsApp, email, Instagram (`SITE`)
- Numbers (150+ weddings and so on) and the About timeline
- The eight sample couples and their stories, and the seven Journal articles
- The portrait photo (currently a stock photographer)
