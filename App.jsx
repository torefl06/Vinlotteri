import React, { useState } from 'react';

// Oversikt over loddsalg per uke hentet fra skjemaet
const weeklyData = {
  "Uke 45": [
    { name: "Laila Martine", tickets: 3 },
    { name: "Elisabeth T", tickets: 3 },
    { name: "Ingrid", tickets: 3 },
    { name: "Pål E", tickets: 3 },
    { name: "Tore", tickets: 2 },
    { name: "Daniel", tickets: 2 },
    { name: "Alexander", tickets: 2 },
    { name: "Hege", tickets: 2 },
    { name: "Karoline", tickets: 2 },
    { name: "Gro", tickets: 2 },
    { name: "Jannicke", tickets: 2 },
    { name: "Ingvild", tickets: 1 },
    { name: "Ebbe", tickets: 1 },
    { name: "Rene G", tickets: 2 },
    { name: "Trine", tickets: 1 },
    { name: "Charlotte", tickets: 1 },
    { name: "Frode", tickets: 1 },
    { name: "Normi", tickets: 1 },
    { name: "Kristian", tickets: 1 }
  ],
  "Uke 46": [
    { name: "Laila Martine", tickets: 3 },
    { name: "Elisabeth T", tickets: 3 },
    { name: "Ingrid", tickets: 3 },
    { name: "Pål E", tickets: 2 },
    { name: "Tore", tickets: 2 },
    { name: "Daniel", tickets: 2 },
    { name: "Alexander", tickets: 2 },
    { name: "Hege", tickets: 2 },
    { name: "Karoline", tickets: 2 },
    { name: "Gro", tickets: 1 },
    { name: "Jannicke", tickets: 2 },
    { name: "Ingvild", tickets: 1 },
    { name: "Ebbe", tickets: 1 },
    { name: "Rene G", tickets: 2 },
    { name: "Trine", tickets: 1 },
    { name: "Charlotte", tickets: 1 },
    { name: "Frode", tickets: 1 },
    { name: "Normi", tickets: 1 }
  ],
  "Uke 47": [
    { name: "Laila Martine", tickets: 3 },
    { name: "Elisabeth T", tickets: 3 },
    { name: "Ingrid", tickets: 3 },
    { name: "Pål E", tickets: 3 },
    { name: "Tore", tickets: 2 },
    { name: "Daniel", tickets: 2 },
    { name: "Alexander", tickets: 2 },
    { name: "Hege", tickets: 2 },
    { name: "Karoline", tickets: 1 },
    { name: "Gro", tickets: 1 },
    { name: "Jannicke", tickets: 2 },
    { name: "Ingvild", tickets: 1 },
    { name: "Ebbe", tickets: 1 },
    { name: "Rene G", tickets: 2 },
    { name: "Trine", tickets: 1 },
    { name: "Charlotte", tickets: 1 },
    { name: "Frode", tickets: 1 },
    { name: "Normi", tickets: 1 }
  ],
  "Uke 48": [
    { name: "Laila Martine", tickets: 3 },
    { name: "Elisabeth T", tickets: 3 },
    { name: "Ingrid", tickets: 3 },
    { name: "Pål E", tickets: 2 },
    { name: "Tore", tickets: 2 },
    { name: "Daniel", tickets: 2 },
    { name: "Alexander", tickets: 2 },
    { name: "Hege", tickets: 2 },
    { name: "Karoline", tickets: 1 },
    { name: "Jannicke", tickets: 2 },
    { name: "Ingvild", tickets: 1 },
    { name: "Ebbe", tickets: 1 },
    { name: "Rene G", tickets: 2 },
    { name: "Trine", tickets: 1 },
    { name: "Charlotte", tickets: 1 },
    { name: "Frode", tickets: 1 },
    { name: "Normi", tickets: 1 }
  ],
  "Uke 49": [
    { name: "Laila Martine", tickets: 3 },
    { name: "Elisabeth T", tickets: 3 },
    { name: "Ingrid", tickets: 3 },
    { name: "Pål E", tickets: 3 },
    { name: "Tore", tickets: 2 },
    { name: "Daniel", tickets: 2 },
    { name: "Alexander", tickets: 2 },
    { name: "Hege", tickets: 2 },
    { name: "Karoline", tickets: 1 },
    { name: "Jannicke", tickets: 2 },
    { name: "Ingvild", tickets: 1 },
    { name: "Ebbe", tickets: 1 },
    { name: "Rene G", tickets: 2 },
    { name: "Trine", tickets: 2 },
    { name: "Charlotte", tickets: 1 },
    { name: "Frode", tickets: 1 },
    { name: "Normi", tickets: 1 }
  ],
  "Uke 50": [
    { name: "Laila Martine", tickets: 3 },
    { name: "Elisabeth T", tickets: 3 },
    { name: "Ingrid", tickets: 3 },
    { name: "Pål E", tickets: 2 },
    { name: "Tore", tickets: 2 },
    { name: "Daniel", tickets: 2 },
    { name: "Alexander", tickets: 2 },
    { name: "Hege", tickets: 2 },
    { name: "Karoline", tickets: 1 },
    { name: "Gro", tickets: 1 },
    { name: "Jannicke", tickets: 2 },
    { name: "Ingvild", tickets: 1 },
    { name: "Ebbe", tickets: 1 },
    { name: "Rene G", tickets: 1 },
    { name: "Trine", tickets: 1 },
    { name: "Charlotte", tickets: 1 },
    { name: "Frode", tickets: 1 },
    { name: "Normi", tickets: 1 }
  ],
  "Uke 51": [
    { name: "Laila Martine", tickets: 3 },
    { name: "Elisabeth T", tickets: 3 },
    { name: "Ingrid", tickets: 3 },
    { name: "Pål E", tickets: 2 },
    { name: "Tore", tickets: 2 },
    { name: "Daniel", tickets: 2 },
    { name: "Alexander", tickets: 2 },
    { name: "Hege", tickets: 2 },
    { name: "Karoline", tickets: 1 },
    { name: "Gro", tickets: 1 },
    { name: "Jannicke", tickets: 1 },
    { name: "Ingvild", tickets: 1 },
    { name: "Ebbe", tickets: 1 },
    { name: "Rene G", tickets: 1 },
    { name: "Charlotte", tickets: 1 },
    { name: "Normi", tickets: 1 }
  ]
};

