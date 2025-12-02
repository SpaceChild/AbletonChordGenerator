# Setup Guide - Ableton Live Chord Generator

Detaillierte Anleitung zur Installation und Konfiguration.

## System-Anforderungen

- **Betriebssystem**: macOS 10.15+ oder Linux
- **Node.js**: Version 14.0 oder höher
- **Python**: Version 3.7 oder höher
- **Ableton Live**: Version 12.0 oder höher
- **Speicherplatz**: ~50 MB für Dependencies

## Schritt 1: AbletonOSC Installation

AbletonOSC ist ein MIDI Remote Script, das OSC-Kommunikation mit Ableton Live ermöglicht.

### Download und Installation

```bash
# 1. Repository klonen
cd ~/Downloads
git clone https://github.com/ideoforms/AbletonOSC.git

# 2. Nach Ableton's MIDI Remote Scripts Ordner kopieren
# Für Ableton Live 12 Suite:
cp -r AbletonOSC "/Applications/Ableton Live 12 Suite.app/Contents/App-Resources/MIDI Remote Scripts/"

# Für Ableton Live 12 Standard:
cp -r AbletonOSC "/Applications/Ableton Live 12 Standard.app/Contents/App-Resources/MIDI Remote Scripts/"
```

### Ableton-Konfiguration

1. **Ableton Live starten**
2. **Preferences öffnen** (Cmd+, auf macOS)
3. **Link/MIDI Tab** auswählen
4. Bei "Control Surface" dropdown:
   - Wähle "AbletonOSC"
   - Input: None
   - Output: None
5. **Ableton neu starten** (wichtig!)

### Verifizierung

AbletonOSC läuft jetzt und lauscht auf UDP Port 11000. Sie können dies prüfen:

```bash
# Port-Check (sollte Port 11000 zeigen)
lsof -i :11000
```

## Schritt 2: Node.js Installation

Falls Node.js nicht installiert ist:

### macOS (Homebrew)

```bash
# Homebrew installieren (falls nicht vorhanden)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Node.js installieren
brew install node

# Version prüfen
node --version  # Sollte v14+ sein
npm --version
```

### Linux (Ubuntu/Debian)

```bash
# Node.js 18.x LTS
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Version prüfen
node --version
npm --version
```

## Schritt 3: Python Installation

### macOS

Python 3 ist meist vorinstalliert:

```bash
# Version prüfen
python3 --version  # Sollte 3.7+ sein

# Falls nicht installiert:
brew install python3
```

### Linux (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install -y python3 python3-pip python3-venv
```

## Schritt 4: Projekt Setup

### Dependencies installieren

```bash
# 1. Ins Projektverzeichnis wechseln
cd /Users/tim/Dev/AbletonChordGenerator

# 2. Node.js Dependencies
npm install

# Ausgabe sollte sein:
# added 127 packages
# found 0 vulnerabilities

# 3. Python Virtual Environment erstellen
cd python
python3 -m venv venv

# 4. Virtual Environment aktivieren
source venv/bin/activate  # macOS/Linux

# 5. Python Dependencies installieren
pip install -r requirements.txt

# Ausgabe sollte sein:
# Successfully installed python-osc-1.8.3

# 6. Zurück ins Hauptverzeichnis
cd ..
```

### Environment-Konfiguration

```bash
# .env Datei erstellen
cp .env.example .env
```

Optional können Sie `.env` anpassen:

```bash
# .env Datei bearbeiten
nano .env
```

Standard-Werte (funktionieren für lokale Nutzung):
```
PORT=3000
NODE_ENV=development
PYTHON_PATH=/usr/local/bin/python3
ABLETON_HOST=127.0.0.1
ABLETON_PORT=11000
LOG_LEVEL=info
```

## Schritt 5: Server starten

### Development-Modus

```bash
npm start
```

Ausgabe sollte sein:
```
🎵 Ableton Chord Generator running on http://localhost:3000
📁 Serving static files from: /Users/tim/Dev/AbletonChordGenerator/public
🐍 Python script location: /Users/tim/Dev/AbletonChordGenerator/python
```

### Mit Auto-Restart (nodemon)

```bash
npm run dev
```

Der Server startet neu bei jeder Code-Änderung.

## Schritt 6: Testen

### 1. Server-Healthcheck

```bash
curl http://localhost:3000/api/health
```

Sollte zurückgeben:
```json
{
  "status": "ok",
  "timestamp": "2025-12-01T...",
  "node": "v18.x.x",
  "uptime": 5.234
}
```

### 2. Web-Interface öffnen

```bash
open http://localhost:3000
```

Oder im Browser: `http://localhost:3000`

### 3. Preview testen

1. Parameter im Formular einstellen
2. "Preview" Button klicken
3. Sollte Akkordprogression anzeigen

### 4. Ableton-Integration testen

1. **Ableton Live starten**
2. **Leeres Projekt öffnen**
3. Im Web-Interface:
   - Key: C
   - Scale: Major
   - Mood: Happy
   - Bars: 4
   - BPM: 120
   - Rhythm: Quarters
   - Target Track: 0
4. **"Generate in Ableton"** klicken
5. **In Ableton**: Session View öffnen (Tab-Taste)
6. **Ergebnis**: Clip sollte in Track 1, Slot 1 erscheinen

## Fehlerbehebung

### "Port 3000 already in use"

```bash
# Prozess auf Port 3000 finden
lsof -ti:3000

# Prozess beenden
kill -9 $(lsof -ti:3000)
```

### "python: command not found"

```bash
# Python 3 explizit verwenden
which python3

# In .env PYTHON_PATH anpassen:
PYTHON_PATH=/usr/bin/python3  # oder /usr/local/bin/python3
```

### "Cannot find module 'express'"

```bash
# Node modules neu installieren
rm -rf node_modules package-lock.json
npm install
```

### "pip: command not found"

```bash
# Python pip installieren
python3 -m ensurepip --upgrade
```

### AbletonOSC nicht in Ableton sichtbar

1. **Richtigen Ordner prüfen**:
   ```bash
   ls "/Applications/Ableton Live 12 Suite.app/Contents/App-Resources/MIDI Remote Scripts/"
   ```
   AbletonOSC sollte in der Liste sein

2. **Ableton komplett neu starten** (nicht nur Fenster schließen)

3. **Preferences → Link/MIDI** erneut öffnen

### "OSC connection failed"

1. **Port 11000 verfügbar**?
   ```bash
   lsof -i :11000
   ```

2. **AbletonOSC in Ableton aktiviert**?
   - Preferences → Link/MIDI → Control Surface = "AbletonOSC"

3. **Firewall blockiert Port**?
   - System Preferences → Security & Privacy → Firewall
   - Port 11000 freigeben für Ableton

## Deinstallation

Falls Sie das Projekt entfernen möchten:

```bash
# 1. AbletonOSC aus Ableton entfernen
rm -rf "/Applications/Ableton Live 12 Suite.app/Contents/App-Resources/MIDI Remote Scripts/AbletonOSC"

# 2. Projekt löschen
rm -rf /Users/tim/Dev/AbletonChordGenerator
```

## Support

Bei Problemen:
1. Server-Logs prüfen (Terminal-Ausgabe)
2. Browser-Konsole öffnen (F12)
3. Python-Errors in stderr prüfen
4. GitHub Issue erstellen mit:
   - Error-Message
   - Node.js Version (`node --version`)
   - Python Version (`python3 --version`)
   - Ableton Live Version
   - Betriebssystem

---

**Viel Erfolg! 🎹🎵**
