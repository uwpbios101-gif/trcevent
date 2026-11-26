// Seoul edition of the Irie Jerk & Juggling page (live 2026-11-25 until 94e5b71).
// One of three editions the landing page rotates through; see -irie-jerk-juggling-page.tsx.
// Navy/coral palette scoped to .ijj-seoul. Flyer = poster-3.png, clip = "jj poster-3 - noaudio.mp4".
// Media are byte-for-byte copies of the supplied files — never re-encode.
import flyerImg from "@/assets/irie-jerk-juggling-flyer.png";
import clipVideo from "@/assets/irie-jerk-juggling-clip.mp4";
import takeoutImg from "@/assets/irie-jerk-juggling-takeout.png";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Irie+Jerk+Bar+and+Grill+1413+W+127th+St+Calumet+Park+IL+60827";


const CSS = `
.ijj-seoul{--navy:#071233;--blue:#163ae4;--coral:#ff665b;--white:#f9faff;--muted:#cad5fb;--line:#6579c4;background:var(--navy);color:var(--white);font:1rem/1.55 system-ui,sans-serif}
.ijj-seoul a{color:inherit;text-underline-offset:.3em}
.ijj-seoul a:focus-visible{outline:3px solid var(--coral);outline-offset:4px}
.ijj-seoul .wrap{width:min(92%,80rem);margin:auto}
.ijj-seoul h1,.ijj-seoul h2,.ijj-seoul h3,.ijj-seoul p,.ijj-seoul figure{margin:0}
.ijj-seoul .stage{overflow:hidden;background:radial-gradient(ellipse at 24% 56%,#193ab2,transparent 65%),linear-gradient(122deg,#071233 56%,#112676 56% 72%,#0d1b4e 72%)}
.ijj-seoul .hero{display:grid;grid-template-columns:minmax(0,1.04fr) minmax(0,.96fr);grid-template-areas:"art copy";align-items:center;gap:clamp(2rem,5vw,5rem);padding:clamp(1.9rem,5vw,5rem) 0}
.ijj-seoul .copy{grid-area:copy}
.ijj-seoul .credit{font-size:.75rem;font-weight:850;letter-spacing:.14em;text-transform:uppercase;color:var(--muted)}
.ijj-seoul h1{font:italic 950 clamp(2.6rem,6vw,6.8rem)/.88 system-ui,sans-serif;letter-spacing:-.085em;text-transform:uppercase;margin:.3em 0}
.ijj-seoul .second{display:block;color:var(--coral)}
.ijj-seoul .intro{font-size:clamp(1.08rem,2vw,1.4rem);max-width:31ch}
.ijj-seoul .admission{display:inline-block;margin:1.25rem 0 .8rem;padding:.42rem .85rem;background:var(--coral);color:#1b1032;clip-path:polygon(4% 0,100% 0,96% 100%,0 100%);font-weight:900;text-transform:uppercase}
.ijj-seoul address{font-style:normal;color:var(--muted)}
.ijj-seoul .cta{display:inline-block;margin-top:1rem;padding:.58rem .9rem;border:1px solid var(--white);font-weight:800;text-decoration:none}
.ijj-seoul .cta:hover{background:var(--white);color:var(--navy)}
.ijj-seoul .art{grid-area:art;position:relative;margin:0 .7rem .7rem 0;isolation:isolate}
.ijj-seoul .art:after{content:"";position:absolute;inset:.7rem -.7rem -.7rem .7rem;background:var(--coral);z-index:-1}
.ijj-seoul .art img,.ijj-seoul .art video{display:block;width:100%;height:auto}
.ijj-seoul .takeout{background:linear-gradient(115deg,#142aa0,#071233 70%);border-block:1px solid var(--line)}
.ijj-seoul .takeout-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);align-items:center;gap:clamp(1.4rem,4vw,3.5rem);padding-block:clamp(2rem,5vw,4.5rem)}
.ijj-seoul .takeout figure{border-bottom:5px solid var(--coral)}
.ijj-seoul .takeout img{display:block;width:100%;height:auto}
.ijj-seoul .takeout h2{text-transform:uppercase;font-size:clamp(2rem,4vw,4.25rem)}
.ijj-seoul .takeout h2 span{display:block;color:var(--coral)}
.ijj-seoul .takeout .offer{margin-top:1rem;font-size:1.25rem;font-weight:850}
.ijj-seoul .takeout p{margin-top:.65rem}
.ijj-seoul .takeout .pickup{color:var(--muted)}
.ijj-seoul .anchor{margin-left:.65rem}
.ijj-seoul .floor{background:var(--blue);border-block:1px solid #8a9dfc}
.ijj-seoul .floor .wrap{display:grid;grid-template-columns:1.15fr .85fr;gap:1.5rem 4rem;align-items:start;padding-block:clamp(2.2rem,5vw,4.5rem)}
.ijj-seoul h2{font:italic 900 clamp(2rem,4.75vw,4.4rem)/.95 system-ui,sans-serif;letter-spacing:-.065em}
.ijj-seoul .floor p{margin-top:.75rem;max-width:57ch}
.ijj-seoul .calendar{padding-block:3.3rem}
.ijj-seoul .dates{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1.2rem}
.ijj-seoul .dates article{padding:1rem 1.2rem;border-top:3px solid var(--coral);background:#111f4b}
.ijj-seoul .dates p{margin-top:.4rem;color:var(--muted)}
.ijj-seoul .clip{padding-block:3.3rem}
.ijj-seoul .clip .art{max-width:56rem;margin-top:1.4rem}
.ijj-seoul .presented{border-top:1px solid var(--line);padding-block:1.1rem;color:var(--muted)}
@media(max-width:760px){.ijj-seoul .takeout-grid{grid-template-columns:1fr}.ijj-seoul .takeout-copy{order:-1}.ijj-seoul .anchor{margin-left:0;margin-right:.65rem}.ijj-seoul .hero{grid-template-columns:1fr;grid-template-areas:"copy" "art"}.ijj-seoul .art{max-width:33rem}.ijj-seoul .floor .wrap,.ijj-seoul .dates{grid-template-columns:1fr}}
`;

