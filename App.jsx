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

const navBtnStyle = (active) => ({
  backgroundColor: active ? '#f72585' : '#3a506b',
  color: '#fff',
  border: 'none',
  padding: '8px 14px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
  fontSize: '0.9em'
});

const inputStyle = {
  backgroundColor: '#0b132b',
  color: '#fff',
  border: '1px solid #3a506b',
  padding: '10px',
  borderRadius: '6px',
  width: '100%',
  boxSizing: 'border-box'
};

const btnStyle = {
  backgroundColor: '#f72585',
  color: '#fff',
  border: 'none',
  padding: '10px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold'
};

const sortWeeks = (weeksArray) => {
  return [...weeksArray].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10) || 0;
    const numB = parseInt(b.replace(/\D/g, ''), 10) || 0;
    return numA - numB;
  });
};

const getAudioContext = () => new (window.AudioContext || window.webkitAudioContext)();

const playSoftDrumroll = () => {
  try {
    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, ctx.currentTime);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, ctx.currentTime);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 2.5);
  } catch (e) { console.log(e); }
};

const playSuspenseChime = () => {
  try {
    const ctx = getAudioContext();
    const notes = [130.81, 164.81, 196.00]; 
    notes.forEach(freq => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, ctx.currentTime);

      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 2.0);
    });
  } catch (e) { console.log(e); }
};

