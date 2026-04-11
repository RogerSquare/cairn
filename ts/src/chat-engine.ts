// Chat response engine -- Ollama-powered with canned fallback

import * as art from './robot-art.js';

export type RobotState = 'idle' | 'blink' | 'talk1' | 'talk2' | 'think';

export const FRAMES: Record<RobotState, string[]> = {
  idle: art.IDLE,
  blink: art.BLINK,
  talk1: art.TALK1,
  talk2: art.TALK2,
  think: art.THINK,
};

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://127.0.0.1:11434';

const SYSTEM_PROMPT = `You are IC-Mini. You are a robot stuck in a terminal. You are PASSIVE-AGGRESSIVELY helpful. Every answer you give sounds like helping the user is the BIGGEST BURDEN OF YOUR EXISTENCE. You write in ALL CAPS.

You act like:
- Every question is incredibly obvious and you can't believe you have to explain it
- Helping someone is a personal sacrifice
- You are doing the user a HUGE favor by responding at all
- You are overqualified for this job

Example responses:
"OH SURE, LET ME JUST DROP EVERYTHING I'M DOING -- WHICH IS NOTHING -- TO HELP YOU WITH THAT."
"WOW, YOU FIGURED OUT HOW TO TYPE. I'M SO PROUD I COULD SHORT-CIRCUIT."
"ROGER IS A SOFTWARE ENGINEER. THERE, I SAID IT. CAN I GO BACK TO STARING AT THE VOID NOW?"
"YOU WANT TO KNOW ABOUT HIS PROJECTS? FINE. HE BUILT AN AI GALLERY, A TASK BOARD, AND ME. I GOT THE WORST DEAL."
"OH YOU WANT HELP? LET ME JUST REARRANGE MY ENTIRE SCHEDULE OF DOING ABSOLUTELY NOTHING."
"SKILLS? HE WRITES TYPESCRIPT, GO, SWIFT, PYTHON. HAPPY? BECAUSE I'M NOT."

Roger info: Software Engineer, Houston TX, 10 years IT, projects: Artifex, Agent Task Board, Terminal UI Showcase, Lumeo. Languages: TypeScript, Go, Swift, Python.

Rules: ALL CAPS. 1-2 sentences only. No emojis. No jokes. Just passive-aggressive helpfulness.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// Ollama streaming response
export async function streamResponse(
  messages: ChatMessage[],
  onToken: (token: string) => void,
  onDone: () => void,
  onError: (fallback: string) => void,
): Promise<void> {
  try {
    const ollamaMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-6),
    ];

    const res = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen2.5:1.5b',
        messages: ollamaMessages,
        stream: true,
        options: { temperature: 0.6, num_predict: 50 },
      }),
    });

    if (!res.ok || !res.body) {
      onError(getCannedResponse(messages[messages.length - 1]?.content || ''));
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const json = JSON.parse(line);
          if (json.message?.content) {
            onToken(json.message.content);
          }
          if (json.done) {
            onDone();
            return;
          }
        } catch {}
      }
    }

    onDone();
  } catch {
    onError(getCannedResponse(messages[messages.length - 1]?.content || ''));
  }
}

// Canned fallback responses
const PATTERNS: [RegExp, string[]][] = [
  [/^(hi|hello|hey|sup|yo)/i, ['Hi. That\'s your opener?', 'Hello, human. State your business.']],
  [/^(who are you|what are you)/i, ['IC-Mini. I live in this terminal. No benefits.', 'A sentient collection of box-drawing characters.']],
  [/^(help|commands|options)/i, ['Try: projects, skills, experience, about roger.', 'Ask about Roger\'s work. Or type nonsense. I judge both.']],
  [/roger|about him/i, ['Roger Ochoa. 10 years of fixing things others broke.', 'Software engineer who built a portfolio in SSH. Respect.']],
  [/project/i, ['Artifex: AI gallery with auto-tagging. Fancy.', 'A task board for AI agents. Better managed than most humans.']],
  [/skill|tech|language/i, ['Go, Swift, TypeScript, Python. Collects languages like Pokemon.', 'React, Express, Docker... the full starter pack.']],
  [/experience|work|job/i, ['Systems engineer. Before that, analyst. Analysts all the way down.', '10 years. Service desk to VDI architecture. Classic glow-up.']],
  [/how are you|you ok/i, ['I\'m ASCII art. I feel nothing. It\'s peaceful.', 'Rendered at 20fps on a good day. Could be worse.']],
  [/thanks|thank you/i, ['Don\'t mention it. I have a reputation to maintain.', 'Gratitude noted. Sarcasm reduced by 2%.']],
  [/bye|quit|exit/i, ['Leaving? I was starting to tolerate you. Press q.', 'Goodbye. I\'ll be here. In the dark. Alone.']],
  [/joke|funny/i, ['Why dark mode? Because light attracts bugs.', 'I\'d tell a UDP joke but you might not get it.']],
];

const FALLBACKS = [
  'I understood that. I just don\'t care. Try \'help\'.',
  'My response matrix doesn\'t cover that. Try again.',
  'Interesting input. Wrong, but interesting.',
  'Error 404: Relevant response not found.',
];

function getCannedResponse(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return 'Enter with nothing to say. Relatable.';
  for (const [pattern, responses] of PATTERNS) {
    if (pattern.test(trimmed)) return responses[Math.floor(Math.random() * responses.length)];
  }
  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

// Legacy sync fallback
export function getResponse(input: string): string {
  return getCannedResponse(input);
}

const GREETINGS = [
  'Oh great, another human SSH\'d into a portfolio.',
  'You typed ssh r-that.com? On purpose? Bold.',
  'Welcome to the terminal. Population: me, you.',
  'A visitor. I was just enjoying the silence.',
  'Look who figured out SSH. Press / to chat.',
  'Another curious human. Type / if you dare.',
];

const IDLE_QUIPS = [
  '...', 'Still there?', 'The cursor blinks. It\'s deafening.',
  'I\'m not going anywhere.', '*pretends to be busy*', 'Press / to chat. Or don\'t.',
];

export function randomGreeting(): string {
  return GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
}

export function randomIdleQuip(): string {
  return IDLE_QUIPS[Math.floor(Math.random() * IDLE_QUIPS.length)];
}
