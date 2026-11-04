import React, { useState, useEffect } from 'react';

// Eksakt mapping fra Excel-dokumentasjonen for Uke 45-51
const exactDataFromImage = {
  "Uke 45": {
    "Pål E": [1, 24],
    "Trine": [2, 31],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 29],
    "Charlotte": [5],
    "Hege": [6, 26],
    "Frode": [7],
    "Ingrid": [8, 14],
    "Normi": [9],
    "Tore": [10, 20],
    "Daniel": [11, 22],
    "Karoline": [12, 13],
    "Gro": [15],
    "Jannicke": [16, 30],
    "Alexander": [18, 21],
    "Ingvild": [19],
    "Ebbe": [25],
    "Kristian": [31],
    "Rene G": [44, 45]
  },
  "Uke 46": {
    "Charlotte": [2],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 29],
    "Ingrid": [5, 14],
    "Hege": [6, 26],
    "Frode": [7],
    "Jannicke": [8, 30],
    "Tore": [10, 20],
    "Daniel": [11, 22],
    "Trine": [12],
    "Normi": [13],
    "Gro": [15],
    "Pål E": [16, 24],
    "Alexander": [18, 21],
    "Ingvild": [19],
    "Karoline": [23],
    "Ebbe": [25],
    "Rene G": [44, 45]
  },
  "Uke 47": {
    "Pål E": [2, 16, 24],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 29],
    "Frode": [5],
    "Hege": [6, 26],
    "Ingrid": [7, 14],
    "Charlotte": [8, 28],
    "Gro": [9, 15],
    "Tore": [10, 20],
    "Daniel": [11, 22],
    "Trine": [12],
    "Normi": [13],
    "Ingvild": [15],
    "Jannicke": [16, 30],
    "Alexander": [18, 21],
    "Karoline": [23],
    "Ebbe": [25],
    "Rene G": [44, 45]
  },
  "Uke 48": {
    "Trine": [2],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 29],
    "Frode": [5],
    "Hege": [6, 26],
    "Karoline": [7],
    "Jannicke": [8, 30],
    "Ingrid": [9, 14],
    "Tore": [10, 20],
    "Daniel": [11, 22],
    "Normi": [13],
    "Pål E": [16, 24],
    "Alexander": [18, 21],
    "Ingvild": [19],
    "Ebbe": [25],
    "Charlotte": [28],
    "Rene G": [44, 45]
  },
  "Uke 49": {
    "Pål E": [1, 16, 24],
    "Trine": [2],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 29],
    "Frode": [5],
    "Hege": [6, 26],
    "Karoline": [7],
    "Ingrid": [8, 14],
    "Tore": [10, 20],
    "Daniel": [11, 22],
    "Normi": [13],
    "Ingvild": [15],
    "Jannicke": [16, 30],
    "Alexander": [18, 21],
    "Ebbe": [25],
    "Charlotte": [28],
    "Rene G": [44, 45]
  },
  "Uke 50": {
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 29],
    "Frode": [5],
    "Hege": [6, 26],
    "Ingrid": [7, 14],
    "Jannicke": [8, 30],
    "Normi": [9],
    "Tore": [10, 20],
    "Daniel": [11, 22],
    "Trine": [12],
    "Karoline": [13],
    "Gro": [15],
    "Pål E": [16, 24],
    "Alexander": [18, 21],
    "Ingvild": [19],
    "Ebbe": [25],
    "Charlotte": [28],
    "Rene G": [44, 45]
  },
  "Uke 51": {
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 29],
    "Hege": [6, 26],
    "Karoline": [7, 12],
    "Normi": [8],
    "Ingrid": [9, 14],
    "Tore": [10, 20],
    "Daniel": [11, 22],
    "Gro": [15],
    "Pål E": [16, 24],
    "Alexander": [18, 21],
    "Ingvild": [19],
    "Ebbe": [25],
    "Charlotte": [28],
    "Jannicke": [30],
    "Rene G": [44, 45]
  }
};

