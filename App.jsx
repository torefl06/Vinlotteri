import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, onSnapshot, setDoc } from 'firebase/firestore';

// Bildeimport fra src/assets
import vin1 from './src/assets/vin1.jpg';
import vin2 from './src/assets/vin2.jpg';

// Firebase Konfigurasjon
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

const defaultPrizes = {
  "Uke 45": { title: "2 Flasker Utvalgt Vin", image1: vin1, image2: vin2, winner: "" },
  "Uke 46": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 47": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 48": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 49": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 50": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 51": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('lodd');
  const [selectedWeek, setSelectedWeek] = useState('Uke 45');
  const [prizes, setPrizes] = useState(defaultPrizes);
  const [tickets, setTickets] = useState({}); // { "Uke 45": { "Lena": [1, 2], "Tore": [3, 4] } }
  const [tips, setTips] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  // Skjema-tilstander
  const [buyerName, setBuyerName] = useState('');
  const [ticketNumbers, setTicketNumbers] = useState('');
  const [tipName, setTipName] = useState('');
  const [tipWine, setTipWine] = useState('');
  const [tipDesc, setTipDesc] = useState('');
  const [fbName, setFbName] = useState('');
  const [fbText, setFbText] = useState('');

  // Live-synkronisering fra Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "prizes"), (docSnap) => {
      if (docSnap.exists()) setPrizes(docSnap.data());
      else setDoc(doc(db, "vinlotteri", "prizes"), defaultPrizes);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "vinlotteri", "tickets"), (docSnap) => {
      if (docSnap.exists()) setTickets(docSnap.data());
      else setDoc(doc(db, "vinlotteri", "tickets"), {});
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

  // Registrere kjøp av lodd
  const handleRegisterTickets = async (e) => {
    e.preventDefault();
    if (!buyerName || !ticketNumbers) return;

    // Gjør om f.eks "1, 2, 3" eller "1 2 3" til en liste med tall
    const parsedNumbers = ticketNumbers
      .split(/[\s,]+/)
      .map(n => parseInt(n.trim(), 10))
      .filter(n => !isNaN(n));

    if (parsedNumbers.length === 0) {
      alert("Vennligst skriv inn gyldige loddnummer (f.eks. 1, 2, 3)");
      return;
    }

    const currentWeekTickets = tickets[selectedWeek] || {};
    const existingUserTickets = currentWeekTickets[buyerName] || [];
    const updatedUserTickets = [...new Set([...existingUserTickets, ...parsedNumbers])];

    const updatedTickets = {
      ...tickets,
      [selectedWeek]: {
        ...currentWeekTickets,
        [buyerName]: updatedUserTickets
      }
    };

    setTickets(updatedTickets);
    await setDoc(doc(db, "vinlotteri", "tickets"), updatedTickets);
    setBuyerName('');
    setTicketNumbers('');
  };

  const handleDrawWinner = async (week) => {
    const weekTickets = tickets[week];
    if (!weekTickets || Object.keys(weekTickets).length === 0) {
      alert("Ingen har registrert lodd for denne uken ennå!");
      return;
    }
    const participants = Object.keys(weekTickets);
    const randomWinner = participants[Math.floor(Math.random() * participants.length)];
    
    const updatedPrizes = {
      ...prizes,
      [week]: { ...prizes[week], winner: randomWinner }
    };
    setPrizes(updatedPrizes);
    await setDoc(doc(db, "vinlotteri", "prizes"), updatedPrizes);
  };

  const handleAddTip = async (e) => {
    e.preventDefault();
    if (!tipWine || !tipDesc) return;
    const newTip = { id: Date.now(), name: tipName || 'Anonym', wine: tipWine, desc: tipDesc, date: new Date().toLocaleDateString('no-NO') };
    const updated = [newTip, ...tips];
    setTips(updated);
    await setDoc(doc(db, "vinlotteri", "tips"), { list: updated });
    setTipName(''); setTipWine(''); setTipDesc('');
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
    if (window.confirm("Er du sikker på at du vil tilbakestille alle lodd, premier, tips og ris/ros?")) {
      await setDoc(doc(db, "vinlotteri", "prizes"), defaultPrizes);
      await setDoc(doc(db, "vinlotteri", "tickets"), {});
      await setDoc(doc(db, "vinlotteri", "tips"), { list: [] });
      await setDoc(doc(db, "vinlotteri", "feedback"), { list: [] });
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

  return (
    <div style={{ backgroundColor: '#0b132b', color: '#ffffff', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Header */}
      <header style={{ padding: '20px', textAlign: 'center', backgroundColor: '#1c2541', borderBottom: '2px solid #3a506b' }}>
        <h1 style={{ margin: 0, color: '#f72585' }}>🍷 Digitalt Vinlotteri</h1>
        <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('lodd')} style={navBtnStyle(activeTab === 'lodd')}>🎟️ Mine Lodd</button>
          <button onClick={() => setShowPrizeModal(true)} style={navBtnStyle(false)}>🏆 Premier</button>
          <button onClick={() => setActiveTab('tips')} style={navBtnStyle(activeTab === 'tips')}>🍾 Vintips</button>
          <button onClick={() => setActiveTab('feedback')} style={navBtnStyle(activeTab === 'feedback')}>💬 Ris & Ros</button>
          <button onClick={() => setActiveTab('admin')} style={navBtnStyle(activeTab === 'admin')}>⚙️ Admin</button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '20px auto', padding: '0 15px' }}>
        
        {/* FANER */}
        {activeTab === 'lodd' && (
          <div>
            <h2>🎟️ Registrer og Se Lodd</h2>
            <div style={{ marginBottom: '15px' }}>
              <label>Velg Uke: </label>
              <select value={selectedWeek} onChange={(e) => setSelectedWeek(e.target.value)} style={inputStyle}>
                {Object.keys(defaultPrizes).map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>

            {prizes[selectedWeek]?.winner && (
              <div style={{ padding: '15px', backgroundColor: '#4cc9f0', color: '#000', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: 'bold' }}>
                🎉 Vinner av {selectedWeek}: {prizes[selectedWeek].winner}! 🎉
              </div>
            )}

            {/* Skjema for å kjøpe / registrere lodd */}
            <form onSubmit={handleRegisterTickets} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>Registrer dine lodd ({selectedWeek})</h3>
              <input type="text" placeholder="Ditt Navn *" value={buyerName} onChange={e => setBuyerName(e.target.value)} style={inputStyle} required /><br/><br/>
              <input type="text" placeholder="Loddnummer (f.eks: 5, 12, 18) *" value={ticketNumbers} onChange={e => setTicketNumbers(e.target.value)} style={inputStyle} required /><br/><br/>
              <button type="submit" style={btnStyle}>Lagre mine lodd</button>
            </form>

            <h3>Oversikt over kjente lodd i {selectedWeek}</h3>
            {(!tickets[selectedWeek] || Object.keys(tickets[selectedWeek]).length === 0) ? (
              <p style={{ color: '#8d99ae' }}>Ingen har registrert lodd for denne uken ennå. Bli den første!</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                {Object.entries(tickets[selectedWeek]).map(([person, lodd]) => (
                  <div key={person} style={{ backgroundColor: '#1c2541', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #4cc9f0' }}>
                    <strong>{person}</strong>
                    <div style={{ fontSize: '0.9em', color: '#4cc9f0', marginTop: '4px' }}>Lodd: {lodd.join(', ')}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tips' && (
          <div>
            <h2>🍾 Vintips fra Kollegaer</h2>
            <form onSubmit={handleAddTip} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>Send inn ditt vintips</h3>
              <input type="text" placeholder="Ditt navn (valgfritt)" value={tipName} onChange={e => setTipName(e.target.value)} style={inputStyle} /><br/><br/>
              <input type="text" placeholder="Vinens navn *" value={tipWine} onChange={e => setTipWine(e.target.value)} style={inputStyle} required /><br/><br/>
              <textarea placeholder="Hvorfor anbefaler du denne? *" value={tipDesc} onChange={e => setTipDesc(e.target.value)} style={{ ...inputStyle, height: '60px' }} required /><br/><br/>
              <button type="submit" style={btnStyle}>Legg til Vintips</button>
            </form>

            {tips.length === 0 ? <p style={{ color: '#8d99ae' }}>Ingen vintips lagt inn ennå.</p> : tips.map(t => (
              <div key={t.id} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#f72585' }}>{t.wine}</h4>
                <p style={{ margin: '0 0 8px 0' }}>{t.desc}</p>
                <small style={{ color: '#8d99ae' }}>Innsendt av {t.name} – {t.date}</small>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            <h2>💬 Ris & Ros</h2>
            <form onSubmit={handleAddFeedback} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
              <h3>Gi din tilbakemelding</h3>
              <input type="text" placeholder="Ditt navn (valgfritt)" value={fbName} onChange={e => setFbName(e.target.value)} style={inputStyle} /><br/><br/>
              <textarea placeholder="Din kommentar *" value={fbText} onChange={e => setFbText(e.target.value)} style={{ ...inputStyle, height: '60px' }} required /><br/><br/>
              <button type="submit" style={btnStyle}>Send inn</button>
            </form>

            {feedback.length === 0 ? <p style={{ color: '#8d99ae' }}>Ingen tilbakemeldinger lagt inn ennå.</p> : feedback.map(f => (
              <div key={f.id} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <p style={{ margin: '0 0 8px 0' }}>"{f.text}"</p>
                <small style={{ color: '#8d99ae' }}>– {f.name} ({f.date})</small>
              </div>
            ))}
          </div>
        )}

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
                <button onClick={handleResetAll} style={{ ...btnStyle, backgroundColor: '#d90429', marginBottom: '20px' }}>🔄 Tilbakestill alt til standard</button>

                <h3>Trekk Vinner</h3>
                {Object.keys(prizes).map(week => (
                  <div key={week} style={{ backgroundColor: '#1c2541', padding: '10px 15px', borderRadius: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>{week}:</strong> {prizes[week].winner ? `Vinner: ${prizes[week].winner}` : 'Ingen vinner trukket'}</span>
                    <button onClick={() => handleDrawWinner(week)} style={btnStyle}>🎲 Trekk vinner</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

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
