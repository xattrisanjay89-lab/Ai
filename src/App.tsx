/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Video, 
  Bot, 
  Layout, 
  Gamepad2, 
  Zap, 
  Shield, 
  TrendingUp, 
  Plus, 
  Terminal,
  ChevronRight,
  ChevronLeft,
  Settings,
  Activity,
  Box,
  Code,
  Sparkles,
  Play,
  Download,
  Share2,
  Globe,
  Layers,
  Users,
  CreditCard,
  Clapperboard,
  UserCircle,
  Edit3,
  Save,
  Trash2,
  Image as ImageIcon,
  Mic,
  BookOpen,
  MonitorPlay,
  User,
  Folder,
  LayoutTemplate,
  Monitor,
  Library,
  Sword,
  Wand2,
  Music,
  Move,
  Type as TypeIcon,
  Undo2,
  Redo2,
  Search,
  Maximize2,
  History,
  Minus,
  MoreVertical,
  Sun,
  Thermometer,
  Menu,
  X,
  Share,
  Bookmark,
  Volume2,
  Upload,
  FileJson,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { 
  APP_BUILDER_SCHEMA, 
  VIDEO_SCRIPT_SCHEMA, 
  AGENT_SCHEMA, 
  SAAS_BUILDER_SCHEMA, 
  MASTER_DRAFT_SCHEMA,
  ANIMATION_SCHEMA,
  CHARACTER_SCHEMA,
  GOOGLE_AI_APP_SCHEMA,
  IMAGE_GEN_SCHEMA,
  VOICEOVER_SCHEMA,
  STORY_WRITER_SCHEMA,
  STUDIO_PROJECT_SCHEMA,
  VEO3_SCHEMA,
  GEMINI3_SCHEMA,
  CAFFEINE_SCHEMA,
  UDIO_SCHEMA
} from './constants';

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

type Engine = 'dashboard' | 'video' | 'agent' | 'app' | 'game' | 'saas' | 'autodraft' | 'animation' | 'character' | 'googleai' | 'imagegen' | 'voiceover' | 'story' | 'studio' | 'veo3' | 'gemini3' | 'caffeine' | 'udio';

