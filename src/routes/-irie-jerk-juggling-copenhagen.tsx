// Copenhagen edition of the Irie Jerk & Juggling page ("Copenhagen Food Editorial").
// One of three editions the landing page rotates through; see -irie-jerk-juggling-page.tsx.
// Ported from Thursdays/irie-jerk-and-juggling-copenhagen.html; its paper/purple/clay
// palette is kept verbatim and scoped to .ijj-cph. The $15 takeout section and the
// silent clip are added so every edition carries them. Media are byte-for-byte copies
// of the supplied files — never re-encode:
//   copenhagen-flyer.png = "Thursday Free 5P–9P poster-4.png"
//   table.png            = the table photo embedded in the Copenhagen HTML (no separate file)
//   clip.mp4             = "jj poster-3 - noaudio.mp4" (poster = flyer.png, poster-3)
import cphFlyerImg from "@/assets/irie-jerk-juggling-copenhagen-flyer.png";
import tableImg from "@/assets/irie-jerk-juggling-table.png";
import flyerImg from "@/assets/irie-jerk-juggling-flyer.png";
import clipVideo from "@/assets/irie-jerk-juggling-clip.mp4";
import takeoutImg from "@/assets/irie-jerk-juggling-takeout.png";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Irie+Jerk+Bar+and+Grill+1413+W+127th+St+Calumet+Park+IL+60827";

const CSS = `
.ijj-cph{--paper:#f7e8d4;--ink:#350741;--purple:#693282;--clay:#ae4d35;--line:#a173ab;--wash:#ebd3f0;color:var(--ink);background:var(--paper);font:1rem/1.6 system-ui,sans-serif}
.ijj-cph h1,.ijj-cph h2,.ijj-cph h3,.ijj-cph p,.ijj-cph figure{margin:0}
.ijj-cph a{color:inherit;text-underline-offset:.25em}
.ijj-cph a:focus-visible{outline:3px solid var(--purple);outline-offset:4px}
.ijj-cph .shell{width:min(92%,83rem);margin:auto}
.ijj-cph .eyebrow,.ijj-cph .facts,.ijj-cph time{letter-spacing:.13em;text-transform:uppercase;font-size:.76rem;font-weight:750}
.ijj-cph .hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.06fr);align-items:center;gap:clamp(2rem,6vw,6rem);padding-block:clamp(2rem,6vw,5rem)}
.ijj-cph .eyebrow{color:var(--purple)}
.ijj-cph h1{font-size:clamp(2.3rem,6.3vw,7rem);font-weight:900;line-height:.9;letter-spacing:-.085em;text-transform:uppercase;margin:.22em 0 .35em}
.ijj-cph h1 span{display:block}
.ijj-cph h2{font:italic 500 clamp(2rem,5vw,4.6rem)/1 Georgia,serif;letter-spacing:-.05em}
.ijj-cph .lede{font:clamp(1.25rem,2.3vw,1.75rem)/1.25 Georgia,serif;max-width:31ch}
.ijj-cph .facts{margin-top:1.35rem;padding:.75rem 0;border-block:1px solid var(--line);display:flex;flex-wrap:wrap;gap:.4rem 1rem}
.ijj-cph .facts strong{color:var(--purple)}
.ijj-cph address{font-style:normal;margin-top:1rem}
.ijj-cph .directions{display:inline-block;margin-top:1rem;background:var(--ink);color:#fff6ea;padding:.65rem 1.1rem;font-weight:750;text-decoration:none}
.ijj-cph .table-link{display:inline-block;margin:1rem 0 0 .6rem;font-weight:750}
.ijj-cph .art{position:relative;isolation:isolate;margin-right:.65rem;margin-bottom:.65rem}
.ijj-cph .art:after{content:"";position:absolute;inset:.65rem -.65rem -.65rem .65rem;background:#c5a0d5;z-index:-1}
.ijj-cph .art img,.ijj-cph .art video{display:block;width:100%;height:auto}
.ijj-cph .handoff{background:#edd6be;border-block:1px solid var(--line)}
.ijj-cph .takeout{background:var(--paper);border-bottom:1px solid var(--line)}
.ijj-cph .handoff-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);align-items:center;gap:clamp(1.5rem,5vw,4rem);padding-block:clamp(2rem,5vw,4.5rem)}
.ijj-cph .handoff-grid img{width:100%;height:auto;display:block;border-bottom:5px solid var(--purple)}
.ijj-cph .handoff-grid h2{font-style:normal;font-weight:900;text-transform:uppercase}
.ijj-cph .handoff-grid h2 span{display:block;color:var(--purple)}
.ijj-cph .handoff-grid p{margin-top:1rem;max-width:40ch}
.ijj-cph .story{background:var(--wash);border-bottom:1px solid var(--line)}
.ijj-cph .story .shell{padding-block:clamp(2.5rem,6vw,5rem);display:grid;grid-template-columns:1fr 1fr;gap:2rem 5rem}
.ijj-cph .story p{margin-top:1rem;max-width:48ch}
.ijj-cph .clip{padding-block:3.5rem}
.ijj-cph .clip .art{max-width:26rem;margin-top:1.4rem}
.ijj-cph .programme{padding-block:3.5rem;border-top:1px solid var(--line)}
.ijj-cph .editions{margin-top:1.5rem}
.ijj-cph .edition{display:grid;grid-template-columns:minmax(10rem,1fr) 2fr;gap:.4rem 2rem;padding:1rem 0;border-top:1px solid var(--line)}
.ijj-cph .edition h3{font-size:1.1rem}
.ijj-cph .edition div p{margin-top:.2rem}
.ijj-cph .edition:last-child{border-bottom:1px solid var(--line)}
.ijj-cph .presented{background:var(--ink);color:var(--paper);padding:1rem 0}
.ijj-cph .clay{height:.35rem;background:var(--clay)}
@media(max-width:760px){.ijj-cph .hero,.ijj-cph .story .shell,.ijj-cph .handoff-grid{grid-template-columns:1fr}.ijj-cph .art{max-width:34rem;margin-inline:auto}.ijj-cph .edition{grid-template-columns:1fr}.ijj-cph .hero{gap:1.8rem}.ijj-cph .handoff-copy{order:-1}.ijj-cph .table-link{margin-left:0;margin-right:.6rem}}
`;

