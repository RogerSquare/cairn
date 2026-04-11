// Portfolio data -- loaded from data.json at runtime
// Edit data.json directly or use the admin panel at /admin

import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '..', 'data.json');

interface Contact { name: string; title: string; email: string; github: string; website: string; location: string; }
interface Skill { name: string; items: string[]; }
interface Project { name: string; desc: string; tech: string[]; link: string; }
interface Experience { role: string; company: string; period: string; desc: string[]; }
interface PortfolioData { contact: Contact; about: string; skills: Skill[]; projects: Project[]; experience: Experience[]; }

function loadData(): PortfolioData {
  return JSON.parse(readFileSync(DATA_PATH, 'utf8'));
}

// Re-read on every access so changes reflect without restart
export function getData() {
  return loadData();
}

// Convenience exports that re-read each time
// For SSH (loaded once per connection), this is fine
// For web (loaded per request), also fine
const initial = loadData();

export const contact = initial.contact;
export const about = initial.about;
export const aboutWeb = initial.about;
export const skills = initial.skills;
export const projects = initial.projects;
export const experience = initial.experience;

// For dynamic access (web server uses this)
export function getContact(): Contact { return loadData().contact; }
export function getAbout(): string { return loadData().about; }
export function getSkills(): Skill[] { return loadData().skills; }
export function getProjects(): Project[] { return loadData().projects; }
export function getExperience(): Experience[] { return loadData().experience; }

// Save updated data
export function saveData(data: any) {
  writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

export { DATA_PATH };
