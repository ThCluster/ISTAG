import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, PhoneCall, Sparkles, FileText } from 'lucide-react';
import { INSTITUTION } from '../data/institutionData';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenPreRegistration: () => void;
  onOpenFlyer?: () => void;
  activeSection?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenPreRegistration, onOpenFlyer }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Présentation', href: '#presentation' },
    { label: 'Formations', href: '#formations' },
    { label: 'Pédagogie & Emploi', href: '#employabilite' },
    { label: 'Tenue Réglementaire', href: '#tenue-reglementaire' },
    { label: 'Scolarité', href: '#scolarite' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 no-print ${
        isScrolled
          ? 'bg-[#08783F]/95 backdrop-blur-md text-white border-b border-[#056331] shadow-lg py-2.5 sm:py-3'
          : 'bg-[#08783F] text-white border-b border-[#056331] py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Zone 1: Official Logo & Brand Lockup */}
          <a
            href="#"
            className="flex items-center group focus:outline-none"
            aria-label="Accueil ISTAG"
          >
            <Logo size="md" showText={true} lightText={true} />
          </a>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-xs xl:text-sm font-medium text-white/90">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="hover:text-[#F5B51B] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#F5B51B] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:origin-left"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="hidden sm:flex items-center gap-3">
            {onOpenFlyer && (
              <button
                onClick={onOpenFlyer}
                className="px-3 py-1.5 text-xs font-semibold text-white/90 hover:text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#F5B51B]" />
                <span>Flyer Rentrée</span>
              </button>
            )}

            <button
              onClick={onOpenPreRegistration}
              className="px-3.5 py-1.5 text-xs font-bold tracking-wide uppercase text-[#1F2933] bg-[#F5B51B] hover:bg-[#FFC83D] active:bg-[#e0a210] rounded-sm transition-all duration-200 shadow-sm flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Pré-inscription</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile hamburger button & quick CTA */}
          <div className="flex sm:hidden items-center gap-2">
            {onOpenFlyer && (
              <button
                onClick={onOpenFlyer}
                className="px-2.5 py-1 text-[11px] font-semibold text-white bg-white/15 border border-white/30 rounded-sm"
              >
                Flyer
              </button>
            )}

            <button
              onClick={onOpenPreRegistration}
              className="px-2.5 py-1 text-[11px] font-bold uppercase text-[#1F2933] bg-[#F5B51B] rounded-sm"
            >
              Inscrire
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-white/90 hover:text-white rounded-md focus:outline-none"
              aria-label="Ouvrir le menu de navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-[#056331] border-b border-[#08783F] px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block px-3 py-2 text-sm font-medium text-white/90 hover:text-[#F5B51B] hover:bg-white/5 rounded-md"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2.5">
            {onOpenFlyer && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFlyer();
                }}
                className="w-full py-2.5 px-3 bg-white/15 text-white text-xs font-semibold rounded-sm flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-[#F5B51B]" />
                <span>Consulter le Dépliant Officiel ISTAG</span>
              </button>
            )}

            <a
              href={`tel:${INSTITUTION.contact.generalPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-xs text-white/90 px-3 py-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F5B51B]" />
              <span>Infoline Gagnoa : {INSTITUTION.contact.generalPhone}</span>
            </a>

            <a
              href={`tel:${INSTITUTION.contact.phone2.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-xs text-white/90 px-3 py-1"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#F5B51B]" />
              <span>Secrétariat : {INSTITUTION.contact.phone2}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