export function IrieJerkJugglingCopenhagen() {
  return (
    <div className="ijj-cph">
      <style>{CSS}</style>

      <section className="hero shell" aria-labelledby="cph-title">
        <div>
          <p className="eyebrow">Prestige Promotion presents</p>
          <h1 id="cph-title">
            Irie Jerk <span>&amp; Juggling</span>
          </h1>
          <p className="lede">
            Start with something hot from the Jamaican kitchen. Stay for the tunes you know by heart.
          </p>
          <p className="facts">
            <span>Thursdays · 5–9 PM</span>
            <strong>Free admission</strong>
          </p>
          <address>
            <strong>Irie Jerk Bar and Grill</strong>
            <br />
            1413 W 127th St, Calumet Park, IL 60827
          </address>
          <a className="directions" href={MAPS_URL} target="_blank" rel="noreferrer">
            Get directions
          </a>{" "}
          <a className="table-link" href="#cph-table">
            From the table to the dance floor
          </a>
        </div>
        <figure className="art">
          <img
            loading="lazy"
            width={1122}
            height={1402}
            src={cphFlyerImg}
            alt="Irie Jerk and Juggling flyer with charred scallion, lime and thyme suspended above a ceramic plate, in lavender and warm clay."
          />
        </figure>
      </section>

      <section className="handoff" id="cph-table" aria-labelledby="cph-table-title">
        <div className="shell handoff-grid">
          <figure>
            <img
              loading="lazy"
              width={1448}
              height={1086}
              src={tableImg}
              alt="Friends pass a ceramic plate of jerk chicken while a guest dances beside her chair in a warmly lit restaurant."
            />
          </figure>
          <div className="handoff-copy">
            <h2 id="cph-table-title">
              Pass the jerk. <span>Catch the riddim.</span>
            </h2>
            <p className="lede">Grab a plate. Pull up a chair. Get up when your tune comes on.</p>
            <p>
              Meet your people over a charred jerk chicken leg quarter from Irie Jerk’s Jamaican
              kitchen. One minute you’re passing the plate across the table. The next, somebody’s
              pushed back their chair because the DJ just played their tune.
            </p>
            <p>
              <strong>Free entry · Thursdays, 5–9 PM</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="takeout" id="cph-takeout" aria-labelledby="cph-takeout-title">
        <div className="shell handoff-grid">
          <figure>
            <img
              loading="lazy"
              width={1448}
              height={1086}
              src={takeoutImg}
              alt="Two guests leave a dance party with clear-lidded takeout boxes. Jerk chicken and sides are visible in the foreground."
            />
          </figure>
          <div className="handoff-copy">
            <h2 id="cph-takeout-title">
              Dance now. <span>Take the jerk home.</span>
            </h2>
            <p className="lede">$15 jerk chicken takeout plate</p>
            <p>Jerk leg quarter · Rice and peas · Cabbage</p>
            <p>Order when you arrive. Pick it up on your way out.</p>
          </div>
        </div>
      </section>

      <section className="story" aria-label="The Thursday experience">
        <div className="shell">
          <div>
            <h2>The kitchen gets first word.</h2>
            <p>
              Come hungry. Irie Jerk’s state-of-the-art Jamaican kitchen is part of the Thursday
              night out on 127th Street. Pull up a chair, bring a friend, and order something you’ll
              still be talking about when you get home.
            </p>
          </div>
          <div>
            <h2>The chorus belongs to the room.</h2>
            <p>
              This is an evening dance party with a heavy dose of dancehall. Catch a riddim you know,
              get up for the next tune, and when the DJ turns it down and calls for voices, sing the
              hook right back. Jamaican cooking and sound-system culture share the room.
            </p>
          </div>
        </div>
      </section>

      <section className="shell clip" aria-labelledby="cph-clip-title">
        <h2 id="cph-clip-title">See the vibe.</h2>
        <figure className="art">
          <video
            controls
            loop
            muted
            playsInline
            preload="none"
            poster={flyerImg}
            aria-label="Animated Irie Jerk and Juggling flyer"
          >
            <source src={clipVideo} type="video/mp4" />
          </video>
        </figure>
      </section>

      <section className="programme shell" aria-labelledby="cph-events">
        <h2 id="cph-events">Holiday nights at Irie Jerk</h2>
        <div className="editions">
          <article className="edition">
            <p>
              <time dateTime="2026-12-24">Thursday, December 24, 2026</time> · $20
            </p>
            <div>
              <h3>Christmas Eve Party</h3>
              <p>A holiday edition at Irie Jerk Bar and Grill.</p>
            </div>
          </article>
          <article className="edition">
            <p>
              <time dateTime="2026-12-31">Thursday, December 31, 2026</time> · $40
            </p>
            <div>
              <h3>GQ Meets VOGUE Winter Ball</h3>
              <p>Formalwear, red-carpet photography, and a Best Dressed runway. Ring in 2027.</p>
            </div>
          </article>
        </div>
      </section>

      <div className="clay" />
      <div className="presented">
        <div className="shell">
          Presented by Prestige Promotion · <a href="/events">All events at Irie Jerk</a>
        </div>
      </div>
    </div>
  );
}
