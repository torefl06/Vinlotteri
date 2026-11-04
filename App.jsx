import React, { useState, useEffect } from 'react';

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
  "Uke 45": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 46": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 47": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 48": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 49": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 50": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 51": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" }
};

const weeksList = ["Uke 45", "Uke 46", "Uke 47", "Uke 48", "Uke 49", "Uke 50", "Uke 51"];
const TICKET_PRICE = 10;
const MAX_TICKETS = 45;

let audioCtx = null;
const playClickSound = () => {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  } catch(e) {}
};

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
      const saved = localStorage.getItem('vinlotteri_prizes_v3');
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

  const [isSpinning, setIsSpinning] = useState(false);
  const [slotDisplay, setSlotDisplay] = useState({ tens: "0", ones: "0" });
  const [tempWinner1, setTempWinner1] = useState(null);
  const [tempWinner2, setTempWinner2] = useState(null);
  
  const [revealModal, setRevealModal] = useState({ show: false, bottle: 1, name: "", ticket: null, stage: "drumroll" });
  const [showConfirmDraw, setShowConfirmDraw] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('vinlotteri_fixed_v4', JSON.stringify(weeklyData));
    } catch (e) {}
  }, [weeklyData]);

  useEffect(() => {
    try {
      localStorage.setItem('vinlotteri_prizes_v3', JSON.stringify(prizes));
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
    if (window.confirm("Vil du tilbakestille alt til utgangspunktet?")) {
      setWeeklyData(exactDataFromImage);
      setPrizes(defaultPrizes);
      localStorage.removeItem('vinlotteri_fixed_v4');
      localStorage.removeItem('vinlotteri_prizes_v3');
      setTempWinner1(null);
      setTempWinner2(null);
      setShowConfirmDraw(false);
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

  const soldTicketsInActiveWeek = Object.entries(currentWeekData).flatMap(([name, tickets]) => 
    Array.isArray(tickets) ? tickets.map(t => ({ ticketNum: t, owner: name })) : []
  );

  const startSlotMachine = (flaskeNummer) => {
    if (soldTicketsInActiveWeek.length === 0) {
      alert(`Ingen lodd er solgt for ${activeWeek} ennå!`);
      return;
    }

    let pool = soldTicketsInActiveWeek;
    if (flaskeNummer === 2 && tempWinner1) {
      pool = pool.filter(t => t.ticketNum !== tempWinner1.ticketNum);
    }

    if (pool.length === 0) {
      alert("Ingen flere solgte lodd å trekke fra!");
      return;
    }

    // Tvinger oppstart av din innspilte audio DIREKTE i klikket for å godkjennes av nettleseren
    const customAudio = new Audio('./vinner.mp3.m4a');
    const playPromise = customAudio.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        customAudio.pause();
        customAudio.currentTime = 0;
      }).catch(() => {});
    }

    setIsSpinning(true);
    setShowConfirmDraw(false);

    const winningTicket = pool[Math.floor(Math.random() * pool.length)];
    const winNumStr = winningTicket.ticketNum.toString().padStart(2, '0');

    let duration = 3000; 
    let elapsed = 0;

    const timer = setInterval(() => {
      const randomTens = Math.floor(Math.random() * 5).toString();
      const randomOnes = Math.floor(Math.random() * 10).toString();
      setSlotDisplay({ tens: randomTens, ones: randomOnes });
      
      playClickSound();

      elapsed += 80;
      if (elapsed >= duration) {
        clearInterval(timer);
        setSlotDisplay({ tens: winNumStr[0], ones: winNumStr[1] });
        setIsSpinning(false);

        // 1. Åpne vinnervinduet og spil av din stemme («Og vinneren er...»)
        setRevealModal({ show: true, bottle: flaskeNummer, name: winningTicket.owner, ticket: winningTicket.ticketNum, stage: "drumroll" });
        
        customAudio.currentTime = 0;
        customAudio.play().catch(() => {
          // Fallback-stier hvis GitHub Pages bruker annen rotmappe
          const altAudio = new Audio('./vinner.mp3') || new Audio('vinner.mp3.m4a');
          altAudio.play().catch(() => {});
        });

        // 2. Navnet avsløres i synk med klappingen fra opptaket ditt (3.2 sekunder ut i klippet)
        setTimeout(() => {
          setRevealModal(prev => ({ ...prev, stage: "winner" }));

          if (flaskeNummer === 1) {
            setTempWinner1(winningTicket);
          } else {
            setTempWinner2(winningTicket);
            setShowConfirmDraw(true);
          }
        }, 3200);
      }
    }, 80);
  };

  const saveFinalWinners = () => {
    const winnerText = `1: ${tempWinner1.owner} (#${tempWinner1.ticketNum}) | 2: ${tempWinner2.owner} (#${tempWinner2.ticketNum})`;
    updatePrize(activeWeek, "winner", winnerText);
    setShowConfirmDraw(false);
    alert(`🎉 Vinnerne for ${activeWeek} er godkjent og lagret!`);
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

  const handleImageUpload = (week, imageKey, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        updatePrize(week, imageKey, compressedBase64);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
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
            <span>Ukens Premier ({activeWeek})</span>
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
            onClick={() => { setActiveWeek(w); setTempWinner1(null); setTempWinner2(null); setShowConfirmDraw(false); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${activeWeek === w ? 'bg-amber-500 text-slate-950 shadow-lg scale-105' : 'bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800'}`}
          >
            {w}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">

        {isAdminUnlocked && (
          <div className="bg-gradient-to-b from-amber-950/40 to-slate-900/90 border-2 border-amber-500/50 p-6 rounded-2xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-amber-500/30 pb-3">
              <h2 className="text-lg font-black text-amber-400 flex items-center space-x-2">
                <span>🎰 Enarmet Banditt - Trekning ({activeWeek})</span>
              </h2>
              <button onClick={resetToInitial} className="text-xs bg-rose-950 hover:bg-rose-900 text-rose-300 px-3 py-1 rounded-lg border border-rose-800 font-bold">
                🔄 Tilbakestill alt
              </button>
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-6 py-2">
              <div className="bg-slate-950 border-4 border-amber-500/80 p-6 rounded-3xl shadow-2xl flex items-center space-x-6 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-amber-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full uppercase tracking-widest shadow-lg">
                  {isSpinning ? "🎰 TREKNING PÅGÅR..." : "KLAR TIL TREKNING"}
                </div>

                <div className="w-20 h-28 bg-black border-2 border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                  <span className={`text-6xl font-black font-mono text-amber-400 ${isSpinning ? 'animate-pulse' : ''}`}>
                    {slotDisplay.tens}
                  </span>
                </div>

                <div className="w-20 h-28 bg-black border-2 border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shadow-inner">
                  <span className={`text-6xl font-black font-mono text-amber-400 ${isSpinning ? 'animate-pulse' : ''}`}>
                    {slotDisplay.ones}
                  </span>
                </div>

                <div className="hidden md:flex flex-col items-center">
                  <div className="w-3 h-16 bg-slate-700 rounded-t-full border border-slate-600"></div>
                  <div className="w-8 h-8 bg-rose-600 rounded-full border-2 border-rose-400 shadow-lg -mt-2"></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button 
                  onClick={() => startSlotMachine(1)}
                  disabled={isSpinning}
                  className={`bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black px-6 py-3 rounded-xl text-sm shadow-xl transform active:scale-95 transition ${isSpinning ? 'opacity-50' : ''}`}
                >
                  {isSpinning ? "🎰 Snurrer..." : "🍾 TREKK FLASKE 1"}
                </button>

                <button 
                  onClick={() => startSlotMachine(2)}
                  disabled={isSpinning || !tempWinner1}
                  className={`bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-slate-950 font-black px-6 py-3 rounded-xl text-sm shadow-xl transform active:scale-95 transition ${(!tempWinner1 || isSpinning) ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  {isSpinning ? "🎰 Snurrer..." : "🍾 TREKK FLASKE 2"}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                <div className={`p-4 rounded-xl border text-center ${tempWinner1 ? 'bg-amber-950/40 border-amber-500' : 'bg-slate-950/50 border-slate-800'}`}>
                  <p className="text-xs font-bold text-amber-400 uppercase">Flaske 1 Vinner:</p>
                  <p className="text-lg font-black text-white">{tempWinner1 ? `${tempWinner1.owner} (Lodd #${tempWinner1.ticketNum})` : "Ikke trukket ennå"}</p>
                </div>

                <div className={`p-4 rounded-xl border text-center ${tempWinner2 ? 'bg-emerald-950/40 border-emerald-500' : 'bg-slate-950/50 border-slate-800'}`}>
                  <p className="text-xs font-bold text-emerald-400 uppercase">Flaske 2 Vinner:</p>
                  <p className="text-lg font-black text-white">{tempWinner2 ? `${tempWinner2.owner} (Lodd #${tempWinner2.ticketNum})` : "Ikke trukket ennå"}</p>
                </div>
              </div>

              {showConfirmDraw && tempWinner1 && tempWinner2 && (
                <div className="bg-amber-950/80 border-2 border-amber-400 p-6 rounded-2xl text-center space-y-3 max-w-lg shadow-2xl">
                  <h3 className="text-lg font-black text-amber-300">❓ Er denne trekningen endelig?</h3>
                  <p className="text-xs text-slate-300">
                    Vinnere for {activeWeek}:<br/>
                    <strong>Flaske 1:</strong> {tempWinner1.owner} (# {tempWinner1.ticketNum})<br/>
                    <strong>Flaske 2:</strong> {tempWinner2.owner} (# {tempWinner2.ticketNum})
                  </p>

                  <div className="flex justify-center space-x-3 pt-2">
                    <button 
                      onClick={() => { setTempWinner1(null); setTempWinner2(null); setShowConfirmDraw(false); }}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs"
                    >
                      🔄 Omkamp / Trekk på nytt
                    </button>
                    <button 
                      onClick={saveFinalWinners}
                      className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black px-6 py-2 rounded-xl text-xs shadow-lg"
                    >
                      ✅ Ja, godkjenn & lagre
                    </button>
                  </div>
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
              <div className="flex items-center space-x-1.5"><span className="w-3.5 h-3.5 rounded-md bg-emerald-950 border border-emerald-800"></span><span className="text-emerald-400 font-bold">Ledig</span></div>
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

              let boxStyle = "bg-emerald-950/40 border-emerald-800/80 text-emerald-400 hover:border-emerald-500 hover:bg-emerald-900/50";
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

      {/* REVEAL-MODAL MED DIN EGEN LYDFIL */}
      {revealModal.show && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border-4 border-amber-400 p-8 rounded-3xl w-full max-w-lg text-center space-y-6 shadow-[0_0_50px_rgba(251,191,36,0.3)]">
            
            <div className="text-5xl">🍷</div>
            
            {revealModal.stage === "drumroll" ? (
              <div className="space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
                  LODD #{revealModal.ticket} TRUKKET FOR FLASKE {revealModal.bottle}!
                </span>
                <h2 className="text-3xl font-black text-white italic">Og vinneren er...</h2>
                <p className="text-xs text-slate-400 italic">Lytt etter navnet...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  🎉 VINNER FLASKE {revealModal.bottle} 🎉
                </span>
                
                <div className="py-4 bg-slate-950/80 border border-amber-500/40 rounded-2xl shadow-inner">
                  <h2 className="text-4xl md:text-5xl font-black text-amber-300 drop-shadow-[0_0_15px_rgba(252,211,77,0.8)] tracking-tight">
                    {revealModal.name}
                  </h2>
                </div>

                <p className="text-sm font-bold text-slate-200">Lodd #{revealModal.ticket} i {activeWeek}</p>
                
                <button 
                  onClick={() => setRevealModal({ ...revealModal, show: false })}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 py-3 rounded-xl text-xs mt-4 shadow-lg transform active:scale-95 transition"
                >
                  Fortsett ➔
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* UKENS PREMIE MODAL */}
      {showPrizeModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-amber-500/30 p-6 rounded-2xl w-full max-w-2xl shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">{activeWeek}</span>
                <h2 className="text-2xl font-black text-white">{currentPrize.title || "2 Flasker Vin"}</h2>
              </div>
              <button 
                onClick={() => setShowPrizeModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold px-3.5 py-1.5 rounded-xl text-xs"
              >
                Lukk ✖
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-400 text-center uppercase">🍾 Flaske 1</p>
                <div className="h-60 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                  {currentPrize.image1 ? (
                    <img src={currentPrize.image1} alt="Flaske 1" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-600 text-sm">Ingen bilde av flaske 1</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-400 text-center uppercase">🍾 Flaske 2</p>
                <div className="h-60 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                  {currentPrize.image2 ? (
                    <img src={currentPrize.image2} alt="Flaske 2" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-slate-600 text-sm">Ingen bilde av flaske 2</div>
                  )}
                </div>
              </div>
            </div>

            {isAdminUnlocked && (
              <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-xl space-y-4">
                <p className="text-xs font-black text-amber-400 uppercase flex items-center space-x-1">
                  <span>📸 Admin: Ta bilde eller velg fil ({activeWeek})</span>
                </p>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-slate-400 font-bold block mb-1">Premietittel:</label>
                    <input 
                      type="text" 
                      placeholder="F.eks. 2 Flasker Marques de Chive..." 
                      value={currentPrize.title || ""} 
                      onChange={(e) => updatePrize(activeWeek, "title", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-300 block">📷 Ta bilde av Flaske 1:</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        onChange={(e) => handleImageUpload(activeWeek, "image1", e.target.files[0])}
                        className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-600 cursor-pointer w-full"
                      />
                    </div>

                    <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                      <span className="text-[10px] font-bold text-slate-300 block">📷 Ta bilde av Flaske 2:</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        capture="environment"
                        onChange={(e) => handleImageUpload(activeWeek, "image2", e.target.files[0])}
                        className="text-xs text-slate-400 file:mr-2 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-amber-500 file:text-slate-950 hover:file:bg-amber-600 cursor-pointer w-full"
                      />
                    </div>
                  </div>
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
                      <p className="text-sm font-bold text-white">{prize.title || "2 Flasker Vin"}</p>
                    </div>

                    <div className="flex-1 sm:text-right">
                      {isAdminUnlocked ? (
                        <input 
                          type="text" 
                          placeholder="Skriv inn vinner..." 
                          value={prize.winner || ""} 
                          onChange={(e) => updatePrize(week, "winner", e.target.value)}
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-400 font-bold w-full sm:w-64 text-left sm:text-right"
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
