# JourneysByRohit: portfolio website

Design: clean and minimal. Cream background, black text, thin uppercase serif titles (Cormorant Garamond) and Inter for small text. Full-screen video hero with only the name and menu; tight, un-cropped photo galleries. No green, no scroll animations. Inspired by namanverma.com and chitreshmishra.com.

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
| Work (category filter) | `work.html`, project detail: `project.html?p=<slug>` |
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

## Photos, videos and Cloudinary

The photos and videos in `media/` are the client's own files (taken from journeysbyrohit.vercel.app): `media/img` (JPG, plus `w600/` and `w1000/` smaller copies used for responsive loading) and `media/video` (`hero.mp4`, `hero-mobile.mp4`, `sid-aditi.mp4`).

To add a new couple, add the photos to `media/img`, then add an entry to `PROJECTS` in `js/data.js`. For the `w600`/`w1000` copies and the `DIMS` file (`js/dims.js`, image sizes) re-run any small script that resizes the images; without them images still work, only slightly slower.

**Cloudinary (optional):** set `SITE.cloudinary.cloud` in `js/data.js`. With `mode: "fetch"` and `siteUrl` set to the live site address, Cloudinary pulls the images automatically (auto format, auto quality, exact widths). With `mode: "upload"`, upload the files from `media/img` to a Cloudinary folder and set `folder`. Leave `cloud` empty to serve the local files.

After changing CSS/JS, bump the `?v=` number in the HTML files so visitors don't see a cached copy.

## Placeholders still to replace

- Phone, WhatsApp, email, Instagram (`SITE`)
- Numbers (150+ weddings and so on) and the About timeline
- Year/location of each story, and the seven sample Journal articles
