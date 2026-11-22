import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowUpRight, PhoneCall, FileText } from 'lucide-react';
import { INSTITUTION } from '../data/institutionData';
import { Logo } from './Logo';

interface NavbarProps {
  onOpenPreRegistration: () => void;
  onOpenFlyer?: () => void;
  activeSection?: string;
}

const navLinks = [
  { label: 'Présentation', href: '#presentation' },
  { label: 'Formations', href: '#formations' },
  { label: 'Emploi', href: '#employabilite' },
  { label: 'Tenue', href: '#tenue-reglementaire' },
  { label: 'Scolarité', href: '#scolarite' },
  { label: 'Contact', href: '#contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onOpenPreRegistration, onOpenFlyer }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[#08783F] text-white transition-all duration-300 no-print ${
        isScrolled ? 'bg-[#08783F]/95 backdrop-blur-md shadow-lg py-2' : 'py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <a href="#" className="flex items-center shrink-0 focus:outline-none" aria-label="Accueil ISTAG">
            <Logo size="md" showText={true} lightText={true} compact={true} />
          </a>

          {/* Desktop links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm text-white/85">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="hover:text-[#F5B51B] transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            {onOpenFlyer && (
              <button
                onClick={onOpenFlyer}
                className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-sm text-white/85 hover:text-[#F5B51B] transition-colors cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Flyer</span>
              </button>
            )}

            <button
              onClick={onOpenPreRegistration}
              className="px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-[#1F2933] bg-[#F5B51B] hover:bg-[#FFC83D] active:bg-[#e0a210] rounded-sm transition-colors flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
            >
              <span>Pré-inscription</span>
              <ArrowUpRight className="w-4 h-4 hidden sm:block" />
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-white/90 hover:text-white rounded-md focus:outline-none"
              aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu de navigation'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / tablet drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#056331] mt-2 px-4 pt-3 pb-5 space-y-3 shadow-xl">
          <div className="flex flex-col">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className="block px-3 py-2 text-sm text-white/90 hover:text-[#F5B51B] hover:bg-white/5 rounded-md"
              >
                {link.label}
              </a>
            ))}
            {onOpenFlyer && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenFlyer();
                }}
                className="sm:hidden flex items-center gap-2 px-3 py-2 text-sm text-white/90 hover:text-[#F5B51B] hover:bg-white/5 rounded-md text-left"
              >
                <FileText className="w-4 h-4 text-[#F5B51B]" />
                <span>Flyer de la rentrée</span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-1.5 text-xs text-white/85">
            <a href={`tel:${INSTITUTION.contact.generalPhone.replace(/\s+/g, '')}`} className="flex items-center gap-2 px-3 py-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#F5B51B]" />
              <span>Infoline Gagnoa : {INSTITUTION.contact.generalPhone}</span>
            </a>
            <a href={`tel:${INSTITUTION.contact.phone2.replace(/\s+/g, '')}`} className="flex items-center gap-2 px-3 py-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#F5B51B]" />
              <span>Secrétariat : {INSTITUTION.contact.phone2}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
