/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { 
  Menu, 
  Radio as Sensors, 
  Cpu as SettingsInputComponent, 
  ChevronDown as ExpandMore, 
  Ruler as Straighten, 
  Eye as Visibility, 
  ChevronRight, 
  Search, 
  Timer as ShutterSpeed, 
  Compass as Explore, 
  Star as Stars, 
  Settings as SettingsMotionMode,
  ArrowLeft as West,
  ArrowUp as North,
  ChevronUp as ArrowDropUp,
  ChevronsDown as KeyboardDoubleArrowDown,
  ArrowLeft,
  ArrowRight,
  CheckCircle2 as CheckCircle,
  Mountain as Landscape
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

// Types and Enums
enum ViewState {
  SETUP = 'SETUP',
  CALIBRATION = 'CALIBRATION',
  AR_GUIDE = 'AR_GUIDE',
  OBJECTS = 'OBJECTS'
}

interface CelestialObject {
  id: string;
  name: string;
  type: string;
  magnitude: string;
  coordinates: string;
  description: string;
  imageUrl: string;
  visibility: string;
  tracking?: boolean;
}

const CELESTIAL_DATABASE: CelestialObject[] = [
  {
    id: 'mars',
    name: 'MARS',
    type: 'PLANET',
    magnitude: '-2.0',
    coordinates: '12h 45m',
    description: 'The fourth planet from the Sun. Known as the Red Planet due to iron oxide on its surface, giving it a reddish appearance. Home to Olympus Mons, the largest volcano in the solar system.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDl-6mdDXR_7o3vDtWW07ytJqPoZIwcWCXmSpmt5KoWgNv5WNdcAaaR_e6LUQAL0VI0TofQjdaiYlmRIkSJ82EKZdvZqLbA5w1rWnJwVFHEfcr-tiK1xN3T7-ljiWLw8FPhcJWJHLEDvkqqtag-1GfJY3nYNB_UeZTrMcyTN6ouvgZeUX_QdkKfM72dYr1ZUDd1DTg9EzEcWcJ33M6LYOLvshrFRKL5Z3QB5CymgQCphNNegFkOYXdyGEuaj07T8yZ3HDR8T-8jOX4f',
    visibility: 'HIGH',
    tracking: true
  },
  {
    id: 'jupiter',
    name: 'JUPITER',
    type: 'PLANET',
    magnitude: '-2.9',
    coordinates: '18h 12m',
    description: 'The largest planet in our solar system. A massive gas giant with a thick atmosphere composed primarily of hydrogen and helium, featuring the iconic Great Red Spot storm.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbCwCDjeXO02mACpBYVIqyjYnq_m-gbZj5_E9QpSV6CYqPHsfdjeIu482yvBidbF6dMeIMD3QtXXLazl1GxrXFMLK_AEKihcnt54uzQ7EYnQ3NZNoel69PlwcxeHCAdorHuwr_Xx0UY3k37Pl-kkdovGyGG0ca0dk11pX-ppcqHAxvkTQ3TOq7iG756uV1hCsiVz5p7B6CpO7PQ3gF15ZIAabnHKFdvs3EJVZsDwqz7LEJYxgwil8y0xgJnm7w8SOtReV8p6Cdnccr',
    visibility: 'PEAK'
  },
  {
    id: 'saturn',
    name: 'SATURN',
    type: 'PLANET',
    magnitude: '0.4',
    coordinates: '21h 30m',
    description: 'The ringed planet. Famous for its prominent and complex ring system made of ice particles and rocky debris. Saturn has at least 146 moons in its orbit.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9pmcV7yHNDirXzNBQxGEq-n0aXk_8US8AcegxZQ68gdApniGw0mkeNXO3UicQEdu5KicNm-p4UEasIoCcqzv_YZJ1g8m6nN1j0olxtE_vmLzE254rf-qJ9PwdMZ5CeHR9A8YFZEARYFQR5bnA4EMHNU8NBU2IAlmNIFvY3NuPdQhEULMkMrly2cNjbJ1F_MNlQrBPMP8N0mc1ThaSmjk-TU2PVoX7xkKqy0nG-7m86vG8LZ_db2L9by6q4cN5G6oCfyPErMHl0LzY',
    visibility: 'MEDIUM'
  },
  {
    id: 'venus',
    name: 'VENUS',
    type: 'PLANET',
    magnitude: '-4.6',
    coordinates: '04h 22m',
    description: 'Earth\'s twin in size, but with a runaway greenhouse effect making it the hottest planet. It is the brightest natural object in Earth\'s night sky after the Moon.',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAr-Qf7T1vFWsLUaQKrcUwG6zZT5Mpe5n-DJBImtGI5e0KfllH_vuDBRidLJi3bm6heOdKzGtaL5ksOhbjMoSSCnPAxtZB4g55FEPYlHk8EhAbvtnZ0qyOxGzP0_8n_K1nIkcH6QabmI64_lQGUKL2Shk4zSft3bozS3Js4xyv5thTiTwlaD_FWgIvL8w2zdA8Sx3mFoTtLtjWil8WZOrBqc79mVY2xLdLRD0eDXV-fpub0nytBWZOaC3HMiwO475YN4XAAg32z0RyE',
    visibility: 'EXTREME'
  }
];

// Helper Icons Component (Mapping Lucide to match the aesthetic)
const NavIcon = ({ icon: Icon, active = false, label }: { icon: any, active?: boolean, label?: string }) => (
  <div className={cn(
    "flex flex-col items-center gap-1 group cursor-pointer transition-all duration-150 active:scale-90",
    active ? "text-cyan-400 scale-110 drop-shadow-[0_0_8px_rgba(0,243,255,0.8)]" : "text-cyan-950 opacity-50 hover:text-cyan-200 hover:opacity-100"
  )}>
    <Icon size={24} className={cn(active && "fill-current")} />
    {label && <span className={cn("font-sans text-[10px] uppercase tracking-tighter font-bold")}>{label}</span>}
  </div>
);

export default function App() {
  const [view, setView] = useState<ViewState>(ViewState.SETUP);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toISOString().substr(11, 8) + ' UTC';
  };

  return (
    <div className="relative min-h-screen bg-background overflow-hidden selection:bg-primary-container selection:text-on-primary-container font-sans">
      {/* Dynamic Starfield Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-surface-container-low via-background to-background opacity-60"></div>
        <img 
          className="w-full h-full object-cover mix-blend-screen opacity-30" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuABm8E9efgVrgtQavF6ee1nV6aHpE2jXdn-qEh6a4A4qedtZvwGdB1rIcSGqzouki_6sU6JTHHAa_jAm9lpkKoCNXhs-E2iu9pkJNEn-5jcjM-R7Suxj1ASvvYNB7POnKHbbtWv5HlqhYz4AsGKj_sDNN2O2WL0YQqK7Rxljy1GrtYCwJqRZJ-AoOcD3QNeXAsYzQ7l3U2TxumVXgwfryCTe6sgZyO_NEZP7gzQxvGr59wnoGazpNFAkY_VuDcsDq2dGx5mC6qnSjqK" 
          referrerPolicy="no-referrer"
          alt="Deep space star field"
        />
      </div>

      {/* Main HUD Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="flex justify-between items-center w-full px-6 py-4 bg-black/40 backdrop-blur-md border-b border-cyan-500/30 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-cyan-400 hover:text-white transition-colors">
              <Menu size={20} />
            </button>
            <span className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm">ASTRO NAVIGATOR</span>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_5px_rgba(0,243,255,0.8)]"></div>
              <span className="text-cyan-400 font-bold tracking-[0.2em] uppercase text-[10px]">SYNC ACTIVE</span>
            </div>
            <Sensors size={20} className="text-primary-fixed-dim" />
          </div>
        </header>

        {/* View Transition Area */}
        <main className="flex-grow relative flex items-center justify-center p-4">
          <AnimatePresence mode="wait">
            {view === ViewState.SETUP && (
              <motion.div 
                key="setup"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="w-full max-w-xl glass-panel p-8 corner-bracket"
              >
                <div className="mb-8 border-b border-cyan-500/20 pb-4">
                  <span className="font-sans font-bold text-[12px] tracking-[0.15em] text-primary-fixed-dim block mb-2 opacity-70 uppercase">SYSTEM_INIT_SEQUENCE v2.04</span>
                  <h1 className="font-bold text-3xl tracking-[-0.02em] text-primary glow-cyan">Welcome, Observer.</h1>
                  <p className="font-sans text-base text-on-surface-variant mt-2">Initialize your optical parameters to calibrate the celestial navigation matrix.</p>
                </div>
                
                <div className="space-y-8">
                  <div className="space-y-2">
                    <label className="font-bold text-[12px] tracking-[0.15em] text-primary-fixed-dim uppercase flex items-center gap-2">
                      <SettingsInputComponent size={14} />
                      Optic Configuration
                    </label>
                    <div className="relative group">
                      <select className="w-full bg-surface-container-lowest border-b border-cyan-500/40 text-on-surface font-sans text-sm py-3 px-4 focus:ring-0 focus:border-primary-container appearance-none transition-colors duration-200 cursor-pointer">
                        <option disabled selected value="">Select Telescope Type...</option>
                        <option value="reflector">Reflector</option>
                        <option value="refractor">Refractor</option>
                        <option value="sct">SCT (Schmidt-Cassegrain)</option>
                      </select>
                      <ExpandMore size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/50 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="font-bold text-[12px] tracking-[0.15em] text-primary-fixed-dim uppercase flex items-center gap-2">
                        <Straighten size={14} />
                        Focal Length
                      </label>
                      <div className="relative">
                        <input className="w-full bg-surface-container-lowest border-b border-cyan-500/40 text-on-surface font-sans text-sm py-3 px-4 focus:ring-0 focus:border-primary-container transition-colors duration-200" placeholder="0000" type="number" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/40 font-bold text-xs">MM</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-bold text-[12px] tracking-[0.15em] text-primary-fixed-dim uppercase flex items-center gap-2">
                        <Visibility size={14} />
                        Eyepiece Aperture
                      </label>
                      <div className="relative">
                        <input className="w-full bg-surface-container-lowest border-b border-cyan-500/40 text-on-surface font-sans text-sm py-3 px-4 focus:ring-0 focus:border-primary-container transition-colors duration-200" placeholder="00.0" type="number" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-500/40 font-bold text-xs">MM</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6 flex items-center gap-4">
                    <button 
                      onClick={() => setView(ViewState.CALIBRATION)}
                      className="flex-1 py-4 border border-primary-container/60 bg-primary-container/5 text-primary-container font-bold text-[12px] tracking-widest hover:bg-primary-container/20 active:scale-95 transition-all duration-300 glow-cyan uppercase"
                    >
                      NEXT [CALIBRATE]
                    </button>
                    <button 
                      onClick={() => setView(ViewState.OBJECTS)}
                      className="px-8 py-4 border border-outline-variant/30 text-on-surface-variant font-bold text-[12px] tracking-widest hover:text-on-surface hover:bg-surface-variant/20 active:scale-95 transition-all duration-300 uppercase"
                    >
                      SKIP
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {view === ViewState.CALIBRATION && (
              <motion.div 
                key="calibration"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-center"
              >
                <div className="absolute top-10 flex flex-col items-center text-center">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary-container animate-pulse"></div>
                    <h2 className="font-bold text-[12px] tracking-[0.3em] text-primary uppercase glow-cyan">SYSTEM STATUS: READY</h2>
                  </div>
                  <h1 className="font-semibold text-2xl tracking-widest text-primary px-8 py-2 border-x border-primary-container/30 uppercase">
                    CENTER A BRIGHT STAR IN THE CROSSHAIR
                  </h1>
                </div>

                <div className="relative w-full max-w-4xl aspect-video flex items-center justify-center">
                  <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-primary-container/40"></div>
                  <div className="absolute top-0 right-0 w-32 h-32 border-t-2 border-r-2 border-primary-container/40"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 border-b-2 border-l-2 border-primary-container/40"></div>
                  <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-primary-container/40"></div>

                  <div className="relative flex items-center justify-center">
                    <div className="w-64 h-64 border border-dashed border-primary-container/20 rounded-full"></div>
                    <div className="absolute w-12 h-12 border border-secondary-fixed/60 rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-secondary-fixed shadow-[0_0_10px_#00e297]"></div>
                    </div>
                    <div className="absolute h-96 w-px bg-gradient-to-b from-transparent via-primary-container/40 to-transparent"></div>
                    <div className="absolute w-96 h-px bg-gradient-to-r from-transparent via-primary-container/40 to-transparent"></div>
                    <div className="absolute top-[-48px] font-bold text-[12px] text-primary-container/60 tracking-[0.15em]">RA 06h 45m 08.9s</div>
                    <div className="absolute right-[-100px] font-bold text-[12px] text-primary-container/60 rotate-90 tracking-[0.15em]">DEC -16° 42' 58"</div>
                  </div>

                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-4">
                    <div className="glass-panel p-4 flex flex-col gap-2 w-40">
                      <span className="font-bold text-[10px] text-primary-container/60 uppercase">Exposure</span>
                      <div className="h-1 w-full bg-surface-variant relative">
                        <div className="absolute h-full w-3/4 bg-primary-container shadow-[0_0_8px_#00f3ff]"></div>
                      </div>
                      <span className="font-bold text-sm text-primary mt-1">1/250 SEC</span>
                    </div>
                    <div className="glass-panel p-4 flex flex-col gap-2 w-40">
                      <span className="font-bold text-[10px] text-primary-container/60 uppercase">ISO Sensitivity</span>
                      <div className="h-1 w-full bg-surface-variant relative">
                        <div className="absolute h-full w-1/2 bg-primary-container shadow-[0_0_8px_#00f3ff]"></div>
                      </div>
                      <span className="font-bold text-sm text-primary mt-1">800</span>
                    </div>
                  </div>

                  <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <div className="glass-panel p-6 flex flex-col gap-1 w-48 border-l-4 border-l-secondary-fixed">
                      <span className="font-bold text-[10px] text-secondary-fixed/60 uppercase">Focal Lock</span>
                      <span className="font-bold text-2xl text-secondary-fixed glow-mint">STABLE</span>
                      <span className="font-bold text-[10px] text-secondary-fixed opacity-60 uppercase">Error: 0.02" ARC</span>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 flex flex-col items-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-[10px] text-primary-container/50 tracking-widest mb-1 uppercase">Target Identified</span>
                    <div className="flex items-center gap-3">
                      <Stars className="text-primary-container fill-current" size={24} />
                      <span className="font-bold text-3xl text-primary tracking-widest glow-cyan">SIRIUS</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setView(ViewState.AR_GUIDE)}
                    className="group relative px-12 py-4 border border-primary-container bg-black/20 hover:bg-primary-container/10 transition-all duration-300 active:scale-95 overflow-hidden"
                  >
                    <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-primary-container"></div>
                    <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-primary-container"></div>
                    <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-primary-container"></div>
                    <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-primary-container"></div>
                    <span className="font-bold text-[12px] text-primary-container group-hover:text-primary tracking-[0.4em] uppercase">COMPLETE CALIBRATION</span>
                  </button>
                </div>
              </motion.div>
            )}

            {view === ViewState.AR_GUIDE && (
              <motion.div 
                key="ar-guide"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full relative"
              >
                <div className="absolute top-10 left-10 flex flex-col gap-2 p-4 bg-black/40 backdrop-blur-md border border-primary-container/20 corner-bracket">
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">RA: 18h 36m 56s</span>
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">DEC: +38° 47' 01"</span>
                  <div className="w-8 h-px bg-primary/20 my-1"></div>
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">AZ: 284.5°</span>
                  <span className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">ALT: +42.1°</span>
                </div>

                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className="absolute inset-0 border border-primary-container/20 rounded-full"></div>
                    <div className="absolute inset-8 border border-primary-container/40 rounded-full border-dashed"></div>
                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-40"></div>
                    <div className="absolute h-full w-px bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-40"></div>
                    <div className="w-4 h-4 border-2 border-secondary rounded-full bg-secondary/10 shadow-[0_0_10px_rgba(244,255,245,0.8)]"></div>
                    
                    <motion.div 
                      animate={{ y: [0, 20, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute -bottom-32 flex flex-col items-center"
                    >
                      <KeyboardDoubleArrowDown size={48} className="text-primary-container glow-cyan fill-current" />
                      <span className="text-[10px] font-bold text-primary-container tracking-[0.2em] mt-2 uppercase">ADJUST PITCH</span>
                    </motion.div>
                  </div>

                  <div className="absolute top-[20%] left-[30%] flex flex-col items-center">
                    <div className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_8px_white]"></div>
                    <span className="mt-2 text-[10px] font-bold text-primary/70 tracking-widest uppercase">VEGA</span>
                  </div>
                  <div className="absolute bottom-[35%] right-[25%] flex flex-col items-center">
                    <div className="w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_white]"></div>
                    <span className="mt-2 text-[10px] font-bold text-primary/70 tracking-widest uppercase">ALTAIR</span>
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 flex flex-col gap-6">
                  <div className="bg-black/40 backdrop-blur-xl border border-primary-container/30 p-6 rounded-lg max-w-xs corner-bracket">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-secondary animate-pulse rounded-full"></div>
                      <span className="font-bold text-[12px] text-primary/60 uppercase tracking-widest">TARGET LOCK</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-2xl text-primary-container glow-cyan tracking-widest">→ JUPITER</span>
                      <div className="flex gap-4 mt-2 font-bold text-sm text-primary-fixed">
                        <span className="flex items-center gap-1"><West size={14} /> 1.2°</span>
                        <span className="flex items-center gap-1"><North size={14} /> 0.8°</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-tighter">GPS: LOCKED</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low border border-outline-variant/30 rounded-full">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-tighter">GYRO: READY</span>
                    </div>
                  </div>
                </div>

                <div className="absolute right-10 top-1/2 -translate-y-1/2 flex flex-col gap-8 items-center">
                  <div className="flex flex-col gap-4 bg-black/40 backdrop-blur-md p-4 border border-outline-variant/30 rounded-full">
                    <NavIcon icon={Visibility} active />
                    <NavIcon icon={Explore} />
                    <NavIcon icon={Stars} />
                  </div>
                  <div className="h-48 flex flex-col items-center gap-2">
                    <span className="font-bold text-[10px] text-primary">10X</span>
                    <div className="w-px h-full bg-outline-variant/30 relative flex justify-center">
                      <div className="absolute top-[30%] w-3 h-[2px] bg-primary-container glow-cyan"></div>
                    </div>
                    <span className="font-bold text-[10px] text-on-surface-variant">1X</span>
                  </div>
                </div>
              </motion.div>
            )}

            {view === ViewState.OBJECTS && (
              <motion.div 
                key="objects"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full max-w-7xl h-full flex flex-col pt-10"
              >
                <div className="mb-8 flex flex-col md:flex-row justify-between items-end gap-6">
                  <div className="w-full md:w-1/3">
                    <p className="text-cyan-400/60 font-bold text-[10px] mb-2 tracking-[0.2em] uppercase">TARGET ACQUISITION</p>
                    <div className="relative group">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        className="w-full bg-black/40 border border-cyan-500/30 rounded-none py-3 pl-10 pr-4 font-sans text-cyan-100 placeholder:text-cyan-900 focus:ring-0 focus:border-cyan-400 transition-all outline-none" 
                        placeholder="SEARCH CELESTIAL DATABASE..." 
                        type="text" 
                      />
                      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyan-400 scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left"></div>
                    </div>
                  </div>
                  
                  <nav className="flex border-b border-cyan-900 w-full md:w-auto">
                    {['PLANETS', 'STARS', 'NEBULAE', 'GALAXIES'].map((tab, idx) => (
                      <button 
                        key={tab}
                        className={cn(
                          "px-6 py-2 font-bold text-[12px] tracking-widest transition-all",
                          idx === 0 ? "text-cyan-400 border-b-2 border-cyan-400 glow-cyan" : "text-cyan-900 hover:text-cyan-400"
                        )}
                      >
                        {tab}
                      </button>
                    ))}
                  </nav>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pr-2 space-y-4 pb-10">
                  {CELESTIAL_DATABASE.map((obj) => (
                    <div 
                      key={obj.id} 
                      className="group relative glass-panel border border-cyan-500/10 hover:border-cyan-500/40 p-6 flex items-center gap-8 transition-all hover:bg-cyan-500/5 cursor-pointer corner-bracket"
                    >
                      <div className="w-24 h-24 flex-shrink-0 relative">
                        <div className="absolute inset-0 rounded-full border border-cyan-500/20 group-hover:border-cyan-500/40 transition-colors"></div>
                        <div className="absolute inset-2 rounded-full overflow-hidden bg-surface-dim">
                          <img 
                            src={obj.imageUrl} 
                            alt={obj.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-xl font-bold text-primary group-hover:text-cyan-300 transition-colors uppercase tracking-widest">{obj.name}</h3>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-cyan-400 text-sm glow-cyan">MAG: {obj.magnitude}</span>
                            <span className="text-[10px] text-cyan-900 font-bold uppercase tracking-widest">COORD: {obj.coordinates}</span>
                          </div>
                        </div>
                        <p className="text-on-surface-variant text-sm leading-relaxed max-w-2xl">{obj.description}</p>
                        <div className="mt-4 flex gap-4">
                          {obj.tracking && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-secondary-fixed-dim tracking-widest uppercase">
                              <span className="w-1.5 h-1.5 rounded-full bg-secondary-fixed-dim animate-pulse shadow-[0_0_4px_#00e297]"></span> TRACKING ACTIVE
                            </span>
                          )}
                          <span className="text-[10px] font-bold text-cyan-900 tracking-widest uppercase">VISIBILITY: {obj.visibility}</span>
                        </div>
                      </div>
                      <ChevronRight className="text-cyan-900 group-hover:text-cyan-400 transition-colors" />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Telemetry Widgets (Desktop only) */}
        <div className="hidden lg:block">
          <div className="fixed top-24 left-10 flex flex-col gap-4">
            <div className="glass-panel p-4 corner-bracket w-40">
              <span className="text-[10px] font-bold text-cyan-400 block mb-1 uppercase tracking-widest">LATITUDE</span>
              <span className="font-bold text-sm text-primary tracking-widest">51°30'26" N</span>
            </div>
            <div className="glass-panel p-4 corner-bracket w-40">
              <span className="text-[10px] font-bold text-cyan-400 block mb-1 uppercase tracking-widest">UTC TIME</span>
              <span className="font-bold text-sm text-primary tracking-widest">{formatTime(currentTime)}</span>
            </div>
          </div>
          
          <div className="fixed top-24 right-10 flex flex-col gap-4 text-right">
            <div className="glass-panel p-4 corner-bracket w-40">
              <span className="text-[10px] font-bold text-cyan-400 block mb-1 uppercase tracking-widest">AZIMUTH</span>
              <span className="font-bold text-sm text-primary tracking-widest">184.22°</span>
            </div>
            <div className="glass-panel p-4 corner-bracket w-40">
              <span className="text-[10px] font-bold text-cyan-400 block mb-1 uppercase tracking-widest">SIGNAL</span>
              <span className="font-bold text-sm text-primary tracking-widest">98.4%</span>
            </div>
          </div>
        </div>

        {/* Navigation Sidebar */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              />
              <motion.aside 
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 z-[70] w-80 bg-black/90 backdrop-blur-2xl border-r border-cyan-500/30 p-8 flex flex-col"
              >
                <div className="text-cyan-400 font-bold tracking-[0.3em] uppercase text-sm border-b border-cyan-500/50 pb-6 mb-8">
                  INSTRUMENT PANEL
                </div>
                <nav className="flex flex-col gap-2">
                  <SidebarItem icon={SettingsInputComponent} label="Telemetry Setup" onClick={() => setView(ViewState.SETUP)} active={view === ViewState.SETUP} />
                  <SidebarItem icon={Explore} label="AR Navigation" onClick={() => setView(ViewState.AR_GUIDE)} active={view === ViewState.AR_GUIDE} />
                  <SidebarItem icon={Stars} label="Celestial Database" onClick={() => setView(ViewState.OBJECTS)} active={view === ViewState.OBJECTS} />
                  <div className="h-px bg-cyan-500/10 my-4" />
                  <SidebarItem icon={Landscape} label="Horizon Mapping" />
                  <SidebarItem icon={CheckCircle} label="System Config" />
                </nav>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 w-full z-40 flex justify-around items-center h-20 px-8 pb-4 bg-black/60 backdrop-blur-xl border-t border-cyan-500/40 rounded-t-xl shadow-[0_-5px_20px_rgba(0,243,255,0.15)]">
          <div onClick={() => setView(ViewState.CALIBRATION)}>
            <NavIcon icon={ShutterSpeed} active={view === ViewState.CALIBRATION} label="CALIBRATE" />
          </div>
          <div onClick={() => setView(ViewState.AR_GUIDE)}>
            <NavIcon icon={Explore} active={view === ViewState.AR_GUIDE} label="NAVIGATION" />
          </div>
          <div onClick={() => setView(ViewState.OBJECTS)}>
            <NavIcon icon={Stars} active={view === ViewState.OBJECTS} label="EXPLORE" />
          </div>
          <div onClick={() => setView(ViewState.SETUP)}>
            <NavIcon icon={SettingsMotionMode} active={view === ViewState.SETUP} label="SYSTEM" />
          </div>
        </nav>
      </div>

      {/* Decorative HUD Scanline Effect */}
      <div className="fixed inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] opacity-10"></div>
    </div>
  );
}

const SidebarItem = ({ icon: Icon, label, onClick, active }: { icon: any, label: string, onClick?: () => void, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 py-4 px-6 transition-all duration-200 uppercase tracking-widest text-xs font-bold",
      active ? "bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400" : "text-cyan-900 hover:bg-cyan-500/5 hover:text-cyan-300"
    )}
  >
    <Icon size={18} />
    {label}
  </button>
);
