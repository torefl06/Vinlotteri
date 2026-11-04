import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Ticket, 
  Settings, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  QrCode, 
  Wine, 
  Sparkles, 
  Calendar,
  AlertTriangle,
  Upload,
  UserCheck,
  Palmtree
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('buy');
  
  // App state
  const [ticketPrice, setTicketPrice] = useState(10);
  const [vippsNumber, setVippsNumber] = useState('41406582');
  const [currentWeekNum, setCurrentWeekNum] = useState(45);
  
  // Multi-week setup
  const [selectedWeek, setSelectedWeek] = useState(45);
  const [weeksToBuy, setWeeksToBuy] = useState(5);
  const [vacationWeeks, setVacationWeeks] = useState([]); // List of week numbers marked as holiday
  
  // Custom per-week selection option
  const [customWeeklyTickets, setCustomWeeklyTickets] = useState(false);

  // Tickets stored by week: { 45: { 1: "Ola Hansen", 7: "Kari Nordmann" }, 46: { ... } }
  const [ticketsByWeek, setTicketsByWeek] = useState({
    45: { 7: "Kari Nordmann", 14: "Ola Hansen", 22: "Per Olsen" },
    46: { 7: "Kari Nordmann", 12: "Lise Berg" },
    47: {},
    48: {},
    49: {}
  });

  // Saved user list for dropdown (starts empty as requested)
  const [savedUsers, setSavedUsers] = useState([]);

  // User purchasing state
  const [buyerName, setBuyerName] = useState('');
  const [nameWarning, setNameWarning] = useState('');
  
  // For standard uniform purchase across weeks
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  
  // For custom numbers per week: { 45: [1, 2], 46: [5, 6] }
  const [customNumbersByWeek, setCustomNumbersByWeek] = useState({});

  // Prizes state
  const [prizes, setPrizes] = useState([
    { id: 1, title: "Marqués de Riscal Reserva", type: "Rødvin", desc: "Klassisk krydret spansk rødvin med innslag av mørke bær og eik.", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80" },
    { id: 2, title: "Chablis Premier Cru", type: "Hvitvin", desc: "Frisk, mineralsk og elegant hvitvin fra Frankrike.", image: "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?w=500&q=80" },
    { id: 3, title: "Prosecco Superiore", type: "Bobler", desc: "Fruktige og livlige italienske bobler.", image: "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?w=500&q=80" }
  ]);
  const [newPrizeTitle, setNewPrizeTitle] = useState('');
  const [newPrizeType, setNewPrizeType] = useState('Rødvin');
  const [newPrizeDesc, setNewPrizeDesc] = useState('');
  const [newPrizeImage, setNewPrizeImage] = useState('');

  // Vipps Modal
  const [showVippsModal, setShowVippsModal] = useState(false);
  const [lastPurchaseInfo, setLastPurchaseInfo] = useState(null);

  // Wheel / Drawing state
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [rotation, setRotation] = useState(0);

  // Excel import state
  const [excelInputText, setExcelInputText] = useState('');

  // Active weeks array starting from currentWeekNum
  const getActiveWeeksList = (startWeek, count) => {
    const weeks = [];
    let curr = startWeek;
    while (weeks.length < count) {
      if (!vacationWeeks.includes(curr)) {
        weeks.push(curr);
      }
      curr++;
    }
    return weeks;
  };

  const activePurchaseWeeks = getActiveWeeksList(selectedWeek, weeksToBuy);

  // Name input check
  const handleNameChange = (val) => {
    setBuyerName(val);
    const trimmed = val.trim();
    if (trimmed && savedUsers.some(u => u.toLowerCase() === trimmed.toLowerCase())) {
      setNameWarning(`Du valgte et navn som allerede er registrert. Pass på at dette er deg!`);
    } else {
      setNameWarning('');
    }
  };

  // Toggle ticket selection for uniform selection
  const toggleNumberSelection = (num) => {
    // Sjekk om tallet er opptatt i NOEN av de valgte aktive ukene
    const isOccupied = activePurchaseWeeks.some(w => ticketsByWeek[w]?.[num]);
    if (isOccupied) return;

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    }
  };

  // Toggle ticket selection for a specific week in custom mode
  const toggleCustomNumber = (week, num) => {
    if (ticketsByWeek[week]?.[num]) return;
    const currentForWeek = customNumbersByWeek[week] || [];
    let updated;
    if (currentForWeek.includes(num)) {
      updated = currentForWeek.filter(n => n !== num);
    } else {
      updated = [...currentForWeek, num].sort((a, b) => a - b);
    }
    setCustomNumbersByWeek({
      ...customNumbersByWeek,
      [week]: updated
    });
  };

  // Calculate total tickets & price
  const getTotalTicketsCount = () => {
    if (!customWeeklyTickets) {
      return selectedNumbers.length * activePurchaseWeeks.length;
    } else {
      return activePurchaseWeeks.reduce((acc, w) => acc + (customNumbersByWeek[w]?.length || 0), 0);
    }
  };

  const totalPrice = getTotalTicketsCount() * ticketPrice;

  // Complete purchase
  const handlePurchase = (e) => {
    e.preventDefault();
    const name = buyerName.trim();
    if (!name) return alert("Vennligst oppgi eller velg navnet ditt!");

    const totalCount = getTotalTicketsCount();
    if (totalCount === 0) return alert("Du må velge minst ett lodd!");

    // Update ticketsByWeek
    const newTickets = { ...ticketsByWeek };

    if (!customWeeklyTickets) {
      activePurchaseWeeks.forEach(w => {
        if (!newTickets[w]) newTickets[w] = {};
        selectedNumbers.forEach(num => {
          newTickets[w][num] = name;
        });
      });
    } else {
      activePurchaseWeeks.forEach(w => {
        if (!newTickets[w]) newTickets[w] = {};
        const nums = customNumbersByWeek[w] || [];
        nums.forEach(num => {
          newTickets[w][num] = name;
        });
      });
    }

    setTicketsByWeek(newTickets);

    // Save user to dropdown if not already included
    if (!savedUsers.includes(name)) {
      setSavedUsers([...savedUsers, name].sort());
    }

    setLastPurchaseInfo({
      name,
      weeksCount: activePurchaseWeeks.length,
      weeks: activePurchaseWeeks,
      totalTickets: totalCount,
      totalPrice
    });

    setShowVippsModal(true);

    // Reset inputs
    setSelectedNumbers([]);
    setCustomNumbersByWeek({});
  };

  // Handle Image Upload for new prize
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPrizeImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add new prize
  const handleAddPrize = (e) => {
    e.preventDefault();
    if (!newPrizeTitle) return;
    const prize = {
      id: Date.now(),
      title: newPrizeTitle,
      type: newPrizeType,
      desc: newPrizeDesc || "Ingen beskrivelse lagt til.",
      image: newPrizeImage || "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&q=80"
    };
    setPrizes([...prizes, prize]);
    setNewPrizeTitle('');
    setNewPrizeDesc('');
    setNewPrizeImage('');
  };

  // Remove prize
  const handleRemovePrize = (id) => {
    setPrizes(prizes.filter(p => p.id !== id));
  };

  // Toggle Holiday/Vacation week
  const toggleVacationWeek = (wNum) => {
    if (vacationWeeks.includes(wNum)) {
      setVacationWeeks(vacationWeeks.filter(w => w !== wNum));
    } else {
      setVacationWeeks([...vacationWeeks, wNum]);
    }
  };

  // Excel Text Import (Tab or comma separated)
  const handleExcelImport = () => {
    if (!excelInputText.trim()) return;

    const lines = excelInputText.trim().split('\n');
    const newTickets = { ...ticketsByWeek };
    const newUsers = new Set(savedUsers);

    lines.forEach(line => {
      // Split by tab or comma
      const parts = line.split(/[\t,;]+/).map(p => p.trim());
      if (parts.length >= 3) {
        const name = parts[0];
        const ticketNum = parseInt(parts[1], 10);
        const weekNum = parseInt(parts[2], 10);

        if (name && !isNaN(ticketNum) && !isNaN(weekNum)) {
          if (!newTickets[weekNum]) newTickets[weekNum] = {};
          newTickets[weekNum][ticketNum] = name;
          newUsers.add(name);
        }
      }
    });

    setTicketsByWeek(newTickets);
    setSavedUsers(Array.from(newUsers).sort());
    setExcelInputText('');
    alert("Excel-data ble importert!");
  };

  // Wheel Drawing Logic
  const currentWeekTickets = ticketsByWeek[selectedWeek] || {};
  const entries = Object.entries(currentWeekTickets).map(([num, name]) => ({
    number: parseInt(num, 10),
    name
  }));

  const spinWheel = () => {
    if (entries.length === 0) return alert("Ingen lodd er solgt for denne uken!");
    if (isSpinning) return;

    setIsSpinning(true);
    setWinner(null);

    const winningIndex = Math.floor(Math.random() * entries.length);
    const selectedWinner = entries[winningIndex];

    const extraSpins = 5;
    const segmentAngle = 360 / entries.length;
    const targetAngle = 360 * extraSpins + (winningIndex * segmentAngle) + (segmentAngle / 2);

    setRotation(targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(selectedWinner);
      if (window.confetti) {
        window.confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="border-b border-amber-900/40 bg-slate-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-amber-500 to-red-700 p-2.5 rounded-xl shadow-lg shadow-red-950/50">
              <Wine className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold tracking-wide text-amber-100">VINLOTTERIET</h1>
              <p className="text-xs text-amber-400/80 tracking-widest uppercase font-semibold">Fredagskos & Spenning</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800/80 border border-amber-900/30 rounded-lg px-3 py-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-slate-200">Aktiv uke:</span>
            <span className="text-sm font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
              Uke {selectedWeek}
            </span>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('buy')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'buy'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Ticket className="w-4 h-4" />
              <span>Kjøp lodd</span>
            </button>
            <button
              onClick={() => setActiveTab('prizes')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'prizes'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Wine className="w-4 h-4" />
              <span>Premier</span>
            </button>
            <button
              onClick={() => setActiveTab('draw')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'draw'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Trekning</span>
            </button>
            <button
              onClick={() => setActiveTab('admin')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                activeTab === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 md:p-6 space-y-6">

        {/* TAB 1: BUY TICKETS */}
        {activeTab === 'buy' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Form & Options */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
                <h2 className="text-lg font-semibold text-amber-200 flex items-center space-x-2 border-b border-slate-800 pb-3">
                  <Ticket className="w-5 h-5 text-amber-400" />
                  <span>Kjøp lotterilodd</span>
                </h2>

                {/* Name Input / Selector */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Ditt Navn
                  </label>
                  
                  {savedUsers.length > 0 && (
                    <select
                      onChange={(e) => handleNameChange(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-amber-500"
                    >
                      <option value="">-- Velg fra mappen eller skriv ny --</option>
                      {savedUsers.map((u, i) => (
                        <option key={i} value={u}>{u}</option>
                      ))}
                    </select>
                  )}

                  <input
                    type="text"
                    placeholder="F.eks. Kari Nordmann"
                    value={buyerName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />

                  {nameWarning && (
                    <div className="p-2.5 bg-amber-950/50 border border-amber-600/40 rounded-lg text-xs text-amber-200 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{nameWarning}</span>
                    </div>
                  )}
                </div>

                {/* Duration / Weeks Picker */}
                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Hvor mange uker?
                  </label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(w => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setWeeksToBuy(w)}
                        className={`py-1.5 rounded-md text-xs font-bold transition border ${
                          weeksToBuy === w
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                      >
                        {w} {w === 1 ? 'uke' : 'uker'}
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-xs text-slate-400">
                    Aktive trekningsuker: <span className="text-amber-300 font-semibold">{activePurchaseWeeks.join(', ')}</span>
                  </p>
                </div>

                {/* Custom Numbers per week toggle */}
                {weeksToBuy > 1 && (
                  <div className="pt-2 border-t border-slate-800">
                    <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={customWeeklyTickets}
                        onChange={(e) => setCustomWeeklyTickets(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-amber-500 focus:ring-0"
                      />
                      <span>Velg ulikt lodd for hver enkelt uke</span>
                    </label>
                  </div>
                )}

                {/* Purchase Summary Box */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Loddpris per uke:</span>
                    <span>{ticketPrice} kr</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Antall solgte uker:</span>
                    <span>{activePurchaseWeeks.length} uker</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Totalt antall lodd:</span>
                    <span className="font-semibold text-slate-200">{getTotalTicketsCount()} lodd</span>
                  </div>
                  <div className="border-t border-slate-800 pt-2 flex justify-between items-center">
                    <span className="text-sm font-bold text-slate-200">Totalpris:</span>
                    <span className="text-xl font-extrabold text-amber-400">{totalPrice} kr</span>
                  </div>
                </div>

                <button
                  onClick={handlePurchase}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl shadow-lg transition transform active:scale-95 flex items-center justify-center space-x-2"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Kjøp & Betal med Vipps ({totalPrice} kr)</span>
                </button>
              </div>
            </div>

            {/* Right Column: Interactive Ticket Grid */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-lg font-semibold text-amber-200">Velg dine lodd (1–45)</h2>
                  <p className="text-xs text-slate-400">
                    {customWeeklyTickets
                      ? "Velg lodd separat for hver uke i menyen over rutenettet."
                      : `Loddene du velges gjelder for alle ${activePurchaseWeeks.length} valgte ukene.`}
                  </p>
                </div>
                
                <div className="flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-slate-950 border border-slate-700 rounded"></div>
                    <span className="text-slate-400">Ledig</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-amber-500 rounded"></div>
                    <span className="text-slate-400">Valgt</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 bg-red-950/80 border border-red-800 rounded"></div>
                    <span className="text-slate-400">Opptatt</span>
                  </div>
                </div>
              </div>

              {/* Weekly Tabs if Custom selection is ON */}
              {customWeeklyTickets && (
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {activePurchaseWeeks.map(w => (
                    <button
                      key={w}
                      onClick={() => setSelectedWeek(w)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap border ${
                        selectedWeek === w
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-950 border-slate-800 text-slate-400'
                      }`}
                    >
                      Uke {w} ({(customNumbersByWeek[w] || []).length} lodd)
                    </button>
                  ))}
                </div>
              )}

              {/* Grid 1 to 45 */}
              <div className="grid grid-cols-5 sm:grid-cols-9 gap-2">
                {Array.from({ length: 45 }, (_, i) => i + 1).map(num => {
                  let isOccupied = false;
                  let ownerName = "";

                  if (!customWeeklyTickets) {
                    // Check if occupied in any of the active weeks
                    const occupiedWeek = activePurchaseWeeks.find(w => ticketsByWeek[w]?.[num]);
                    if (occupiedWeek) {
                      isOccupied = true;
                      ownerName = ticketsByWeek[occupiedWeek][num];
                    }
                  } else {
                    ownerName = ticketsByWeek[selectedWeek]?.[num];
                    isOccupied = !!ownerName;
                  }

                  const isSelected = customWeeklyTickets
                    ? (customNumbersByWeek[selectedWeek] || []).includes(num)
                    : selectedNumbers.includes(num);

                  return (
                    <button
                      key={num}
                      disabled={isOccupied}
                      onClick={() => {
                        if (customWeeklyTickets) {
                          toggleCustomNumber(selectedWeek, num);
                        } else {
                          toggleNumberSelection(num);
                        }
                      }}
                      className={`h-16 rounded-xl border flex flex-col items-center justify-center p-1 transition transform active:scale-95 ${
                        isOccupied
                          ? 'bg-red-950/40 border-red-900/60 text-red-300/80 cursor-not-allowed opacity-80'
                          : isSelected
                          ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 scale-105'
                          : 'bg-slate-950 border-slate-800 hover:border-amber-500/50 text-slate-200'
                      }`}
                    >
                      <span className="text-sm font-black">{num}</span>
                      {isOccupied && (
                        <span className="text-[10px] leading-tight truncate w-full text-center text-red-200 font-medium mt-0.5">
                          {ownerName}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRIZES */}
        {activeTab === 'prizes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-5 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-xl font-bold text-amber-200">Ukens Premiebord 🍷</h2>
                <p className="text-xs text-slate-400">Se hva du kan vinne i årets vinlotteri!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {prizes.map((prize) => (
                <div key={prize.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
                  <div className="h-48 overflow-hidden relative bg-slate-950">
                    <img 
                      src={prize.image} 
                      alt={prize.title} 
                      className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-full shadow">
                      {prize.type}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-slate-100">{prize.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{prize.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Admin Add Prize */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wider">Legg til ny premie (Eier/Admin)</h3>
              <form onSubmit={handleAddPrize} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Navn på vin/premie"
                  value={newPrizeTitle}
                  onChange={(e) => setNewPrizeTitle(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  required
                />
                <select
                  value={newPrizeType}
                  onChange={(e) => setNewPrizeType(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="Rødvin">Rødvin</option>
                  <option value="Hvitvin">Hvitvin</option>
                  <option value="Bobler">Bobler</option>
                  <option value="Rosévin">Rosévin</option>
                  <option value="Annet">Annet</option>
                </select>
                <input
                  type="text"
                  placeholder="Kort beskrivelse..."
                  value={newPrizeDesc}
                  onChange={(e) => setNewPrizeDesc(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 md:col-span-2"
                />
                <div className="md:col-span-2 flex items-center space-x-3">
                  <label className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-xs text-slate-200 px-3 py-2 rounded-lg cursor-pointer flex items-center space-x-2">
                    <Upload className="w-4 h-4 text-amber-400" />
                    <span>Last opp bilde fra enhet</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  <span className="text-xs text-slate-500">eller lim inn URL under:</span>
                </div>
                <input
                  type="url"
                  placeholder="Bilde-URL (valgfritt)"
                  value={newPrizeImage}
                  onChange={(e) => setNewPrizeImage(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 md:col-span-2"
                />
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm transition md:col-span-2 flex items-center justify-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Legg til premie</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: DRAWING / TREKNING */}
        {activeTab === 'draw' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl text-center space-y-6">
            <div className="max-w-xl mx-auto space-y-2">
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-200">
                LIVE TREKNING - UKE {selectedWeek} 🎉
              </h2>
              <p className="text-xs text-slate-400">
                Vis denne skjermen på møterommet eller Teams for maks spenning!
              </p>
            </div>

            {/* Wheel Container */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 mx-auto my-6">
              {/* Arrow Indicator */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-amber-400 drop-shadow-md"></div>

              {/* The Wheel */}
              <div
                className="w-full h-full rounded-full border-4 border-amber-500/80 shadow-2xl overflow-hidden relative transition-all duration-[4000ms] ease-out"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  background: entries.length > 0 
                    ? `conic-gradient(${entries.map((_, i) => `${i % 2 === 0 ? '#b91c1c' : '#78350f'} ${(i * 360) / entries.length}deg ${((i + 1) * 360) / entries.length}deg`).join(', ')})`
                    : '#1e293b'
                }}
              >
                {entries.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-slate-500 text-sm font-medium">
                    Ingen lodd solgt ennå
                  </div>
                ) : (
                  entries.map((entry, idx) => {
                    const angle = (360 / entries.length) * idx + (360 / entries.length) / 2;
                    return (
                      <div
                        key={idx}
                        className="absolute w-full h-full top-0 left-0 flex justify-center items-start pt-3 font-bold text-xs text-amber-100 drop-shadow"
                        style={{ transform: `rotate(${angle}deg)` }}
                      >
                        <span className="bg-slate-950/60 px-1.5 py-0.5 rounded text-[10px]">
                          #{entry.number} {entry.name.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Spin Button */}
            <button
              onClick={spinWheel}
              disabled={isSpinning || entries.length === 0}
              className={`px-8 py-3.5 rounded-full font-bold text-lg shadow-xl transition transform active:scale-95 ${
                isSpinning || entries.length === 0
                  ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-red-600 hover:from-amber-400 hover:to-red-500 text-slate-950'
              }`}
            >
              {isSpinning ? 'Snurrer hjulet...' : 'SNURR HJULET! 🍷'}
            </button>

            {/* Winner Display */}
            {winner && (
              <div className="bg-gradient-to-r from-amber-500/20 via-red-950/40 to-amber-500/20 border border-amber-500/50 p-6 rounded-2xl max-w-md mx-auto space-y-2 animate-bounce">
                <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
                <h3 className="text-sm uppercase font-semibold tracking-widest text-amber-300">GRATULERER TIL VINNEREN!</h3>
                <p className="text-3xl font-serif font-black text-slate-100">{winner.name}</p>
                <p className="text-sm font-semibold text-amber-400">Vinnerlodd: #{winner.number}</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
              <h2 className="text-xl font-bold text-amber-200 border-b border-slate-800 pb-3">Admin Control Panel ⚙️</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Loddpris (kr)</label>
                  <input
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Vipps-mottakernummer</label>
                  <input
                    type="text"
                    value={vippsNumber}
                    onChange={(e) => setVippsNumber(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">Gjeldende Startuke-nr</label>
                  <input
                    type="number"
                    value={selectedWeek}
                    onChange={(e) => setSelectedWeek(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              {/* Vacation Weeks Management */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-amber-200">Marker Ferieuker (Ingen trekning) 🌴</h3>
                <p className="text-xs text-slate-400">Klikk på en uke for å legge til/fjerne ferie. Multi-ukers kjøp vil automatisk hoppe over ferieuker.</p>
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: 15 }, (_, i) => selectedWeek + i).map(w => {
                    const isVacation = vacationWeeks.includes(w);
                    return (
                      <button
                        key={w}
                        onClick={() => toggleVacationWeek(w)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center space-x-1 ${
                          isVacation
                            ? 'bg-red-950 border-red-700 text-red-200'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {isVacation && <Palmtree className="w-3.5 h-3.5 text-red-400" />}
                        <span>Uke {w}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Excel / Paste Import */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <h3 className="text-sm font-bold text-amber-200 flex items-center space-x-2">
                  <Upload className="w-4 h-4 text-amber-400" />
                  <span>Importer solgte lodd fra Excel / Tekst</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Kopier rader fra Excel med formatet: <code className="bg-slate-950 px-1 py-0.5 rounded text-amber-300">Navn [tab] Loddnummer [tab] Ukenummer</code> og lim inn under.
                </p>
                <textarea
                  rows={4}
                  placeholder={`Kari Nordmann	7	45
Kari Nordmann	14	45
Ola Hansen	12	46`}
                  value={excelInputText}
                  onChange={(e) => setExcelInputText(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                ></textarea>
                <button
                  onClick={handleExcelImport}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition"
                >
                  Importer data til lotteriet
                </button>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Vipps Modal */}
      {showVippsModal && lastPurchaseInfo && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <QrCode className="w-7 h-7 text-white" />
            </div>

            <h3 className="text-lg font-bold text-slate-100">Fullfør Vipps-betaling</h3>
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-left space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Kjøper:</span>
                <span className="font-bold text-slate-200">{lastPurchaseInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Varighet:</span>
                <span className="text-slate-200">{lastPurchaseInfo.weeksCount} uker ({lastPurchaseInfo.weeks.join(', ')})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Totalt lodd:</span>
                <span className="text-slate-200">{lastPurchaseInfo.totalTickets} lodd</span>
              </div>
              <div className="border-t border-slate-800 pt-2 flex justify-between font-bold text-sm">
                <span className="text-slate-300">Å betale:</span>
                <span className="text-amber-400">{lastPurchaseInfo.totalPrice} kr</span>
              </div>
            </div>

            <p className="text-xs text-slate-400">
              Vippss <span className="font-bold text-slate-200">{lastPurchaseInfo.totalPrice} kr</span> til <span className="font-bold text-amber-400">{vippsNumber}</span> med meldingen: <br/>
              <span className="italic text-slate-300 font-mono">"Vinlotteri - {lastPurchaseInfo.name}"</span>
            </p>

            <a
              href={`vipps://pay?recipient=${vippsNumber}&amount=${lastPurchaseInfo.totalPrice}&message=Vinlotteri`}
              className="block w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition shadow-lg"
            >
              Åpne Vipps på mobilen
            </a>

            <button
              onClick={() => setShowVippsModal(false)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2 rounded-lg"
            >
              Lukk vindu
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
