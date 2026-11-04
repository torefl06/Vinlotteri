import React, { useState, useEffect } from 'react';

// Forhåndsutfylte data fra Excel-arket
const initialWeeklyData = {
  "Uke 45": { "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 3, "Tore": 2, "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 2, "Gro": 2, "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 1, "Charlotte": 1, "Frode": 1, "Normi": 1, "Kristian": 1 },
  "Uke 46": { "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 2, "Tore": 2, "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 2, "Gro": 1, "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 1, "Charlotte": 1, "Frode": 1, "Normi": 1 },
  "Uke 47": { "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 3, "Tore": 2, "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Gro": 1, "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 1, "Charlotte": 1, "Frode": 1, "Normi": 1 },
  "Uke 48": { "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 2, "Tore": 2, "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 1, "Charlotte": 1, "Frode": 1, "Normi": 1 },
  "Uke 49": { "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 3, "Tore": 2, "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 2, "Trine": 2, "Charlotte": 1, "Frode": 1, "Normi": 1 },
  "Uke 50": { "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 2, "Tore": 2, "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Gro": 1, "Jannicke": 2, "Ingvild": 1, "Ebbe": 1, "Rene G": 1, "Trine": 1, "Charlotte": 1, "Frode": 1, "Normi": 1 },
  "Uke 51": { "Laila Martine": 3, "Elisabeth T": 3, "Ingrid": 3, "Pål E": 2, "Tore": 2, "Daniel": 2, "Alexander": 2, "Hege": 2, "Karoline": 1, "Gro": 1, "Jannicke": 1, "Ingvild": 1, "Ebbe": 1, "Rene G": 1, "Charlotte": 1, "Normi": 1 }
};

const weeksList = ["Uke 45", "Uke 46", "Uke 47", "Uke 48", "Uke 49", "Uke 50", "Uke 51"];
const TICKET_PRICE = 20; // Endre til riktig loddpris om ønskelig

export default function App() {
  const [weeklyData, setWeeklyData] = useState(() => {
    const saved = localStorage.getItem('vinlotteri_data');
    return saved ? JSON.parse(saved) : initialWeeklyData;
  });

  const [selectedWeek, setSelectedWeek] = useState("Uke 45");
  const [winner, setWinner] = useState(null);
  
  // Admin tilstand
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");

  // Kjøper skjema tilstand
  const [buyerName, setBuyerName] = useState("");
  const [totalBought, setTotalBought] = useState(0);
  const [allocations, setAllocations] = useState({
    "Uke 45": 0, "Uke 46": 0, "Uke 47": 0, "Uke 48": 0, "Uke 49": 0, "Uke 50": 0, "Uke 51": 0
  });
  const [showVippsModal, setShowVippsModal] = useState(false);

  useEffect(() => {
    localStorage.setItem('vinlotteri_data', JSON.stringify(weeklyData));
  }, [weeklyData]);

  // Beregn plasserte og gjenstående lodd
  const usedTickets = Object.values(allocations).reduce((a, b) => a + b, 0);
  const remainingTickets = totalBought - usedTickets;

  // Håndter admin-innlogging
  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === "vinlotteri26") {
      setIsAdmin(true);
      setShowAdminModal(false);
      setAdminPassword("");
      setAdminError("");
    } else {
      setAdminError("Feil kode. Prøv igjen.");
    }
  };

  // Håndter ukesfordeling
  const handleAllocationChange = (week, val) => {
    const num = Math.max(0, parseInt(val) || 0);
    const currentForWeek = allocations[week] || 0;
    const diff = num - currentForWeek;

    if (diff > remainingTickets) {
      alert(`Du har bare ${remainingTickets} lodd igjen å plassere!`);
      return;
    }

    setAllocations({ ...allocations, [week]: num });
  };

  // Åpne Vipps-bekreftelse
  const handlePreSubmit = (e) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      alert("Vennligst skriv inn navnet ditt.");
      return;
    }
    if (totalBought <= 0) {
      alert("Du må velge å kjøpe minst 1 lodd.");
      return;
    }
    if (remainingTickets !== 0) {
      alert(`Du må plassere alle loddene dine før du fortsetter! Gjenstår: ${remainingTickets} lodd.`);
      return;
    }
    setShowVippsModal(true);
  };

  // Bekreft kjøp og lagre i data
  const confirmPurchase = () => {
    const updated = { ...weeklyData };
    
    Object.entries(allocations).forEach(([week, count]) => {
      if (count > 0) {
        if (!updated[week]) updated[week] = {};
        updated[week][buyerName] = (updated[week][buyerName] || 0) + count;
      }
    });

    setWeeklyData(updated);
    setShowVippsModal(false);
    
    // Nullstill skjema
    setBuyerName("");
    setTotalBought(0);
    setAllocations({ "Uke 45": 0, "Uke 46": 0, "Uke 47": 0, "Uke 48": 0, "Uke 49": 0, "Uke 50": 0, "Uke 51": 0 });
    
    alert("Takk! Loddene dine er registrert.");
  };

  // Trekk vinner for valgt uke
  const currentWeekData = weeklyData[selectedWeek] || {};
  const ticketList = Object.entries(currentWeekData).flatMap(([name, count]) => Array(count).fill(name));

  const drawWinner = () => {
    if (ticketList.length === 0) return;
    const randomIndex = Math.floor(Math.random() * ticketList.length);
    setWinner(ticketList[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col items-center">
      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-amber-400">🍷 VINLOTTERIET 🍷</h1>
          <p className="text-slate-400 text-sm">Kjøp lodd og følg trekningen ukentlig</p>
        </div>
        
        <button 
          onClick={() => {
            if (isAdmin) setIsAdmin(false);
            else setShowAdminModal(true);
          }}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold py-2 px-3 rounded-lg text-slate-300"
        >
          {isAdmin ? "🔓 Admin Mode (Logg ut)" : "🔒 Admin"}
        </button>
      </header>

      {/* ADMIN-KODE MODAL */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold text-amber-400 mb-2">Admin Innlogging</h2>
            <p className="text-slate-400 text-sm mb-4">Oppgi adminkode for å få tilgang til trekningspanelet.</p>
            <form onSubmit={handleAdminLogin}>
              <input 
                type="password"
                placeholder="Skriv inn kode..."
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-white mb-3 focus:outline-none focus:border-amber-500"
              />
              {adminError && <p className="text-red-400 text-xs mb-3">{adminError}</p>}
              <div className="flex space-x-3">
                <button 
                  type="button" 
                  onClick={() => setShowAdminModal(false)}
                  className="w-1/2 bg-slate-800 hover:bg-slate-700 font-bold py-2 rounded-lg text-sm"
                >
                  Avbryt
                </button>
                <button 
                  type="submit" 
                  className="w-1/2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-lg text-sm"
                >
                  Lås opp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIPPS-BEKREFTELSE MODAL */}
      {showVippsModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-amber-500/50 p-6 rounded-2xl w-full max-w-md shadow-2xl text-center">
            <div className="text-4xl mb-2">📱</div>
            <h2 className="text-2xl font-black text-amber-400 mb-2">Husk å Vippse!</h2>
            <p className="text-slate-300 text-sm mb-4">
              Du registrerer nå <strong>{totalBought} lodd</strong> for <strong>{buyerName}</strong>.<br/>
              Totalbeløp: <strong className="text-emerald-400">{totalBought * TICKET_PRICE} kr</strong>.
            </p>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 text-left text-xs text-slate-300 space-y-1">
              <p>1. Åpne Vipps på mobilen.</p>
              <p>2. Send <strong>{totalBought * TICKET_PRICE} kr</strong> til Vinlotteri-ansvarlig.</p>
              <p>3. Trykk på bekreftelsesknappen under når det er gjort.</p>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={() => setShowVippsModal(false)}
                className="w-1/2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 rounded-xl text-sm"
              >
                Avbryt
              </button>
              <button 
                onClick={confirmPurchase}
                className="w-1/2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-3 rounded-xl text-sm"
              >
                Ja, jeg har Vippset!
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl">
        
        {/* SKJEMA FOR KJØPERE */}
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold text-amber-400 mb-4 flex items-center space-x-2">
            <span>🎟️</span>
            <span>Kjøp og fordél lodd</span>
          </h2>

          <form onSubmit={handlePreSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Ditt Navn</label>
              <input 
                type="text" 
                placeholder="F.eks. Ola Nordmann"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Totalt antall lodd du har kjøpt</label>
              <input 
                type="number" 
                min="1"
                placeholder="0"
                value={totalBought || ''}
                onChange={(e) => setTotalBought(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* STATUS FOR PLASSERING */}
            {totalBought > 0 && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-400">Gjenstår å plassere:</span>
                <span className={`font-black text-sm px-2.5 py-0.5 rounded-full ${remainingTickets === 0 ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'}`}>
                  {remainingTickets} lodd
                </span>
              </div>
            )}

            {/* FORDELING PER UKE */}
            {totalBought > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Fordel loddene dine på ukene:</p>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                  {weeksList.map(week => (
                    <div key={week} className="flex justify-between items-center bg-slate-950 p-2 rounded-lg border border-slate-800/80">
                      <span className="text-xs font-medium text-slate-300">{week}</span>
                      <input 
                        type="number" 
                        min="0"
                        value={allocations[week] || ''}
                        onChange={(e) => handleAllocationChange(week, e.target.value)}
                        className="w-14 bg-slate-900 border border-slate-700 rounded text-center text-xs text-amber-400 font-bold p-1 focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-3 rounded-xl transition transform active:scale-95 shadow-md text-sm mt-4"
            >
              Registrer lodd & Gå til Vipps ➔
            </button>
          </form>
        </div>

        {/* TREKNING & ADMINGRENSEFITTHET */}
        <div className="space-y-6">
          {/* VELG UKE VISNING */}
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-200">Vis ukeoversikt</h2>
              <select 
                value={selectedWeek}
                onChange={(e) => { setSelectedWeek(e.target.value); setWinner(null); }}
                className="bg-slate-950 border border-slate-700 text-amber-400 font-bold py-1.5 px-3 rounded-lg text-sm focus:outline-none"
              >
                {weeksList.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            <div className="flex justify-between items-center bg-slate-950 p-3 rounded-xl border border-slate-800 mb-4">
              <span className="text-slate-400 text-xs font-medium">Totalt solgt for {selectedWeek}:</span>
              <span className="text-lg font-black text-emerald-400">{ticketList.length} lodd</span>
            </div>

            {/* KUN FOR ADMIN: TREKK-KNAPP */}
            {isAdmin ? (
              <div className="p-4 bg-amber-950/30 border border-amber-500/40 rounded-xl mb-4 text-center">
                <p className="text-amber-400 text-xs font-bold mb-2">👑 ADMIN CONTROL</p>
                <button 
                  onClick={drawWinner}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black py-3 rounded-xl transition transform active:scale-95 text-base shadow-lg"
                >
                  🎲 TREKK VINNER FOR {selectedWeek.toUpperCase()}
                </button>
              </div>
            ) : (
              <div className="p-3 bg-slate-950 rounded-xl text-center text-xs text-slate-500 mb-4 border border-slate-800">
                🔒 Bare admin kan gjennomføre trekningen.
              </div>
            )}

            {/* VINNER VISNING */}
            {winner && (
              <div className="p-4 bg-emerald-950 border-2 border-emerald-500 rounded-xl text-center animate-bounce mb-4">
                <p className="text-emerald-400 text-xs font-bold uppercase tracking-widest">Vinner av {selectedWeek}</p>
                <p className="text-2xl font-black text-white mt-1">{winner} 🎉</p>
              </div>
            )}

            {/* DELTAKERLISTE */}
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Registrerte lodd i {selectedWeek}</h3>
            <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5">
              {Object.keys(currentWeekData).length === 0 ? (
                <p className="text-slate-600 text-xs py-2 text-center">Ingen lodd registrert enda.</p>
              ) : (
                Object.entries(currentWeekData).map(([name, count]) => (
                  <div key={name} className="flex justify-between items-center bg-slate-950/60 p-2 rounded-lg text-xs">
                    <span className="text-slate-300">{name}</span>
                    <span className="bg-slate-800 text-amber-400 font-bold px-2 py-0.5 rounded border border-slate-700">
                      {count} lodd
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
