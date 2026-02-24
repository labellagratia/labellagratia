import { useState } from 'react';
import { Copy, Check, QrCode, Banknote } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { CartItem } from '@/types';

interface CheckoutFormProps {
  cartItems: CartItem[];
  total: number;
  onSubmit: (data: {
    name: string;
    phone: string;
    paymentMethod: 'pix' | 'cash';
  }) => void;
  onCancel: () => void;
}

export function CheckoutForm({ cartItems, total, onSubmit, onCancel }: CheckoutFormProps) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'cash'>('pix');
  const [pixCopied, setPixCopied] = useState(false);
  const [step, setStep] = useState<'form' | 'payment'>('form');

  const pixKey = 'labellagrattia@email.com'; // Example PIX key

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'pix') {
      setStep('payment');
    } else {
      onSubmit({ name, phone, paymentMethod });
    }
  };

  const copyPixKey = () => {
    navigator.clipboard.writeText(pixKey);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 2000);
  };

  const handlePaymentComplete = () => {
    onSubmit({ name, phone, paymentMethod });
  };

  if (step === 'payment' && paymentMethod === 'pix') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="w-48 h-48 mx-auto bg-white rounded-xl p-4 mb-4">
            <div className="w-full h-full bg-[#0B0B10] rounded-lg flex items-center justify-center">
              <QrCode className="w-32 h-32 text-[#F4F6FA]" />
            </div>
          </div>
          <p className="text-[#A7ACB8] text-sm mb-2">
            Escaneie o QR Code ou copie a chave PIX
          </p>
        </div>

        <div className="p-4 bg-[#0B0B10] rounded-xl border border-[rgba(244,246,250,0.1)]">
          <div className="flex items-center justify-between gap-4">
            <code className="text-[#F4F6FA] text-sm break-all">{pixKey}</code>
            <button
              onClick={copyPixKey}
              className="flex-shrink-0 p-2 text-[#7B2CFF] hover:bg-[rgba(123,44,255,0.1)] rounded-lg transition-colors"
            >
              {pixCopied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="p-4 bg-[rgba(123,44,255,0.1)] rounded-xl">
          <div className="flex justify-between items-center">
            <span className="text-[#A7ACB8]">Valor total:</span>
            <span className="text-[#7B2CFF] font-bold text-xl">
              R$ {total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <button onClick={handlePaymentComplete} className="w-full btn-primary">
            Já realizei o pagamento
          </button>
          <button onClick={() => setStep('form')} className="w-full btn-secondary">
            Voltar
          </button>
        </div>

        <p className="text-xs text-[#A7ACB8] text-center">
          Após confirmar o pagamento, enviaremos os detalhes da retirada via WhatsApp.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="p-4 bg-[#0B0B10] rounded-xl border border-[rgba(244,246,250,0.08)]">
        <h4 className="text-[#F4F6FA] font-semibold mb-3">Resumo do pedido</h4>
        <div className="space-y-2 mb-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-[#A7ACB8]">
                {item.quantity}x {item.name}
              </span>
              <span className="text-[#F4F6FA]">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-3 border-t border-[rgba(244,246,250,0.1)] flex justify-between">
          <span className="text-[#A7ACB8]">Total</span>
          <span className="text-[#7B2CFF] font-bold text-lg">
            R$ {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-[#A7ACB8] mb-2 block">
            Nome completo
          </Label>
          <Input
            id="name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Seu nome"
            required
            className="bg-[#0B0B10] border-[rgba(244,246,250,0.15)] text-[#F4F6FA] placeholder:text-[#A7ACB8]/50 focus:border-[#7B2CFF] focus:ring-[#7B2CFF]"
          />
        </div>
        <div>
          <Label htmlFor="phone" className="text-[#A7ACB8] mb-2 block">
            WhatsApp
          </Label>
          <Input
            id="phone"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            required
            className="bg-[#0B0B10] border-[rgba(244,246,250,0.15)] text-[#F4F6FA] placeholder:text-[#A7ACB8]/50 focus:border-[#7B2CFF] focus:ring-[#7B2CFF]"
          />
        </div>
      </div>

      {/* Payment Method */}
      <div>
        <Label className="text-[#A7ACB8] mb-3 block">Forma de pagamento</Label>
        <RadioGroup
          value={paymentMethod}
          onValueChange={v => setPaymentMethod(v as 'pix' | 'cash')}
          className="grid grid-cols-2 gap-3"
        >
          <div>
            <RadioGroupItem value="pix" id="pix" className="peer sr-only" />
            <Label
              htmlFor="pix"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[rgba(244,246,250,0.15)] bg-[#0B0B10] cursor-pointer peer-data-[state=checked]:border-[#7B2CFF] peer-data-[state=checked]:bg-[rgba(123,44,255,0.1)] transition-all"
            >
              <QrCode className="w-6 h-6 text-[#7B2CFF]" />
              <span className="text-[#F4F6FA] text-sm">PIX</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="cash" id="cash" className="peer sr-only" />
            <Label
              htmlFor="cash"
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-[rgba(244,246,250,0.15)] bg-[#0B0B10] cursor-pointer peer-data-[state=checked]:border-[#7B2CFF] peer-data-[state=checked]:bg-[rgba(123,44,255,0.1)] transition-all"
            >
              <Banknote className="w-6 h-6 text-[#7B2CFF]" />
              <span className="text-[#F4F6FA] text-sm">Dinheiro</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <button type="submit" className="w-full btn-primary">
          {paymentMethod === 'pix' ? 'Continuar para pagamento' : 'Confirmar reserva'}
        </button>
        <button type="button" onClick={onCancel} className="w-full btn-secondary">
          Cancelar
        </button>
      </div>

      <p className="text-xs text-[#A7ACB8] text-center">
        Entrega não inclusa — retirada no bairro informado via WhatsApp
      </p>
    </form>
  );
}