const playHarmonicFanfare = () => {
  try {
    const ctx = getAudioContext();
    const chords = [
      { freqs: [261.63, 329.63, 392.00], time: 0, duration: 0.5 },
      { freqs: [329.63, 392.00, 523.25], time: 0.4, duration: 1.8 }
    ];

    chords.forEach(chord => {
      chord.freqs.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + chord.time);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime + chord.time);

        gain.gain.setValueAtTime(0.05, ctx.currentTime + chord.time);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + chord.time + chord.duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + chord.time);
        osc.stop(ctx.currentTime + chord.time + chord.duration);
      });
    });
  } catch (e) { console.log(e); }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('lodd');
  const [prizes, setPrizes] = useState(defaultPrizes);
  const [tickets, setTickets] = useState(initialTicketsFromImage);
  const [tips, setTips] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showPrizeModal, setShowPrizeModal] = useState(false);

  // Admin & Regnskap Auth
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAccountingUnlocked, setIsAccountingUnlocked] = useState(false);
  const [accountingPassword, setAccountingPassword] = useState('');

  const [bottle1Winners, setBottle1Winners] = useState({});
  const [bottle2Winners, setBottle2Winners] = useState({});

  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingTitle, setDrawingTitle] = useState('');
  const [animatedTicket, setAnimatedTicket] = useState(null);
  const [drawStep, setDrawStep] = useState(1);
  const [revealedWinnerName, setRevealedWinnerName] = useState('');

  const allWeeksSorted = sortWeeks(Object.keys(defaultPrizes));
  const activeWeeks = sortWeeks(Object.keys(defaultPrizes).filter(w => !prizes[w]?.winner));
  const completedWeeks = sortWeeks(Object.keys(defaultPrizes).filter(w => !!prizes[w]?.winner));

  const [selectedWeek, setSelectedWeek] = useState(activeWeeks[0] || 'Uke 46');
  const [cart, setCart] = useState({});
  const [buyerName, setBuyerName] = useState('');

  const [tipName, setTipName] = useState('');
  const [tipWine, setTipWine] = useState('');
  const [tipPrice, setTipPrice] = useState('');
  const [tipDesc, setTipDesc] = useState('');
  
  const [fbName, setFbName] = useState('');
  const [fbText, setFbText] = useState('');
  const [replyInput, setReplyInput] = useState({});

  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');

  useEffect(() => {
    if (prizes[selectedWeek]?.winner && activeWeeks.length > 0) {
      setSelectedWeek(activeWeeks[0]);
    }
  }, [prizes]);

  // Sanntidslyttere uten automatisk nullstilling
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "prizes"), (docSnap) => {
      if (docSnap.exists()) setPrizes(docSnap.data());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "tickets"), (docSnap) => {
      if (docSnap.exists()) setTickets(docSnap.data());
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "tips"), (docSnap) => {
      if (docSnap.exists()) setTips(docSnap.data().list || []);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "feedback"), (docSnap) => {
      if (docSnap.exists()) setFeedback(docSnap.data().list || []);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "expenses"), (docSnap) => {
      if (docSnap.exists()) setExpenses(docSnap.data().list || []);
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

  const handleLockTickets = async (e) => {
    e.preventDefault();

    if (!buyerName.trim()) {
      alert("Vennligst skriv inn navnet ditt.");
      return;
    }
    if (totalCartCount === 0) {
      alert("Vennligst velg minst ett ledig grønt lodd.");
      return;
    }

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
    
    alert(`Gratulerer ${buyerName}! Deres ${totalCartCount} lodd er nå låst og lagret. Lykke til!`);
    setCart({});
  };

  const drawSingleBottle = (week, bottleNumber) => {
    const weekTickets = tickets[week] || {};
    let availableTicketNumbers = Object.keys(weekTickets);

    if (bottleNumber === 2 && bottle1Winners[week]) {
      const match = bottle1Winners[week].match(/Lodd #(\d+)/);
      if (match && match[1]) {
        const winningTicket1 = match[1];
        availableTicketNumbers = availableTicketNumbers.filter(n => n !== winningTicket1);
      }
    }

    if (availableTicketNumbers.length === 0) {
      alert("Det er ingen ledige lodd å trekke fra!");
      return;
    }

    setIsDrawing(true);
    setDrawStep(1);
    setDrawingTitle(`🍾 TREKKER FLASKE ${bottleNumber} (${week})`);
    setRevealedWinnerName('');
    playSoftDrumroll();

    let counter = 0;
    const interval = setInterval(() => {
      const randomTicket = availableTicketNumbers[Math.floor(Math.random() * availableTicketNumbers.length)];
      setAnimatedTicket(randomTicket);
      counter++;

      if (counter > 25) {
        clearInterval(interval);
        
        const winningTicket = availableTicketNumbers[Math.floor(Math.random() * availableTicketNumbers.length)];
        const winnerName = weekTickets[winningTicket];
        const winnerString = `${winnerName} (Lodd #${winningTicket})`;

        setAnimatedTicket(winningTicket);
        
        setDrawStep(2);
        playSuspenseChime();

        setTimeout(() => {
          setDrawStep(3);
          setRevealedWinnerName(winnerName);
          playHarmonicFanfare();

          if (bottleNumber === 1) {
            setBottle1Winners({ ...bottle1Winners, [week]: winnerString });
          } else if (bottleNumber === 2) {
            setBottle2Winners({ ...bottle2Winners, [week]: winnerString });
          }
        }, 2500);
      }
    }, 100);
  };

  const finalizeDraw = async (week) => {
    const w1 = bottle1Winners[week];
    const w2 = bottle2Winners[week];

    if (!w1 || !w2) {
      alert("Du må trekke både Flaske 1 og Flaske 2 før du fullfører trekningen.");
      return;
    }

    const finalWinnersText = `${w1} og ${w2}`;
    const updatedPrizes = {
      ...prizes,
      [week]: { ...(prizes[week] || {}), winner: finalWinnersText }
    };

    setPrizes(updatedPrizes);
    await setDoc(doc(db, "vinlotteri", "prizes"), updatedPrizes);

    alert(`Trekningen for ${week} er nå fullført og lagret! Vinnerne er synlige i Vinnere-fanen.`);
  };

  // DIREKTE ANNULLERING I FIRESTORE
  const undoCompletedWeekDraw = async (week) => {
    if (window.confirm(`Vil du annullere den lagrede trekningen for ${week} slik at du kan trekke på nytt?`)) {
      const updatedPrizes = {
        ...prizes,
        [week]: { ...(prizes[week] || {}), winner: "" }
      };

      const updatedB1 = { ...bottle1Winners };
      const updatedB2 = { ...bottle2Winners };
      delete updatedB1[week];
      delete updatedB2[week];

      setBottle1Winners(updatedB1);
      setBottle2Winners(updatedB2);
      setPrizes(updatedPrizes);
      await setDoc(doc(db, "vinlotteri", "prizes"), updatedPrizes);

      setSelectedWeek(week);
      alert(`Trekningen for ${week} er annullert! Uken er åpnet i Admin for ny trekning.`);
    }
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
    await setDoc(doc(db, "vinlotteri", "tips"), { list: updated });
    setTipName(''); setTipWine(''); setTipPrice(''); setTipDesc('');
  };

  const handleDeleteTip = async (idToDelete) => {
    if (!window.confirm("Vil du slette dette vintipset?")) return;
    const updated = tips.filter(t => t.id !== idToDelete);
    setTips(updated);
    await setDoc(doc(db, "vinlotteri", "tips"), { list: updated });
  };

  const handleEditTip = async (tip) => {
    const newWine = window.prompt("Rediger vinens navn:", tip.wine);
    if (newWine === null) return;
    const newPrice = window.prompt("Rediger pris (f.eks. 189 kr):", tip.price || "");
    if (newPrice === null) return;
    const newDesc = window.prompt("Rediger beskrivelse:", tip.desc);
    if (newDesc === null) return;

    const updated = tips.map(t => t.id === tip.id ? { ...t, wine: newWine, price: newPrice, desc: newDesc } : t);
    setTips(updated);
    await setDoc(doc(db, "vinlotteri", "tips"), { list: updated });
  };

  const handleAddFeedback = async (e) => {
    e.preventDefault();
    if (!fbText) return;
    const newFb = { 
      id: Date.now(), 
      name: fbName || 'Anonym', 
      text: fbText, 
      replies: [], 
      date: new Date().toLocaleDateString('no-NO') 
    };
    const updated = [newFb, ...feedback];
    await setDoc(doc(db, "vinlotteri", "feedback"), { list: updated });
    setFbName(''); setFbText('');
  };

  const handleDeleteFeedback = async (idToDelete) => {
    if (!window.confirm("Vil du slette denne tilbakemeldingen?")) return;
    const updated = feedback.filter(f => f.id !== idToDelete);
    setFeedback(updated);
    await setDoc(doc(db, "vinlotteri", "feedback"), { list: updated });
  };

  const handleEditFeedback = async (item) => {
    const currentText = typeof item === 'object' ? item.text : item;
    const newText = window.prompt("Rediger kommentar:", currentText);
    if (newText === null) return;

    const updated = feedback.map(f => {
      if (f.id === item.id) {
        return typeof f === 'object' ? { ...f, text: newText } : { id: Date.now(), name: 'Anonym', text: newText, replies: [] };
      }
      return f;
    });
    setFeedback(updated);
    await setDoc(doc(db, "vinlotteri", "feedback"), { list: updated });
  };

  const handleAddReply = async (feedbackId) => {
    const text = replyInput[feedbackId];
    if (!text || !text.trim()) return;

    const replyAuthor = buyerName || fbName || "Anonym";
    const newReply = {
      id: Date.now(),
      name: replyAuthor,
      text: text.trim(),
      date: new Date().toLocaleDateString('no-NO')
    };

    const updated = feedback.map(f => {
      if (f.id === feedbackId) {
        const currentItem = typeof f === 'object' ? f : { id: feedbackId, name: 'Anonym', text: f, replies: [] };
        return {
          ...currentItem,
          replies: [...(currentItem.replies || []), newReply]
        };
      }
      return f;
    });

    setFeedback(updated);
    setReplyInput({ ...replyInput, [feedbackId]: '' });
    await setDoc(doc(db, "vinlotteri", "feedback"), { list: updated });
  };

  const handleAdminTabClick = () => {
    if (activeTab === 'admin' && isAdmin) {
      if (window.confirm("Vil du logge ut som admin?")) {
        setIsAdmin(false);
        setIsAccountingUnlocked(false);
        setAdminPassword('');
        setAccountingPassword('');
        alert("Du er nå logget ut.");
      }
    } else {
      setActiveTab('admin');
    }
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (adminPassword === 'vinlotteri26') {
      if (window.confirm("Vil du logge inn som admin?")) {
        setIsAdmin(true);
        alert('Logget inn som admin!');
      }
    } else {
      alert('Feil passord!');
    }
  };

  const handleAccountingLogin = (e) => {
    e.preventDefault();
    if (accountingPassword === 'vinlotteri26') {
      setIsAccountingUnlocked(true);
    } else {
      alert('Feil passord for regnskap!');
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    const newExpense = {
      id: Date.now(),
      title: expenseTitle,
      amount: parseFloat(expenseAmount) || 0,
      date: new Date().toLocaleDateString('no-NO')
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    setExpenseTitle('');
    setExpenseAmount('');
    await setDoc(doc(db, "vinlotteri", "expenses"), { list: updated });
  };

  const handleDeleteExpense = async (idToDelete) => {
    if (!window.confirm("Vil du slette denne utgiften?")) return;
    const updated = expenses.filter(e => e.id !== idToDelete);
    setExpenses(updated);
    await setDoc(doc(db, "vinlotteri", "expenses"), { list: updated });
  };

  // DOBBEL BEKREFTELSE FOR TILBAKESTILLING
  const handleResetAll = async () => {
    const confirmationText = window.prompt("ADVARSEL: Dette vil slette ALLE registrerte lodd, vinnere, tips og utgifter. Skriv 'SLETT' for å bekrefte:");
    if (confirmationText === "SLETT") {
      await setDoc(doc(db, "vinlotteri", "prizes"), defaultPrizes);
      await setDoc(doc(db, "vinlotteri", "tickets"), initialTicketsFromImage);
      await setDoc(doc(db, "vinlotteri", "tips"), { list: [] });
      await setDoc(doc(db, "vinlotteri", "feedback"), { list: [] });
      await setDoc(doc(db, "vinlotteri", "expenses"), { list: [] });
      setBottle1Winners({});
      setBottle2Winners({});
      alert("Alt er tilbakestilt.");
    }
  };

  const handleImageUpload = (week, field, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 500;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = MAX_WIDTH;
        canvas.height = img.height * scaleSize;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);

        const updated = {
          ...prizes,
          [week]: { ...(prizes[week] || {}), [field]: compressedBase64 }
        };
        setPrizes(updated);
        await setDoc(doc(db, "vinlotteri", "prizes"), updated);
      };
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

  const calculateTotalTicketIncome = () => {
    let totalTicketsCount = 0;
    Object.values(tickets).forEach(weekTickets => {
      totalTicketsCount += Object.keys(weekTickets || {}).length;
    });
    return totalTicketsCount * TICKET_PRICE;
  };

  const totalIncome = calculateTotalTicketIncome();
  const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
  const netBalance = totalIncome - totalExpenses;

  return (
    <div style={{ backgroundColor: '#0b132b', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <header style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1c2541', borderBottom: '2px solid #3a506b' }}>
        <h1 style={{ margin: 0, color: '#f72585' }}>🍷 Digitalt Vinlotteri</h1>
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('lodd')} style={navBtnStyle(activeTab === 'lodd')}>🎟️ Velg Lodd</button>
          <button onClick={() => setActiveTab('vinnere')} style={navBtnStyle(activeTab === 'vinnere')}>🏆 Vinnere</button>
          <button onClick={() => setShowPrizeModal(true)} style={navBtnStyle(showPrizeModal)}>🎁 Premier</button>
          <button onClick={() => setActiveTab('tips')} style={navBtnStyle(activeTab === 'tips')}>🍾 Vintips</button>
          <button onClick={() => setActiveTab('feedback')} style={navBtnStyle(activeTab === 'feedback')}>💬 Ris & Ros</button>
          <button onClick={handleAdminTabClick} style={navBtnStyle(activeTab === 'admin')}>
            {isAdmin ? '🔒 Logg ut Admin' : '⚙️ Admin'}
          </button>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '20px auto', padding: '0 15px' }}>
        
        {/* ANIMASJONSMODAL FOR TREKNING */}
        {isDrawing && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
            <div style={{ backgroundColor: '#1c2541', padding: '30px', borderRadius: '15px', textAlign: 'center', maxWidth: '400px', width: '90%', border: '3px solid #f72585' }}>
              <h2 style={{ color: '#4cc9f0', margin: '0 0 15px 0' }}>{drawingTitle}</h2>
              
              {drawStep === 1 && (
                <div>
                  <div style={{ fontSize: '4em', fontWeight: 'bold', color: '#f72585', margin: '20px 0' }}>
                    #{animatedTicket}
                  </div>
                  <p style={{ color: '#8d99ae' }}>Trommehvirvel... 🥁</p>
                </div>
              )}

              {drawStep === 2 && (
                <div>
                  <div style={{ fontSize: '4em', fontWeight: 'bold', color: '#ffb703', margin: '20px 0' }}>
                    #{animatedTicket}
                  </div>
                  <p style={{ color: '#ffb703', fontWeight: 'bold' }}>Sjekker navnet på loddet...</p>
                </div>
              )}

              {drawStep === 3 && (
                <div>
                  <div style={{ fontSize: '2em', color: '#4cc9f0', marginBottom: '5px' }}>Lodd #{animatedTicket}</div>
                  <div style={{ fontSize: '2.5em', fontWeight: 'bold', color: '#2a9d8f', margin: '15px 0' }}>
                    🎉 {revealedWinnerName} 🎉
                  </div>
                  <button 
                    onClick={() => setIsDrawing(false)} 
                    style={{ ...btnStyle, backgroundColor: '#2a9d8f', marginTop: '15px', width: '100%', padding: '12px' }}
                  >
                    Neste / Lukk
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL FOR PREMIER */}
        {showPrizeModal && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '15px' }}>
            <div style={{ backgroundColor: '#1c2541', padding: '25px', borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '2px solid #f72585' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <h2 style={{ margin: 0, color: '#f72585' }}>🎁 Premier for {selectedWeek}</h2>
                <button onClick={() => setShowPrizeModal(false)} style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>✖ Lukk</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div style={{ textAlign: 'center', backgroundColor: '#0b132b', padding: '10px', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#4cc9f0' }}>Flaske 1</h4>
                  {prizes[selectedWeek]?.image1 ? (
                    <img src={prizes[selectedWeek].image1} alt="Premie 1" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }} />
                  ) : (
                    <div style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8d99ae', border: '1px dashed #3a506b', borderRadius: '6px' }}>Ingen bilde enda</div>
                  )}
                  {isAdmin && (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(selectedWeek, 'image1', e.target.files[0])} style={{ marginTop: '8px', fontSize: '0.75em', width: '100%' }} />
                  )}
                </div>

                <div style={{ textAlign: 'center', backgroundColor: '#0b132b', padding: '10px', borderRadius: '8px' }}>
                  <h4 style={{ margin: '0 0 8px 0', color: '#4cc9f0' }}>Flaske 2</h4>
                  {prizes[selectedWeek]?.image2 ? (
                    <img src={prizes[selectedWeek].image2} alt="Premie 2" style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }} />
                  ) : (
                    <div style={{ height: '180px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#8d99ae', border: '1px dashed #3a506b', borderRadius: '6px' }}>Ingen bilde enda</div>
                  )}
                  {isAdmin && (
                    <input type="file" accept="image/*" onChange={(e) => handleImageUpload(selectedWeek, 'image2', e.target.files[0])} style={{ marginTop: '8px', fontSize: '0.75em', width: '100%' }} />
                  )}
                </div>
              </div>

              {prizes[selectedWeek]?.winner && (
                <div style={{ backgroundColor: '#2a9d8f', padding: '10px', borderRadius: '6px', textAlign: 'center', fontWeight: 'bold' }}>
                  🏆 Vinner i {selectedWeek}: {prizes[selectedWeek].winner}
                </div>
              )}
            </div>
          </div>
        )}

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

                <form onSubmit={handleLockTickets} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
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

        {/* FANER: Vintips */}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {t.price && <span style={{ backgroundColor: '#2a9d8f', padding: '3px 8px', borderRadius: '12px', fontSize: '0.85em', fontWeight: 'bold' }}>🏷️ {t.price}</span>}
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEditTip(t)} style={{ backgroundColor: '#3a506b', color: '#4cc9f0', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>Rediger</button>
                        <button onClick={() => handleDeleteTip(t.id)} style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>Slett</button>
                      </div>
                    )}
                  </div>
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

            {feedback.map(f => {
              const isObj = typeof f === 'object' && f !== null;
              const fId = isObj ? f.id : f;
              const text = isObj ? f.text : f;
              const name = isObj ? (f.name || 'Anonym') : 'Anonym';
              const date = isObj ? f.date : '';
              const replies = isObj && f.replies ? f.replies : [];

              return (
                <div key={fId} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '12px', borderLeft: '4px solid #4cc9f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <p style={{ margin: '0 0 8px 0', fontSize: '1.05em' }}>"{text}"</p>
                    {isAdmin && (
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => handleEditFeedback(f)} style={{ backgroundColor: '#3a506b', color: '#4cc9f0', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>Rediger</button>
                        <button onClick={() => handleDeleteFeedback(fId)} style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8em' }}>Slett</button>
                      </div>
                    )}
                  </div>
                  <small style={{ color: '#8d99ae' }}>– {name} {date && `(${date})`}</small>

                  {replies.length > 0 && (
                    <div style={{ marginTop: '10px', paddingLeft: '12px', borderLeft: '2px solid #3a506b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {replies.map(r => (
                        <div key={r.id} style={{ backgroundColor: '#0b132b', padding: '8px 10px', borderRadius: '6px', fontSize: '0.9em' }}>
                          <strong style={{ color: '#4cc9f0' }}>{r.name}: </strong>
                          <span>{r.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Skriv et svar..."
                      value={replyInput[fId] || ''}
                      onChange={e => setReplyInput({ ...replyInput, [fId]: e.target.value })}
                      style={{ ...inputStyle, padding: '6px 10px', fontSize: '0.85em' }}
                      onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddReply(fId))}
                    />
                    <button
                      type="button"
                      onClick={() => handleAddReply(fId)}
                      style={{ ...btnStyle, padding: '6px 12px', fontSize: '0.85em', backgroundColor: '#3a506b' }}
                    >
                      Svar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FANER: Admin & Beskyttet Regnskap */}
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <p style={{ color: '#4cc9f0', margin: 0 }}>✅ Du er innlogget som admin!</p>
                  <button 
                    onClick={() => {
                      if (window.confirm("Vil du logge ut som admin?")) {
                        setIsAdmin(false);
                        setIsAccountingUnlocked(false);
                        setAdminPassword('');
                        setAccountingPassword('');
                        alert("Du er nå logget ut.");
                      }
                    }} 
                    style={{ ...btnStyle, backgroundColor: '#e63946', fontSize: '0.85em' }}
                  >
                    🔒 Logg ut Admin
                  </button>
                </div>

                <button onClick={handleResetAll} style={{ ...btnStyle, backgroundColor: '#d90429', marginBottom: '25px' }}>⚠️ Tilbakestill alt (Krever passord-bekreftelse)</button>

                {/* SEKSJON: KRONOLOGISK TREKNING */}
                <h3 style={{ borderBottom: '2px solid #3a506b', paddingBottom: '8px' }}>🎲 Styr trekninger manuelt per flaske</h3>
                {allWeeksSorted.map(week => {
                  const isDone = !!prizes[week]?.winner;
                  const hasWinner1 = !!bottle1Winners[week];
                  const hasWinner2 = !!bottle2Winners[week];

                  return (
                    <div key={week} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '12px', borderLeft: '4px solid #f72585' }}>
                      <div style={{ marginBottom: '8px' }}>
                        <strong>{week}:</strong> {isDone ? `Vinnere: ${prizes[week].winner}` : (hasWinner1 ? (hasWinner2 ? `Flaske 1: ${bottle1Winners[week]} | Flaske 2: ${bottle2Winners[week]}` : `Flaske 1: ${bottle1Winners[week]}`) : 'Ingen flasker trukket ennå')}
                      </div>

                      {!isDone ? (
                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                          <button 
                            onClick={() => drawSingleBottle(week, 1)} 
                            disabled={hasWinner1} 
                            style={{ ...btnStyle, opacity: hasWinner1 ? 0.4 : 1 }}
                          >
                            🎲 Trekk Flaske 1
                          </button>
                          <button 
                            onClick={() => drawSingleBottle(week, 2)} 
                            disabled={!hasWinner1 || hasWinner2} 
                            style={{ ...btnStyle, opacity: (!hasWinner1 || hasWinner2) ? 0.4 : 1 }}
                          >
                            🎲 Trekk Flaske 2
                          </button>

                          {hasWinner1 && hasWinner2 && (
                            <button 
                              onClick={() => finalizeDraw(week)} 
                              style={{ ...btnStyle, backgroundColor: '#2a9d8f' }}
                            >
                              🔒 Fullfør & Lagre Vinnere for {week}
                            </button>
                          )}
                        </div>
                      ) : (
                        <button onClick={() => undoCompletedWeekDraw(week)} style={{ ...btnStyle, backgroundColor: '#e63946', fontSize: '0.85em' }}>
                          ↩️ Annuller trekning
                        </button>
                      )}
                    </div>
                  );
                })}

                {/* SEKSJON: BESKYTTET REGNSKAP */}
                <div style={{ marginTop: '40px', backgroundColor: '#1c2541', padding: '20px', borderRadius: '12px', border: '2px solid #4cc9f0' }}>
                  <h3 style={{ margin: '0 0 15px 0', color: '#4cc9f0' }}>📊 Vinkassen & Regnskap (Låst)</h3>

                  {!isAccountingUnlocked ? (
                    <form onSubmit={handleAccountingLogin} style={{ backgroundColor: '#0b132b', padding: '15px', borderRadius: '8px' }}>
                      <p style={{ margin: '0 0 10px 0', fontSize: '0.95em' }}>🔒 Skriv inn passord på nytt for å låse opp regnskapet:</p>
                      <input 
                        type="password" 
                        value={accountingPassword} 
                        onChange={e => setAccountingPassword(e.target.value)} 
                        placeholder="Passord for regnskap" 
                        style={inputStyle} 
                      /><br/><br/>
                      <button type="submit" style={{ ...btnStyle, backgroundColor: '#4cc9f0', color: '#0b132b' }}>
                        🔓 Lås opp Regnskap
                      </button>
                    </form>
                  ) : (
                    <div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '20px' }}>
                        <div style={{ backgroundColor: '#0b132b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #2a9d8f' }}>
                          <small style={{ color: '#8d99ae' }}>Totalt Inn (Kjøpte lodd):</small>
                          <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#2a9d8f' }}>{totalIncome} kr</div>
                        </div>

                        <div style={{ backgroundColor: '#0b132b', padding: '12px', borderRadius: '8px', borderLeft: '4px solid #e63946' }}>
                          <small style={{ color: '#8d99ae' }}>Totalt Ut (Vinkjøp):</small>
                          <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: '#e63946' }}>{totalExpenses} kr</div>
                        </div>

                        <div style={{ backgroundColor: '#0b132b', padding: '12px', borderRadius: '8px', borderLeft: `4px solid ${netBalance >= 0 ? '#4cc9f0' : '#e63946'}` }}>
                          <small style={{ color: '#8d99ae' }}>Netto Saldo (Kasse):</small>
                          <div style={{ fontSize: '1.4em', fontWeight: 'bold', color: netBalance >= 0 ? '#4cc9f0' : '#e63946' }}>{netBalance} kr</div>
                        </div>
                      </div>

                      <h4 style={{ margin: '0 0 10px 0', color: '#4cc9f0' }}>Legg til utgift (Kjøpt vin)</h4>
                      <form onSubmit={handleAddExpense} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        <input 
                          type="text" 
                          placeholder="Beskrivelse (f.eks. Vinmonopolet uke 47)" 
                          value={expenseTitle} 
                          onChange={e => setExpenseTitle(e.target.value)} 
                          style={{ ...inputStyle, flex: '2', minWidth: '180px' }} 
                          required 
                        />
                        <input 
                          type="number" 
                          placeholder="Beløp (kr)" 
                          value={expenseAmount} 
                          onChange={e => setExpenseAmount(e.target.value)} 
                          style={{ ...inputStyle, flex: '1', minWidth: '100px' }} 
                          required 
                        />
                        <button type="submit" style={{ ...btnStyle, backgroundColor: '#2a9d8f' }}>+ Registrer</button>
                      </form>

                      <h4 style={{ margin: '0 0 10px 0', color: '#8d99ae' }}>Registrerte Utgifter</h4>
                      {expenses.length === 0 ? (
                        <p style={{ color: '#8d99ae', fontSize: '0.9em' }}>Ingen utgifter er registrert ennå.</p>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {expenses.map(e => (
                            <div key={e.id} style={{ backgroundColor: '#0b132b', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div>
                                <strong>{e.title}</strong>
                                <div style={{ fontSize: '0.8em', color: '#8d99ae' }}>{e.date}</div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ color: '#e63946', fontWeight: 'bold' }}>-{e.amount} kr</span>
                                <button onClick={() => handleDeleteExpense(e.id)} style={{ backgroundColor: '#e63946', color: '#fff', border: 'none', padding: '3px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75em' }}>Slett</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <h4 style={{ margin: '20px 0 10px 0', color: '#8d99ae' }}>Innbetalt per uke</h4>
                      <div style={{ backgroundColor: '#0b132b', padding: '10px', borderRadius: '6px', fontSize: '0.9em' }}>
                        {allWeeksSorted.map(w => {
                          const count = Object.keys(tickets[w] || {}).length;
                          return (
                            <div key={w} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #1c2541' }}>
                              <span>{w}:</span>
                              <span>{count} lodd ({count * TICKET_PRICE} kr)</span>
                            </div>
                          );
                        })}
                      </div>

                    </div>
                  )}
                </div>

              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
