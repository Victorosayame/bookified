"use client";

import { voiceOptions, voiceCategories } from "@/lib/constants";
import { VoiceSelectorProps } from "@/types";
import { FC } from "react";

const VoiceSelector: FC<VoiceSelectorProps> = ({
  value,
  onChange,
  disabled = false,
}) => {
  const handleVoiceSelect = (voiceKey: string) => {
    const voice = voiceOptions[voiceKey as keyof typeof voiceOptions];
    if (voice) {
      onChange(voice.id);
    }
  };

  return (
    <div className="space-y-4">
      {/* Male Voices */}
      <div>
        <h3 className="text-sm font-semibold text-[#222c37] mb-3">
          Male Voices
        </h3>
        <div className="voice-selector-options">
          {voiceCategories.male.map((voiceKey) => {
            const voice = voiceOptions[voiceKey as keyof typeof voiceOptions];
            if (!voice) return null;
            const isSelected = voice.id === value;

            return (
              <button
                key={voiceKey}
                onClick={() => handleVoiceSelect(voiceKey)}
                disabled={disabled}
                className={`voice-selector-option ${
                  isSelected
                    ? "voice-selector-option-selected"
                    : "voice-selector-option-default"
                } ${disabled ? "voice-selector-option-disabled" : ""}`}
                type="button"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm text-[#222c37]">
                    {voice.name}
                  </p>
                  <p className="text-xs text-[#3d485e]">{voice.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Female Voices */}
      <div>
        <h3 className="text-sm font-semibold text-[#222c37] mb-3">
          Female Voices
        </h3>
        <div className="voice-selector-options">
          {voiceCategories.female.map((voiceKey) => {
            const voice = voiceOptions[voiceKey as keyof typeof voiceOptions];
            const isSelected = voice.id === value;

            return (
              <button
                key={voiceKey}
                onClick={() => handleVoiceSelect(voiceKey)}
                disabled={disabled}
                className={`voice-selector-option ${
                  isSelected
                    ? "voice-selector-option-selected"
                    : "voice-selector-option-default"
                } ${disabled ? "voice-selector-option-disabled" : ""}`}
                type="button"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm text-[#222c37]">
                    {voice.name}
                  </p>
                  <p className="text-xs text-[#3d485e]">{voice.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default VoiceSelector;
