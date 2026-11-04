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

const defaultPrizes = {
  "Uke 45": { title: "Rødvin & Hvitvin Duo", image1: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80", image2: "https://images.unsplash.com/photo-1558001373-a128e08d660e?w=500&q=80", winner: "" },
  "Uke 46": { title: "Riesling & Pinot Noir", image1: "https://images.unsplash.com/photo-1558001373-a128e08d660e?w=500&q=80", image2: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80", winner: "" },
  "Uke 47": { title: "Prosecco & Spumante", image1: "https://images.unsplash.com/photo-1594488507235-d0333b3723ee?w=500&q=80", image2: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80", winner: "" },
  "Uke 48": { title: "Flott Rødvinsett", image1: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80", image2: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80", winner: "" },
  "Uke 49": { title: "Julevin Spesial", image1: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80", image2: "https://images.unsplash.com/photo-1558001373-a128e08d660e?w=500&q=80", winner: "" },
  "Uke 50": { title: "Eksklusiv Champagne & Rødvin", image1: "https://images.unsplash.com/photo-1594488507235-d0333b3723ee?w=500&q=80", image2: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80", winner: "" },
  "Uke 51": { title: "Stor Julekurv & Champagne", image1: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80", image2: "https://images.unsplash.com/photo-1594488507235-d0333b3723ee?w=500&q=80", winner: "" }
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

  const [prizes, setPrizes] = useState(() => {
    try {
      const saved = localStorage.getItem('vinlotteri_prizes_v2');
      return saved ? JSON.parse(saved) : defaultPrizes;
    } catch (e) {
      return defaultPrizes;
    }
  });

  const [activeWeek, setActiveWeek] = useState("Uke 45");
  const [buyerName, setBuyerName] = useState("");
  const [selectedTickets, setSelectedTickets] = useState({});
  
  const [showVippsModal, setShowVippsModal] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  // Enarmet Banditt-tilstander
  const [isSpinning, setIsSpinning] = useState(false);
  const [slotDisplay, setSlotDisplay] = useState({ tens: "0", ones: "0" });
  const [currentWinner, setCurrentWinner] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('vinlotteri_fixed_v4', JSON.stringify(weeklyData));
    } catch (e) {}
  }, [weeklyData]);

  useEffect(() => {
    try {
      localStorage.setItem('vinlotteri_prizes_v2', JSON.stringify(prizes));
    } catch (e) {}
  }, [prizes]);

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
    if (window.confirm("Vil du tilbakestille loddene og premier til utgangspunktet?")) {
      setWeeklyData(exactDataFromImage);
      setPrizes(defaultPrizes);
      localStorage.removeItem('vinlotteri_fixed_v4');
      localStorage.removeItem('vinlotteri_prizes_v2');
      setCurrentWinner(null);
      alert("Alt er tilbakestilt!");
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

  // KUN SOLGTE/RESERVERTE LODD TAS MED I TREKNINGEN
  const soldTicketsInActiveWeek = Object.entries(currentWeekData).flatMap(([name, tickets]) => 
    Array.isArray(tickets) ? tickets.map(t => ({ ticketNum: t, owner: name })) : []
  );

  // ENARMET BANDITT - TREKNINGSANIMASJON
  const startSlotMachine = () => {
    if (soldTicketsInActiveWeek.length === 0) {
      alert(`Ingen lodd er solgt eller registrert for ${activeWeek} ennå!`);
      return;
    }

    setIsSpinning(true);
    setCurrentWinner(null);

    // Velg tilfeldig vinner blant KUN de solgte loddene
    const winningTicket = soldTicketsInActiveWeek[Math.floor(Math.random() * soldTicketsInActiveWeek.length)];
    const winNumStr = winningTicket.ticketNum.toString().padStart(2, '0');

    let counter = 0;
    const interval = setInterval(() => {
      // Snurrer tilfeldige tall under animasjonen
      const randomTens = Math.floor(Math.random() * 5).toString();
      const randomOnes = Math.floor(Math.random() * 10).toString();
      setSlotDisplay({ tens: randomTens, ones: randomOnes });

      counter += 100;
      if (counter >= 3000) { // 3 sekunder snurring
        clearInterval(interval);
        setSlotDisplay({ tens: winNumStr[0], ones: winNumStr[1] });
        setCurrentWinner(winningTicket);
        setIsSpinning(false);

        // Oppdaterer vinnerlisten i premier automatisk
        setPrizes(prev => ({
          ...prev,
          [activeWeek]: {
            ...prev[activeWeek],
            winner: `${winningTicket.owner} (Lodd #${winningTicket.ticketNum})`
          }
        }));
      }
    }, 80);
  };

  const updatePrize = (week, field, value) => {
    setPrizes(prev => ({
      ...prev,
      [week]: {
        ...prev[week],
        [field]: value
      }
    }));
  };

  const currentPrize = prizes[activeWeek] || {};

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

        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setShowPrizeModal(true)}
            className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5"
          >
            <span>🍷</span>
            <span>Ukens Premie ({activeWeek})</span>
          </button>

          <button 
            onClick={() => setShowWinnersModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3.5 py-2 rounded-xl transition shadow-md flex items-center space-x-1.5"
          >
            <span>🏆</span>
            <span>Vinnere</span>
          </button>

          <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center space-x-2 text-xs">
            <span className="text-amber-400 font-bold">🎟️ {activeWeek}:</span>
            <span className="font-extrabold text-white">{soldCountInActiveWeek} / {MAX_TICKETS}</span>
          </div>

          <button 
            onClick={() => {
              if (isAdminUnlocked) setIsAdminUnlocked(false);
              else setShowAdminModal(true);
            }}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold px-3 py-2 rounded-xl text-slate-300"
          >
            {isAdminUnlocked ? "🔓 Admin" : "⚙️ Admin"}
          </button>
        </div>
      </header>

      <div className="bg-[#0f172a]/70 border-b border-slate-800 px-6 py-3 flex items-center space-x-2 overflow-x-auto">
        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider mr-2">Velg Uke:</span>
        {weeksList.map(w => (
          <button 
            key={w}
            onClick={() => { setActiveWeek(w); setCurrentWinner(null); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeWeek === w ? 'bg-amber-500 text-slate-950 shadow-lg scale-105' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'}`}
          >
            {w}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        {/* ADMIN KONTROLLPANEL MED ENARMET BANDITT */}
        {isAdminUnlocked && (
          <div className="bg-gradient-to-b from-amber-950/40 to-slate-900/90 border-2 border-amber-500/50 p-6 rounded-2xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
              <h2 className="text-lg font-black text-amber-400 flex items-center space-x-2">
                <span>🎰 Enarmet Banditt - Trekning for {activeWeek}</span>
              </h2>
              <button onClick={resetToInitial} className="text-xs bg-rose-950 hover:bg-rose-900 text-rose-300 px-3 py-1 rounded-lg border border-rose-800">
                🔄 Tilbakestill alt
              </button>
            </div>
            
            {/* SPILLEMASKIN (ENARMET BANDITT) */}
            <div className="flex flex-col items-center justify-center space-y-4 py-2">
              <div className="bg-slate-950 border-4 border-amber-500/80 p-6 rounded-3xl shadow-2xl flex items-center space-x-6 relative">
                
                {/* Lys på maskinen */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
                  {isSpinning ? "SNURRER..." : "KLAR TIL TREKNING"}
                </div>

                {/* Tall-hjul 1 */}
                <div className="w-20 h-28 bg-black border-2 border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                  <span className={`text-6xl font-black font-mono text-amber-400 ${isSpinning ? 'animate-pulse' : ''}`}>
                    {slotDisplay.tens}
                  </span>
                </div>

                {/* Tall-hjul 2 */}
                <div className="w-20 h-28 bg-black border-2 border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                  <span className={`text-6xl font-black font-mono text-amber-400 ${isSpinning ? 'animate-pulse' : ''}`}>
                    {slotDisplay.ones}
                  </span>
                </div>

                {/* Spak på siden (Den enarmede banditten) */}
                <div className="hidden md:flex flex-col items-center">
                  <div className="w-3 h-16 bg-slate-700 rounded-t-full border border-slate-600"></div>
                  <div className="w-8 h-8 bg-rose-600 rounded-full border-2 border-rose-400 shadow-lg -mt-2"></div>
                </div>
              </div>

              {/* Startknapp for trekning */}
              <button 
                onClick={startSlotMachine}
                disabled={isSpinning}
                className={`bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-8 py-3.5 rounded-xl text-base shadow-xl transform active:scale-95 transition ${isSpinning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSpinning ? "🎰 Trekker vinner..." : `🎰 DRA I SPAKEN (TREKK ${activeWeek.toUpperCase()})`}
              </button>

              {/* Vinner-banner */}
              {currentWinner && !isSpinning && (
                <div className="bg-emerald-950/90 border-2 border-emerald-400 px-8 py-3 rounded-2xl text-center space-y-1 shadow-2xl animate-bounce">
                  <p className="text-emerald-400 text-xs font-extrabold uppercase tracking-widest">🎉 GRATULERER TIL VINNEREN! 🎉</p>
                  <p className="text-2xl font-black text-white">{currentWinner.owner}</p>
                  <p className="text-amber-400 text-sm font-bold">Vinnerlodd #{currentWinner.ticketNum} i {activeWeek}</p>
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

      {/* UKENS PREMIE MODAL (MED 2 BILDER) */}
      {showPrizeModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-amber-500/30 p-6 rounded-2xl w-full max-w-2xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{activeWeek}</span>
                <h2 className="text-2xl font-black text-white">{currentPrize.title || "Ukens Premie"}</h2>
              </div>
              <button 
                onClick={() => setShowPrizeModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs"
              >
                Lukk ✖
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="h-56 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                {currentPrize.image1 ? (
                  <img src={currentPrize.image1} alt="Vin bilde 1" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-600 text-sm">Ingen Bilde 1</div>
                )}
              </div>
              <div className="h-56 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                {currentPrize.image2 ? (
                  <img src={currentPrize.image2} alt="Vin bilde 2" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-slate-600 text-sm">Ingen Bilde 2</div>
                )}
              </div>
            </div>

            {isAdminUnlocked && (
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                <p className="text-xs font-bold text-amber-400 uppercase">✏️ Admin: Rediger Premier for {activeWeek}</p>
                <div className="space-y-2">
                  <input 
                    type="text" 
                    placeholder="Premietittel..." 
                    value={currentPrize.title || ""} 
                    onChange={(e) => updatePrize(activeWeek, "title", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Bilde 1 URL (https://...)" 
                    value={currentPrize.image1 || ""} 
                    onChange={(e) => updatePrize(activeWeek, "image1", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                  <input 
                    type="text" 
                    placeholder="Bilde 2 URL (https://...)" 
                    value={currentPrize.image2 || ""} 
                    onChange={(e) => updatePrize(activeWeek, "image2", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VINNERE MODAL */}
      {showWinnersModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-amber-500/30 p-6 rounded-2xl w-full max-w-xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="text-2xl font-black text-amber-400 flex items-center space-x-2">
                <span>🏆 Vinneroversikt (Uke 45–51)</span>
              </h2>
              <button 
                onClick={() => setShowWinnersModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs"
              >
                Lukk ✖
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {weeksList.map(week => {
                const prize = prizes[week] || {};
                return (
                  <div key={week} className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-black text-amber-400 uppercase">{week}</span>
                      <p className="text-sm font-bold text-white">{prize.title || "Premie"}</p>
                    </div>

                    <div className="flex-1 sm:text-right">
                      {isAdminUnlocked ? (
                        <input 
                          type="text" 
                          placeholder="Skriv inn vinner..." 
                          value={prize.winner || ""} 
                          onChange={(e) => updatePrize(week, "winner", e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-bold w-full sm:w-48 text-left sm:text-right"
                        />
                      ) : (
                        <p className={`text-sm font-black ${prize.winner ? 'text-emerald-400' : 'text-slate-600 italic'}`}>
                          {prize.winner ? `🎉 ${prize.winner}` : "Ikke trukket"}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN MODAL */}
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
              <p>2. Send <strong>{totalSelectedCount * TICKET_PRICE} kr</strong> til <strong>Tore Farestad Lie (41406582)</strong>.</p>
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
