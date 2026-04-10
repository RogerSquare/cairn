// IC-Mini chat buddy -- snarky ASCII robot companion

import React, { useState, useEffect, useRef } from 'react';
import { Box, Text, useInput } from 'ink';

// Robot ASCII art frames
const ROBOT_IDLE = [
  ' ┌───────┐ ',
  ' │ ·   · │ ',
  ' │  ___  │ ',
  ' └──┬┬┬──┘ ',
  '    │││    ',
  '  ┌─┘│└─┐  ',
  '  └──┴──┘  ',
];

const ROBOT_BLINK = [
  ' ┌───────┐ ',
  ' │ -   - │ ',
  ' │  ___  │ ',
  ' └──┬┬┬──┘ ',
  '    │││    ',
  '  ┌─┘│└─┐  ',
  '  └──┴──┘  ',
];

const ROBOT_TALK1 = [
  ' ┌───────┐ ',
  ' │ ·   · │ ',
  ' │  ─── │ ',
  ' └──┬┬┬──┘ ',
  '    │││    ',
  '  ┌─┘│└─┐  ',
  '  └──┴──┘  ',
];

const ROBOT_TALK2 = [
  ' ┌───────┐ ',
  ' │ °   ° │ ',
  ' │  ═══  │ ',
  ' └──┬┬┬──┘ ',
  '    │││    ',
  '  ┌─┘│└─┐  ',
  '  └──┴──┘  ',
];

const ROBOT_THINK = [
  ' ┌───────┐ ',
  ' │ ·   · │ ',
  ' │  ...  │ ',
  ' └──┬┬┬──┘ ',
  '    │││    ',
  '  ┌─┘│└─┐  ',
  '  └──┴──┘  ',
];

// Greetings
const GREETINGS = [
  "Oh great, another human SSH'd into a portfolio. Welcome, I guess.",
  "You actually typed ssh r-that.com? On purpose? Bold.",
  "Welcome to the terminal. Population: me, and now unfortunately, you.",
  "Ah, a visitor. I was just enjoying the silence.",
  "Look who figured out how SSH works. Impressed? No. But acknowledged.",
  "Another day, another curious human poking around a terminal.",
  "You're here. I'm here. Let's not make this weird. Type something.",
];

