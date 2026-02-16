import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { certificates } from '@/data/certificates';
import type { Certificate, FilterCategory } from '@/types';
import { X, Calendar, Award, BookOpen } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

gsap.registerPlugin(ScrollTrigger);

export default function CertificateLibrary() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;

    if (!section || !heading || !grid) return;

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

    const gridTrigger = ScrollTrigger.create({
      trigger: grid,
      start: 'top 85%',
      onEnter: () => {
        gsap.fromTo(
          grid.children,
          { y: 60, opacity: 0, rotateX: 15 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.08,
          }
        );
      },
      once: true,
    });
    triggers.push(gridTrigger);

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    gsap.fromTo(
      grid.children,
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05 }
    );
  }, [activeFilter]);

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
      className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-cream overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-12 space-y-4">
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-semibold text-sage-dark">
            {t.certificates.heading}
          </h2>
          <p className="font-body text-lg text-dark/70 max-w-2xl mx-auto">
            {t.certificates.subheading}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-body text-sm sm:text-base transition-all duration-300 ${
                activeFilter === filter.key
                  ? 'bg-sage text-white shadow-glow'
                  : 'bg-white text-sage-dark border border-sage/20 hover:bg-sage/10'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Certificate Grid - 3D Bookshelf Style */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 perspective-1000"
        >
          {filteredCertificates.map((cert) => (
            <div
              key={cert.id}
              onClick={() => openModal(cert)}
              className="group relative cursor-pointer preserve-3d"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Book/Card Container */}
              <div
                className="relative bg-white rounded-lg shadow-book overflow-hidden transition-all duration-500 ease-custom-expo group-hover:shadow-book-hover group-hover:-translate-y-3 group-hover:scale-105"
                style={{
                  transform: 'rotateX(5deg)',
                  transformOrigin: 'center bottom',
                }}
              >
                {/* Certificate Image */}
                <div className="aspect-[4/3] overflow-hidden bg-cream">
                  <img
                    src={cert.image}
                    alt={cert.title}
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Book Spine Effect */}
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-sage/30 to-transparent" />

                {/* Hover Glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-sage/20 to-transparent pointer-events-none" />

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white/95 to-transparent">
                  <h3 className="font-heading text-sm font-semibold text-sage-dark line-clamp-2 leading-tight">
                    {cert.title}
                  </h3>
                  <p className="font-body text-xs text-sage mt-1">{cert.institution}</p>
                </div>
              </div>

              {/* Floating Shadow */}
              <div className="absolute -bottom-4 left-4 right-4 h-4 bg-black/10 rounded-full blur-md transition-all duration-500 group-hover:blur-lg group-hover:bg-black/20" />
            </div>
          ))}
        </div>

        {/* Certificate Count */}
        <div className="text-center mt-12">
          <p className="font-body text-sm text-dark/60">
            {t.certificates.showing} {filteredCertificates.length} {t.certificates.of}{' '}
            {certificates.length} {t.certificates.certificates}
          </p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto overflow-x-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 rounded-full hover:bg-sage hover:text-white transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Certificate Image */}
              <div className="aspect-[4/3] md:aspect-auto md:h-[80vh] bg-cream">
                <img
                  src={selectedCert.image}
                  alt={selectedCert.title}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Certificate Details */}
              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <span className="inline-block px-3 py-1 bg-sage/10 text-sage text-xs font-body uppercase tracking-wider rounded-full mb-3">
                    {selectedCert.category}
                  </span>
                  <h3 className="font-heading text-2xl md:text-3xl font-semibold text-sage-dark">
                    {selectedCert.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sage-dark/80">
                    <Award className="w-5 h-5 text-sage" />
                    <span className="font-body text-sm">{selectedCert.institution}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sage-dark/80">
                    <Calendar className="w-5 h-5 text-sage" />
                    <span className="font-body text-sm">
                      {t.certificates.completed} {selectedCert.date}
                    </span>
                  </div>
                </div>

                <div>
                  <h4 className="font-heading text-lg text-sage-dark mb-2 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-sage" />
                    {t.certificates.description}
                  </h4>
                  <p className="font-body text-sm text-sage-dark/80 leading-relaxed">
                    {selectedCert.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-heading text-lg text-sage-dark mb-3">
                    {t.certificates.skills}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCert.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gold/10 text-gold-dark font-body text-xs rounded-full"
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
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-sage/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/3 right-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl" />
    </section>
  );
}
