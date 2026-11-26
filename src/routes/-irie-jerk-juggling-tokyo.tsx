// Tokyo edition of the Irie Jerk & Juggling page (was live 2026-11-25, deploy 41d647d).
// One of three editions the landing page rotates through (Tokyo,
// Copenhagen, Seoul); see -irie-jerk-juggling-page.tsx.
// The "-" prefix excludes this file from route generation.
//
// Layout and copy are ported from the "Tokyo Edition" design (Thursdays/irie-jerk-and-juggling-tokyo.html);
// its ice-blue palette is kept verbatim and scoped to .ijj-tokyo so it doesn't leak into
// the site's black + gold tokens. The $15 takeout section and the silent clip are
// kept from the earlier Seoul port. All media are byte-for-byte copies of the
// supplied files — never re-encode:
//   tokyo-flyer.png = "Every Thursday_ Free 5P–9P-1.png"
//   chorus.png      = "Chrome Tonearm Dancehall Chorus.png"
//   clip.mp4        = "jj_Free 5P–9P-1 - noaudio.mp4" (tokyo-clip.mp4)
//   takeout.png     = supplied takeout photo
import tokyoFlyerImg from "@/assets/irie-jerk-juggling-tokyo-flyer.png";
import chorusImg from "@/assets/irie-jerk-juggling-chorus.png";
import clipVideo from "@/assets/irie-jerk-juggling-tokyo-clip.mp4";
import takeoutImg from "@/assets/irie-jerk-juggling-takeout.png";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Irie+Jerk+Bar+and+Grill+1413+W+127th+St+Calumet+Park+IL+60827";

