'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Layers, ChevronLeft, ChevronRight, X, Sparkles, Volume2, VolumeX, CheckCircle } from 'lucide-react';

interface StorySlide {
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  image: string;
}

interface VisualStory {
  id: string;
  title: string;
  category: string;
  coverImage: string;
  slideCount: number;
  slides: StorySlide[];
}

const VISUAL_STORIES: VisualStory[] = [
  {
    id: 'vs-1',
    title: '7 Warning Signs of Heart Fatigue You Shouldn\'t Ignore',
    category: 'Cardiology',
    coverImage: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80',
    slideCount: 7,
    slides: [
      {
        title: 'Unexplained Chronic Fatigue',
        subtitle: 'Sign 1 of 7',
        description: 'Exhaustion that persists after 8 hours of quality rest often indicates sub-optimal cardiac output and reduced oxygenated blood delivery to skeletal muscles.',
        highlight: 'Persistent for > 2 weeks without physical exertion',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Bilateral Lower Extremity Swelling',
        subtitle: 'Sign 2 of 7',
        description: 'Fluid retention (peripheral edema) in ankles and feet as gravity pulls venous blood when ventricular pumping efficiency declines.',
        highlight: 'Sock band marks remaining deeply etched on skin',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Orthopnea (Breathlessness Lying Flat)',
        subtitle: 'Sign 3 of 7',
        description: 'Needing two or more pillows to breathe comfortably while sleeping indicates elevated pulmonary capillary wedge pressure.',
        highlight: 'Sudden nighttime gasping or sleeping elevated',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Sudden Inexplicable Weight Gain',
        subtitle: 'Sign 4 of 7',
        description: 'Gaining 1.5 to 2 kg over 48 hours is almost always rapid fluid accumulation rather than adipose tissue.',
        highlight: 'Weigh yourself daily at the same morning hour',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Subtle Jaw, Neck, or Left Shoulder Ache',
        subtitle: 'Sign 5 of 7',
        description: 'Referred autonomic neural signaling can mask coronary ischemia as chronic dental soreness or upper back muscle spasm.',
        highlight: 'Often ignored in diabetic patients and women',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Lightheadedness When Standing Rapidly',
        subtitle: 'Sign 6 of 7',
        description: 'Postural hypotension or transient valve regurgitation can temporarily reduce cerebral blood perfusion upon standing.',
        highlight: 'Blood pressure drop of > 20 mmHg systolic',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'When to Seek Immediate Emergency Care',
        subtitle: 'Sign 7 of 7: Clinical Action',
        description: 'If chest constriction accompanies diaphoresis (cold sweats) or nausea, call local emergency services immediately.',
        highlight: 'Emergency Response: Golden hour is crucial',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'vs-2',
    title: 'How Cancer Cells Evade the Immune System: 5-Step Visual',
    category: 'Oncology',
    coverImage: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    slideCount: 5,
    slides: [
      {
        title: 'Antigen Masking & Downregulation',
        subtitle: 'Step 1 of 5',
        description: 'Malignant cells shed or decrease surface Major Histocompatibility Complex (MHC) molecules, becoming invisible to surveillance CD8+ killer T cells.',
        highlight: 'The Molecular Cloaking Mechanism',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'The PD-1 / PD-L1 Handshake of Deception',
        subtitle: 'Step 2 of 5',
        description: 'Tumors express PD-L1 ligand which binds to PD-1 receptor on T-cells, transmitting an inhibitory signal that deactivates cytotoxic attack.',
        highlight: 'The basis for modern checkpoint inhibitor therapy',
        image: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Recruitment of Regulatory T Cells (Tregs)',
        subtitle: 'Step 3 of 5',
        description: 'Cancerous microenvironments secrete chemokines (CCL22) that attract immunosuppressive Tregs to disarm neighboring active white blood cells.',
        highlight: 'Creating a protective immunosuppressive shield',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Metabolic Starvation of T Cells',
        subtitle: 'Step 4 of 5',
        description: 'Rapid tumor glycolysis depletes local glucose and generates acidic lactic acid pools where normal immune lymphocytes cannot survive.',
        highlight: 'The Warburg Effect as an immunological defense',
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'CAR-T & Monoclonal Antibody Countermeasures',
        subtitle: 'Step 5 of 5: The Breakthrough',
        description: 'Modern immunotherapy re-engineers patient T-cells with synthetic chimeric receptors to detect tumors despite their cloaking defenses.',
        highlight: 'Up to 80% remission rates in hematologic malignancies',
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'vs-3',
    title: '10 Diabetes-Friendly Indian Breakfast Swaps',
    category: 'Dietetics',
    coverImage: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80',
    slideCount: 5,
    slides: [
      {
        title: 'Swap White Rice Idli for Moong Dal Chilla',
        subtitle: 'Swap 1 of 5',
        description: 'Fermented white rice idli causes rapid glycemic spikes (GI: 70+). Moong dal chilla provides 18g plant protein with complex, slow-digesting oligosaccharides.',
        highlight: 'Reduces postprandial glucose spike by up to 42%',
        image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Swap Maida Paratha for Methi Missi Roti',
        subtitle: 'Swap 2 of 5',
        description: 'Combining chickpea flour (besan) with fresh fenugreek leaves introduces 4-hydroxyisoleucine, an amino acid that stimulates insulin secretion.',
        highlight: 'Rich in soluble fiber and fenugreek bioactives',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Swap Cornflakes for Steel-Cut Oats Upma',
        subtitle: 'Swap 3 of 5',
        description: 'Processed breakfast cereals are fast starch bombs. Steel-cut oats cooked with mustard seeds, curry leaves, and beans provide beta-glucan fiber.',
        highlight: 'Beta-glucan forms viscous gut gel slowing carb uptake',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Swap Fruit Juice for Whole Guava or Jamun',
        subtitle: 'Swap 4 of 5',
        description: 'Packaged or strained juices strip insoluble fiber, delivering 25g liquid fructose. Whole guava offers 5.4g fiber and lower glycemic load.',
        highlight: 'Jamun seeds contain jamboline which inhibits starch-to-sugar conversion',
        image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Swap Sweet Chai for Masala Green Tea or Cinnamon Infusion',
        subtitle: 'Swap 5 of 5',
        description: 'A 2-teaspoon sugar cup of morning tea adds 10g refined sucrose. Ceylon cinnamon infusion improves cellular insulin receptor sensitivity.',
        highlight: 'Clinical trials show 1g cinnamon daily improves fasting glucose',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'vs-4',
    title: 'Sleep Posture & Spinal Alignment Guide',
    category: 'Orthopedics',
    coverImage: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    slideCount: 4,
    slides: [
      {
        title: 'The Side Sleeper Ergonomic Blueprint',
        subtitle: 'Position 1: Lateral Decubitus',
        description: 'Place a firm pillow between knees to keep the pelvis, lumbar spine, and thoracic vertebra in neutral, horizontal collinearity.',
        highlight: 'Prevents sciatic nerve impingement and lumbar twisting',
        image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Why Left-Side Sleeping Aids Digestion',
        subtitle: 'Gastroenterology Insight',
        description: 'Due to gastric anatomy, left lateral sleeping positions the gastroesophageal junction above gastric acid level, preventing nocturnal acid reflux.',
        highlight: 'Recommended for GERD and pregnant mothers in 3rd trimester',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'The Supine (Back) Position with Knee Bolster',
        subtitle: 'Position 2: Dorsal Supine',
        description: 'Sleeping flat on your back distributes weight evenly. A small cylindrical cushion beneath knees maintains natural lumbar lordosis.',
        highlight: 'Optimal for facial wrinkle prevention & spine unloading',
        image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Why Prone (Stomach) Sleeping Strains Cervical Spine',
        subtitle: 'Position Warning',
        description: 'Sleeping face down forces neck rotation to 90 degrees for hours, causing facet joint compression, morning torticollis, and hyperextension.',
        highlight: 'Orthopedist advisory: Avoid stomach sleeping if neck pain exists',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'vs-5',
    title: 'Childhood Fever: When to Call the Pediatrician',
    category: 'Pediatrics',
    coverImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    slideCount: 4,
    slides: [
      {
        title: 'Age 0-3 Months: Strict Zero-Tolerance Rule',
        subtitle: 'Critical Guideline',
        description: 'Any rectal temperature >= 100.4°F (38.0°C) in an infant under 90 days warrants immediate emergency room pediatric evaluation.',
        highlight: 'Immature blood-brain barrier requires immediate exclusion of sepsis',
        image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Red-Flag Behavior: Lethargy & Poor Intake',
        subtitle: 'Assessing Toxicity',
        description: 'Look at the child, not just the thermometer. An active child with 102°F is often safer than a limp, non-responsive toddler with 100.5°F.',
        highlight: 'Monitor wet diaper frequency: Minimum 4-6 wet nappies in 24 hours',
        image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Understanding Febrile Seizures',
        subtitle: 'What Every Parent Must Know',
        description: 'Occur in 3-5% of young children during rapid temperature elevation. While alarming, simple febrile seizures rarely cause lasting neurological harm.',
        highlight: 'Do not restrain or put objects in mouth; turn child to side',
        image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Safe Hydration & Antipyretic Dosing',
        subtitle: 'Home Management Best Practices',
        description: 'Never give aspirin to children due to Reye Syndrome risk. Always dose paracetamol or ibuprofen by exact body weight, never by age.',
        highlight: 'Prioritize oral rehydration solutions and light cotton clothing',
        image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80'
      }
    ]
  },
  {
    id: 'vs-6',
    title: 'The 4-7-8 Breathing Technique for Acute Stress',
    category: 'Mental Health',
    coverImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80',
    slideCount: 4,
    slides: [
      {
        title: 'Inhale Quietly Through the Nose for 4 Seconds',
        subtitle: 'Phase 1: Controlled Oxygenation',
        description: 'Close your mouth and inhale gently through nasal passages, feeling your diaphragm expand downwards into your abdominal cavity.',
        highlight: 'Engages parasympathetic tone through nitric oxide inhalation',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Hold Your Breath Steadily for 7 Seconds',
        subtitle: 'Phase 2: Carbon Dioxide Equilibration',
        description: 'Retain air without tensing shoulder muscles. This pause allows red blood cells to maximize hemoglobin-oxygen dissociation to tissues.',
        highlight: 'Calms hyperactive amygdala signaling in under 30 seconds',
        image: 'https://images.unsplash.com/photo-1530497610245-94d3c16cda28?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Exhale Audibly with a Whoosh for 8 Seconds',
        subtitle: 'Phase 3: Vagal Nerve Activation',
        description: 'Purse your lips and blow out all air completely with a soft whoosh sound. Prolonged expiration directly slows sinus node heart rate.',
        highlight: 'Vagus nerve stimulation drops heart rate by 8-12 bpm',
        image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=800&q=80'
      },
      {
        title: 'Repeat for 4 Complete Cycles Daily',
        subtitle: 'Phase 4: Clinical Conditioning',
        description: 'Practicing twice daily retrains baroreceptor sensitivity and lowers resting sympathetic tone during workplace stress or insomnia.',
        highlight: 'Supported by neurocardiology studies for hypertension control',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
      }
    ]
  }
];

export function VisualStoriesSection() {
  const [activeStory, setActiveStory] = useState<VisualStory | null>(null);
  const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-advance slides every 5 seconds when story viewer is open
  useEffect(() => {
    if (!activeStory || isPaused) return;

    const timer = setInterval(() => {
      setActiveSlideIndex((prev) => {
        if (prev < activeStory.slides.length - 1) {
          return prev + 1;
        } else {
          return 0; // loop or could close
        }
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [activeStory, isPaused]);

  // Keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeStory) return;
      if (e.key === 'Escape') setActiveStory(null);
      if (e.key === 'ArrowRight') {
        setActiveSlideIndex((prev) => Math.min(prev + 1, activeStory.slides.length - 1));
      }
      if (e.key === 'ArrowLeft') {
        setActiveSlideIndex((prev) => Math.max(prev - 1, 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeStory]);

  const openStory = (story: VisualStory) => {
    setActiveStory(story);
    setActiveSlideIndex(0);
    setIsPaused(false);
  };

  const closeStory = () => {
    setActiveStory(null);
    setActiveSlideIndex(0);
  };

  const nextSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex < activeStory.slides.length - 1) {
      setActiveSlideIndex(activeSlideIndex + 1);
    } else {
      closeStory();
    }
  };

  const prevSlide = () => {
    if (!activeStory) return;
    if (activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };

  return (
    <section className="w-full py-8 bg-[#0F2213] text-white">
      <div className="max-w-7xl xl:max-w-[1440px] 2xl:max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#CBF2DB] flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Visual Health Stories
                </h2>
                <span className="px-2 py-0.5 bg-accent/20 text-accent border border-accent/30 text-xs font-semibold uppercase tracking-wider rounded-full">
                  Tap to View
                </span>
              </div>
              <p className="text-sm text-emerald-200/70 mt-0.5">
                Snackable clinical takeaways, medical infographics, and visual health guides
              </p>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {VISUAL_STORIES.map((story) => (
            <button
              key={story.id}
              onClick={() => openStory(story)}
              className="group relative flex flex-col rounded-2xl overflow-hidden aspect-[9/15] bg-gray-900 border-2 border-emerald-500/30 hover:border-accent transition-all duration-300 transform hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-accent/20 text-left focus:outline-none focus:ring-2 focus:ring-accent"
              aria-label={`Open visual story: ${story.title}`}
            >
              {/* Cover Image */}
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 group-hover:via-black/50 transition-all duration-300" />

              {/* Top Badges */}
              <div className="relative z-10 p-3 flex items-center justify-between w-full">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase bg-black/60 backdrop-blur-md text-emerald-300 border border-emerald-500/30">
                  {story.category}
                </span>
                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-accent/90 text-white shadow-sm">
                  <Layers className="w-3 h-3" />
                  {story.slideCount}
                </span>
              </div>

              {/* Bottom Title & CTA */}
              <div className="relative z-10 mt-auto p-3">
                <p className="text-xs sm:text-sm font-bold text-white leading-snug line-clamp-3 group-hover:text-emerald-300 transition-colors">
                  {story.title}
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-white/70 group-hover:text-white font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                  <span>Tap to view</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Full-Screen Visual Story Viewer Modal */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div className="relative w-full max-w-md h-[92vh] max-h-[820px] bg-gray-950 rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col">
            {/* Progress Bars at Top */}
            <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
              {activeStory.slides.map((_, idx) => (
                <div key={idx} className="flex-1 h-1 bg-white/25 rounded-full overflow-hidden">
                  <div
                    className={`h-full bg-accent transition-all duration-300 ${
                      idx < activeSlideIndex
                        ? 'w-full'
                        : idx === activeSlideIndex
                        ? 'w-full animate-pulse'
                        : 'w-0'
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* Header Controls */}
            <div className="absolute top-6 left-3 right-3 z-30 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md border border-white/20 text-emerald-300">
                  {activeStory.category}
                </span>
                <span className="text-xs text-white/70 font-medium">
                  {activeSlideIndex + 1} of {activeStory.slides.length}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-colors"
                  aria-label={isPaused ? 'Resume story' : 'Pause story'}
                >
                  {isPaused ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={closeStory}
                  className="p-1.5 rounded-full bg-black/50 hover:bg-black/80 text-white/80 hover:text-white transition-colors"
                  aria-label="Close story"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Current Slide Content */}
            {activeStory.slides[activeSlideIndex] && (
              <div className="relative w-full h-full flex flex-col justify-end">
                {/* Background Image */}
                <Image
                  src={activeStory.slides[activeSlideIndex].image}
                  alt={activeStory.slides[activeSlideIndex].title}
                  fill
                  sizes="(max-width: 640px) 100vw, 448px"
                  priority
                  className="object-cover"
                />

                {/* Gradient Dimmer */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/30" />

                {/* Slide Text Card */}
                <div className="relative z-20 p-5 sm:p-6 pb-8 bg-gradient-to-t from-black/90 via-black/80 to-transparent">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold text-accent bg-accent/15 border border-accent/30 mb-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {activeStory.slides[activeSlideIndex].subtitle}
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold font-heading text-white mb-2 leading-tight">
                    {activeStory.slides[activeSlideIndex].title}
                  </h3>

                  <p className="text-sm text-gray-200 leading-relaxed mb-4">
                    {activeStory.slides[activeSlideIndex].description}
                  </p>

                  <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                    <p className="text-xs font-semibold text-emerald-300">
                      💡 Takeaway: {activeStory.slides[activeSlideIndex].highlight}
                    </p>
                  </div>
                </div>

                {/* Left / Right Tap Areas for mobile & desktop navigation */}
                <button
                  onClick={prevSlide}
                  disabled={activeSlideIndex === 0}
                  className="absolute left-0 top-16 bottom-32 w-1/3 z-20 focus:outline-none cursor-pointer group flex items-center pl-2"
                  aria-label="Previous slide"
                >
                  {activeSlideIndex > 0 && (
                    <span className="p-2 rounded-full bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft className="w-6 h-6" />
                    </span>
                  )}
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-16 bottom-32 w-1/3 z-20 focus:outline-none cursor-pointer group flex items-center justify-end pr-2"
                  aria-label="Next slide"
                >
                  <span className="p-2 rounded-full bg-black/40 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ChevronRight className="w-6 h-6" />
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
