// src/components/ChefProfile.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, MapPin, Clock, Award } from 'lucide-react';

interface ChefProfileProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChefProfile({ open, onOpenChange }: ChefProfileProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#141419] border border-[rgba(123,44,255,0.22)] max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#F4F6FA] text-xl flex items-center justify-between">
            Sobre a Cozinheira
            <button 
              onClick={() => onOpenChange(false)} 
              className="text-[#A7ACB8] hover:text-[#F4F6FA] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Foto da Cozinheira */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#7B2CFF] shadow-2xl">
                <img 
                  src="/chef-photo.jpeg"  // ← Coloque a foto em public/chef.jpg
                  alt="Patricia, cozinheira do La Bella Gratia" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#7B2CFF] rounded-full p-2">
                <Award className="w-5 h-5 text-[#0B0B10]" />
              </div>
            </div>
          </div>

          {/* Nome e Título */}
          <div className="text-center">
            <h3 className="text-2xl font-bold text-[#F4F6FA]">Patricia Fernandes</h3>
            <p className="text-[#7B2CFF] font-medium">Cozinheira</p>
          </div>

          {/* Mini Currículo */}
          <div className="space-y-4">
            <div className="bg-[#0B0B10] rounded-xl p-4 space-y-3">
              <p className="text-[#A7ACB8] leading-relaxed text-sm">
                Cozinhando desde a infância, e com longa experiência gastronômica: rotisserie, buffet, alla-carte e eventos variados.
                Patricia transforma ingredientes simples em experiências memoráveis. 
                Especialista em comida caseira brasileira com toque contemporâneo.
              </p>
            </div>

            {/* Experiências */}
            <div className="space-y-2">
              <h4 className="text-[#A7ACB8] text-xs font-bold uppercase tracking-wider">Experiência</h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm text-[#F4F6FA]">
                  <Award className="w-4 h-4 text-[#7B2CFF] mt-0.5 flex-shrink-0" />
                  <span>Cozinha familiar tradicional •  cozinha contemporânea</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#F4F6FA]">
                  <Award className="w-4 h-4 text-[#7B2CFF] mt-0.5 flex-shrink-0" />
                  <span>Especialidades pratos de panela, assados e gratinados</span>
                </li>
                <li className="flex items-start gap-2 text-sm text-[#F4F6FA]">
                  <Award className="w-4 h-4 text-[#7B2CFF] mt-0.5 flex-shrink-0" />
                  <span>Foco em ingredientes frescos e preparo artesanal</span>
                </li>
              </ul>
            </div>

            {/* Informações */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0B0B10] rounded-lg p-3 text-center">
                <MapPin className="w-5 h-5 text-[#7B2CFF] mx-auto mb-1" />
                <p className="text-[#A7ACB8] text-xs">Local</p>
                <p className="text-[#F4F6FA] text-sm font-medium">Osasco, SP</p>
              </div>
              <div className="bg-[#0B0B10] rounded-lg p-3 text-center">
                <Clock className="w-5 h-5 text-[#7B2CFF] mx-auto mb-1" />
                <p className="text-[#A7ACB8] text-xs">Entrega</p>
                <p className="text-[#F4F6FA] text-sm font-medium">Sábados</p>
              </div>
            </div>
          </div>

          {/* Botão WhatsApp */}
          <Button 
            onClick={() => {
              window.open('https://wa.me/5511945925632?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20seus%20pratos.', '_blank');
              onOpenChange(false);
            }}
            className="w-full btn-primary"
          >
            Falar com Patricia no WhatsApp 💬
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
