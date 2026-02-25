import { Type } from "@google/genai";

export const APP_BUILDER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    appName: { type: Type.STRING },
    description: { type: Type.STRING },
    code: { type: Type.STRING, description: "Complete React component code using Tailwind CSS" },
    features: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["appName", "code"]
};

export const VIDEO_SCRIPT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    isLongForm: { type: Type.BOOLEAN },
    totalDuration: { type: Type.STRING, description: "Total duration (e.g., '5m', '2h', '10h')" },
    episodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          episodeNumber: { type: Type.NUMBER },
          title: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                visual: { type: Type.STRING },
                audio: { type: Type.STRING },
                duration: { type: Type.NUMBER }
              }
            }
          }
        }
      }
    },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          timestamp: { type: Type.STRING },
          visual: { type: Type.STRING },
          audio: { type: Type.STRING }
        }
      }
    }
  },
  required: ["title"]
};

export const AGENT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    agentName: { type: Type.STRING },
    persona: { type: Type.STRING },
    capabilities: { type: Type.ARRAY, items: { type: Type.STRING } },
    initialMessage: { type: Type.STRING }
  }
};

export const SAAS_BUILDER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    productName: { type: Type.STRING },
    description: { type: Type.STRING },
    userRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
    monetizationStrategy: { type: Type.STRING },
    backendArchitecture: { type: Type.STRING, description: "Detailed description of the backend architecture" },
    apiEndpoints: { 
      type: Type.ARRAY, 
      items: { 
        type: Type.OBJECT,
        properties: {
          method: { type: Type.STRING },
          path: { type: Type.STRING },
          description: { type: Type.STRING }
        }
      } 
    },
    frontendComponents: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key frontend components to build" },
    mvpCodeSnippet: { type: Type.STRING, description: "A core React component or API route for the MVP" }
  },
  required: ["productName", "backendArchitecture", "apiEndpoints"]
};

export const STUDIO_PROJECT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          duration: { type: Type.NUMBER },
          background: { type: Type.STRING },
          characters: { type: Type.ARRAY, items: { type: Type.STRING } },
          dialogue: { type: Type.STRING },
          audioPrompt: { type: Type.STRING },
          voiceoverScript: { type: Type.STRING }
        }
      }
    },
    assets: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING },
          name: { type: Type.STRING },
          url: { type: Type.STRING }
        }
      }
    }
  },
  required: ["projectName", "scenes"]
};

export const MASTER_DRAFT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    vision: { type: Type.STRING },
    app: APP_BUILDER_SCHEMA,
    video: VIDEO_SCRIPT_SCHEMA,
    agent: AGENT_SCHEMA,
    saas: SAAS_BUILDER_SCHEMA,
    studio: STUDIO_PROJECT_SCHEMA,
    roadmap: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["projectName", "app", "saas", "studio"]
};

export const ANIMATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    style: { type: Type.STRING },
    totalDuration: { type: Type.STRING, description: "Total duration of the animation (e.g., '10m', '1h')" },
    episodes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          episodeNumber: { type: Type.NUMBER },
          title: { type: Type.STRING },
          scenes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                sceneNumber: { type: Type.NUMBER },
                visualDescription: { type: Type.STRING },
                movement: { type: Type.STRING },
                audioPrompt: { type: Type.STRING, description: "Background music and SFX prompt" },
                voiceoverScript: { type: Type.STRING, description: "The dialogue or narration for this scene" },
                duration: { type: Type.NUMBER, description: "Duration in seconds" }
              }
            }
          }
        }
      }
    }
  },
  required: ["title", "episodes"]
};

export const CHARACTER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    species: { type: Type.STRING },
    traits: { type: Type.ARRAY, items: { type: Type.STRING } },
    backstory: { type: Type.STRING },
    visualDescription: { type: Type.STRING },
    stats: {
      type: Type.OBJECT,
      properties: {
        strength: { type: Type.NUMBER },
        agility: { type: Type.NUMBER },
        intelligence: { type: Type.NUMBER }
      }
    }
  }
};

export const GOOGLE_AI_APP_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    appName: { type: Type.STRING },
    description: { type: Type.STRING },
    geminiIntegration: { type: Type.STRING, description: "Description of how Gemini API is used" },
    frontendCode: { type: Type.STRING, description: "React component code with Gemini integration" },
    backendCode: { type: Type.STRING, description: "Express server code with Gemini integration" },
    environmentVariables: { type: Type.ARRAY, items: { type: Type.STRING } },
    setupInstructions: { type: Type.STRING }
  },
  required: ["appName", "frontendCode", "geminiIntegration"]
};

export const IMAGE_GEN_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    prompt: { type: Type.STRING },
    style: { type: Type.STRING, description: "Style like '3D Kids Animation', 'Painting Anime', 'Thriller & Horror', etc." },
    revisedPrompt: { type: Type.STRING, description: "AI-enhanced prompt for better image generation" },
    negativePrompt: { type: Type.STRING }
  },
  required: ["prompt", "style", "revisedPrompt"]
};

export const VOICEOVER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    text: { type: Type.STRING },
    voice: { type: Type.STRING, description: "Voice name like 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'" },
    emotion: { type: Type.STRING },
    script: { type: Type.STRING, description: "Enhanced script for the voiceover" }
  },
  required: ["text", "voice", "script"]
};

export const STORY_WRITER_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    genre: { type: Type.STRING },
    plotSummary: { type: Type.STRING },
    chapters: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          content: { type: Type.STRING }
        }
      }
    }
  },
  required: ["title", "genre", "plotSummary", "chapters"]
};

export const VEO3_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    prompt: { type: Type.STRING },
    style: { type: Type.STRING },
    resolution: { type: Type.STRING },
    aspectRatio: { type: Type.STRING },
    duration: { type: Type.STRING },
    scenes: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sceneNumber: { type: Type.NUMBER },
          description: { type: Type.STRING },
          cameraMovement: { type: Type.STRING }
        }
      }
    }
  },
  required: ["projectName", "prompt", "scenes"]
};

export const GEMINI3_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    task: { type: Type.STRING },
    analysis: { type: Type.STRING },
    solution: { type: Type.STRING },
    codeSnippet: { type: Type.STRING },
    nextSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: ["projectName", "task", "solution"]
};

export const CAFFEINE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    projectName: { type: Type.STRING },
    audioPrompt: { type: Type.STRING },
    mood: { type: Type.STRING },
    tempo: { type: Type.NUMBER },
    instruments: { type: Type.ARRAY, items: { type: Type.STRING } },
    composition: { type: Type.STRING, description: "Detailed musical composition structure" }
  },
  required: ["projectName", "audioPrompt", "composition"]
};

export const UDIO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    songTitle: { type: Type.STRING },
    lyrics: { type: Type.STRING },
    genre: { type: Type.STRING },
    vocalStyle: { type: Type.STRING },
    arrangement: { type: Type.ARRAY, items: { type: Type.STRING } },
    productionNotes: { type: Type.STRING }
  },
  required: ["songTitle", "lyrics", "genre"]
};
