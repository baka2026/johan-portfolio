/* Central content. Edit here; the site renders everything from this file.
   null = not supplied yet (the UI hides it rather than faking it). */
window.SITE = {
  name: "Johan Arpin",
  url: "https://johanarpin.xyz",
  location: "Auckland, New Zealand",
  github: "https://github.com/baka2026",
  email: null,      // TODO: "you@example.com"
  linkedin: null,   // TODO: "https://www.linkedin.com/in/…"
  // status: "Concept" | "Prototype" | "Experiment" | "Ongoing" | "Released"
  // github / live: only set when the repo / demo genuinely exists.
  projects: [
    { slug: "gui-builder", featured: true, art: "builder", name: "GUI Builder", category: "Developer tool", status: "Concept",
      blurb: "A visual editor for designing custom interfaces for browser userscripts.",
      idea: "Userscript interfaces are usually hand-written DOM and CSS. This explores building them visually instead, then exporting the result.",
      objectives: ["Place buttons, sliders, checkboxes, headings and shapes on a canvas", "Edit each component’s properties with a live preview", "Export something a userscript can use"],
      implementation: "Concept stage. Planned as plain JavaScript and the DOM, with a component model that drives both the preview and the exported output.",
      tech: ["JavaScript", "HTML", "CSS", "Tampermonkey"], github: null, live: null },
    { slug: "browser-automation", featured: true, art: "overlay", name: "Browser Automation", category: "Userscripts", status: "Experiment",
      blurb: "Tampermonkey experiments: custom interfaces, overlays and small tools layered onto existing websites.",
      idea: "Websites are a starting point, not a fixed thing. Userscripts can add tools, overlays and automation on top of pages as they already exist.",
      objectives: ["Build interactive overlays that sit on top of a page", "Automate repetitive actions safely", "Keep each script small and readable"],
      implementation: "A collection of JavaScript userscripts run through Tampermonkey. Individual scripts will be linked here as they are cleaned up for sharing.",
      tech: ["JavaScript", "Tampermonkey", "DOM"], github: null, live: null },
    { slug: "web-development", name: "Web Development", category: "Websites", status: "Ongoing",
      blurb: "Website concepts, interactive applications, entertainment sites and API-connected projects.",
      idea: "Building for the browser is where most of my experiments start.",
      objectives: ["Try ideas quickly", "Connect front ends to real APIs", "Make things that feel good to use"],
      implementation: "HTML, CSS and JavaScript, with APIs where a project needs one.", tech: ["HTML", "CSS", "JavaScript", "APIs"], github: null, live: null },
    { slug: "ai-automation", name: "AI & Automation", category: "AI", status: "Experiment",
      blurb: "Experiments with AI models, APIs and automated workflows, including this site’s J.A.R.V.I.S. assistant.",
      idea: "Seeing how far language models, APIs and small scripts can be chained into something useful.",
      objectives: ["Connect models through APIs", "Keep keys server-side", "Handle failure honestly"],
      implementation: "Python and JavaScript glue code. The assistant on this site runs through a Cloudflare Pages Function.", tech: ["Python", "JavaScript", "APIs", "AI"], github: null, live: null },
    { slug: "creative-coding", name: "Creative Coding", category: "Visual", status: "Experiment",
      blurb: "Interactive visual experiments with JavaScript, SVG, CSS animation and Three.js.",
      idea: "Code as a visual medium: small, interactive pieces made to look and feel considered.",
      objectives: ["Explore generative and interactive visuals", "Learn Three.js by building"],
      implementation: "JavaScript, SVG, CSS animation and Three.js.", tech: ["Three.js", "SVG", "CSS", "JavaScript"], github: null, live: null },
    { slug: "security-lab", cyber: true, name: "Security Learning Lab", category: "Cybersecurity", status: "Ongoing",
      blurb: "Linux experimentation, ethical security research and defensive tooling, documented as I learn.",
      idea: "Understanding how systems fail is the best way to understand how to protect them.",
      objectives: ["Learn web security fundamentals", "Work comfortably in Kali Linux", "Write up what I learn"],
      implementation: "Hands-on practice on systems I own or am authorised to test. No write-ups are published yet.",
      tech: ["Linux", "Kali Linux", "Python", "Web security"], github: null, live: null }
  ],
  tech: [
    ["Web", "HTML, CSS, JavaScript"],
    ["Programming", "Python, JavaScript, scripting"],
    ["Environment", "Linux, Kali Linux"],
    ["Tools", "Git, GitHub, Tampermonkey"],
    ["Visual", "Three.js, CSS animation, SVG"],
    ["Interests", "APIs, cybersecurity, AI, automation"]
  ],
  writeups: [] // add { title, href, summary } here when the first technical article exists
};
