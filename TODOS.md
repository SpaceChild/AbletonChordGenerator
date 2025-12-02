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