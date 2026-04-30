// generate-tldr-audio.js
// Generates MP3 audio for all article TLDRs using Azure Speech Services
// Reads tldr text directly from src/content/notes/*.md frontmatter
// Requires: AZURE_SPEECH_KEY and AZURE_SPEECH_REGION environment variables
// Usage: node generate-tldr-audio.js

import sdk from 'microsoft-cognitiveservices-speech-sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Simple frontmatter parser
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  
  const frontmatter = match[1];
  const data = {};
  
  // Parse tldr: "..." or tldr: >
  const tldrMatch = frontmatter.match(/tldr:\s*["'](.+?)["']\s*(?:\n|$)/);
  if (tldrMatch) {
    data.tldr = tldrMatch[1];
  } else {
    // Handle multi-line tldr with |
    const multiLineMatch = frontmatter.match(/tldr:\s*\|\n((?:\s+.+\n)+)/);
    if (multiLineMatch) {
      data.tldr = multiLineMatch[1].split('\n').map(line => line.trim()).join(' ').trim();
    }
  }
  
  // Parse slug
  const slugMatch = frontmatter.match(/slug:\s*["']?(.+?)["']?\s*(?:\n|$)/);
  if (slugMatch) data.slug = slugMatch[1];
  
  return data;
}

// Configuration
const SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';
const VOICE_NAME = 'en-GB-OllieMultilingualNeural'; // Ollie voice (British English)
const NOTES_DIR = path.join(__dirname, 'src', 'content', 'notes');
const OUTPUT_DIR = path.join(__dirname, 'public', 'audio');

async function generateAudio(slug, text) {
  return new Promise((resolve, reject) => {
    const speechConfig = sdk.SpeechConfig.fromSubscription(SPEECH_KEY, SPEECH_REGION);
    speechConfig.speechSynthesisVoiceName = VOICE_NAME;
    speechConfig.speechSynthesisOutputFormat = sdk.SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3;
    
    const outputPath = path.join(OUTPUT_DIR, `${slug}.mp3`);
    const audioConfig = sdk.AudioConfig.fromAudioFileOutput(outputPath);
    const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

    console.log(`Generating: ${slug}.mp3`);
    
    synthesizer.speakTextAsync(
      text,
      result => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log(`  ✓ Saved: ${outputPath} (${result.audioDuration / 10000}s)`);
          resolve(outputPath);
        } else {
          reject(new Error(`Synthesis failed: ${result.errorDetails}`));
        }
        synthesizer.close();
      },
      error => {
        reject(error);
        synthesizer.close();
      }
    );
  });
}

async function main() {
  if (!SPEECH_KEY) {
    console.error('Error: AZURE_SPEECH_KEY environment variable is required');
    console.error('Get your key from: https://portal.azure.com/ → Cognitive Services → Speech');
    process.exit(1);
  }

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Read all markdown files from content/notes
  const files = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith('.md'));
  
  console.log(`Found ${files.length} articles in ${NOTES_DIR}`);
  console.log(`Voice: ${VOICE_NAME}`);
  console.log(`Output: ${OUTPUT_DIR}`);
  console.log('');

  for (const file of files) {
    const filePath = path.join(NOTES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = parseFrontmatter(content);
    
    const slug = data.slug || path.basename(file, '.md');
    const tldr = data.tldr;
    
    if (!tldr) {
      console.log(`Skipping: ${file} (no tldr)`);
      continue;
    }
    
    try {
      await generateAudio(slug, tldr);
    } catch (error) {
      console.error(`  ✗ Failed: ${slug} — ${error.message}`);
    }
  }

  console.log('\nDone!');
}

main();
