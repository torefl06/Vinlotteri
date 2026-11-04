import React, { useState, useEffect } from 'react';

// Forhåndsutfylte data fra Excel-arket (Uke 45 - 51)
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

export default function App() {
  const [weeklyData, setWeeklyData] = useState(() => {
    const saved = localStorage.getItem('vinlotteri_data');
    return saved ? JSON.parse(saved) : initialWeeklyData;
  });

  const [activeWeek, setActiveWeek] = useState("Uke 45");
  const [activeTab, setActiveTab] = useState("kjøp"); // kjøp, trekning, admin
  
  // Kjøper-tilstand
  const [buyerName, setBuyerName] = useState("");
  const [selectedTickets, setSelectedTickets] = useState({}); // { "Uke 45": [1, 2], "Uke 46": [5] }
  const [showVippsModal, setShowVippsModal] = useState(false);

  // Admin-tilstand
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    localStorage.setItem('vinlotteri_data', JSON.stringify(weeklyData));
  }, [weeklyData]);

  // Hjelpefunksjon: Sjekk hvem som har et gitt lodd i valgt uke
  const getTicketOwner = (week, ticketNum) => {
    const weekObj = weeklyData[week] || {};
    for (const [name, tickets] of Object.entries(weekObj)) {
      if (tickets.includes(ticketNum)) return name;
    }
    return null;
  };

  // Håndter trykk på et lodd i rutenettet
  const handleTicketClick = (ticketNum) => {
    if (!buyerName.trim()) {
      alert("Skriv inn navnet ditt øverst før du velger lodd!");
      return;
    }

    const owner = getTicketOwner(activeWeek, ticketNum);
    if (owner) {
      alert(`Lodd #${ticketNum} er allerede reservert av ${owner} i ${activeWeek}.`);
      return;
    }

    const currentSelectedForWeek = selectedTickets[activeWeek] || [];
    let updatedWeekTickets;

    if (currentSelectedForWeek.includes(ticketNum)) {
      updatedWeekTickets = currentSelectedForWeek.filter(t => t !== ticketNum);
    } else {
      updatedWeekTickets = [...currentSelectedForWeek, ticketNum];
    }

    setSelectedTickets({
      ...selectedTickets,
      [activeWeek]: updatedWeekTickets
    });
  };

  // Beregn totalt valgte lodd på tvers av uker
  const totalSelectedCount = Object.values(selectedTickets).reduce((acc, arr) => acc + arr.length, 0);

  // Åpne Vipps Modal
  const handleProceedToVipps = () => {
    if (!buyerName.trim()) {
      alert("Skriv inn navnet ditt.");
      return;
    }
    if (totalSelectedCount === 0) {
      alert("Velg minst ett ledig lodd fra rutenettet før du fortsetter.");
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

  // Lås opp Admin
  const handleAdminUnlock = (e) => {
    e.preventDefault();
    if (adminPasswordInput === "vinlotteri26") {
      setIsAdminUnlocked(true);
      setAdminError("");
    } else {
      setAdminError("Feil passord. Prøv igjen.");
    }
  };

  // Trekk vinner i valgt uke
  const currentWeekData = weeklyData[activeWeek] || {};
  const allTicketsInWeek = Object.entries(currentWeekData).flatMap(([name, tickets]) => 
    tickets.map(t => ({ ticketNum: t, owner: name }))
  );

  const drawWinner = () => {
    if (allTicketsInWeek.length === 0) return;
    const random = allTicketsInWeek[Math.floor(Math.random() * allTicketsInWeek.length)];
    setWinner(random);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 font-sans">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-[#111827] px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30 text-amber-400 text-2xl">🍷</div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-wide">Vinlotteriet</h1>
            <p className="text-xs text-slate-400">Lærerværelset Vinlotteri • {TICKET_PRICE} kr/lodd</p>
          </div>
        </div>

        {/* UKES VELGER KNAPPER */}
        <div className="flex items-center space-x-1.5 overflow-x-auto py-1">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mr-2">Velg Uke:</span>
          {weeksList.map(w => (
            <button 
              key={w}
              onClick={() => setActiveWeek(w)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${activeWeek === w ? 'bg-amber-500 text-slate-950 shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
            >
              {w}
            </button>
          ))}
        </div>
      </header>

      {/* TABS NAVEGERING */}
      <div className="bg-[#111827]/60 border-b border-slate-800 px-6 flex space-x-6 text-sm font-bold">
        <button 
          onClick={() => setActiveTab("kjøp")}
          className={`py-3 border-b-2 transition flex items-center space-x-2 ${activeTab === 'kjøp' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <span>🎫 Kjøp Lodd ({activeWeek})</span>
        </button>
        <button 
          onClick={() => setActiveTab("trekning")}
          className={`py-3 border-b-2 transition flex items-center space-x-2 ${activeTab === 'trekning' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <span>✨ Live Trekning ({activeWeek})</span>
        </button>
        <button 
          onClick={() => setActiveTab("admin")}
          className={`py-3 border-b-2 transition flex items-center space-x-2 ${activeTab === 'admin' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <span>⚙️ Admin & Behandling</span>
        </button>
      </div>

      {/* HOVEDINNHOLD */}
      <main className="max-w-6xl mx-auto p-4 md:p-8">

        {/* TAB 1: KJØP LODD (RUTENETT) */}
        {activeTab === "kjøp" && (
          <div className="space-y-6">
            
            {/* Navn & Handlekurv Linje */}
            <div className="bg-[#111827] p-5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <label className="text-xs font-bold text-slate-400 uppercase">Ditt Navn:</label>
                <input 
                  type="text" 
                  placeholder="Skriv navnet ditt her..." 
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500 w-64"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Valgte lodd (totalt alle uker):</p>
                  <p className="text-lg font-black text-amber-400">{totalSelectedCount} lodd ({totalSelectedCount * TICKET_PRICE} kr)</p>
                </div>
                <button 
                  onClick={handleProceedToVipps}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-2.5 rounded-xl transition transform active:scale-95 shadow-md text-sm"
                >
                  Registrer & Vipps ➔
                </button>
              </div>
            </div>

            {/* RUTENETT FOR VALGT UKE */}
            <div className="bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-white">Velg lodd for {activeWeek} (1–45)</h2>
                  <p className="text-xs text-slate-400">Trykk på ledige tall for å reservere loddene dine for denne uken.</p>
                </div>

                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-slate-900 border border-slate-700"></span><span className="text-slate-400">Ledig</span></div>
                  <div className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-amber-500"></span><span className="text-amber-400 font-bold">Valgt</span></div>
                  <div className="flex items-center space-x-1.5"><span className="w-3 h-3 rounded-full bg-rose-950 border border-rose-800"></span><span className="text-rose-400">Opptatt</span></div>
                </div>
              </div>

              {/* Grid 1 - 45 */}
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
                {Array.from({ length: 45 }, (_, i) => i + 1).map(num => {
                  const owner = getTicketOwner(activeWeek, num);
                  const isSelectedByMe = (selectedTickets[activeWeek] || []).includes(num);

                  let btnStyle = "bg-slate-950 border-slate-800 text-amber-400 hover:border-amber-500/50";
                  if (owner) {
                    btnStyle = "bg-rose-950/40 border-rose-900/60 text-rose-300 cursor-not-allowed";
                  } else if (isSelectedByMe) {
                    btnStyle = "bg-amber-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-105";
                  }

                  return (
                    <button
                      key={num}
                      onClick={() => handleTicketClick(num)}
                      className={`h-20 rounded-xl border p-2 flex flex-col justify-between items-start transition ${btnStyle}`}
                    >
                      <span className="text-sm font-extrabold">#{num}</span>
                      <span className="text-[10px] truncate w-full text-left font-medium opacity-80">
                        {owner ? owner : isSelectedByMe ? "Valgt av deg" : "Ledig"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LIVE TREKNING */}
        {activeTab === "trekning" && (
          <div className="bg-[#111827] p-8 rounded-2xl border border-slate-800 text-center max-w-xl mx-auto shadow-2xl">
            <h2 className="text-2xl font-black text-amber-400 mb-2">🎲 Trekning for {activeWeek}</h2>
            <p className="text-slate-400 text-sm mb-6">Totalt solgte lodd i denne uken: <strong>{allTicketsInWeek.length} lodd</strong></p>

            {winner ? (
              <div className="p-6 bg-emerald-950/80 border-2 border-emerald-500 rounded-2xl animate-bounce mb-6">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">🎉 Gratulerer til vinneren! 🎉</p>
                <p className="text-3xl font-black text-white mt-2">{winner.owner}</p>
                <p className="text-emerald-300 text-sm mt-1">Vinnerlodd: #{winner.ticketNum}</p>
              </div>
            ) : (
              <div className="p-8 bg-slate-950 rounded-2xl border border-slate-800 mb-6 text-slate-500 text-sm">
                Trekningen er ikke utført enda.
              </div>
            )}
          </div>
        )}

        {/* TAB 3: ADMIN */}
        {activeTab === "admin" && (
          <div className="max-w-2xl mx-auto">
            {!isAdminUnlocked ? (
              <div className="bg-[#111827] p-8 rounded-2xl border border-slate-800 shadow-2xl text-center">
                <div className="text-4xl mb-3">🔒</div>
                <h2 className="text