export default function App() {
  const [activeEngine, setActiveEngine] = useState<Engine>('dashboard');
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editContent, setEditContent] = useState('');
  const [viewMode, setViewMode] = useState<'dashboard' | 'studio'>('dashboard');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [studioProject, setStudioProject] = useState<any>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);
  const [studioTab, setStudioTab] = useState<'properties' | 'characters' | 'assets' | 'transform' | 'conditions'>('transform');
  const [transformX, setTransformX] = useState(400);
  const [transformY, setTransformY] = useState(225);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState<string | null>(null);
  const [showMonetization, setShowMonetization] = useState(false);
  const [tutorialTab, setTutorialTab] = useState('English');
  const [videoStyle, setVideoStyle] = useState('None');
  const [videoResolution, setVideoResolution] = useState('720p');
  const [videoAspectRatio, setVideoAspectRatio] = useState('Landscape');
  const [videoDuration, setVideoDuration] = useState('4s');
  const [videoReferenceImage, setVideoReferenceImage] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditProgress, setAuditProgress] = useState(0);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  
  // Model Configuration States (AI Studio Style)
  const [systemInstruction, setSystemInstruction] = useState('');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.95);
  const [topK, setTopK] = useState(40);
  const [maxOutputTokens, setMaxOutputTokens] = useState(2048);
  const [showConfig, setShowConfig] = useState(false);
  const [isLongForm, setIsLongForm] = useState(false);
  const [safetyLevel, setSafetyLevel] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [quantumEncryption, setQuantumEncryption] = useState(true);
  const [studioConditions, setStudioConditions] = useState({
    lighting: 'Cinematic',
    weather: 'Clear',
    timeOfDay: 'Golden Hour',
    productivity: 94,
    morale: 88,
    renderLoad: 42
  });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    fetchProjects();
    fetchAgents();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch('/api/projects');
    const data = await res.json();
    setProjects(data);
  };

  const fetchAgents = async () => {
    const res = await fetch('/api/agents');
    const data = await res.json();
    setAgents(data);
  };

  const handleAddScene = () => {
    if (!studioProject) return;
    const newScene = {
      id: `scene-${Date.now()}`,
      name: `New Scene ${studioProject.scenes.length + 1}`,
      duration: 10,
      background: 'Village',
      characters: [],
      dialogue: '',
      audioPrompt: '',
      voiceoverScript: ''
    };
    setStudioProject({
      ...studioProject,
      scenes: [...studioProject.scenes, newScene]
    });
    setActiveSceneIndex(studioProject.scenes.length);
    setToast({ message: "New scene added to studio", type: 'success' });
  };

  const handleApplyTransform = () => {
    if (!studioProject) return;
    const newScenes = [...studioProject.scenes];
    newScenes[activeSceneIndex] = {
      ...newScenes[activeSceneIndex],
      transform: { x: transformX, y: transformY, scale }
    };
    setStudioProject({ ...studioProject, scenes: newScenes });
    setToast({ message: "Transform applied to scene", type: 'success' });
  };

  const handleSaveEdit = async () => {
    if (!editingProject) return;
    try {
      await fetch(`/api/projects/${editingProject.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error("Save failed:", error);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("Are you sure you want to delete this manifestation?")) return;
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setVideoReferenceImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateVideo = async () => {
    if (!prompt) return;
    setIsGeneratingVideo(true);
    setGeneratedVideoUrl(null);
    setError(null);

    try {
      if (!(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: `Generate a video description and metadata for: ${prompt}. Style: ${videoStyle}, Resolution: ${videoResolution}, Aspect Ratio: ${videoAspectRatio}, Duration: ${videoDuration}`,
      });

      // Simulate video generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Use a placeholder video for demonstration
      setGeneratedVideoUrl("https://www.w3schools.com/html/mov_bbb.mp4");
      
      // Save to projects
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Math.random().toString(36).substr(2, 9),
          name: `Video: ${prompt.substring(0, 20)}...`,
          type: 'video',
          content: JSON.stringify({
            prompt,
            style: videoStyle,
            resolution: videoResolution,
            aspectRatio: videoAspectRatio,
            duration: videoDuration,
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4"
          })
        })
      });
      fetchProjects();

    } catch (error: any) {
      console.error("Video generation failed:", error);
      setError(error.message || "Failed to generate video.");
    } finally {
      setIsGeneratingVideo(false);
    }
  };

  const handleAudit = () => {
    setIsAuditing(true);
    setAuditProgress(0);
    const interval = setInterval(() => {
      setAuditProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsAuditing(false), 1000);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  const handleVoiceSync = () => {
    setToast({ message: "Analyzing voiceover patterns...", type: 'info' });
    setTimeout(() => {
      setToast({ message: "Voiceover synchronized with visual timeline", type: 'success' });
    }, 2000);
  };

  const handleFixAudio = () => {
    setToast({ message: "Enhancing audio fidelity...", type: 'info' });
    setTimeout(() => {
      setToast({ message: "Audio mastered and noise reduced", type: 'success' });
    }, 2000);
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setOutput(null);

    try {
      setError(null);
      if (!(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
      }
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      let model = "gemini-3.1-pro-preview";
      let defaultSystemInstruction = "";
      let responseSchema: any = null;

      switch (activeEngine) {
        case 'video':
          defaultSystemInstruction = `You are a master cinematic director and scriptwriter. Generate a detailed video production script for ${isLongForm ? `a long-form production (Target Duration: ${videoDuration})` : 'a short cinematic clip'}. 
          ${isLongForm ? 'Structure the output into episodes and scenes with precise timestamps, visual directions, and audio cues.' : 'Generate a sequence of scenes with precise camera directions, lighting cues, and emotional beats.'} 
          Ensure the output is structured and ready for production.`;
          responseSchema = VIDEO_SCRIPT_SCHEMA;
          break;
        case 'app':
          defaultSystemInstruction = "You are a world-class full-stack engineer and UI/UX designer. Generate a production-ready React component using Tailwind CSS. Focus on accessibility, performance, and clean code. The component should be visually stunning and highly functional.";
          responseSchema = APP_BUILDER_SCHEMA;
          break;
        case 'agent':
          defaultSystemInstruction = "You are an AI architect and cognitive scientist. Design a specialized autonomous agent with a deep persona, specific capabilities, and a clear mission. Define its reasoning patterns and interaction style.";
          responseSchema = AGENT_SCHEMA;
          break;
        case 'game':
          defaultSystemInstruction = "You are a legendary game designer and creative director. Generate a game concept, mechanics, and core logic. Focus on player engagement, game balance, and immersive storytelling.";
          responseSchema = APP_BUILDER_SCHEMA; 
          break;
        case 'saas':
          defaultSystemInstruction = "You are a SaaS product strategist and system architect. Design a complete SaaS platform including architecture, roles, monetization, and a clear path to MVP. Focus on scalability and user value.";
          responseSchema = SAAS_BUILDER_SCHEMA;
          break;
        case 'autodraft':
          defaultSystemInstruction = "You are TITAN-OMNI Master AI, the ultimate creative intelligence. Generate a complete, multi-module project draft that seamlessly integrates App, Video, Agent, and SaaS architecture. Your vision should be cohesive, innovative, and market-ready.";
          responseSchema = MASTER_DRAFT_SCHEMA;
          break;
        case 'animation':
          defaultSystemInstruction = `You are a 2D Animation Series Director. Generate a comprehensive production manifest for ${isLongForm ? 'a long-form (1 hour+) series' : 'a short animation'}. 
          Include detailed episodes, scenes, visual descriptions, character movements, and synchronized audio/voiceover prompts. 
          Focus on narrative flow, temporal consistency, and high-quality production values. 
          For audio, specify the exact mood, instruments, and SFX cues. For voiceover, provide the full script with emotional markers.`;
          responseSchema = ANIMATION_SCHEMA;
          break;
        case 'character':
          defaultSystemInstruction = "You are a character designer and storyteller. Create a detailed character profile with stats, backstory, and a distinct visual identity. Ensure the character feels alive and has depth.";
          responseSchema = CHARACTER_SCHEMA;
          break;
        case 'googleai':
          defaultSystemInstruction = "You are an expert in Google AI Studio and Gemini API. Generate a complete web application that leverages the full power of Gemini AI, including multimodal inputs and advanced reasoning.";
          responseSchema = GOOGLE_AI_APP_SCHEMA;
          break;
        case 'imagegen':
          defaultSystemInstruction = "You are an AI Image Prompt Engineer and digital artist. Create highly detailed, evocative prompts for various styles. Focus on composition, lighting, texture, and mood to ensure breathtaking results.";
          responseSchema = IMAGE_GEN_SCHEMA;
          break;
        case 'voiceover':
          defaultSystemInstruction = "You are a voiceover director and script writer. Create emotional, engaging scripts with clear tone indicators and pacing instructions for AI voice generation.";
          responseSchema = VOICEOVER_SCHEMA;
          break;
        case 'story':
          defaultSystemInstruction = "You are a creative writer and novelist. Generate engaging stories with complex plots, well-developed characters, and rich world-building. Focus on narrative arc and emotional resonance.";
          responseSchema = STORY_WRITER_SCHEMA;
          break;
        case 'studio':
          defaultSystemInstruction = "You are a Studio Director and production manager. Generate a full project structure with scenes, characters, and assets. Ensure the project is organized and ready for the animation studio editor.";
          responseSchema = STUDIO_PROJECT_SCHEMA;
          break;
        case 'veo3':
          defaultSystemInstruction = "You are a Veo 3.1 Video Architect. Generate a high-fidelity video production manifest with advanced temporal consistency and cinematic quality. Focus on high-resolution details and fluid motion.";
          responseSchema = VEO3_SCHEMA;
          break;
        case 'gemini3':
          defaultSystemInstruction = "You are Gemini 3 Flash Preview, the pinnacle of high-speed reasoning. Solve complex tasks with precision, providing structured solutions and deep insights. Focus on efficiency and accuracy.";
          responseSchema = GEMINI3_SCHEMA;
          break;
        case 'caffeine':
          defaultSystemInstruction = "You are Caffeine AI, a master of real-time audio and sound design. Design immersive audio experiences and musical compositions that evoke specific moods and atmospheres.";
          responseSchema = CAFFEINE_SCHEMA;
          break;
        case 'udio':
          defaultSystemInstruction = "You are Udio AI, a professional music producer and songwriter. Compose high-quality music with lyrics, arrangement, and production notes. Focus on musicality and professional sound.";
          responseSchema = UDIO_SCHEMA;
          break;
      }

      const finalSystemInstruction = `${systemInstruction || defaultSystemInstruction}\n\n[SECURITY PROTOCOL: ${safetyLevel} SAFETY]\n[ENCRYPTION: ${quantumEncryption ? 'AES-Q2040' : 'NONE'}]`;

      const result = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: finalSystemInstruction,
          responseMimeType: "application/json",
          responseSchema,
          temperature,
          topP,
          topK,
          maxOutputTokens
        }
      });

      const data = JSON.parse(result.text || "{}");
      setOutput(data);

      // Save to DB
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Math.random().toString(36).substr(2, 9),
          name: data.appName || data.title || data.agentName || data.projectName || "Untitled Project",
          type: activeEngine,
          content: JSON.stringify(data)
        })
      });
      fetchProjects();

    } catch (error: any) {
      console.error("Generation failed:", error);
      setError(error.message || "An unexpected error occurred during manifestation.");
    } finally {
      setIsGenerating(false);
    }
  };

  if (viewMode === 'studio') {
    return (
      <div className="fixed inset-0 bg-[#0a0a0a] text-white flex flex-col overflow-hidden z-[100]">
        {/* Studio Header */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#141414]">
          <div className="flex items-center gap-4">
            <button onClick={() => setViewMode('dashboard')} className="p-2 hover:bg-white/5 rounded-lg">
              <Undo2 size={20} className="text-white/60" />
            </button>
            <div className="flex items-center gap-2">
              <Settings size={16} className="text-white/40" />
              <Sun size={16} className="text-titan-gold" />
              <span className="text-xs font-mono text-white/40">v76.3.7</span>
              <span className="text-[10px] font-mono text-white/20 ml-2">13495416</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <History size={18} className="text-white/40" />
              <Save size={18} className="text-white/40" />
              <ImageIcon size={18} className="text-white/40" />
            </div>
            <button 
              onClick={() => {
                setEditingProject({ id: 'studio-manifest', name: 'Studio Manifest', content: JSON.stringify(studioProject, null, 2) });
                setEditContent(JSON.stringify(studioProject, null, 2));
              }}
              className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold hover:bg-white/10 transition-colors"
            >
              <FileJson size={16} className="text-titan-blue" />
              MANIFEST
            </button>
            <button className="bg-titan-blue px-4 py-1.5 rounded-lg flex items-center gap-2 text-sm font-bold shadow-[0_0_15px_rgba(0,243,255,0.3)]">
              <Download size={16} />
              DOWNLOAD
            </button>
          </div>
        </div>

        {/* Studio Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Toolbar */}
          <div className="w-16 border-r border-white/10 flex flex-col items-center py-4 gap-6 bg-[#141414]">
            <ToolbarIcon icon={<User size={20} />} label="Character" onClick={() => setStudioTab('characters')} />
            <ToolbarIcon icon={<Folder size={20} />} label="Media" onClick={() => setStudioTab('assets')} />
            <ToolbarIcon icon={<LayoutTemplate size={20} />} label="Templates" onClick={() => setShowTemplates(true)} />
            <ToolbarIcon icon={<ImageIcon size={20} />} label="Image Gen" isAI />
            <ToolbarIcon icon={<Video size={20} />} label="Video Gen" isAI />
            <ToolbarIcon icon={<Mic size={20} />} label="AI Voice" isAI />
            <ToolbarIcon icon={<Bot size={20} />} label="AI Character" isAI />
            <ToolbarIcon icon={<Thermometer size={20} />} label="Conditions" onClick={() => setStudioTab('conditions')} />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col bg-black">
            <div className="flex-1 relative flex items-center justify-center">
              <div className="w-[85%] aspect-video bg-[#1a1a1a] border border-white/10 rounded-lg shadow-2xl overflow-hidden relative group">
                {/* Background Layer */}
                <div className="absolute inset-0 opacity-40">
                  <img src="https://picsum.photos/seed/studio-bg/1280/720" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                
                {/* Character Layer (Simulated) */}
                <motion.div 
                  animate={{ x: transformX - 400, y: transformY - 225, scale: scale }}
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                >
                  <div className="flex gap-12">
                    <div className="w-32 h-64 bg-titan-blue/20 border-2 border-titan-blue/40 rounded-3xl flex items-center justify-center backdrop-blur-sm relative">
                      <User size={48} className="text-titan-blue" />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-titan-blue uppercase whitespace-nowrap">Character A</div>
                    </div>
                    <div className="w-32 h-64 bg-titan-purple/20 border-2 border-titan-purple/40 rounded-3xl flex items-center justify-center backdrop-blur-sm relative">
                      <User size={48} className="text-titan-purple" />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-bold text-titan-purple uppercase whitespace-nowrap">Character B</div>
                    </div>
                  </div>
                </motion.div>

                {/* Overlay Effects */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

                {studioProject?.scenes?.[activeSceneIndex] ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden">
                    <img 
                      src={`https://picsum.photos/seed/${studioProject.scenes[activeSceneIndex].background || 'village'}/1280/720`} 
                      className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[2px]"
                      alt="Background"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                    
                    {/* Simulated Character Layer */}
                    <motion.div 
                      animate={{ x: transformX - 400, y: transformY - 225, scale }}
                      className="relative z-10 w-48 h-64 bg-titan-blue/20 border-2 border-titan-blue/40 rounded-3xl flex flex-col items-center justify-center backdrop-blur-md shadow-[0_0_50px_rgba(0,195,255,0.2)]"
                    >
                      <Bot size={64} className="text-titan-blue mb-4 animate-bounce" />
                      <div className="px-3 py-1 bg-titan-blue text-titan-black text-[10px] font-bold rounded-full uppercase">
                        {studioProject.scenes[activeSceneIndex].characters?.[0] || "Character_01"}
                      </div>
                    </motion.div>

                    <div className="absolute bottom-12 left-0 w-full px-12 text-center z-20">
                      <p className="text-white/80 max-w-lg mx-auto leading-relaxed text-sm drop-shadow-md font-medium italic">
                        {studioProject.scenes[activeSceneIndex].dialogue || "No dialogue for this scene."}
                      </p>
                      {studioProject.scenes[activeSceneIndex].voiceoverScript && (
                        <div className="mt-4 flex items-center justify-center gap-2 text-titan-green text-[10px] font-bold uppercase tracking-widest">
                          <Mic size={12} />
                          <span>VO: {studioProject.scenes[activeSceneIndex].voiceoverScript}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full bg-gradient-to-br from-titan-blue/5 to-transparent flex items-center justify-center">
                      <span className="text-white/10 font-mono tracking-[0.2em]">PREVIEW_CANVAS_ACTIVE</span>
                    </div>
                  </div>
                )}
                
                {/* Canvas Overlays */}
                <div className="absolute top-4 left-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="px-2 py-1 bg-black/60 rounded text-[10px] font-mono border border-white/10">1920x1080</div>
                  <div className="px-2 py-1 bg-titan-blue/20 text-titan-blue rounded text-[10px] font-mono border border-titan-blue/30">LIVE</div>
                </div>
              </div>

              {/* Playback Controls Overlay */}
              <div className="w-full bg-[#1a1a1a] border-t border-white/5 px-4 py-2 flex items-center justify-between">
                <div className="text-sm font-mono text-white/60">00:00</div>
                <div className="flex items-center gap-6">
                  <Undo2 size={18} className="text-white/40 hover:text-white cursor-pointer rotate-180" />
                  <Play size={22} className="text-white hover:scale-110 transition-transform cursor-pointer" fill="currentColor" />
                  <MonitorPlay size={18} className="text-white/40 hover:text-white cursor-pointer" />
                  <Undo2 size={18} className="text-white/40 hover:text-white cursor-pointer" />
                </div>
                <div className="flex items-center gap-4">
                  <Search size={18} className="text-white/40 hover:text-white cursor-pointer" />
                  <Maximize2 size={18} className="text-white/40 hover:text-white cursor-pointer" />
                  <History size={18} className="text-white/40 hover:text-white cursor-pointer" />
                </div>
              </div>

              {/* Secondary Toolbar */}
              <div className="w-full bg-[#141414] border-t border-white/5 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Layers size={16} className="text-white/40 hover:text-white cursor-pointer" />
                  <Sword size={16} className="text-white/40 hover:text-white cursor-pointer" />
                  <Video size={16} className="text-white/40 hover:text-white cursor-pointer" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-1 text-[10px] font-mono text-white/40">
                    <span>1x</span>
                    <ChevronRight size={12} />
                  </div>
                  <div className="flex items-center gap-4">
                    <Undo2 size={16} className="text-white/40 hover:text-white cursor-pointer" />
                    <Redo2 size={16} className="text-white/40 hover:text-white cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-4">
                    <Minus size={16} className="text-white/40 hover:text-white cursor-pointer" onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))} />
                    <Plus size={16} className="text-white/40 hover:text-white cursor-pointer" onClick={() => setScale(prev => Math.min(3, prev + 0.1))} />
                  </div>
                  <Maximize2 size={16} className="text-white/40 hover:text-white cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="h-72 border-t border-white/10 bg-[#141414] flex flex-col">
              <div className="h-12 border-b border-white/5 flex items-center px-2 justify-between bg-[#1a1a1a]">
                <div className="flex items-center gap-2">
                  <button className="p-1 hover:bg-white/5 rounded text-white/40" onClick={() => setActiveSceneIndex(prev => Math.max(0, prev - 1))}><ChevronLeft size={16} /></button>
                  <div className="flex items-center">
                    {studioProject?.scenes?.map((scene: any, i: number) => (
                      <div 
                        key={scene.id || i}
                        onClick={() => setActiveSceneIndex(i)}
                        className={`flex items-center gap-2 px-4 py-2 cursor-pointer transition-all border-r border-white/5 ${activeSceneIndex === i ? 'bg-white text-black' : 'bg-transparent text-white/40 hover:text-white'}`}
                      >
                        <span className="text-xs font-bold">Scene {i + 1}</span>
                        <MoreVertical size={14} className={activeSceneIndex === i ? 'text-black/40' : 'text-white/20'} />
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={handleAddScene}
                    className="text-xs font-bold text-white/40 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <Plus size={16} />
                    New Scene
                  </button>
                  <button className="p-1 hover:bg-white/5 rounded text-white/40" onClick={() => setActiveSceneIndex(prev => Math.min((studioProject?.scenes?.length || 1) - 1, prev + 1))}><ChevronRight size={16} /></button>
                </div>
                <div className="flex items-center gap-6 text-white/40">
                  <div className="flex items-center gap-2">
                    <History size={14} />
                    <span className="text-[10px] font-mono">00:00:00</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Minus size={18} className="hover:text-white cursor-pointer" />
                    <div className="w-32 h-1 bg-white/10 rounded-full relative">
                      <div className="absolute inset-y-0 left-0 w-1/2 bg-titan-blue rounded-full" />
                    </div>
                    <Plus size={18} className="hover:text-white cursor-pointer" />
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto relative bg-black/20 custom-scrollbar">
                <div className="absolute top-0 left-0 w-full h-full flex pointer-events-none">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="min-w-[150px] border-r border-white/5 p-2 flex flex-col">
                      <span className="text-[9px] font-mono text-white/20">{i * 10}s</span>
                      <div className="flex-1 border-r border-white/5 mt-2" />
                    </div>
                  ))}
                </div>
                
                {/* Layered Timeline Tracks */}
                <div className="mt-12 px-4 space-y-1 pb-8">
                  {[
                    { name: 'Village Mix', color: 'titan-blue', icon: <ImageIcon size={14} />, width: 450, engine: 'animation' },
                    { name: 'Comic Mist', color: 'titan-purple', icon: <Layers size={14} />, width: 320, engine: 'character' },
                    { name: 'Night Fin', color: 'titan-green', icon: <Mic size={14} />, width: 380, engine: 'voiceover' },
                    { name: 'Night Sky', color: 'titan-red', icon: <Box size={14} />, width: 520, engine: 'game' }
                  ].map((track, i) => (
                    <div key={i} className="flex items-center gap-4 group">
                      <div className="w-32 flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-tighter">
                        <span className={`text-${track.color}`}>{track.icon}</span>
                        {track.name}
                      </div>
                      <div 
                        onClick={() => {
                          setActiveEngine(track.engine as Engine);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                          setToast({ message: `Switched to ${track.engine.toUpperCase()} engine`, type: 'info' });
                        }}
                        className="flex-1 relative h-10 bg-white/5 rounded-lg border border-white/5 overflow-hidden cursor-pointer"
                      >
                        <div 
                          className={`absolute inset-y-0 left-[150px] bg-${track.color}/10 border border-${track.color}/30 rounded-md flex items-center px-3 group-hover:bg-${track.color}/20 transition-colors`}
                          style={{ width: track.width }}
                        >
                          <div className="text-[9px] font-bold truncate">TRACK_SEGMENT_{i+1}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Playhead */}
                <div className="absolute top-0 left-[150px] bottom-0 w-[2px] bg-titan-red shadow-[0_0_10px_rgba(255,68,68,0.8)] z-10">
                  <div className="absolute -top-1 -left-1.5 w-4 h-4 bg-titan-red rotate-45" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-80 border-l border-white/10 bg-[#141414] flex flex-col">
            <div className="flex border-b border-white/10">
              <button 
                onClick={() => setStudioTab('transform')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${studioTab === 'transform' ? 'text-titan-blue border-b-2 border-titan-blue bg-white/5' : 'text-white/40 hover:text-white'}`}
              >
                Transform
              </button>
              <button 
                onClick={() => setStudioTab('properties')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${studioTab === 'properties' ? 'text-titan-blue border-b-2 border-titan-blue bg-white/5' : 'text-white/40 hover:text-white'}`}
              >
                Properties
              </button>
              <button 
                onClick={() => setStudioTab('characters')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${studioTab === 'characters' ? 'text-titan-blue border-b-2 border-titan-blue bg-white/5' : 'text-white/40 hover:text-white'}`}
              >
                Characters
              </button>
              <button 
                onClick={() => setStudioTab('assets')}
                className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${studioTab === 'assets' ? 'text-titan-blue border-b-2 border-titan-blue bg-white/5' : 'text-white/40 hover:text-white'}`}
              >
                Assets
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {studioTab === 'transform' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-mono text-white/40 uppercase tracking-widest">Transform</h4>
                    <X size={14} className="text-white/20" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40 uppercase">X Position</span>
                        <span className="text-titan-blue">{transformX.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="800" value={transformX} 
                        onChange={(e) => setTransformX(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-titan-blue" 
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40 uppercase">Y Position</span>
                        <span className="text-titan-blue">{transformY.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" min="0" max="450" value={transformY} 
                        onChange={(e) => setTransformY(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-titan-blue" 
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-white/40 uppercase">Scale</span>
                        <span className="text-titan-blue">{scale.toFixed(2)}</span>
                      </div>
                      <input 
                        type="range" min="0.1" max="3" step="0.01" value={scale} 
                        onChange={(e) => setScale(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-titan-blue" 
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5 grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => {
                        setTransformX(400);
                        setTransformY(225);
                        setScale(1.0);
                      }}
                      className="py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase hover:bg-white/10 transition-colors"
                    >
                      Reset
                    </button>
                    <button 
                      onClick={handleApplyTransform}
                      className="py-2 bg-titan-blue text-titan-black rounded-lg text-[10px] font-bold uppercase hover:scale-105 transition-transform"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}

              {studioTab === 'properties' && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Scene Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-titan-blue outline-none transition-colors" 
                      value={studioProject?.scenes?.[activeSceneIndex]?.name || "Untitled Scene"}
                      onChange={(e) => {
                        const newScenes = [...studioProject.scenes];
                        newScenes[activeSceneIndex].name = e.target.value;
                        setStudioProject({ ...studioProject, scenes: newScenes });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Duration</label>
                    <div className="flex items-center gap-3">
                      <input 
                        type="number" 
                        className="flex-1 bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-titan-blue outline-none transition-colors" 
                        value={studioProject?.scenes?.[activeSceneIndex]?.duration || 20}
                        onChange={(e) => {
                          const newScenes = [...studioProject.scenes];
                          newScenes[activeSceneIndex].duration = parseInt(e.target.value);
                          setStudioProject({ ...studioProject, scenes: newScenes });
                        }}
                      />
                      <span className="text-xs text-white/40 font-mono">SEC</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Dialogue</label>
                    <textarea 
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-titan-blue outline-none transition-colors h-24 resize-none" 
                      value={studioProject?.scenes?.[activeSceneIndex]?.dialogue || ""}
                      onChange={(e) => {
                        const newScenes = [...studioProject.scenes];
                        newScenes[activeSceneIndex].dialogue = e.target.value;
                        setStudioProject({ ...studioProject, scenes: newScenes });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Voiceover Script</label>
                    <textarea 
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-titan-blue outline-none transition-colors h-24 resize-none" 
                      value={studioProject?.scenes?.[activeSceneIndex]?.voiceoverScript || ""}
                      onChange={(e) => {
                        const newScenes = [...studioProject.scenes];
                        newScenes[activeSceneIndex].voiceoverScript = e.target.value;
                        setStudioProject({ ...studioProject, scenes: newScenes });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider">Audio Prompt (Music/SFX)</label>
                    <input 
                      type="text" 
                      className="w-full bg-black border border-white/10 rounded-lg p-3 text-sm focus:border-titan-blue outline-none transition-colors" 
                      value={studioProject?.scenes?.[activeSceneIndex]?.audioPrompt || ""}
                      onChange={(e) => {
                        const newScenes = [...studioProject.scenes];
                        newScenes[activeSceneIndex].audioPrompt = e.target.value;
                        setStudioProject({ ...studioProject, scenes: newScenes });
                      }}
                    />
                  </div>
                  <div className="pt-4 border-t border-white/5">
                    <label className="text-[10px] font-bold text-white/40 uppercase tracking-wider mb-3 block">Background Style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['Village', 'City', 'Forest', 'Interior'].map(bg => (
                        <button key={bg} className="p-2 text-xs bg-white/5 border border-white/10 rounded hover:bg-white/10 transition-colors">{bg}</button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {studioTab === 'characters' && (
                <div className="space-y-6">
                  {selectedCharacter ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                      <button 
                        onClick={() => setSelectedCharacter(null)}
                        className="flex items-center gap-2 text-xs text-titan-blue hover:underline mb-4"
                      >
                        <Undo2 size={14} /> BACK TO LIST
                      </button>
                      <div className="flex items-center gap-4 p-4 glass rounded-xl border-titan-blue/30">
                        <div className="w-16 h-16 bg-titan-blue/20 rounded-lg flex items-center justify-center">
                          <User size={32} className="text-titan-blue" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg">{selectedCharacter.name}</h4>
                          <span className="text-[10px] px-2 py-0.5 bg-titan-blue text-titan-black font-bold rounded uppercase">Selected</span>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                          <input type="text" placeholder="Search Animations..." className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs" />
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          {['Side Pose', 'Front Pose', 'Back Pose'].map(pose => (
                            <button key={pose} className="py-2 text-[10px] font-bold bg-white/5 border border-white/10 rounded hover:bg-titan-blue/20 hover:border-titan-blue transition-all">{pose}</button>
                          ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          {['Idle', 'Idle Happy', 'Walk', 'Run', 'Jogging', 'Sitting', 'Lookaround', 'Speaker', 'Listener'].map(anim => (
                            <div key={anim} className="p-3 bg-black border border-white/10 rounded-lg hover:border-titan-blue cursor-pointer group transition-all">
                              <div className="w-full aspect-square bg-white/5 rounded mb-2 flex items-center justify-center">
                                <Move size={20} className="text-white/20 group-hover:text-titan-blue" />
                              </div>
                              <div className="text-[10px] font-bold text-center group-hover:text-titan-blue">{anim}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm uppercase tracking-widest text-white/60">Characters</h4>
                        <div className="flex gap-2">
                          <button className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Plus size={16} /></button>
                          <button className="p-1.5 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors"><Share size={16} /></button>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
                        <input type="text" placeholder="Search Characters..." className="w-full bg-black border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs focus:border-titan-blue outline-none" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {['Desi', 'Western', 'Indonesian', 'Village', 'Birds', 'Animals', 'Vehicles', 'Religious', 'Horror'].map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-titan-blue/20 hover:border-titan-blue cursor-pointer transition-all">{tag}</span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {[{ name: 'Senapati', id: '1' }, { name: 'Villager', id: '2' }, { name: 'Boy', id: '3' }, { name: 'Girl', id: '4' }].map(char => (
                          <div 
                            key={char.id} 
                            onClick={() => setSelectedCharacter(char)}
                            className="p-4 bg-black border border-white/10 rounded-xl hover:border-titan-blue cursor-pointer group transition-all relative"
                          >
                            <div className="w-full aspect-[3/4] bg-white/5 rounded-lg mb-3 flex items-center justify-center">
                              <User size={40} className="text-white/10 group-hover:text-titan-blue/40" />
                            </div>
                            <div className="text-xs font-bold text-center group-hover:text-titan-blue">{char.name}</div>
                            <button className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-titan-blue/20 transition-all">
                              <Edit3 size={12} className="text-titan-blue" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {studioTab === 'assets' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm uppercase tracking-widest text-white/60">Asset Library</h4>
                    <button className="p-2 bg-titan-blue/10 text-titan-blue rounded-lg hover:bg-titan-blue/20 transition-colors">
                      <Download size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {['Backgrounds', 'Props', 'Music', 'SFX', 'VFX', 'UI Elements'].map(cat => (
                      <div key={cat} className="p-4 glass border border-white/10 rounded-xl hover:border-titan-blue cursor-pointer transition-all">
                        <div className="text-xs font-bold">{cat}</div>
                        <div className="text-[10px] text-white/40">24 Items</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="h-20 border-t border-white/10 bg-[#141414] flex items-center justify-start gap-4 px-4 overflow-x-auto scrollbar-hide relative">
          <ToolbarIcon icon={<User size={18} />} label="Character" />
          <ToolbarIcon icon={<Folder size={18} />} label="Media" />
          <ToolbarIcon icon={<LayoutTemplate size={18} />} label="Templates" />
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <ToolbarIcon icon={<ImageIcon size={18} />} label="Image Gen" isAI />
          <ToolbarIcon icon={<Video size={18} />} label="Video Gen" isAI />
          <ToolbarIcon icon={<Mic size={18} />} label="AI Voice" isAI />
          <ToolbarIcon icon={<Bot size={18} />} label="AI Character" isAI />
          <ToolbarIcon icon={<Monitor size={18} />} label="AI Thumbnail" isAI />
          <ToolbarIcon icon={<Library size={18} />} label="Asset Library" isAI />
          <ToolbarIcon icon={<Sword size={18} />} label="AI Prop" isAI />
          <div className="h-8 w-[1px] bg-white/10 mx-2" />
          <ToolbarIcon icon={<Wand2 size={18} />} label="Effects" />
          <ToolbarIcon icon={<Music size={18} />} label="Music" />
          <ToolbarIcon icon={<Move size={18} />} label="Anim IK" />
          <ToolbarIcon icon={<TypeIcon size={18} />} label="Text" />
          
          {/* Floating Chat Button */}
          <div className="fixed bottom-24 right-6 z-[110]">
            <div className="w-14 h-14 bg-titan-blue rounded-full shadow-[0_0_20px_rgba(0,243,255,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <Bot size={28} className="text-titan-black" />
            </div>
          </div>
        </div>

        {/* Monetization Modal */}
        <AnimatePresence>
          {showMonetization && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
                  <h3 className="text-xl font-display font-bold">Revenue Configuration</h3>
                  <button onClick={() => setShowMonetization(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X size={24} className="text-white/40" />
                  </button>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Basic Tier</span>
                        <span className="text-titan-blue">$9/mo</span>
                      </div>
                      <p className="text-xs text-white/40">Standard access to all AI engines with 100 manifestations/mo.</p>
                    </div>
                    <div className="p-4 bg-titan-blue/10 rounded-xl border border-titan-blue/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-titan-blue">Pro Tier</span>
                        <span className="text-titan-blue">$29/mo</span>
                      </div>
                      <p className="text-xs text-white/60">Unlimited manifestations, priority processing, and Studio access.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold">Enterprise</span>
                        <span className="text-titan-blue">Custom</span>
                      </div>
                      <p className="text-xs text-white/40">Dedicated AI nodes, custom schemas, and 24/7 support.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowMonetization(false)}
                    className="w-full py-3 bg-titan-blue text-titan-black font-bold rounded-xl hover:scale-105 transition-transform"
                  >
                    Save Strategy
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Templates Modal */}
        <AnimatePresence>
          {showTemplates && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/80 backdrop-blur-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="w-full max-w-4xl bg-[#141414] border border-white/10 rounded-3xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-[#1a1a1a]">
                  <div>
                    <h3 className="text-xl font-display font-bold">Use templates to create project faster</h3>
                    <p className="text-xs text-white/40 mt-1">Select a pre-built scene to jumpstart your manifestation</p>
                  </div>
                  <button onClick={() => setShowTemplates(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <X size={24} className="text-white/40" />
                  </button>
                </div>
                
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                    {['All', 'Horror', 'Moral', 'Office', 'Story', 'Explainer', 'Educational'].map(cat => (
                      <button key={cat} className={`px-6 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${cat === 'All' ? 'bg-white text-black' : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'}`}>
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="relative">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                    <input type="text" placeholder="Search Scenes..." className="w-full bg-black border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:border-titan-blue outline-none" />
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {['Village', 'City', 'Horror', 'Moral', 'Rhyme', 'Animal', 'Bird', 'Fairy tales', 'Village interior', 'Village exterior', 'Intro', 'Opening scene', 'Seasonal'].map(tag => (
                      <span key={tag} className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-bold hover:bg-titan-blue/20 hover:border-titan-blue cursor-pointer transition-all">{tag}</span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="group cursor-pointer">
                      <div className="aspect-video bg-black border-2 border-titan-blue rounded-2xl flex flex-col items-center justify-center gap-3 relative overflow-hidden">
                        <Plus size={32} className="text-titan-blue" />
                        <span className="text-sm font-bold">Blank Scene</span>
                        <div className="absolute top-3 right-3 w-5 h-5 bg-titan-blue rounded-full flex items-center justify-center">
                          <Zap size={12} className="text-titan-black" fill="currentColor" />
                        </div>
                      </div>
                    </div>
                    {[
                      { name: 'Kirana Shop Closed', tag: 'Village' },
                      { name: 'Village Morning', tag: 'Village' },
                      { name: 'Christmas Party', tag: 'Seasonal', premium: true },
                      { name: 'Dark Alleyway', tag: 'Horror' },
                      { name: 'Office Meeting', tag: 'Office' }
                    ].map((template, i) => (
                      <div key={i} className="group cursor-pointer space-y-3">
                        <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative group-hover:border-titan-blue transition-all">
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <span className="text-[10px] font-bold px-2 py-1 bg-titan-blue text-titan-black rounded uppercase">Preview</span>
                          </div>
                          {template.premium && (
                            <div className="absolute top-3 left-3 px-2 py-1 bg-titan-gold text-titan-black text-[9px] font-bold rounded flex items-center gap-1">
                              <Shield size={10} /> PREMIUM
                            </div>
                          )}
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon size={40} className="text-white/5 group-hover:text-titan-blue/20 transition-colors" />
                          </div>
                        </div>
                        <div className="text-sm font-bold group-hover:text-titan-blue transition-colors">{template.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-[#1a1a1a] flex justify-end">
                  <button 
                    onClick={() => setShowTemplates(false)}
                    className="px-12 py-3 bg-titan-blue text-titan-black font-bold rounded-xl hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.4)]"
                  >
                    Apply Scene
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-titan-black text-white selection:bg-titan-blue/30">
      <div className="scanline" />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full h-16 glass z-40 flex items-center justify-between px-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-titan-blue rounded-lg flex items-center justify-center neon-border">
            <Cpu className="text-titan-black" />
          </div>
          <span className="font-display font-bold text-xl tracking-tighter neon-text">TITAN-OMNI <span className="text-titan-blue">2040</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-xs font-mono text-titan-blue/60">
            <Activity size={14} />
            <span>SYSTEM STATUS: OPTIMAL</span>
          </div>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <Settings size={20} className="text-white/60" />
          </button>
        </div>
      </nav>

      <main className="pt-24 pb-12 px-8 max-w-[1800px] mx-auto grid grid-cols-12 gap-8">
        
        {/* Sidebar Engines */}
        <div className="col-span-2 space-y-4">
          <h2 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-6">Core Engines</h2>
          <EngineButton 
            active={activeEngine === 'dashboard'} 
            onClick={() => setActiveEngine('dashboard')}
            icon={<Layout size={20} />}
            label="Dashboard"
            desc="System Overview"
          />
          <EngineButton 
            active={activeEngine === 'video'} 
            onClick={() => setActiveEngine('video')}
            icon={<Video size={20} />}
            label="Video Engine"
            desc="Cinematic AI Generation"
          />
          <EngineButton 
            active={activeEngine === 'agent'} 
            onClick={() => setActiveEngine('agent')}
            icon={<Bot size={20} />}
            label="Agent Builder"
            desc="Autonomous Intelligence"
          />
          <EngineButton 
            active={activeEngine === 'app'} 
            onClick={() => setActiveEngine('app')}
            icon={<Layout size={20} />}
            label="App Builder"
            desc="SaaS & Web Platforms"
          />
          <EngineButton 
            active={activeEngine === 'game'} 
            onClick={() => setActiveEngine('game')}
            icon={<Gamepad2 size={20} />}
            label="Game Engine"
            desc="2D/3D Interactive Worlds"
          />
          <EngineButton 
            active={activeEngine === 'saas'} 
            onClick={() => setActiveEngine('saas')}
            icon={<Globe size={20} />}
            label="SaaS Builder"
            desc="Multi-tenant Platforms"
          />
          <EngineButton 
            active={activeEngine === 'autodraft'} 
            onClick={() => setActiveEngine('autodraft')}
            icon={<Sparkles size={20} />}
            label="AUTO-DRAFT AI"
            desc="Full Autonomous Manifest"
          />
          <EngineButton 
            active={activeEngine === 'animation'} 
            onClick={() => setActiveEngine('animation')}
            icon={<Clapperboard size={20} />}
            label="2D Animation"
            desc="Frame Sequence Gen"
          />
          <EngineButton 
            active={activeEngine === 'character'} 
            onClick={() => setActiveEngine('character')}
            icon={<UserCircle size={20} />}
            label="Character Builder"
            desc="Avatar & Persona Gen"
          />
          <EngineButton 
            active={activeEngine === 'googleai'} 
            onClick={() => setActiveEngine('googleai')}
            icon={<Sparkles size={20} className="text-titan-gold" />}
            label="Google AI Builder"
            desc="Gemini-Powered Apps"
          />
          <EngineButton 
            active={activeEngine === 'imagegen'} 
            onClick={() => setActiveEngine('imagegen')}
            icon={<ImageIcon size={20} className="text-titan-purple" />}
            label="AI Image Gen"
            desc="Vibrant Webtoons & Art"
          />
          <EngineButton 
            active={activeEngine === 'voiceover'} 
            onClick={() => setActiveEngine('voiceover')}
            icon={<Mic size={20} className="text-titan-green" />}
            label="AI Voiceover"
            desc="Lifelike Narration"
          />
          <EngineButton 
            active={activeEngine === 'story'} 
            onClick={() => setActiveEngine('story')}
            icon={<BookOpen size={20} className="text-titan-red" />}
            label="AI Story Writer"
            desc="Engaging Narratives"
          />
          <EngineButton 
            active={activeEngine === 'studio'} 
            onClick={() => setActiveEngine('studio')}
            icon={<MonitorPlay size={20} className="text-titan-blue" />}
            label="Animation Studio"
            desc="Full Creative Suite"
          />
          <EngineButton 
            active={activeEngine === 'veo3'} 
            onClick={() => setActiveEngine('veo3')}
            icon={<Video size={20} className="text-titan-purple" />}
            label="Veo 3 Maker"
            desc="High-Fidelity Video"
          />
          <EngineButton 
            active={activeEngine === 'gemini3'} 
            onClick={() => setActiveEngine('gemini3')}
            icon={<Cpu size={20} className="text-titan-blue" />}
            label="Gemini 3 Flash"
            desc="High-Speed Reasoning"
          />
          <EngineButton 
            active={activeEngine === 'caffeine'} 
            onClick={() => setActiveEngine('caffeine')}
            icon={<Music size={20} className="text-titan-green" />}
            label="Caffeine AI"
            desc="Real-time Audio"
          />
          <EngineButton 
            active={activeEngine === 'udio'} 
            onClick={() => setActiveEngine('udio')}
            icon={<Volume2 size={20} className="text-titan-red" />}
            label="Udio AI Maker"
            desc="Professional Music"
          />
          
          <div className="mt-12 p-6 glass rounded-2xl border-titan-blue/20 border">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-titan-blue" />
              <span className="font-display font-bold">Monetization Engine</span>
            </div>
            <p className="text-sm text-white/60 mb-4">Auto-generate subscription models and pricing tiers for your creations.</p>
            <button 
              onClick={() => setShowMonetization(true)}
              className="w-full py-2 bg-titan-blue/10 border border-titan-blue/30 text-titan-blue rounded-lg text-sm font-medium hover:bg-titan-blue/20 transition-all"
            >
              Configure Revenue
            </button>
          </div>
        </div>

        {/* Main Workspace */}
        <div className={`${showConfig ? 'col-span-7' : 'col-span-10'} space-y-6 transition-all duration-300`}>
          {!editingProject && activeEngine !== 'dashboard' && (
            <div className="glass rounded-3xl p-6 border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal size={16} className="text-titan-blue" />
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">System Instruction</span>
                  {systemInstruction && (
                    <button 
                      onClick={() => setSystemInstruction('')}
                      className="text-[9px] text-white/20 hover:text-titan-blue transition-colors ml-2"
                    >
                      RESET TO DEFAULT
                    </button>
                  )}
                </div>
                <button 
                  onClick={() => setShowConfig(!showConfig)}
                  className={`p-2 rounded-lg transition-all ${showConfig ? 'bg-titan-blue text-titan-black' : 'hover:bg-white/5 text-white/40'}`}
                >
                  <Settings size={18} />
                </button>
              </div>
              <textarea 
                value={systemInstruction}
                onChange={(e) => setSystemInstruction(e.target.value)}
                placeholder="Enter system instructions to guide the AI's behavior (e.g., 'You are a professional game developer...')"
                className="w-full h-24 bg-black/40 border border-white/5 rounded-xl p-4 text-sm font-mono focus:outline-none focus:border-titan-blue/30 transition-all resize-none"
              />
            </div>
          )}

          {editingProject ? (
            <div className="glass rounded-3xl p-8 border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">Edit: {editingProject.name}</h2>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2 bg-white/5 rounded-lg text-sm hover:bg-white/10"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-titan-blue text-titan-black font-bold rounded-lg text-sm flex items-center gap-2"
                  >
                    <Save size={16} /> SAVE CHANGES
                  </button>
                </div>
              </div>
              <textarea 
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-[500px] bg-titan-black/50 border border-white/10 rounded-2xl p-6 font-mono text-sm focus:outline-none focus:border-titan-blue/50 transition-all"
              />
            </div>
          ) : activeEngine === 'dashboard' ? (
            <div className="space-y-12">
              <div className="text-center space-y-4">
                <h1 className="text-5xl font-display font-bold">Bring Your Ideas to Life With AI</h1>
                <p className="text-white/40">Select a Tool & Get Started</p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div 
                  onClick={() => setViewMode('studio')}
                  className="p-8 glass rounded-3xl border-white/10 hover:border-titan-blue/50 transition-all cursor-pointer group relative overflow-hidden"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-titan-blue/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clapperboard size={32} className="text-titan-blue" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">Animation Studio</h3>
                      <p className="text-white/40">Drag, drop and animate with ready made characters</p>
                    </div>
                  </div>
                  <div className="mt-8 aspect-video bg-black/40 rounded-2xl border border-white/5 overflow-hidden">
                    <img src="https://picsum.photos/seed/studio/800/450" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div 
                    onClick={() => setActiveEngine('imagegen')}
                    className="p-6 glass rounded-3xl border-white/10 hover:border-titan-purple/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-titan-purple/20 rounded-xl flex items-center justify-center">
                        <ImageIcon size={24} className="text-titan-purple" />
                      </div>
                      <h3 className="font-bold">AI Image Generation</h3>
                    </div>
                    <p className="text-xs text-white/40 mb-6">Transform your ideas into vibrant webtoons</p>
                    <div className="aspect-[2/1] bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                      <img src="https://picsum.photos/seed/imagegen/400/200" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveEngine('voiceover')}
                    className="p-6 glass rounded-3xl border-white/10 hover:border-titan-green/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-titan-green/20 rounded-xl flex items-center justify-center">
                        <Mic size={24} className="text-titan-green" />
                      </div>
                      <h3 className="font-bold">AI Voiceover</h3>
                    </div>
                    <p className="text-xs text-white/40 mb-6">Add soul to your stories with lifelike narration</p>
                    <div className="h-20 flex items-center justify-center gap-1">
                      {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="w-1 bg-titan-green/40 rounded-full animate-pulse" style={{ height: `${Math.random() * 100}%` }} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div 
                    onClick={() => setActiveEngine('video')}
                    className="p-6 glass rounded-3xl border-white/10 hover:border-titan-blue/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-titan-blue/20 rounded-xl flex items-center justify-center">
                        <Video size={24} className="text-titan-blue" />
                      </div>
                      <h3 className="font-bold">AI Video</h3>
                    </div>
                    <p className="text-xs text-white/40 mb-6">Bring your imagination to motion with AI</p>
                    <div className="aspect-[2/1] bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                      <img src="https://picsum.photos/seed/video-thumb/400/200" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                    </div>
                  </div>

                  <div 
                    onClick={() => setActiveEngine('story')}
                    className="p-6 glass rounded-3xl border-white/10 hover:border-titan-red/50 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-titan-red/20 rounded-xl flex items-center justify-center">
                        <BookOpen size={24} className="text-titan-red" />
                      </div>
                      <h3 className="font-bold">AI Story Writer</h3>
                    </div>
                    <p className="text-xs text-white/40 mb-6">Create engaging stories with AI</p>
                    <div className="aspect-[2/1] bg-black/40 rounded-xl border border-white/5 overflow-hidden">
                      <img src="https://picsum.photos/seed/story-thumb/400/200" className="w-full h-full object-cover opacity-60" referrerPolicy="no-referrer" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Projects Section */}
              {projects.length > 0 && (
                <div className="space-y-6 pt-12">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-display font-bold">Recent Projects</h2>
                    <button className="text-sm text-titan-blue font-bold">View All</button>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {projects.slice(0, 3).map((project) => (
                      <div key={project.id} className="p-4 glass rounded-2xl border-white/10 flex items-center justify-between group hover:border-titan-blue/30 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center">
                            <Folder size={24} className="text-white/40" />
                          </div>
                          <div>
                            <div className="font-bold">{project.name}</div>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">{project.type} // {new Date(project.created_at).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              setEditingProject(project);
                              setEditContent(project.content);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteProject(project.id)}
                            className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-titan-red"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tutorials Section */}
              <div className="space-y-6 pt-12">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-display font-bold">Tutorials</h2>
                  <button className="text-sm text-titan-blue font-bold">View All</button>
                </div>
                <div className="flex gap-4">
                  {['English', 'Hindi', 'Bengali'].map(lang => (
                    <button 
                      key={lang}
                      onClick={() => setTutorialTab(lang)}
                      className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${tutorialTab === lang ? 'bg-white text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-6">
                  {[1, 2].map(i => (
                    <div key={i} className="space-y-3 group cursor-pointer">
                      <div className="aspect-video bg-white/5 rounded-2xl border border-white/10 overflow-hidden relative">
                        <img src={`https://picsum.photos/seed/tutorial${i}/600/337`} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                            <Play size={24} fill="white" />
                          </div>
                        </div>
                      </div>
                      <div className="font-bold group-hover:text-titan-blue transition-colors">How To Make Cartoon Animation Video With AI For...</div>
                      <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest">
                        <div className="w-4 h-4 bg-titan-blue rounded-full" />
                        Autodraft AI
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Models Section */}
              <div className="space-y-6 pt-12 pb-24">
                <h2 className="text-2xl font-display font-bold">AI Models</h2>
                  <div className="grid grid-cols-2 gap-6">
                    {[
                      { name: 'Village Style', desc: 'Capturing the authentic charm of rural Asia, this portrayal showcases mud huts, winding rivers, majestic peaks, and vibrant forests teeming with wildlife.' },
                      { name: 'Aesthetic Anime', desc: 'A mesmerizing background paired with beautiful characters creates a visually pleasing combination, forming the essence of this style.' },
                      { name: 'Kids Animation', desc: 'Flat images with cartoony structure, with bright colors and cartoon vectorish characters. This style is perfect for kids content.' },
                      { name: '3D Kids Animation', desc: '3D art style with bright, colorful, and highly polished, designed to appeal to young children.' },
                      { name: 'Painting Anime', desc: 'Beautiful classic anime painting backgrounds blended create stunning scenery and lovable characters.' },
                      { name: 'Thriller & Horror', desc: 'Dark, shadowy environments, or desolate landscapes, all contributing to an unsettling ambiance.' },
                      { name: 'Cartoon Backgrounds', desc: '2D kids cartoon backgrounds with vivid color houses, best suitable for kids animated videos and rhymes.' },
                      { name: 'Webtoon 3D', desc: 'Standard webtoon 3D background style, 3D trees, detailed houses and castles.' }
                    ].map((model, i) => (
                      <div key={i} className="glass rounded-3xl border-white/10 overflow-hidden group">
                        <div className="aspect-[4/3] bg-white/5 relative overflow-hidden">
                          <img src={`https://picsum.photos/seed/model${i}/600/450`} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                            <button 
                              onClick={() => {
                                setActiveEngine('animation');
                                setPrompt(`Generate a ${model.name} style animation: ${model.desc}`);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                setToast({ message: `Switched to Animation engine with ${model.name} style`, type: 'info' });
                              }}
                              className="flex-1 py-2 bg-titan-blue text-titan-black font-bold rounded-lg text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
                            >
                              <Zap size={14} /> GENERATE
                            </button>
                            <button className="px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-xs font-bold hover:bg-white/20 transition-colors">
                              View Gallery
                            </button>
                          </div>
                        </div>
                        <div className="p-6 space-y-2">
                          <h3 className="font-bold text-lg">{model.name}</h3>
                          <p className="text-xs text-white/40 leading-relaxed">{model.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          ) : activeEngine === 'video' ? (
            <div className="glass rounded-3xl p-8 border-white/10 space-y-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-display font-bold">AI Video Generator</h2>
                <button className="text-xs text-titan-blue hover:underline">Watch quick guide</button>
              </div>

              <div className="space-y-6">
                {/* Reference Image Upload */}
                <div 
                  onClick={() => document.getElementById('video-ref-upload')?.click()}
                  className="w-full aspect-video bg-white/5 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/10 transition-all relative overflow-hidden"
                >
                  {videoReferenceImage ? (
                    <img src={videoReferenceImage} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="p-4 bg-white/5 rounded-full mb-4">
                        <Upload size={24} className="text-white/40" />
                      </div>
                      <span className="text-sm font-bold">Upload Reference Image</span>
                      <span className="text-xs text-white/40 mt-1">Supports: PNG, JPG</span>
                    </>
                  )}
                  <input id="video-ref-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                </div>

                <div className="relative">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ex. river flowing, clouds moving, etc"
                    className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-titan-blue/50 transition-all resize-none font-sans"
                  />
                  <button 
                    onClick={() => setPrompt("A cinematic shot of a futuristic city with flying cars and neon lights, highly detailed, 8k resolution")}
                    className="absolute bottom-4 right-4 px-3 py-2 bg-titan-blue/10 text-titan-blue rounded-lg hover:bg-titan-blue/20 transition-all flex items-center gap-2 text-xs font-bold"
                  >
                    Generate Prompt <Zap size={14} />
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Video Styles</label>
                  <div className="grid grid-cols-4 gap-4">
                    {['None', '3D', 'Village', 'Anime'].map(style => (
                      <button 
                        key={style}
                        onClick={() => setVideoStyle(style)}
                        className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${videoStyle === style ? 'bg-titan-blue/20 border-titan-blue/50 text-titan-blue' : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'}`}
                      >
                        <div className="w-full aspect-square bg-black/40 rounded-lg" />
                        <span className="text-[10px] font-bold">{style}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Resolution</label>
                    <div className="flex gap-2">
                      {['720p', '1080p'].map(res => (
                        <button 
                          key={res}
                          onClick={() => setVideoResolution(res)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${videoResolution === res ? 'bg-titan-blue text-titan-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                          {res}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Aspect Ratio</label>
                    <div className="flex gap-2">
                      {['Landscape', 'Portrait'].map(ratio => (
                        <button 
                          key={ratio}
                          onClick={() => setVideoAspectRatio(ratio)}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${videoAspectRatio === ratio ? 'bg-titan-blue text-titan-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                        >
                          {ratio}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Duration</label>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-titan-blue uppercase tracking-tighter">Long-Form Mode</span>
                      <button 
                        onClick={() => setIsLongForm(!isLongForm)}
                        className={`w-10 h-5 rounded-full transition-colors relative ${isLongForm ? 'bg-titan-blue' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isLongForm ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(isLongForm ? ['1m', '5m', '10m', '30m', '1h', '5h', '10h'] : ['4s', '8s', '12s', '24s', '60s']).map(dur => (
                      <button 
                        key={dur}
                        onClick={() => setVideoDuration(dur)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${videoDuration === dur ? 'bg-titan-blue text-titan-black' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                      >
                        {dur}
                      </button>
                    ))}
                  </div>
                  {isLongForm && (
                    <div className="p-3 bg-titan-blue/10 border border-titan-blue/30 rounded-xl flex items-center gap-3">
                      <Zap size={16} className="text-titan-blue shrink-0" />
                      <p className="text-[10px] text-titan-blue font-bold leading-tight uppercase">
                        Quantum Long-Form Engine Active: Generating hierarchical production manifest for extended narratives.
                      </p>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleGenerateVideo}
                  disabled={isGeneratingVideo || !prompt}
                  className="w-full py-4 bg-titan-blue text-titan-black font-bold rounded-2xl flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isGeneratingVideo ? (
                    <div className="w-5 h-5 border-2 border-titan-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <MonitorPlay size={20} />
                  )}
                  {isGeneratingVideo ? 'GENERATING VIDEO...' : 'GENERATE VIDEO'}
                </button>

                {generatedVideoUrl && 
                  <div className="mt-8 space-y-4">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Generated Result</label>
                    <video src={generatedVideoUrl} controls className="w-full rounded-2xl border border-white/10 shadow-2xl" />
                    <div className="flex gap-4">
                      <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <Download size={18} /> DOWNLOAD
                      </button>
                      <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                        <Share2 size={18} /> SHARE
                      </button>
                    </div>
                  </div>
                }
              </div>
            </div>
          ) : (
            <>
              <div className="glass rounded-3xl p-8 border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <Zap size={24} className="text-titan-blue opacity-20" />
            </div>
            
            <h1 className="text-4xl font-display font-bold mb-2">
              What shall we <span className="text-titan-blue italic">manifest</span>?
            </h1>
            <p className="text-white/50 mb-8">TITAN-OMNI is ready to build your next empire. Describe your vision below.</p>
            
            <div className="relative">
              <textarea 
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe your ${activeEngine} vision...`}
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-6 text-lg focus:outline-none focus:border-titan-blue/50 transition-all resize-none font-sans"
              />
              <div className="absolute bottom-4 right-4 flex gap-3">
                {prompt && (
                  <button 
                    onClick={() => setPrompt('')}
                    className="p-3 bg-white/5 text-white/40 rounded-xl hover:bg-white/10 transition-all"
                    title="Clear Prompt"
                  >
                    <X size={20} />
                  </button>
                )}
                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !prompt}
                  className="px-8 py-3 bg-titan-blue text-titan-black font-bold rounded-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(0,243,255,0.3)]"
                >
                  {isGenerating ? (
                    <div className="w-5 h-5 border-2 border-titan-black border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Sparkles size={20} />
                  )}
                  {isGenerating ? 'PROCESSING...' : 'GENERATE'}
                </button>
              </div>
            </div>

            {/* Quick Prompts */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-mono text-white/20 uppercase tracking-widest">
                <Zap size={12} />
                <span>Expert Templates</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'High-Fidelity', prompt: 'Create a high-fidelity, production-ready manifest with advanced architectural patterns and optimized performance.' },
                  { label: 'Creative Vision', prompt: 'Generate a highly creative and innovative vision that pushes the boundaries of current technology and design.' },
                  { label: 'Enterprise Grade', prompt: 'Design an enterprise-grade solution with focus on security, scalability, and robust multi-tenant architecture.' },
                  { label: 'Minimalist MVP', prompt: 'Build a clean, minimalist MVP focusing on core functionality and exceptional user experience.' }
                ].map((template, i) => (
                  <button 
                    key={i}
                    onClick={() => setPrompt(template.prompt)}
                    className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white/40 hover:text-titan-blue hover:border-titan-blue/30 hover:bg-titan-blue/5 transition-all"
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-titan-red/10 border border-titan-red/30 rounded-xl text-titan-red text-sm flex items-center gap-3"
            >
              <Shield size={18} />
              <span>{error}</span>
              <button onClick={() => setError(null)} className="ml-auto hover:text-white">
                <X size={14} />
              </button>
            </motion.div>
          )}

          {/* Output Area */}
          <AnimatePresence mode="wait">
            {output && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass rounded-3xl p-8 border-white/10"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-titan-blue/20 rounded-lg">
                      <Box size={20} className="text-titan-blue" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-xl">{output.appName || output.title || output.agentName}</h3>
                      <span className="text-xs font-mono text-white/40 uppercase tracking-widest">{activeEngine} manifest complete</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingProject({ id: `${activeEngine}-manifest`, name: `${activeEngine.toUpperCase()} Manifest`, content: JSON.stringify(output, null, 2) });
                        setEditContent(JSON.stringify(output, null, 2));
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60"
                      title="Edit Manifest"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60"><Download size={18} /></button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60"><Share2 size={18} /></button>
                  </div>
                </div>

                <div className="space-y-6">
                  {activeEngine === 'app' && (
                    <div className="bg-titan-black/50 rounded-xl p-6 border border-white/5">
                      <div className="flex items-center gap-2 mb-4 text-titan-blue">
                        <Code size={18} />
                        <span className="text-sm font-mono">SOURCE CODE PREVIEW</span>
                      </div>
                      <pre className="text-xs font-mono text-white/70 overflow-x-auto max-h-96">
                        {output.code}
                      </pre>
                    </div>
                  )}

                  {activeEngine === 'video' && (
                    <div className="space-y-6">
                      {output.isLongForm || output.episodes ? (
                        <div className="space-y-8">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-mono text-white/40 uppercase tracking-widest">Long-Form Production Manifest</h4>
                            <span className="text-[10px] font-mono text-titan-blue">{output.totalDuration || '1h+'}</span>
                          </div>
                          {output.episodes?.map((ep: any, i: number) => (
                            <div key={i} className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="h-[1px] flex-1 bg-white/10" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Episode {ep.episodeNumber}: {ep.title}</span>
                                <div className="h-[1px] flex-1 bg-white/10" />
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                {ep.scenes?.map((scene: any, j: number) => (
                                  <div key={j} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5 hover:border-titan-blue/30 transition-all group">
                                    <div className="w-20 text-[10px] font-mono text-titan-blue shrink-0">{scene.timestamp}</div>
                                    <div className="flex-1">
                                      <div className="text-sm font-bold mb-1 text-white/80">VISUAL: {scene.visual}</div>
                                      <div className="text-xs text-white/40 italic">AUDIO: {scene.audio}</div>
                                      {scene.duration && <div className="mt-2 text-[9px] text-white/20 font-mono">DURATION: {scene.duration}s</div>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {output.scenes?.map((scene: any, i: number) => (
                            <div key={i} className="flex gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                              <div className="w-16 text-xs font-mono text-titan-blue">{scene.timestamp}</div>
                              <div className="flex-1">
                                <div className="text-sm font-bold mb-1">VISUAL: {scene.visual}</div>
                                <div className="text-xs text-white/50 italic">AUDIO: {scene.audio}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeEngine === 'agent' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs font-mono text-titan-blue mb-2">PERSONA</div>
                        <div className="text-sm">{output.persona}</div>
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs font-mono text-titan-blue mb-2">CAPABILITIES</div>
                        <div className="flex flex-wrap gap-2">
                          {output.capabilities?.map((cap: string, i: number) => (
                            <span key={i} className="px-2 py-1 bg-titan-blue/10 text-titan-blue text-[10px] rounded uppercase font-bold">{cap}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeEngine === 'saas' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                          <div className="flex items-center gap-2 text-xs font-mono text-titan-blue mb-2">
                            <Users size={14} />
                            <span>USER ROLES</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {output.userRoles?.map((role: string, i: number) => (
                              <span key={i} className="px-2 py-0.5 bg-white/5 text-[10px] rounded border border-white/10">{role}</span>
                            ))}
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5 col-span-2">
                          <div className="flex items-center gap-2 text-xs font-mono text-titan-blue mb-2">
                            <CreditCard size={14} />
                            <span>MONETIZATION</span>
                          </div>
                          <div className="text-sm">{output.monetizationStrategy}</div>
                        </div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="flex items-center gap-2 text-xs font-mono text-titan-blue mb-2">
                          <Layers size={14} />
                          <span>BACKEND ARCHITECTURE</span>
                        </div>
                        <div className="text-sm text-white/70 leading-relaxed">{output.backendArchitecture}</div>
                      </div>

                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs font-mono text-titan-blue mb-4">API ENDPOINTS</div>
                        <div className="space-y-2">
                          {output.apiEndpoints?.map((api: any, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-black/20 rounded border border-white/5">
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                api.method === 'GET' ? 'bg-blue-500/20 text-blue-400' : 
                                api.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' : 
                                'bg-amber-500/20 text-amber-400'
                              }`}>{api.method}</span>
                              <span className="text-xs font-mono">{api.path}</span>
                              <span className="text-[10px] text-white/40 ml-auto">{api.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {output.mvpCodeSnippet && (
                        <div className="bg-titan-black/50 rounded-xl p-6 border border-white/5">
                          <div className="flex items-center gap-2 mb-4 text-titan-blue">
                            <Code size={18} />
                            <span className="text-sm font-mono">MVP CODE SNIPPET</span>
                          </div>
                          <pre className="text-xs font-mono text-white/70 overflow-x-auto max-h-64">
                            {output.mvpCodeSnippet}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {activeEngine === 'autodraft' && (
                    <div className="space-y-8">
                      <div className="p-6 bg-titan-blue/5 border border-titan-blue/20 rounded-2xl">
                        <h4 className="text-titan-blue font-display font-bold text-lg mb-2">MASTER VISION</h4>
                        <p className="text-white/70 italic">{output.vision}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h5 className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Layout size={14} /> APP CORE
                          </h5>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="font-bold mb-1">{output.app?.appName}</div>
                            <div className="text-xs text-white/50">{output.app?.description}</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h5 className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <MonitorPlay size={14} /> STUDIO PROJECT
                          </h5>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="font-bold mb-1">{output.studio?.projectName}</div>
                            <div className="text-xs text-white/50">{output.studio?.scenes?.length || 0} Scenes Manifested</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h5 className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Bot size={14} /> AGENT PERSONA
                          </h5>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="font-bold mb-1">{output.agent?.agentName}</div>
                            <div className="text-xs text-white/50">{output.agent?.capabilities?.length || 0} Skills</div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h5 className="text-xs font-mono text-white/40 uppercase tracking-widest flex items-center gap-2">
                            <Globe size={14} /> SAAS ARCHITECTURE
                          </h5>
                          <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="font-bold mb-1">{output.saas?.productName}</div>
                            <div className="text-xs text-white/50">{output.saas?.monetizationStrategy}</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h5 className="text-xs font-mono text-white/40 uppercase tracking-widest">AUTONOMOUS ROADMAP</h5>
                        <div className="space-y-2">
                          {output.roadmap?.map((step: string, i: number) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                              <div className="w-6 h-6 rounded-full bg-titan-blue/20 text-titan-blue flex items-center justify-center text-[10px] font-bold">{i+1}</div>
                              <span className="text-sm">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-center gap-4">
                        <button 
                          onClick={() => {
                            setStudioProject(output.studio);
                            setViewMode('studio');
                          }}
                          className="px-8 py-3 bg-titan-blue text-titan-black font-bold rounded-xl hover:scale-105 transition-transform flex items-center gap-2"
                        >
                          OPEN STUDIO EDITOR
                          <ChevronRight size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setEditingProject({ id: 'autodraft-manifest', name: 'Autodraft Master Manifest', content: JSON.stringify(output, null, 2) });
                            setEditContent(JSON.stringify(output, null, 2));
                          }}
                          className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-mono transition-all"
                        >
                          VIEW FULL MANIFEST DETAILS
                        </button>
                      </div>
                    </div>
                  )}

                  {activeEngine === 'animation' && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-lg">{output.title}</h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-titan-blue">{output.style}</span>
                          <span className="text-[10px] font-mono text-white/20">{output.totalDuration}</span>
                        </div>
                      </div>
                      
                      {output.episodes ? (
                        <div className="space-y-8">
                          {output.episodes.map((ep: any, i: number) => (
                            <div key={i} className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="h-[1px] flex-1 bg-white/10" />
                                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Episode {ep.episodeNumber}: {ep.title}</span>
                                <div className="h-[1px] flex-1 bg-white/10" />
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                {ep.scenes?.map((scene: any, j: number) => (
                                  <div key={j} className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-6 group hover:border-titan-blue/30 transition-all">
                                    <div className="w-12 h-12 bg-titan-blue/10 rounded-lg flex flex-col items-center justify-center font-mono text-titan-blue shrink-0">
                                      <span className="text-[10px] opacity-40">SCENE</span>
                                      <span className="text-sm font-bold">{scene.sceneNumber}</span>
                                    </div>
                                    <div className="flex-1 space-y-2">
                                      <div className="text-sm font-bold text-white/80">{scene.visualDescription}</div>
                                      <div className="text-xs text-white/40 italic">{scene.movement}</div>
                                      <div className="pt-2 flex items-center gap-4 border-t border-white/5">
                                        <div className="flex items-center gap-1.5 text-[10px] text-titan-green/60">
                                          <Mic size={10} />
                                          <span>{scene.voiceoverScript}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[10px] text-titan-blue/60">
                                          <Music size={10} />
                                          <span>{scene.audioPrompt}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-[10px] font-mono text-white/20 self-start">{scene.duration}s</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-4">
                          {output.frames?.map((frame: any, i: number) => (
                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 flex gap-4">
                              <div className="w-12 h-12 bg-titan-blue/10 rounded flex items-center justify-center font-mono text-titan-blue">#{frame.frameNumber}</div>
                              <div>
                                <div className="text-sm font-bold">{frame.description}</div>
                                <div className="text-xs text-white/40 italic">{frame.movement}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeEngine === 'character' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-titan-blue/20 rounded-2xl flex items-center justify-center border border-titan-blue/30">
                          <UserCircle size={40} className="text-titan-blue" />
                        </div>
                        <div>
                          <h4 className="text-2xl font-display font-bold">{output.name}</h4>
                          <span className="text-sm text-titan-blue font-mono uppercase">{output.species}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(output.stats || {}).map(([key, val]: [string, any]) => (
                          <div key={key} className="p-3 bg-white/5 rounded-xl border border-white/5 text-center">
                            <div className="text-[10px] text-white/40 uppercase font-mono">{key}</div>
                            <div className="text-xl font-bold text-titan-blue">{val}</div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs font-mono text-titan-blue mb-2">BACKSTORY</div>
                        <p className="text-sm text-white/70">{output.backstory}</p>
                      </div>
                    </div>
                  )}

                  {activeEngine === 'googleai' && (
                    <div className="space-y-6">
                      <div className="p-4 bg-titan-gold/10 border border-titan-gold/30 rounded-xl">
                        <div className="flex items-center gap-2 text-titan-gold mb-2">
                          <Sparkles size={18} />
                          <span className="font-display font-bold">GEMINI INTEGRATION</span>
                        </div>
                        <p className="text-sm text-white/80">{output.geminiIntegration}</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        <div className="bg-titan-black/50 rounded-xl p-6 border border-white/5">
                          <div className="flex items-center gap-2 mb-4 text-titan-blue">
                            <Code size={18} />
                            <span className="text-sm font-mono">FRONTEND CODE (REACT)</span>
                          </div>
                          <pre className="text-xs font-mono text-white/70 overflow-x-auto max-h-64">
                            {output.frontendCode}
                          </pre>
                        </div>

                        {output.backendCode && (
                          <div className="bg-titan-black/50 rounded-xl p-6 border border-white/5">
                            <div className="flex items-center gap-2 mb-4 text-titan-blue">
                              <Terminal size={18} />
                              <span className="text-sm font-mono">BACKEND CODE (EXPRESS)</span>
                            </div>
                            <pre className="text-xs font-mono text-white/70 overflow-x-auto max-h-64">
                              {output.backendCode}
                            </pre>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs font-mono text-titan-blue mb-2">SETUP INSTRUCTIONS</div>
                        <p className="text-sm text-white/70 whitespace-pre-wrap">{output.setupInstructions}</p>
                      </div>
                    </div>
                  )}

                  {activeEngine === 'imagegen' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        {['Painting Anime', '3D Kids Animation', 'Thriller & Horror', 'Cartoon Backgrounds', 'Webtoon 3D', 'Aesthetic Anime', 'Village Style', 'Kids Animation'].map(style => (
                          <div key={style} className="p-4 glass border border-white/10 rounded-xl hover:border-titan-purple/50 cursor-pointer transition-all group">
                            <div className="text-sm font-bold mb-1 group-hover:text-titan-purple">{style}</div>
                            <div className="text-[10px] text-white/40 uppercase">Style Preset</div>
                          </div>
                        ))}
                      </div>
                      <div className="p-6 bg-titan-purple/10 border border-titan-purple/30 rounded-xl">
                        <div className="text-xs font-mono text-titan-purple mb-2">REVISED PROMPT</div>
                        <p className="text-sm text-white/80 italic">"{output.revisedPrompt}"</p>
                      </div>
                    </div>
                  )}

                  {activeEngine === 'voiceover' && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-4 p-6 glass rounded-xl border-white/10">
                        <div className="w-12 h-12 bg-titan-green/20 rounded-full flex items-center justify-center">
                          <Mic className="text-titan-green" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">{output.voice} Voice</div>
                          <div className="text-xs text-white/40 uppercase tracking-widest">{output.emotion} Emotion</div>
                        </div>
                        <div className="ml-auto">
                          <button className="p-3 bg-titan-green/20 rounded-full hover:bg-titan-green/40 transition-colors">
                            <Play size={20} className="text-titan-green" />
                          </button>
                        </div>
                      </div>
                      <div className="p-6 bg-white/5 rounded-xl border border-white/5">
                        <div className="text-xs font-mono text-titan-green mb-4 uppercase">Voiceover Script</div>
                        <p className="text-lg leading-relaxed text-white/90">{output.script}</p>
                      </div>
                    </div>
                  )}

                  {activeEngine === 'story' && (
                    <div className="space-y-8">
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl font-display font-bold text-titan-red">{output.title}</h2>
                        <div className="text-xs font-mono text-white/40 uppercase tracking-widest">{output.genre}</div>
                      </div>
                      <div className="p-6 glass rounded-xl border-white/10">
                        <div className="text-xs font-mono text-titan-red mb-2 uppercase">Plot Summary</div>
                        <p className="text-sm text-white/70">{output.plotSummary}</p>
                      </div>
                      <div className="space-y-6">
                        {output.chapters?.map((chapter: any, idx: number) => (
                          <div key={idx} className="space-y-3">
                            <h3 className="text-lg font-bold flex items-center gap-3">
                              <span className="text-titan-red font-mono">0{idx + 1}</span>
                              {chapter.title}
                            </h3>
                            <p className="text-sm text-white/60 leading-relaxed">{chapter.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeEngine === 'studio' && (
                    <div className="space-y-6 text-center py-12">
                      <div className="w-20 h-20 bg-titan-blue/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MonitorPlay size={40} className="text-titan-blue" />
                      </div>
                      <h2 className="text-2xl font-display font-bold">Studio Manifest Ready</h2>
                      <p className="text-white/40 max-w-md mx-auto mb-8">
                        The full project structure for <span className="text-titan-blue font-bold">{output.projectName}</span> has been generated with {output.scenes?.length || 0} scenes.
                      </p>
                      <button 
                        onClick={() => {
                          setStudioProject(output);
                          setViewMode('studio');
                        }}
                        className="px-8 py-3 bg-titan-blue rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2 mx-auto"
                      >
                        OPEN STUDIO EDITOR
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  )}

                  {activeEngine === 'autodraft' && (
                    <div className="space-y-8 pt-8 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-display font-bold">Full Manifest Details</h3>
                        <div className="flex gap-2">
                          <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><Download size={16} /></button>
                          <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><Share2 size={16} /></button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 glass rounded-2xl border-white/10 space-y-4 relative group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Layout size={20} className="text-titan-blue" />
                              <h4 className="font-bold">App Architecture</h4>
                            </div>
                            <button 
                              onClick={() => {
                                setEditingProject({ id: 'app-draft', name: 'App Architecture', content: JSON.stringify(output.appDraft, null, 2) });
                                setEditContent(JSON.stringify(output.appDraft, null, 2));
                              }}
                              className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                            >
                              <Edit3 size={14} />
                            </button>
                          </div>
                          <div className="text-xs text-white/40 font-mono bg-black/40 p-4 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                            {JSON.stringify(output.appDraft?.features, null, 2)}
                          </div>
                        </div>
                        <div className="p-6 glass rounded-2xl border-white/10 space-y-4 relative group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Video size={20} className="text-titan-purple" />
                              <h4 className="font-bold">Video Script</h4>
                            </div>
                            <button 
                              onClick={() => {
                                setEditingProject({ id: 'video-draft', name: 'Video Script', content: output.videoDraft?.script });
                                setEditContent(output.videoDraft?.script);
                              }}
                              className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                            >
                              <Edit3 size={14} />
                            </button>
                          </div>
                          <div className="text-xs text-white/40 font-mono bg-black/40 p-4 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                            {output.videoDraft?.script}
                          </div>
                        </div>
                        <div className="p-6 glass rounded-2xl border-white/10 space-y-4 relative group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Bot size={20} className="text-titan-green" />
                              <h4 className="font-bold">Agent Persona</h4>
                            </div>
                            <button 
                              onClick={() => {
                                setEditingProject({ id: 'agent-draft', name: 'Agent Persona', content: JSON.stringify(output.agentDraft, null, 2) });
                                setEditContent(JSON.stringify(output.agentDraft, null, 2));
                              }}
                              className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                            >
                              <Edit3 size={14} />
                            </button>
                          </div>
                          <div className="text-xs text-white/40 font-mono bg-black/40 p-4 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                            {JSON.stringify(output.agentDraft?.persona, null, 2)}
                          </div>
                        </div>
                        <div className="p-6 glass rounded-2xl border-white/10 space-y-4 relative group">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Globe size={20} className="text-titan-red" />
                              <h4 className="font-bold">SaaS Strategy</h4>
                            </div>
                            <button 
                              onClick={() => {
                                setEditingProject({ id: 'saas-draft', name: 'SaaS Strategy', content: JSON.stringify(output.saasDraft, null, 2) });
                                setEditContent(JSON.stringify(output.saasDraft, null, 2));
                              }}
                              className="p-2 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10"
                            >
                              <Edit3 size={14} />
                            </button>
                          </div>
                          <div className="text-xs text-white/40 font-mono bg-black/40 p-4 rounded-xl max-h-40 overflow-y-auto custom-scrollbar">
                            {JSON.stringify(output.saasDraft?.monetization, null, 2)}
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-titan-blue/10 border border-titan-blue/30 rounded-2xl flex items-center justify-between">
                        <div>
                          <div className="font-bold text-titan-blue">Studio Project Ready</div>
                          <div className="text-xs text-white/60">A full editable studio project has been drafted.</div>
                        </div>
                        <button 
                          onClick={() => {
                            setStudioProject(output.studioDraft);
                            setViewMode('studio');
                          }}
                          className="px-6 py-2 bg-titan-blue text-titan-black font-bold rounded-lg text-sm"
                        >
                          OPEN IN STUDIO
                        </button>
                      </div>
                    </div>
                  )}

                  {activeEngine === 'animation' && output && (
                    <div className="space-y-8 pt-8 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-display font-bold uppercase tracking-tight">Animation Production Manifest</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleVoiceSync}
                            className="px-4 py-2 bg-titan-green/10 text-titan-green border border-titan-green/30 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-titan-green/20 transition-all"
                          >
                            <Mic size={14} /> VOICE CUT & SYNC
                          </button>
                          <button 
                            onClick={handleFixAudio}
                            className="px-4 py-2 bg-titan-blue/10 text-titan-blue border border-titan-blue/30 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-titan-blue/20 transition-all"
                          >
                            <Music size={14} /> FIX AUDIO
                          </button>
                          <button 
                            onClick={handleAudit}
                            className="px-4 py-2 bg-titan-red/10 text-titan-red border border-titan-red/30 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-titan-red/20 transition-all"
                          >
                            <Shield size={14} /> SECURITY AUDIT
                          </button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6">
                        {output.episodes?.map((ep: any, i: number) => (
                          <div key={i} className="glass rounded-2xl border-white/10 overflow-hidden">
                            <div className="p-4 bg-white/5 border-b border-white/10 flex items-center justify-between">
                              <h4 className="font-bold text-sm">Episode {ep.episodeNumber}: {ep.title}</h4>
                              <span className="text-[10px] font-mono text-white/40 uppercase">Scene Count: {ep.scenes?.length}</span>
                            </div>
                            <div className="p-6 space-y-6">
                              {ep.scenes?.map((scene: any, j: number) => (
                                <div key={j} className="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold text-titan-blue uppercase">Scene {scene.sceneNumber}</span>
                                    <span className="text-[10px] font-mono text-white/40">{scene.duration}s</span>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <label className="text-[9px] font-mono text-white/20 uppercase">Visuals</label>
                                      <p className="text-xs text-white/60 leading-relaxed">{scene.visualDescription}</p>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[9px] font-mono text-white/20 uppercase">Voiceover</label>
                                      <p className="text-xs italic text-titan-green/80 leading-relaxed">"{scene.voiceoverScript}"</p>
                                    </div>
                                  </div>
                                  <div className="pt-2 flex items-center gap-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                      <Music size={12} className="text-white/20" />
                                      <span className="text-[9px] text-white/40 font-mono">{scene.audioPrompt}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {(activeEngine === 'veo3' || activeEngine === 'gemini3' || activeEngine === 'caffeine' || activeEngine === 'udio' || activeEngine === 'animation') && output && (
                    <div className="space-y-8 pt-8 border-t border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-display font-bold uppercase tracking-tight">{activeEngine} Manifest</h3>
                        <div className="flex gap-2">
                          <button 
                            onClick={handleAudit}
                            className="px-4 py-2 bg-titan-red/10 text-titan-red border border-titan-red/30 rounded-lg text-xs font-bold flex items-center gap-2 hover:bg-titan-red/20 transition-all"
                          >
                            <Shield size={14} /> AUDIT
                          </button>
                          <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><Download size={16} /></button>
                        </div>
                      </div>
                      <div className="p-6 glass rounded-2xl border-white/10 bg-black/40">
                        <pre className="text-xs text-white/60 font-mono whitespace-pre-wrap overflow-x-auto custom-scrollbar max-h-[400px]">
                          {JSON.stringify(output, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>

        {/* Right Sidebar - History & Stats */}
        <div className="col-span-3 space-y-6">
          <div className="glass rounded-2xl p-6 border-white/5">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Recent Manifestations</h3>
            <div className="space-y-3">
              {projects.slice(0, 5).map((p) => (
                <div key={p.id} className="group flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/5 rounded-lg group-hover:bg-titan-blue/20 transition-colors">
                      {p.type === 'video' && <Video size={14} className="text-white/40 group-hover:text-titan-blue" />}
                      {p.type === 'app' && <Layout size={14} className="text-white/40 group-hover:text-titan-blue" />}
                      {p.type === 'agent' && <Bot size={14} className="text-white/40 group-hover:text-titan-blue" />}
                      {p.type === 'game' && <Gamepad2 size={14} className="text-white/40 group-hover:text-titan-blue" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium truncate w-32">{p.name}</div>
                      <div className="text-[10px] text-white/30 uppercase">{p.type}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setEditingProject(p);
                        setEditContent(p.content);
                      }}
                      className="p-2 hover:bg-white/5 rounded-lg transition-colors text-white/60"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(p.id)}
                      className="p-2 hover:bg-titan-red/10 rounded-lg transition-colors text-white/20 hover:text-titan-red"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-titan-blue" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6 border-white/5">
            <h3 className="text-xs font-mono text-white/40 uppercase tracking-widest mb-4">Active Agents</h3>
            <div className="space-y-4">
              {agents.map((a) => (
                <div key={a.id} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-titan-blue/10 rounded-full flex items-center justify-center border border-titan-blue/30">
                      <Bot size={18} className="text-titan-blue" />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-titan-black animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">{a.name}</div>
                    <div className="text-[10px] text-white/40 truncate w-32">{a.task}</div>
                  </div>
                </div>
              ))}
              <button className="w-full py-2 border border-dashed border-white/20 rounded-xl text-xs text-white/40 hover:text-white hover:border-white/40 transition-all flex items-center justify-center gap-2">
                <Plus size={14} />
                Deploy New Agent
              </button>
            </div>
          </div>

          <div className="p-6 bg-titan-red/10 border border-titan-red/30 rounded-2xl">
            <div className="flex items-center gap-2 mb-2 text-titan-red">
              <Shield size={18} />
              <span className="font-display font-bold">Security Layer</span>
            </div>
            <p className="text-xs text-white/60">All manifests are encrypted with OMNI-2040 quantum protocols. Deployment is sandbox-ready.</p>
          </div>
        </div>
        {/* Model Configuration Panel */}
        <AnimatePresence>
          {showConfig && !editingProject && activeEngine !== 'dashboard' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="col-span-3 space-y-6"
            >
              <div className="glass rounded-3xl p-6 border-white/10 space-y-8 sticky top-24">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-display font-bold uppercase tracking-tight">Model Settings</h3>
                  <button onClick={() => setShowConfig(false)} className="text-white/20 hover:text-white"><X size={18} /></button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-white/40 uppercase">Temperature</span>
                      <span className="text-titan-blue">{temperature}</span>
                    </div>
                    <input 
                      type="range" min="0" max="2" step="0.1" value={temperature} 
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-titan-blue" 
                    />
                    <p className="text-[9px] text-white/20">Controls randomness: Lower is more deterministic, higher is more creative.</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-white/40 uppercase">Top P</span>
                      <span className="text-titan-blue">{topP}</span>
                    </div>
                    <input 
                      type="range" min="0" max="1" step="0.05" value={topP} 
                      onChange={(e) => setTopP(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-titan-blue" 
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-white/40 uppercase">Top K</span>
                      <span className="text-titan-blue">{topK}</span>
                    </div>
                    <input 
                      type="range" min="1" max="100" step="1" value={topK} 
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-titan-blue" 
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-white/40 uppercase">Max Output Tokens</span>
                      <span className="text-titan-blue">{maxOutputTokens}</span>
                    </div>
                    <input 
                      type="range" min="1" max="8192" step="128" value={maxOutputTokens} 
                      onChange={(e) => setMaxOutputTokens(Number(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-titan-blue" 
                    />
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono text-white/40 uppercase">Production Mode</span>
                      <div 
                        onClick={() => setIsLongForm(!isLongForm)}
                        className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-all ${isLongForm ? 'bg-titan-blue' : 'bg-white/10'}`}
                      >
                        <div className={`w-3 h-3 bg-white rounded-full transition-all ${isLongForm ? 'translate-x-5' : 'translate-x-0'}`} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="text-white/40 uppercase">Long-Form (1hr+)</span>
                      <span className={isLongForm ? 'text-titan-blue' : 'text-white/20'}>{isLongForm ? 'ENABLED' : 'DISABLED'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-white/40 uppercase">Security Layer</span>
                    <Shield size={14} className={quantumEncryption ? "text-titan-blue" : "text-white/20"} />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-white/60">Quantum Encryption</span>
                      <div 
                        onClick={() => setQuantumEncryption(!quantumEncryption)}
                        className={`w-8 h-4 rounded-full p-1 cursor-pointer transition-all ${quantumEncryption ? 'bg-titan-blue' : 'bg-white/10'}`}
                      >
                        <div className={`w-2 h-2 bg-white rounded-full transition-all ${quantumEncryption ? 'translate-x-4' : 'translate-x-0'}`} />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[9px] font-mono text-white/40 uppercase">
                        <span>Safety Filter Level</span>
                        <span className="text-titan-green">{safetyLevel}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        {(['LOW', 'MEDIUM', 'HIGH'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setSafetyLevel(level)}
                            className={`py-1.5 text-[9px] font-bold rounded-md border transition-all ${
                              safetyLevel === level 
                                ? 'bg-titan-green/20 border-titan-green text-titan-green' 
                                : 'bg-white/5 border-white/10 text-white/40 hover:bg-white/10'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-titan-green/5 border border-titan-green/20 rounded-xl text-[10px] text-titan-green leading-relaxed">
                    {safetyLevel === 'HIGH' 
                      ? "Maximum safety protocols active. Content will be strictly filtered for enterprise compliance."
                      : safetyLevel === 'MEDIUM'
                        ? "Standard safety filters active to ensure responsible AI generation."
                        : "Minimal safety filtering. Use with caution for creative exploration."}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Terminal Footer */}
      <footer className="fixed bottom-0 left-0 w-full h-10 glass border-t border-white/5 px-8 flex items-center justify-between text-[10px] font-mono text-white/40 z-40">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Terminal size={12} />
            <span>TITAN-OMNI SHELL v4.0.2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
            <span>CORE: ONLINE</span>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <span>LATENCY: 14ms</span>
          <span>UPTIME: 99.999%</span>
          <span className="text-titan-blue">© 2040 TITAN INDUSTRIES</span>
        </div>
      </footer>

      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[300]"
          >
            <div className={`px-6 py-3 rounded-xl border flex items-center gap-3 shadow-2xl backdrop-blur-md ${
              toast.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' :
              toast.type === 'error' ? 'bg-titan-red/10 border-titan-red/30 text-titan-red' :
              'bg-titan-blue/10 border-titan-blue/30 text-titan-blue'
            }`}>
              {toast.type === 'success' && <CheckCircle size={18} />}
              {toast.type === 'error' && <AlertCircle size={18} />}
              {toast.type === 'info' && <Info size={18} />}
              <span className="text-sm font-bold">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Monetization Engine Modal */}
      <AnimatePresence>
        {isAuditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-full max-w-md glass rounded-3xl p-8 border-titan-red/30 text-center space-y-6"
            >
              <div className="relative inline-block">
                <Shield size={64} className="text-titan-red mx-auto animate-pulse" />
                <div className="absolute inset-0 bg-titan-red/20 blur-2xl rounded-full" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-display font-bold uppercase tracking-tighter">Security Audit in Progress</h2>
                <p className="text-sm text-white/40 font-mono">SCANNING MANIFEST FOR VULNERABILITIES...</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase">
                  <span>Quantum Analysis</span>
                  <span>{auditProgress}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/10">
                  <motion.div 
                    className="h-full bg-titan-red"
                    initial={{ width: 0 }}
                    animate={{ width: `${auditProgress}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-left">
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[9px] text-white/20 uppercase mb-1">Encryption</div>
                  <div className="text-xs font-bold text-titan-blue">AES-Q2040</div>
                </div>
                <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                  <div className="text-[9px] text-white/20 uppercase mb-1">Safety Level</div>
                  <div className="text-xs font-bold text-titan-green">{safetyLevel}</div>
                </div>
              </div>

              {auditProgress === 100 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-500 text-xs font-bold"
                >
                  AUDIT COMPLETE: NO VULNERABILITIES FOUND
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMonetization && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMonetization(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass border border-titan-blue/30 rounded-3xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/10 flex items-center justify-between bg-titan-blue/5">
                <div className="flex items-center gap-3">
                  <TrendingUp size={24} className="text-titan-blue" />
                  <h2 className="text-2xl font-display font-bold tracking-tight">Monetization Engine</h2>
                </div>
                <button onClick={() => setShowMonetization(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} className="text-white/40" />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Revenue Model</label>
                    <div className="space-y-2">
                      {['Subscription', 'Pay-per-use', 'Freemium', 'Ad-Supported'].map(model => (
                        <button key={model} className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-left hover:border-titan-blue/50 transition-all group">
                          <div className="font-bold group-hover:text-titan-blue">{model}</div>
                          <div className="text-[10px] text-white/40">Optimized for high-growth creators</div>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="text-xs font-mono text-white/40 uppercase tracking-widest">Pricing Tiers</label>
                      <div className="space-y-3">
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                          <span className="font-bold">Basic</span>
                          <span className="text-titan-blue font-mono">$9.99/mo</span>
                        </div>
                        <div className="p-4 bg-titan-blue/10 border border-titan-blue/30 rounded-xl flex items-center justify-between">
                          <span className="font-bold">Pro</span>
                          <span className="text-titan-blue font-mono">$29.99/mo</span>
                        </div>
                        <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                          <span className="font-bold">Enterprise</span>
                          <span className="text-titan-blue font-mono">Custom</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap size={16} className="text-emerald-500" />
                        <span className="text-xs font-bold text-emerald-500 uppercase">AI Revenue Forecast</span>
                      </div>
                      <div className="text-2xl font-display font-bold">$12,450.00</div>
                      <div className="text-[10px] text-white/40 uppercase">Estimated Monthly Recurring Revenue</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-white/10 bg-black/40 flex justify-end gap-4">
                <button onClick={() => setShowMonetization(false)} className="px-6 py-2 text-sm font-bold text-white/40 hover:text-white">DISCARD</button>
                <button className="px-8 py-2 bg-titan-blue text-titan-black font-bold rounded-xl shadow-[0_0_15px_rgba(0,243,255,0.3)]">ACTIVATE ENGINE</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ToolbarIcon({ icon, label, isAI, onClick }: { icon: React.ReactNode, label: string, isAI?: boolean, onClick?: () => void }) {
  return (
    <div className="group relative flex flex-col items-center gap-1 cursor-pointer" onClick={onClick}>
      <div className={`p-2.5 rounded-xl transition-all ${isAI ? 'bg-titan-blue/10 text-titan-blue border border-titan-blue/20 hover:bg-titan-blue/20' : 'hover:bg-white/5 text-white/60 hover:text-white'}`}>
        {icon}
      </div>
      <span className="text-[8px] font-bold uppercase tracking-tighter text-white/40 group-hover:text-white/80">{label}</span>
      {isAI && (
        <div className="absolute -top-1 -right-1 px-1 py-0.5 bg-titan-blue text-titan-black text-[6px] font-bold rounded-sm shadow-[0_0_8px_rgba(0,243,255,0.8)]">
          AI
        </div>
      )}
    </div>
  );
}

function EngineButton({ active, onClick, icon, label, desc }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, desc: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center gap-4 group ${
        active 
          ? 'bg-titan-blue/10 border-titan-blue/50 shadow-[0_0_20px_rgba(0,240,255,0.1)]' 
          : 'bg-white/2 border-white/5 hover:bg-white/5 hover:border-white/10'
      }`}
    >
      <div className={`p-3 rounded-xl transition-colors ${
        active ? 'bg-titan-blue text-titan-black' : 'bg-white/5 text-white/40 group-hover:text-white'
      }`}>
        {icon}
      </div>
      <div>
        <div className={`font-display font-bold ${active ? 'text-white' : 'text-white/60'}`}>{label}</div>
        <div className="text-[10px] text-white/30 uppercase tracking-tighter">{desc}</div>
      </div>
    </button>
  );
}
