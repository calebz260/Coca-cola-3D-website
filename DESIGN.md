# Design plan — Coca-Cola concept site

Independent concept project. Not affiliated with or endorsed by The Coca-Cola Company.
No official logo, photography or licensed model was supplied, so the site uses no brand
artwork: the wordmark is set in the display face and the bottle is generated in code.

## Subject, audience, job
- Subject: the contour bottle itself, the object people recognise by touch.
- Audience: campaign visitors on any device, mostly arriving on a phone.
- Primary job: let people pick up the bottle (spin it, shake it, chill it, change flavour).

## Tokens
| Name        | Hex       | Role                                                    |
|-------------|-----------|---------------------------------------------------------|
| Signal red  | `#E3101F` | Dominant field: hero, brand moments, active states      |
| Deep red    | `#B80D19` | Pressed and hover states on red                         |
| Cellar      | `#3A0509` | Dark red field: story, contact                          |
| Black       | `#000000` | True black for products, experience and footer         |
| White       | `#FFFFFF` | All type on red and dark fields                         |
| Caramel     | `#6B2A10` | Liquid tone only; never used for UI                     |

Type
- Big Shoulders Display (700/900): condensed, poster-weight, like stencilled crate type.
  Used large and tight; the hero headline sits behind the 3D bottle.
- Hanken Grotesk (400/500/600): body and UI. 18px base, perfect-fourth scale
  (18 / 24 / 32 / 42 / 56 / 75), body line-height 1.55, measure under 65ch.

## Layout
```
HERO (red)                      STORY (cellar)              PRODUCTS (black)
+---------------------------+   +-----------+-----------+   +---------------------------+
| nav                       |   |           | 1886 ...  |   | Pick a bottle             |
| ICE-COLD     [ bottle  ]  |   |  bottle   | 1894 ...  |   |  _A_   _B_   _C_   _D_     |
| SINCE        [ in front]  |   |  (3D)     | 1915 ...  |   | =========shelf=========== |
| 1886         [ of type ]  |   |           | 2005 ...  |   | details  [See it in 3D]   |
| copy  [Explore]           |   +-----------+-----------+   +---------------------------+
+---------------------------+
EXPERIENCE (black, red glow)    BRAND (red)                 CONTACT (cellar) / FOOTER (black)
+-----------+---------------+   +---------------------------+
|  bottle   | flavour       |   | A cold one,               |
|  (3D,     | shake | chill |   | right on time.  (words    |
|   drag)   | hint          |   |  light up on scroll)      |
+-----------+---------------+   +---------------------------+
```
Content is left aligned throughout; only the product shelf is centred, because it is a shelf.

## Principles
1. One bottle, one canvas. A single 3D bottle travels through hero, story and experience.
   That continuity is the signature; everything else stays quiet.
2. Type is set behind the glass. The hero headline sits under the canvas, so the bottle
   physically stands in front of the words.
3. Red is the field, not the accent. Big areas of signal red with white type.
4. Motion only where it means something: one hero entrance, scroll-scrubbed bottle moves,
   story highlights the year you are reading, and responses to the visitor's own actions.

## Review against generic defaults (what changed)
- First draft was a black hero with a red accent glow: that is the "near-black plus one
  bright accent" default. Changed to a full signal-red hero with black used for the
  product and experience rooms.
- First draft had a row of identical rounded product cards. Changed to a shelf of
  bottle silhouettes standing on one rail, which is what a cooler actually looks like.
- Dropped eyebrow labels, ALL-CAPS kickers, arrows on buttons and middle-dot meta lines.
- Numbered markers are used only in the story, where the content is a real timeline.
