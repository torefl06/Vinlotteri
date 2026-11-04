import React, { useState, useEffect } from 'react';

// Forhåndsutfylte data fra Excel-arket per uke (Uke 45–51)
const initialWeeklyData = {
  "Uke 45": { "Laila Martine": [1, 2, 3], "Elisabeth T": [4, 5, 6], "Ingrid": [7, 8, 9], "Pål E": [10, 11, 12], "Tore": [13, 14], "Daniel": [15, 16], "Alexander": [17, 18], "Hege": [19, 20], "Karoline": [21, 22], "Gro": [23, 24], "Jannicke": [25, 26], "Ingvild": [27], "Ebbe": [28], "Rene G": [29, 30], "Trine": [31], "Charlotte": [32], "Frode": [33], "Normi": [34], "Kristian": [35] },
  "Uke 46": { "Laila Martine": [1, 2, 3], "Elisabeth T": [4, 5, 6], "Ingrid": [7, 8, 9], "Pål E": [10, 11], "Tore": [12, 13], "Daniel": [14, 15], "Alexander": [16, 17], "Hege": [18, 19], "Karoline": [20, 21], "Gro": [22], "Jannicke": [23, 24], "Ingvild": [25], "Ebbe": [26], "Rene G": [27, 28], "Trine": [29], "Charlotte": [30], "Frode": [31], "Normi": [32] },
  "Uke 47": { "Laila Martine": [1, 2, 3], "Elisabeth T": [4, 5, 6], "Ingrid": [7, 8, 9], "Pål E": [10, 11, 12], "Tore": [13, 14], "Daniel": [15, 16], "Alexander": [17, 18], "Hege": [19, 20], "Karoline": [21], "Gro": [22], "Jannicke": [23, 24], "Ingvild": [25], "Ebbe": [26], "Rene G": [27, 28], "Trine": [29], "Charlotte": [30], "Frode": [31], "Normi": [32] },
  "Uke 48": { "Laila Martine": [1, 2, 3], "Elisabeth T": [4, 5, 6], "Ingrid": [7, 8, 9], "Pål E": [10, 11], "Tore": [12, 13], "Daniel": [14, 15], "Alexander": [16, 17], "Hege": [18, 19], "Karoline": [20], "Jannicke": [21, 22], "Ingvild": [23], "Ebbe": [24], "Rene G": [25, 26], "Trine": [27], "Charlotte": [28], "Frode": [29], "Normi": [30] },
  "Uke 49": { "Laila Martine": [1, 2, 3], "Elisabeth T": [4, 5, 6], "Ingrid": [7, 8, 9], "Pål E": [10, 11, 12], "Tore": [13, 14], "Daniel": [15, 16], "Alexander": [17, 18], "Hege": [19, 20], "Karoline": [21], "Jannicke": [22, 23], "Ingvild": [24], "Ebbe": [25], "Rene G": [26, 27], "Trine": [28, 29], "Charlotte": [30], "Frode": [31], "Normi": [32] },
  "Uke 50": { "Laila Martine": [1, 2, 3], "Elisabeth T": [4, 5, 6], "Ingrid": [7, 8, 9], "Pål E": [10, 11], "Tore": [12, 13], "Daniel": [14, 15], "Alexander": [16, 17], "Hege": [18, 19], "Karoline": [20], "Gro": [21], "Jannicke": [22, 23], "Ingvild": [24], "Ebbe": [25], "Rene G": [26], "Trine": [27], "Charlotte": [28], "Frode": [29], "Normi": [30] },
  "Uke 51": { "Laila Martine": [1, 2, 3], "Elisabeth T": [4, 5, 6], "Ingrid": [7, 8, 9], "Pål E": [10, 11], "Tore": [12, 13], "Daniel": [14, 15], "Alexander": [16, 17], "Hege": [18, 19], "Karoline": [20], "Gro": [21], "Jannicke": [22], "Ingvild": [23], "Ebbe": [24], "Rene G": [25], "Charlotte": [26], "Normi": [27] }
};

const weeksList = ["Uke 45", "Uke 46", "Uke 47", "Uke 48", "Uke 49", "Uke 50", "Uke 51"];
const TICKET_PRICE = 10;
const MAX_TICKETS = 45;

