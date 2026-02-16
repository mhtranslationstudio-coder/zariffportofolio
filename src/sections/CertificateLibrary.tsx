import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { certificates } from '@/data/certificates';
import type { Certificate, FilterCategory } from '@/types';
import { X, Calendar, Award, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import './CertificateLibrary.css';

gsap.registerPlugin(ScrollTrigger);

export default function CertificateLibrary() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const carousel3dRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [lastClickTime, setLastClickTime] = useState(0);
  const { t } = useLanguage();

  const filters: { key: FilterCategory; label: string }[] = [
    { key: 'all', label: t.certificates.filters.all },
    { key: 'clinical', label: t.certificates.filters.clinical },
    { key: 'sports', label: t.certificates.filters.sports },
    { key: 'specialized', label: t.certificates.filters.specialized },
    { key: 'certification', label: t.certificates.filters.certification },
  ];

  const filteredCertificates =
    activeFilter === 'all'
      ? certificates
      : certificates.filter((cert) => cert.category === activeFilter);

  const N = filteredCertificates.length;
  const anglePerCard = N > 0 ? 360 / N : 30;

  // Detect mobile/tablet vs desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // GSAP animations
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;

    if (!section || !heading) return;

    const triggers: ScrollTrigger[] = [];

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

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  // Handle click/double-click logic
  const handleCertificateClick = (cert: Certificate) => {
    const now = Date.now();
    
    if (isMobile) {
      // Mobile: single click opens modal
      openModal(cert);
    } else {
      // Desktop: double click opens modal
      if (now - lastClickTime < 300) {
        // Double click detected
        openModal(cert);
      }
      setLastClickTime(now);
    }
  };

  const openModal = (cert: Certificate) => {
    setSelectedCert(cert);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = '';
    setTimeout(() => setSelectedCert(null), 300);
  };

  return (
    <section
      ref={sectionRef}
      id="certificates"
      className="relative py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-cream overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-8 sm:mb-10 md:mb-12 space-y-3 sm:space-y-4">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-sage-dark">
            {t.certificates.heading}
          </h2>
          <p className="font-body text-base sm:text-lg text-dark/70 max-w-2xl mx-auto px-2">
            {t.certificates.subheading}
          </p>
          {!isMobile && (
            <p className="font-body text-xs sm:text-sm text-dark/50 mt-2">
              Double-click a certificate to view details
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 sm:mb-10 md:mb-12 px-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2 md:py-3 rounded-full font-body text-xs sm:text-sm md:text-base transition-all duration-300 whitespace-nowrap ${
                activeFilter === filter.key
                  ? 'bg-sage text-white shadow-glow'
                  : 'bg-white text-sage-dark border border-sage/20 hover:bg-sage/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* 3D Carousel - Desktop & Tablet */}
        {filteredCertificates.length > 0 && (
          <>
            {/* Desktop/Tablet Carousel (visible on md and up) */}
            <div 
              ref={carouselContainerRef}
              className="hidden md:block carousel-container"
              style={{
                '--angle-per-card': `${anglePerCard}deg`,
              } as React.CSSProperties}
            >
              <div className="carousel-scene">
                <div
                  ref={carousel3dRef}
                  className="carousel-3d"
                >
                  {filteredCertificates.map((cert, index) => (
                    <img
                      key={cert.id}
                      src={cert.image}
                      alt={cert.title}
                      className="carousel-card cursor-pointer transition-all duration-300 hover:brightness-110"
                      style={{
                        '--card-index': index,
                      } as React.CSSProperties}
                      onClick={() => handleCertificateClick(cert)}
                      loading="lazy"
                      title={`${cert.title} - Double-click to view details`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Grid (visible on sm and below) */}
            <div className="md:hidden grid grid-cols-2 gap-3 sm:gap-4 px-2">
              {filteredCertificates.map((cert, index) => (
                <div
                  key={cert.id}
                  className="group relative cursor-pointer overflow-hidden rounded-lg sm:rounded-xl transform transition-all duration-300 hover:scale-105 active:scale-95"
                  onClick={() => handleCertificateClick(cert)}
                >
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full aspect-[7/10] object-cover"
                    loading="lazy"
                    title={`${cert.title} - Click to view details`}
                  />
                  
                  {/* Overlay on hover/focus */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  
                  {/* Info card */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 transform translate-y-0 group-hover:translate-y-0">
                    <h3 className="font-heading text-xs sm:text-sm text-white font-semibold line-clamp-2 leading-tight">
                      {cert.title}
                    </h3>
                    <p className="font-body text-xs text-white/80 line-clamp-1 mt-1">
                      {cert.institution}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {filteredCertificates.length === 0 && (
          <div className="text-center py-12">
            <p className="font-body text-dark/60">No certificates found in this category.</p>
          </div>
        )}

        {/* Certificate Count */}
        <div className="text-center mt-8 sm:mt-10 md:mt-12 px-2">
          <p className="font-body text-xs sm:text-sm text-dark/60">
            {t.certificates.showing} {filteredCertificates.length} {t.certificates.of}{' '}
            {certificates.length} {t.certificates.certificates}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-2xl sm:max-w-5xl max-h-[85vh] sm:max-h-[90vh] overflow-y-auto overflow-x-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="sticky top-3 sm:top-4 right-3 sm:right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-sage hover:text-white transition-colors duration-300"
              aria-label="Close modal"
            >
              <X className="w-4 sm:w-5 h-4 sm:h-5" />
            </button>

            {/* Mobile: Stacked Layout | Desktop: Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {/* Certificate Image */}
              <div className="aspect-[4/3] md:aspect-auto md:h-[80vh] bg-cream flex items-center justify-center overflow-hidden">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Certificate Details */}
              <div className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6">
                <div>
                  <span className="inline-block px-2 sm:px-3 py-1 bg-sage/10 text-sage text-xs font-body uppercase tracking-wider rounded-full mb-2 sm:mb-3">
                    {selectedCert.category}
                  </span>
                  <h3 className="font-heading text-lg sm:text-2xl md:text-3xl font-semibold text-sage-dark">
                    {selectedCert.title}
                  </h3>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-sage-dark/80">
                    <Award className="w-4 sm:w-5 h-4 sm:h-5 text-sage flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="font-body text-xs sm:text-sm">{selectedCert.institution}</span>
                  </div>
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 text-sage-dark/80">
                    <Calendar className="w-4 sm:w-5 h-4 sm:h-5 text-sage flex-shrink-0 mt-0.5 sm:mt-0" />
                    <span className="font-body text-xs sm:text-sm">
                      {t.certificates.completed} {selectedCert.date}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading text-sm sm:text-lg text-sage-dark mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 sm:w-5 h-4 sm:h-5 text-sage flex-shrink-0" />
                    {t.certificates.description}
                  </h4>
                  <p className="font-body text-xs sm:text-sm text-sage-dark/80 leading-relaxed">
                    {selectedCert.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-heading text-sm sm:text-lg text-sage-dark mb-2 sm:mb-3">
                    {t.certificates.skills}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-gold/10 text-gold-dark font-body text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Background */}
      <div className="absolute top-1/2 left-0 w-48 sm:w-64 h-48 sm:h-64 bg-sage/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/3 right-0 w-40 sm:w-48 h-40 sm:h-48 bg-gold/5 rounded-full blur-3xl pointer-events-none" />
    </section>
  );
}