export default function App() {
  const [selectedWeek, setSelectedWeek] = useState("Uke 45");
  const [winner, setWinner] = useState(null);

  const currentParticipants = weeklyData[selectedWeek] || [];

  // Generer den komplette loddlisten for valgt uke
  const ticketList = currentParticipants.flatMap(p => Array(p.tickets).fill(p.name));

  const drawWinner = () => {
    if (ticketList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * ticketList.length);
    setWinner(ticketList[randomIndex]);
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(e.target.value);
    setWinner(null); // Nullstill vinner når uke byttes
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-amber-400 mb-6">🍷 Vinlotteriet 🍷</h1>
      
      {/* Ukevelger */}
      <div className="mb-6 flex items-center space-x-3">
        <label className="text-slate-300 font-medium text-lg">Velg uke:</label>
        <select 
          value={selectedWeek} 
          onChange={handleWeekChange}
          className="bg-slate-900 border border-slate-700 text-amber-400 font-bold py-2 px-4 rounded-lg focus:outline-none focus:border-amber-500 text-lg"
        >
          {Object.keys(weeklyData).map(week => (
            <option key={week} value={week}>{week}</option>
          ))}
        </select>
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md text-center shadow-xl mb-6">
        <p className="text-slate-400 mb-1">Totalt antall lodd for {selectedWeek}:</p>
        <p className="text-3xl font-extrabold text-emerald-400">{ticketList.length} lodd</p>
        
        <button 
          onClick={drawWinner}
          className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-6 rounded-lg transition transform active:scale-95 text-lg shadow-md"
        >
          Trekk Vinner ({selectedWeek})! 🎲
        </button>

        {winner && (
          <div className="mt-6 p-4 bg-emerald-950 border border-emerald-500 rounded-lg animate-bounce">
            <p className="text-emerald-300 text-sm uppercase tracking-wide">Gratulerer til!</p>
            <p className="text-2xl font-black text-emerald-100 mt-1">{winner} 🎉</p>
          </div>
        )}
      </div>

      <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-slate-200 flex justify-between items-center">
          <span>Kjøpte lodd per person</span>
          <span className="text-xs text-amber-400 font-normal">{selectedWeek}</span>
        </h2>
        <ul className="divide-y divide-slate-800 max-h-60 overflow-y-auto pr-2">
          {currentParticipants.map((p, index) => (
            <li key={index} className="py-2 flex justify-between items-center text-sm">
              <span className="text-slate-300 font-medium">{p.name}</span>
              <span className="bg-slate-800 text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-slate-700">
                {p.tickets} lodd
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
