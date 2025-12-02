# 🎹 Ableton Live Chord Generator

Eine Web-Anwendung zur algorithmischen Generierung von Akkordprogressionen, die direkt in Ableton Live 12.3 als MIDI-Clips eingefügt werden.

## ✨ Features

### Akkordgenerierung
- **Algorithmische Akkordgenerierung** basierend auf Musiktheorie (keine AI)
- **6 Stimmungen**: Happy, Sad, Dark, Jazzy, Tense, Calm
- **8 verschiedene Progressionen pro Stimmung** (3-7 Akkorde) für maximale Variation
- **Erweiterte Akkordtypen**: Triads, 7th, 9th, 11th, 13th, Maj7, min7, dim, aug, sus2, sus4
- **Intelligente Akkordauswahl**: Kontextbasierte Auswahl nach Grad, Position und Stimmung

### Tonleitern & Harmonik
- **8 Tonleitern/Modi**: Major, Minor, Dorian, Phrygian, Lydian, Mixolydian, Aeolian, Locrian
- **12 Tonarten**: C, C#, D, D#, E, F, F#, G, G#, A, A#, B
- **Voice Leading**: Minimiert Notenabstände zwischen Akkorden für flüssigere Übergänge

### Rhythmus & Timing
- **5 Rhythmus-Muster**: Whole, Half, Quarters, Eighths, Random
- **Unregelmäßige Akkordwechsel**: Variable Akkordlängen (1-8 Schläge) für natürlichere Progressionen
- **Flexible Clip-Längen**: 4, 8, 16 oder 32 Takte

### Bass & Voicing
- **Bass-Grundton Option**: Fügt Grundton 1-2 Oktaven unter dem Akkord hinzu
- **Oktav-Auswahl**: Wählbar zwischen -1 oder -2 Oktaven

### Integration & Workflow
- **Direkte Ableton-Integration**: MIDI-Clips werden automatisch in Session View erstellt
- **Auto Clip Deletion**: Vorherige Clips werden automatisch überschrieben
- **Persistente Einstellungen**: Alle Formularwerte werden im Browser gespeichert
- **Tastatur-Shortcuts**: Cmd+Enter für Generate

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
3. **Parameter einstellen** (werden automatisch gespeichert):
   - **Tonart (Key)**: z.B. C, D, A#
   - **Skala (Scale)**: z.B. Major, Minor, Dorian
   - **Stimmung (Mood)**: z.B. Happy, Sad, Jazzy
   - **Takte (Bars)**: 4, 8, 16 oder 32
   - **Rhythmus**: Whole Notes, Quarters, Eighths, etc.
   - **Voice Leading** ✓: Optimiert Akkordübergänge (empfohlen)
   - **Unregelmäßige Akkordwechsel** ☐: Variable Akkordlängen für natürlicheren Fluss
   - **Bass-Grundton hinzufügen** ☐: Fügt Bass-Note hinzu
     - **Bass-Oktave**: -1 oder -2 Oktaven unter dem Akkord
   - **Ziel-Spur (Track)**: 0-basiert (0 = erster Track)
   - **Ziel-Slot**: Clip-Slot-Position (0-basiert)
4. **"Generate in Ableton" klicken** (Cmd+Enter) → Clip erscheint in Session View
5. **Tempo in Ableton Live festlegen** – Der Generator übernimmt das aktuelle Projekt-Tempo

## 🎵 Musiktheorie

### Akkordprogressionen nach Stimmung

Jede Stimmung verfügt über 8 verschiedene Progressionen (3-7 Akkorde):

- **Happy**: I-V-vi-IV, I-IV-V-I, I-vi-IV-V, I-IV-V, I-V-vi-iii-IV, I-iii-IV-I-V, I-vi-IV-I-V-I, IV-I-V-vi-IV-V-I
- **Sad**: vi-IV-I-V, i-VI-III-IV, i-iv-VI-V, vi-IV-V, i-VI-iv-i-V, ii-V-i-VI, i-III-VI-iv-i-V, VI-III-iv-i-iv-V-i
- **Dark**: i-III-VI-VII, i-VII-VI-VII, i-ii°-i-ii°, i-VI-VII, i-III-VII-VI-V, VII-VI-V-i, i-ii°-III-VII-VI-i, i-VII-III-VI-ii°-V-i
- **Jazzy**: ii-V-I, I-vi-ii-V, iii-vi-ii-V, ii-V-I, I-vi-ii-V-I, iii-vi-ii-V-I-vi, I-IV-iii-vi-ii-V-I
- **Tense**: i-ii-i-ii, i-VII-i-VII, VII-i-ii-i, i-ii°-III, VII-VI-V-IV-III, i-VII-VI-V-i, ii°-i-ii°-III-ii°-i, i-VII-VI-ii°-III-VII-i
- **Calm**: I-IV-I-V, I-iii-IV-V, vi-IV-I-V, I-IV-V, I-iii-vi-IV-V, IV-I-V-I, I-vi-iii-IV-I-V, I-iii-IV-I-vi-IV-V-I

