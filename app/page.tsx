import Link from "next/link";
import { ArrowRight, PanelsTopLeft } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="home-shell">
      <section className="home-panel">
        <div className="brand-row">
          <Image src="/omnicue-logo.svg" alt="" width={40} height={40} priority />
          <div>
            <p className="eyebrow">Google Meet add-on</p>
            <h1>OmniCue</h1>
          </div>
        </div>
        <div className="home-actions">
          <Link className="primary-button" href="/sidepanel/">
            <PanelsTopLeft aria-hidden="true" size={18} />
            Side Panel
          </Link>
          <Link className="secondary-button" href="/mainstage/">
            Main Stage
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
