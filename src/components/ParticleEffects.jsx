import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useReality } from '../context/RealityContext';

const Particle = ({ id, x, y, size, color, duration }) => (
  <motion.div
    key={id}
    initial={{ 
      x, 
      y, 
      scale: 0, 
      opacity: 0 
    }}
    animate={{ 
      x: x + (Math.random() - 0.5) * 100, 
      y: y - Math.random() * 200, 
      scale: [0, 1, 0], 
      opacity: [0, 1, 0] 
    }}
    transition={{ 
      duration: duration || 3, 
      ease: 'easeOut' 
    }}
    style={{
      position: 'absolute',
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '50%',
      pointerEvents: 'none'
    }}
  />
);

const FloatingOrb = ({ id, delay, duration, size, color }) => (
  <motion.div
    key={id}
    initial={{ 
      x: Math.random() * window.innerWidth, 
      y: window.innerHeight + 50,
      scale: 0 
    }}
    animate={{ 
      x: Math.random() * window.innerWidth, 
      y: -50,
      scale: [0, 1, 1, 0],
      rotate: 360
    }}
    transition={{ 
      duration: duration || 20, 
      delay: delay || 0,
      ease: 'linear',
      repeat: Infinity,
      repeatDelay: Math.random() * 5
    }}
    style={{
      position: 'fixed',
      width: size,
      height: size,
      backgroundColor: color,
      borderRadius: '50%',
      opacity: 0.1,
      filter: 'blur(2px)',
      pointerEvents: 'none',
      zIndex: 1
    }}
  />
);

export function ParticleEffects() {
  const { particleEffects, config, animationConfig } = useTheme();
  const { currentMode, isTransitioning } = useReality();
  const [particles, setParticles] = React.useState([]);
  const [orbs, setOrbs] = React.useState([]);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!particleEffects) return;

    const handleMouseMove = (e) => {
      if (Math.random() > 0.9) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          color: getParticleColor(),
          duration: animationConfig.duration * 2
        };
        
        setParticles(prev => [...prev.slice(-20), newParticle]);
        
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, newParticle.duration * 1000);
      }
    };

    const getParticleColor = () => {
      const colors = {
        optimistic: ['#10b981', '#34d399', '#6ee7b7'],
        realistic: ['#6b7280', '#9ca3af', '#d1d5db'],
        disaster: ['#ef4444', '#f87171', '#fca5a5']
      };
      
      const modeColors = colors[currentMode] || colors.realistic;
      return modeColors[Math.floor(Math.random() * modeColors.length)];
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [particleEffects, currentMode, animationConfig]);

  useEffect(() => {
    if (!particleEffects) return;

    const getOrbColor = () => {
      const themeColors = {
        light: ['#dbeafe', '#bfdbfe', '#93c5fd'],
        dark: ['#4c1d95', '#5b21b6', '#6d28d9'],
        cyberpunk: ['#ec4899', '#f472b6', '#f9a8d4'],
        nature: ['#86efac', '#4ade80', '#22c55e'],
        ocean: ['#7dd3fc', '#38bdf8', '#0ea5e9'],
        sunset: ['#fed7aa', '#fdba74', '#fb923c'],
        galaxy: ['#e9d5ff', '#d8b4fe', '#c084fc']
      };
      
      const colors = themeColors[config.name.toLowerCase()] || themeColors.light;
      return colors[Math.floor(Math.random() * colors.length)];
    };

    const newOrbs = Array.from({ length: 5 }, (_, i) => ({
      id: `orb-${i}`,
      delay: i * 2,
      duration: 15 + Math.random() * 10,
      size: 20 + Math.random() * 30,
      color: getOrbColor()
    }));

    setOrbs(newOrbs);
  }, [particleEffects, config]);

  useEffect(() => {
    if (!particleEffects) return;

    const getParticleColor = () => {
      const colors = {
        optimistic: ['#10b981', '#34d399', '#6ee7b7'],
        realistic: ['#6b7280', '#9ca3af', '#d1d5db'],
        disaster: ['#ef4444', '#f87171', '#fca5a5']
      };
      
      const modeColors = colors[currentMode] || colors.realistic;
      return modeColors[Math.floor(Math.random() * modeColors.length)];
    };

    const handleMouseMove = (e) => {
      if (Math.random() > 0.9) {
        const newParticle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 4 + 2,
          color: getParticleColor(),
          duration: animationConfig.duration * 2
        };
        
        setParticles(prev => [...prev.slice(-20), newParticle]);
        
        setTimeout(() => {
          setParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, newParticle.duration * 1000);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [particleEffects, currentMode, animationConfig]);

  useEffect(() => {
    if (!particleEffects) return;

    const getExplosionColor = () => {
      const colors = ['#fbbf24', '#f59e0b', '#d97706', '#92400e'];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    if (isTransitioning && particleEffects) {
      const explosionParticles = Array.from({ length: 30 }, (_, i) => ({
        id: `explosion-${Date.now()}-${i}`,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
        size: Math.random() * 6 + 2,
        color: getExplosionColor(),
        duration: animationConfig.duration * 3
      }));

      setParticles(prev => [...prev, ...explosionParticles]);

      setTimeout(() => {
        setParticles(prev => prev.filter(p => !p.id.startsWith('explosion-')));
      }, explosionParticles[0].duration * 1000);
    }
  }, [isTransitioning, particleEffects, animationConfig]);

  if (!particleEffects) return null;

  return (
    <>
      <AnimatePresence>
        {particles.map(particle => (
          <Particle {...particle} />
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {orbs.map(orb => (
          <FloatingOrb {...orb} />
        ))}
      </AnimatePresence>
    </>
  );
}
