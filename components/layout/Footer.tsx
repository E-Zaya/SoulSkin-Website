import Link from "next/link";
import NoiseAccent from "@/components/ui/NoiseAccent";
import { siteContent } from "@/data/siteContent";

export default function Footer() {
  return (
    <footer className="relative bg-void border-t border-cinder overflow-hidden">
      {/* Noise: very thin strip at the top border — barely visible */}
      <NoiseAccent
        inset="0 0 auto 0"
        width="60%"
        height="80px"
        opacity={0.03}
        tileSize="180px"
      />

      <div className="relative z-10 container-base py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <span className="text-brand-display text-[16px]">
          {siteContent.brand.name}
        </span>

        <span className="font-mono text-[11px] text-iron tracking-widest uppercase">
          {siteContent.brand.location}
        </span>

        <Link
          href={siteContent.brand.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[13px] font-medium text-dust hover:text-bone transition-colors duration-200"
        >
          {siteContent.brand.handle}
        </Link>
      </div>

      <div className="relative z-10 border-t border-cinder/50 container-base py-3">
        <p className="font-mono text-[11px] text-iron/60 tracking-wide">
          {siteContent.brand.copyright}
        </p>
      </div>
    </footer>
  );
}