export default function App() {
  const [weeklyData, setWeeklyData] = useState(() => {
    const saved = localStorage.getItem('vinlotteri_data');
    return saved ? JSON.parse(saved) : initialWeeklyData;
  });

  const [activeWeek, setActiveWeek] = useState("Uke 45");
  const [buyerName, setBuyerName] = useState("");
  const [selectedTickets, setSelectedTickets] = useState({}); // { "Uke 45": [1, 2], "Uke 46": [4] }
  
  // Modals & Admin
  const [showVippsModal, setShowVippsModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    localStorage.setItem('vinlotteri_data', JSON.stringify(weeklyData));
  }, [weeklyData]);

  // Hjelpefunksjon: Hvem eier et lodd i valgt uke?
  const getTicketOwner = (week, ticketNum) => {
    const weekObj = weeklyData[week] || {};
    for (const [name, tickets] of Object.entries(weekObj)) {
      if (tickets.includes(ticketNum)) return name;
    }
    return null;
  };

  // Klikk på lodd i rutenettet
  const handleTicketClick = (ticketNum) => {
    if (!buyerName.trim()) {
      alert("Skriv inn navnet ditt i feltet øverst før du velger lodd!");
      return;
    }

    const owner = getTicketOwner(activeWeek, ticketNum);
    if (owner) {
      alert(`Lodd #${ticketNum} er allerede opptatt av ${owner} i ${activeWeek}.`);
      return;
    }

    const currentSelected = selectedTickets[activeWeek] || [];
    let updated;
    if (currentSelected.includes(ticketNum)) {
      updated = currentSelected.filter(t => t !== ticketNum);
    } else {
      updated = [...currentSelected, ticketNum];
    }

    setSelectedTickets({ ...selectedTickets, [activeWeek]: updated });
  };

  // Beregn valgte lodd totalt
  const totalSelectedCount = Object.values(selectedTickets).reduce((acc, arr) => acc + arr.length, 0);

  // Solgte lodd i aktiv uke
  const currentWeekData = weeklyData[activeWeek] || {};
  const soldCountInActiveWeek = Object.values(currentWeekData).reduce((acc, arr) => acc + arr.length, 0);

  // Åpne Vipps-bekreftelse
  const handleProceedToVipps = () => {
    if (!buyerName.trim()) {
      alert("Skriv inn navnet ditt.");
      return;
    }
    if (totalSelectedCount === 0) {
      alert("Trykk på minst ett ledig lodd i rutenettet før du fortsetter.");
      return;
    }
    setShowVippsModal(true);
  };

  // Bekreft kjøp etter Vipps
  const confirmPurchase = () => {
    const updatedData = { ...weeklyData };

    Object.entries(selectedTickets).forEach(([week, tickets]) => {
      if (tickets.length > 0) {
        if (!updatedData[week]) updatedData[week] = {};
        const existing = updatedData[week][buyerName] || [];
        updatedData[week][buyerName] = [...existing, ...tickets];
      }
    });

    setWeeklyData(updatedData);
    setSelectedTickets({});
    setShowVippsModal(false);
    alert("Takk! Loddene dine er nå reservert.");
  };

  // Admin Lås opp
  const handleAdminUnlock = (e) => {
    e.preventDefault();
    if (adminPasswordInput === "vinlotteri26") {
      setIsAdminUnlocked(true);
      setShowAdminModal(false);
      setAdminPasswordInput("");
      setAdminError("");
    } else {
      setAdminError("Feil kode. Prøv igjen.");
    }
  };

  // Trekk vinner
  const allTicketsInActiveWeek = Object.entries(currentWeekData).flatMap(([name, tickets]) => 
    tickets.map(t => ({ ticketNum: t, owner: name }))
  );

  const drawWinner = () => {
    if (allTicketsInActiveWeek.length === 0) return;
    const random = allTicketsInActiveWeek[Math.floor(Math.random() * allTicketsInActiveWeek.length)];
    setWinner(random);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-12">
      
      {/* OPPRINNELIG TOPPBAR */}
      <header className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-2xl">🍷</div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Vinlotteriet</h1>
            <p className="text-xs text-slate-400">Lærerværelset Vinlotteri • {TICKET_PRICE} kr/lodd</p>
          </div>
        </div>

        {/* STATUSPILLE & ADMIN-KNAPP */}
        <div className="flex items-center space-x-4">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center space-x-2 text-xs">
            <span className="text-amber-400 font-bold">🎟️ {activeWeek}:</span>
            <span className="font-extrabold text-white">{soldCountInActiveWeek} / {MAX_TICKETS} lodd solgt</span>
          </div>

          <button 
            onClick={() => {
              if (isAdminUnlocked) setIsAdminUnlocked(false);
              else setShowAdminModal(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl text-slate-300"
          >
            {isAdminUnlocked ? "🔓 Admin (Logg ut)" : "⚙️ Admin"}
          </button>
        </div>
      </header>

      {/* UKESKNAPPER (VELG UKE) */}
      <div className="bg-[#0f172a]/70 border-b border-slate-800 px-6 py-3 flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mr-2">Velg Uke:</span>
        {weeksList.map(w => (
          <button 
            key={w}
            onClick={() => { setActiveWeek(w); setWinner(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeWeek === w ? 'bg-amber-500 text-slate-950 shadow-lg scale-105' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'}`}
          >
            {w}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        {/* ADMIN PANEL DERSOM INNLOGGET */}
        {isAdminUnlocked && (
          <div className="bg-amber-950/30 border-2 border-amber-500/50 p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-amber-400">👑 Admin Kontrollpanel ({activeWeek})</h2>
              <span className="text-xs text-amber-300 bg-amber-900/50 px-3 py-1 rounded-full border border-amber-500/30">Låst opp med kode</span>
            </div>
            
            <div className="flex flex-wrap gap-4 items-center justify-between bg-slate-950/80 p-4 rounded-xl border border-slate-800">
              <button 
                onClick={drawWinner}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-6 py-3 rounded-xl text-sm shadow-lg transform active:scale-95 transition"
              >
                🎲 TREKK VINNER FOR {activeWeek.toUpperCase()}
              </button>

              {winner && (
                <div className="bg-emerald-950 border border-emerald-500 px-6 py-2 rounded-xl animate-bounce text-center">
                  <p className="text-emerald-400 text-xs font-bold">Vinner i {activeWeek}:</p>
                  <p className="text-lg font-black text-white">{winner.owner} (Lodd #{winner.ticketNum}) 🎉</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REGISTRERINGSBOKS & LEGENDE */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4
