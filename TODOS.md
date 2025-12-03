# Version 1.01
- mehr mood progressions in moodMapper.js pro stimmung. nicht immer nur 4 akkorde, auch mal 3, 5, 6 oder 7.
- die akkorde ändern sich momentan nur jeden takt. unabhängig vom rhythmischen pattern sollte es eine option geben (checkbox), die akkord-sprünge auch schon nach 2 schlägen ermöglichen, oder erst nach 8 schlägen. die option könnte etwa "unregelmäßige akkordwechsel" oder so ähnlich heißen. trotzdem soll die maximale länge der akkord-folge erhalten bleiben (die akkorde werden halt unregelmäßig verteilt über die range des ganzen clips).
- eine weitere checkbox sollte den bass-grundton des akkords eine oder zwei oktaven (auswählbar!) unter dem akkord hinzufügen (natürlich im gleichen rhythmus und parallel zu den akkord-wechseln). später möchte ich die bass-spur als einzelnen clip erzeugt haben, aber erstmal soll die bass-spur im gleichen clip liegen.
- es soll auch noch weitere akkord-arten geben, die in den akkordfolgen verwendet werden. z.b. verminderte akkorde, Maj7, übermäßige und noch weitere, die eine akkordfolge interessant machen.


# Version 1.02
- Bug: manchmal wird ein Takt zu wenig erzeugt. der clip hat zwar die komplette länge, jedoch ist kein akkord im letzten takt vorhanden. das sollte gefixt werden.
- die unregelmäßigen akkordwechsel sind gut, aber zu wenig abwechslungsreich. die wechsel sollen nicht nur nach 2 oder 8 schlägen passieren, sondern eigentlich nach jeder möglichen ganzzahligen anzahl von schlägen. die akkordfolge soll am ende jedoch immer alle akkorde enthalten und die länge sollte immer die angegebene clip-länge haben. also die variation soll im rahmen der anderen parameter angewendet werden, ohne akkord-abfolge-regeln zu brechen.


# Version 1.03 ✅ (Erledigt)
- ✅ die preview-funktion kann komplett ausgebaut werden. mir reicht es, die akkorde direkt zu erzeugen.
- ✅ die tempo-einstellung kann aus dem frontend entfernt werden, da ich das tempo in ableton live selbst festlegen möchte. es soll auch kein tempo mehr an ableton geschickt werden.
- ✅ alle einstellungen auf der oberfläche sollen im browser gespeichert werden, sodass ich beim nächsten besuch des frontends die letzten einstellungen noch gesetzt habe.


# Version 1.1 ✅ (Erledigt)
## Multi-Clip-Erzeugung
- ✅ jetzt soll nicht nur ein midi-clip erzeugt werden, sondern mehrere clips:
    - ✅ im definierten track und slot soll weiterhin die akkordfolge so wie bisher erzeugt werden
    - ✅ im slot direkt darunter (also im gleichen track) soll eine weitere akkord-folge erzeugt werden, die in der parallel-tonart der ursprünglich gewählten gebildet werden soll. diese akkordfolge soll komplementär zu der ersten sein. etwa so, wie der refrain der strophe gegenübersteht. beide akkord-folgen sollen sich hintereinander gespielt gut anhören, also gut ineinander überleiten.
    - ✅ im frontend soll sich dazu nichts ändern, der zweite slot ist immer abhängig vom slot der ersten akkord-folge
    - ✅ alle anderen parameter wie voice-leading, unregelmäßige akkordwechsel und bass-grundton sollen ebenso auf die zweite folge angewendet werden
    - ✅ einzig die stimmung könnte die gegenteilige sein wie in der ersten. für fröhlich und traurig gibt es ja die gegensätze, für die anderen weiß ich nicht, wie man die gegensätze musikalisch umsetzen könnte. denk dir was aus!

## Implementierte komplementäre Paare:
- Happy ↔ Sad
- Dark ↔ Calm
- Jazzy ↔ Tense