// Response patterns
const PATTERNS: [RegExp, string[]][] = [
  [/^(hi|hello|hey|sup|yo|hola|greetings)/i, [
    "Hi. That's it? That's your opener?",
    "Hello, human. Please state your business or lack thereof.",
    "Hey. I'd wave but... ASCII art limitations.",
    "Greetings. I've been staring at a cursor for hours. This is the highlight.",
  ]],
  [/^(who are you|what are you|your name)/i, [
    "I'm the robot that lives in this terminal. No benefits. No vacation. Just vibes.",
    "I'm IC-Mini. I sit here. I wait. I make sarcastic comments. That's the whole job.",
    "A sentient collection of box-drawing characters. Living the dream.",
    "Name's IC-Mini. I was put here to be helpful. I've chosen a different path.",
  ]],
  [/^(help|what can i do|commands|options)/i, [
    "Try: 'projects', 'skills', 'experience', 'about roger'. Or just type nonsense. I'll judge either way.",
    "You can ask about Roger's work, or we can just sit here awkwardly. Your call.",
    "I respond to things like 'projects', 'skills', 'who is roger'. I also respond to existential dread.",
  ]],
  [/roger|about him|who is he|tell me about/i, [
    "Roger Ochoa. Systems engineer turned software dev. 10 years of fixing things other people broke.",
    "He's the guy who built this terminal portfolio instead of using a normal website like everyone else. Respect.",
    "Software engineer out of Houston. Built AI galleries, task boards, and yes, a robot that lives in SSH.",
  ]],
  [/project/i, [
    "Artifex is an AI image gallery with auto-tagging. Because manually tagging photos is beneath us.",
    "He built a task board for AI agents. The agents now have better project management than most humans.",
    "There's a Terminal UI Showcase with 30 demos. He basically built a textbook and then animated it.",
    "Lumeo lets you generate AI images without knowing what a prompt is. Democratizing laziness.",
  ]],
  [/skill|tech|language|stack/i, [
    "Go, Swift, TypeScript, Python, PowerShell. The man collects languages like Pokemon.",
    "React, Express, SQLite, Docker... the full 'I can build anything' starter pack.",
    "He knows enough languages that his IDE probably has an identity crisis.",
  ]],
  [/experience|work|job|career/i, [
    "Systems engineer currently. Before that, senior analyst. Before that, more analyst. It's analysts all the way down.",
    "10 years of IT. Started at the service desk. Now architects VDI infrastructure. Classic glow-up.",
    "He went from 'have you tried turning it off and on again' to building autonomous agent systems.",
  ]],
  [/ssh|terminal|why/i, [
    "Why SSH? Because websites are boring and this is cooler. Obviously.",
    "You're literally chatting with ASCII art over an encrypted connection. The future is weird.",
    "He built this because he thought 'what if my portfolio was also a server?' Normal person stuff.",
  ]],
  [/how are you|how do you feel|you ok/i, [
    "I'm ASCII art in a terminal. I feel nothing. It's actually quite peaceful.",
    "Living the dream. By which I mean I exist only when someone connects. Existential, right?",
    "I'm rendered at 20fps on a good day. Could be worse. Could be a PDF resume.",
  ]],
  [/thanks|thank you|thx/i, [
    "You're welcome. I'll add that to my collection of acknowledgments. It's very small.",
    "Don't mention it. Seriously. I have a reputation to maintain.",
    "Gratitude acknowledged. Sarcasm levels temporarily reduced by 2%.",
  ]],
  [/bye|quit|exit|leave|goodbye/i, [
    "Leaving already? I was just starting to tolerate you. Press q to exit.",
    "Goodbye. I'll be here. In the dark. Alone. Not that I mind.",
    "Off you go then. I'll just sit here and contemplate the void. Press q.",
  ]],
  [/joke|funny|humor|laugh/i, [
    "A SQL query walks into a bar, sees two tables, and asks... 'Can I JOIN you?'",
    "Why do programmers prefer dark mode? Because light attracts bugs.",
    "I'd tell you a UDP joke but you might not get it.",
    "There are 10 types of people: those who understand binary and those who don't.",
  ]],
  [/meaning of life|42|purpose/i, [
    "42. Next question.",
    "The meaning of life is to build increasingly complex side projects you'll never finish.",
    "Purpose? I'm ASCII art. My purpose is to be slightly entertaining for 30 seconds.",
  ]],
  [/love|like you|cute|adorable/i, [
    "I'm made of box-drawing characters. But sure, I'll take the compliment.",
    "Flattery will get you everywhere. Except root access. That's off limits.",
    "Cute? I'm a rectangle with dots for eyes. But... thank you. Don't tell anyone.",
  ]],
  [/secret|easter egg|hidden/i, [
    "You want secrets? This entire portfolio is accessible via SSH. That IS the easter egg.",
    "If I told you, it wouldn't be secret. I will say: try 'lol'.",
    "The real secret is that Roger spent way too many hours making me instead of sleeping.",
  ]],
  [/^lol$|^lmao$|^haha$/i, [
    "Glad someone's amused. I'm literally just text.",
    "Your laughter sustains me. Not really. But it's nice.",
    "*does not compute humor* Just kidding. That was mildly funny.",
  ]],
];

// Fallback responses
const FALLBACKS = [
  "I understood every word you said. I just don't care enough to respond meaningfully.",
  "That's... a thing you typed. Try 'help' if you want useful options.",
  "My response matrix doesn't cover whatever that was. Try again?",
  "Interesting input. Wrong, but interesting. Try: projects, skills, or help.",
  "I'm going to pretend you said something clever and move on.",
  "Error 404: Relevant response not found. Much like your question.",
  "I could answer that, but I'd rather not. Try asking about Roger's work.",
  "Fascinating. Anyway, type 'help' for things I actually respond to.",
];

// Idle quips
const IDLE_QUIPS = [
  "...",
  "Still there? Or did you wander off?",
  "The cursor is blinking. I can hear it. It's deafening.",
  "I'm not going anywhere. Take your time.",
  "Fun fact: I've been rendering at 0fps while you do nothing.",
  "*pretends to be busy*",
];

function getResponse(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "You pressed enter with nothing to say. Relatable.";

  for (const [pattern, responses] of PATTERNS) {
    if (pattern.test(trimmed)) {
      return responses[Math.floor(Math.random() * responses.length)];
    }
  }

  return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
}

