import React from 'react';
import { CAMPUSES, CampusInfo } from '../data/institutionData';
import { MapPin, Phone, Mail, Navigation, Check, Trees, MessageCircle, Pickaxe, Sprout, Laptop, GraduationCap } from 'lucide-react';

export const CampusesSection: React.FC = () => {
  const campus: CampusInfo = CAMPUSES[0];

  return (
    <section id="campus" className="py-16 sm:py-20 bg-[#F8FAF9] text-[#1F2933]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <div className="text-xs uppercase tracking-widest text-[#08783F] font-bold mb-3">
            03. Notre Campus à Gagnoa
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1F2933] tracking-tight mb-4">
            Un campus d'exception au cœur de Gagnoa pour réussir vos études supérieures.
          </h2>
          <p className="text-[#667085] text-xs sm:text-sm md:text-base leading-relaxed">
            Implanté à Gagnoa dans le dynamique quartier Garahio, au sein des locaux réputés et spacieux de l'Ex-Collège Les Alliances, l'ISTAG offre un environnement d'études studieux, sécurisé et doté d'infrastructures de premier ordre pour l'Agro-business, les Mines, les Technologies et la Gestion.
          </p>
        </div>

        {/* Selected Campus Detail Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start bg-white border border-stone-200 rounded-sm p-5 sm:p-8 lg:p-10 shadow-sm mb-12">
          {/* Image & Quick Access */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-sm overflow-hidden h-64 sm:h-80 md:h-96 shadow-md border border-stone-200">
              <img
                src={campus.image}
                alt={campus.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-[#08783F]/90 backdrop-blur-sm text-white px-3 py-1.5 text-xs font-medium rounded-sm border border-white/20 flex items-center gap-1.5">
                <Trees className="w-3.5 h-3.5 text-[#F5B51B]" />
                <span>Gagnoa — Quartier Garahio</span>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-stone-900/80 backdrop-blur-sm text-white p-3 rounded-sm text-xs border border-white/10">
                <span className="font-bold text-[#F5B51B] block">Ex-Collège Les Alliances</span>
                <span className="text-white/80 text-[11px]">Site universitaire de référence dans la région du Gôh</span>
              </div>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-sm text-xs space-y-2">
              <div className="flex items-start gap-2 text-[#1F2933]">
                <Navigation className="w-4 h-4 text-[#08783F] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1F2933] block">Accès & Desserte :</strong>
                  <span className="text-[#667085]">{campus.accessGuide}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Text Description & Assets */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#08783F] font-bold block mb-1">
                {campus.type}
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#1F2933] mb-3">
                {campus.name}
              </h3>
              <p className="text-[#667085] text-xs sm:text-sm leading-relaxed mb-4">
                {campus.description}
              </p>

              <div className="flex items-center gap-2 text-xs text-[#667085] py-2 border-y border-stone-100">
                <MapPin className="w-4 h-4 text-[#08783F] shrink-0" />
                <span>{campus.address}</span>
              </div>
            </div>

            {/* Key Assets List */}
            <div>
              <h4 className="text-xs uppercase tracking-wider text-[#1F2933] font-bold mb-3">
                Équipements & Infrastructures du Campus
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {campus.keyAssets.map((asset, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#1F2933]">
                    <Check className="w-3.5 h-3.5 text-[#08783F] shrink-0 mt-0.5" />
                    <span>{asset}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Contact for this Campus */}
            <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center gap-3 text-xs">
              <a
                href="tel:+2250707486050"
                className="flex items-center gap-2 text-[#08783F] hover:text-[#056331] font-semibold bg-stone-50 px-3.5 py-2 rounded-sm border border-stone-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#08783F]" />
                <span className="tabular-nums">+225 07 07 48 60 50</span>
              </a>

              <a
                href="tel:+2250142891884"
                className="flex items-center gap-2 text-[#08783F] hover:text-[#056331] font-semibold bg-stone-50 px-3.5 py-2 rounded-sm border border-stone-200 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#08783F]" />
                <span className="tabular-nums">+225 01 42 89 18 84</span>
              </a>

              <a
                href="https://wa.me/2250707486050?text=Bonjour%20ISTAG%20Gagnoa,%20je%20souhaite%20des%20informations%20sur%20les%20inscriptions"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-800 hover:text-emerald-900 font-semibold bg-emerald-50 px-3.5 py-2 rounded-sm border border-emerald-300 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp direct</span>
              </a>
            </div>
          </div>
        </div>

        {/* 3 Academic Pillars in Gagnoa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          <div className="p-5 sm:p-6 bg-white border border-stone-200 rounded-sm">
            <div className="flex items-center gap-2 text-[#08783F] font-bold text-xs uppercase tracking-wider mb-2">
              <Pickaxe className="w-4 h-4 text-[#F5B51B]" />
              Pôle Mines & Géologie
            </div>
            <h4 className="font-serif font-bold text-[#1F2933] text-base mb-2">
              Mines, Géologie et Pétrole (MGP)
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Formation de référence pour devenir technicien supérieur prospecteur, géologue de chantier et superviseur sur les grands projets miniers et carrières de Côte d'Ivoire.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-stone-200 rounded-sm">
            <div className="flex items-center gap-2 text-[#08783F] font-bold text-xs uppercase tracking-wider mb-2">
              <Sprout className="w-4 h-4 text-[#F5B51B]" />
              Pôle Agriculture Tropicale
            </div>
            <h4 className="font-serif font-bold text-[#1F2933] text-base mb-2">
              Production Végétale & Animale
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              ATPV & ATPA en prise directe avec les réalités du bassin agricole de la région du Gôh : gestion d'exploitations, cultures de rente et élevage moderne.
            </p>
          </div>

          <div className="p-5 sm:p-6 bg-white border border-stone-200 rounded-sm">
            <div className="flex items-center gap-2 text-[#08783F] font-bold text-xs uppercase tracking-wider mb-2">
              <Laptop className="w-4 h-4 text-[#F5B51B]" />
              Pôle Technologies & Gestion
            </div>
            <h4 className="font-serif font-bold text-[#1F2933] text-base mb-2">
              Informatique, Réseaux & Tertiaire
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Filières IDA, RIT, Gestion Commerciale, Finances-Comptabilité, Assistanat et Logistique avec des laboratoires équipés pour une pratique opérationnelle immédiate.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