const weeksList = ["Uke 45", "Uke 46", "Uke 47", "Uke 48", "Uke 49", "Uke 50", "Uke 51"];
const TICKET_PRICE = 10;
const MAX_TICKETS = 45;

export default function App() {
  const [weeklyData, setWeeklyData] = useState(() => {
    try {
      const saved = localStorage.getItem('vinlotteri_fixed_v4');
      return saved ? JSON.parse(saved) : exactDataFromImage;
    } catch (e) {
      return exactDataFromImage;
    }
  });

  const [activeWeek, setActiveWeek] = useState("Uke 45");
  const [buyerName, setBuyerName] = useState("");
  const [selectedTickets, setSelectedTickets] = useState({});
  
  const [showVippsModal, setShowVippsModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('vinlotteri_fixed_v4', JSON.stringify(weeklyData));
    } catch (e) {}
  }, [weeklyData]);

  const getTicketOwner = (week, ticketNum) => {
    const weekObj = weeklyData[week] || {};
    for (const [name, tickets] of Object.entries(weekObj)) {
      if (Array.isArray(tickets) && tickets.includes(ticketNum)) return name;
    }
    return null;
  };

  const handleTicketClick = (ticketNum) => {
    if (!buyerName.trim()) {
      alert("Skriv inn navnet ditt i feltet øverst før du velger lodd!");
      return;
    }

    const owner = getTicketOwner(activeWeek, ticketNum);
    if (owner) {
      alert(`Lodd #${ticketNum} er allerede reservert av ${owner} i ${activeWeek}.`);
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

  const totalSelectedCount = Object.values(selectedTickets).reduce((acc, arr) => acc + (arr ? arr.length : 0), 0);

  const currentWeekData = weeklyData[activeWeek] || {};
  const soldCountInActiveWeek = Object.values(currentWeekData).reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);

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

  const confirmPurchase = () => {
    const updatedData = { ...weeklyData };

    Object.entries(selectedTickets).forEach(([week, tickets]) => {
      if (tickets && tickets.length > 0) {
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

  const resetToInitial = () => {
    if (window.confirm("Vil du tilbakestille loddene til den opprinnelige Excel-listen?")) {
      setWeeklyData(exactDataFromImage);
      localStorage.removeItem('vinlotteri_fixed_v4');
      alert("Loddene er tilbakestilt!");
    }
  };

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

  const allTicketsInActiveWeek = Object.entries(currentWeekData).flatMap(([name, tickets]) => 
    Array.isArray(tickets) ? tickets.map(t => ({ ticketNum: t, owner: name })) : []
  );

  const drawWinner = () => {
    if (allTicketsInActiveWeek.length === 0) return;
    const random = allTicketsInActiveWeek[Math.floor(Math.random() * allTicketsInActiveWeek.length)];
    setWinner(random);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 font-sans pb-12">
      <header className="bg-[#0f172a] border-b border-slate-800 px-6 py-4 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500/20 p-2.5 rounded-xl border border-amber-500/30 text-amber-400 text-2xl">🍷</div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Vinlotteriet</h1>
            <p className="text-xs text-slate-400">Lærerværelset Vinlotteri • {TICKET_PRICE} kr/lodd</p>
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left text-xs text-slate-300 space-y-2 mb-6">
  <p className="font-bold text-amber-400">Slik gjør du det:</p>
  <p>1. Åpne Vipps-appen på mobilen din.</p>
  <p>2. Send <strong>{totalSelectedCount * TICKET_PRICE} kr</strong> til <strong>Tore Farestad Lie (41406582)</strong>.</p>
  <p>3. Trykk på bekreftelsen under når betalingen er gjennomført.</p>
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

        {isAdminUnlocked && (
          <div className="bg-amber-950/30 border-2 border-amber-500/50 p-6 rounded-2xl shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black text-amber-400">👑 Admin Kontrollpanel ({activeWeek})</h2>
              <button onClick={resetToInitial} className="text-xs bg-rose-950 hover:bg-rose-900 text-rose-300 px-3 py-1 rounded-lg border border-rose-800">
                🔄 Tilbakestill til Excel-start
              </button>
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