### Akkordtypen

Der Generator wählt automatisch passende Akkordtypen basierend auf:
- **Position im Song**: Finale Akkorde sind simpler (Triad, 7th, Maj7)
- **Scale Degree**: V-Akkorde bevorzugen 7th/9th, ii-Akkorde bekommen interessante Extensions
- **Mood**:
  - Jazzy → Maj7, min7, 9th, 11th, 13th
  - Dark/Tense → dim, aug, min7
  - Happy/Calm → sus2, sus4, Maj7

**Verfügbare Typen**: Triad, 7th, 9th, 11th, 13th, Maj7, min7, dim, aug, sus2, sus4

### Voice Leading

Optimiert die Notenpositionen zwischen aufeinanderfolgenden Akkorden:
- Probiert alle Oktavvariationen (-12, 0, +12 Halbtöne) für jede Note
- Wählt die Voicing mit den kleinsten Notenabständen
- Ergebnis: Flüssigere, natürlichere Akkordübergänge

### Unregelmäßige Akkordwechsel

Statt eines Akkords pro Takt können Akkorde variabel lang sein:
- **Mögliche Längen**: 1-8 Schläge (Viertelnote bis 2 Takte)
- **Garantien**:
  - Gesamtlänge entspricht immer den angegebenen Bars
  - Alle Akkorde aus der Progression werden verwendet
  - Bei Bedarf wiederholt sich die Progression
- **Vorteil**: Natürlicherer, weniger mechanischer Fluss

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
├── server/                    # Node.js Backend
│   ├── index.js               # Express Server
│   ├── routes/
│   │   └── chords.js          # API Routes & Validation
│   ├── services/
│   │   ├── chordGenerator.js  # Hauptlogik: Akkorde, Voice Leading, Irregular Changes
│   │   ├── moodMapper.js      # 48 Progressionen (8 pro Mood)
│   │   ├── rhythmGenerator.js # Rhythmus & Bass-Note-Generierung
│   │   └── scaleBuilder.js    # Tonleiter-Konstruktion
│   └── utils/
│       ├── musicTheory.js     # Musiktheorie-Konstanten
│       └── pythonBridge.js    # Python-Kommunikation
├── python/                    # Python OSC Bridge
│   ├── clip_creator.py        # Clip-Erstellung & Deletion
│   ├── config.py              # OSC-Konfiguration
│   └── requirements.txt       # python-osc Dependency
└── public/                    # Frontend
    ├── index.html             # Single-Page UI mit allen Optionen
    ├── css/styles.css         # Responsive Design
    └── js/
        ├── app.js             # Event Handlers & Keyboard Shortcuts
        ├── formHandler.js     # Form Data Processing
        └── api.js             # Backend API Calls
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

## 📋 Version History

### Version 1.03 (Aktuelle Version)
- ✅ Preview-Funktion entfernt (direkte Generierung)
- ✅ BPM/Tempo-Einstellung entfernt (verwendet Ableton-Projekt-Tempo)
- ✅ LocalStorage: Alle Einstellungen werden im Browser persistent gespeichert

### Version 1.02
- ✅ Bug Fix: Fehlende Akkorde im letzten Takt behoben
- ✅ Erweiterte unregelmäßige Akkordwechsel (1-8 Schläge)
- ✅ Progression-Loop bei irregular mode

### Version 1.01
- ✅ 8 Progressionen pro Mood (3-7 Akkorde)
- ✅ Unregelmäßige Akkordwechsel
- ✅ Bass-Grundton mit Oktav-Auswahl
- ✅ Erweiterte Akkordtypen (dim, aug, Maj7, min7, sus2, sus4)
- ✅ Intelligente kontextbasierte Akkordauswahl

### Version 1.0
- ✅ Grundlegende Akkordgenerierung
- ✅ Voice Leading
- ✅ 6 Moods, 8 Scales
- ✅ Ableton OSC Integration

## 🔮 Zukünftige Features

- Separate Bass-Clip-Generierung
- Web Audio Preview (Akkorde im Browser abspielen)
- Custom User-Progressionen speichern
- MIDI-Datei Export
- Multi-Track-Generierung
- Velocity & Timing Humanization

## 📄 Lizenz

MIT

## 🤝 Support

Bei Fragen oder Problemen, bitte ein GitHub Issue erstellen.

---

**Made with ♥ for musicians**
