import { useState } from 'react';
import { mockMenu } from '@/data/mockMenu';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';  // ✅ Removido Calendar

interface TimeSlot {
  id: string;
  label: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { id: '1', label: '18:00 - 19:00', available: true },
  { id: '2', label: '19:00 - 20:00', available: true },
  { id: '3', label: '20:00 - 21:00', available: false },
  { id: '4', label: '21:00 - 22:00', available: true },
];

export function MenuSection() {
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showSlots, setShowSlots] = useState(false);

  const handleOrder = () => {
    setShowSlots(true);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setShowSlots(false);
  };

  return (
    <section id="menu" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-4">Cardápio da Semana</h2>
        <p className="text-center text-muted-foreground mb-12">
          Pedidos de segunda a sexta. Retirada aos sábados.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockMenu.map((item) => (
            <div
              key={item.id}
              className="bg-card rounded-lg shadow-lg overflow-hidden border border-border"
            >
              {item.imagemUrl && (
                <img
                  src={item.imagemUrl}
                  alt={item.nome}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{item.nome}</h3>
                <p className="text-muted-foreground mb-4">{item.descricao}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    R$ {item.preco.toFixed(2)}
                  </span>
                  {item.disponivel ? (
                    <Button onClick={handleOrder}>Pedir</Button>
                  ) : (
                    <Button variant="outline" disabled>
                      Indisponível
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showSlots && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-card rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Escolha o Horário</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowSlots(false)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    variant={slot.available ? 'outline' : 'outline'}
                    className={`w-full justify-between ${
                      !slot.available ? 'opacity-50 cursor-not-allowed' : ''
                    } ${selectedSlot?.id === slot.id ? 'bg-primary text-primary-foreground' : ''}`}
                    onClick={() => slot.available && handleSelectSlot(slot)}
                    disabled={!slot.available}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {slot.label}
                    </span>
                    {!slot.available && <span className="text-xs">Esgotado</span>}
                  </Button>
                ))}
              </div>

              {selectedSlot && (
                <div className="mt-4 p-3 bg-muted rounded">
                  <p className="text-sm">
                    Horário selecionado: <strong>{selectedSlot.label}</strong>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}