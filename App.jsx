import React, { useState, useEffect, useRef } from 'react';

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

// HER ENDRER DU BILDESTIENE DERSOM DU HAR ANDRE NAVN PÅ BILDENE I PUBLIC-MAPPEN
const defaultPrizes = {
  "Uke 45": { title: "2 Flasker Utvalgt Vin", image1: "./vin1.jpg", image2: "./vin2.jpg", winner: "" },
  "Uke 46": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 47": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 48": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 49": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 50": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 51": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" }
};

const initialFeedback = [
  { id: 1, name: "Daniel", text: "Vinlotteriet er det beste lotteriet ever.", date: "Standard" },
  { id: 2, name: "Ingrid", text: "De andre vinner jo alltid.", date: "Standard" }
];

const initialBuyTips = [
  { id: 1, name: "Tore", tip: "Marqués de Chive Crianza", price: "130", date: "Standard" }
];

const initialExpenses = [
  { id: 1, text: "3 flasker tilsammen", amount: 650 }
];

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

  const [feedbackList, setFeedbackList] = useState(() => {
    try {
      const saved = localStorage.getItem('vinlotteri_feedback_v1');
      return saved ? JSON.parse(saved) : initialFeedback;
    } catch (e) {
      return initialFeedback;
    }
  });

  const [buyTipsList, setBuyTipsList] = useState(() => {
    try {
      const saved = localStorage.getItem('vinlotteri_buy_tips_v1');
      return saved ? JSON.parse(saved) : initialBuyTips;
    } catch (e) {
      return initialBuyTips;
    }
  });

  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem('vinlotteri_expenses_v1');
      return saved ? JSON.parse(saved) : initialExpenses;
    } catch (e) {
      return initialExpenses;
    }
  });

  const [activeWeek, setActiveWeek] = useState("Uke 45");
  const [buyerName, setBuyerName] = useState("");
  const [selectedTickets, setSelectedTickets] = useState({});
  
  const [newFeedbackText, setNewFeedbackText] = useState("");
  const [newTipText, setNewTipText] = useState("");
  const [newTipPrice, setNewTipPrice] = useState("");

  const [expenseText, setExpenseText] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  
  const [showVippsModal, setShowVippsModal] = useState(false);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [showWinnersModal, setShowWinnersModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showBuyTipsModal, setShowBuyTipsModal] = useState(false);
  const [showRegnskapAuthModal, setShowRegnskapAuthModal] = useState(false);
  
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [regnskapPasswordInput, setRegnskapPasswordInput] = useState("");
  const [adminError, setAdminError] = useState("");
  const [regnskapError, setRegnskapError] = useState("");
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [isRegnskapUnlocked, setIsRegnskapUnlocked] = useState(false);

  const [isSpinning, setIsSpinning] = useState(false);
  const [slotDisplay, setSlotDisplay] = useState({ tens: "0", ones: "0" });
  const [tempWinner1, setTempWinner1] = useState(null);
  const [tempWinner2, setTempWinner2] = useState(null);
  
  const [revealModal, setRevealModal] = useState({ show: false, bottle: 1, name: "", ticket: null, stage: "drumroll" });
  const [showConfirmDraw, setShowConfirmDraw] = useState(false);

  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio('./vinner.mp3.m4a');
    audioRef.current.load();
  }, []);

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

  useEffect(() => {
    try {
      localStorage.setItem('vinlotteri_feedback_v1', JSON.stringify(feedbackList));
    } catch (e) {}
  }, [feedbackList]);

  useEffect(() => {
    try {
      localStorage.setItem('vinlotteri_buy_tips_v1', JSON.stringify(buyTipsList));
    } catch (e) {}
  }, [buyTipsList]);

  useEffect(() => {
    try {
      localStorage.setItem('vinlotteri_expenses_v1', JSON.stringify(expenses));
    } catch (e) {}
  }, [expenses]);

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

  const handleAddFeedback = (e) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      alert("Vennligst skriv inn navnet ditt før du legger inn kommentar!");
      return;
    }
    if (!newFeedbackText.trim()) {
      alert("Skriv inn en kommentar først.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: buyerName.trim(),
      text: newFeedbackText.trim(),
      date: new Date().toLocaleDateString('no-NO', { hour: '2-digit', minute: '2-digit' })
    };

    setFeedbackList([newEntry, ...feedbackList]);
    setNewFeedbackText("");
  };

  const handleAddBuyTip = (e) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      alert("Vennligst skriv inn navnet ditt først!");
      return;
    }
    if (!newTipText.trim()) {
      alert("Skriv inn et tips til hva vi bør kjøpe.");
      return;
    }

    const newEntry = {
      id: Date.now(),
      name: buyerName.trim(),
      tip: newTipText.trim(),
      price: newTipPrice.trim(),
      date: new Date().toLocaleDateString('no-NO', { hour: '2-digit', minute: '2-digit' })
    };

    setBuyTipsList([newEntry, ...buyTipsList]);
    setNewTipText("");
    setNewTipPrice("");
  };

  const handleAddExpense = (e) => {
    e.preventDefault();
    if (!expenseText.trim() || !expenseAmount) return;
    const newExp = {
      id: Date.now(),
      text: expenseText.trim(),
      amount: parseFloat(expenseAmount) || 0
    };
    setExpenses([...expenses, newExp]);
    setExpenseText("");
    setExpenseAmount("");
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  // REKNESKAP BEREGNINGER
  const personTotals = {};
  let totalRevenue = 0;

  Object.values(weeklyData).forEach(weekObj => {
    Object.entries(weekObj).forEach(([person, tickets]) => {
      if (Array.isArray(tickets)) {
        const cost = tickets.length * TICKET_PRICE;
        personTotals[person] = (personTotals[person] || 0) + cost;
        totalRevenue += cost;
      }
    });
  });

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netBalance = totalRevenue - totalExpenses;

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
      setFeedbackList(initialFeedback);
      setBuyTipsList(initialBuyTips);
      setExpenses(initialExpenses);
      localStorage.removeItem('vinlotteri_fixed_v4');
      localStorage.removeItem('vinlotteri_prizes_v3');
      localStorage.removeItem('vinlotteri_feedback_v1');
      localStorage.removeItem('vinlotteri_buy_tips_v1');
      localStorage.removeItem('vinlotteri_expenses_v1');
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

  const handleRegnskapUnlock = (e) => {
    e.preventDefault();
    if (regnskapPasswordInput === "vinlotteri26") {
      setIsRegnskapUnlocked(true);
      setShowRegnskapAuthModal(false);
      setRegnskapPasswordInput("");
      setRegnskapError("");
    } else {
      setRegnskapError("Feil kode. Prøv igjen.");
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

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {});
    }

    setIsSpinning(true);
    setShowConfirmDraw(false);

    const winningTicket = pool[Math.floor(Math.random() * pool.length)];
    const winNumStr = winningTicket.ticketNum.toString().padStart(2, '0');

    let duration = 2000; 
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

        setRevealModal({ show: true, bottle: flaskeNummer, name: winningTicket.owner, ticket: winningTicket.ticketNum, stage: "drumroll" });
        
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {
            const alt = new Audio('./vinner.mp3');
            alt.play().catch(() => {});
          });
        }

        setTimeout(() => {
          setRevealModal(prev => ({ ...prev, stage: "winner" }));

          if (flaskeNummer === 1) {
            setTempWinner1(winningTicket);
          } else {
            setTempWinner2(winningTicket);
            setShowConfirmDraw(true);
          }
        }, 4500);
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
      
      {/* HEADER */}
      <header className="bg-[#0f172a] border-b border-slate-800 px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-3">
        <div className="flex items-center space-x-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="flex items-center space-x-2">
            <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30 text-amber-400 text-xl">🍷</div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Vinlotteriet</h1>
              <p className="text-[10px] text-slate-400">Lærerværelset • {TICKET_PRICE} kr/lodd</p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 text-xs sm:hidden">
            <span className="text-amber-400 font-bold">🎟️ {activeWeek}:</span>
            <span className="font-extrabold text-white">{soldCountInActiveWeek}/{MAX_TICKETS}</span>
          </div>
        </div>

        {/* TOPPMENY */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <button 
            onClick={() => setShowBuyTipsModal(true)}
            className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1"
          >
            <span>🍷</span>
            <span>Kjøpetips</span>
          </button>

          <button 
            onClick={() => setShowFeedbackModal(true)}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-400 font-bold text-xs px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1"
          >
            <span>💬</span>
            <span>Ris & ros</span>
          </button>

          <button 
            onClick={() => setShowQRModal(true)}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-bold text-xs px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1"
          >
            <span>📱</span>
            <span>QR</span>
          </button>

          <button 
            onClick={() => setShowPrizeModal(true)}
            className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1"
          >
            <span>🍾</span>
            <span>Premier</span>
          </button>

          <button 
            onClick={() => setShowWinnersModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl whitespace-nowrap shadow-md flex items-center space-x-1"
          >
            <span>🏆</span>
            <span>Vinnere</span>
          </button>

          <div className="hidden sm:flex bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl items-center space-x-2 text-xs">
            <span className="text-amber-400 font-bold">🎟️ {activeWeek}:</span>
            <span className="font-extrabold text-white">{soldCountInActiveWeek} / {MAX_TICKETS}</span>
          </div>

          <button 
            onClick={() => {
              if (isAdminUnlocked) {
                setIsAdminUnlocked(false);
                setIsRegnskapUnlocked(false);
              } else {
                setShowAdminModal(true);
              }
            }}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold px-2.5 py-1.5 rounded-xl text-slate-300 whitespace-nowrap"
          >
            {isAdminUnlocked ? "🔓 Admin" : "⚙️ Admin"}
          </button>
        </div>
      </header>

      {/* UKE-VELGER */}
      <div className="bg-[#0f172a]/70 border-b border-slate-800 px-4 py-2.5 flex items-center space-x-2 overflow-x-auto scrollbar-none">
        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider mr-1 whitespace-nowrap">Uke:</span>
        {weeksList.map(w => (
          <button 
            key={w}
            onClick={() => { setActiveWeek(w); setTempWinner1(null); setTempWinner2(null); setShowConfirmDraw(false); }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${activeWeek === w ? 'bg-amber-500 text-slate-950 shadow-md scale-105' : 'bg-slate-900 border border-slate-800 text-slate-300'}`}
          >
            {w}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto p-3 sm:p-6 space-y-4 sm:space-y-6">

        {/* ADMIN SEKSJON: TREKNING OG REKNSKAP */}
        {isAdminUnlocked && (
          <div className="space-y-4 sm:space-y-6">
            
            {/* 1. TREKNING */}
            <div className="bg-gradient-to-b from-amber-950/40 to-slate-900/90 border-2 border-amber-500/50 p-4 sm:p-6 rounded-2xl shadow-2xl space-y-4 sm:space-y-6">
              <div className="flex justify-between items-center border-b border-amber-500/30 pb-2">
                <h2 className="text-sm sm:text-lg font-black text-amber-400 flex items-center space-x-2">
                  <span>🎰 Trekning ({activeWeek})</span>
                </h2>
                <button onClick={resetToInitial} className="text-[10px] sm:text-xs bg-rose-950 text-rose-300 px-2 py-1 rounded-lg border border-rose-800 font-bold">
                  🔄 Tilbakestill alt
                </button>
              </div>
              
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="bg-slate-950 border-2 sm:border-4 border-amber-500/80 p-4 sm:p-6 rounded-2xl shadow-2xl flex items-center space-x-4 relative">
                  <div className="w-16 h-22 sm:w-20 sm:h-28 bg-black border border-slate-800 rounded-xl flex items-center justify-center">
                    <span className={`text-4xl sm:text-6xl font-black font-mono text-amber-400 ${isSpinning ? 'animate-pulse' : ''}`}>
                      {slotDisplay.tens}
                    </span>
                  </div>

                  <div className="w-16 h-22 sm:w-20 sm:h-28 bg-black border border-slate-800 rounded-xl flex items-center justify-center">
                    <span className={`text-4xl sm:text-6xl font-black font-mono text-amber-400 ${isSpinning ? 'animate-pulse' : ''}`}>
                      {slotDisplay.ones}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-4 justify-center w-full">
                  <button 
                    onClick={() => startSlotMachine(1)}
                    disabled={isSpinning}
                    className={`flex-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-lg ${isSpinning ? 'opacity-50' : ''}`}
                  >
                    🍾 FLASKE 1
                  </button>

                  <button 
                    onClick={() => startSlotMachine(2)}
                    disabled={isSpinning || !tempWinner1}
                    className={`flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs sm:text-sm shadow-lg ${(!tempWinner1 || isSpinning) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    🍾 FLASKE 2
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 w-full text-xs">
                  <div className={`p-2.5 rounded-xl border text-center ${tempWinner1 ? 'bg-amber-950/40 border-amber-500' : 'bg-slate-950/50 border-slate-800'}`}>
                    <p className="text-[10px] font-bold text-amber-400 uppercase">Flaske 1:</p>
                    <p className="font-extrabold text-white truncate">{tempWinner1 ? `${tempWinner1.owner} (#${tempWinner1.ticketNum})` : "-"}</p>
                  </div>

                  <div className={`p-2.5 rounded-xl border text-center ${tempWinner2 ? 'bg-emerald-950/40 border-emerald-500' : 'bg-slate-950/50 border-slate-800'}`}>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase">Flaske 2:</p>
                    <p className="font-extrabold text-white truncate">{tempWinner2 ? `${tempWinner2.owner} (#${tempWinner2.ticketNum})` : "-"}</p>
                  </div>
                </div>

                {showConfirmDraw && tempWinner1 && tempWinner2 && (
                  <div className="bg-amber-950/80 border-2 border-amber-400 p-4 rounded-2xl text-center space-y-2 w-full shadow-2xl">
                    <h3 className="text-sm font-black text-amber-300">Godkjenn trekning for {activeWeek}?</h3>
                    <div className="flex justify-center space-x-2 pt-1">
                      <button onClick={() => { setTempWinner1(null); setTempWinner2(null); setShowConfirmDraw(false); }} className="bg-slate-800 text-slate-300 font-bold px-3 py-1.5 rounded-xl text-xs">Omkamp</button>
                      <button onClick={saveFinalWinners} className="bg-emerald-500 text-slate-950 font-black px-4 py-1.5 rounded-xl text-xs shadow-lg">✅ Godkjenn</button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. REKNSKAP OG BALANSE (SKJULT BAK KODE) */}
            <div className="bg-[#0f172a] border-2 border-slate-700 p-4 sm:p-6 rounded-2xl shadow-xl space-y-4">
              <div className="border-b border-slate-800 pb-2 flex justify-between items-center">
                <h2 className="text-base font-black text-amber-400 flex items-center space-x-2">
                  <span>📊 Regnskap & Økonomi</span>
                </h2>
                {isRegnskapUnlocked && (
                  <button 
                    onClick={() => setIsRegnskapUnlocked(false)} 
                    className="text-[10px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-lg border border-slate-700 font-bold"
                  >
                    🔒 Skjul regnskap
                  </button>
                )}
              </div>

              {!isRegnskapUnlocked ? (
                <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-3">
                  <div className="text-3xl">🔒</div>
                  <h3 className="text-sm font-bold text-white">Regnskapet er skjult under trekning</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Trykk på knappen under og oppgi adminkoden for å se inntekter, utgifter og balanse.
                  </p>
                  <button 
                    onClick={() => setShowRegnskapAuthModal(true)}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-black px-5 py-2.5 rounded-xl text-xs shadow-lg transition"
                  >
                    🔐 Åpne Regnskap & Økonomi
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* INNTEKTER PR PERSON */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2">
                      <p className="text-xs font-bold text-emerald-400 uppercase flex justify-between">
                        <span>💵 Innbetalinger pr. person:</span>
                      </p>
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
                        {Object.entries(personTotals).length > 0 ? (
                          Object.entries(personTotals).map(([person, amount]) => (
                            <div key={person} className="flex justify-between items-center border-b border-slate-900 pb-1">
                              <span className="text-slate-200 font-medium">{person}</span>
                              <span className="font-mono font-bold text-emerald-400">{amount} kr</span>
                            </div>
                          ))
                        ) : (
                          <p className="text-slate-600 italic">Ingen lodd solgt ennå.</p>
                        )}
                      </div>
                      <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-xs text-white">
                        <span>Totalt innbetalt:</span>
                        <span className="text-emerald-400 font-mono">{totalRevenue} kr</span>
                      </div>
                    </div>

                    {/* KJØP AV PREMIER (UTGIFTER) */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
                      <p className="text-xs font-bold text-rose-400 uppercase">🛍️ Innkjøp av premier (Utgifter):</p>
                      
                      <form onSubmit={handleAddExpense} className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="F.eks. 3 flasker" 
                          value={expenseText}
                          onChange={(e) => setExpenseText(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
                        />
                        <input 
                          type="number" 
                          placeholder="Kr" 
                          value={expenseAmount}
                          onChange={(e) => setExpenseAmount(e.target.value)}
                          className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                        />
                        <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-2 rounded-lg text-xs">+</button>
                      </form>

                      <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 text-xs">
                        {expenses.map(exp => (
                          <div key={exp.id} className="flex justify-between items-center border-b border-slate-900 pb-1">
                            <span className="text-slate-300">{exp.text}</span>
                            <div className="flex items-center space-x-2">
                              <span className="font-mono font-bold text-rose-400">{exp.amount} kr</span>
                              <button onClick={() => handleDeleteExpense(exp.id)} className="text-slate-600 hover:text-rose-400 font-bold">✖</button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-800 flex justify-between font-black text-xs text-white">
                        <span>Totalt brukt på premier:</span>
                        <span className="text-rose-400 font-mono">{totalExpenses} kr</span>
                      </div>
                    </div>

                  </div>

                  {/* ENDELIG BALANSE */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Status Økonomi / Balanse:</p>
                      <p className="text-[11px] text-slate-500">Inntekter ({totalRevenue} kr) - Utgifter ({totalExpenses} kr)</p>
                    </div>
                    <div className={`text-xl font-black font-mono px-4 py-1.5 rounded-xl border ${netBalance >= 0 ? 'bg-emerald-950/60 border-emerald-500 text-emerald-400' : 'bg-rose-950/60 border-rose-500 text-rose-400'}`}>
                      {netBalance >= 0 ? `+${netBalance} kr (Overskudd)` : `${netBalance} kr (Underskudd)`}
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

        {/* BRUKER / VIPPS BOKS */}
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="w-full sm:w-auto">
              <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ditt Navn:</label>
              <input 
                type="text" 
                placeholder="Skriv navnet ditt her..." 
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-between sm:justify-end items-center gap-3 pt-1 sm:pt-0">
              <div className="text-left sm:text-right">
                <p className="text-[10px] text-slate-400">Valgt totalt:</p>
                <p className="text-sm sm:text-base font-black text-amber-400">{totalSelectedCount} lodd ({totalSelectedCount * TICKET_PRICE} kr)</p>
              </div>

              <button 
                onClick={handleProceedToVipps}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2.5 rounded-xl transition shadow-lg text-xs sm:text-sm whitespace-nowrap"
              >
                Vipps ➔
              </button>
            </div>
          </div>
        </div>

        {/* LODD RUTENETT */}
        <div className="bg-[#0f172a] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center space-x-1">
              <span>🎟️ Lodd for</span>
              <span className="text-amber-400 font-extrabold">{activeWeek}</span>
            </h2>
            <div className="flex items-center space-x-2 text-[10px]">
              <span className="text-emerald-400">🟢 Ledig</span>
              <span className="text-amber-400">🟡 Valgt</span>
              <span className="text-rose-400">🔴 Solgt</span>
            </div>
          </div>

          <div className="grid grid-cols-5 sm:grid-cols-9 gap-1.5 sm:gap-2.5">
            {Array.from({ length: MAX_TICKETS }, (_, i) => i + 1).map(num => {
              const owner = getTicketOwner(activeWeek, num);
              const isSelectedByMe = (selectedTickets[activeWeek] || []).includes(num);

              let boxStyle = "bg-emerald-950/40 border-emerald-800/80 text-emerald-400 hover:border-emerald-500";
              if (owner) {
                boxStyle = "bg-rose-950/30 border-rose-900/50 text-rose-300 cursor-not-allowed";
              } else if (isSelectedByMe) {
                boxStyle = "bg-amber-500 border-amber-400 text-slate-950 font-black shadow-md scale-105";
              }

              return (
                <button
                  key={num}
                  onClick={() => handleTicketClick(num)}
                  className={`h-16 sm:h-20 rounded-xl border p-1.5 flex flex-col justify-between items-start transition ${boxStyle}`}
                >
                  <span className="text-xs sm:text-base font-black">#{num}</span>
                  <span className="text-[9px] sm:text-[11px] truncate w-full text-left font-medium opacity-90">
                    {owner ? owner : isSelectedByMe ? "Valgt" : "Ledig"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </main>

      {/* REGNSKAP AUTENTISERING MODAL */}
      {showRegnskapAuthModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl w-full max-w-xs shadow-2xl space-y-3">
            <h2 className="text-base font-bold text-amber-400 text-center">🔐 Lås opp regnskap</h2>
            <form onSubmit={handleRegnskapUnlock} className="space-y-3">
              <input 
                type="password" 
                placeholder="Skriv inn adminkode..." 
                value={regnskapPasswordInput} 
                onChange={(e) => setRegnskapPasswordInput(e.target.value)} 
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-center font-mono text-sm focus:outline-none focus:border-amber-500" 
              />
              {regnskapError && <p className="text-rose-400 text-xs text-center">{regnskapError}</p>}
              <div className="flex space-x-2">
                <button type="button" onClick={() => setShowRegnskapAuthModal(false)} className="w-1/2 bg-slate-800 text-slate-300 font-bold py-2 rounded-xl text-xs">Avbryt</button>
                <button type="submit" className="w-1/2 bg-rose-600 text-white font-black py-2 rounded-xl text-xs shadow-md">Lås opp</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KJØPETIPS MODAL */}
      {showBuyTipsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 z-50">
          <div className="bg-[#0f172a] border border-amber-500/30 p-5 rounded-2xl w-full max-w-lg shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-base font-black text-amber-400 flex items-center space-x-1">
                <span>🍷 Kjøpetips til Vingeneralen</span>
              </h2>
              <button onClick={() => setShowBuyTipsModal(false)} className="bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-xl text-xs">Lukk ✖</button>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/30 p-3.5 rounded-xl text-xs text-slate-200 leading-relaxed">
              Vinlotteriet er stadig på utkikk etter vin av beste kvalitet og nå kan du være med å bidra. Legg igjen tips til gode viner, cider eller til og med øl som du mener burde være i premiepotten.
            </div>

            <form onSubmit={handleAddBuyTip} className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ditt Navn:</label>
                <input 
                  type="text" 
                  placeholder="Skriv navnet ditt her..." 
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Tips til hva en kan kjøpe:</label>
                  <input 
                    type="text" 
                    placeholder="F.eks. Faustino I Gran Reserva..." 
                    value={newTipText} 
                    onChange={(e) => setNewTipText(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Pris (kr):</label>
                  <input 
                    type="text" 
                    placeholder="Ca. kr..." 
                    value={newTipPrice} 
                    onChange={(e) => setNewTipPrice(e.target.value)} 
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-2 rounded-xl text-xs shadow-md">Send kjøpetips 🍷</button>
            </form>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {buyTipsList.map(item => (
                <div key={item.id} className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-amber-400">{item.name}</span>
                    <span className="text-slate-500">{item.date}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <p className="text-slate-200 font-bold">🍾 {item.tip}</p>
                    {item.price && <span className="bg-emerald-950 text-emerald-400 font-extrabold px-2 py-0.5 rounded-md text-[10px] border border-emerald-800">{item.price} kr</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* RIS & ROS MODAL */}
      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 z-50">
          <div className="bg-[#0f172a] border border-amber-500/30 p-5 rounded-2xl w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-base font-black text-amber-400">💬 Ris & Ros</h2>
              <button onClick={() => setShowFeedbackModal(false)} className="bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-xl text-xs">Lukk ✖</button>
            </div>

            <form onSubmit={handleAddFeedback} className="space-y-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Ditt Navn:</label>
                <input 
                  type="text" 
                  placeholder="Skriv navnet ditt her..." 
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Kommentar:</label>
                <textarea 
                  rows="2" 
                  placeholder="Skriv en ros eller litt ris her..." 
                  value={newFeedbackText} 
                  onChange={(e) => setNewFeedbackText(e.target.value)} 
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              <button type="submit" className="w-full bg-amber-500 text-slate-950 font-black py-2 rounded-xl text-xs shadow-md">Send kommentar 💬</button>
            </form>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {feedbackList.map(item => (
                <div key={item.id} className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl space-y-0.5">
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-amber-400">{item.name}</span>
                    <span className="text-slate-500">{item.date}</span>
                  </div>
                  <p className="text-xs text-slate-200 italic">"{item.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* QR-KODE MODAL */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-amber-500/40 p-5 rounded-3xl w-full max-w-xs text-center space-y-3 shadow-2xl">
            <h2 className="text-lg font-black text-amber-400">📱 Scan Koden</h2>
            <div className="bg-white p-3 rounded-2xl inline-block shadow-inner">
              <img src="./qr.jpg" alt="QR Kode" className="w-48 h-48 mx-auto object-contain" />
            </div>
            <button onClick={() => setShowQRModal(false)} className="bg-slate-800 text-slate-300 font-bold px-4 py-2 rounded-xl text-xs w-full">Lukk ✖</button>
          </div>
        </div>
      )}

      {/* REVEAL-MODAL */}
      {revealModal.show && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border-2 sm:border-4 border-amber-400 p-6 sm:p-8 rounded-3xl w-full max-w-md text-center space-y-4 shadow-2xl">
            <div className="text-4xl sm:text-5xl">🍷</div>
            {revealModal.stage === "drumroll" ? (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">LODD #{revealModal.ticket} TRUKKET!</span>
                <h2 className="text-2xl sm:text-3xl font-black text-white italic">Og vinneren er...</h2>
              </div>
            ) : (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">🎉 VINNER FLASKE {revealModal.bottle} 🎉</span>
                <div className="py-3 bg-slate-950/80 border border-amber-500/40 rounded-2xl shadow-inner">
                  <h2 className="text-3xl sm:text-5xl font-black text-amber-300 tracking-tight">{revealModal.name}</h2>
                </div>
                <p className="text-xs font-bold text-slate-200">Lodd #{revealModal.ticket} i {activeWeek}</p>
                <button onClick={() => setRevealModal({ ...revealModal, show: false })} className="bg-amber-500 text-slate-950 font-black px-6 py-2.5 rounded-xl text-xs shadow-lg">Fortsett ➔</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* UKENS PREMIE MODAL */}
      {showPrizeModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 z-50">
          <div className="bg-[#0f172a] border border-amber-500/30 p-5 rounded-2xl w-full max-w-xl shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div>
                <span className="text-[10px] font-bold text-amber-400 uppercase">{activeWeek}</span>
                <h2 className="text-lg font-black text-white">{currentPrize.title || "2 Flasker Vin"}</h2>
              </div>
              <button onClick={() => setShowPrizeModal(false)} className="bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-xl text-xs">Lukk ✖</button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-amber-400 text-center uppercase">Flaske 1</p>
                <div className="h-40 sm:h-52 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                  {currentPrize.image1 ? <img src={currentPrize.image1} alt="Flaske 1" className="w-full h-full object-cover" /> : <div className="text-slate-600 text-xs">Ingen bilde</div>}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-[10px] font-bold text-amber-400 text-center uppercase">Flaske 2</p>
                <div className="h-40 sm:h-52 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex items-center justify-center">
                  {currentPrize.image2 ? <img src={currentPrize.image2} alt="Flaske 2" className="w-full h-full object-cover" /> : <div className="text-slate-600 text-xs">Ingen bilde</div>}
                </div>
              </div>
            </div>

            {isAdminUnlocked && (
              <div className="p-3 bg-slate-950 border border-amber-500/40 rounded-xl space-y-3 text-xs">
                <p className="font-black text-amber-400 uppercase">📸 Admin: Ta bilde ({activeWeek})</p>
                <input type="text" placeholder="Premietittel..." value={currentPrize.title || ""} onChange={(e) => updatePrize(activeWeek, "title", e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="file" accept="image/*" capture="environment" onChange={(e) => handleImageUpload(activeWeek, "image1", e.target.files[0])} className="text-[10px] text-slate-400" />
                  <input type="file" accept="image/*" capture="environment" onChange={(e) => handleImageUpload(activeWeek, "image2", e.target.files[0])} className="text-[10px] text-slate-400" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VINNERE MODAL */}
      {showWinnersModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 z-50">
          <div className="bg-[#0f172a] border border-amber-500/30 p-5 rounded-2xl w-full max-w-lg shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <h2 className="text-lg font-black text-amber-400">🏆 Vinnere (Uke 45–51)</h2>
              <button onClick={() => setShowWinnersModal(false)} className="bg-slate-800 text-slate-300 font-bold px-3 py-1 rounded-xl text-xs">Lukk ✖</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {weeksList.map(week => {
                const prize = prizes[week] || {};
                return (
                  <div key={week} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-black text-amber-400 uppercase block text-[10px]">{week}</span>
                      <p className="font-bold text-white text-xs">{prize.title || "2 Flasker Vin"}</p>
                    </div>
                    <div className="text-right">
                      {isAdminUnlocked ? (
                        <input type="text" placeholder="Vinner..." value={prize.winner || ""} onChange={(e) => updatePrize(week, "winner", e.target.value)} className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400 font-bold w-32" />
                      ) : (
                        <p className={`font-black ${prize.winner ? 'text-emerald-400' : 'text-slate-600 italic'}`}>{prize.winner ? `🎉 ${prize.winner}` : "Ikke trukket"}</p>
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
          <div className="bg-[#0f172a] border border-slate-800 p-5 rounded-2xl w-full max-w-xs shadow-2xl space-y-3">
            <h2 className="text-base font-bold text-amber-400 text-center">🔒 Admin Innlogging</h2>
            <form onSubmit={handleAdminUnlock} className="space-y-3">
              <input type="password" placeholder="Adminkode..." value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-center font-mono text-sm focus:outline-none focus:border-amber-500" />
              {adminError && <p className="text-rose-400 text-xs text-center">{adminError}</p>}
              <div className="flex space-x-2">
                <button type="button" onClick={() => setShowAdminModal(false)} className="w-1/2 bg-slate-800 text-slate-300 font-bold py-2 rounded-xl text-xs">Avbryt</button>
                <button type="submit" className="w-1/2 bg-amber-500 text-slate-950 font-black py-2 rounded-xl text-xs shadow-md">Lås opp</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIPPS MODAL */}
      {showVippsModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f172a] border border-amber-500/40 p-5 rounded-2xl w-full max-w-xs shadow-2xl text-center space-y-3">
            <div className="text-3xl">📱</div>
            <h2 className="text-lg font-black text-amber-400">Husk å Vippse!</h2>
            <p className="text-slate-300 text-xs">
              Reserverer <strong>{totalSelectedCount} lodd</strong> for <strong>{buyerName}</strong>.<br/>
              Sum: <strong className="text-emerald-400">{totalSelectedCount * TICKET_PRICE} kr</strong>.
            </p>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-left text-[11px] text-slate-300 space-y-1">
              <p className="font-bold text-amber-400">Slik gjør du det:</p>
              <p>1. Send <strong>{totalSelectedCount * TICKET_PRICE} kr</strong> til <strong>Tore Farestad Lie (41406582)</strong> i Vipps.</p>
              <p>2. Trykk bekreft under.</p>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => setShowVippsModal(false)} className="w-1/2 bg-slate-800 text-slate-300 font-bold py-2.5 rounded-xl text-xs">Avbryt</button>
              <button onClick={confirmPurchase} className="w-1/2 bg-emerald-500 text-slate-950 font-black py-2.5 rounded-xl text-xs shadow-lg">Vippset!</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
