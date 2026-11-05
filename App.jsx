import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

import vin1 from './src/assets/vin1.jpg';
import vin2 from './src/assets/vin2.jpg';

const firebaseConfig = {
  apiKey: "AIzaSyAHAF1PVwgbkIi1GPAgpcjnmN1FllXIap8",
  authDomain: "vinlotteri-b03b8.firebaseapp.com",
  projectId: "vinlotteri-b03b8",
  storageBucket: "vinlotteri-b03b8.firebasestorage.app",
  messagingSenderId: "935956635836",
  appId: "1:935956635836:web:1f6626d8d64d3cb999b0b9",
  measurementId: "G-TRQ3X35FJL"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const TOTAL_TICKETS = 50;
const TICKET_PRICE = 10;
const VIPPS_RECEIVER_NAME = "Tore Farestad Lie";
const VIPPS_NUMBER = "41406582";

const initialTicketsFromImage = {
  "Uke 46": {
    2: "Charlotte", 3: "Laila Martine", 4: "Elisabeth T", 5: "Ingrid", 6: "Hege", 7: "Frode", 8: "Jannicke",
    10: "Tore", 11: "Daniel", 12: "Trine", 13: "Normi", 14: "Ingrid", 15: "Gro", 16: "Pål E", 17: "Laila Martine",
    18: "Alexander", 19: "Ingvild", 20: "Tore", 21: "Alexander", 22: "Daniel", 23: "Karoline", 24: "Pål E",
    25: "Ebbe", 26: "Hege", 29: "Elisabeth T", 30: "Jannicke", 43: "Rene G", 44: "Rene G"
  },
  "Uke 47": {
    2: "Pål E", 3: "Laila Martine", 4: "Elisabeth T", 5: "Frode", 6: "Hege", 7: "Ingrid", 8: "Charlotte", 9: "Gro",
    10: "Tore", 11: "Daniel", 12: "Trine", 13: "Normi", 14: "Ingrid", 15: "Ingvild", 16: "Jannicke", 17: "Laila Martine",
    18: "Alexander", 19: "Ingvild", 20: "Tore", 21: "Alexander", 22: "Daniel", 23: "Karoline", 24: "Pål E",
    25: "Ebbe", 26: "Hege", 29: "Elisabeth T", 30: "Jannicke", 43: "Rene G", 44: "Rene G"
  },
  "Uke 48": {
    2: "Trine", 3: "Laila Martine", 4: "Elisabeth T", 5: "Frode", 6: "Hege", 7: "Karoline", 8: "Jannicke", 9: "Ingrid",
    10: "Tore", 11: "Daniel", 13: "Normi", 14: "Ingrid", 16: "Pål E", 17: "Laila Martine",
    18: "Alexander", 19: "Ingvild", 20: "Tore", 21: "Alexander", 22: "Daniel", 24: "Pål E",
    25: "Ebbe", 26: "Hege", 28: "Charlotte", 29: "Elisabeth T", 30: "Jannicke", 43: "Rene G", 44: "Rene G"
  },
  "Uke 49": {
    1: "Pål E", 2: "Trine", 3: "Laila Martine", 4: "Elisabeth T", 5: "Frode", 6: "Hege", 7: "Karoline", 8: "Ingrid",
    10: "Tore", 11: "Daniel", 13: "Normi", 14: "Ingrid", 15: "Ingvild", 16: "Jannicke", 17: "Laila Martine",
    18: "Alexander", 19: "Ingvild", 20: "Tore", 21: "Alexander", 22: "Daniel", 24: "Pål E",
    25: "Ebbe", 26: "Hege", 28: "Charlotte", 29: "Elisabeth T", 30: "Jannicke", 43: "Rene G", 44: "Rene G"
  },
  "Uke 50": {
    3: "Laila Martine", 4: "Elisabeth T", 5: "Frode", 6: "Hege", 7: "Ingrid", 8: "Jannicke", 9: "Normi",
    10: "Tore", 11: "Daniel", 12: "Trine", 13: "Karoline", 14: "Ingrid", 15: "Gro", 16: "Pål E", 17: "Laila Martine",
    18: "Alexander", 19: "Ingvild", 20: "Tore", 21: "Alexander", 22: "Daniel", 24: "Pål E",
    25: "Ebbe", 26: "Hege", 28: "Charlotte", 29: "Elisabeth T", 30: "Jannicke", 43: "Rene G", 44: "Rene G"
  },
  "Uke 51": {
    3: "Laila Martine", 4: "Elisabeth T", 6: "Hege", 7: "Karoline", 8: "Normi", 9: "Ingrid",
    10: "Tore", 11: "Daniel", 12: "Karoline", 14: "Ingrid", 15: "Gro", 16: "Pål E", 17: "Laila Martine",
    18: "Alexander", 19: "Ingvild", 20: "Tore", 21: "Alexander", 22: "Daniel", 24: "Pål E",
    25: "Ebbe", 26: "Hege", 28: "Charlotte", 29: "Elisabeth T", 30: "Jannicke", 43: "Rene G", 44: "Rene G"
  }
};

const defaultPrizes = {
  "Uke 45": { title: "2 Flasker Utvalgt Vin", image1: vin1, image2: vin2, winner: "Rene G og Tore" },
  "Uke 46": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 47": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 48": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 49": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 50": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 51": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" }
};

