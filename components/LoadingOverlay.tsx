"use client";

import { Loader2 } from "lucide-react";
import { FC } from "react";

interface LoadingOverlayProps {
  isVisible: boolean;
  title?: string;
  steps?: string[];
  currentStep?: number;
}

const LoadingOverlay: FC<LoadingOverlayProps> = ({
  isVisible,
  title = "Synthesizing Your Book",
  steps = [
    "Please wait while we process your PDF and prepare your interactive experience.",
  ],
  currentStep = 0,
}) => {
  if (!isVisible) return null;

  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper shadow-soft-lg bg-white">
        <div className="loading-shadow">
          <Loader2 className="loading-animation w-12 h-12 text-[#663820]" />
          <h2 className="loading-title">{title}</h2>

          {steps && steps.length > 0 && (
            <div className="loading-progress">
              {steps.map((step, index) => (
                <div key={index} className="loading-progress-item">
                  <div
                    className={`loading-progress-status ${
                      index <= currentStep ? "bg-[#7c9a82]" : "bg-[#ddd]"
                    }`}
                  />
                  <span
                    className={`text-sm ${
                      index <= currentStep
                        ? "text-[#222c37] font-medium"
                        : "text-[#999]"
                    }`}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
