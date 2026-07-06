'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface TreeVisualizationProps {
  branches: number;
  leaves: number;
  totalQuestions: number;
  currentQuestion: number;
}

export default function TreeVisualization({
  branches,
  leaves,
  totalQuestions,
  currentQuestion,
}: TreeVisualizationProps) {
  const [displayStage, setDisplayStage] = useState(0);

  useEffect(() => {
    const answered = branches + leaves;
    const progress = answered / totalQuestions;

    if (progress === 0) {
      setDisplayStage(0);
    } else if (progress <= 0.33) {
      setDisplayStage(1);
    } else if (progress <= 0.66) {
      setDisplayStage(2);
    } else {
      setDisplayStage(3);
    }
  }, [branches, leaves, totalQuestions]);

  const stageWidth = 200;
  const stageIndex = displayStage;

  return (
    <div className="relative w-full max-w-[200px] mx-auto">
      <svg viewBox="0 0 200 200" className="w-full h-auto">
        {/* Background for quiz context */}
        <rect
          x="0"
          y="0"
          width="200"
          height="200"
          fill="transparent"
        />

        {/* Sprites embedded inline for animation control */}
        <TreeSprite
          stage={displayStage}
          isDependence={leaves > branches}
        />
      </svg>

      {/* Legend */}
      <div className="mt-4 flex justify-center gap-6 text-sm">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#4A7C23]" />
          <span className="font-ui text-[#6B5B4F]">{branches} cành</span>
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#C9A227]" />
          <span className="font-ui text-[#6B5B4F]">{leaves} lá</span>
        </span>
      </div>

      {/* Stage indicator */}
      <div className="mt-2 flex justify-center gap-1">
        {[0, 1, 2, 3].map((stage) => (
          <motion.div
            key={stage}
            className={`w-2 h-2 rounded-full transition-colors ${
              stage <= displayStage ? 'bg-[var(--echo-wood)]' : 'bg-[var(--echo-parchment)]'
            }`}
            animate={{ scale: stage === displayStage ? 1.3 : 1 }}
            transition={{ duration: 0.2 }}
          />
        ))}
      </div>
    </div>
  );
}

