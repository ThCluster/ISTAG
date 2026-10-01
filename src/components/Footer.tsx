import React from 'react';
import { INSTITUTION } from '../data/institutionData';
import { MapPin, Phone, Mail, ArrowUp, Trees, Building2 } from 'lucide-react';
import { Logo } from './Logo';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#056331] text-white/80 text-xs border-t border-[#08783F] no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-12">
          {/* Col 1: Identity & Legal status */}
          <div className="lg:col-span-4 space-y-4">
            <Logo size="lg" showText={true} lightText={true} />
            <p className="text-white/80 leading-relaxed max-w-sm">
              Institut Supérieur des Technologies Avancées (ISTAG). Établissement d'enseignement supérieur technique et professionnel habilité par le Ministère de l'Enseignement Supérieur et de la Recherche Scientifique (MESRS) de Côte d'Ivoire.
            </p>
            <div className="pt-2 text-[11px] text-white/70 space-y-1">
              <p>Forme juridique : Société à Responsabilité Limitée (SARL)</p>
              <p>Constitution formelle : Août 2018 (Initié en 2017)</p>
              <p>Implantation : Gagnoa (Quartier Garahio — Ex-Collège Les Alliances)</p>
            </div>
          </div>

          {/* Col 2: Formations */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-[#F5B51B] uppercase tracking-wider text-xs">
              Spécialités BTS d'État
            </h4>
            <ul className="space-y-2 text-white/85">
              <li>
                <a href="#formations" className="hover:text-[#F5B51B] transition-colors">
                  BTS Mines, Géologie & Pétrole (MGP)
                </a>
              </li>
              <li>
                <a href="#formations" className="hover:text-[#F5B51B] transition-colors">
                  BTS Agriculture Tropicale (ATPV / ATPA)
                </a>
              </li>
              <li>
                <a href="#formations" className="hover:text-[#F5B51B] transition-colors">
                  BTS Développeur Informatique (IDA) & Réseaux (RIT)
                </a>
              </li>
              <li>
                <a href="#formations" className="hover:text-[#F5B51B] transition-colors">
                  BTS Gestion Commerciale & Logistique (LT)
                </a>
              </li>
              <li>
                <a href="#formations" className="hover:text-[#F5B51B] transition-colors">
                  BTS Finances-Comptabilité (FCGE) & AD
                </a>
              </li>
              <li>
                <a href="#formations" className="hover:text-[#F5B51B] transition-colors">
                  Formations Métiers & Certifications
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Campus Gagnoa */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif font-bold text-[#F5B51B] uppercase tracking-wider text-xs">
              Notre Campus
            </h4>
            <div className="space-y-3">
              <div className="p-3 bg-white/10 rounded border border-white/15">
                <strong className="text-white block text-xs">Campus ISTAG — Gagnoa Garahio</strong>
                <p className="text-[11px] text-white/75 mt-0.5">Quartier Garahio — Enceinte Ex-Collège Les Alliances</p>
                <p className="text-[11px] text-[#F5B51B] mt-1 font-semibold">Tél : {INSTITUTION.contact.generalPhone}</p>
                <p className="text-[11px] text-[#F5B51B] font-semibold">Secrétariat : {INSTITUTION.contact.phone2}</p>
                <p className="text-[11px] text-[#25D366] mt-1">WhatsApp : {INSTITUTION.contact.whatsapp}</p>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Nav & Back to Top */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif font-bold text-[#F5B51B] uppercase tracking-wider text-xs">
              Navigation
            </h4>
            <ul className="space-y-2 text-white/85">
              <li>
                <a href="#presentation" className="hover:text-[#F5B51B] transition-colors">
                  Présentation
                </a>
              </li>
              <li>
                <a href="#formations" className="hover:text-[#F5B51B] transition-colors">
                  Filières BTS
                </a>
              </li>
              <li>
                <a href="#employabilite" className="hover:text-[#F5B51B] transition-colors">
                  Insertion & Emploi
                </a>
              </li>
              <li>
                <a href="#tenue-reglementaire" className="hover:text-[#F5B51B] transition-colors">
                  Tenue Réglementaire
                </a>
              </li>
              <li>
                <a href="#scolarite" className="hover:text-[#F5B51B] transition-colors">
                  Frais & Bourses
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-[#F5B51B] transition-colors">
                  Contacts & Accès
                </a>
              </li>
            </ul>

            <div className="pt-4">
              <button
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-sm text-xs transition-colors cursor-pointer"
              >
                <span>Haut de page</span>
                <ArrowUp className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-white/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-white/70">
          <p>
            © {new Date().getFullYear()} ISTAG — Institut Supérieur des Technologies Avancées. Tous droits réservés.
          </p>
          <p className="flex items-center gap-3">
            <span>Agrément MESRS</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span>Gagnoa Garahio (Ex-Collège Les Alliances)</span>
            <span aria-hidden="true" className="text-white/40">·</span>
            <span>Côte d'Ivoire</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
