import React, { useState } from 'react';

// Loddsalg per uke fra skjemaet
const weeklyData = {
  "Uke 45": {
    "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 3, "Tore": 2, 
    "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 2, "Gro": 2, 
    "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 1, 
    "Charlotte": 1, "Frode": 1, "Normi": 1, "Kristian": 1
  },
  "Uke 46": {
    "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 2, "Tore": 2, 
    "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 2, "Gro": 1, 
    "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 1, 
    "Charlotte": 1, "Frode": 1, "Normi": 1
  },
  "Uke 47": {
    "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 3, "Tore": 2, 
    "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Gro": 1, 
    "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 1, 
    "Charlotte": 1, "Frode": 1, "Normi": 1
  },
  "Uke 48": {
    "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 2, "Tore": 2, 
    "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Jannicke": 2, 
    "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 1, "Charlotte": 1, 
    "Frode": 1, "Normi": 1
  },
  "Uke 49": {
    "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 3, "Tore": 2, 
    "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Jannicke": 2, 
    "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 2, "Charlotte": 1, 
    "Frode": 1, "Normi": 1
  },
  "Uke 50": {
    "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 2, "Tore": 2, 
    "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Gro": 1, 
    "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 1, "Trine": 1, 
    "Charlotte": 1, "Frode": 1, "Normi": 1
  },
  "Uke 51": {
    "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 2, "Tore": 2, 
    "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Gro": 1, 
    "Jannicke": 1, "Ingvild": 1, "Ebbe": 1, "Rene G": 1, "Charlotte": 1, "Normi": 1
  }
};

export default function App() {
  const [selectedWeek, setSelectedWeek] = useState("Uke 45");
  const [winner, setWinner] = useState(null);

  const currentData = weeklyData[selectedWeek] || {};
  
  // Konverter til liste med alle lodd
  const ticketList = Object.entries(currentData).flatMap(([name, count]) => 
    Array(count).fill(name)
  );

  const drawWinner = () => {
    if (ticketList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * ticketList.length);
    setWinner(ticketList[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      {/* Tittel */}
      <header className="text-center mb-6">
        <h1 className="text-3xl md:text-5xl font-black text-amber-400 tracking-tight">
          🍷 VINLOTTERIET 🍷
        </h1>
        <p className="text-slate-400 text-sm mt-1">Velg uke og trekk en vinner!</p>
      </header>

      {/* Ukevelger */}
      <div className="mb-6 flex items-center space-x-3 bg-slate-900 p-2 px-4 rounded-xl border border-slate-800 shadow-md">
        <span className="text-slate-300 font-medium">Aktiv uke:</span>
        <select 
          value={selectedWeek} 
          onChange={(e) => { setSelectedWeek(e.target.value); setWinner(null); }}
          className="bg-slate-800 text-amber-400 font-bold py-1.5 px-3 rounded-lg border border-slate-700 focus:outline-none"
        >
          {Object.keys(weeklyData).map(w => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Treknings-boks */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center justify-center text-center">
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-wider">Solgte lodd i {selectedWeek}</p>
          <p className="text-5xl font-black text-emerald-400 my-3">{ticketList.length}</p>
          
          <button 
            onClick={drawWinner}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-4 px-6 rounded-xl transition transform active:scale-95 text-xl shadow-lg mt-2"
          >
            🎲 TREKK VINNER!
          </button>

          {winner && (
            <div className="mt-6 w-full p-4 bg-emerald-950/80 border-2 border-emerald-500 rounded-xl animate-bounce">
              <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Vinner av {selectedWeek}</p>
              <p className="text-3xl font-black text-white mt-1">{winner} 🎉</p>
            </div>
          )}
        </div>

        {/* Oversikt over lodd per person */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-lg font-bold text-slate-200 mb-4 pb-2 border-b border-slate-800 flex justify-between">
            <span>Deltakere</span>
            <span className="text-slate-400 text-xs font-normal">Antall lodd</span>
          </h2>
          
          <div className="max-h-72 overflow-y-auto pr-2 space-y-2">
            {Object.entries(currentData).map(([name, count]) => (
              <div key={name} className="flex justify-between items-center bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/60">
                <span className="text-slate-200 font-medium text-sm">{name}</span>
                <span className="bg-slate-800 text-amber-400 font-bold text-xs px-2.5 py-1 rounded-md border border-slate-700">
                  {count} lodd
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
