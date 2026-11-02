import { DATA } from "@/data/resume";
import CvDownloadButton from "@/components/cv-download-button";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Markdown from "react-markdown";

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

export default function Page() {
  return (
    <main className="relative flex flex-col w-full text-[#e8fbff]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Surface / Sunlight Zone: 0–200 m */}
      <section
        id="hero"
        className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#5ff2e0] mb-4">
          Surface · 0 m
        </span>
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight text-[#e8fbff] leading-[1.05]">
          {DATA.name}
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-[#e8fbff]/80 max-w-2xl leading-relaxed">
          {DATA.description}
        </p>
        <div className="flex flex-wrap items-center gap-4 mt-8">
          <CvDownloadButton resumeUrl={DATA.resumeUrl} />
          <Button
            asChild
            variant="outline"
            className="h-11 px-5 border-[#5ff2e0]/30 hover:border-[#5ff2e0] hover:bg-[#5ff2e0]/10 text-[#5ff2e0] font-medium"
          >
            <a
              href={DATA.contact.social.GitHub.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub profile"
            >
              GitHub
            </a>
          </Button>
        </div>
        <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-[#5ff2e0]/70">
          Scroll to dive ↓
        </p>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#5ff2e0] mb-4">
          Depth · 150 m
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight mb-6 text-[#e8fbff]">
          About
        </h2>
        <div className="prose max-w-3xl text-[#e8fbff]/85 leading-relaxed text-base sm:text-lg">
          <Markdown>{DATA.summary}</Markdown>
        </div>
      </section>

      {/* Sunlight Zone: Skills Shoal 200–600 m */}
      <section
        id="skills"
        className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#5ff2e0] mb-4">
          Sunlight Zone · 400 m
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight mb-4 text-[#e8fbff]">
          Skills
        </h2>
        <p className="text-sm text-[#e8fbff]/70 mb-8 max-w-xl">
          Core technologies used to design and engineer full-stack systems.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {DATA.skills.map((skill) => (
            <div
              key={skill.name}
              className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-center gap-3 backdrop-blur-sm"
            >
              <span className="font-medium text-sm text-[#e8fbff]">
                {skill.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Twilight Zone: Education & Sonar Pings 600–1500 m */}
      <section
        id="education"
        className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#5ff2e0] mb-4">
          Twilight Zone · 900 m
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight mb-6 text-[#e8fbff]">
          Education
        </h2>
        <div className="flex flex-col gap-8 max-w-2xl">
          {DATA.education.map((edu) => (
            <div
              key={edu.school}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm flex flex-col gap-2"
            >
              <div className="flex justify-between items-baseline flex-wrap gap-2">
                <Link
                  href={edu.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-lg text-[#5ff2e0] hover:underline"
                >
                  {edu.school}
                </Link>
                <span className="font-mono text-xs text-[#e8fbff]/60">
                  {edu.start} — {edu.end}
                </span>
              </div>
              <p className="text-sm text-[#e8fbff]/80">{edu.degree}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Midnight to Abyss: Projects 1500–3600 m */}
      <section
        id="projects"
        className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#5ff2e0] mb-4">
          Midnight · 2,200 m
        </span>
        <h2 className="font-display text-3xl sm:text-5xl font-semibold tracking-tight mb-4 text-[#e8fbff]">
          Specimens & Projects
        </h2>
        <p className="text-sm text-[#e8fbff]/70 mb-8 max-w-xl">
          Deep-sea builds revealed as you descend into the abyss.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DATA.projects.map((project, i) => (
            <div
              key={project.title}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-sm flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-[#5ff2e0]/80">
                  Specimen 0{i + 1}
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#e8fbff] mt-2 mb-2">
                  {project.title}
                </h3>
                <p className="text-sm text-[#e8fbff]/80 leading-relaxed mb-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="font-mono text-[11px] px-2.5 py-0.5 rounded-full bg-[#5ff2e0]/10 text-[#5ff2e0] border border-[#5ff2e0]/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm font-medium">
                {project.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5ff2e0] hover:underline"
                  >
                    {link.type} ↗
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seabed: Contact & CV 3600–3800 m */}
      <section
        id="contact"
        className="min-h-screen flex flex-col justify-center px-6 sm:px-12 md:px-24 py-24 max-w-5xl mx-auto w-full"
      >
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#5ff2e0] mb-4">
          Seabed · 3,800 m
        </span>
        <h2 className="font-display text-4xl sm:text-6xl font-semibold tracking-tight mb-4 text-[#e8fbff]">
          Let’s build together.
        </h2>
        <p className="text-base sm:text-lg text-[#e8fbff]/80 max-w-xl mb-8 leading-relaxed">
          Reached the ocean floor. Send an expedition signal or connect through
          my channels.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <a
            href={DATA.contact.social.email.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm sm:text-base text-[#5ff2e0] hover:underline"
          >
            {DATA.contact.social.email.name}
          </a>
          <a
            href={DATA.contact.social.GitHub.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm sm:text-base text-[#5ff2e0] hover:underline"
          >
            GitHub
          </a>
          <a
            href={DATA.contact.social.LinkedIn.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm sm:text-base text-[#5ff2e0] hover:underline"
          >
            LinkedIn
          </a>
        </div>
        <div className="mt-8">
          <CvDownloadButton resumeUrl={DATA.resumeUrl} />
        </div>
      </section>
    </main>
  );
}
