import { DATA } from "@/data/resume";
import CvDownloadButton from "@/components/cv-download-button";
import { Button } from "@/components/ui/button";
import HeroName from "@/components/abyss/HeroName";
import SkillsShoal from "@/components/abyss/SkillsShoal";
import LampRevealController from "@/components/abyss/LampRevealController";
import SubmersibleBezel from "@/components/abyss/SubmersibleBezel";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: DATA.name,
  jobTitle: "Web Developer & MCA Student",
  url: DATA.url,
  sameAs: [
    DATA.contact.social.GitHub.url,
    DATA.contact.social.LinkedIn.url,
  ],
  description: DATA.description,
};

// Depth markers for the 6 project specimens along the dive
const SPECIMEN_DEPTHS = [1600, 2050, 2500, 2950, 3250, 3550] as const;

export default function Page() {
  return (
    <main className="relative flex flex-col w-full text-[#e8fbff] overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Global RAF lamp proximity controller */}
      <LampRevealController />

      {/* Submersible viewport edge vignette and brackets */}
      <SubmersibleBezel />

      {/* =========================================================
          1. SURFACE / SUNLIGHT ZONE (0–200 m): HERO
          ========================================================= */}
      <section
        id="hero"
        className="min-h-[110vh] flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <div className="lamp-reveal flex flex-col items-start max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#5ff2e0] mb-5 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#5ff2e0] animate-pulse" />
            Surface · 0 m
          </span>

          <HeroName name={DATA.name} />

          <p className="mt-5 text-xl sm:text-2xl text-[#e8fbff]/85 max-w-2xl leading-relaxed font-light">
            {DATA.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-8">
            <CvDownloadButton resumeUrl={DATA.resumeUrl} />
            <Button
              asChild
              className="h-11 sm:h-10 px-5 font-medium min-w-[44px] border border-[#5ff2e0]/40 bg-[#021822]/60 backdrop-blur-md text-[#5ff2e0] hover:bg-[#5ff2e0]/20 hover:border-[#5ff2e0] shadow-[0_0_15px_rgba(95,242,224,0.15)] transition-all duration-200"
            >
              <a
                href={DATA.contact.social.GitHub.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open GitHub profile"
              >
                GitHub ↗
              </a>
            </Button>
          </div>

          <p className="mt-16 font-mono text-xs uppercase tracking-[0.25em] text-[#5ff2e0]/80 flex items-center gap-2">
            Your cursor is your lamp ↓
          </p>
        </div>
      </section>

      {/* =========================================================
          2. SUNLIGHT ZONE (200 m): ABOUT
          ========================================================= */}
      <section
        id="about"
        className="min-h-[110vh] flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <div className="lamp-reveal p-8 sm:p-12 rounded-3xl border border-white/10 bg-[#02141f]/50 backdrop-blur-md shadow-2xl max-w-4xl">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#5ff2e0] mb-6 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#5ff2e0]" />
            Depth · 200 m
          </span>
          <h2 className="font-display text-xs uppercase tracking-[0.3em] text-[#e8fbff]/50 mb-6">
            Log Summary
          </h2>
          <blockquote className="font-display text-2xl sm:text-3xl md:text-4xl text-[#e8fbff] font-normal leading-relaxed border-l-2 border-[#5ff2e0]/60 pl-6 sm:pl-8 italic">
            &ldquo;{DATA.summary}&rdquo;
          </blockquote>
        </div>
      </section>

      {/* =========================================================
          3. SUNLIGHT ZONE (200–600 m): SKILLS SHOAL
          ========================================================= */}
      <section
        id="skills"
        className="min-h-[130vh] flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <div className="lamp-reveal flex flex-col items-start mb-6">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#5ff2e0] mb-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#5ff2e0]" />
            Sunlight Zone · 450 m
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-[#e8fbff]">
            Skills Shoal
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#e8fbff]/75 max-w-xl leading-relaxed">
            Bioluminescent engineering shoal. Orbs drift organically with oceanic
            currents and react to your submersible lamp.
          </p>
        </div>

        {/* Floating animated orbs component */}
        <SkillsShoal />
      </section>

      {/* =========================================================
          4. TWILIGHT ZONE (600–1500 m): EDUCATION SONAR PINGS
          ========================================================= */}
      <section
        id="education"
        className="min-h-[120vh] flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <div className="lamp-reveal flex flex-col items-start mb-12">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#5ff2e0] mb-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#5ff2e0]" />
            Twilight Zone · 900 m
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-[#e8fbff]">
            Sonar Pings
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#e8fbff]/75 max-w-xl leading-relaxed">
            Echo-locating academic foundations in the deep twilight water.
          </p>
        </div>

        <div className="flex flex-col gap-10 max-w-3xl">
          {DATA.education.map((edu, idx) => (
            <div
              key={edu.school}
              className="lamp-reveal relative flex items-start gap-6 p-7 sm:p-9 rounded-2xl border border-white/10 bg-[#02131d]/60 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-[#5ff2e0]/40 group"
            >
              {/* Animated Sonar Radar Ping Indicator */}
              <div className="relative flex items-center justify-center size-8 sm:size-10 shrink-0 mt-1">
                <span className="absolute size-3 rounded-full bg-[#5ff2e0] shadow-[0_0_12px_#5ff2e0]" />
                <span
                  style={{ animationDelay: `${idx * 0.4}s` }}
                  className="absolute size-8 rounded-full border border-[#5ff2e0]/70 animate-ping opacity-75"
                />
                <span className="absolute size-10 rounded-full border border-[#5ff2e0]/30 animate-pulse" />
              </div>

              {/* Education details */}
              <div className="flex-1 flex flex-col gap-2">
                <div className="flex justify-between items-baseline flex-wrap gap-2">
                  <a
                    href={edu.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-xl sm:text-2xl font-semibold text-[#e8fbff] group-hover:text-[#5ff2e0] transition-colors inline-flex items-center gap-1.5"
                  >
                    {edu.school}
                    <ArrowUpRight className="size-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                  <span className="font-mono text-xs text-[#5ff2e0]/70 tabular-nums">
                    {edu.start} — {edu.end}
                  </span>
                </div>
                <p className="text-base text-[#e8fbff]/80 font-light">
                  {edu.degree}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================
          5. MIDNIGHT TO ABYSS (1500–3600 m): 6 SPECIMENS
          ========================================================= */}
      <section
        id="projects"
        className="flex flex-col px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <div className="lamp-reveal flex flex-col items-start mb-16">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#5ff2e0] mb-3 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#5ff2e0]" />
            Midnight to Abyss · 1,500–3,600 m
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-[#e8fbff]">
            Specimens & Projects
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#e8fbff]/75 max-w-xl leading-relaxed">
            Deep-sea engineering specimens stationed along the descent, illuminated
            only by your submersible lamp.
          </p>
        </div>

        {/* 6 alternating specimen wrappers */}
        <div className="flex flex-col gap-16 sm:gap-24 w-full">
          {DATA.projects.map((project, i) => {
            const isEven = i % 2 === 0;
            const depthM = SPECIMEN_DEPTHS[i];

            return (
              <div
                key={project.title}
                data-specimen={i}
                id={`specimen-${i}`}
                className={cn(
                  "specimen-wrapper relative min-h-[95vh] sm:min-h-[115vh] flex items-center w-full",
                  isEven ? "justify-start" : "justify-end"
                )}
              >
                <div className="relative w-full max-w-lg sm:max-w-xl group">
                  {/* Stable frame anchor for 3D WebGL textured plane */}
                  <div
                    id={`specimen-frame-${i}`}
                    data-specimen-frame={i}
                    className="specimen-frame relative w-full aspect-[16/10] rounded-3xl overflow-hidden border border-white/10 bg-[#02131d]/40 backdrop-blur-xs shadow-2xl transition-all duration-500 group-hover:border-[#5ff2e0]/50 group-hover:scale-[1.015]"
                  >
                    {/* Entire specimen clickable link for keyboard and mouse access */}
                    <a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open project ${project.title}`}
                      className="absolute inset-0 z-20 focus:outline-none focus:ring-2 focus:ring-[#5ff2e0] rounded-3xl cursor-pointer"
                    />

                    {/* DOM overlay card with glass look that fades in with lamp proximity or hover */}
                    <article className="lamp-reveal pointer-events-none absolute inset-0 z-10 flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-t from-[#020e17]/95 via-[#020e17]/50 to-transparent transition-opacity duration-300">
                      <div className="pointer-events-auto">
                        <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#5ff2e0] mb-2 flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-[#5ff2e0]" />
                          SPECIMEN 0{i + 1} · {depthM.toLocaleString()} m
                        </div>

                        <h3 className="font-display text-2xl sm:text-3xl font-semibold text-[#e8fbff] mb-2 group-hover:text-[#5ff2e0] transition-colors">
                          {project.title}
                        </h3>

                        <p className="text-xs sm:text-sm text-[#e8fbff]/85 leading-relaxed mb-4 font-light line-clamp-2 sm:line-clamp-3">
                          {project.description}
                        </p>

                        {/* Technology badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {project.technologies.map((tech) => (
                            <span
                              key={tech}
                              className="font-mono text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full bg-[#5ff2e0]/10 text-[#5ff2e0] border border-[#5ff2e0]/20"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>

                        {/* Real links from DATA */}
                        <div className="relative z-30 flex items-center gap-5 text-xs sm:text-sm font-medium">
                          {project.links.map((link) => (
                            <a
                              key={link.href}
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[#5ff2e0] hover:underline cursor-pointer"
                            >
                              {link.type} ↗
                            </a>
                          ))}
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================
          6. SEABED (3600–3800 m): CONTACT & CV
          ========================================================= */}
      <section
        id="contact"
        className="min-h-[120vh] flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <div className="lamp-reveal p-8 sm:p-14 rounded-3xl border border-white/10 bg-[#02111a]/70 backdrop-blur-md shadow-2xl max-w-3xl">
          <span className="font-mono text-xs uppercase tracking-[0.28em] text-[#5ff2e0] mb-4 flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-[#5ff2e0]" />
            Seabed · 3,800 m
          </span>

          <h2 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight text-[#e8fbff] mb-4">
            Let’s build together.
          </h2>

          <p className="text-base sm:text-lg text-[#e8fbff]/80 leading-relaxed mb-8 font-light">
            Expedition endpoint reached. Reached the ocean floor at 3,800 meters.
            Transmit a signal or connect through my networks.
          </p>

          <div className="flex flex-wrap items-center gap-6 mb-10">
            <a
              href={DATA.contact.social.email.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm sm:text-base text-[#5ff2e0] hover:underline flex items-center gap-1.5"
            >
              {DATA.contact.social.email.name} ↗
            </a>
            <a
              href={DATA.contact.social.GitHub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm sm:text-base text-[#5ff2e0] hover:underline flex items-center gap-1.5"
            >
              GitHub ↗
            </a>
            <a
              href={DATA.contact.social.LinkedIn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm sm:text-base text-[#5ff2e0] hover:underline flex items-center gap-1.5"
            >
              LinkedIn ↗
            </a>
          </div>

          <CvDownloadButton resumeUrl={DATA.resumeUrl} />
        </div>
      </section>
    </main>
  );
}
