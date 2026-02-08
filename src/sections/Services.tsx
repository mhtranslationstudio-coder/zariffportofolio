import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Stethoscope, Heart, Users, Leaf, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

const icons = {
  Stethoscope,
  Heart,
  Users,
  Leaf,
};

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const { t } = useLanguage();

  const servicesList = t.services.items;

  const serviceIcons = ['Stethoscope', 'Heart', 'Users', 'Leaf'] as const;
  const serviceColors = ['sage', 'gold', 'sage', 'gold'] as const;

  const whatsappNumber = '+5585992233635';
  const whatsappMessage = encodeURIComponent('Olá! Gostaria de agendar uma consulta.');
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current;
    const svg = svgRef.current;

    if (!section || !heading || !cards || !svg) return;

    const triggers: ScrollTrigger[] = [];

    // Heading animation
    const headingTrigger = ScrollTrigger.create({
      trigger: section,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(
          heading.children,
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1 }
        );
      },
      once: true,
    });
    triggers.push(headingTrigger);

    // Cards animation
    const cardsTrigger = ScrollTrigger.create({
      trigger: cards,
      start: 'top 80%',
      onEnter: () => {
        gsap.fromTo(
          cards.children,
          { scale: 0.8, opacity: 0, y: 40 },
          {
            scale: 1,
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: 0.1,
          }
        );
      },
      once: true,
    });
    triggers.push(cardsTrigger);

    // SVG line animation
    const svgTrigger = ScrollTrigger.create({
      trigger: cards,
      start: 'top 70%',
      onEnter: () => {
        const paths = svg.querySelectorAll('path');
        paths.forEach((path) => {
          const length = (path as SVGPathElement).getTotalLength?.() || 200;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(path, {
            strokeDashoffset: 0,
            duration: 1.5,
            ease: 'none',
            delay: 0.5,
          });
        });
      },
      once: true,
    });
    triggers.push(svgTrigger);

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-cream overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16 space-y-4">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold text-sage-dark">
            {t.services.heading}
          </h2>
          <p className="font-body text-lg text-dark/70 max-w-2xl mx-auto">
            {t.services.subheading}
          </p>
        </div>

        {/* Services Grid with Connection Lines */}
        <div className="relative">
          {/* Connection Lines SVG */}
          <svg
            ref={svgRef}
            className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block"
            style={{ zIndex: 0 }}
          >
            {/* Horizontal connections */}
            <path
              d="M 25% 25% Q 37.5% 25%, 50% 50%"
              fill="none"
              stroke="#7d8a74"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <path
              d="M 75% 25% Q 62.5% 25%, 50% 50%"
              fill="none"
              stroke="#7d8a74"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <path
              d="M 25% 75% Q 37.5% 75%, 50% 50%"
              fill="none"
              stroke="#7d8a74"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
            <path
              d="M 75% 75% Q 62.5% 75%, 50% 50%"
              fill="none"
              stroke="#7d8a74"
              strokeWidth="1"
              strokeOpacity="0.3"
            />
          </svg>

          {/* Cards Grid */}
          <div
            ref={cardsRef}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 relative z-10"
          >
            {servicesList.map((service, index) => {
              const iconName = serviceIcons[index];
              const Icon = icons[iconName];
              const color = serviceColors[index];
              return (
                <div
                  key={index}
                  className="group relative bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-500 ease-custom-expo overflow-hidden"
                >
                  {/* Hover Background */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${
                      color === 'sage'
                        ? 'bg-gradient-to-br from-sage/5 to-transparent'
                        : 'bg-gradient-to-br from-gold/5 to-transparent'
                    }`}
                  />

                  {/* Icon */}
                  <div
                    className={`relative w-14 h-14 rounded-xl flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 ${
                      color === 'sage'
                        ? 'bg-sage/10 text-sage group-hover:bg-sage group-hover:text-white'
                        : 'bg-gold/10 text-gold group-hover:bg-gold group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-7 h-7" />
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="font-heading text-2xl font-semibold text-sage-dark mb-3 group-hover:text-sage transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="font-body text-sm text-dark/70 leading-relaxed mb-4">
                      {service.description}
                    </p>

                    {/* Learn More Link */}
                    <div
                      className={`flex items-center gap-2 font-body text-sm font-medium transition-all duration-300 ${
                        color === 'sage'
                          ? 'text-sage group-hover:gap-4'
                          : 'text-gold group-hover:gap-4'
                      }`}
                    >
                      <span>{t.services.learnMore}</span>
                      <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </div>

                  {/* Corner Accent */}
                  <div
                    className={`absolute top-0 right-0 w-20 h-20 opacity-10 transition-opacity duration-300 group-hover:opacity-20 ${
                      color === 'sage' ? 'text-sage' : 'text-gold'
                    }`}
                  >
                    <Icon className="w-full h-full -translate-y-1/2 translate-x-1/2" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <p className="font-body text-dark/60 mb-4">
            {t.services.notSure}
          </p>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-sage text-white font-body font-medium rounded-full hover:bg-sage-dark transition-all duration-300 hover:shadow-glow hover:-translate-y-1"
          >
            <span>{t.services.schedule}</span>
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-sage/5 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-gold/5 rounded-full blur-3xl" />
    </section>
  );
}
