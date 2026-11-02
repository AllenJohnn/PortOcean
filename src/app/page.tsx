import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DATA } from "@/data/resume";
import Image from "next/image";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import ProjectsSection from "@/components/section/projects-section";
import { ArrowUpRight } from "lucide-react";
import CvDownloadButton from "@/components/cv-download-button";

const BLUR_FADE_DELAY = 0.04;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": DATA.name,
  "jobTitle": "Web Developer & MCA Student",
  "url": DATA.url,
  "sameAs": [
    DATA.contact.social.GitHub.url,
    DATA.contact.social.LinkedIn.url,
  ],
  "description": DATA.description,
};

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-14 relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section id="hero" className="scroll-mt-6">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div className="gap-4 gap-y-6 flex flex-col md:flex-row md:items-center justify-between">
            <div className="gap-3 flex flex-col order-2 md:order-1">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-semibold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ").slice(0, 2).join(" ")}`}
              />
              <BlurFadeText
                className="text-muted-foreground max-w-[640px] md:text-lg lg:text-xl leading-relaxed"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
              <BlurFade delay={BLUR_FADE_DELAY * 1.5}>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <CvDownloadButton resumeUrl={DATA.resumeUrl} />
                  <Button asChild variant="outline" className="h-11 sm:h-10 px-5 font-medium min-w-[44px]">
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
              </BlurFade>
            </div>
            <BlurFade delay={BLUR_FADE_DELAY} className="order-1 md:order-2">
              <Avatar className="size-32 md:size-40 border rounded-full shadow-xl ring-4 ring-muted transition-transform duration-300 hover:scale-105">
                <AvatarImage src={DATA.avatarUrl} alt={DATA.name} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
          </div>
        </div>
      </section>
      <section id="about" className="scroll-mt-20">
        <div className="flex min-h-0 flex-col gap-y-4 rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
          <BlurFade delay={BLUR_FADE_DELAY * 3} inView>
            <h2 className="text-2xl font-bold sm:text-3xl">About</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 4} inView>
            <div className="prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
              <Markdown>
                {DATA.summary}
              </Markdown>
            </div>
          </BlurFade>
        </div>
      </section>
      <section id="education" className="scroll-mt-20">
        <div className="flex min-h-0 flex-col gap-y-6 rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
          <BlurFade delay={BLUR_FADE_DELAY} inView>
            <h2 className="text-2xl font-bold sm:text-3xl">Education</h2>
          </BlurFade>
          <div className="flex flex-col gap-8">
            {DATA.education.map((education) => (
              <BlurFade
                key={education.school}
                delay={BLUR_FADE_DELAY * 2}
                inView
              >
                <Link
                  href={education.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between group"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="font-semibold leading-none flex items-center gap-2">
                        {education.school}
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                      </div>
                      <div className="font-sans text-sm text-muted-foreground">
                        {education.degree}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs tabular-nums text-muted-foreground text-right flex-none">
                    <span>
                      {education.start} - {education.end}
                    </span>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="skills" className="scroll-mt-20">
        <div className="flex min-h-0 flex-col gap-y-5 rounded-2xl border border-border/70 bg-card/40 p-5 sm:p-6">
          <BlurFade delay={BLUR_FADE_DELAY} inView>
            <h2 className="text-2xl font-bold sm:text-3xl">Skills</h2>
          </BlurFade>
          <BlurFade delay={BLUR_FADE_DELAY * 1.5} inView>
            <p className="text-sm text-muted-foreground">Core technologies I use to design and build modern web products.</p>
          </BlurFade>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-[780px]">
            {DATA.skills.map((skill, id) => (
              <BlurFade key={skill.name} delay={BLUR_FADE_DELAY * 2 + id * 0.04} inView>
                <div
                  style={{ "--brand-color": "brandColor" in skill ? skill.brandColor : "rgba(128,128,128,0.1)" } as React.CSSProperties}
                  className="h-full min-h-20 border border-border/80 bg-background/80 rounded-xl px-3 py-3 flex items-center gap-3 transition-all duration-300 hover:border-[var(--brand-color)] hover:bg-background hover:shadow-[0_0_15px_var(--brand-color)]"
                >
                  <span className="size-8 rounded-lg bg-muted/80 dark:bg-zinc-800/80 flex items-center justify-center shrink-0 p-1.5">
                    <Image
                      src={skill.iconPath}
                      alt={`${skill.name} logo`}
                      width={20}
                      height={20}
                      className="size-5 object-contain drop-shadow-[0_0_1px_rgba(255,255,255,0.25)] dark:drop-shadow-[0_0_0.5px_rgba(255,255,255,0.9)]"
                      loading="lazy"
                    />
                  </span>
                  <span className="text-foreground text-sm font-medium leading-tight">{skill.name}</span>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <section id="projects" className="scroll-mt-20">
        <BlurFade delay={BLUR_FADE_DELAY} inView>
          <ProjectsSection />
        </BlurFade>
      </section>
      <section id="contact" className="scroll-mt-20">
        <BlurFade delay={BLUR_FADE_DELAY} inView>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}
