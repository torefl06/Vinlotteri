import React, { useState, useEffect } from 'react';

// Nøye mappenavn og loddnummer basert på rad 1-25 og rad 26-45 i Excel-arket
const initialWeeklyData = {
  "Uke 45": {
    "Pål E": [1, 16, 23],
    "Trine": [2, 12],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 28],
    "Charlotte": [5],
    "Hege": [6, 24, 26],
    "Frode": [7],
    "Ingrid": [8, 14],
    "Normi": [9],
    "Tore": [10, 19],
    "Daniel": [11, 21],
    "Karoline": [13],
    "Gro": [15, 25],
    "Jannicke": [29],
    "Alexander": [18, 20],
    "Ingvild": [18], // sjekk
    "Ebbe": [22],
    "Kristian": [30],
    "Rene G": [44, 45]
  },
  "Uke 46": {
    "Charlotte": [2],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 28],
    "Ingrid": [5, 14],
    "Hege": [6, 24, 26],
    "Frode": [7],
    "Jannicke": [8, 29],
    "Tore": [10, 19],
    "Daniel": [11, 21],
    "Trine": [12],
    "Normi": [13],
    "Gro": [15],
    "Pål E": [16, 23],
    "Alexander": [18, 20],
    "Ingvild": [18],
    "Karoline": [22],
    "Ebbe": [23], // sjekk
    "Rene G": [44, 45]
  },
  "Uke 47": {
    "Pål E": [2, 16, 23],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 28],
    "Frode": [5],
    "Hege": [6, 24, 26],
    "Ingrid": [7, 14],
    "Charlotte": [8, 27],
    "Gro": [9, 15],
    "Tore": [10, 19],
    "Daniel": [11, 21],
    "Trine": [12],
    "Normi": [13],
    "Ingvild": [15],
    "Jannicke": [16, 29],
    "Alexander": [18, 20],
    "Karoline": [22],
    "Ebbe": [23],
    "Rene G": [44, 45]
  },
  "Uke 48": {
    "Trine": [2],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 28],
    "Frode": [5],
    "Hege": [6, 24, 26],
    "Karoline": [7],
    "Jannicke": [8, 29],
    "Ingrid": [9, 14],
    "Tore": [10, 19],
    "Daniel": [11, 21],
    "Normi": [13],
    "Pål E": [16, 23],
    "Alexander": [18, 20],
    "Ingvild": [18],
    "Ebbe": [23],
    "Charlotte": [27],
    "Rene G": [44, 45]
  },
  "Uke 49": {
    "Pål E": [1, 16, 23],
    "Trine": [2],
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 28],
    "Frode": [5],
    "Hege": [6, 24, 26],
    "Karoline": [7],
    "Ingrid": [8, 14],
    "Tore": [10, 19],
    "Daniel": [11, 21],
    "Normi": [13],
    "Ingvild": [15],
    "Jannicke": [16, 29],
    "Alexander": [18, 20],
    "Ebbe": [23],
    "Charlotte": [27],
    "Rene G": [44, 45]
  },
  "Uke 50": {
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 28],
    "Frode": [5],
    "Hege": [6, 24, 26],
    "Ingrid": [7, 14],
    "Jannicke": [8, 29],
    "Normi": [9],
    "Tore": [10, 19],
    "Daniel": [11, 21],
    "Trine": [12],
    "Karoline": [13],
    "Gro": [15],
    "Pål E": [16, 23],
    "Alexander": [18, 20],
    "Ingvild": [18],
    "Ebbe": [23],
    "Charlotte": [27],
    "Rene G": [44, 45]
  },
  "Uke 51": {
    "Laila Martine": [3, 17],
    "Elisabeth T": [4, 28],
    "Hege": [6, 24, 26],
    "Karoline": [7, 12],
    "Normi": [8],
    "Ingrid": [9, 14],
    "Tore": [10, 19],
    "Daniel": [11, 21],
    "Gro": [15],
    "Pål E": [16, 23],
    "Alexander": [18, 20],
    "Ingvild": [18],
    "Ebbe": [23],
    "Charlotte": [27],
    "Jannicke": [29],
    "Rene G": [44, 45]
  }
};

