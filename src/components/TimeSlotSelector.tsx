// components/TimeSlotSelector.tsx
import { useState } from 'react';
import type { TimeSlot } from '@/types';

interface TimeSlotSelectorProps {
  onSelect: (slot: string) => void;
  selected?: string;
}

export function TimeSlotSelector({ onSelect, selected }: TimeSlotSelectorProps) {
  // Gera faixas de 20 minutos das 11h às 14h (ajuste conforme necessidade)
    const generateSlots = () => {
        const slots: TimeSlot[] = [];
        for (let hour = 11; hour < 14; hour++) {
        for (let min of [0, 20, 40]) {
        const start = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
        const endMin = min + 20;
        const endHour = endMin >= 60 ? hour + 1 : hour;
        const end = `${endHour.toString().padStart(2, '0')}:${(endMin % 60).toString().padStart(2, '0')}`;
        const label = `${start} às ${end}`; // ✅ Adiciona o label
      
      slots.push({ 
        start, 
        end, 
        label, // ✅ Inclui a propriedade obrigatória
        available: true 
      });
    }
  }
  return slots;
};

  const [slots] = useState(generateSlots());

  return (
    <div className="space-y-3">
      <label className="text-sm text-[#A7ACB8] block">
        Escolha o horário de entrega/retirada:
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.map((slot) => (
          <button
            key={`${slot.start}-${slot.end}`}
            type="button"
            onClick={() => onSelect(`${slot.start} às ${slot.end}`)}
            disabled={!slot.available}
            className={`p-3 rounded-lg border text-sm font-mono transition-all
              ${selected === `${slot.start} às ${slot.end}`
                ? 'bg-[#7B2CFF] border-[#7B2CFF] text-white'
                : 'bg-[#0B0B10] border-[#2A2A35] text-[#A7ACB8] hover:border-[#7B2CFF]/50'
              }
              ${!slot.available ? 'opacity-40 cursor-not-allowed' : ''}
            `}
          >
            {slot.start}-{slot.end}
          </button>
        ))}
      </div>
    </div>
  );
}
