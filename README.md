# 🍷 Vinlotteriet

En moderne, interaktiv web-applikasjon for bedriftens ukentlige vinlotteri.

## 🚀 Funksjoner
- **Interaktivt lodd-rutenett (1–45):** Velg ledige lodd og se hvem som eier opptatte lodd.
- **Flere uker / Langtidskjøp:** Kjøp lodd for opptil 10 uker om gangen (f.eks. 100 kr for 5 uker).
- **Individuelle lodd per uke:** Mulighet til å velge ulike lodd for hver enkel uke.
- **Vipps-integrasjon:** Direkte dyp-lenke, QR-kode og utlegg av Vipps-nummer (41406582).
- **Husk navn:** Automatisk lagring av ansatte i rullegardinmenyen etter første kjøp.
- **Navnesjekk:** Varsel om navn allerede eksisterer for å forhindre navneforveksling.
- **Premieoversikt:** Visning av ukens viner med bildeopplasting.
- **Live Trekning (Møteromsmodus):** Animasjon av lykkehjul med navn og loddnummer, pluss konfettifeiring!
- **Admin-panel:** Endre ukenummer, marker ferieuker, og importer tidligere solgte lodd direkte fra Excel/CSV.

## 🛠️ Distribusjon til GitHub Pages

1. Opprett et nytt repository på GitHub.
2. Last opp alle filene fra denne ZIP-arkivet eller push med Git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Vinlotteriet"
   git branch -M main
   git remote add origin <DIN_GITHUB_REPO_URL>
   git push -u origin main
   ```
3. Gå til **Settings > Pages** på GitHub.
4. Velg **GitHub Actions** eller bygg mappen `dist` etter `npm run build`.
