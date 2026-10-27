import React from 'react';
import { PillShape, PillAppearance } from '../types';

interface PillProps {
  shape: PillShape;
  appearance?: PillAppearance;
  size?: 'sm' | 'md' | 'lg' | 'mini';
  isUnderwater?: boolean;
  className?: string;
}

export const Pill: React.FC<PillProps> = ({
  shape,
  appearance,
  size = 'md',
  isUnderwater = false,
  className = '',
}) => {
  const primaryColor = appearance?.primaryColor || '#FFFFFF';
  const secondaryColor = appearance?.secondaryColor || '#F8FAFC';
  const imprint = appearance?.imprint || '';

  // Dimension mapping
  const sizeConfig = {
    mini: {
      round: 'w-6 h-6',
      oval: 'w-8 h-5',
      capsule: 'w-8 h-4',
      smallCircle: 'w-4 h-4',
      text: 'text-[7px]',
    },
    sm: {
      round: 'w-8 h-8',
      oval: 'w-10 h-6',
      capsule: 'w-10 h-5',
      smallCircle: 'w-6 h-6',
      text: 'text-[8px]',
    },
    md: {
      round: 'w-11 h-11',
      oval: 'w-14 h-8',
      capsule: 'w-14 h-6',
      smallCircle: 'w-8 h-8',
      text: 'text-[9px]',
    },
    lg: {
      round: 'w-16 h-16',
      oval: 'w-20 h-11',
      capsule: 'w-20 h-9',
      smallCircle: 'w-11 h-11',
      text: 'text-[11px]',
    },
  }[size];

  const underwaterFilter = isUnderwater
    ? 'brightness-95 contrast-105 saturate-90 filter drop-shadow-[0_4px_6px_rgba(14,116,144,0.3)]'
    : 'drop-shadow-[0_3px_5px_rgba(0,0,0,0.18)] hover:drop-shadow-[0_5px_8px_rgba(0,0,0,0.24)]';

  switch (shape) {
    case 'round-white':
      return (
        <div
          className={`relative rounded-full flex items-center justify-center select-none transition-transform duration-200 ${sizeConfig.round} ${underwaterFilter} ${className}`}
          style={{
            background: 'radial-gradient(circle at 35% 30%, #FFFFFF 0%, #F1F5F9 55%, #CBD5E1 100%)',
            boxShadow: isUnderwater
              ? 'inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(100,116,139,0.3)'
              : 'inset 0 1px 2px rgba(255,255,255,1), inset 0 -2px 4px rgba(71,85,105,0.25)',
          }}
        >
          {/* Beveled outer ring edge */}
          <div className="absolute inset-[1.5px] rounded-full border border-black/5 pointer-events-none" />

          {/* Debossed center score line */}
          <div className="absolute w-[68%] h-[1.5px] bg-slate-300 shadow-[0_1px_0_rgba(255,255,255,0.9)] rounded-full" />

          {/* Stamped pharmaceutical imprint */}
          {imprint && (
            <span
              className={`absolute font-pharmacy font-bold text-slate-400/85 tracking-tighter ${sizeConfig.text} translate-y-[-50%] -top-[1px]`}
            >
              {imprint}
            </span>
          )}

          {/* Subtle chalk specular reflection arc */}
          <div className="absolute top-1 left-2 w-1/3 h-1/4 bg-white/60 rounded-full blur-[0.5px] pointer-events-none" />
        </div>
      );

    case 'oval-tablet':
      return (
        <div
          className={`relative rounded-[999px] flex items-center justify-center select-none transition-transform duration-200 ${sizeConfig.oval} ${underwaterFilter} ${className}`}
          style={{
            background: `radial-gradient(ellipse at 40% 30%, #FFFFFF 0%, ${primaryColor} 60%, rgba(0,0,0,0.18) 100%)`,
            boxShadow: isUnderwater
              ? 'inset 0 1px 2px rgba(255,255,255,0.8), inset 0 -2px 3px rgba(0,0,0,0.2)'
              : 'inset 0 1px 3px rgba(255,255,255,0.85), inset 0 -2px 4px rgba(0,0,0,0.25)',
          }}
        >
          {/* Beveled border */}
          <div className="absolute inset-[1.5px] rounded-[999px] border border-white/25 pointer-events-none" />

          {/* Center groove */}
          <div className="absolute h-[65%] w-[1.5px] bg-black/15 shadow-[1px_0_0_rgba(255,255,255,0.5)] rounded-full" />

          {/* Imprint */}
          {imprint && (
            <span
              className={`absolute font-pharmacy font-bold tracking-tighter ${sizeConfig.text} text-black/40`}
            >
              {imprint}
            </span>
          )}

          {/* Top curved reflection */}
          <div className="absolute top-[2px] left-3 right-3 h-[2px] bg-white/60 rounded-full blur-[0.5px] pointer-events-none" />
        </div>
      );

    case 'two-tone-capsule':
      return (
        <div
          className={`relative rounded-[999px] flex items-center justify-center select-none overflow-hidden transition-transform duration-200 ${sizeConfig.capsule} ${underwaterFilter} ${className}`}
          style={{
            boxShadow: isUnderwater
              ? 'inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -1px 3px rgba(0,0,0,0.3)'
              : 'inset 0 2px 3px rgba(255,255,255,0.9), inset 0 -2px 4px rgba(0,0,0,0.35)',
          }}
        >
          {/* Left half (colored) */}
          <div
            className="w-1/2 h-full relative"
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,0.3) 0%, ${primaryColor} 40%, rgba(0,0,0,0.25) 100%)`,
              backgroundColor: primaryColor,
            }}
          >
            {imprint && (
              <span
                className={`absolute inset-0 flex items-center justify-center font-pharmacy font-bold text-white/90 tracking-tighter ${sizeConfig.text}`}
              >
                {imprint}
              </span>
            )}
          </div>

          {/* Interlocking capsule seam ring */}
          <div className="absolute left-1/2 -translate-x-1/2 h-full w-[1.5px] bg-black/25 z-10" />

          {/* Right half (crisp white or secondary color) */}
          <div
            className="w-1/2 h-full relative"
            style={{
              background: `linear-gradient(180deg, #FFFFFF 0%, ${secondaryColor} 50%, #CBD5E1 100%)`,
            }}
          />

          {/* Longitudinal glossy reflection strip running across the capsule */}
          <div className="absolute top-[1.5px] left-2 right-2 h-[2px] bg-white/75 rounded-full blur-[0.4px] pointer-events-none z-20" />
          <div className="absolute bottom-[2px] left-3 right-3 h-[1px] bg-white/20 rounded-full pointer-events-none z-20" />
        </div>
      );

    case 'small-circle':
      return (
        <div
          className={`relative rounded-full flex items-center justify-center select-none transition-transform duration-200 ${sizeConfig.smallCircle} ${underwaterFilter} ${className}`}
          style={{
            background: `radial-gradient(circle at 35% 35%, #FFFFFF 0%, ${primaryColor} 65%, rgba(0,0,0,0.25) 100%)`,
            backgroundColor: primaryColor,
            boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.9), inset 0 -2px 3px rgba(0,0,0,0.25)',
          }}
        >
          {imprint && (
            <span
              className={`font-pharmacy font-bold text-black/50 tracking-tighter ${sizeConfig.text}`}
            >
              {imprint}
            </span>
          )}
          {/* Spherical highlight dot */}
          <div className="absolute top-1 left-1 w-1/3 h-1/3 bg-white/70 rounded-full blur-[0.4px] pointer-events-none" />
        </div>
      );

    case 'translucent-softgel':
      return (
        <div
          className={`relative rounded-[999px] flex items-center justify-center select-none overflow-hidden transition-transform duration-200 ${sizeConfig.oval} ${underwaterFilter} ${className}`}
          style={{
            background: `radial-gradient(ellipse at 45% 40%, #FEF08A 0%, ${primaryColor} 55%, #B45309 100%)`,
            boxShadow:
              'inset 0 2px 4px rgba(255,255,255,0.95), inset 0 -2px 5px rgba(180,83,9,0.7), inset 0 0 10px rgba(245,158,11,0.5)',
            opacity: 0.95,
          }}
        >
          {/* Inner refractive liquid bubble */}
          <div className="absolute inset-1 rounded-[999px] bg-amber-300/30 blur-[1px] pointer-events-none" />

          {/* Intense pinpoint specular highlight */}
          <div className="absolute top-[2px] left-3 w-3 h-[2px] bg-white rounded-full blur-[0.3px] shadow-[0_0_3px_#fff] pointer-events-none" />
          <div className="absolute bottom-[2px] right-3 w-2 h-[1px] bg-amber-100/60 rounded-full pointer-events-none" />
        </div>
      );

    case 'elongated-capsule':
    default:
      return (
        <div
          className={`relative rounded-[999px] flex items-center justify-center select-none overflow-hidden transition-transform duration-200 ${sizeConfig.capsule} ${underwaterFilter} ${className}`}
          style={{
            boxShadow: 'inset 0 2px 3px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.3)',
          }}
        >
          {/* Emerald green half */}
          <div
            className="w-1/2 h-full relative"
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,0.4) 0%, ${primaryColor} 45%, rgba(0,0,0,0.3) 100%)`,
              backgroundColor: primaryColor,
            }}
          >
            {imprint && (
              <span
                className={`absolute inset-0 flex items-center justify-center font-pharmacy font-bold text-white/90 ${sizeConfig.text}`}
              >
                {imprint}
              </span>
            )}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 h-full w-[1px] bg-black/30 z-10" />

          {/* Cream second half */}
          <div
            className="w-1/2 h-full"
            style={{
              background: `linear-gradient(180deg, #FFFFFF 0%, ${secondaryColor} 50%, #E2E8F0 100%)`,
            }}
          />

          {/* Gloss highlight streak */}
          <div className="absolute top-[1px] left-2 right-2 h-[2px] bg-white/70 rounded-full blur-[0.4px] pointer-events-none z-20" />
        </div>
      );
  }
};
