import React from 'react';
import { Sparkles, MapPin, ArrowRight, FileText, Phone, MessageCircle } from 'lucide-react';

interface FlyerAnnouncementBannerProps {
  onOpenFlyerModal: () => void;
  onOpenPreRegistration: () => void;
}

export const FlyerAnnouncementBanner: React.FC<FlyerAnnouncementBannerProps> = ({
  onOpenFlyerModal,
  onOpenPreRegistration
}) => {
  return (
    <div className="bg-gradient-to-r from-[#056331] via-[#08783F] to-[#056331] text-white border-y border-[#F5B51B]/40 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
          {/* Left badge & Text */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-2.5 sm:gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F5B51B] text-[#056331] text-[11px] font-black uppercase tracking-wider shrink-0 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Nouveau à Gagnoa
            </span>
            <div className="space-y-0.5">
              <p className="text-xs sm:text-sm font-semibold tracking-tight text-white">
                Ouverture du Campus ISTAG Gagnoa (Garahio — Ex-Collège Les Alliances) & Rentrée Académique !
              </p>
              <p className="text-[11px] sm:text-xs text-emerald-100 flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#F5B51B] shrink-0" />
                ISTAG : INNOVATION — EXCELLENCE — OPPORTUNITÉ · Enseignement Technique (35 000 F), 12 BTS d'État, Licences & Masters
              </p>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 shrink-0 w-full sm:w-auto">
            <button
              onClick={onOpenFlyerModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-semibold backdrop-blur-sm transition-all cursor-pointer w-full sm:w-auto justify-center"
            >
              <FileText className="w-3.5 h-3.5 text-[#F5B51B]" />
              Consulter le Dépliant / Flyer
            </button>

            <a
              href="https://wa.me/2250707486050?text=Bonjour%20ISTAG,%20je%20souhaite%20m'inscrire%20au%20campus%20de%20Gagnoa"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-bold transition-all cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Gagnoa</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>

            <button
              onClick={onOpenPreRegistration}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-sm bg-[#F5B51B] hover:bg-[#e0a210] text-[#056331] text-xs font-bold transition-all shadow-sm cursor-pointer w-full sm:w-auto justify-center"
            >
              Pré-inscription
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