const playDrumroll = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  } catch (e) {
    console.log("Lyd støttes ikke");
  }
};

const playFanfare = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const notes = [261.63, 329.63, 392.00, 523.25];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
      gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.12 + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.5);
    });
  } catch (e) {
    console.log("Lyd støttes ikke");
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('lodd');
  const [prizes, setPrizes] = useState(defaultPrizes);
  const [tickets, setTickets] = useState(initialTicketsFromImage);
  const [tips, setTips] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  const [bottle1Winners, setBottle1Winners] = useState({});
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState('');
  const [animatedTicket, setAnimatedTicket] = useState(null);
  const [animatedName, setAnimatedName] = useState('');
  const [drawingWinnerResult, setDrawingWinnerResult] = useState('');

  const activeWeeks = Object.keys(defaultPrizes).filter(w => !prizes[w]?.winner);
  const completedWeeks = Object.keys(defaultPrizes).filter(w => !!prizes[w]?.winner);

  const [selectedWeek, setSelectedWeek] = useState(activeWeeks[0] || 'Uke 46');
  const [cart, setCart] = useState({});
  const [buyerName, setBuyerName] = useState('');
  const [showPaymentConfirmModal, setShowPaymentConfirmModal] = useState(false);

  const [tipName, setTipName] = useState('');
  const [tipWine, setTipWine] = useState('');
  const [tipPrice, setTipPrice] = useState('');
  const [tipDesc, setTipDesc] = useState('');
  
  const [fbName, setFbName] = useState('');
  const [fbText, setFbText] = useState('');

  useEffect(() => {
    if (prizes[selectedWeek]?.winner && activeWeeks.length > 0) {
      setSelectedWeek(activeWeeks[0]);
    }
  }, [prizes]);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "prizes"), (docSnap) => {
      if (docSnap.exists()) setPrizes(docSnap.data());
      else setDoc(doc(db, "vinlotteri", "prizes"), defaultPrizes);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "tickets"), (docSnap) => {
      if (docSnap.exists() && Object.keys(docSnap.data()).length > 0) {
        setTickets(docSnap.data());
      } else {
        setTickets(initialTicketsFromImage);
        setDoc(doc(db, "vinlotteri", "tickets"), initialTicketsFromImage);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "tips"), (docSnap) => {
      if (docSnap.exists()) setTips(docSnap.data().list || []);
      else setDoc(doc(db, "vinlotteri", "tips"), { list: [] });
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "feedback"), (docSnap) => {
      if (docSnap.exists()) setFeedback(docSnap.data().list || []);
      else setDoc(doc(db, "vinlotteri", "feedback"), { list: [] });
    });
    return () => unsub();
  }, []);

  const currentWeekTickets = tickets[selectedWeek] || {};
  const currentWeekCart = cart[selectedWeek] || [];

  const toggleSelectNumber = (num) => {
    if (currentWeekTickets[num]) return;
    const isSelected = currentWeekCart.includes(num);
    const updatedWeekCart = isSelected
      ? currentWeekCart.filter(n => n !== num)
      : [...currentWeekCart, num];

    setCart({
      ...cart,
      [selectedWeek]: updatedWeekCart
    });
  };

  const totalCartCount = Object.values(cart).reduce((sum, nums) => sum + nums.length, 0);
  const totalPrice = totalCartCount * TICKET_PRICE;

  const handleOpenPaymentPrompt = (e) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      alert("Vennligst skriv inn navnet ditt.");
      return;
    }
    if (totalCartCount === 0) {
      alert("Vennligst velg minst ett ledig grønt lodd.");
      return;
    }
    // Åpne bekreftelsespopup
    setShowPaymentConfirmModal(true);
  };

  const confirmAndLockTickets = async () => {
    const updatedTickets = { ...tickets };

    Object.entries(cart).forEach(([week, nums]) => {
      if (nums.length > 0) {
        const weekTickets = { ...(updatedTickets[week] || {}) };
        nums.forEach(n => {
          weekTickets[n] = buyerName.trim();
        });
        updatedTickets[week] = weekTickets;
      }
    });

    setTickets(updatedTickets);
    await setDoc(doc(db, "vinlotteri", "tickets"), updatedTickets);
    
    setShowPaymentConfirmModal(false);
    alert(`Gratulerer ${buyerName}! Deres ${totalCartCount} lodd er nå låst. Lykke til i trekningen!`);
    setCart({});
  };

  const drawSingleBottle = (week, bottleNumber) => {
    const weekTickets = tickets[week] || {};
    const takenTicketNumbers = Object.keys(weekTickets);

    if (takenTicketNumbers.length === 0) {
      alert("Ingen har valgt lodd for denne uken ennå!");
      return;
    }

    setIsDrawing(true);
    setDrawingTitle(`🍾 TREKKER FLASKE ${bottleNumber} (${week})...`);
    setDrawingWinnerResult('');
    playDrumroll();

    let counter = 0;
    const interval = setInterval(() => {
      const randomTicket = takenTicketNumbers[Math.floor(Math.random() * takenTicketNumbers.length)];
      setAnimatedTicket(randomTicket);
      setAnimatedName(weekTickets[randomTicket]);
      counter++;

      if (counter > 25) {
        clearInterval(interval);
        playFanfare();

        const winningTicket = takenTicketNumbers[Math.floor(Math.random() * takenTicketNumbers.length)];
        const winnerName = weekTickets[winningTicket];
        const winnerString = `${winnerName} (Lodd #${winningTicket})`;

        setAnimatedTicket(winningTicket);
        setAnimatedName(winnerName);
        setDrawingWinnerResult(`🎉 FLASKE ${bottleNumber} VINNES AV:\n${winnerString}`);

        if (bottleNumber === 1) {
          setBottle1Winners({ ...bottle1Winners, [week]: winnerString });
        } else if (bottleNumber === 2) {
          const b1Winner = bottle1Winners[week] || "Ukjent";
          const finalWinnersCombined = `Flaske 1: ${b1Winner} & Flaske 2: ${winnerString}`;
          
          const updatedPrizes = {
            ...prizes,
            [week]: { ...prizes[week], winner: finalWinnersCombined }
          };
          setPrizes(updatedPrizes);
          setDoc(doc(db, "vinlotteri", "prizes"), updatedPrizes);
        }
      }
    }, 100);
  };

  const handleAddTip = async (e) => {
    e.preventDefault();
    if (!tipWine || !tipDesc) return;
    const newTip = { 
      id: Date.now(), 
      name: tipName || 'Anonym', 
      wine: tipWine, 
      price: tipPrice ? `${tipPrice} kr` : 'Ukjent pris',
      desc: tipDesc, 
      date: new Date().toLocaleDateString('no-NO') 
    };
    const updated = [newTip, ...tips];
    setTips(updated);
    await setDoc(doc(db, "vinlotteri", "tips"), { list: updated });
    setTipName(''); setTipWine(''); setTipPrice(''); setTipDesc('');
  };

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!fbText) return;
    const newFb = { id: Date.now(), name: fbName || 'Anonym', text: fbText, date: new Date().toLocaleDateString('no-NO') };
    const updated = [newFb, ...feedback];
    setFeedback(updated);
    await setDoc(doc(db, "vinlotteri", "feedback"), { list: updated });
    setFbName(''); setFbText('');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'vinlotteri26') setIsAdmin(true);
    else alert('Feil passord!');
  };

  const handleResetAll = async () => {
    if (window.confirm("Er du sikker på at du vil tilbakestille alle lodd og premier til bildet sitt oppsett?")) {
      await setDoc(doc(db, "vinlotteri", "prizes"), defaultPrizes);
      await setDoc(doc(db, "vinlotteri", "tickets"), initialTicketsFromImage);
      await setDoc(doc(db, "vinlotteri", "tips"), { list: [] });
      await setDoc(doc(db, "vinlotteri", "feedback"), { list: [] });
      setBottle1Winners({});
    }
  };

  const handleImageUpload = (week, field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      const updated = {
        ...prizes,
        [week]: { ...prizes[week], [field]: reader.result }
      };
      setPrizes(updated);
      await setDoc(doc(db, "vinlotteri", "prizes"), updated);
    };
    reader.readAsDataURL(file);
  };

  const getSummaryByPerson = () => {
    const summary = {};
    Object.entries(currentWeekTickets).forEach(([num, person]) => {
      if (!summary[person]) summary[person] = [];
      summary[person].push(num);
    });
    return summary;
  };

  return (
    <div style={{ backgroundColor: '#0b132b', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1c2541', borderBottom: '2px solid #3a506b' }}>
        <h1 style={{ margin: 0, color: '#f72585' }}>🍷 Digitalt Vinlotteri</h1>
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('lodd')} style={navBtnStyle(activeTab === 'lodd')}>🎟️ Velg Lodd</button>
          <button onClick={() => setActiveTab('vinnere')} style={navBtnStyle(activeTab === 'vinnere')}>🏆 Vinnere</button>
          <button onClick={() => setShowPrizeModal(true)} style={navBtnStyle(false)}>🎁 Premier</button>
          <button onClick={() => setActiveTab('tips')} style={navBtnStyle(activeTab === 'tips')}>🍾 Vintips</button>
          <button onClick={() => setActiveTab('feedback')} style={navBtnStyle(activeTab === 'feedback')}>💬 Ris & Ros</button>
          <button onClick={() => setActiveTab('admin')} style={navBtnStyle(activeTab === 'admin')}>⚙️ Admin</button>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '20px auto', padding: '0 15px' }}>
        
        {/* FANER: Kjøp Lodd */}
        {activeTab === 'lodd' && (
          <div>
            <h2>🎟️ Loddbord (1–50)</h2>
            
            {activeWeeks.length === 0 ? (
              <p style={{ color: '#4cc9f0', fontSize: '1.2em' }}>🎉 Alle ukene er ferdig trukket!</p>
            ) : (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label>Velg Aktiv Uke: </label>
                  <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)} style={inputStyle}>
                    {activeWeeks.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>

                {/* Forklaring */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '0.9em', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '15px', height: '15px', backgroundColor: '#2a9d8f', borderRadius: '3px', display: 'inline-block' }}></span> Grønn = Ledig
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '15px', height: '15px', backgroundColor: '#f72585', borderRadius: '3px', display: 'inline-block' }}></span> Rosa = Valgt av deg nå
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '15px', height: '15px', backgroundColor: '#e63946', borderRadius: '3px', display: 'inline-block' }}></span> Rød = Opptatt (Navn vises)
                  </span>
                </div>

                {/* Loddrutenett 1-50 */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                  {Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1).map(num => {
                    const isTaken = !!currentWeekTickets[num];
                    const isSelected = currentWeekCart.includes(num);
                    const owner = currentWeekTickets[num];

                    let bg = '#2a9d8f';
                    if (isTaken) bg = '#e63946';
                    if (isSelected) bg = '#f72585';

                    return (
                      <button
                        key={num}
                        onClick={() => toggleSelectNumber(num)}
                        disabled={isTaken}
                        style={{
                          backgroundColor: bg,
                          color: '#fff',
                          border: isSelected ? '2px solid #fff' : 'none',
                          borderRadius: '6px',
                          padding: '8px 4px',
                          fontWeight: 'bold',
                          cursor: isTaken ? 'not-allowed' : 'pointer',
                          fontSize: '0.75em',
                          minHeight: '55px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          wordBreak: 'break-word',
                          overflow: 'hidden'
                        }}
                      >
                        <span style={{ fontSize: '1.1em', marginBottom: '2px' }}>#{num}</span>
                        <span style={{ fontSize: '0.85em', fontWeight: 'normal', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden', maxWidth: '100%' }}>
                          {isTaken ? owner : (isSelected ? 'VALGT' : 'Ledig')}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Skjema */}
                <form onSubmit={handleOpenPaymentPrompt} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
                  <h3>🛒 Din handlekurv</h3>
                  
                  {totalCartCount === 0 ? (
                    <p style={{ color: '#8d99ae' }}>Ingen lodd er valgt ennå. Klikk på de grønne loddene over for å legge til.</p>
                  ) : (
                    <div style={{ marginBottom: '15px' }}>
                      {Object.entries(cart).map(([w, nums]) => nums.length > 0 && (
                        <div key={w} style={{ fontSize: '0.9em', color: '#4cc9f0', marginBottom: '4px' }}>
                          <strong>{w}:</strong> Lodd {nums.map(n => `#${n}`).join(', ')} ({nums.length} stk)
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ backgroundColor: '#0b132b', padding: '12px', borderRadius: '6px', margin: '15px 0', borderLeft: '4px solid #ff5b24' }}>
                    <div style={{ fontSize: '1.1em', fontWeight: 'bold', color: '#4cc9f0' }}>
                      💰 Totalsum: {totalPrice} kr <span style={{ fontSize: '0.8em', color: '#8d99ae', fontWeight: 'normal' }}>({totalCartCount} lodd × 10 kr)</span>
                    </div>
                    <div style={{ fontSize: '0.95em', marginTop: '4px' }}>
                      📱 Vipps til: <strong>{VIPPS_RECEIVER_NAME} ({VIPPS_NUMBER})</strong>
                    </div>
                  </div>

                  <input type="text" placeholder="Ditt Navn *" value={buyerName} onChange={e => setBuyerName(e.target.value)} style={inputStyle} required /><br/><br/>
                  
                  <button type="submit" disabled={totalCartCount === 0} style={{ ...btnStyle, backgroundColor: '#2a9d8f', color: '#fff', width: '100%', padding: '12px', fontSize: '1.1em', opacity: totalCartCount === 0 ? 0.5 : 1 }}>
                    🔒 Lås mine lodd
                  </button>
                </form>

                <h3>Kjøpte lodd i {selectedWeek}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                  {Object.entries(getSummaryByPerson()).map(([person, lodd]) => (
                    <div key={person} style={{ backgroundColor: '#1c2541', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #4cc9f0' }}>
                      <strong>{person}</strong>
                      <div style={{ fontSize: '0.9em', color: '#4cc9f0', marginTop: '4px' }}>Lodd ({lodd.length} stk): {lodd.join(', ')}</div>
                      <div style={{ fontSize: '0.8em', color: '#8d99ae' }}>Totalt: {lodd.length * TICKET_PRICE} kr</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* FANER: Vinnere */}
        {activeTab === 'vinnere' && (
          <div>
            <h2>🏆 Oversikt over Vinnere</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {completedWeeks.length === 0 ? (
                <p style={{ color: '#8d99ae' }}>Ingen trekninger er gjennomført ennå.</p>
              ) : (
                completedWeeks.map(week => (
                  <div key={week} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', borderLeft: '5px solid #f72585', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '0 0 5px 0', color: '#4cc9f0' }}>{week}</h3>
                      <p style={{ margin: 0, fontSize: '1.1em' }}>🎉 Vinnere: <strong>{prizes[week].winner}</strong></p>
                    </div>
                    <span style={{ fontSize: '0.9em', color: '#8d99ae' }}>Ferdig trukket</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* FANER: Vintips med Pris */}
        {activeTab === 'tips' && (
          <div>
            <h2>🍾 Vintips fra Kollegaer</h2>
            <form onSubmit={handleAddTip} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>Send inn ditt vintips</h3>
              <input type="text" placeholder="Ditt navn (valgfritt)" value={tipName} onChange={e => setTipName(e.target.value)} style={inputStyle} /><br/><br/>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                <input type="text" placeholder="Vinens navn *" value={tipWine} onChange={e => setTipWine(e.target.value)} style={inputStyle} required />
                <input type="number" placeholder="Pris (kr)" value={tipPrice} onChange={e => setTipPrice(e.target.value)} style={inputStyle} />
              </div><br/>

              <textarea placeholder="Hvorfor anbefaler du denne? *" value={tipDesc} onChange={e => setTipDesc(e.target.value)} style={{ ...inputStyle, height: '60px' }} required /><br/><br/>
              <button type="submit" style={btnStyle}>Legg til Vintips</button>
            </form>

            {tips.map(t => (
              <div key={t.id} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '10px', borderLeft: '4px solid #f72585' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: '0 0 5px 0', color: '#f72585', fontSize: '1.2em' }}>{t.wine}</h4>
                  {t.price && <span style={{ backgroundColor: '#2a9d8f', padding: '3px 8px', borderRadius: '12px', fontSize: '0.85em', fontWeight: 'bold' }}>🏷️ {t.price}</span>}
                </div>
                <p style={{ margin: '8px 0' }}>{t.desc}</p>
                <small style={{ color: '#8d99ae' }}>Innsendt av {t.name} – {t.date}</small>
              </div>
            ))}
          </div>
        )}

        {/* FANER: Ris & Ros */}
        {activeTab === 'feedback' && (
          <div>
            <h2>💬 Ris & Ros</h2>
            <form onSubmit={handleAddFeedback} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>Gi din tilbakemelding</h3>
              <input type="text" placeholder="Ditt navn (valgfritt)" value={fbName} onChange={e => setFbName(e.target.value)} style={inputStyle} /><br/><br/>
              <textarea placeholder="Din kommentar *" value={fbText} onChange={e => setFbText(e.target.value)} style={{ ...inputStyle, height: '60px' }} required /><br/><br/>
              <button type="submit" style={btnStyle}>Send inn</button>
            </form>

            {feedback.map(f => (
              <div key={f.id} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <p style={{ margin: '0 0 8px 0' }}>"{f.text}"</p>
                <small style={{ color: '#8d99ae' }}>– {f.name} ({f.date})</small>
              </div>
            ))}
          </div>
        )}

        {/* FANER: Admin */}
        {activeTab === 'admin' && (
          <div>
            <h2>⚙️ Admin-panel</h2>
            {!isAdmin ? (
              <form onSubmit={handleAdminLogin} style={{ backgroundColor: '#1c2541', padding: '20px', borderRadius: '8px' }}>
                <p>Skriv inn admin-passord for å gjøre endringer:</p>
                <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} placeholder="Passord" style={inputStyle} /><br/><br/>
                <button type="submit" style={btnStyle}>Lås opp Admin</button>
              </form>
            ) : (
              <div>
                <p style={{ color: '#4cc9f0' }}>✅ Du er innlogget som admin!</p>
                <button onClick={handleResetAll} style={{ ...btnStyle, backgroundColor: '#d90429', marginBottom: '20px' }}>🔄 Tilbakestill alt til bildet sitt oppsett</button>

                <h3>Styr trekninger manuelt per flaske</h3>
                {Object.keys(prizes).map(week => {
                  const isDone = !!prizes[week].winner;
                  const hasWinner1 = !!bottle1Winners[week];

                  return (
                    <div key={week} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '12px', borderLeft: '4px solid #f72585' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>{week}:</strong> {isDone ? `Vinnere: ${prizes[week].winner}` : (hasWinner1 ? `Flaske 1: ${bottle1Winners[week]}` : 'Ingen flasker trukket ennå')}
                      </div>

                      {!isDone && (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                          <button 
                            onClick={() => drawSingleBottle(week, 1)} 
                            disabled={hasWinner1} 
                            style={{ ...btnStyle, opacity: hasWinner1 ? 0.4 : 1 }}
                          >
                            🎲 Trekk Flaske 1
                          </button>

                          <button 
                            onClick={() => drawSingleBottle(week, 2)} 
                            disabled={!hasWinner1} 
                            style={{ ...btnStyle, backgroundColor: '#f72585', color: '#fff', opacity: !hasWinner1 ? 0.4 : 1 }}
                          >
                            🎲 Trekk Flaske 2 (Fullfør {week})
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </main>

      {/* POPUP FOR BETALINGSBEKREFTELSE / PÅMINNELSE */}
      {showPaymentConfirmModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', zIndex: 3000 }}>
          <div style={{ backgroundColor: '#1c2541', borderRadius: '12px', padding: '25px', maxWidth: '450px', width: '100%', textAlign: 'center', border: '3px solid #ff5b24' }}>
            <h2 style={{ color: '#ff5b24', margin: '0 0 10px 0' }}>📱 Har du betalt?</h2>
            <p style={{ fontSize: '1.05em', lineHeight: '1.4' }}>
              Du er i ferd med å låse <strong>{totalCartCount} lodd</strong> for <strong>{buyerName}</strong>.
            </p>
            <div style={{ backgroundColor: '#0b132b', padding: '12px', borderRadius: '8px', margin: '15px 0' }}>
              <div style={{ color: '#4cc9f0', fontWeight: 'bold', fontSize: '1.2em' }}>Totalsum: {totalPrice} kr</div>
              <div style={{ fontSize: '0.9em', marginTop: '4px', color: '#aaa' }}>Vipps til: {VIPPS_RECEIVER_NAME} ({VIPPS_NUMBER})</div>
            </div>

            <p style={{ fontSize: '0.95em', color: '#e63946', fontWeight: 'bold' }}>
              Vennligst bekreft at du har Vippset før du låser loddene!
            </p>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button 
                onClick={() => setShowPaymentConfirmModal(false)} 
                style={{ ...btnStyle, backgroundColor: '#3a506b', color: '#fff', flex: 1, padding: '10px' }}
              >
                ❌ Nei, avbryt
              </button>
              
              <button 
                onClick={confirmAndLockTickets} 
                style={{ ...btnStyle, backgroundColor: '#2a9d8f', color: '#fff', flex: 1, padding: '10px', fontSize: '1.05em' }}
              >
                ✅ Ja, jeg har Vippset!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY POPUP FOR VISUELL TREKNING MED LYD */}
      {isDrawing && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.94)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', zIndex: 2000, color: '#fff', padding: '20px' }}>
          <h2>{drawingTitle}</h2>
          
          <div style={{ backgroundColor: '#1c2541', padding: '30px 50px', borderRadius: '20px', border: '4px solid #4cc9f0', textAlign: 'center', margin: '20px 0', minWidth: '220px' }}>
            <div style={{ fontSize: '4.5em', fontWeight: 'bold', color: '#f72585' }}>
              #{animatedTicket}
            </div>
            <div style={{ fontSize: '1.8em', color: '#ffffff', marginTop: '5px' }}>
              {animatedName}
            </div>
          </div>

          {drawingWinnerResult && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5em', color: '#4cc9f0', fontWeight: 'bold', whiteSpace: 'pre-line', marginBottom: '20px' }}>
                {drawingWinnerResult}
              </div>
              <button onClick={() => setIsDrawing(false)} style={{ ...btnStyle, padding: '12px 24px', fontSize: '1.1em' }}>
                ✖ Lukk og gå videre
              </button>
            </div>
          )}
        </div>
      )}

      {/* PREMIE MODAL */}
      {showPrizeModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '15px', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1c2541', borderRadius: '12px', padding: '20px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ margin: 0, color: '#f72585' }}>PREMIER - {selectedWeek}</h3>
              <button onClick={() => setShowPrizeModal(false)} style={{ backgroundColor: 'transparent', border: 'none', color: '#fff', fontSize: '1.2em', cursor: 'pointer' }}>✖ Lukk</button>
            </div>

            <p style={{ fontWeight: 'bold' }}>{prizes[selectedWeek]?.title}</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
              <div style={{ textTransform: 'uppercase', fontSize: '0.8em', color: '#8d99ae' }}>
                <div>Flaske 1</div>
                <div style={{ height: '200px', backgroundColor: '#0b132b', borderRadius: '8px', overflow: 'hidden', marginTop: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {prizes[selectedWeek]?.image1 ? <img src={prizes[selectedWeek].image1} alt="Flaske 1" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /> : <span>Ingen bilde</span>}
                </div>
              </div>
              <div style={{ textTransform: 'uppercase', fontSize: '0.8em', color: '#8d99ae' }}>
                <div>Flaske 2</div>
                <div style={{ height: '200px', backgroundColor: '#0b132b', borderRadius: '8px', overflow: 'hidden', marginTop: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  {prizes[selectedWeek]?.image2 ? <img src={prizes[selectedWeek].image2} alt="Flaske 2" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} /> : <span>Ingen bilde</span>}
                </div>
              </div>
            </div>

            {isAdmin && (
              <div style={{ marginTop: '20px', borderTop: '1px solid #3a506b', paddingTop: '15px' }}>
                <h4>📷 Admin: Endre bilde ({selectedWeek})</h4>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(selectedWeek, 'image1', e.target.files[0])} style={{ fontSize: '0.8em' }} />
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(selectedWeek, 'image2', e.target.files[0])} style={{ fontSize: '0.8em' }} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const navBtnStyle = (active) => ({
  backgroundColor: active ? '#f72585' : '#3a506b',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '20px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9em'
});

const btnStyle = {
  backgroundColor: '#4cc9f0',
  color: '#000000',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  borderRadius: '4px',
  border: '1px solid #3a506b',
  backgroundColor: '#0b132b',
  color: '#fff',
  boxSizing: 'border-box'
};
