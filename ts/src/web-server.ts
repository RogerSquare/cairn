// HTTP web server -- serves the portfolio as a web page
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
  <title>${contact.name} - ${contact.title}</title>
  <meta name="description" content="${about.slice(0, 155)}">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    :root {
      --bg: #0a0a0f;
      --surface: #161b22;
      --border: #30363d;
      --text: #e4e4ef;
      --muted: #8b949e;
      --accent: #fdb32a;
      --blue: #58a6ff;
      --green: #3fb950;
      --clay: #da7756;
      --orange: #d29922;
      --purple: #bc8cff;
      --mono: 'JetBrains Mono', 'Fira Code', monospace;
      --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    html { scroll-behavior: smooth; }
    body { font-family: var(--sans); background: var(--bg); color: var(--text); line-height: 1.6; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { color: #ffc44d; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }

    /* Terminal hint banner */
    .terminal-hint {
      background: var(--surface);
      border-bottom: 1px solid var(--border);
      padding: 10px 0;
      text-align: center;
      font-size: 13px;
      color: var(--muted);
      font-family: var(--mono);
    }
    .terminal-hint code {
      background: rgba(253, 179, 42, 0.12);
      color: var(--accent);
      padding: 3px 10px;
      border-radius: 4px;
      font-weight: 600;
    }

    /* Hero */
    .hero {
      padding: 80px 0 60px;
      text-align: center;
    }
    .hero-name {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 700;
      background: linear-gradient(135deg, var(--clay), var(--accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.02em;
    }
    .hero-title { font-size: 1.3rem; color: var(--blue); font-weight: 500; margin-top: 4px; }
    .hero-location { color: var(--muted); margin-top: 4px; }
    .hero-links { margin-top: 20px; display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .hero-links a {
      padding: 8px 20px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      border: 1px solid var(--border);
      transition: all 0.2s;
    }
    .hero-links a:hover { border-color: var(--accent); }
    .hero-links a.primary { background: var(--accent); color: #0a0a0f; border-color: var(--accent); }
    .hero-links a.primary:hover { background: #ffc44d; }

    /* Section */
    .section { padding: 60px 0; }
    .section-alt { background: #0d0d14; }
    .section-title {
      font-size: 1.6rem;
      font-weight: 700;
      margin-bottom: 32px;
      letter-spacing: -0.02em;
    }
    .section-title::before {
      content: '// ';
      color: var(--accent);
      font-family: var(--mono);
      font-weight: 400;
    }

    /* About */
    .about-text { color: var(--muted); font-size: 1.05rem; line-height: 1.8; max-width: 700px; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 32px; }
    .stat {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      text-align: center;
    }
    .stat-value { font-size: 2rem; font-weight: 700; font-family: var(--mono); }
    .stat-label { color: var(--muted); font-size: 0.85rem; margin-top: 4px; }

    /* Skills */
    .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 16px; }
    .skill-group {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
    }
    .skill-group-title {
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .skill-tags { display: flex; flex-wrap: wrap; gap: 6px; }
    .tag {
      background: rgba(253, 179, 42, 0.08);
      border: 1px solid rgba(253, 179, 42, 0.15);
      color: var(--text);
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 0.82rem;
    }

    /* Projects */
    .projects-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .project-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 24px;
      transition: border-color 0.2s, transform 0.2s;
    }
    .project-card:hover { border-color: var(--accent); transform: translateY(-2px); }
    .project-name { font-size: 1.15rem; font-weight: 700; color: var(--text); }
    .project-desc { color: var(--muted); font-size: 0.9rem; margin-top: 8px; line-height: 1.5; }
    .project-tech { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
    .project-tech span {
      font-size: 0.75rem;
      padding: 2px 8px;
      border-radius: 4px;
      background: rgba(88, 166, 255, 0.1);
      color: var(--blue);
      border: 1px solid rgba(88, 166, 255, 0.15);
    }
    .project-link { margin-top: 12px; font-size: 0.85rem; }

    /* Experience */
    .timeline { position: relative; padding-left: 28px; }
    .timeline::before {
      content: '';
      position: absolute;
      left: 6px;
      top: 8px;
      bottom: 8px;
      width: 2px;
      background: var(--border);
    }
    .timeline-item { position: relative; margin-bottom: 32px; }
    .timeline-item:last-child { margin-bottom: 0; }
    .timeline-dot {
      position: absolute;
      left: -28px;
      top: 6px;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 3px solid var(--accent);
      background: var(--bg);
    }
    .timeline-item:first-child .timeline-dot { background: var(--accent); }
    .timeline-role { font-size: 1.1rem; font-weight: 700; }
    .timeline-company { color: var(--blue); font-size: 0.9rem; }
    .timeline-period { color: var(--muted); font-size: 0.85rem; font-family: var(--mono); margin-top: 2px; }
    .timeline-desc { color: var(--muted); font-size: 0.9rem; margin-top: 8px; list-style: disc; padding-left: 18px; }
    .timeline-desc li { margin-bottom: 4px; }

    /* Contact */
    .contact-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
    .contact-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 14px;
      transition: border-color 0.2s;
    }
    .contact-card:hover { border-color: var(--accent); }
    .contact-icon { font-size: 1.3rem; width: 36px; text-align: center; }
    .contact-label { color: var(--muted); font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .contact-value { color: var(--text); font-weight: 500; margin-top: 2px; }

    /* Footer */
    .footer {
      border-top: 1px solid var(--border);
      padding: 24px 0;
      text-align: center;
      color: var(--muted);
      font-size: 0.85rem;
    }

    @media (max-width: 768px) {
      .stats { grid-template-columns: repeat(2, 1fr); }
      .projects-grid { grid-template-columns: 1fr; }
      .contact-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <!-- Terminal hint -->
  <div class="terminal-hint">
    Also available in your terminal: <code>ssh r-that.com</code>
  </div>

  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <h1 class="hero-name">${contact.name}</h1>
      <p class="hero-title">${contact.title}</p>
      <p class="hero-location">${contact.location}</p>
      <div class="hero-links">
        <a href="https://${contact.github}" class="primary">GitHub</a>
        <a href="mailto:${contact.email}">Email</a>
        <a href="https://${contact.website}">Website</a>
      </div>
    </div>
  </section>

  <!-- About -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">About</h2>
      <p class="about-text">${about}</p>
      <div class="stats">
        <div class="stat"><div class="stat-value" style="color:var(--accent)">10</div><div class="stat-label">Years in IT</div></div>
        <div class="stat"><div class="stat-value" style="color:var(--blue)">6+</div><div class="stat-label">Projects</div></div>
        <div class="stat"><div class="stat-value" style="color:var(--green)">5+</div><div class="stat-label">Languages</div></div>
        <div class="stat"><div class="stat-value" style="color:var(--purple)">3</div><div class="stat-label">Platforms</div></div>
      </div>
    </div>
  </section>

  <!-- Skills -->
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">Skills</h2>
      <div class="skills-grid">
        ${skills.map(cat => `
          <div class="skill-group">
            <div class="skill-group-title" style="color:${cat.color}">${cat.icon} ${cat.name}</div>
            <div class="skill-tags">${cat.items.map(s => `<span class="tag">${s}</span>`).join('')}</div>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Projects -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">Projects</h2>
      <div class="projects-grid">
        ${projects.map(p => `
          <div class="project-card">
            <div class="project-name">${p.name}</div>
            <div class="project-desc">${p.desc}</div>
            <div class="project-tech">${p.tech.map(t => `<span>${t}</span>`).join('')}</div>
            ${p.link ? `<div class="project-link"><a href="https://${p.link}">View on GitHub</a></div>` : ''}
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Experience -->
  <section class="section section-alt">
    <div class="container">
      <h2 class="section-title">Experience</h2>
      <div class="timeline">
        ${experience.map(exp => `
          <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-role">${exp.role}</div>
            <div class="timeline-company">${exp.company}</div>
            <div class="timeline-period">${exp.period}</div>
            <ul class="timeline-desc">${exp.desc.map(d => `<li>${d}</li>`).join('')}</ul>
          </div>
        `).join('')}
      </div>
    </div>
  </section>

  <!-- Contact -->
  <section class="section">
    <div class="container">
      <h2 class="section-title">Contact</h2>
      <div class="contact-grid">
        <a href="mailto:${contact.email}" class="contact-card">
          <div class="contact-icon">&#9993;</div>
          <div><div class="contact-label">Email</div><div class="contact-value">${contact.email}</div></div>
        </a>
        <a href="https://${contact.github}" class="contact-card">
          <div class="contact-icon">&#9670;</div>
          <div><div class="contact-label">GitHub</div><div class="contact-value">${contact.github}</div></div>
        </a>
        <a href="https://${contact.website}" class="contact-card">
          <div class="contact-icon">&#9671;</div>
          <div><div class="contact-label">Website</div><div class="contact-value">${contact.website}</div></div>
        </a>
        <div class="contact-card">
          <div class="contact-icon">&#8962;</div>
          <div><div class="contact-label">Location</div><div class="contact-value">${contact.location}</div></div>
        </div>
      </div>
    </div>
  </section>

  <footer class="footer">
    <div class="container">&copy; ${new Date().getFullYear()} ${contact.name}. Also try <code style="background:rgba(253,179,42,0.12);color:#fdb32a;padding:2px 8px;border-radius:4px;font-family:var(--mono)">ssh r-that.com</code></div>
  </footer>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Portfolio web server running at http://localhost:${PORT}`);
});
