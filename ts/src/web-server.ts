// HTTP web server -- serves the portfolio as a minimal web page
// Inspired by antfu.me: clean, spacious, content-focused
// Usage: npm run web (listens on port 3000)

import express from 'express';
import { contact, about, skills, projects, experience } from './data.js';

const app = express();
const PORT = parseInt(process.env.WEB_PORT || '3000', 10);

app.get('/', (_req, res) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${contact.name}</title>
  <meta name="description" content="${about.slice(0, 155)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --bg: #050505;
      --text: #bbb;
      --text-strong: #ddd;
      --text-deep: #fff;
      --text-muted: #666;
      --border: rgba(136, 136, 136, 0.15);
      --accent: #bbb;
      --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --mono: 'DM Mono', 'Fira Code', monospace;
    }

    html { scroll-behavior: smooth; }

    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.75;
      font-size: 16px;
      -webkit-font-smoothing: antialiased;
    }

    /* Dot grid background */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
      background-size: 24px 24px;
      pointer-events: none;
      z-index: 0;
    }

    /* Scrollbar */
    ::-webkit-scrollbar { width: 6px; }
    ::-webkit-scrollbar-track { background: #111; }
    ::-webkit-scrollbar-thumb { background: #333; border-radius: 10px; }
    ::-webkit-scrollbar-thumb:hover { background: #555; }

    /* Layout */
    main {
      position: relative;
      z-index: 1;
      max-width: 640px;
      margin: 0 auto;
      padding: 0 24px;
    }

    a {
      color: var(--text-strong);
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: border-color 0.2s, opacity 0.2s;
    }

    a:hover { border-bottom-color: rgba(255,255,255,0.3); }

    /* Slide-in animation */
    @keyframes slide-enter {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .slide-in {
      animation: slide-enter 0.6s ease both;
    }

    ${Array.from({length: 12}, (_, i) => `.slide-in-${i + 1} { animation-delay: ${(i + 1) * 80}ms; }`).join('\n    ')}

    /* Terminal hint */
    .terminal-hint {
      text-align: center;
      padding: 12px 0;
      font-family: var(--mono);
      font-size: 12px;
      color: var(--text-muted);
      opacity: 0.5;
    }

    .terminal-hint code {
      color: var(--text-strong);
      opacity: 0.8;
    }

    /* Header */
    header {
      padding: 80px 0 0;
      position: relative;
    }

    nav {
      position: absolute;
      top: 32px;
      right: 0;
      display: flex;
      gap: 20px;
    }

    nav a {
      font-size: 14px;
      color: var(--text);
      opacity: 0.5;
      border-bottom: none;
      transition: opacity 0.2s;
    }

    nav a:hover { opacity: 1; border-bottom: none; }

    .name {
      font-size: 1.8rem;
      font-weight: 700;
      color: var(--text-deep);
      letter-spacing: -0.02em;
    }

    .title {
      color: var(--text-muted);
      font-size: 1rem;
      margin-top: 2px;
    }

    .location {
      color: var(--text-muted);
      font-size: 0.85rem;
      opacity: 0.6;
      margin-top: 2px;
    }

    /* Sections */
    section { padding: 40px 0; }

    h2 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-strong);
      margin-bottom: 20px;
      letter-spacing: -0.01em;
    }

    /* Separator */
    hr {
      border: none;
      border-top: 1px solid var(--border);
      width: 50px;
      margin: 0 auto;
    }

    /* About */
    .about {
      color: var(--text);
      font-size: 0.95rem;
      line-height: 1.8;
    }

    /* Skills */
    .skill-category {
      margin-bottom: 16px;
    }

    .skill-category-name {
      font-family: var(--mono);
      font-size: 0.8rem;
      color: var(--text-muted);
      text-transform: lowercase;
      margin-bottom: 4px;
    }

    .skill-list {
      color: var(--text);
      font-size: 0.9rem;
    }

    .skill-list span { opacity: 0.7; }
    .skill-list span:hover { opacity: 1; }
    .skill-sep { color: var(--text-muted); opacity: 0.3; margin: 0 6px; }

    /* Projects */
    .project {
      margin-bottom: 16px;
    }

    .project-link {
      font-size: 0.95rem;
      color: var(--text-strong);
      opacity: 0.7;
      transition: opacity 0.2s;
      border-bottom: none;
    }

    .project-link:hover { opacity: 1; }

    .project-desc {
      color: var(--text-muted);
      font-size: 0.85rem;
      margin-top: 2px;
      line-height: 1.5;
    }

    .project-tech {
      font-family: var(--mono);
      font-size: 0.72rem;
      color: var(--text-muted);
      opacity: 0.5;
      margin-top: 3px;
    }

    /* Experience */
    .exp-item {
      margin-bottom: 24px;
    }

    .exp-role {
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--text-strong);
    }

    .exp-meta {
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-top: 1px;
    }

    .exp-meta .period {
      font-family: var(--mono);
      font-size: 0.75rem;
      opacity: 0.6;
    }

    .exp-desc {
      margin-top: 6px;
      padding-left: 16px;
      list-style: none;
    }

    .exp-desc li {
      font-size: 0.85rem;
      color: var(--text);
      opacity: 0.6;
      line-height: 1.6;
      position: relative;
      padding-left: 12px;
    }

    .exp-desc li::before {
      content: '-';
      position: absolute;
      left: 0;
      color: var(--text-muted);
      opacity: 0.4;
    }

    /* Contact */
    .contact-item {
      margin-bottom: 6px;
      font-size: 0.9rem;
    }

    .contact-item .label {
      font-family: var(--mono);
      font-size: 0.78rem;
      color: var(--text-muted);
      opacity: 0.5;
      display: inline-block;
      width: 70px;
    }

    .contact-item a {
      opacity: 0.7;
    }

    .contact-item a:hover { opacity: 1; }

    /* Footer */
    footer {
      padding: 40px 0;
      text-align: center;
      font-size: 0.8rem;
      color: var(--text-muted);
      opacity: 0.4;
    }

    footer code {
      font-family: var(--mono);
      font-size: 0.75rem;
      opacity: 0.8;
    }

    /* Scroll to top */
    .to-top {
      position: fixed;
      bottom: 16px;
      right: 16px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 1px solid var(--border);
      background: transparent;
      color: var(--text-muted);
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.3s, background 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      z-index: 10;
    }

    .to-top:hover { background: rgba(136,136,136,0.1); opacity: 1; }

    @media (max-width: 640px) {
      main { padding: 0 20px; }
      header { padding-top: 60px; }
      nav { position: static; margin-bottom: 32px; }
      .name { font-size: 1.5rem; }
    }
  </style>
</head>
<body>
  <div class="terminal-hint slide-in slide-in-1">
    try it in your terminal &mdash; <code>ssh r-that.com</code>
  </div>

  <main>
    <header class="slide-in slide-in-2">
      <nav>
        <a href="#projects">projects</a>
        <a href="#experience">experience</a>
        <a href="https://${contact.github}">github</a>
      </nav>
      <div class="name">${contact.name}</div>
      <div class="title">${contact.title}</div>
      <div class="location">${contact.location}</div>
    </header>

    <section class="slide-in slide-in-3">
      <p class="about">${about}</p>
    </section>

    <hr class="slide-in slide-in-4">

    <section class="slide-in slide-in-5">
      <h2>skills</h2>
      ${skills.map(cat => `
        <div class="skill-category">
          <div class="skill-category-name">${cat.name.toLowerCase()}</div>
          <div class="skill-list">${cat.items.map(s => `<span>${s}</span>`).join('<span class="skill-sep">/</span>')}</div>
        </div>
      `).join('')}
    </section>

    <hr class="slide-in slide-in-6">

    <section id="projects" class="slide-in slide-in-7">
      <h2>projects</h2>
      ${projects.map(p => `
        <div class="project">
          ${p.link
            ? `<a href="https://${p.link}" class="project-link">${p.name}</a>`
            : `<span class="project-link">${p.name}</span>`
          }
          <div class="project-desc">${p.desc}</div>
          <div class="project-tech">${p.tech.join(' / ')}</div>
        </div>
      `).join('')}
    </section>

    <hr class="slide-in slide-in-8">

    <section id="experience" class="slide-in slide-in-9">
      <h2>experience</h2>
      ${experience.map(exp => `
        <div class="exp-item">
          <div class="exp-role">${exp.role}</div>
          <div class="exp-meta">${exp.company} <span class="period">${exp.period}</span></div>
          <ul class="exp-desc">${exp.desc.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
      `).join('')}
    </section>

    <hr class="slide-in slide-in-10">

    <section class="slide-in slide-in-11">
      <h2>contact</h2>
      <div class="contact-item"><span class="label">email</span> <a href="mailto:${contact.email}">${contact.email}</a></div>
      <div class="contact-item"><span class="label">github</span> <a href="https://${contact.github}">${contact.github.replace('github.com/', '')}</a></div>
      <div class="contact-item"><span class="label">web</span> <a href="https://${contact.website}">${contact.website}</a></div>
      <div class="contact-item"><span class="label">location</span> <span style="opacity:0.7">${contact.location}</span></div>
    </section>
  </main>

  <footer class="slide-in slide-in-12">
    &copy; ${new Date().getFullYear()} ${contact.name} &mdash; also available via <code>ssh r-that.com</code>
  </footer>

  <button class="to-top" onclick="window.scrollTo({top:0})" aria-label="Scroll to top">&uarr;</button>

  <script>
    // Show scroll-to-top button after scrolling
    const btn = document.querySelector('.to-top');
    window.addEventListener('scroll', () => {
      btn.style.opacity = window.scrollY > 300 ? '0.5' : '0';
    });
  </script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio web server running at http://localhost:${PORT}`);
});
