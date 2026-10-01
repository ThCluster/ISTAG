import React, { useState, useRef } from 'react';
import { Shirt, ShieldCheck, Sparkles, Users, Award, Upload, Image as ImageIcon, RotateCcw } from 'lucide-react';

export const TenueReglementaireSection: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoSrc, setPhotoSrc] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('istag_tenue_originale_photo');
      if (saved) return saved;
    }
    return '/image.png';
  });

  const [hasCustomPhoto, setHasCustomPhoto] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('istag_tenue_originale_photo');
    }
    return false;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotoSrc(dataUrl);
        setHasCustomPhoto(true);
        localStorage.setItem('istag_tenue_originale_photo', dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    localStorage.removeItem('istag_tenue_originale_photo');
    setPhotoSrc('/image.png');
    setHasCustomPhoto(false);
  };

  return (
    <section id="tenue-reglementaire" className="py-16 sm:py-20 bg-white text-[#1F2933] border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div className="max-w-3xl">
            <div className="text-xs uppercase tracking-widest text-[#08783F] font-bold mb-3 flex items-center gap-2">
              <Shirt className="w-4 h-4 text-[#F5B51B]" />
              <span>04. Vie Étudiante & Discipline</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#1F2933] tracking-tight mb-4">
              La Tenue Réglementaire
            </h2>
            <p className="text-[#667085] text-xs sm:text-sm md:text-base leading-relaxed">
              À l'<strong>Institut Supérieur des Technologies Avancées (ISTAG)</strong>, le port de la tenue réglementaire reflète la rigueur académique, l'égalité entre tous les étudiants et la préparation aux exigences du monde professionnel.
            </p>
          </div>

          {/* Quick upload button for original photo */}
          <div className="flex items-center gap-2 shrink-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 bg-[#08783F] hover:bg-[#056331] text-white text-xs font-semibold rounded-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-[#F5B51B]" />
              <span>Charger votre photo originale (image.png)</span>
            </button>
            {hasCustomPhoto && (
              <button
                onClick={handleReset}
                title="Réinitialiser"
                className="p-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs rounded-sm transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Display Container for the Original Unretouched Photo */}
        <div className="bg-[#F8FAF9] border border-stone-200 rounded-lg p-3 sm:p-5 shadow-sm mb-10">
          <div className="relative overflow-hidden rounded-md bg-stone-100 min-h-[300px] flex items-center justify-center">
            <img
              src={photoSrc}
              alt="Photo originale - Tenue réglementaire des étudiants de l'ISTAG Gagnoa"
              className="w-full h-auto object-contain block mx-auto rounded shadow-sm"
              onError={(e) => {
                // Fallback gracefully if direct /image.png hasn't been uploaded yet
                if (!hasCustomPhoto) {
                  e.currentTarget.src = '/src/assets/images/istag_tenue_reglementaire.png';
                }
              }}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 px-1 text-xs text-stone-600">
            <span className="font-semibold text-[#08783F] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#08783F]" />
              {hasCustomPhoto ? "Photo originale chargée avec succès sans aucune retouche" : "Tenue réglementaire officielle — Promotion ISTAG Gagnoa"}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-[#08783F] hover:underline font-medium cursor-pointer flex items-center gap-1"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>{hasCustomPhoto ? "Changer la photo" : "Insérer votre fichier image.png original"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Specification Cards on Uniform */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 bg-[#F8FAF9] border border-stone-200 rounded-sm space-y-2.5">
            <div className="w-9 h-9 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center">
              <Shirt className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F2933]">
              Le Haut Officiel
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Polo blanc piqué en coton avec col polo et finitions de manches vert émeraude, estampillé de l'écusson officiel brodé de l'ISTAG sur la poitrine.
            </p>
          </div>

          <div className="p-5 bg-[#F8FAF9] border border-stone-200 rounded-sm space-y-2.5">
            <div className="w-9 h-9 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F2933]">
              Le Bas Réglementaire
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Pantalon de ville droit et sobre (kaki, vert forêt, beige ou bleu marine foncé), propre et ajusté, porté avec une ceinture discrète.
            </p>
          </div>

          <div className="p-5 bg-[#F8FAF9] border border-stone-200 rounded-sm space-y-2.5">
            <div className="w-9 h-9 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F2933]">
              Chaussures & Présentation
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              Chaussures fermées de ville (noires ou marron) ou baskets sobres propres. Une présentation soignée est exigée en permanence.
            </p>
          </div>

          <div className="p-5 bg-[#F8FAF9] border border-stone-200 rounded-sm space-y-2.5">
            <div className="w-9 h-9 rounded-sm bg-[#08783F] text-[#F5B51B] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#1F2933]">
              Inclusion & Esprit de Corps
            </h4>
            <p className="text-xs text-[#667085] leading-relaxed">
              La tenue gomme les disparités sociales et renforce la cohésion de groupe, la dignité et la fierté d'appartenir à la famille ISTAG.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
