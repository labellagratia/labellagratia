import { useState } from 'react';

const generateTimeSlots = () => {
  const slots: string[] = [];
  let hour = 11;
  let minute = 0;

  while (hour < 15 || (hour === 15 && minute === 0)) {
    slots.push(
      `${hour.toString().padStart(2, '0')}:${minute
        .toString()
        .padStart(2, '0')}`
    );

    minute += 20;
    if (minute >= 60) {
      minute = 0;
      hour++;
    }
  }

  return slots;
};

export default function Checkout() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [time, setTime] = useState('');

  const timeSlots = generateTimeSlots();

  const handleSubmit = () => {
    if (!name || !phone || !address || !time) {
      alert('Preencha todos os campos.');
      return;
    }

    localStorage.setItem(
      'clienteLaBella',
      JSON.stringify({ name, phone, address })
    );

    localStorage.setItem('horarioEscolhido', time);

    window.location.href = '/review';
  };

  return (
    <div className="min-h-screen bg-[#0B0B10] text-white p-8">
      <div className="max-w-xl mx-auto space-y-6">

        <h1 className="text-3xl font-bold">Cadastro</h1>

        <input
          type="text"
          placeholder="Nome completo"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 bg-[#141419] rounded"
        />

        <input
          type="tel"
          placeholder="Telefone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-3 bg-[#141419] rounded"
        />

        <textarea
          placeholder="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full p-3 bg-[#141419] rounded"
        />

        <div>
          <p className="mb-2">Horário de entrega</p>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                className={`p-2 rounded ${
                  time === slot
                    ? 'bg-[#7B2CFF]'
                    : 'bg-[#141419]'
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-[#7B2CFF] py-3 rounded font-semibold"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}