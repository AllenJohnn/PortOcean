"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";

function ProjectImage({
  src,
  alt,
  objectPosition,
}: {
  src: string;
  alt: string;
  objectPosition?: string;
}) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || imageError) {
    return <div className="w-full h-48 bg-muted" />;
  }

  return (
    <div className="relative w-full h-48 bg-muted">
      {isLoading && <Skeleton className="absolute inset-0" />}
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
        className={cn(
          "object-cover transition-opacity duration-300 transform transition-transform duration-500 will-change-transform group-hover:scale-105",
          isLoading && "opacity-0"
        )}
        style={objectPosition ? { objectPosition } : undefined}
        onError={() => setImageError(true)}
        onLoad={() => setIsLoading(false)}
        loading="lazy"
      />
    </div>
  );
}

interface Props {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  image?: string;
  imagePosition?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  image,
  imagePosition,
  video,
  links,
  className,
}: Props) {
  return (
    <div
      className={cn(
        "group relative flex flex-col h-full border border-border rounded-xl overflow-hidden transition-transform duration-200 transform hover:scale-[1.02] hover:shadow-lg focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
    >
      <div className="relative shrink-0">
        {video ? (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-48 object-cover"
          />
        ) : image ? (
          <ProjectImage src={image} alt={title} objectPosition={imagePosition} />
        ) : (
          <div className="w-full h-48 bg-muted" />
        )}
        {links && links.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-2 z-20">
            {links.map((link) => (
              <Link
                href={link.href}
                key={`${link.type}-${link.href}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative z-30"
                aria-label={`${link.type} for ${title}`}
              >
                <Badge
                  className="flex items-center gap-1.5 text-xs bg-black text-white hover:bg-black/90"
                  variant="default"
                >
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1">
            <h3 className="font-semibold">
              {href ? (
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline focus:outline-none after:absolute after:inset-0"
                >
                  {title}
                </Link>
              ) : (
                title
              )}
            </h3>
            {dates ? (
              <time className="text-xs text-muted-foreground">{dates}</time>
            ) : null}
          </div>
          {href && (
            <span className="text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>
        <div className="text-xs flex-1 prose max-w-full text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
          <Markdown>{description}</Markdown>
        </div>
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto z-10 relative">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="text-[11px] font-medium border border-border h-6 w-fit px-2"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