// Bygg en perfekt 1-45 struktur basert på bildet
const parseExcelImageStructure = () => {
  const weeks = ["Uke 45", "Uke 46", "Uke 47", "Uke 48", "Uke 49", "Uke 50", "Uke 51"];
  
  // Rader fra 1 til 45 fra bildene
  const rows = [
    ["Pål E", "", "Pål E", "", "Pål E", "", ""], // Rad 1 (#1)
    ["Trine", "Charlotte", "Pål E", "Trine", "Trine", "", ""], // Rad 2 (#2)
    ["Laila Martine", "Laila Martine", "Laila Martine", "Laila Martine", "Laila Martine", "Laila Martine", "Laila Martine"], // Rad 3 (#3)
    ["Elisabeth T", "Elisabeth T", "Elisabeth T", "Elisabeth T", "Elisabeth T", "Elisabeth T", "Elisabeth T"], // Rad 4 (#4)
    ["Charlotte", "Ingrid", "Frode", "Frode", "Frode", "Frode", ""], // Rad 5 (#5)
    ["Hege", "Hege", "Hege", "Hege", "Hege", "Hege", "Hege"], // Rad 6 (#6)
    ["Frode", "Frode", "Ingrid", "Karoline", "Karoline", "Ingrid", "Karoline"], // Rad 7 (#7)
    ["Ingrid", "Jannicke", "Charlotte", "Jannicke", "Ingrid", "Jannicke", "Normi"], // Rad 8 (#8)
    ["Normi", "", "Gro", "Ingrid", "", "Normi", "Ingrid"], // Rad 9 (#9)
    ["Tore", "Tore", "Tore", "Tore", "Tore", "Tore", "Tore"], // Rad 10 (#10)
    ["Daniel", "Daniel", "Daniel", "Daniel", "Daniel", "Daniel", "Daniel"], // Rad 11 (#11)
    ["Karoline", "Trine", "Trine", "", "", "Trine", "Karoline"], // Rad 12 (#12)
    ["Karoline", "Normi", "Normi", "Normi", "Normi", "Karoline", ""], // Rad 13 (#13)
    ["Ingrid", "Ingrid", "Ingrid", "Ingrid", "Ingrid", "Ingrid", "Ingrid"], // Rad 14 (#14)
    ["Gro", "Gro", "Ingvild", "", "Ingvild", "Gro", "Gro"], // Rad 15 (#15)
    ["Jannicke", "Pål E", "Jannicke", "Pål E", "Jannicke", "Pål E", "Pål E"], // Rad 16 (#16)
    ["Laila Martine", "Laila Martine", "Laila Martine", "Laila Martine", "Laila Martine", "Laila Martine", "Laila Martine"], // Rad 17 (#17)
    ["Alexander", "Alexander", "Alexander", "Alexander", "Alexander", "Alexander", "Alexander"], // Rad 18 (#18)
    ["Ingvild", "Ingvild", "Ingvild", "Ingvild", "Ingvild", "Ingvild", "Ingvild"], // Rad 19 (#19)
    ["Tore", "Tore", "Tore", "Tore", "Tore", "Tore", "Tore"], // Rad 20 (#20)
    ["Alexander", "Alexander", "Alexander", "Alexander", "Alexander", "Alexander", "Alexander"], // Rad 21 (#21)
    ["Daniel", "Daniel", "Daniel", "Daniel", "Daniel", "Daniel", "Daniel"], // Rad 22 (#22)
    ["", "Karoline", "Karoline", "", "", "", ""], // Rad 23 (#23)
    ["Pål E", "Pål E", "Pål E", "Pål E", "Pål E", "Pål E", "Pål E"], // Rad 24 (#24)
    ["Ebbe", "Ebbe", "Ebbe", "Ebbe", "Ebbe", "Ebbe", "Ebbe"], // Rad 25 (#25)
    ["Hege", "Hege", "Hege", "Hege", "Hege", "Hege", "Hege"], // Rad 26 (#26)
    ["", "", "", "", "", "", ""], // Rad 27 (#27)
    ["Gro", "", "", "Charlotte", "Charlotte", "Charlotte", "Charlotte"], // Rad 28 (#28)
    ["Elisabeth T", "Elisabeth T", "Elisabeth T", "Elisabeth T", "Elisabeth T", "Elisabeth T", "Elisabeth T"], // Rad 29 (#29)
    ["Jannicke", "Jannicke", "Jannicke", "Jannicke", "Jannicke", "Jannicke", "Jannicke"], // Rad 30 (#30)
    ["Kristian", "", "", "", "", "", ""], // Rad 31 (#31)
    ["", "", "", "", "", "", ""], // Rad 32 (#32)
    ["", "", "", "", "", "", ""], // Rad 33 (#33)
    ["", "", "", "", "", "", ""], // Rad 34 (#34)
    ["", "", "", "", "", "", ""], // Rad 35 (#35)
    ["", "", "", "", "", "", ""], // Rad 36 (#36)
    ["", "", "", "", "", "", ""], // Rad 37 (#37)
    ["", "", "", "", "", "", ""], // Rad 38 (#38)
    ["", "", "", "", "", "", ""], // Rad 39 (#39)
    ["", "", "", "", "", "", ""], // Rad 40 (#40)
    ["", "", "", "", "", "", ""], // Rad 41 (#41)
    ["", "", "", "", "", "", ""], // Rad 42 (#42)
    ["", "", "", "", "", "", ""], // Rad 43 (#43)
    ["Rene G", "Rene G", "Rene G", "Rene G", "Rene G", "Rene G", "Rene G"], // Rad 44 (#44)
    ["Rene G", "Rene G", "Rene G", "Rene G", "Rene G", "Rene G", "Rene G"]  // Rad 45 (#45)
  ];

  const result = {};
  weeks.forEach((w, wIndex) => {
    result[w] = {};
    rows.forEach((row, rIndex) => {
      const ticketNum = rIndex + 1;
      const name = row[wIndex];
      if (name && name.trim() !== "") {
        if (!result[w][name]) result[w][name] = [];
        result[w][name].push(ticketNum);
      }
    });
  });
  return result;
};

const exactDataFromImage = parseExcelImageStructure();

const weeksList = ["Uke 45", "Uke 46", "Uke 47", "Uke 48", "Uke 49", "Uke 50", "Uke 51"];
const TICKET_PRICE = 10;
const MAX_TICKETS = 45;

export default function App() {
  const [weeklyData, setWeeklyData] = useState(() => {
    try {
      const saved = localStorage.getItem('vinlotteri_exact_v3');
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
      localStorage.setItem('vinlotteri_exact_v3', JSON.stringify(weeklyData));
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
    if (window.confirm("Vil du tilbakestille loddene til bildenes opprinnelige rekkefølge?")) {
      setWeeklyData(exactDataFromImage);
      localStorage.removeItem('vinlotteri_exact_v3');
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

        <div className="bg-[#0f172a] p-6 rounded-2xl border border-
