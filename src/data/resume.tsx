import { Icons } from "@/components/icons";
import {
  Code2Icon,
  FolderIcon,
  GlobeIcon,
  GraduationCapIcon,
  HomeIcon,
} from "lucide-react";

export const DATA = {
  name: "Allen John Joy ",
  initials: "AJ",
  url: "https://allenjohn-portfolio.vercel.app/",
  description:
  "MCA student and Web Developer specializing in React, TypeScript, Node.js, and modern web applications.",  summary:
    "Frontend Developer & MCA student specializing in React , JavaScript, TypeScript, and Node.js. I build responsive, user-friendly interfaces with a strong focus on clean design and performance. Detail-oriented and passionate about technology, with a keen interest in computer hardware and PC building.",
  avatarUrl: "/profile.jpg",
  resumeUrl: "/Allen-John-Joy-CV.pdf",

  skills: [
    { name: "React.js", iconPath: "/skill-icons/react.svg", brandColor: "rgba(97, 218, 251, 0.25)" },
    { name: "Node.js", iconPath: "/skill-icons/nodejs.svg", brandColor: "rgba(95, 160, 78, 0.25)" },
    { name: "TypeScript", iconPath: "/skill-icons/typescript.svg", brandColor: "rgba(49, 120, 198, 0.25)" },
    { name: "Python", iconPath: "/skill-icons/python.svg", brandColor: "rgba(55, 118, 171, 0.25)" },
    { name: "JavaScript", iconPath: "/skill-icons/javascript.svg", brandColor: "rgba(247, 223, 30, 0.25)" },
    { name: "Angular", iconPath: "/skill-icons/angular.svg", brandColor: "rgba(221, 0, 49, 0.25)" },
    { name: "Flask", iconPath: "/skill-icons/flask.svg", brandColor: "rgba(160, 160, 160, 0.25)" },
    { name: "MySQL", iconPath: "/skill-icons/mysql.svg", brandColor: "rgba(68, 121, 161, 0.25)" },
    { name: "SQLite", iconPath: "/skill-icons/sqlite.svg", brandColor: "rgba(0, 59, 87, 0.25)" },
  ],

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/#education", icon: GraduationCapIcon, label: "Education" },
    { href: "/#skills", icon: Code2Icon, label: "Skills" },
    { href: "/#projects", icon: FolderIcon, label: "Projects" },
  ],

  contact: {
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/AllenJohnn",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/allenjohnjoy",
        icon: Icons.linkedin,
        navbar: true,
      },
      Portfolio: {
        name: "Portfolio",
        url: "https://allenjohn-portfolio.vercel.app/",
        icon: Icons.globe,
        navbar: false,
      },
      email: {
        name: "Send Email",
        url: "https://mail.google.com/mail/?view=cm&fs=1&to=allenjohnjoy2004@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  education: [
    {
      school: "Federal Institute of Science and Technology (FISAT), Angamaly",
      href: "https://fisat.ac.in",
      degree: "Master of Computer Applications (MCA)",
      start: "2025",
      end: "Present",
    },
    {
      school: "Sahrdaya College of Advanced Studies, Kodakara",
      href: "https://sahrdayacas.ac.in",
      degree: "Bachelor of Computer Applications (BCA)",
      start: "2022",
      end: "2025",
    },
  ],

  projects: [
    {
      title: "DocShare",
      href: "https://dsh.nacbots.com/",
      dates: "",
      active: true,
      description:
        "Room-based private files and text sharing app for fast, secure collaboration with minimal setup.",
      technologies: ["React", "TypeScript", "Redis"],
      links: [
        {
          type: "Live Link",
          href: "https://dsh.nacbots.com/",
          icon: <GlobeIcon className="size-3" />,
        },
      ],
      image: "/projects/docshare.webp",
      video: "",
    },
    {
      title: "Wrapped Revanced",
      href: "https://github.com/AllenJohnn/Wrapped-Revanced",
      dates: "",
      active: true,
      description:
        "A Spotify Wrapped-style experience powered by React and Python. Visualize your music listening habits with beautiful analytics.",
      technologies: ["React", "Python", "D3.js", "Flask"],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/AllenJohnn/Wrapped-Revanced",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/spotify.webp",
      video: "",
    },
    {
      title: "CineView Hub",
      href: "https://cineviewhub.vercel.app/",
      dates: "",
      active: true,
      description:
        "Netflix-inspired movie and TV discovery platform with infinite scroll, video trailers, and production-ready optimizations.",
      technologies: ["React", "TypeScript", "TanStack Query"],
      links: [
        {
          type: "Live Link",
          href: "https://cineviewhub.vercel.app/",
          icon: <GlobeIcon className="size-3" />,
        },
      ],
      image: "/projects/cineview.webp",
      imagePosition: "50% 30%",
      video: "",
    },
    {
      title: "PDF Tools",
      href: "https://github.com/AllenJohnn/PDF-Tools",
      dates: "",
      active: true,
      description:
        "Local-first PDF toolkit with merge, split, compress, convert, and metadata tools.",
      technologies: ["TypeScript", "Node.js", "Express"],
      links: [
        {
          type: "GitHub",
          href: "https://github.com/AllenJohnn/PDF-Tools",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/pdftool.webp",
      video: "",
    },
    {
      title: "QuickBench",
      href: "https://playquickbench.vercel.app/",
      dates: "",
      active: true,
      description:
        "A modern cognitive performance app featuring real-time aim training, reaction-time benchmarking, and a clean typing speed test.",
      technologies: ["React", "TypeScript", "Tailwind CSS"],
      links: [
        {
          type: "Live Link",
          href: "https://playquickbench.vercel.app/",
          icon: <GlobeIcon className="size-3" />,
        },
        {
          type: "GitHub",
          href: "https://github.com/AllenJohnn/Benchmark",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/speedtest.webp",
      video: "",
    },
    {
      title: "QuickQR Tools",
      href: "https://quickqr-tools.vercel.app/",
      dates: "",
      active: true,
      description:
        "A lightweight QR code generator offering live preview, custom colors, TinyURL shortening, and PNG/SVG export support.",
      technologies: ["HTML", "CSS", "JavaScript", "QR API"],
      links: [
        {
          type: "Live Link",
          href: "https://quickqr-tools.vercel.app/",
          icon: <GlobeIcon className="size-3" />,
        },
        {
          type: "GitHub",
          href: "https://github.com/AllenJohnn/QuickQR",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/projects/qrtools.webp",
      video: "",
    },
  ],
} as const;
