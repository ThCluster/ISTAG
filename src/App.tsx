import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { FlyerAnnouncementBanner } from './components/FlyerAnnouncementBanner';
import { FlyerShowcaseModal } from './components/FlyerShowcaseModal';
import { PresentationSection } from './components/PresentationSection';
import { ProgramsSection } from './components/ProgramsSection';
import { EmployabilitySection } from './components/EmployabilitySection';
import { TenueReglementaireSection } from './components/TenueReglementaireSection';
import { PreRegistrationSection } from './components/PreRegistrationSection';
import { TuitionSection } from './components/TuitionSection';
import { ContactAndFaqSection } from './components/ContactAndFaqSection';
import { Footer } from './components/Footer';
import { PreRegistrationPage } from './pages/PreRegistrationPage';
import { ProgramDetailPage } from './pages/ProgramDetailPage';
import { Program, PROGRAMS } from './data/programsData';

export default function App() {
  const [isFlyerModalOpen, setIsFlyerModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'inscription' | 'programme'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#inscription' || hash === '#pre-inscription') {
        return 'inscription';
      }
      if (hash.startsWith('#programme-')) {
        return 'programme';
      }
      if (hash === '#flyer' || hash === '#depliant') {
        return 'home';
      }
    }
    return 'home';
  });

  const [preSelectedProgram, setPreSelectedProgram] = useState<Program | null>(null);
  const [selectedProgramForDetails, setSelectedProgramForDetails] = useState<Program | null>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.toLowerCase();
      if (hash.startsWith('#programme-')) {
        const id = hash.replace('#programme-', '');
        const found = PROGRAMS.find((p) => p.id === id);
        return found || PROGRAMS[0];
      }
    }
    return null;
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash === '#inscription' || hash === '#pre-inscription') {
        setCurrentPage('inscription');
      } else if (hash.startsWith('#programme-')) {
        const id = hash.replace('#programme-', '');
        const found = PROGRAMS.find((p) => p.id === id);
        if (found) {
          setSelectedProgramForDetails(found);
          setCurrentPage('programme');
        } else {
          setCurrentPage('home');
        }
      } else if (hash === '#flyer' || hash === '#depliant') {
        setIsFlyerModalOpen(true);
        setCurrentPage('home');
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToInscription = (prog?: Program) => {
    if (prog) {
      setPreSelectedProgram(prog);
    } else {
      setPreSelectedProgram(null);
    }
    window.location.hash = '#inscription';
    setCurrentPage('inscription');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToProgramDetails = (prog: Program) => {
    setSelectedProgramForDetails(prog);
    window.location.hash = `#programme-${prog.id}`;
    setCurrentPage('programme');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToHome = (targetHash?: string) => {
    if (targetHash) {
      window.location.hash = targetHash;
    } else {
      window.history.pushState(null, '', window.location.pathname);
    }
    setCurrentPage('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExplorePrograms = () => {
    const el = document.getElementById('formations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // If on the standalone independent Inscription & Pré-inscription Page
  if (currentPage === 'inscription') {
    return (
      <PreRegistrationPage
        initialProgram={preSelectedProgram}
        onBackToHome={() => navigateToHome()}
      />
    );
  }

  // If on the standalone independent Program Details Page
  if (currentPage === 'programme' && selectedProgramForDetails) {
    return (
      <ProgramDetailPage
        program={selectedProgramForDetails}
        onBackToHome={() => navigateToHome('#formations')}
        onSelectProgramForRegistration={(prog) => navigateToInscription(prog)}
        onSelectOtherProgram={(prog) => navigateToProgramDetails(prog)}
      />
    );
  }

  // Showcase Homepage
  return (
    <div className="min-h-screen bg-[#F8FAF9] text-[#1F2933] selection:bg-[#08783F]/20 selection:text-[#056331]">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenPreRegistration={() => navigateToInscription()}
        onOpenFlyer={() => setIsFlyerModalOpen(true)}
      />

      <main>
        {/* Hero Section */}
        <Hero
          onOpenPreRegistration={() => navigateToInscription()}
          onExplorePrograms={handleExplorePrograms}
          onOpenFlyer={() => setIsFlyerModalOpen(true)}
        />

        {/* Official Flyer & Campus Gagnoa Announcement Banner */}
        <FlyerAnnouncementBanner
          onOpenFlyerModal={() => setIsFlyerModalOpen(true)}
          onOpenPreRegistration={() => navigateToInscription()}
        />

        {/* 01. Institution & History Presentation */}
        <PresentationSection />

        {/* 02. Academic Programs & Diplomas */}
        <ProgramsSection
          onSelectProgramForRegistration={(prog) => navigateToInscription(prog)}
          onViewProgramDetails={(prog) => navigateToProgramDetails(prog)}
        />

        {/* 03. Employability & Practical Approach */}
        <EmployabilitySection />

        {/* 04. Tenue Réglementaire */}
        <TenueReglementaireSection />

        {/* 05. Pre-Registration Flow & Tracking */}
        <PreRegistrationSection
          onOpenPreRegistration={(prog) => navigateToInscription(prog)}
        />

        {/* 06. Tuition Simulator & Fees */}
        <TuitionSection />

        {/* 07. FAQ & Contact Information */}
        <ContactAndFaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Official Flyer & Dépliant Modal */}
      <FlyerShowcaseModal
        isOpen={isFlyerModalOpen}
        onClose={() => setIsFlyerModalOpen(false)}
        onOpenPreRegistration={(programId) => {
          setIsFlyerModalOpen(false);
          if (programId) {
            const p = PROGRAMS.find((pr) => pr.id === programId);
            navigateToInscription(p);
          } else {
            navigateToInscription();
          }
        }}
      />
    </div>
  );
}