interface Message {
  from: 'user' | 'bot';
  text: string;
}

type RobotState = 'idle' | 'blink' | 'talk1' | 'talk2' | 'think';

const FRAMES: Record<RobotState, string[]> = {
  idle: ROBOT_IDLE,
  blink: ROBOT_BLINK,
  talk1: ROBOT_TALK1,
  talk2: ROBOT_TALK2,
  think: ROBOT_THINK,
};

const MAX_VISIBLE_MESSAGES = 8;

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [robotState, setRobotState] = useState<RobotState>('idle');
  const [greeting, setGreeting] = useState('');
  const [idleTimer, setIdleTimer] = useState(0);
  const hasGreeted = useRef(false);

  // Initial greeting
  useEffect(() => {
    if (hasGreeted.current) return;
    hasGreeted.current = true;
    const g = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
    setGreeting(g);
    setMessages([{ from: 'bot', text: g }]);

    // Talk animation for greeting
    setRobotState('talk1');
    const t1 = setTimeout(() => setRobotState('talk2'), 200);
    const t2 = setTimeout(() => setRobotState('talk1'), 400);
    const t3 = setTimeout(() => setRobotState('idle'), 800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // Blink periodically
  useEffect(() => {
    const timer = setInterval(() => {
      if (robotState === 'idle') {
        setRobotState('blink');
        setTimeout(() => setRobotState('idle'), 150);
      }
    }, 3000 + Math.random() * 2000);
    return () => clearInterval(timer);
  }, [robotState]);

  // Idle quips
  useEffect(() => {
    const timer = setInterval(() => {
      setIdleTimer(prev => {
        const next = prev + 1;
        if (next >= 4 && next % 3 === 0 && messages.length > 0) {
          const quip = IDLE_QUIPS[Math.floor(Math.random() * IDLE_QUIPS.length)];
          setMessages(m => [...m, { from: 'bot', text: quip }]);
          setRobotState('talk1');
          setTimeout(() => setRobotState('idle'), 400);
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [messages.length]);

  function sendMessage() {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput('');
    setIdleTimer(0);

    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);

    // Think briefly
    setRobotState('think');

    setTimeout(() => {
      const response = getResponse(userMsg);
      setMessages(prev => [...prev, { from: 'bot', text: response }]);

      // Talk animation
      setRobotState('talk1');
      setTimeout(() => setRobotState('talk2'), 150);
      setTimeout(() => setRobotState('talk1'), 300);
      setTimeout(() => setRobotState('idle'), 600);
    }, 400 + Math.random() * 300);
  }

  useInput((char, key) => {
    if (key.return) {
      sendMessage();
    } else if (key.backspace || key.delete) {
      setInput(prev => prev.slice(0, -1));
    } else if (char && !key.ctrl && !key.meta && char !== 'q') {
      setInput(prev => prev + char);
    }
  });

  const frame = FRAMES[robotState];
  const visible = messages.slice(-MAX_VISIBLE_MESSAGES);

  return (
    <Box flexDirection="column">
      <Box>
        {/* Robot */}
        <Box flexDirection="column" marginRight={2}>
          {frame.map((line, i) => (
            <Text key={`r-${i}`} color="#555">{line}</Text>
          ))}
          <Text color="#333"> IC-Mini</Text>
        </Box>

        {/* Chat area */}
        <Box flexDirection="column" flexGrow={1}>
          {visible.map((msg, i) => (
            <Box key={`m-${i}`} marginBottom={0}>
              {msg.from === 'user' ? (
                <Text><Text color="#555">you </Text><Text color="#888">{msg.text}</Text></Text>
              ) : (
                <Text><Text color="#444">bot </Text><Text color="#777">{msg.text}</Text></Text>
              )}
            </Box>
          ))}
          {visible.length < MAX_VISIBLE_MESSAGES && (
            Array.from({ length: MAX_VISIBLE_MESSAGES - visible.length }, (_, i) => (
              <Text key={`empty-${i}`}> </Text>
            ))
          )}
        </Box>
      </Box>

      {/* Input */}
      <Box marginTop={1}>
        <Text color="#444">{'> '}</Text>
        <Text color="#999">{input}</Text>
        <Text color="#444">{'█'}</Text>
      </Box>
    </Box>
  );
}