const CSS = `
.ijj-tokyo{--ink:#05090d;--ice:#8ce3ff;--white:#f0f7fc;--muted:#b8ccd8;--line:#315162;background:var(--ink);color:var(--white);font:1rem/1.6 system-ui,sans-serif}
.ijj-tokyo a{color:var(--ice)}
.ijj-tokyo a:focus-visible{outline:2px solid var(--ice);outline-offset:4px}
.ijj-tokyo .wrap{width:min(92%,76rem);margin:auto}
.ijj-tokyo h1,.ijj-tokyo h2,.ijj-tokyo h3,.ijj-tokyo p,.ijj-tokyo figure{margin:0}
.ijj-tokyo .label{font-family:ui-monospace,monospace;letter-spacing:.15em;text-transform:uppercase;color:var(--ice);font-size:.8rem}
.ijj-tokyo .hero{overflow:hidden;background:radial-gradient(ellipse at 70% 50%,#14374b 0%,#070e15 54%,var(--ink) 78%)}
.ijj-tokyo .deck{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:clamp(1.5rem,4vw,5rem);align-items:center;padding-block:clamp(2rem,6vw,5.5rem)}
.ijj-tokyo h1{font:900 clamp(2.55rem,6vw,6.2rem)/.93 system-ui,sans-serif;letter-spacing:-.075em;text-transform:uppercase;margin:.22em 0 .28em}
.ijj-tokyo h1 span{display:block;color:var(--ice)}
.ijj-tokyo h2{font-size:clamp(1.8rem,4vw,3.3rem);line-height:1.04;letter-spacing:-.045em}
.ijj-tokyo h3{line-height:1.2}
.ijj-tokyo .intro{font-size:clamp(1.1rem,2vw,1.36rem);max-width:38ch}
.ijj-tokyo .schedule{display:flex;flex-wrap:wrap;gap:.4rem 1rem;margin:1.35rem 0 .75rem;font-weight:800}
.ijj-tokyo .schedule strong{color:var(--ice)}
.ijj-tokyo address{font-style:normal;color:var(--muted)}
.ijj-tokyo .button{display:inline-block;margin-top:1.25rem;padding:.65rem 1rem;background:var(--ice);color:#03141c;font-weight:800;text-decoration:none}
.ijj-tokyo .button.secondary{margin-left:.45rem;background:transparent;color:var(--ice);border:1px solid var(--ice)}
.ijj-tokyo .poster{position:relative}
.ijj-tokyo .poster:before{content:"";position:absolute;inset:-1.3rem;border:1px solid #416a80;pointer-events:none}
.ijj-tokyo .poster img{display:block;width:100%;height:auto;border:1px solid #638499;box-shadow:0 0 50px #45c5ff44}
.ijj-tokyo .chorus{border-block:1px solid var(--line);background:linear-gradient(120deg,#08131c,#102c3c)}
.ijj-tokyo .split{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);align-items:center;gap:clamp(1.4rem,4vw,3rem);padding-block:clamp(2rem,5vw,4rem)}
.ijj-tokyo .split figure{border-bottom:4px solid var(--ice)}
.ijj-tokyo .split img{width:100%;height:auto;display:block}
.ijj-tokyo .split h2{text-transform:uppercase;font-weight:900}
.ijj-tokyo .split h2 span{display:block;color:var(--ice)}
.ijj-tokyo .split p{margin-top:.8rem;color:var(--muted)}
.ijj-tokyo .split .hook{color:var(--white);font-size:1.2rem;font-weight:800}
.ijj-tokyo .takeout{border-bottom:1px solid var(--line);background:linear-gradient(240deg,#08131c,#0d2533)}
.ijj-tokyo .tracks{border-bottom:1px solid var(--line);background:repeating-linear-gradient(0deg,#091118 0 5px,#0b141b 6px 7px)}
.ijj-tokyo .tracks .wrap{display:grid;grid-template-columns:1fr 1fr;gap:2rem 4rem;padding-block:3.4rem}
.ijj-tokyo .tracks p{color:var(--muted);margin-top:.8rem;max-width:55ch}
.ijj-tokyo .clip{padding-block:3.5rem}
.ijj-tokyo .clip figure{max-width:56rem;margin-top:1.4rem;border:1px solid #638499;box-shadow:0 0 50px #45c5ff44}
.ijj-tokyo .clip video{display:block;width:100%;height:auto}
.ijj-tokyo .programme{padding-block:3.5rem;border-top:1px solid var(--line)}
.ijj-tokyo .editions{margin-top:1.4rem;display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:var(--line);border:1px solid var(--line)}
.ijj-tokyo article{padding:1.35rem;background:#0b151d;scroll-margin-top:1rem}
.ijj-tokyo article h3{margin-top:.35rem}
.ijj-tokyo article p:not(.label){color:var(--muted);margin-top:.5rem}
.ijj-tokyo .presented{border-top:1px solid var(--line);padding-block:1.25rem;color:var(--muted)}
@media(max-width:700px){.ijj-tokyo .deck,.ijj-tokyo .split,.ijj-tokyo .tracks .wrap,.ijj-tokyo .editions{grid-template-columns:1fr}.ijj-tokyo .poster{width:min(90%,26rem);margin:1rem auto}.ijj-tokyo .deck{gap:1.5rem}.ijj-tokyo .split-copy{order:-1}.ijj-tokyo .button.secondary{margin-left:0}}
`;

