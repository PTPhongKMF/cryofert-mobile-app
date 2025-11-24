import React from "react";

export default function AnimatedProgressLine({
  colorClass = "bg-blue-400",
  className = "h-full",
}) {
  return (
    <div
      className={`relative w-2 bg-gray-200 rounded-full overflow-hidden ${className}`}
    >
      <div className={`absolute bottom-0 w-full h-full ${colorClass}`} />

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute left-0 w-full h-24 -top-24 animate-scan bg-gradient-to-b from-transparent via-white to-transparent opacity-60 mix-blend-overlay"></div>
      </div>
    </div>
  );
}
