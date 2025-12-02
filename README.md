# 🎹 Ableton Live Chord Generator

Eine Web-Anwendung zur algorithmischen Generierung von Akkordprogressionen, die direkt in Ableton Live 12.3 als MIDI-Clips eingefügt werden.

## ✨ Features

- **Algorithmische Akkordgenerierung** basierend auf Musiktheorie (keine AI)
- **6 Stimmungen**: Happy, Sad, Dark, Jazzy, Tense, Calm
- **8 Tonleitern/Modi**: Major, Minor, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian
- **12 Tonarten**: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
- **6 Rhythmus-Muster**: Whole, Half, Quarters, Eighths, Syncopated, Random
- **Spread Voicing**: Akkorde über 2-3 Oktaven verteilt für volleren Sound
- **Direkte Ableton-Integration**: MIDI-Clips werden automatisch in Session View erstellt
- **Preview-Funktion**: Akkordprogressionen vor dem Generieren ansehen

## 🚀 Quick Start

### Voraussetzungen

- macOS oder Linux
- Node.js 14+ installiert
- Python 3.7+ installiert
- Ableton Live 12.3+
- AbletonOSC (MIDI Remote Script)

### Installation

1. **AbletonOSC installieren**:
   ```bash
   # AbletonOSC herunterladen
   git clone https://github.com/ideoforms/AbletonOSC.git

   # Nach Ableton's MIDI Remote Scripts Ordner kopieren
   cp -r AbletonOSC "/Applications/Ableton Live 12 Suite.app/Contents/App-Resources/MIDI Remote Scripts/"
   ```

2. **Projekt-Dependencies installieren**:
   ```bash
   cd /Users/tim/Dev/AbletonChordGenerator

   # Node.js Dependencies
   npm install

   # Python Dependencies
   cd python
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cd ..
   ```

3. **Environment-Konfiguration**:
   ```bash
   cp .env.example .env
   # Optional: .env anpassen (Standard-Werte funktionieren für lokale Nutzung)
   ```

4. **Ableton Live konfigurieren**:
   - Ableton Live 12.3 starten
   - Preferences → Link/MIDI
   - Control Surface: "AbletonOSC" auswählen
   - Input: None
   - Output: None
   - Track: Off
   - Remote: Off

### Server starten

```bash
npm start
```

Der Server läuft auf [http://localhost:3000](http://localhost:3000)

## 📖 Nutzung

1. **Ableton Live starten** und AbletonOSC aktivieren
2. **Browser öffnen**: `http://localhost:3000`
3. **Parameter einstellen**:
   - Tonart (Key): z.B. C, D, A#
   - Skala (Scale): z.B. Major, Minor, Dorian
   - Stimmung (Mood): z.B. Happy, Sad, Jazzy
   - Takte (Bars): 4, 8, 16 oder 32
   - BPM: 60-200
   - Rhythmus: Whole Notes, Quarters, Eighths, etc.
   - Ziel-Spur (Track): 0-basiert (0 = erster Track)
4. **"Preview" klicken** zum Testen
5. **"Generate in Ableton" klicken** → Clip erscheint in Session View

## 🎵 Musiktheorie

### Akkordprogressionen nach Stimmung

- **Happy**: I-V-vi-IV, I-IV-V-I, I-vi-IV-V
- **Sad**: vi-IV-I-V, i-VI-III-IV, i-iv-VI-V
- **Dark**: i-III-VI-VII, i-VII-VI-VII, i-ii°-i-ii°
- **Jazzy**: ii-V-I, I-vi-ii-V, iii-vi-ii-V
- **Tense**: i-ii-i-ii, i-VII-i-VII, VII-i-ii-i
- **Calm**: I-IV-I-V, I-iii-IV-V, vi-IV-I-V

### Spread Voicing

Akkorde werden über mehrere Oktaven verteilt:
- **Bass-Note (Root)**: Oktave 3 (MIDI 48-59)
- **Mittelstimmen**: Oktave 4 (MIDI 60-71)
- **Oberstimme**: Oktave 5 (MIDI 72-83)

Dies erzeugt einen volleren, professionelleren Sound.

## ⚙️ Technische Details

### Architektur

```
Web-Browser (Frontend)
    ↓ HTTP/JSON
Node.js Express Server
    ↓ spawn/stdin/stdout
Python Script
    ↓ OSC (UDP Port 11000)
AbletonOSC (MIDI Remote Script)
    ↓ Live Object Model API
Ableton Live 12.3
```

### Projekt-Struktur

```
AbletonChordGenerator/
├── server/              # Node.js Backend
│   ├── index.js         # Express Server
│   ├── routes/          # API Routes
│   ├── services/        # Musiktheorie-Logik
│   └── utils/           # Helper-Funktionen
├── python/              # Python OSC Bridge
│   ├── osc_sender.py    # Hauptskript
│   ├── clip_creator.py  # Clip-Erstellung
│   └── config.py        # Konfiguration
└── public/              # Frontend
    ├── index.html       # Single-Page UI
    ├── css/styles.css   # Styling
    └── js/              # JavaScript
```

## 🐛 Troubleshooting

### "Cannot connect to server"
- Prüfen Sie, ob der Server läuft: `npm start`
- Browser-Konsole öffnen (F12) für Details

### "Failed to create clip in Ableton"
- Stellen Sie sicher, dass Ableton Live läuft
- Prüfen Sie, ob AbletonOSC in Preferences aktiviert ist
- Port 11000 muss verfügbar sein (keine andere App nutzt ihn)

### "Python error: ..."
- Prüfen Sie, ob Python 3.7+ installiert ist: `python3 --version`
- Virtual Environment aktivieren: `source python/venv/bin/activate`
- Dependencies neu installieren: `pip install -r requirements.txt`

### Track existiert nicht
- Der Generator erstellt automatisch neue Tracks falls nötig
- Track-Nummer ist 0-basiert (0 = erster Track)

## 📝 Tastatur-Shortcuts

- **Ctrl/Cmd + Enter**: Generate in Ableton
- **Ctrl/Cmd + P**: Preview

## 🔮 Zukünftige Features

- Web Audio Preview (Akkorde im Browser abspielen)
- 7th/9th/11th/13th Akkorderweiterungen
- Custom User-Progressionen speichern
- MIDI-Datei Export
- Multi-Track-Generierung

## 📄 Lizenz

MIT

## 🤝 Support

Bei Fragen oder Problemen, bitte ein GitHub Issue erstellen.

---

**Made with ♥ for musicians**