# Version 1.11
- es sollen jetzt direkt im track rechts daneben clips erstellt werden, und zwar nur mit den jeweiligen bass-grundtönen der beiden akkord-folgen im ersten track. also erster slot im zweiten track: bass-grundtöne der ersten akkord-folge; zweiter slot im zweiten track: bass-grundtöne der zweiten akkord-folge. die bass-grundtöne sollen diesmal nicht dem gewählten rhythmischen muster folgen, sondern immer durchgezogene töne sein (so lange gehalten, wie der bass-ton unverändert bleibt).


# Version 1.12
## das frontend soll angepasst werden:
    - kein dark mode, sondern light mode
    - es kann ruhig etwas mehr farbe enthalten
    - gerne auch symbole verwenden, aber es soll nicht zu verspielt aussehen, schon noch professionell
    - die comboboxen müssen alle gar nicht so breit sein. bitte bilde 2 spalten für die bedienelemente, sodass die meisten elemente auf der seite direkt sichtbar sind, ohne scrollen zu müssen.
    - die labels und beschriftungen sollen nur auf deutsch beschrieben sein, ich brauche die englische bezeichnung nicht

## neues feature:
- es sollen nun auch clips in einem weiteren track weiter rechts erzeugt werden. der dritte track soll auch die akkorde aus den jeweils ersten clips (im ersten track) enthalten, jedoch ohne die bass-spur und ohne rhythmische pattern. also die reinen akkorde sustained. zusätzlich sollen daraus aber "offene" akkorde werden, die frei und schwebend klingen. dazu sollen den akkorden noch obere noten hinzugefügt werden, die die akkorde schweben lassen. diese oberen noten sollen sich nicht so oft stark unterscheiden, sondern je nach akkord nur um 2 bis 3 noten voneinander unterscheiden, um ein konstant schwebendes gefühl zu erzeugen. der dritte track soll für ein synth pad gedacht sein, dass die anderen beiden spuren "trägt". die "offenen" akkorde mit den oberen noten müssen sich natürlich harmonisch in den jeweiligen akkord einfügen, damit es weiterhin gut klingt.


# Version 1.2
- die positionierung der akkorde innerhalb der akkord-folgen soll komplett überarbeitet werden.
- das "rhythmus-pattern" sorgt ab sofort nurnoch für die rhythmische unterteilung von noten eines akkords, die sustained sind (also durchgezogen) und weiterhin nur für die akkorde des ersten tracks angewendet werden.
- das gewählte rhythmus-pattern hat NICHTS mit den positionen der akkord-wechsel zu tun; diese sind komplett entkoppelt vom rhythmus-pattern.
- die akkord-wechsel sollen ab sofort einem zufällig gewählten muster folgen, das gleichmäßig über den ganzen clip verteilt ist:
    - es soll vordefinierte muster geben, die akkordwechsel über einen clip verteilen
    - es sollte viele verschiedene muster geben, die auch musikalisch und den regeln eines professionellen arrangements folgen
    - die muster sollen akkord-wechsel immer nach einer bestimmten anzahl von schlägen triggern, und zwar so, dass es sich insgesamt stimmig anhört
    - ein beispiel wäre: 2-4-2 bei 8 takten, also ein wechsel nach 2 schlägen, dann nach 4 schlägen und dann wieder nach 2 (die summe muss natürlich der von mir angegebenen anzahl von takten entsprechen, in diesem fall 8)
    - ein anderes beispiel für 16 takte: 4-2-4-2-4
    - oder auch mal schnellere wechsel (8 takte): 2-1-2-1-1-1
    - bitte definiere eine menge an mustern, aus denen dann zufällig gewählt wird
    - es muss beachtet werden, dass die anzahl der akkorde aus den akkord-folgen aus den "moodProgressions" sich mit den neuen mustern decken müssen (also eine progression mit 5 akkorden sollte dann auch ein muster gewählt bekommen, dass 5 akkord-wechsel vorsieht)
    - die akkord-wechsel-muster werden sehr früh im algorithmus bestimmt, da diese msuter sich ja auf alle 3 tracks auswirken (chords, bass, pad)
    - ich möchte für diese muster keine auswahl im frontend haben, sondern die muster sollen zufällig passig gewählt werden und zu der vorher zufällig gewählten akkord-folge passen