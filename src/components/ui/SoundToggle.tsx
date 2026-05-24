"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useSoundContext } from "@/context/SoundContext";

export default function SoundToggle() {
    const { soundEnabled, toggleSound } = useSoundContext();

    // Spec says: "Placement Très discret Footer ou menu secondaire"
    // "Le son doit toujours être une option, jamais une surprise."

    return (
        <button 
            onClick={toggleSound}
            className="group relative flex items-center justify-center w-8 h-8 rounded-full text-[#FAF9F6]/40 hover:text-[#FAF9F6] transition-colors duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#FAF9F6]/50"
            aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
        >
            {!soundEnabled ? (
                <VolumeX size={14} strokeWidth={1.5} />
            ) : (
                <Volume2 size={14} strokeWidth={1.5} />
            )}
        </button>
    );
}