export function IrieJerkJugglingSeoul() {
  return (
    <div className="ijj-seoul">
      <style>{CSS}</style>

      <section className="stage" aria-labelledby="seoul-title">
        <div className="wrap hero">
          <div className="copy">
            <p className="credit">Prestige Promotion presents</p>
            <h1 id="seoul-title">
              Irie Jerk <span className="second">&amp; Juggling</span>
            </h1>
            <p className="intro">
              Clock out and meet us on 127th. It’s a Thursday evening dance party with a heavy dose
              of dancehall and hooks the whole room can sing.
            </p>
            <p className="admission">Free admission · Thursdays · 5–9 PM</p>
            <address>
              <strong>Irie Jerk Bar and Grill</strong>
              <br />
              1413 W 127th St, Calumet Park, IL 60827
            </address>
            <a className="cta" href={MAPS_URL} target="_blank" rel="noreferrer">
              Get directions
            </a>{" "}
            <a className="cta anchor" href="#seoul-takeout">
              See the $15 takeout plate
            </a>
          </div>
          <figure className="art">
            <img
              loading="lazy"
              width={1122}
              height={1402}
              src={flyerImg}
              alt="Irie Jerk and Juggling flyer with two people in sculptural streetwear moving through a cobalt and coral light tunnel."
            />
          </figure>
        </div>
      </section>

      <section className="takeout" id="seoul-takeout" aria-labelledby="seoul-takeout-title">
        <div className="wrap takeout-grid">
          <figure>
            <img
              loading="lazy"
              width={1448}
              height={1086}
              src={takeoutImg}
              alt="Two guests leave a cobalt-and-coral dance party with clear-lidded takeout boxes. Jerk chicken and sides are visible in the foreground."
            />
          </figure>
          <div className="takeout-copy">
            <h2 id="seoul-takeout-title">
              Dance now. <span>Take the jerk home.</span>
            </h2>
            <p className="offer">$15 jerk chicken takeout plate</p>
            <p>Jerk leg quarter · Rice and peas · Cabbage</p>
            <p className="pickup">Order when you arrive. Pick it up on your way out.</p>
          </div>
        </div>
      </section>

      <section className="floor" aria-label="What to expect">
        <div className="wrap">
          <div>
            <h2>
              Know the hook?
              <br />
              Take it from here.
            </h2>
            <p>
              The DJ juggles familiar dancehall tunes and riddims until something pulls you onto the
              floor. Then the volume drops and the DJ calls for voices. That’s your cue to sing it
              loud, even if you only know the chorus.
            </p>
          </div>
          <div>
            <h2>Come hungry.</h2>
            <p>
              Order from Irie Jerk’s state-of-the-art Jamaican kitchen and catch up with your people
              over a plate. When your tune comes on, the dance floor is right there. This is
              Jamaican culture on a Thursday in Calumet Park, from the cooking to the way the crowd
              answers the DJ.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap clip" aria-labelledby="seoul-clip-title">
        <h2 id="seoul-clip-title">See the vibe.</h2>
        <figure className="art">
          <video
            controls
            loop
            muted
            playsInline
            preload="none"
            width={1920}
            height={1080}
            data-ijj-clip=""
            aria-label="Animated Irie Jerk and Juggling flyer"
          >
            <source src={clipVideo} type="video/mp4" />
          </video>
        </figure>
      </section>

      <section className="wrap calendar" aria-labelledby="seoul-events">
        <h2 id="seoul-events">Holiday nights at Irie Jerk</h2>
        <div className="dates">
          <article id="seoul-christmas">
            <h3>Christmas Eve Party</h3>
            <p>
              <time dateTime="2026-12-24">Thursday, December 24, 2026</time> · $20
            </p>
          </article>
          <article id="seoul-nye">
            <h3>GQ Meets VOGUE Winter Ball</h3>
            <p>
              <time dateTime="2026-12-31">Thursday, December 31, 2026</time> · $40
            </p>
            <p>Formalwear, red-carpet photography, and a Best Dressed runway. Ring in 2027.</p>
          </article>
        </div>
      </section>

      <div className="presented">
        <div className="wrap">
          Presented by Prestige Promotion · <a href="/events">All events at Irie Jerk</a>
        </div>
      </div>
    </div>
  );
}
