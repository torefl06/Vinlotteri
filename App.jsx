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

// Standard uker og premier (Uke 45 er ferdig med Rene G og Tore)
const defaultPrizes = {
  "Uke 45": { title: "2 Flasker Utvalgt Vin", image1: vin1, image2: vin2, winner: "Rene G og Tore" },
  "Uke 46": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 47": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 48": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 49": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 50": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" },
  "Uke 51": { title: "2 Flasker Utvalgt Vin", image1: "", image2: "", winner: "" }
};

export default function App() {
  const [activeTab, setActiveTab] = useState('lodd');
  const [prizes, setPrizes] = useState(defaultPrizes);
  const [tickets, setTickets] = useState({});
  const [tips, setTips] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [showPrizeModal, setShowPrizeModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');

  // Filtrer bort uker som har vinnere fra "Kjøp lodd"-valget
  const activeWeeks = Object.keys(defaultPrizes).filter(w => !prizes[w]?.winner);
  const completedWeeks = Object.keys(defaultPrizes).filter(w => !!prizes[w]?.winner);

  const [selectedWeek, setSelectedWeek] = useState(activeWeeks[0] || 'Uke 46');
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [buyerName, setBuyerName] = useState('');

  const [tipName, setTipName] = useState('');
  const [tipWine, setTipWine] = useState('');
  const [tipDesc, setTipDesc] = useState('');
  const [fbName, setFbName] = useState('');
  const [fbText, setFbText] = useState('');

  // Firebase synkronisering
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

  const currentWeekTickets = tickets[selectedWeek] || {};

  const toggleSelectNumber = (num) => {
    if (currentWeekTickets[num]) return;
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const handleBuyTickets = async (e) => {
    e.preventDefault();
    if (!buyerName.trim()) {
      alert("Vennligst skriv inn navnet ditt.");
      return;
    }
    if (selectedNumbers.length === 0) {
      alert("Vennligst velg minst ett ledig grønt lodd.");
      return;
    }

    const updatedWeekTickets = { ...currentWeekTickets };
    selectedNumbers.forEach(num => {
      updatedWeekTickets[num] = buyerName.trim();
    });

    const updatedTickets = {
      ...tickets,
      [selectedWeek]: updatedWeekTickets
    };

    setTickets(updatedTickets);
    await setDoc(doc(db, "vinlotteri", "tickets"), updatedTickets);
    setSelectedNumbers([]);
    alert(`Gratulerer ${buyerName}! Du har valgt lodd: ${selectedNumbers.join(', ')}. Husk å Vippse!`);
  };

  const handleDrawWinner = async (week) => {
    const weekTickets = tickets[week] || {};
    const takenTicketNumbers = Object.keys(weekTickets);
    if (takenTicketNumbers.length === 0) {
      alert("Ingen har valgt lodd for denne uken ennå!");
      return;
    }
    const randomTicket = takenTicketNumbers[Math.floor(Math.random() * takenTicketNumbers.length)];
    const winnerName = weekTickets[randomTicket];
    
    const updatedPrizes = {
      ...prizes,
      [week]: { ...prizes[week], winner: `${winnerName} (Lodd #${randomTicket})` }
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
    if (window.confirm("Er du sikker på at du vil tilbakestille alle lodd og premier til standard?")) {
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
          <button onClick={() => setActiveTab('lodd')} style={navBtnStyle(activeTab === 'lodd')}>🎟️ Kjøp Lodd</button>
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
            <h2>🎟️ Kjøp Lodd (1–50)</h2>
            
            {activeWeeks.length === 0 ? (
              <p style={{ color: '#4cc9f0' }}>Alle ukene er ferdig trukket!</p>
            ) : (
              <>
                <div style={{ marginBottom: '15px' }}>
                  <label>Velg Aktiv Uke: </label>
                  <select value={selectedWeek} onChange={(e) => { setSelectedWeek(e.target.value); setSelectedNumbers([]); }} style={inputStyle}>
                    {activeWeeks.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>

                {/* Forklaring */}
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', fontSize: '0.9em', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '15px', height: '15px', backgroundColor: '#2a9d8f', borderRadius: '3px', display: 'inline-block' }}></span> Grønn = Ledig
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '15px', height: '15px', backgroundColor: '#f72585', borderRadius: '3px', display: 'inline-block' }}></span> Rosa = Valgt av deg
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '15px', height: '15px', backgroundColor: '#e63946', borderRadius: '3px', display: 'inline-block' }}></span> Rød = Opptatt (Navn vises)
                  </span>
                </div>

                {/* Loddrutenett */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '8px', backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                  {Array.from({ length: TOTAL_TICKETS }, (_, i) => i + 1).map(num => {
                    const isTaken = !!currentWeekTickets[num];
                    const isSelected = selectedNumbers.includes(num);
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
                          {isTaken ? owner : 'Ledig'}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Skjema */}
                <form onSubmit={handleBuyTickets} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '25px' }}>
                  <h3>Kjøp valgte lodd ({selectedWeek})</h3>
                  <p>Valgte lodd: <strong>{selectedNumbers.length > 0 ? selectedNumbers.map(n => `#${n}`).join(', ') : 'Trykk på grønne lodd over'}</strong></p>
                  <input type="text" placeholder="Ditt Navn *" value={buyerName} onChange={e => setBuyerName(e.target.value)} style={inputStyle} required /><br/><br/>
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <button type="submit" disabled={selectedNumbers.length === 0} style={{ ...btnStyle, opacity: selectedNumbers.length === 0 ? 0.5 : 1 }}>
                      Reserver og bekreft lodd
                    </button>
                    
                    <a href="https://vipps.no" target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#ff5b24', color: '#fff', padding: '8px 14px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9em', display: 'inline-block' }}>
                      📱 Åpne Vipps for betaling
                    </a>
                  </div>
                  <p style={{ fontSize: '0.8em', color: '#8d99ae', marginTop: '8px' }}>💡 Husk å Vippse etter at du har reservert loddene dine!</p>
                </form>

                <h3>Kjøpte lodd i {selectedWeek}</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '10px' }}>
                  {Object.entries(getSummaryByPerson()).map(([person, lodd]) => (
                    <div key={person} style={{ backgroundColor: '#1c2541', padding: '12px', borderRadius: '6px', borderLeft: '4px solid #4cc9f0' }}>
                      <strong>{person}</strong>
                      <div style={{ fontSize: '0.9em', color: '#4cc9f0', marginTop: '4px' }}>Lodd ({lodd.length} stk): {lodd.join(', ')}</div>
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
                      <p style={{ margin: 0, fontSize: '1.1em' }}>🎉 Vinner: <strong>{prizes[week].winner}</strong></p>
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
              <input type="text" placeholder="Vinens navn *" value={tipWine} onChange={e => setTipWine(e.target.value)} style={inputStyle} required /><br/><br/>
              <textarea placeholder="Hvorfor anbefaler du denne? *" value={tipDesc} onChange={e => setTipDesc(e.target.value)} style={{ ...inputStyle, height: '60px' }} required /><br/><br/>
              <button type="submit" style={btnStyle}>Legg til Vintips</button>
            </form>

            {tips.map(t => (
              <div key={t.id} style={{ backgroundColor: '#1c2541', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
                <h4 style={{ margin: '0 0 5px 0', color: '#f72585' }}>{t.wine}</h4>
                <p style={{ margin: '0 0 8px 0' }}>{t.desc}</p>
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
                <button onClick={handleResetAll} style={{ ...btnStyle, backgroundColor: '#d90429', marginBottom: '20px' }}>🔄 Tilbakestill alt til standard</button>

                <h3>Trekk Vinner</h3>
                {Object.keys(prizes).map(week => (
                  <div key={week} style={{ backgroundColor: '#1c2541', padding: '10px 15px', borderRadius: '6px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span><strong>{week}:</strong> {prizes[week].winner ? `Vinner: ${prizes[week].winner}` : 'Ikke trukket ennå'}</span>
                    {!prizes[week].winner && (
                      <button onClick={() => handleDrawWinner(week)} style={btnStyle}>🎲 Trekk vinner</button>
                    )}
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