function TreeSprite({ stage, isDependence }: { stage: number; isDependence: boolean }) {
  const color = isDependence ? '#C9A227' : '#4A7C23';
  const colorLight = isDependence ? '#E5C44A' : '#5A8F2A';
  const glowColor = isDependence ? 'rgba(201, 162, 39, 0.3)' : 'rgba(45, 80, 22, 0.2)';

  const sprites = [
    // Stage 0: Tiny sprout
    <g key="stage-0">
      <ellipse cx="100" cy="185" rx="40" ry="8" fill={glowColor} />
      <path d="M80 175 L83 195 L117 195 L120 175 Z" fill="#8B6914" stroke="#5C4033" strokeWidth="1.5" />
      <ellipse cx="100" cy="175" rx="22" ry="5" fill="#A67C00" />
      <ellipse cx="100" cy="177" rx="18" ry="4" fill="#3D2B22" />
      <motion.path
        d="M100 177 Q100 165 98 155"
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <ellipse cx="95" cy="153" rx="6" ry="4" fill={color} transform="rotate(-20 95 153)" />
        <ellipse cx="103" cy="153" rx="6" ry="4" fill={color} transform="rotate(20 103 153)" />
      </motion.g>
    </g>,

    // Stage 1: Small sapling
    <g key="stage-1">
      <ellipse cx="100" cy="185" rx="40" ry="8" fill={glowColor} />
      <path d="M80 175 L83 195 L117 195 L120 175 Z" fill="#8B6914" stroke="#5C4033" strokeWidth="1.5" />
      <ellipse cx="100" cy="175" rx="22" ry="5" fill="#A67C00" />
      <ellipse cx="100" cy="177" rx="18" ry="4" fill="#3D2B22" />
      <motion.path
        d="M100 177 L100 125"
        stroke="#5C4033"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <path d="M100 145 Q80 140 75 125" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M100 145 Q120 140 125 125" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="75" cy="120" r="12" fill={color} />
        <circle cx="125" cy="120" r="12" fill={color} />
        <circle cx="100" cy="105" r="15" fill={colorLight} />
        <circle cx="90" cy="115" r="10" fill={color} />
        <circle cx="110" cy="115" r="10" fill={color} />
      </motion.g>
    </g>,

    // Stage 2: Growing tree
    <g key="stage-2">
      <ellipse cx="100" cy="185" rx="45" ry="10" fill={glowColor} />
      <path d="M78 173 L82 195 L118 195 L122 173 Z" fill="#8B6914" stroke="#5C4033" strokeWidth="1.5" />
      <ellipse cx="100" cy="173" rx="24" ry="6" fill="#A67C00" />
      <ellipse cx="100" cy="175" rx="20" ry="5" fill="#3D2B22" />
      <motion.path
        d="M100 175 L100 100"
        stroke="#5C4033"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, delay: 0.1 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <path d="M100 140 Q65 125 55 95" stroke="#5C4033" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M100 140 Q135 125 145 95" stroke="#5C4033" strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M100 120 Q80 105 75 80" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M100 120 Q120 105 125 80" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="55" cy="88" r="18" fill={color} />
        <circle cx="145" cy="88" r="18" fill={color} />
        <circle cx="100" cy="60" r="22" fill={color} />
        <circle cx="75" cy="72" r="14" fill={colorLight} />
        <circle cx="125" cy="72" r="14" fill={colorLight} />
        <circle cx="100" cy="80" r="16" fill={colorLight} />
        <circle cx="85" cy="55" r="10" fill={color} />
        <circle cx="115" cy="55" r="10" fill={color} />
      </motion.g>
    </g>,

    // Stage 3: Full tree
    <g key="stage-3">
      <ellipse cx="100" cy="188" rx="50" ry="12" fill={glowColor} />
      <path d="M75 170 L80 195 L120 195 L125 170 Z" fill="#8B6914" stroke="#5C4033" strokeWidth="2" />
      <ellipse cx="100" cy="170" rx="27" ry="7" fill="#A67C00" />
      <ellipse cx="100" cy="172" rx="23" ry="6" fill="#3D2B22" />
      <motion.path
        d="M100 172 Q95 140 100 100 Q105 60 100 30"
        stroke="#5C4033"
        strokeWidth="12"
        fill="none"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
      />
      <motion.g
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        {isDependence ? (
          <>
            {/* Dependence tree - thin branches, glowing */}
            <path d="M100 80 Q60 60 40 40" stroke="#B8860B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M100 80 Q140 60 160 40" stroke="#B8860B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M100 60 Q70 35 60 15" stroke="#B8860B" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M100 60 Q130 35 140 15" stroke="#B8860B" strokeWidth="2" fill="none" strokeLinecap="round" />
            <ellipse cx="100" cy="45" rx="55" ry="50" fill="rgba(255, 229, 102, 0.15)" />
            <circle cx="40" cy="35" r="16" fill="#E5C44A" />
            <circle cx="160" cy="35" r="16" fill="#E5C44A" />
            <circle cx="60" cy="12" r="14" fill="#F0D547" />
            <circle cx="140" cy="12" r="14" fill="#F0D547" />
            <circle cx="100" cy="0" r="18" fill="#FFE566" />
            <circle cx="100" cy="30" r="12" fill="#E5C44A" />
            <circle cx="70" cy="25" r="9" fill="#E5C44A" />
            <circle cx="130" cy="25" r="9" fill="#E5C44A" />
          </>
        ) : (
          <>
            {/* Autonomy tree - strong branches, lush */}
            <path d="M100 85 Q60 65 40 45" stroke="#5C4033" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M100 85 Q140 65 160 45" stroke="#5C4033" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M100 65 Q75 40 65 20" stroke="#5C4033" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M100 65 Q125 40 135 20" stroke="#5C4033" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M100 172 Q85 180 75 185" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M100 172 Q115 180 125 185" stroke="#5C4033" strokeWidth="3" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="40" r="22" fill={color} />
            <circle cx="160" cy="40" r="22" fill={color} />
            <circle cx="65" cy="15" r="20" fill={color} />
            <circle cx="135" cy="15" r="20" fill={color} />
            <circle cx="100" cy="0" r="25" fill={color} />
            <circle cx="100" cy="40" r="18" fill={colorLight} />
            <circle cx="55" cy="30" r="12" fill={colorLight} />
            <circle cx="145" cy="30" r="12" fill={colorLight} />
            <circle cx="80" cy="10" r="10" fill={colorLight} />
            <circle cx="120" cy="10" r="10" fill={colorLight} />
          </>
        )}
      </motion.g>
    </g>,
  ];

  return sprites[stage];
}
