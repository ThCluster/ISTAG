import React, { useState } from 'react';
import { FAQ_ITEMS, INSTITUTION } from '../data/institutionData';
import { ChevronDown, Phone, Mail, MapPin, Send, CheckCircle2, Clock, MessageCircle, Trees } from 'lucide-react';

export const ContactAndFaqSection: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    filiere: 'BTS Mines, Géologie et Pétrole (MGP)',
    message: '',
  });

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
      return;
    }
    setFormSent(true);
  };

  return (
    <section id="contact" className="py-16 sm:py-20 bg-[#F8FAF9] text-[#1F2933] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12 sm:mb-16">
          <div className="text-xs uppercase tracking-widest text-[#08783F] font-bold mb-3">
            07. FAQ & Contacts Officiels
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1F2933] tracking-tight mb-4">
            Tout ce que vous devez savoir pour intégrer l'ISTAG à Gagnoa.
          </h2>
          <p className="text-[#667085] text-xs sm:text-sm md:text-base leading-relaxed">
            Consultez les réponses aux questions fréquentes ou joignez directement notre secrétariat d'admission et nos conseillers au campus de Garahio (au sein de l'Ex-Collège Les Alliances).
          </p>
        </div>

        {/* 2-Column Split: FAQ Accordion & Direct Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* FAQ Accordion */}
          <div className="lg:col-span-7 space-y-4">
            <h3 className="text-lg font-serif font-bold text-[#1F2933] mb-4">
              Questions Fréquemment Posées
            </h3>

            <div className="space-y-3">
              {FAQ_ITEMS.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-stone-200 rounded-sm overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-xs sm:text-sm text-[#1F2933] hover:text-[#08783F] cursor-pointer"
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-[#08783F] shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-1 text-xs text-[#667085] leading-relaxed border-t border-stone-100 bg-stone-50/50">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Contact Form & Office Direct Lines */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-stone-200 p-6 sm:p-8 rounded-sm shadow-sm relative">
              <div className="absolute top-0 left-0 right-0 h-1 bg-[#08783F]" />
              <h3 className="text-lg font-serif font-bold text-[#1F2933] mb-2">
                Demander un Renseignement
              </h3>
              <p className="text-xs text-[#667085] mb-6">
                Remplissez ce formulaire pour être contacté sous 24h par notre équipe des admissions.
              </p>

              {formSent ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm text-center space-y-2 text-xs">
                  <CheckCircle2 className="w-8 h-8 text-[#08783F] mx-auto" />
                  <span className="font-bold text-[#056331] block">
                    Message transmis à la scolarité de Gagnoa !
                  </span>
                  <p className="text-stone-600">
                    Un conseiller pédagogique va vous joindre au {formData.phone} pour vous orienter.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#1F2933] mb-1">
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Votre nom et prénom"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-[#1F2933] mb-1">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+225 ..."
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F]"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-[#1F2933] mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="nom@email.ci"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1F2933] mb-1">
                      Filière souhaitée
                    </label>
                    <select
                      value={formData.filiere}
                      onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F]"
                    >
                      <optgroup label="BTS : Nos Filières">
                        <option value="BTS Finance comptabilité (FCGE)">BTS Finance comptabilité (FCGE)</option>
                        <option value="BTS Gestion Commerciale">BTS Gestion Commerciale</option>
                        <option value="BTS Ressources Humaines et Communications">BTS Ressources Humaines et Communications</option>
                        <option value="BTS Assistanat de Direction">BTS Assistanat de Direction</option>
                        <option value="BTS Logistique">BTS Logistique</option>
                        <option value="BTS Informatique Développeur d'Application">BTS Informatique Développeur d'Application</option>
                        <option value="BTS Réseaux Informatiques et Télécommunications">BTS Réseaux Informatiques et Télécommunications</option>
                        <option value="BTS Systèmes Électroniques et Informatiques">BTS Systèmes Électroniques et Informatiques</option>
                        <option value="BTS Agriculture Tropicale (Option Animale)">BTS Agriculture Tropicale (Option Animale)</option>
                        <option value="BTS Agriculture Tropicale (Option Végétale)">BTS Agriculture Tropicale (Option Végétale)</option>
                        <option value="BTS Génie Civil (Option Bâtiment)">BTS Génie Civil (Option Bâtiment)</option>
                        <option value="BTS Touristique et Hôtellerie">BTS Touristique et Hôtellerie</option>
                        <option value="BTS Mines, Géologie et Pétrole (MGP)">BTS Mines, Géologie et Pétrole (MGP)</option>
                      </optgroup>
                      <optgroup label="Enseignement Technique & Pro (35 000 F)">
                        <option value="BAC G1 (Secrétariat)">BAC G1 (Secrétariat)</option>
                        <option value="BAC G2 (Comptabilité)">BAC G2 (Comptabilité)</option>
                        <option value="BAC F2 (Électronique)">BAC F2 (Électronique)</option>
                        <option value="BEP Comptabilité">BEP Comptabilité</option>
                        <option value="BT Sciences Médico-Sociales">BT Sciences Médico-Sociales</option>
                      </optgroup>
                      <optgroup label="Licence & Master">
                        <option value="Licence Professionnelle (450 000 F/an)">Licence Professionnelle (450 000 F/an)</option>
                        <option value="Master Professionnel (800 000 F/an)">Master Professionnel (800 000 F/an)</option>
                      </optgroup>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#1F2933] mb-1">
                      Message
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Précisez votre demande ou besoin d'orientation..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-sm focus:outline-none focus:border-[#08783F] focus:ring-1 focus:ring-[#08783F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#08783F] hover:bg-[#056331] text-white font-bold rounded-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Send className="w-3.5 h-3.5 text-[#F5B51B]" />
                    <span>Envoyer mon message</span>
                  </button>
                </form>
              )}
            </div>

            {/* Direct Lines Box Campus Gagnoa */}
            <div className="p-6 bg-white border border-stone-200 rounded-sm space-y-4 text-xs">
              <div className="flex items-center gap-2 font-bold text-[#1F2933] font-serif text-sm">
                <Clock className="w-4 h-4 text-[#08783F]" />
                <span>Contacts Directs — Campus de Gagnoa</span>
              </div>

              <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#056331] flex items-center gap-1.5">
                    <Trees className="w-3.5 h-3.5" />
                    Quartier Garahio — Ex-Collège Alliances
                  </span>
                  <span className="text-[10px] font-bold uppercase bg-[#08783F] text-white px-2 py-0.5 rounded">
                    Ouvert
                  </span>
                </div>
                <div className="flex flex-col gap-2 text-stone-700">
                  <a href="tel:+2250707486050" className="hover:text-[#08783F] font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#08783F]" />
                    Infoline 1 : +225 07 07 48 60 50
                  </a>
                  <a href="tel:+2250142891884" className="hover:text-[#08783F] font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#08783F]" />
                    Infoline 2 : +225 01 42 89 18 84
                  </a>
                  <a href="tel:+2250564214373" className="hover:text-[#08783F] font-semibold flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#08783F]" />
                    Infoline 3 : +225 05 64 21 43 73
                  </a>
                  <a href="mailto:istag225@gmail.com" className="hover:text-[#08783F] font-semibold flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#08783F]" />
                    Email : istag225@gmail.com
                  </a>
                  <a
                    href="https://wa.me/2250707486050?text=Bonjour%20ISTAG%20Gagnoa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-[#056331] font-bold flex items-center gap-1.5 pt-1 border-t border-emerald-200/60"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                    WhatsApp direct Gagnoa : +225 07 07 48 60 50
                  </a>
                  <div className="flex items-start gap-1.5 text-stone-600 text-[11px] pt-1">
                    <MapPin className="w-3.5 h-3.5 text-[#08783F] shrink-0 mt-0.5" />
                    <span>Gagnoa, Quartier Garahio, Enceinte Ex-Collège Les Alliances</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 pt-1">
                Horaires d'accueil : {INSTITUTION.contact.workingHours}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
