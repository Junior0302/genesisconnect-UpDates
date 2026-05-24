"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";

// Define sound types based on "Micro-sons" specification
type SoundType = "entry_breath" | "transition_pulse" | "focus_grain" | "click";

interface SoundContextType {
    playSound: (type: SoundType) => void;
    toggleSound: () => void;
    initAudio: () => Promise<void>;
    soundEnabled: boolean;
    isInitialized: boolean;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: ReactNode }) {
    // REFS for AudioContext and Buffers (No re-renders)
    const audioContextRef = useRef<AudioContext | null>(null);
    const soundsRef = useRef<Record<string, AudioBuffer>>({});
    
    // STATE
    const [soundEnabled, setSoundEnabled] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // 1. LOAD PREFERENCE & PRELOAD AUDIO
    useEffect(() => {
        // Preference
        const storedPref = localStorage.getItem("sound");
        // Default to ON if not set, or if set to "on"
        setSoundEnabled(storedPref !== "off");

        // Preload Audio Context (Suspended) & Buffers
        const preloadAudio = async () => {
            if (audioContextRef.current) return;

            try {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
                const ctx = new AudioContextClass();
                audioContextRef.current = ctx;

                // Load the common sound file ONCE
                const url = "/sounds/Click2.mp3";
                const res = await fetch(url);
                if (!res.ok) {
                        console.error(`Sound file missing: ${url}`);
                        return;
                }
                const rawBuf = await res.arrayBuffer();
                // Decode
                const audioBuffer = await ctx.decodeAudioData(rawBuf);
                
                // Assign to all keys
                soundsRef.current["entry_breath"] = audioBuffer;
                soundsRef.current["transition_pulse"] = audioBuffer;
                soundsRef.current["focus_grain"] = audioBuffer;
                soundsRef.current["click"] = audioBuffer;
                
            } catch (e) {
                console.error("Audio Preload Failed", e);
            } finally {
                // Always allow app to proceed, even if audio fails
                setIsInitialized(true);
            }
        };

        preloadAudio();
    }, []);

    // 2. RESUME AUDIO (Called on interaction)
    const initAudio = async () => {
        if (audioContextRef.current) {
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }
        }
    };

    // 3. PLAY SOUND (File Based)
    const playSound = (type: SoundType) => {
        if (!soundEnabled || !audioContextRef.current) return;
        
        const ctx = audioContextRef.current;
        if (ctx.state === 'suspended') ctx.resume();

        const buffer = soundsRef.current[type];
        if (!buffer) {
             // Sound not loaded or file missing - just return silently
             return;
        }

        const source = ctx.createBufferSource();
        const gainNode = ctx.createGain();

        // VOLUME MAP
        const volumes = {
            entry_breath: 0.8,
            transition_pulse: 0.5,
            focus_grain: 0.2,
            click: 0.1
        };

        gainNode.gain.value = volumes[type];

        source.buffer = buffer;
        source.connect(gainNode);
        gainNode.connect(ctx.destination);

        source.start(0);
    };

    // 4. TOGGLE (User Preference)
    const toggleSound = () => {
        setSoundEnabled(prev => {
            const newState = !prev;
            localStorage.setItem("sound", newState ? "on" : "off");
            
            // If turning ON, ensure engine is ready (if user clicks toggle before Enter?)
            if (newState && !audioContextRef.current) {
                // We can try to init, but usually init requires interaction.
                // The toggle click IS an interaction.
                initAudio(); 
            }
            
            return newState;
        });
    };

    return (
        <SoundContext.Provider value={{ playSound, toggleSound, initAudio, soundEnabled, isInitialized }}>
            {children}
        </SoundContext.Provider>
    );
}

export function useSoundContext() {
    const context = useContext(SoundContext);
    if (context === undefined) {
        throw new Error("useSoundContext must be used within a SoundProvider");
    }
    return context;
}
