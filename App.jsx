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
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <label className="text-xs font-bold text-slate-400 uppercase">Ditt Navn:</label>
            <input 
              type="text" 
              placeholder="Skriv navnet ditt her..." 
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500 w-64"
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-1.5"><span className="w-3.5 h-3.5 rounded-md bg-slate-950 border border-slate-800"></span><span className="text-slate-400">Ledig</span></div>
              <div className="flex items-center space-x-1.5"><span className="w-3.5 h-3.5 rounded-md bg-amber-500"></span><span className="text-amber-400 font-bold">Valgt</span></div>
              <div className="flex items-center space-x-1.5"><span className="w-3.5 h-3.5 rounded-md bg-rose-950 border border-rose-800"></span><span className="text-rose-400">Opptatt</span></div>
            </div>

            <div className="text-right">
              <p className="text-xs text-slate-400">Valgt totalt på tvers av uker:</p>
              <p className="text-lg font-black text-amber-400">{totalSelectedCount} lodd ({totalSelectedCount * TICKET_PRICE} kr)</p>
            </div>

            <button 
              onClick={handleProceedToVipps}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3 rounded-xl transition transform active:scale-95 shadow-lg text-sm"
            >
              Registrer & Vipps ➔
            </button>
          </div>
        </div>

        {/* DET OPPRINNELIGE RUTENETTET (1-45) */}
        <div className="bg-[#0f172a] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h2 className="text-lg font-bold text-white flex items-center space-x-2">
              <span>🎟️ Lodd rutenett for</span>
              <span className="text-amber-400 font-extrabold">{activeWeek}</span>
            </h2>
            <p className="text-xs text-slate-400">Klikk på ledige ruter for å velge/avvelge lodd i denne uken</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-9 gap-3">
            {Array.from({ length: MAX_TICKETS }, (_, i) => i + 1).map(num => {
              const owner = getTicketOwner(activeWeek, num);
              const isSelectedByMe = (selectedTickets[activeWeek] || []).includes(num);

              let boxStyle = "bg-slate-950 border-slate-800/80 text-amber-400 hover:border-amber-500/50 hover:bg-slate-900";
              if (owner) {
                boxStyle = "bg-rose-950/30 border-rose-900/50 text-rose-300 cursor-not-allowed";
              } else if (isSelectedByMe) {
                boxStyle = "bg-amber-500 border-amber-400 text-slate-950 font-black shadow-lg shadow-amber-500/20 scale-105";
              }

              return (
                <button
                  key={num}
                  onClick={() => handleTicketClick(num)}
                  className={`h-24 rounded-2xl border p-3 flex flex-col justify-between items-start transition ${boxStyle}`}
                >
                  <span className="text-lg font-black">#{num}</span>
                  <span className="text-[11px] truncate w-full text-left font-medium opacity-80">
                    {owner ? owner : isSelectedByMe ? "Valgt av deg" : "Ledig"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </main>

      {/* ADMIN PASSORD MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-amber-400 mb-1">🔒 Admin Innlogging</h2>
            <p className="text-slate-400 text-xs mb-4">Oppgi adminkoden for å åpne trekningsfunksjonen.</p>
            <form onSubmit={handleAdminUnlock} className="space-y-3">
              <input 
                type="password"
                placeholder="Skriv inn adminkode..."
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-center font-mono focus:outline-none focus:border-amber-500"
              />
              {adminError && <p className="text-rose-400 text-xs text-center">{adminError}</p>}
              <div className="flex space-x-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowAdminModal(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs"
                >
                  Avbryt
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-md"
                >
                  Lås opp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIPPS MODAL */}
      {showVippsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-amber-500/40 p-6 rounded-2xl w-full max-w-md shadow-2xl text-center">
            <div className="text-4xl mb-2">📱</div>
            <h2 className="text-2xl font-black text-amber-400 mb-1">Husk å Vippse!</h2>
            <p className="text-slate-300 text-sm mb-4">
              Du reserverer nå <strong>{totalSelectedCount} lodd</strong> for <strong>{buyerName}</strong>.<br/>
              Totalbeløp: <strong className="text-emerald-400">{totalSelectedCount * TICKET_PRICE} kr</strong>.
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs text-slate-300 space-y-2 mb-6">
              <p className="font-bold text-amber-400">Slik gjør du det:</p>
              <p>1. Åpne Vipps-appen på mobilen din.</p>
              <p>2. Send <strong>{totalSelectedCount * TICKET_PRICE} kr</strong> til ansvarlig.</p>
              <p>3. Trykk på bekreftelsen under når betalingen er gjennomført.</p>
            </div>

            <div className="flex space-x-3">
              <button 
                onClick={() => setShowVippsModal(false)}
                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-xs transition"
              >
                Avbryt
              </button>
              <button 
                onClick={confirmPurchase}
                className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl text-xs transition shadow-lg"
              >
                Ja, jeg har Vippset!
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