export function IrieJerkJugglingTokyo() {
  return (
    <div className="ijj-tokyo">
      <style>{CSS}</style>

      <section className="hero" aria-labelledby="tokyo-title">
        <div className="wrap deck">
          <div>
            <p className="label">Prestige Promotion presents</p>
            <h1 id="tokyo-title">
              Irie Jerk <span>&amp; Juggling</span>
            </h1>
            <p className="intro">
              A Thursday evening dance party built around Jamaican food and the dancehall tunes you
              already know by heart.
            </p>
            <p className="schedule">
              <span>Thursdays · 5–9 PM</span>
              <strong>Free admission</strong>
            </p>
            <address>
              <strong>Irie Jerk Bar and Grill</strong>
              <br />
              1413 W 127th St, Calumet Park, IL 60827
            </address>
            <a className="button" href={MAPS_URL} target="_blank" rel="noreferrer">
              Get directions
            </a>{" "}
            <a className="button secondary" href="#tokyo-singalong">
              Get into the singalong
            </a>
          </div>
          <figure className="poster">
            <img
              loading="lazy"
              width={1122}
              height={1402}
              src={tokyoFlyerImg}
              alt="Irie Jerk & Juggling flyer with a chrome tonearm and translucent record under ice-blue light."
            />
          </figure>
        </div>
      </section>

      <section className="chorus" id="tokyo-singalong" aria-labelledby="tokyo-chorus-title">
        <div className="wrap split">
          <figure>
            <img
              loading="lazy"
              width={1448}
              height={1086}
              src={chorusImg}
              alt="At a chrome DJ booth, a hand pulls down the fader while two friends and the crowd sing along beyond the turntable."
            />
          </figure>
          <div className="split-copy">
            <h2 id="tokyo-chorus-title">
              The DJ cuts it. <span>You finish it.</span>
            </h2>
            <p className="hook">Dancehall you know by heart.</p>
            <p>
              You hear the first bars and turn to your friends. The DJ drops the volume right on the
              hook. For a few bars, the whole room is louder than the speakers.
            </p>
            <p>
              <strong>Free entry · Thursdays, 5–9 PM</strong>
            </p>
          </div>
        </div>
      </section>

      <section className="takeout" id="tokyo-takeout" aria-labelledby="tokyo-takeout-title">
        <div className="wrap split">
          <figure>
            <img
              loading="lazy"
              width={1448}
              height={1086}
              src={takeoutImg}
              alt="Two guests leave a dance party with clear-lidded takeout boxes. Jerk chicken and sides are visible in the foreground."
            />
          </figure>
          <div className="split-copy">
            <h2 id="tokyo-takeout-title">
              Dance now. <span>Take the jerk home.</span>
            </h2>
            <p className="hook">$15 jerk chicken takeout plate</p>
            <p>Jerk leg quarter · Rice and peas · Cabbage</p>
            <p>Order when you arrive. Pick it up on your way out.</p>
          </div>
        </div>
      </section>

      <section className="tracks" aria-label="What to expect">
        <div className="wrap">
          <div>
            <h2>Catch a dance after work.</h2>
            <p>
              Meet your people on 127th Street and get on the floor when your tune comes on. The set
              is heavy on dancehall, with familiar hooks you can jump into even if you only know the
              chorus.
            </p>
          </div>
          <div>
            <h2>Jamaica from the kitchen to the dance floor.</h2>
            <p>
              Start with a plate from Irie Jerk’s state-of-the-art Jamaican kitchen. Then get up when
              your tune comes on. The cooking, the DJ’s juggling, and the crowd singing back bring
              Jamaican culture to life right here on 127th Street.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap clip" aria-labelledby="tokyo-clip-title">
        <h2 id="tokyo-clip-title">See the vibe.</h2>
        <figure>
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

      <section className="wrap programme" aria-labelledby="tokyo-events">
        <h2 id="tokyo-events">Holiday nights at Irie Jerk</h2>
        <div className="editions">
          <article id="tokyo-christmas">
            <p className="label">
              <time dateTime="2026-12-24">Thursday, December 24, 2026</time> · $20
            </p>
            <h3>Christmas Eve Party</h3>
            <p>A holiday edition at Irie Jerk Bar and Grill.</p>
          </article>
          <article id="tokyo-nye">
            <p className="label">
              <time dateTime="2026-12-31">Thursday, December 31, 2026</time> · $40
            </p>
            <h3>GQ Meets VOGUE Winter Ball</h3>
            <p>
              Formalwear, red-carpet photography, and a Best Dressed runway. Ring in 2027 at Irie
              Jerk.
            </p>
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
