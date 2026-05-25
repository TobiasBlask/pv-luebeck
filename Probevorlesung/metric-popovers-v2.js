(function () {
  /* Schema per entry (object form, all fields optional except cat/name/tldr/pitfall):
     {
       cat:     "kicker label",
       name:    "title",
       tldr:    "single-sentence essence",
       long:    "1–3 sentence explanation",
       example: "concrete instance, often with numbers",
       formal:  "formula or formal definition (only when applicable)",
       pitfall: "Falle: ...",
       mini:    "mini-icon class",
       position:"Position: ... (for Folie 20 only)"
     }
  */
  var explainers = {
    survey: {
      cat: "Quantitativ", name: "Standardisierte Befragung", mini: "sample",
      tldr: "Wann mehrere Personen verglichen werden sollen, brauchen alle dieselbe Messlatte, sonst vergleicht man Birnen mit Bäumen.",
      long: "Die standardisierte Befragung ist die Methode, wenn ich Größen und Anteile zuverlässig vergleichen will: Bottom-2-Anteile zwischen Strecken, Mittelwerte zwischen Reisegruppen, Trends über Zeit. Der Trick ist die Fixierung: identischer Itemwortlaut, identische Skala, identische Reihenfolge. Jede Abweichung führt zu Vergleichbarkeitsverlust, schon eine andere Frage-Formulierung ändert Antworten um mehrere pp. Vorarbeit ist deshalb teuer (Pretest, Begriffsklärung, Skalenkalibrierung), aber genau hier entscheidet sich, ob die Datenerhebung am Ende belastbar ist.",
      example: "DB-Studie: 2.500 Reisende, identische 7-stufige Likert-Items, Tablet-erhoben am Bahnsteig direkt nach Ankunft. Bottom-2-Box pro Strecke ist damit auf 3 pp belastbar unterscheidbar.",
      pitfall: "Falle: Ein Fragebogen ist nur so stark wie sein Pretest. Wer ohne Begriffsklärung loslegt, misst lauter Missverständnisse."
    },
    likert: {
      cat: "Messung", name: "Likert-Skala", mini: "validity",
      tldr: "Mehrstufige Zustimmungsskalen übersetzen subjektive Urteile in vergleichbare Zahlen.",
      long: "Eine Likert-Skala bietet typischerweise 5 oder 7 verbal verankerte Stufen von Ablehnung zu Zustimmung. Sie liefert ordinale Daten, die in der Marktforschungspraxis häufig wie metrische behandelt werden.",
      example: "„Die Reise war pünktlich.“ 1 = stimme gar nicht zu … 7 = stimme voll zu; verbal verankerte Endpunkte, optional Mittelkategorie.",
      formal: "x ∈ {1,…,k}, k typischerweise 5 oder 7; ordinal mit Verbalankern an den Endpunkten.",
      pitfall: "Falle: Die Abstände zwischen Stufen sind nicht automatisch echte metrische Abstände."
    },
    bottom2: {
      cat: "Auswertung", name: "Bottom-2-Box", mini: "pvalue",
      tldr: "Der Anteil der zwei schlechtesten Antwortstufen zeigt, wie groß ein akutes Problemsegment ist.",
      long: "Bottom-2-Box reduziert eine ordinale Skala auf eine handlungsrelevante Quote: Wie viele sind klar unzufrieden? Die Kennzahl ist robust gegen Mittelwertfallen und gut für Priorisierung über Strecken oder Segmente.",
      example: "Anschlussinfo Bottom-2 = 42% (95%-KI [40; 44]) → klarer Problemhinweis im Umstieg.",
      formal: "p̂ = #{x≤2} / n; SE = √(p̂(1−p̂)/n).",
      pitfall: "Falle: Der Anteil ersetzt nicht die Frage, warum Menschen so urteilen."
    },
    stratified: {
      cat: "Stichprobe", name: "Geschichtete Stichprobe", mini: "selection",
      tldr: "Wichtige Gruppen werden gezielt abgedeckt, etwa Strecke, Tageszeit oder Reisezweck.",
      long: "Bei der Schichtung wird die Grundgesamtheit in disjunkte Schichten zerlegt und in jeder Schicht eine eigene Zufallsauswahl gezogen. Das senkt die Schätzvarianz für die Gesamtgröße und sichert Aussagen über kleine, aber relevante Teilgruppen.",
      example: "Reisendenstichprobe geschichtet nach Strecke × Tageszeit, jede Zelle mit n≥150.",
      pitfall: "Falle: Schichtung hilft nur, wenn die Schichten zur Grundgesamtheit passen."
    },
    tracking: {
      cat: "Beobachtung", name: "Verhaltensspur", mini: "pattern-mechanism",
      tldr: "Was Menschen tun, ist oft etwas anderes als das, was sie sagen, Tracking schließt diese Lücke.",
      long: "In Befragungen sagen Reisende „die App ist okay“, im Tracking sieht man, dass 63 % nach 8 Sekunden die Buchungsstrecke abbrechen. Verhaltensspuren entstehen non-reaktiv aus Logs, Sensoren oder App-Events; sie sind die Methode der Wahl, wenn das tatsächliche Tun wichtiger ist als die Selbstauskunft. Stärke: hohe Fallzahl, kein Erinnerungsbias, real-time Granularität. Schwäche: Verhalten erklärt sich nicht von selbst, der Warum-Teil bleibt offen und braucht qualitative Vertiefung.",
      example: "DB Navigator In-App-Tracking: 42.000 Sessions, 30 Tage. Befund: „Umstiegsanzeige verlassen“ in 63 % der Suchen, mittlerer Aufenthalt 11 Sek vor Abbruch.",
      pitfall: "Falle: Tracking zeigt Symptome, nicht Mechanismen. „Warum bricht ab?“ braucht Think-aloud oder Interview."
    },
    nonreactive: {
      cat: "Beobachtung", name: "Non-reaktive Daten", mini: "objective",
      tldr: "Die Messung verändert das Verhalten nicht direkt, weil keine Befragungssituation entsteht.",
      long: "Non-reaktive Daten sind ein Nebenprodukt der Nutzung: Plattform-Logs, Telemetrie, Drehkreuzdaten. Der Beobachtungseffekt ist gering, dafür entscheidet das Plattformdesign mit, was überhaupt sichtbar wird.",
      example: "Drehkreuz- und Türsensoren am Bahnsteig zählen Ein- und Aussteigende ohne Befragung.",
      pitfall: "Falle: Auch non-reaktive Daten können durch Plattformdesign verzerrt sein."
    },
    operational: {
      cat: "Sekundärdaten", name: "Betriebsdaten", mini: "fit",
      tldr: "Vorhandene Prozessdaten liefern reale Serviceereignisse, etwa Verspätung, Nutzung oder Auslastung.",
      long: "Betriebsdaten entstehen für Steuerung, nicht für Forschung, entsprechend granular, aber selten exakt auf die Fragestellung zugeschnitten. Sie sind verlässlich für Häufigkeiten, schwächer für Erlebniskonstrukte.",
      example: "Pünktlichkeitslogs Fernverkehr: Ist-Soll-Differenz pro Halt, anschlussrelevant ab 5 min.",
      pitfall: "Falle: Daten, die für Betrieb erzeugt wurden, passen nicht automatisch zur Forschungsfrage."
    },
    privacy: {
      cat: "Datenethik", name: "Pseudonymisiert & aggregiert", mini: "audit",
      tldr: "Personenbezug wird reduziert; berichtet werden Gruppenmuster statt Einzelfälle.",
      long: "Pseudonymisierung ersetzt direkte Identifikatoren durch Codes; Aggregation gibt nur Gruppenwerte aus. Zusammen senken sie das Re-Identifizierungsrisiko, ersetzen aber keine vollständige Datenschutz-Folgenabschätzung.",
      example: "Tracking-Daten als Geräte-Hash, Auswertung auf Strecken-/Stunden-Ebene mit n≥50 pro Zelle.",
      pitfall: "Falle: Aggregation ersetzt keine Prüfung von Zweckbindung, Zugriff und Re-Identifizierungsrisiko."
    },
    secondary: {
      cat: "Quantitativ", name: "Sekundärdatenanalyse", mini: "text-corpus",
      tldr: "Bevor man teuer neu erhebt, immer fragen: gibt es vielleicht schon Daten, die meine Frage beantworten, wenn ich sie clever lese?",
      long: "Sekundärdatenanalyse nutzt Datensätze, die jemand anderes für einen anderen Zweck erhoben hat: amtliche Statistiken, Betriebsdaten, Branchen-Reports, Plattform-Logs. Sie ist günstig, schnell, oft mit großer Fallzahl, aber verlangt eine sorgfältige Passungsprüfung BEVOR man rechnet: Wie wurde erhoben? Wer war die Population? Wie sind die Variablen definiert? Wenn die Passung schlecht ist, antwortet man präzise auf die falsche Frage.",
      example: "EBA-Pünktlichkeitsstatistik liefert Quote pro Strecke kostenlos und valide, als Benchmark gegen die eigene Befragung („wie pünktlich wird die Strecke wahrgenommen?“) ideal.",
      pitfall: "Falle: Schnelle Daten sind nicht automatisch passende Daten. „Mein Konstrukt“ ≠ „in der Spalte steht ein Wert“."
    },
    interview: {
      cat: "Qualitativ", name: "Interview", mini: "quote",
      tldr: "Wenn man noch nicht weiß, was die richtigen Fragen sind, oder die richtigen Antwort-Kategorien, dann ist das Interview die Methode davor.",
      long: "Bevor man einen Fragebogen baut, muss man wissen, mit welchen Begriffen die Befragten überhaupt operieren, und welche Antwortlogik bei ihnen Sinn ergibt. Das Interview liefert diese Vorarbeit: leitfadengestützt (5–7 Themenblöcke mit offenen Eröffnungsfragen) bekommt man die eigene Sprache der Reisenden, nicht die der Forschung. Es ist die Methode für Mechanismusarbeit („warum erlebst du den Umstieg als belastend?“) und für Begriffsklärung („was meinst du mit ‚Vertrauen‘?“). Ergebnis: Codes, Kategorien, Hypothesen, und ein besser fundierter Fragebogen für die Quant-Phase.",
      example: "12 Bahnreisende (Pendler / Geschäft / Freizeit), je 45 Min Leitfaden zu Umstieg/Anschlussinfo/Vertrauen, Mayring-Codierung → 4 Hauptkategorien als Basis für Items.",
      pitfall: "Falle: Interviews liefern Mechanismen und Hypothesen, keine Marktanteile. 12 Pendler:innen sind keine 31 % Marktposition.",
      position: "Position: links oben, weil aktiv erhobene Interaktion und hohe Falltiefe zusammenkommen."
    },
    focusgroup: {
      cat: "Qualitativ", name: "Fokusgruppe", mini: "consensus",
      tldr: "Wenn Sprache, Akzeptanzgrenzen und konkurrierende Lesarten sichtbar werden sollen, nicht intime Erlebnisse, sondern soziale Aushandlung.",
      long: "Die Fokusgruppe nutzt das, was im Einzelinterview fehlt: andere Stimmen, die widersprechen, ergänzen, verdichten. Genau im Aushandeln zeigt sich, welche Begriffe geteilt sind, wo Konflikte entstehen, wie Markenbilder verhandelt werden. Sie ist optimal für Wording-Tests, Positionierungsfragen, Konzept-Validierung, weniger für sensible/intime Themen, weil die Gruppe Selbstdarstellung erzwingt. Klassische Konstellation: 2–4 Gruppen à 6–8 Personen, 60–90 Min, moderiert nach Themenraster.",
      example: "Zwei Gruppen à 6 Pendler:innen diskutieren drei Wording-Varianten für die App-Umstiegsanzeige → Konvergenz auf eine Sprache, Streit über die anderen zwei.",
      pitfall: "Falle: Dominante Stimmen können Pseudo-Konsens erzeugen. Moderation muss aktiv Gegenstimmen ziehen.",
      position: "Position: links unten, weil Interaktion erhoben wird, aber der Vergleich von Deutungen wichtiger ist als Einzelfalltiefe."
    },
    criticalIncident: {
      cat: "Qualitativ", name: "Critical Incident", mini: "countercase",
      tldr: "Statt allgemein nach „Meinungen“ fragen, gezielt nach einem konkreten Schlüsselerlebnis fragen, das gibt dichte, rekonstruierbare Mechanismus-Daten.",
      long: "Die Critical-Incident-Technique (Flanagan 1954) verlässt die Ebene allgemeiner Urteile („wie zufrieden sind Sie?“) und zwingt zur Episode: ein konkretes Ereignis, dessen Vorgeschichte, Wendepunkt und Folge der/die Befragte präzise rekonstruieren kann. Stärke: man bekommt Mechanismen statt Stimmungen, und kann typische Auslöser, Eskalationspfade und Recovery-Punkte aus dem Material lesen. Im Service-Kontext ideal für Pannen, Fehlersituationen, Wendepunkt-Momente.",
      example: "„Erzählen Sie mir vom letzten Mal, an dem Sie Ihren Anschluss verloren haben, was passierte vorher, im Moment, danach?“ → 23 Interviews liefern 4 typische Eskalationspfade.",
      pitfall: "Falle: Extreme Ereignisse sind analytisch stark, aber nicht automatisch typisch. Für Marktgröße braucht es Quant-Folgestudie.",
      position: "Position: links mittig, weil konkrete Episoden tief rekonstruiert und anschließend über Fälle verglichen werden."
    },
    ethnography: {
      cat: "Qualitativ", name: "Ethnographie", mini: "field",
      tldr: "Menschen erzählen, was sie zu tun glauben, Ethnographie zeigt, was sie tatsächlich tun, wenn niemand sie fragt.",
      long: "Ethnographische Forschung bleibt über Wochen oder Monate im Feld und trennt Beobachtung (was passiert?), Kontext (in welcher Situation?) und Interpretation (wie deute ich das?) konsequent in Feldnotizen. Sie ist die Methode, wenn IMPLIZITE Praxis sichtbar werden soll: Routinen, Workarounds, ungeschriebene Regeln, die niemand erzählen würde, weil sie zu selbstverständlich sind. Im Service-Kontext erlaubt sie Befunde wie „die meisten Reisenden ignorieren die App-Anzeige und folgen dem ICE-Personal“, Dinge, die im Interview nie genannt würden.",
      example: "Sechs Wochen teilnehmende Beobachtung am Hamburger Hbf, 18 Feldnotizen-Sessions, 4 Forscher:innen, → 3 unentdeckte Workaround-Routinen.",
      pitfall: "Falle: Beobachtung verschmilzt Notiz und Deutung, wenn man nicht diszipliniert getrennt schreibt. Letzteres muss erst NACH dem Feld passieren.",
      position: "Position: rechts oben, weil der Zugang im Feld liegt und die Falltiefe aus beobachtetem Kontext entsteht."
    },
    contentAnalysis: {
      cat: "Qualitativ", name: "Inhaltsanalyse", mini: "deductive-inductive",
      tldr: "Wenn man aus großen Textmengen wiederkehrende Frames belastbar extrahieren will, ohne aus Zitat-Kirsche zu picken.",
      long: "Qualitative Inhaltsanalyse macht aus unstrukturiertem Textmaterial (Beschwerden, Open-Ends, Interview-Transkripte) strukturierte Kategorien. Sie arbeitet regelgeleitet: Codes können deduktiv aus Theorie kommen oder induktiv aus dem Material wachsen (oder beides). Damit das Verfahren nicht zur „Bestätigungssuche“ wird, wird mit zwei Codier-Personen + Reliabilitätsmaß (Cohen's κ, Krippendorff's α) gearbeitet. Das Ergebnis ist eine prüfbare Tabelle „Frame → Häufigkeit → Anker-Zitate“, keine Bauchgefühl-Synthese.",
      example: "1.200 DB-Beschwerde-Tickets, Codebuch in 4 Iterationen entwickelt, 2 Codierende mit κ = .78, 5 Hauptkategorien (Anschluss / Information / Komfort / Reservierung / App).",
      pitfall: "Falle: Große Textmengen sind nicht automatisch repräsentativ, Beschwerdende sind selbstselektiert.",
      position: "Position: rechts unten, weil vorhandenes Material über viele Fälle hinweg codiert und vergleichbar gemacht wird."
    },
    diaryStudy: {
      cat: "Qualitativ", name: "Tagebuchstudie", mini: "audit",
      tldr: "Wenn das Erleben über Zeit variiert (jeder Umstieg ist anders), sammelt man am besten viele kleine Momente, nicht eine Erinnerung nach 4 Wochen.",
      long: "Tagebücher lösen das Erinnerungsproblem von Befragungen: Reisende dokumentieren jeden einzelnen Umstieg in dem Moment, in dem er passiert, nicht zwei Tage später, gefärbt durch Endeindruck. Das gibt drei Vorteile: weniger Erinnerungs-Bias, längsschnittliche Tiefe (Veränderung über Zeit) und Mikro-Episoden statt Pauschalurteile. Strukturierung ist Pflicht, feste Prompts („Was war heute Morgen am Umstieg anders als sonst?“) und Trigger-Zeitpunkte (per Geofence), sonst werden die Einträge ungleichmäßig.",
      example: "20 Pendler:innen führen 14 Tage App-Tagebuch, getriggert beim Verlassen der Umsteige-Geofence-Zone, 3 Standard-Prompts pro Eintrag.",
      pitfall: "Falle: Ohne klare Prompts wird das Tagebuch eine Sammlung wirrer Notizen, viel Material, wenig Aussage.",
      position: "Position: oben links-mittig, weil Erleben aktiv erhoben wird, aber stärker über Zeit als in einem Einzelinterview."
    },
    thinkAloud: {
      cat: "Qualitativ", name: "Think-aloud", mini: "field",
      tldr: "Wenn man wissen will, wo genau und warum Nutzer:innen straucheln, nicht nur dass sie abbrechen.",
      long: "Tracking zeigt: 63 % brechen nach 11 Sek ab. Think-aloud zeigt das Warum: weil sie nicht verstehen, was sie als Nächstes klicken sollen. Methodisch: Teilnehmende bearbeiten eine Aufgabe (Verbindung buchen) und sprechen laut mit, was sie wahrnehmen, erwarten, nicht verstehen. Das macht Nutzungsbarrieren im Moment der Entscheidung hörbar, auf eine Tiefe, die Befragungen nicht erreichen. Klassisches Usability-Verfahren; im Service-Kontext für App-Buchung, Ticketkauf, Self-Service-Reklamation.",
      example: "8 Reisende buchen in der DB Navigator-App eine Umstiegsverbindung. Jeder Schritt wird verbalisiert. Audio + Screen-Capture, 30 min pro Person → 4 dokumentierte Stolperstellen pro Aufgabe.",
      pitfall: "Falle: Lautes Denken verändert die Situation, die Methode zeigt Barrieren, keine natürlichen Häufigkeiten.",
      position: "Position: links unten-mittig, weil die Interaktion erhoben wird, aber meist mehrere Aufgaben oder Barrieren verglichen werden."
    },
    netnography: {
      cat: "Qualitativ", name: "Netnographie", mini: "text-corpus",
      tldr: "Vorhandene Online-Sprache ist eine Goldmine, keine Befragungs-Reaktivität, große Volumina, natürliche Wortwahl.",
      long: "Netnographie (Kozinets) überträgt ethnographische Logik auf digitale Communities: Foren, Subreddits, Bewertungsplattformen, Social-Media-Threads. Die Daten entstehen, ohne dass jemand befragt wird, natürlichste mögliche Sprache der Zielgruppe, oft mit hoher Diskussionstiefe. Stärke für Marken: man liest, welche Begriffe die Community wirklich benutzt, welche Probleme sie selbst priorisiert. Schwäche: die online aktiven Stimmen sind nicht repräsentativ, sie sind die lautesten, nicht die typischsten. Vor jeder Auswertung Plattformlogik klären (Was wird belohnt? Was wird zensiert? Wer postet überhaupt?).",
      example: "Reddit r/bahn, 3.000 Threads in 12 Monaten, codiert nach Beschwerde-Topoi → 4 dominante Frames (Unzuverlässigkeit, Preisstruktur, Personal, Reservierung).",
      pitfall: "Falle: Online-Stimmen sind selbstselektiert. „r/bahn“ ist die Sicht der Vielnutzer:innen, nicht der Gelegenheitsreisenden.",
      position: "Position: rechts unten-mittig, weil vorhandene Online-Spuren feldnah gelesen und zugleich als Korpus verglichen werden."
    },
    documentAnalysis: {
      cat: "Qualitativ", name: "Dokumentenanalyse", mini: "audit",
      tldr: "Wenn der Organisations-Standpunkt gefragt ist, wie das Unternehmen Probleme sieht, nicht wie Kund:innen sie erleben.",
      long: "Dokumentenanalyse arbeitet mit Material, das OHNE Forschungseingriff entstanden ist: Reklamationsfälle, interne Leitfäden, Service-Protokolle, Schulungsmaterial, Branchen-Reports. Stärke: man sieht die Organisations-Sicht im O-Ton, wie Probleme klassifiziert, eskaliert, gelöst werden. Sie zeigt die NORM-SPRACHE des Unternehmens. Schwäche: was im Dokument steht, ist nicht zwingend gelebte Praxis, der Eskalationsleitfaden sagt nicht, ob Mitarbeitende ihn wirklich befolgen. Für gelebte Praxis: Ethnographie/Beobachtung triangulieren.",
      example: "200 interne Service-Reklamationsfälle aus zwei Quartalen, codiert auf Eskalationspfade → 3 typische Routen + 2 Sonderfälle.",
      pitfall: "Falle: Dokumente zeigen die Norm, nicht die Realität. Triangulation mit Beobachtung nötig.",
      position: "Position: rechts unten, weil die Daten bereits vorliegen und über Materialtypen hinweg verglichen werden."
    },
    servqual: {
      cat: "Grenzfall", name: "SERVQUAL", mini: "validity",
      tldr: "Der Klassiker, wenn man Servicequalität standardisiert messen und mit anderen Studien vergleichen will, aber er ist auch der Klassiker für Standardisierungs-Fallen.",
      long: "SERVQUAL (Parasuraman/Zeithaml/Berry 1985/1988) operationalisiert Servicequalität als Differenz Erwartung minus Erlebnis auf fünf Dimensionen: Tangibles, Reliability, Responsiveness, Assurance, Empathy. Die Skala hat 22 Item-Paare auf 7-stufiger Likert, getrennt für Erwartung und Erlebnis erhoben. Stärke: Vergleichbarkeit über Branchen und Zeiten hinweg, dichter empirischer Hintergrund. Schwäche: die fünf Dimensionen sind kulturell und branchenspezifisch, für Bahn vs. Bank vs. Hotel müssen sie inhaltlich neu validiert (oft umformuliert) werden, sonst misst man neben dem Thema.",
      example: "22 Item-Paare auf 7-stufiger Likert; SERVQUAL-Score pro Dimension = Mittelwert(P − E). DB-Adaption: 22 Items + 4 Bahn-spezifische ergänzt, Cronbach α = .87.",
      formal: "SQ = Σ (Pᵢ − Eᵢ) / k; pro Dimension separat berichten.",
      pitfall: "Falle: Die fünf Dimensionen wirken universell, sind es aber nicht. Vor Übernahme inhaltlich validieren.",
      position: "Position: unten links als Brücke zur Quantifizierung."
    },
    guide: {
      cat: "Interview", name: "Leitfaden", mini: "transparency",
      tldr: "Ein Leitfaden hält Themen vergleichbar und lässt trotzdem Raum für eigene Begriffe.",
      long: "Der Leitfaden listet Themen mit Eröffnungs- und Vertiefungsfragen, ohne ein Wortlautskript zu sein. Gute Leitfäden enthalten Erzählaufforderungen, keine geschlossenen Fragen.",
      example: "5 Themenblöcke: Einstieg, Umstiegssituation, Anschlussinfo, Vertrauen, Verbesserungswünsche.",
      pitfall: "Falle: Zu starre Fragen produzieren Bestätigung statt Exploration."
    },
    mayring: {
      cat: "Codierung", name: "Mayring", mini: "codes-items",
      tldr: "Qualitative Inhaltsanalyse: Material paraphrasieren, verdichten und Kategorien zuordnen.",
      long: "Philipp Mayrings Verfahren legt explizite Codier­regeln, Kategoriendefinitionen und Ankerbeispiele fest. Es ist methodisch transparent und damit gut für Prüfungssettings und kollaborative Auswertung.",
      example: "Schritte: Paraphrase → Generalisierung → 1. Reduktion → 2. Reduktion → Kategoriensystem.",
      pitfall: "Falle: Regelgeleitet heißt nicht mechanisch; Kategorien müssen inhaltlich begründet werden."
    },
    fieldnote: {
      cat: "Ethnographie", name: "Feldtagebuch", mini: "audit",
      tldr: "Feldnotizen trennen Beobachtung, Kontext und analytische Memos.",
      long: "Ein Feldtagebuch dokumentiert das Beobachtete (Jottings), den Kontext (Setting) und erste Deutungen (Memos) konsequent getrennt. Diese Trennung ist die Basis späterer Reflexivität.",
      example: "Spalten: 'Was war zu sehen', 'Wie war die Situation', 'Was denke ich darüber'.",
      pitfall: "Falle: Nachträgliche Erinnerung ist schwächer als zeitnahe Dokumentation."
    },
    goalong: {
      cat: "Ethnographie", name: "Go-along", mini: "field",
      tldr: "Forschende begleiten Menschen im Nutzungskontext und fragen direkt an konkreten Situationen nach.",
      long: "Go-alongs (Kusenbach) kombinieren Beobachtung mit situativer Nachfrage. Sie erfassen Wahrnehmung im Moment des Erlebens, zwischen Walk-along, Talk-along und Ride-along je nach Setting.",
      example: "Ride-along über zwei Umsteigeverbindungen: Frankfurt–Köln–Aachen, Tablet-Aufnahme + Field Notes.",
      pitfall: "Falle: Nähe zum Feld muss reflexiv dokumentiert werden.",
      position: "Position: rechts oben-mittig, weil der Zugang im Feld stattfindet, aber durch Nachfragen stärker interaktiv ist als reine Beobachtung."
    },
    invivo: {
      cat: "Codierung", name: "In-vivo-Code", mini: "quote",
      tldr: "Begriffe aus dem Material werden übernommen, damit die Sprache der Befragten sichtbar bleibt.",
      long: "Ein In-vivo-Code ist ein Originalbegriff aus dem Material, der als analytische Marke dient. Er bewahrt die Stimme der Befragten in der späteren Codierung.",
      example: "„Schaffe ich es?“ als In-vivo-Code für Anschlussunsicherheit.",
      pitfall: "Falle: Ein O-Ton ist noch keine fertige analytische Kategorie."
    },
    analyticCode: {
      cat: "Codierung", name: "Analytischer Code", mini: "codes-items",
      tldr: "Verdichtet mehrere Textstellen zu einem erklärenden Konzept.",
      long: "Analytische Codes abstrahieren von der Oberflächensprache und benennen Mechanismen oder Konzepte. Sie tragen die theoretische Last der Analyse.",
      example: "Mehrere O-Töne zu Umstiegsangst werden zum Code „Anschlussangst“ verdichtet.",
      pitfall: "Falle: Codes dürfen nicht nur Etiketten sein; sie brauchen eine Regel."
    },
    category: {
      cat: "Auswertung", name: "Kategorie", mini: "cluster",
      tldr: "Kategorien bündeln Codes zu einem interpretierbaren Muster oder Mechanismus.",
      long: "Eine Kategorie ist mehr als eine Sammelschublade: sie macht eine analytische Aussage über das Material und ist anschlussfähig für Theorie oder Designentscheidung.",
      example: "Codes „Anschlussangst“, „Informationslücke“, „Eskalationsangst“ → Kategorie „Kontrollverlust“.",
      pitfall: "Falle: Kategorien sind schwach, wenn sie nur sammeln und nichts erklären."
    },
    designConcept: {
      cat: "Transfer", name: "Designbegriff", mini: "build",
      tldr: "Aus der Analyse entsteht ein Begriff, der Produkt- oder Servicegestaltung steuern kann.",
      long: "Ein Designbegriff überträgt qualitative Erkenntnis in ein operationalisierbares Konzept für Gestaltung. Er bündelt die Evidenz und macht sie für Entscheidung handhabbar.",
      example: "Aus der Kategorie „Kontrollverlust“ wird der Designbegriff „Entscheidungssicherheit statt nur Zeitinformation“.",
      pitfall: "Falle: Transfer braucht Evidenzkette von Material über Code zur Entscheidung."
    },
    marketSize: {
      cat: "Quant-Grenze", name: "Marktgröße", mini: "sample",
      tldr: "Die quantitative Frage „Wie groß ist das Problem?“ bestimmt Priorität, Budget und Reihenfolge. Ohne sie ist keine Investitions-Entscheidung tragfähig.",
      long: "Marktgrößen-Aussagen sind die Brücke zwischen Forschung und Management-Entscheidung, sie sagen, wie viele Reisende betroffen sind, wie häufig das Problem auftritt, und wie es im Vergleich zu anderen Problemen priorisiert werden muss. Sie brauchen ZWEI Voraussetzungen, die häufig vergessen werden: (1) valide Konstrukte, sonst misst man das Falsche präzise, (2) ausreichend große Stichproben, sonst sind die Schätzungen unbrauchbar. Beide Voraussetzungen kommen aus VORARBEIT (Qual + Operationalisierung + Power-Analyse).",
      example: "Bottom-2-Box auf Anschlussinfo = 42 % bei n = 2.500 Reisenden → ~1.050 in der Stichprobe akut betroffen → hochgerechnet auf 1,2 Mio Pendler:innen pro Jahr → 500.000 erleben das Problem regelmäßig.",
      pitfall: "Falle: Marktgröße ohne validen Begriff = präzise in die falsche Richtung. „Wir messen Servicequalität“ ist nur dann nützlich, wenn das geprüft ist."
    },
    mechanism: {
      cat: "Qual-Grenze", name: "Mechanismus", mini: "pattern-mechanism",
      tldr: "Quantitative Methoden sagen, dass etwas passiert, Mechanismen sagen warum. Ohne den Warum-Teil kann man nicht intervenieren.",
      long: "Ein Mechanismus erklärt die Kette „Bedingung → Prozess → Ergebnis“ und macht aus einem Muster eine handelbare Erkenntnis. Quantitative Forschung sagt: „63 % brechen nach 11 Sek ab“, Information, aber noch keine Lösung. Der Mechanismus sagt: „weil sie nicht verstehen, was als Nächstes passiert“ → daraus folgt: zeige es klarer. Erst der Mechanismus erlaubt, eine Intervention zu designen, die genau an dieser Stelle ansetzt.",
      example: "Anschluss verloren → Informationslücke → Eskalationsangst → Buchungsabbruch. Vier Schritte, jeder ein potenzieller Hebel für Service-Design.",
      pitfall: "Falle: Mittelwerte und Korrelationen zeigen Muster, keine Mechanismen. Letztere brauchen qualitative Tiefe."
    },
    explanatorySequential: {
      cat: "Mixed Methods", name: "Erklärend-sequentiell", mini: "explanatory-seq",
      tldr: "Quantitativ findet das Muster, qualitativ erklärt es. Dieses Design braucht man, wenn man weiß, was passiert, aber noch nicht warum.",
      long: "Im erklärend-sequentiellen Design (QUANT → QUAL) liefert die quant Phase Befunde, die qual Phase liefert die Erklärung. Reihenfolge ist wichtig: Bottom-2 = 42 % zeigt das Muster, aber Mechanismus bleibt offen, also gezielte Interviews mit jenen, die in der Quant-Phase besonders auffällig waren („extreme Fälle“). Stärke: man weiß genau, was man qualitativ untersuchen muss, weil die quant Daten die Richtung vorgeben. Schwäche: die qual Phase wird oft zur bloßen Illustration degradiert („das passt zu unserem Ergebnis“), das ist methodisch zu wenig.",
      example: "QUANT: n = 2.500, Bottom-2 = 42 % Anschlussinfo → QUAL: 12 Interviews mit Reisenden, die im Quant-Teil explizit unzufrieden geantwortet hatten (Bottom-2) → Mechanismus „Anschlussangst“ → daraus A/B-Test der Designhypothese.",
      pitfall: "Falle: Die qual Phase darf nicht nur nachträgliche Illustration sein, sie muss eigenständig neue Erkenntnisse produzieren."
    },
    jointDisplay: {
      cat: "Mixed Methods", name: "Joint Display", mini: "joint-display",
      tldr: "Mixed-Methods-Studien scheitern oft an „Wir hatten beides, aber nichts verbunden“. Das Joint Display erzwingt die Integration.",
      long: "Das Joint Display (Creswell/Plano-Clark) ist eine Matrix, in der pro Frage QUAL- und QUANT-Befund NEBENEINANDER gelegt werden, und in der dritten Spalte wird die BEZIEHUNG zwischen beiden explizit benannt: Konvergenz, Komplementarität, Widerspruch. Erst aus dieser dritten Spalte entsteht die Meta-Inferenz, also die eigentliche Mixed-Methods-Aussage. Ohne Joint Display bleiben die beiden Datensätze nebeneinander statt zusammen.",
      example: "Spalten: Frage · QUANT-Befund · QUAL-Befund · Integrationsfrage · Meta-Inferenz · Entscheidung. Zeile 1: „Wo bricht Vertrauen?“ · „Bottom-2 = 42 % bei Anschluss“ · „O-Ton: ‚Schaffe ich es?‘“ · „Erklärt der Mechanismus den Effekt?“ · „Ja → Designhypothese gerechtfertigt“ · „A/B-Test starten“.",
      pitfall: "Falle: Nebeneinanderstellen ist noch keine Integration. Die Spalte „Beziehung“ entscheidet."
    },
    metaInference: {
      cat: "Mixed Methods", name: "Meta-Inferenz", mini: "meta-inference",
      tldr: "Die Aussage, die nur aus der Verbindung beider Evidenzen folgt, sonst wäre Mixed Methods reines Sammeln gewesen.",
      long: "Meta-Inferenz ist der explizite Schluss, der genau das integrierte Mixed-Methods-Design rechtfertigt. Konvergenz (beide zeigen dasselbe) stärkt Vertrauen, Divergenz (beide zeigen Verschiedenes) fordert Erklärung, ist aber oft die spannendere Information. Ohne Meta-Inferenz ist Mixed Methods nur teurere Forschung; mit Meta-Inferenz wird sie zur integrierten Aussage, die keine Einzelmethode tragen könnte.",
      example: "QUANT: −22 pp Abbruch nach Redesign. QUAL: Reisende beschreiben „endlich sehe ich, was passiert, wenn ich nicht schaffe“. → Meta-Inferenz: der gemessene Effekt wird durch den qualitativ identifizierten Mechanismus (Kontrollverlust → Kontrollgewinn) erklärt. Konvergent + plausibel → Rollout-Entscheidung tragfähig.",
      pitfall: "Falle: Widersprüche zwischen QUAL und QUANT wegmoderieren ist der häufigste Fehler. Sie sind die wertvollste Information."
    },
    decisionArtifact: {
      cat: "Transfer", name: "Decision Artifact", mini: "fit",
      tldr: "Forschung endet nicht beim „interessanten Befund“. Erst wenn der Befund eine Entscheidung trägt, ist sie für den Auftraggeber wirklich abgeschlossen.",
      long: "Ein Decision Artifact ist die letzte Meile von Forschung zur Handlung: eine konkrete Empfehlung MIT klarer Bedingung („gilt unter diesen Umständen“), Reichweite („für dieses Segment“) und Prüfgröße („Erfolg = X“). Es ist Praxis-Übersetzung des Befunds, keine zusätzliche Forschung, sondern die explizite Brücke. Ohne dieses Artefakt bleibt jede Studie interpretationsbedürftig und versickert oft im Reporting.",
      example: "Empfehlung: Umstiegsanzeige neu (Variante B), Roll-out bei Umstiegszeit ≤ 8 min, Erfolg = −15 pp Abbruch nach 30 Tagen Monitoring. Verantwortlich: Produkt-Team Navigator. Reviewer: Service Operations.",
      pitfall: "Falle: Forschung endet nicht beim Befund. Wer die Entscheidungsfrage offen lässt, hat die Arbeit halb gemacht."
    },
    sparseData: {
      cat: "Paid Search", name: "Sparse Data", mini: "sampling-error",
      tldr: "Auf Gesamtebene viele Daten, auf Entscheidungseinheit oft kaum Conversions.",
      long: "Sparse Data ist das paid-search-typische Big-Data-Paradox: Millionen Klicks insgesamt, aber pro Keyword × Anzeige × Kontext oft 0–10 Conversions. Aggregation maskiert das Problem; Entscheidungen leben auf der granularen Ebene.",
      example: "Long-Tail-Keyword „Bahnreise Lübeck Ostsee Wochenende“, 14 Klicks, 1 Conversion. CVR-Schätzung ≈ 7% mit Konfidenzintervall [0,2%; 33%].",
      formal: "n_klein, p̂ = y/n, SE = √(p̂(1−p̂)/n) explodiert.",
      pitfall: "Falle: Big Data kann auf Entscheidungsebene trotzdem dünn sein."
    },
    cvr: {
      cat: "Paid Search", name: "Conversion Rate", mini: "posterior",
      tldr: "CVR ist die Wahrscheinlichkeit, dass aus einem Klick eine gewünschte Handlung wird.",
      long: "CVR = Conversions/Klicks. Bei wenigen Klicks ist die beobachtete CVR ein verrauschter Schätzer der wahren Rate, die Bayes-Welt nennt diese θ.",
      example: "120 Klicks, 4 Conversions → CVR = 3,3%; mit Beta(1,1)-Prior wird das Posterior Beta(5, 117).",
      formal: "p̂ = y/n; Bayes: θ | y,n ~ Beta(α+y, β+n−y).",
      pitfall: "Falle: Bei wenigen Klicks ist die beobachtete CVR extrem instabil."
    },
    longtail: {
      cat: "Paid Search", name: "Long Tail", mini: "text-corpus",
      tldr: "Viele seltene Keywords erzeugen wenig direkte Evidenz, sind zusammen aber wirtschaftlich relevant.",
      long: "Im Long Tail dominieren niedrige Volumina pro Keyword, Standardmodelle und A/B-Tests versagen pro Zelle. Hierarchische und Bayesianische Verfahren teilen Information zwischen Zellen, ohne sie gleichzusetzen.",
      example: "80% der Buchungs-Keywords haben < 50 Klicks/Monat; zusammen aber 35% des Umsatzes.",
      pitfall: "Falle: Head-Keyword-Logik skaliert schlecht in den Long Tail."
    },
    bidcell: {
      cat: "Paid Search", name: "Bid Cell", mini: "journey-reg",
      tldr: "Die operative Einheit ist Keyword × Anzeige × Kontext, dort muss ein Gebot entschieden werden.",
      long: "Die Bid Cell ist die Entscheidungseinheit, nicht der Datensatz. Daten aggregieren über Cells, Entscheidungen finden in Cells statt. Diese Diskrepanz erzeugt das Sparse-Data-Problem in paid search.",
      example: "Cell = (Keyword „Studium Lübeck“, Anzeigentext A, Device Mobile, Tageszeit 18–22 Uhr).",
      pitfall: "Falle: Die Entscheidungseinheit ist kleiner als der Datensatz."
    },
    transferLoop: {
      cat: "Transfer", name: "Public research → implementation", mini: "merge",
      tldr: "Forschungsbeitrag als Schleife: Signal erkennen, These formulieren, veröffentlichen, im Anwendungskontext testen.",
      long: "Klassische Veröffentlichungslogik ist linear; in schnellen AI-Märkten ist sie eine Schleife. Public research → implementation case → Rückkopplung → nächste Iteration.",
      example: "SVRN/MPCM: thesis paper → IR-readiness audits in 6 Unternehmen → empirischer Datensatz → revidierter framework.",
      pitfall: "Falle: Transfer ist nicht Kommunikation nach der Forschung, sondern Teil der Prüfung."
    },
    aiReadiness: {
      cat: "AI-readable IR", name: "AI-readiness Score", mini: "fit",
      tldr: "Misst, ob IR-Inhalte für Agenten auffindbar, abrufbar und maschinenlesbar sind.",
      long: "Der Score kombiniert drei Dimensionen: Discoverability (kann der Agent es finden?), Accessibility (kann er es abrufen?), Quality (kann er es parsen?). Aktuell schneiden viele DAX-Unternehmen schlecht ab.",
      example: "Vorab-Audit 12 DAX-IR-Sites: Mittlerer Score 0,42 / 1,0; bestes Quartil 0,71, schwächstes 0,18.",
      formal: "Score = mean(Discoverability, Accessibility, Quality), jeweils ∈ [0,1].",
      pitfall: "Falle: Gute menschliche Gestaltung heißt nicht automatisch gute maschinelle Lesbarkeit."
    },
    machineReadable: {
      cat: "AI-readable IR", name: "Machine-readable standards", mini: "prompt-instrument",
      tldr: "Schema.org, JSON-LD, XBRL, RSS oder llms.txt strukturieren Signale für maschinelle Verarbeitung.",
      long: "Maschinenlesbare Standards sind die unsichtbare Infrastruktur für AI-zugängliche IR. Sie sind nur dann nützlich, wenn sie konsistent gepflegt werden, sonst lernen Agenten Scheinmuster.",
      example: "IR-Kennzahlen als XBRL + JSON-LD + RSS-Feed für Quartalsmeldungen.",
      pitfall: "Falle: Standards müssen konsistent gepflegt werden, sonst entsteht Scheingenauigkeit."
    },
    programmaticAccess: {
      cat: "AI-readable IR", name: "Programmatic access", mini: "audit",
      tldr: "APIs oder strukturierte Feeds erlauben Agenten reproduzierbaren Zugriff auf aktuelle IR-Daten.",
      long: "Programmatischer Zugriff ist die Voraussetzung dafür, dass Agenten überhaupt aktuelle und vollständige Daten ziehen können. PDF-Downloads sind kein robuster Datenkanal.",
      example: "Public REST-API: /api/financial/quarterly?period=Q1-2026 → JSON mit allen GuV-/Bilanz-Positionen.",
      pitfall: "Falle: PDFs allein sind kein robuster Datenkanal."
    },
    informationAsymmetry: {
      cat: "AI-readable IR", name: "Information asymmetry", mini: "divergence",
      tldr: "Wenn Agenten Primärquellen nicht lesen können, entsteht ein Vorteil für besser auffindbare Sekundärquellen.",
      long: "Marktrelevante Information fließt zunehmend durch KI-Vermittler. Wer für Agenten unsichtbar ist, verliert Erzählhoheit an Aggregatoren und Analysten, auch ohne inhaltliche Veränderung.",
      example: "ChatGPT-Antwort zu einem CEO zitiert 4 Sekundärquellen, aber nicht die IR-Site selbst.",
      pitfall: "Falle: Das Problem ist nicht nur Inhalt, sondern Übertragung."
    },
    agentPipeline: {
      cat: "Open Paper Machine", name: "Agent pipeline", mini: "llm-panel",
      tldr: "Spezialisierte Agenten übernehmen Teilaufgaben, der Prozess bleibt dokumentiert und überprüfbar.",
      long: "Eine Agent-Pipeline zerlegt Forschungsproduktion in benannte Phasen (Search, Frame, Produce, Verify, Revise). Jede Phase liefert ein eigenes Artefakt mit Zwischenprüfung, statt monolithisch zu generieren.",
      example: "Pipeline-Schritte: Search → literature_base.csv · Frame → outline.md · Produce → draft.md · Verify → verification_report.md · Revise → paper.tex.",
      pitfall: "Falle: Delegation ersetzt keine wissenschaftliche Verantwortung."
    },
    auditTrail: {
      cat: "Open Paper Machine", name: "Audit Trail", mini: "audit",
      tldr: "Wenn Ergebnisse später hinterfragt werden, muss man zeigen können wie sie zustande kamen, sonst stehen sie auf Vertrauen statt Belegen.",
      long: "Der Audit Trail dokumentiert die Forschungsproduktion lückenlos: welche Codier-Entscheidung wann von wem getroffen wurde, welche Iteration des Codebuchs ein Ergebnis erzeugte, welche Prompts und Modell-Versionen (im KI-gestützten Setting) zum Ausgang führten. Das ist das Pendant zu Lab-Notebooks in den Naturwissenschaften, ohne diese Spur ist die Forschung „glauben Sie mir“, nicht „prüfen Sie nach“.",
      example: "orchestration_log.md mit Zeitstempeln, Modell-IDs, Prompt-Versionen, Human-Gate-Entscheidungen pro Phase; oder bei Codierung: Codebuch v1 → v2 → v3 mit Diff-Begründungen.",
      pitfall: "Falle: Nur das Endprodukt zeigen heißt: die Methodendiskussion wird unmöglich gemacht."
    },
    humanGate: {
      cat: "Open Paper Machine", name: "Human gate", mini: "capacity",
      tldr: "Kritische Phasen brauchen bewusste menschliche Entscheidung: Richtung, Struktur, Quellenprüfung, Revision.",
      long: "Human Gates sind erzwungene Stopppunkte zwischen Pipeline-Phasen, an denen die Forscher:in inhaltlich entscheidet, nicht nur „weiter“-klickt. Sie verhindern, dass KI-Output unbemerkt im Endtext landet.",
      example: "Gate nach Verify-Phase: Verification-Report wird gegen Quellen gelesen, jedes MISMATCH manuell entschieden.",
      pitfall: "Falle: Automatisierung ohne Gate verlagert Fehler in den Endtext."
    },
    verification: {
      cat: "Open Paper Machine", name: "Verification", mini: "validity",
      tldr: "Claims, Zitate und Quellen werden explizit gegen die Belege geprüft.",
      long: "Verification ist die Quellenprüfungs-Phase: jedes Zitat wird gegen den tatsächlichen Quellentext abgeglichen und als VERIFIED, PLAUSIBLE, MISMATCH oder UNVERIFIABLE klassifiziert.",
      example: "Sample 30 Zitate, 4 als MISMATCH klassifiziert, 2 als UNVERIFIABLE → Quoten als Qualitätsindikator.",
      pitfall: "Falle: Sprachliche Plausibilität ist kein Quellenbeweis."
    },
    orchestration: {
      cat: "AI Research", name: "Orchestration", mini: "curator",
      tldr: "Wert verschiebt sich vom Produzieren jedes Satzes zum Entwerfen, Prüfen und Steuern des Forschungsprozesses.",
      long: "Wenn LLMs Produktion zunehmend übernehmen können, liegt die Differenz zwischen Forscher:innen im Prozess­design: welche Schritte, welche Quellen, welche Prüfungen, welche Entscheidungen.",
      example: "Eine Studie ist nicht „mit ChatGPT geschrieben“, sondern durch eine 8-Phasen-Pipeline mit benannten Artefakten produziert.",
      pitfall: "Falle: Orchestrieren ist anspruchsvoller als bloß Prompten."
    },
    accountability: {
      cat: "AI Research", name: "Accountability", mini: "institutional",
      tldr: "Verantwortung bleibt bei den Forschenden: was wurde entschieden, geprüft, verworfen, freigegeben.",
      long: "Accountability in KI-gestützter Forschung ist kein Auto-Disclaimer am Ende, sondern eine Kette dokumentierter Entscheidungen mit Namen, Zeitpunkt und Begründung.",
      example: "Im Audit Trail: „Human Gate 04 · 2026-04-12 · TBB · Tabelle 3 verworfen, weil Quellenlage zu dünn.“",
      pitfall: "Falle: KI-Beteiligung darf Verantwortung nicht verwischen."
    },
    sampleSize: {
      cat: "Stichprobe", name: "Fallzahl n", mini: "sample",
      tldr: "Wie viele Fälle die Aussage tragen, und damit, wie präzise und wie kleinteilig wir behaupten dürfen.",
      long: "n entscheidet drei Dinge zugleich: (1) Präzision, schmale Konfidenzintervalle brauchen großes n. (2) Power, kleine Effekte erkennt nur eine ausreichend große Studie. (3) Granularität, pro Schicht/Segment muss ebenfalls genug n übrig bleiben, sonst zerfallen die Aussagen. Was n nicht schenkt, ist Repräsentativität, die entsteht im Auswahlverfahren, nicht in der Zahl.",
      example: "n = 2.500 Reisende, geschichtet nach Strecke × Tageszeit → SE für 50%-Anteil ≈ 1 pp; Bottom-2 zwischen Strecken auf 3 pp unterscheidbar; jede der 25 Strecken-Zellen hat ≥ 100 Fälle.",
      formal: "SE_p = √(p(1−p)/n); 95%-KI ≈ p ± 1,96·SE_p.",
      pitfall: "Falle: 1 Million falsch ausgewählte Fälle sind unbrauchbarer als 500 sauber ausgewählte. Großes n korrigiert keinen Bias."
    },
    qualSampleSize: {
      cat: "Qualitativ", name: "Fallzahl im qualitativen Design", mini: "saturation",
      tldr: "n steht für Materialtiefe, Kontrast und Sättigung, nicht für Marktanteile oder Power.",
      long: "Qualitative Fallzahlen werden durch Erkenntniszuwachs begründet, nicht durch Inferenzformel. 8–25 Fälle sind typisch; entscheidend ist die theoretische Sättigung.",
      example: "12 Interviews entlang Pendler / Geschäft / Freizeit; bei den letzten drei Interviews entstehen keine neuen Codes.",
      pitfall: "Falle: Kleine qualitative n nicht in Prozentzahlen übersetzen."
    },
    saturation: {
      cat: "Qualitativ", name: "Sättigung", mini: "saturation",
      tldr: "Im Quant heißt es „n=2.500 reicht“, im Qual heißt es „wir hören auf, wenn neue Fälle keine neue Erkenntnis bringen“. Das ist Sättigung.",
      long: "Sättigung ersetzt die Power-Logik im qualitativen Design: man rechnet nicht vorab aus, wie viele Fälle nötig sind, man beobachtet während der Erhebung, ab wann zusätzliche Interviews kaum noch neue Kategorien oder Mechanismen produzieren. Das geschieht typischerweise zwischen Fall 10 und 20, je nach Heterogenität des Feldes (homogene Pendler:innen-Gruppe: ~10; diverse Reisegruppen: ~20). Sättigung ist ein OBSERVIERTER Stoppgrund, kein fixer Zahlenwert, und sie muss am Material BEGRÜNDET werden (z. B. Code-Häufigkeitsdiagramm zeigt Plateau).",
      example: "Bei 12 Interviews zeigt das Code-Häufigkeits-Diagramm: ab Interview 9 entstehen keine neuen Codes mehr, Interviews 10–12 bestätigen nur. → Sättigung dokumentiert, Erhebung gestoppt.",
      pitfall: "Falle: „Wir haben 12 Interviews geführt, das ist Sättigung“ ist keine Begründung, die Plateau-Evidenz muss gezeigt werden."
    },
    transparency: {
      cat: "Qualitativ", name: "Transparenz", mini: "transparency",
      tldr: "Qualitative Forschung kann im strengen Sinn nicht repliziert werden, aber sie kann NACHVOLLZIEHBAR sein. Transparenz ersetzt Replikation funktional.",
      long: "Im quantitativen Design gilt: andere können meine Studie mit demselben Verfahren wiederholen und das Ergebnis prüfen. Im qualitativen Design geht das in dieser strengen Form nicht, jede Interaktion ist einmalig. Stattdessen wird Glaubwürdigkeit über Transparenz hergestellt: andere müssen nachvollziehen können, wie die Deutung entstand. Konkret heißt das: vollständige Dokumentation von Sampling-Entscheidungen, Leitfaden, Codebuch, Codier-Iterationen, Reflexivitäts-Memos, Audit-Trail. Eine Studie ohne diesen Apparat ist nicht falsch, aber sie ist nicht prüfbar, also wissenschaftlich schwach.",
      example: "Anhang einer qualitativen Studie: Leitfaden v3, Coding-Frame mit 17 Codes und Ankerbeispielen, Sampling-Tabelle, drei Reflexivitäts-Memos, vollständiger Codier-Audit über 12 Wochen.",
      pitfall: "Falle: Nur die schönen Ergebnisfolien zeigen heißt: niemand kann die Deutung kritisieren, das ist kein Qualitätsmerkmal."
    },
    kappa: {
      cat: "Codierung", name: "Cohen's κ", mini: "kappa",
      tldr: "Wenn zwei Codierende denselben Text unterschiedlich einordnen, ist die Kategorie zu unklar definiert, und das Ergebnis ist Coder-Idiosynkrasie, nicht Material.",
      long: "Eine qualitative Codierung ist nur dann analytisch belastbar, wenn unabhängige Codierende DEMSELBEN Material DIESELBEN Codes zuweisen würden. Eine einfache prozentuale Übereinstimmung reicht nicht: zwei Codierende, die zufällig dasselbe sagen, hätten auch ohne Codebuch hohe Übereinstimmung. κ korrigiert um diesen Zufallsanteil. Landis/Koch-Konventionen: κ ≥ .61 substantial, ≥ .81 almost perfect. Niedriger κ heißt nicht „falsche Codierung“, sondern „Codebuch noch unklar“ → iterativ schärfen.",
      example: "200 Beschwerde-Tickets, 2 Codierende, beobachtete Übereinstimmung p_o = .92 (klingt super), aber zufällig erwartet p_e = .65 → κ = .77 → substantial, aber nicht perfekt.",
      formal: "κ = (p_o − p_e) / (1 − p_e).",
      pitfall: "Falle: Kappa prüft nur die Anwendung des Codebuchs, nicht ob das Codebuch inhaltlich richtig ist."
    },
    percentAgreement: {
      cat: "Codierung", name: "Prozentuale Übereinstimmung", mini: "kappa",
      tldr: "Das einfachste Reliabilitätsmaß: Anteil der Fälle, in denen zwei Codierende denselben Code vergeben. Intuitiv, aber zufallsblind.",
      long: "Die prozentuale Übereinstimmung (p_o) zählt schlicht: wie oft haben beide Codierende denselben Code für denselben Fall vergeben? Ergebnis ist eine Quote zwischen 0 und 1. Stärke: extrem leicht zu kommunizieren, „92 % Übereinstimmung“ klingt überzeugend. Schwäche: rechnet Zufallstreffer nicht heraus. Bei zwei nominalen Kategorien (ja/nein) erreichen zufällige Codierende schon ~50 % Übereinstimmung; bei stark unbalancierten Verteilungen (z.B. 90 % Klasse A) liegt die zufällig erwartete Übereinstimmung sogar bei ~82 %. Genau hier setzt Cohen's κ an: es korrigiert die Beobachtung um diesen Zufallsanteil. p_o ist deshalb selten allein berichtbar, sondern immer Zwischenschritt auf dem Weg zu κ oder α.",
      example: "200 Beschwerde-Tickets, 2 Codierende, gleicher Code in 184 Fällen → p_o = .92. Aussage: nice to know, aber ohne Zufallsbereinigung nicht publikationsreif.",
      formal: "p_o = #{gleiche Codes} / #{alle Codierungen}.",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><text x='75' y='14' font-family='DM Mono, monospace' font-size='10' fill='#0f172a' text-anchor='middle'>Coder A</text><text x='195' y='14' font-family='DM Mono, monospace' font-size='10' fill='#0f172a' text-anchor='middle'>Coder B</text><rect x='45' y='22' width='60' height='12' fill='#0f172a'/><rect x='165' y='22' width='60' height='12' fill='#0f172a'/><text x='240' y='32' font-family='DM Mono, monospace' font-size='10' fill='#0f172a'>match</text><rect x='45' y='38' width='60' height='12' fill='#cbd5e1'/><rect x='165' y='38' width='60' height='12' fill='#cbd5e1'/><text x='240' y='48' font-family='DM Mono, monospace' font-size='10' fill='#0f172a'>match</text><rect x='45' y='54' width='60' height='12' fill='#0f172a'/><rect x='165' y='54' width='60' height='12' fill='#D9272E'/><text x='240' y='64' font-family='DM Mono, monospace' font-size='10' font-weight='700' fill='#D9272E'>mismatch</text><rect x='45' y='70' width='60' height='12' fill='#0f172a'/><rect x='165' y='70' width='60' height='12' fill='#0f172a'/><text x='240' y='80' font-family='DM Mono, monospace' font-size='10' fill='#0f172a'>match</text><text x='370' y='48' font-family='DM Mono, monospace' font-size='12' font-weight='700' fill='#0f172a' text-anchor='middle'>p_o = 3/4</text></svg>",
      pitfall: "Falle: Hohe Prozent-Übereinstimmung wirkt überzeugend, ignoriert aber Zufallstreffer und die Balance der Kategorien."
    },
    krippendorff: {
      cat: "Codierung", name: "Krippendorff's α", mini: "krippendorff",
      tldr: "Wenn man mehr als zwei Codierende, mehrere Skalenniveaus oder Lücken im Material hat, scheitert κ, α ist die robuste Alternative.",
      long: "Krippendorff's α verallgemeinert die Reliabilitätsidee in mehreren Dimensionen: beliebig viele Codierende (nicht nur 2), beliebige Skalenniveaus (nominal, ordinal, metrisch), und Umgang mit Missing Data. Konventionen: α ≥ .80 als Publikations-Standard, ≥ .67 für explorative Arbeit. Wird in der Kommunikations- und Medienforschung breit eingesetzt; in der Marktforschung als rigoroseres Pendant zu κ, wenn drei oder mehr Codierende üblich sind.",
      example: "3 Codierende, 500 Beschwerde-Segmente, nominalskaliert, α = .81 → publikationsfähig.",
      formal: "α = 1 − D_o / D_e (beobachtete vs. erwartete Disagreement-Varianz).",
      pitfall: "Falle: Hohes α heißt nur „die Codierenden sind sich einig“, nicht „die Codierung trifft die Wahrheit“. Validität bleibt eigene Frage."
    },
    cronbach: {
      cat: "Skalen", name: "Cronbach's α", mini: "alpha",
      tldr: "Darf ich aus mehreren Items eine Summen-/Mittelwert-Skala bauen? α sagt: ja, wenn die Items dieselbe Richtung messen.",
      long: "Wir messen ein abstraktes Konstrukt (z. B. „Anschlussvertrauen“) selten mit einem Item, sondern mit 4–7 Items. Vor der Score-Bildung muss man prüfen: schwingen diese Items miteinander mit, oder messen sie verschiedene Dinge? Cronbach's α quantifiziert genau das, wie stark Items derselben Skala miteinander korrelieren. α ≥ .70 = brauchbar, ≥ .80 = solide, > .95 = die Items sind redundant (zu viele, zu ähnlich). Ohne ein vernünftiges α darf man die Items nicht zusammenfassen, der Score wäre Müll.",
      example: "SERVQUAL Reliability-Dimension, 5 Items: „Service kommt zugesagt“, „Termin wird gehalten“ … α = .84 → die fünf Items messen gemeinsam ein Konstrukt → Score-Bildung erlaubt.",
      formal: "α = (k/(k−1)) · (1 − Σ σ²_i / σ²_total).",
      pitfall: "Falle: α prüft nur, ob Items zusammenhängen, nicht was sie messen. Konstruktvalidität bleibt eigene Frage."
    },
    confidenceInterval: {
      cat: "Inferenz", name: "Konfidenzintervall", mini: "ci",
      tldr: "Eine Punktschätzung ohne KI ist eine Behauptung, das KI macht aus der Schätzung eine prüfbare Aussage.",
      long: "„Bottom-2 = 42 %“ klingt präzise, kann aber bei kleinem n viele Prozentpunkte daneben liegen. Das 95 %-KI sagt: „Der wahre Wert liegt mit hoher Sicherheit in [40 %; 44 %].“ Damit kann man zwei Werte rechnerisch sauber vergleichen: wenn die KIs zweier Schätzungen sich nicht überlappen, ist der Unterschied belastbar, sonst nicht. Strikt gilt: 95 % der identisch konstruierten Intervalle enthalten den wahren Wert (nicht: „95 % Wahrscheinlichkeit, dass θ drin ist“, das wäre Bayes).",
      example: "Δ Abbruchquote Treatment vs. Kontrolle = −22 pp, 95%-KI [−23,4; −20,6]. KI schließt 0 deutlich aus → robuster Effekt.",
      formal: "θ̂ ± z_{1−α/2} · SE(θ̂).",
      pitfall: "Falle: KI quantifiziert nur Zufall, keinen Bias. Ein schmales KI bei schlechter Auswahl ist präzise falsch."
    },
    pvalue: {
      cat: "Inferenz", name: "p-Wert", mini: "pvalue",
      tldr: "Schutz vor „Wir sehen ein Muster, das nur Zufall war.“ Wie unwahrscheinlich wären die Daten, wenn nichts wirklich los wäre?",
      long: "Der p-Wert misst, wie überraschend die Daten unter der Nullhypothese (kein Effekt) wären. Sehr kleiner p-Wert = das Beobachtete passt nicht zur „kein Effekt“-Welt → H₀ wird verworfen. Die Schwelle p < .05 ist Konvention, kein Naturgesetz. Wichtig: ein winziger p-Wert bedeutet nicht „großer Effekt“, bei riesigen Stichproben werden auch winzige Unterschiede signifikant. Effektgröße + Power müssen daneben gelesen werden.",
      example: "Treatment vs. Kontrolle, n = 9.200, Δ = −22 pp, χ² = 1.040, p < .001 → unter H₀ praktisch unmöglich, also Effekt belastbar.",
      formal: "p = P(T ≥ t_obs | H₀ wahr).",
      pitfall: "Falle: Statistische Signifikanz ≠ praktische Relevanz. Immer Effektgröße + KI dazu lesen."
    },
    cohenD: {
      cat: "Effekt", name: "Cohen's d", mini: "cohen",
      tldr: "Macht Mittelwertunterschiede über Skalen, Studien und Domänen vergleichbar, wieviele Standardabweichungen liegt M_T von M_K weg?",
      long: "Eine Mittelwertdifferenz allein („+1,2 Punkte“) ist ohne Kontext bedeutungslos. d standardisiert den Abstand in SD-Einheiten, damit kann man Effekte aus einer 7er-Skala mit Effekten aus einer 11er-Skala oder aus ganz anderen Studien direkt vergleichen. Daumenregel Cohen: 0,2 klein · 0,5 mittel · 0,8 groß. Die Regel ist nur Orientierung, in Bildungsforschung sind 0,2 schon groß, in der UX-Forschung erwartet man oft > 0,5.",
      example: "Wartezeit-Wahrnehmung Treatment vs. Kontrolle: M_T = 4,1; M_K = 5,3; SD_pooled = 1,4 → d = −0,86 → großer Effekt.",
      formal: "d = (M_1 − M_2) / SD_pooled.",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='72' x2='388' y2='72' stroke='#cbd5e1' stroke-width='1'/><path d='M 50 72 Q 135 12 220 72' stroke='#0f172a' stroke-width='1.5' fill='rgba(15,23,42,0.06)'/><line x1='135' y1='22' x2='135' y2='72' stroke='#0f172a' stroke-width='1' stroke-dasharray='2 2'/><text x='135' y='84' font-family='DM Mono, monospace' font-size='10' fill='#0f172a' text-anchor='middle'>M₁</text><path d='M 180 72 Q 265 12 350 72' stroke='#D9272E' stroke-width='1.5' fill='rgba(217,39,46,0.08)'/><line x1='265' y1='22' x2='265' y2='72' stroke='#D9272E' stroke-width='1' stroke-dasharray='2 2'/><text x='265' y='84' font-family='DM Mono, monospace' font-size='10' fill='#D9272E' text-anchor='middle'>M₂</text><line x1='140' y1='30' x2='258' y2='30' stroke='#0f172a' stroke-width='1.5'/><polygon points='258,26 268,30 258,34' fill='#0f172a'/><text x='200' y='24' font-family='DM Mono, monospace' font-size='11' font-weight='700' fill='#0f172a' text-anchor='middle'>d · in SD-Einheiten</text></svg>",
      pitfall: "Falle: Daumenregeln nicht über Domänen blind anwenden. Kontext bestimmt, was „groß“ ist."
    },
    riskDifference: {
      cat: "Effekt", name: "Prozentpunktdifferenz", mini: "pvalue",
      tldr: "Differenz zweier Anteile, gemessen in Prozentpunkten, nicht in Prozentveränderung.",
      long: "Die Risk Difference (RD) gibt den absoluten Unterschied zwischen zwei Anteilen an. Sie ist direkt handlungsrelevant, weil sie absolute Häufigkeiten quantifiziert.",
      example: "63% Abbruch in Kontrolle, 41% in Treatment → RD = −22 pp; das sind nicht 22% weniger Abbrüche, sondern 35% relativer Rückgang.",
      formal: "RD = p_T − p_K; SE = √(p_T(1−p_T)/n_T + p_K(1−p_K)/n_K).",
      pitfall: "Falle: Prozentpunkte nicht mit Prozentveränderung verwechseln."
    },
    correlation: {
      cat: "Zusammenhang", name: "Korrelation r", mini: "scatter",
      tldr: "Gehen zwei Variablen miteinander hoch und runter, und wenn ja, wie eng? r ist die kompakteste Zusammenfassung dieses Mitschwingens.",
      long: "Pearsons r liegt in [−1; +1]: +1 = perfekt positiv, 0 = kein linearer Zusammenhang, −1 = perfekt negativ. r macht aus einer Punktewolke eine Zahl, Grundlage für Hypothesen über Wirkung („wenn Wartezeit länger, ist Zufriedenheit niedriger“). Wichtig: r erfasst nur LINEAR und ist anfällig für Ausreißer und U-förmige Zusammenhänge.",
      example: "Wartezeit (min) vs. Zufriedenheit (1–7): r = −0,81, p < .001, n = 240 → starker negativer Zusammenhang, jeder zusätzliche Min Wartezeit drückt die Zufriedenheit.",
      formal: "r = Σ(x_i−x̄)(y_i−ȳ) / √(Σ(x_i−x̄)² · Σ(y_i−ȳ)²).",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='72' x2='388' y2='72' stroke='#cbd5e1' stroke-width='1'/><line x1='30' y1='10' x2='30' y2='72' stroke='#cbd5e1' stroke-width='1'/><circle cx='55' cy='20' r='3' fill='#0f172a'/><circle cx='80' cy='26' r='3' fill='#0f172a'/><circle cx='105' cy='22' r='3' fill='#0f172a'/><circle cx='130' cy='32' r='3' fill='#0f172a'/><circle cx='155' cy='28' r='3' fill='#0f172a'/><circle cx='180' cy='38' r='3' fill='#0f172a'/><circle cx='205' cy='42' r='3' fill='#0f172a'/><circle cx='230' cy='38' r='3' fill='#0f172a'/><circle cx='255' cy='50' r='3' fill='#0f172a'/><circle cx='280' cy='54' r='3' fill='#0f172a'/><circle cx='305' cy='52' r='3' fill='#0f172a'/><circle cx='330' cy='62' r='3' fill='#0f172a'/><line x1='50' y1='20' x2='340' y2='66' stroke='#D9272E' stroke-width='1.5' stroke-dasharray='4 3'/><text x='378' y='84' font-family='DM Mono, monospace' font-size='10' font-weight='700' fill='#D9272E' text-anchor='end'>r ≈ −0,81 · linear</text></svg>",
      pitfall: "Falle: Korrelation ist kein Kausalitätsbeweis. Drittvariablen, Selbstselektion und Umkehrung der Wirkrichtung erklären viele Korrelationen."
    },
    rSquared: {
      cat: "Modell", name: "R²", mini: "scatter",
      tldr: "Wieviel der Variation der Zielgröße erklärt mein Modell? Die Antwort von 0 % (gar nichts) bis 100 % (perfekt).",
      long: "R² (Determinationskoeffizient) sagt: wenn ich die Streuung der Zielgröße in „durch Modell erklärt“ und „Residuum/Rest“ zerlege, welcher Anteil ist erklärt? R² = .68 heißt: 68 % der Varianz von Zufriedenheit lässt sich aus Wartezeit + Tageszeit vorhersagen, 32 % bleiben unerklärt. Achtung: Mehr Prädiktoren ins Modell pumpen erhöht R² automatisch, deshalb adj. R² berichten, das Komplexität bestraft.",
      example: "Lineare Regression Zufriedenheit ~ Wartezeit + Tageszeit, n = 240: R² = .68, adj. R² = .66, F(2, 237) = 252, p < .001 → 2/3 der Varianz mit zwei Prädiktoren erklärt.",
      formal: "R² = 1 − SS_res / SS_tot.",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='72' x2='388' y2='72' stroke='#cbd5e1' stroke-width='1'/><line x1='30' y1='10' x2='30' y2='72' stroke='#cbd5e1' stroke-width='1'/><line x1='40' y1='62' x2='340' y2='18' stroke='#D9272E' stroke-width='1.5'/><line x1='60' y1='56' x2='60' y2='66' stroke='#cbd5e1' stroke-width='1'/><circle cx='60' cy='56' r='3' fill='#0f172a'/><line x1='120' y1='50' x2='120' y2='42' stroke='#cbd5e1' stroke-width='1'/><circle cx='120' cy='42' r='3' fill='#0f172a'/><line x1='180' y1='44' x2='180' y2='48' stroke='#cbd5e1' stroke-width='1'/><circle cx='180' cy='48' r='3' fill='#0f172a'/><line x1='240' y1='38' x2='240' y2='30' stroke='#cbd5e1' stroke-width='1'/><circle cx='240' cy='30' r='3' fill='#0f172a'/><line x1='300' y1='32' x2='300' y2='36' stroke='#cbd5e1' stroke-width='1'/><circle cx='300' cy='36' r='3' fill='#0f172a'/><text x='378' y='84' font-family='DM Mono, monospace' font-size='10' font-weight='700' fill='#D9272E' text-anchor='end'>R² ≈ 0,68 · Anteil erklärt</text></svg>",
      pitfall: "Falle: Hohes R² heißt nicht „kausal richtig“, nur „passt zu den vorliegenden Daten“. Overfitting ist möglich."
    },
    oddsRatio: {
      cat: "Logistische Regression", name: "Odds Ratio", mini: "odds",
      tldr: "Wenn das Outcome ja/nein ist (gebucht / nicht gebucht), ist OR die natürliche Sprache für „wie viel besser ist die Chance in Gruppe B?“.",
      long: "Bei binären Outcomes nutzt logistische Regression Odds = p/(1−p) als Effekt-Skala (nicht direkt Wahrscheinlichkeit). OR ist das Verhältnis der Odds in zwei Gruppen. OR = 1 → identisch; OR = 2 → doppelt so hohe Chance; OR < 1 → verringerte Chance. Bei seltenen Outcomes liegt OR nahe am relativen Risiko, bei häufigen Outcomes übertreibt OR den relativen Unterschied.",
      example: "Buchungs-OR für Treatment vs. Kontrolle = 1,47 (95%-KI [1,31; 1,65]) → 47 % höhere Buchungs-Odds, KI schließt 1 deutlich aus.",
      formal: "OR = (p_T/(1−p_T)) / (p_K/(1−p_K)).",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><text x='90' y='12' font-family='DM Mono, monospace' font-size='10' fill='#0f172a' text-anchor='middle'>Kontrolle</text><rect x='30' y='20' width='120' height='16' fill='#e2e8f0'/><rect x='30' y='20' width='48' height='16' fill='#0f172a'/><text x='90' y='52' font-family='DM Mono, monospace' font-size='9' fill='#0f172a' text-anchor='middle'>40 / 60 → Odds 0,67</text><text x='318' y='12' font-family='DM Mono, monospace' font-size='10' font-weight='700' fill='#D9272E' text-anchor='middle'>Treatment</text><rect x='258' y='20' width='120' height='16' fill='#f5d8d9'/><rect x='258' y='20' width='84' height='16' fill='#D9272E'/><text x='318' y='52' font-family='DM Mono, monospace' font-size='9' fill='#D9272E' text-anchor='middle'>70 / 30 → Odds 2,33</text><text x='204' y='80' font-family='DM Mono, monospace' font-size='12' font-weight='700' fill='#0f172a' text-anchor='middle'>OR = 2,33 / 0,67 ≈ 3,5</text></svg>",
      pitfall: "Falle: Im Lehrbuchsprech wird OR oft als „47 % mehr Käufer“ kommuniziert, das ist falsch. Odds ≠ Wahrscheinlichkeiten ≠ Prozentpunkte."
    },
    contentValidity: {
      cat: "Validität", name: "Inhaltsvalidität", mini: "content-validity",
      tldr: "Items decken den Bedeutungsraum des Konstrukts angemessen ab.",
      long: "Inhaltsvalidität wird vor der Datenerhebung argumentativ geprüft: Welche Facetten des Konstrukts deckt das Item-Set ab, welche nicht? Experten-Ratings (z. B. Lawshe-CVR) sind üblich.",
      example: "5-Item-Skala zu Anschlussvertrauen, vorab durch 4 Service-Researcher bewertet auf inhaltliche Abdeckung.",
      pitfall: "Falle: Interne Konsistenz ersetzt keine Inhaltsvalidität."
    },
    constructValidity: {
      cat: "Validität", name: "Konstruktvalidität", mini: "validity",
      tldr: "Die Messung passt zur Theorie und verhält sich erwartungsgemäß zu verwandten Konstrukten.",
      long: "Konstruktvalidität wird durch konvergente und diskriminante Validität belegt: Konstrukt korreliert hoch mit ähnlichen, niedrig mit verschiedenen. Methodenstreuung ist hilfreich (Multi-Trait-Multi-Method).",
      example: "Anschlussvertrauen korreliert r = .68 mit allgemeinem Servicevertrauen, r = .12 mit Preiszufriedenheit.",
      pitfall: "Falle: Ein sauberer Zahlenwert kann ein falsches Konstrukt messen."
    },
    criterionValidity: {
      cat: "Validität", name: "Kriteriumsvalidität", mini: "fit",
      tldr: "Die Messung sagt ein relevantes Außenkriterium oder Verhalten vorher.",
      long: "Kriteriumsvalidität ist concurrent (gleichzeitig erhoben) oder predictive (später erhoben). Sie macht eine Skala betrieblich nützlich, wenn das Kriterium handlungsrelevant ist.",
      example: "Anschlussvertrauen (t0) sagt Re-Buchungswahrscheinlichkeit (t+6 Monate) mit β = .42 vorher.",
      pitfall: "Falle: Ein plausibler Score braucht praktische Bewährung."
    },
    negativeCases: {
      cat: "Qualitative Validität", name: "Negative Fälle", mini: "countercase",
      tldr: "Wer nur bestätigende Belege sammelt, betreibt Bestätigung, nicht Forschung. Der Test einer Deutung sind Fälle, die ihr widersprechen.",
      long: "Negative Cases sind Fälle, die der bisherigen Interpretation widersprechen, und sie werden GEZIELT gesucht, nicht passiv erhofft. Wenn die Deutung auch nach Kontakt mit dem Gegenbeispiel hält, ist sie geschärft; wenn nicht, muss sie zurückgenommen oder differenziert werden. Das ist der qualitative Gegenpart zum quantitativen Falsifikationismus und unterscheidet rigorose Qual-Forschung von Bestätigungsschreiben.",
      example: "Nach 9 Interviews zu „Anschlussangst“ als Pendler-Mechanismus gezielt 3 Reisende rekrutieren, die Umstiege als entspannt erleben → 2 bestätigen die Deutung, 1 zeigt eine neue Subkategorie „Routine-Pendler:innen ohne Angst“.",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><text x='204' y='14' font-family='DM Mono, monospace' font-size='10' font-weight='700' fill='#0f172a' text-anchor='middle'>Arbeitshypothese H</text><line x1='30' y1='42' x2='378' y2='42' stroke='#cbd5e1' stroke-width='1' stroke-dasharray='3 3'/><circle cx='55' cy='28' r='4' fill='#0f172a'/><circle cx='85' cy='32' r='4' fill='#0f172a'/><circle cx='115' cy='26' r='4' fill='#0f172a'/><circle cx='145' cy='30' r='4' fill='#0f172a'/><circle cx='175' cy='28' r='4' fill='#0f172a'/><circle cx='205' cy='32' r='4' fill='#0f172a'/><text x='130' y='66' font-family='DM Mono, monospace' font-size='9' fill='#0f172a' text-anchor='middle'>9 bestätigende Fälle</text><circle cx='265' cy='56' r='5' fill='#D9272E' stroke='#0f172a' stroke-width='1'/><circle cx='305' cy='60' r='5' fill='#D9272E' stroke='#0f172a' stroke-width='1'/><circle cx='345' cy='54' r='5' fill='#D9272E' stroke='#0f172a' stroke-width='1'/><text x='305' y='82' font-family='DM Mono, monospace' font-size='9' font-weight='700' fill='#D9272E' text-anchor='middle'>3 Negative Fälle → H schärfen</text></svg>",
      pitfall: "Falle: Cherry-picking nur bestätigender Zitate ist die häufigste Form qualitativer Schwäche, auch unbewusst."
    },
    fallkontrast: {
      cat: "Fallauswahl", name: "Fallkontrast", mini: "countercase",
      tldr: "Bewusste Auswahl maximal verschiedener Fälle, damit Variation und Mechanismus sichtbar werden, nicht erst Mittelwerte.",
      long: "Fallkontrast ist eine SAMPLING-Strategie: vor der Datenerhebung werden Fälle entlang einer relevanten Dimension gezielt verschieden gewählt (z.B. junge vs. alte Pendler, tägliche vs. seltene Bahnreisende, urban vs. ländlich). Ziel: Variation in den Daten sichtbar machen, statt sie über Zufall zu hoffen. Abgrenzung zu Negativen Fällen: Fallkontrast plant Variation VOR der Studie ein, Negative Fälle prüfen eine ENTSTANDENE Hypothese durch gezielt widersprechende Fälle. Beide gehören zum qualitativen Gütekanon, aber an verschiedenen Stellen im Forschungsprozess.",
      example: "12 Pendler-Interviews mit bewusstem Kontrast: 4 Hamburg-Berlin (1 h Fernverkehr), 4 Lübeck-Hamburg (45 min Regional), 4 Lübeck-Travemünde (15 min S-Bahn) → Anschlusslogik unterscheidet sich systematisch.",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><text x='204' y='14' font-family='DM Mono, monospace' font-size='10' font-weight='700' fill='#0f172a' text-anchor='middle'>Sampling entlang einer Kontrast-Dimension</text><line x1='30' y1='50' x2='378' y2='50' stroke='#cbd5e1' stroke-width='1'/><text x='30' y='66' font-family='DM Mono, monospace' font-size='9' fill='#0f172a' text-anchor='start'>kurz</text><text x='378' y='66' font-family='DM Mono, monospace' font-size='9' fill='#0f172a' text-anchor='end'>lang</text><circle cx='70' cy='50' r='6' fill='#0f172a'/><circle cx='82' cy='50' r='6' fill='#0f172a'/><circle cx='94' cy='50' r='6' fill='#0f172a'/><circle cx='106' cy='50' r='6' fill='#0f172a'/><circle cx='198' cy='50' r='6' fill='#D9272E'/><circle cx='210' cy='50' r='6' fill='#D9272E'/><circle cx='222' cy='50' r='6' fill='#D9272E'/><circle cx='234' cy='50' r='6' fill='#D9272E'/><circle cx='326' cy='50' r='6' fill='#0f172a'/><circle cx='338' cy='50' r='6' fill='#0f172a'/><circle cx='350' cy='50' r='6' fill='#0f172a'/><circle cx='362' cy='50' r='6' fill='#0f172a'/><text x='88' y='82' font-family='DM Mono, monospace' font-size='9' fill='#0f172a' text-anchor='middle'>S-Bahn · 15 min</text><text x='216' y='82' font-family='DM Mono, monospace' font-size='9' fill='#D9272E' text-anchor='middle'>Regional · 45 min</text><text x='344' y='82' font-family='DM Mono, monospace' font-size='9' fill='#0f172a' text-anchor='middle'>Fernverkehr · 1 h+</text></svg>",
      pitfall: "Falle: Fallkontrast ist nicht Convenience-Sampling mit nachträglicher Begründung. Die Kontrast-Dimension muss VORHER theoretisch begründet sein."
    },
    memberCheck: {
      cat: "Qualitative Validität", name: "Member Check", mini: "reflexivity",
      tldr: "Beteiligte geben Rückmeldung, ob eine Interpretation plausibel oder verzerrt wirkt.",
      long: "Member Checks holen die Interpretation zurück ins Feld. Sie stärken Glaubwürdigkeit (credibility), sind aber kein Letztkriterium, Beteiligte können auch Selbstbilder verteidigen.",
      example: "Codeschemata und Kategorien werden 3 Interview-Teilnehmenden zur Lektüre und Kommentierung gegeben.",
      pitfall: "Falle: Zustimmung der Befragten ist hilfreich, aber nicht der alleinige Wahrheitsstandard."
    },
    representativeness: {
      cat: "Stichprobe", name: "Repräsentativität", mini: "selection",
      tldr: "Entsteht durch passende Grundgesamtheit, Auswahlverfahren und erreichte Stichprobe.",
      long: "Repräsentativität ist eine Beziehungsaussage zwischen Stichprobe und Grundgesamtheit, keine Eigenschaft der Fallzahl. Sie ist immer relativ zu einem bestimmten Merkmal.",
      example: "Reisendenstichprobe ist repräsentativ für Pendler-Routen Werktag 6–9 Uhr, nicht für ICE-Wochenendreisende.",
      pitfall: "Falle: Repräsentativität ist keine Eigenschaft der Fallzahl allein."
    },
    bias: {
      cat: "Stichprobe", name: "Bias", mini: "selection",
      tldr: "Systematische Verzerrung, die Ergebnisse in eine Richtung verschiebt.",
      long: "Bias ist Systematik, nicht Zufall, und wird mit größeren Stichproben nur präziser sichtbar, nicht kleiner. Typische Quellen: Selection, Response, Measurement.",
      example: "Online-Befragung in der DB Navigator App: schließt systematisch Reisende ohne Smartphone aus → Coverage Bias.",
      pitfall: "Falle: Mehr Daten machen Bias oft nur präziser sichtbar."
    },
    randomAssignment: {
      cat: "Experiment", name: "Randomisierte Zuordnung", mini: "randomization",
      tldr: "Zufall verteilt bekannte und unbekannte Störfaktoren auf Treatment und Kontrolle.",
      long: "Randomisierung ist der einzige Mechanismus, der unbekannte Confounder durchschnittlich ausgleicht. Sie wirkt nur, wenn Durchführung sauber bleibt, Compliance, Spillover und Drop-out müssen mit­dokumentiert werden.",
      example: "Umstiegsanzeige Variante A vs. B: 9.200 Sessions zufällig 50/50 zugeordnet via Session-Hash.",
      formal: "P(Treatment | X) = const für alle X.",
      pitfall: "Falle: Randomisierung wirkt nur, wenn Durchführung und Messung sauber bleiben."
    },
    controlGroup: {
      cat: "Experiment", name: "Kontrollgruppe", mini: "treatment-control",
      tldr: "Bildet die Gegenwelt: Was wäre ohne Intervention passiert?",
      long: "Die Kontrollgruppe macht den kontrafaktischen Vergleich operationalisierbar. Ohne sie bleibt Wirkung nur Plausibilität.",
      example: "Kontrolle bekommt Status-quo-Anzeige, Treatment bekommt neue Anzeige mit Anschlusssicherheit.",
      pitfall: "Falle: Ohne Gegenwelt bleibt Wirkung schnell nur plausibel."
    },
    internalValidity: {
      cat: "Experiment", name: "Interne Validität", mini: "validity",
      tldr: "Wurde der Effekt wirklich durch die Intervention verursacht?",
      long: "Interne Validität wird durch Confounding, Selection, History, Maturation, Testing und Instrumentation bedroht. Randomisierung und Kontrollgruppe sind die stärksten Schutzmechanismen.",
      example: "Wenn das Treatment zeitlich mit einer Tarifänderung zusammenfällt → History-Bedrohung.",
      pitfall: "Falle: Confounding, History und Selektion können kausale Aussagen schwächen."
    },
    externalValidity: {
      cat: "Experiment", name: "Externe Validität", mini: "field",
      tldr: "Lässt sich der Effekt auf andere Orte, Gruppen oder Zeiten übertragen?",
      long: "Externe Validität ist die Übertragungsfrage. Sie ist nie automatisch hoch, ein Lab-Effekt bei Studierenden gilt nicht garantiert für Pendler auf der Ostsee-Strecke.",
      example: "Effekt aus Pilot in Hamburg → Re-Test in München vor Roll-out bundesweit.",
      pitfall: "Falle: Ein sauberer Test ist nicht automatisch überall gültig."
    },
    statisticalValidity: {
      cat: "Experiment", name: "Statistische Validität", mini: "power",
      tldr: "Power, Effektgröße und Konfidenzintervall zeigen, ob der Test statistisch tragfähig ist.",
      long: "Statistische Validität fragt: War der Test überhaupt sensitiv genug, um den Effekt zu finden? Power ≥ 0,80 gilt als Konvention.",
      example: "Power-Analyse vor Studie: n = 9.200/9.200 → 80% Power für RD = 2 pp bei α = .05.",
      formal: "Power = 1 − β = P(reject H₀ | H₁ wahr).",
      pitfall: "Falle: Präzision ersetzt keine kausale Designlogik."
    },
    quote: {
      cat: "Qualitativ", name: "Ankerzitat", mini: "quote",
      tldr: "Ein Originalzitat ist die Brücke zwischen abstrakter Kategorie und dem Material, Leser:innen können nachprüfen, woran man die Deutung wirklich festgemacht hat.",
      long: "Ankerzitate verankern jede Kategorie im Material. Sie sagen Leser:innen: „so klingt diese Kategorie in der Realität, nicht meine Interpretation, sondern der O-Ton.“ Methodische Regel: pro Kategorie 1–2 prägnante Anker im Methodenkapitel oder Anhang. Mehr macht den Text illustrierend statt analytisch („Geschichten erzählen“); weniger lässt die Kategorie hängen in der Luft.",
      example: "Kategorie „Kontrollverlust“: „Ich wusste nicht, ob ich es noch schaffe, und keiner hat mir gesagt, was passiert, wenn nicht.“ (I07, Pendlerin, 42 J., Strecke Hamburg–Lübeck)",
      pitfall: "Falle: Ein gutes Zitat ersetzt keine systematische Codierung. Cherry-picking ist die häufigste Schwäche qualitativer Berichte."
    },
    objective: {
      cat: "Messung", name: "Objektivität", mini: "objective",
      tldr: "Würde eine andere Person mit denselben Daten zum selben Ergebnis kommen? Wenn nein, hängt die Aussage am Forschenden, nicht am Phänomen.",
      long: "Objektivität ist die erste Hürde der Forschungsqualität: Durchführung, Auswertung und Interpretation sollen UNABHÄNGIG von der Person sein, die misst. Sie wird durch standardisierte Manuals (Durchführungsobjektivität), blinde Auswertung (Auswertungsobjektivität) und mehrfache Codierung (Interpretationsobjektivität) gesichert. Erst auf Objektivität baut Reliabilität, und erst auf Reliabilität baut Validität.",
      example: "8 Interviewer:innen, alle nach identischem Tablet-Skript, ohne Kenntnis der Hypothese, selbe Fragenreihenfolge, selbe Antwortskala, selbe Codierregel.",
      pitfall: "Falle: Objektiv erhoben heißt noch nicht valide gemessen. Alle gleich, aber gleich am Ziel vorbei, bleibt ein Fehler."
    },
    reliability: {
      cat: "Messung", name: "Reliabilität", mini: "reliability",
      tldr: "Misst die Skala bei wiederholter Anwendung dasselbe? Ohne Reliabilität ist jeder Effekt nur Zufallsrauschen.",
      long: "Reliabilität fragt: ist die Messung stabil und konsistent, über Zeit, über Codierer:innen, über Items hinweg? Drei Spielarten beantworten unterschiedliche Versionen dieser Frage: Test-Retest (dieselbe Person, zweimal gemessen → gleiches Ergebnis?), Inter-Rater (κ, α, zwei Coder:innen, derselbe Text → gleiche Kategorie?), interne Konsistenz (Cronbach α, mehrere Items, dasselbe Konstrukt → ähnliches Antwortmuster?). Reliabilität ist Voraussetzung für Validität, aber nicht ausreichend.",
      example: "Skala „Anschlussvertrauen“ wird in t₀ und t₀+2 Wochen ohne Treatment erhoben → r = .82 → die Skala ist über die Zeit stabil.",
      formal: "Reliabilität = wahre Varianz / (wahre Varianz + Fehlervarianz).",
      pitfall: "Falle: Stabil falsch gemessen bleibt falsch, Reliabilität allein macht keine valide Studie."
    },
    validity: {
      cat: "Messung", name: "Validität", mini: "validity",
      tldr: "Misst die Skala wirklich das Konstrukt, über das wir sprechen? Die teuerste Fehlerquelle entsteht, wenn die Antwort „nein“ ist.",
      long: "Validität ist die wichtigste Qualitätsfrage in der Marktforschung, und gleichzeitig die unbequemste, weil sie nicht durch eine einzige Kennzahl zu beantworten ist. Sie zerfällt in drei Fragen, die nacheinander geprüft werden: Inhaltsvalidität (decken die Items den Bedeutungsraum des Konstrukts ab?), Konstruktvalidität (verhält sich die Skala theoriekonform zu verwandten Konstrukten?), Kriteriumsvalidität (sagt sie ein relevantes Außenkriterium voraus?). Ohne Validität trifft man Entscheidungen auf der Grundlage der falschen Größe, das ist teurer als gar nicht zu messen.",
      example: "Eine „Servicequalität“-Skala, die in Wirklichkeit Preiszufriedenheit erfasst (weil alle Items über Geld reden): hochreliabel (α=.89), aber niedrigvalide. Wer sie nutzt, optimiert den falschen Hebel.",
      pitfall: "Falle: Validität ist kein Nebenprodukt hoher Reliabilität. Eine α=.95-Skala kann hochgradig invalide sein."
    },
    selection: {
      cat: "Stichprobe", name: "Auswahlverfahren", mini: "selection",
      tldr: "Entscheidet, welche Fälle überhaupt in die Analyse gelangen.",
      long: "Das Auswahlverfahren prägt die Verallgemeinerbarkeit: Zufalls-, Quoten-, theoretisches, Snowball- und Convenience-Sampling haben jeweils andere Reichweiten.",
      example: "Geschichtete Zufallsauswahl auf Streckenebene + Quoten auf Tageszeit innerhalb jeder Strecke.",
      pitfall: "Falle: Unpassende Auswahl begrenzt jede Verallgemeinerung."
    },
    nonresponse: {
      cat: "Stichprobe", name: "Nonresponse", mini: "nonresponse",
      tldr: "Wer nicht antwortet, kann die ganze Studie verzerren, wenn Antwortende und Nichtantwortende systematisch verschieden sind.",
      long: "Nonresponse ist kein Quoten-, sondern ein Strukturproblem: eine 60 %-Response-Rate kann harmlos sein, wenn die fehlenden 40 % zufällig fehlen; eine 80 %-Response-Rate kann schädlich sein, wenn die fehlenden 20 % einer bestimmten Gruppe entstammen. Vor der Auswertung muss man fragen: wer fehlt, und ist diese Gruppe in der relevanten Dimension anders als die Antwortenden? Wenn ja, dann sind die Ergebnisse systematisch verzerrt. Gegenmaßnahmen: Reminders, Anreize, Nachgewichten nach soziodemografischen Quoten.",
      example: "Online-Befragung in der DB Navigator-App: 78 % Response, aber Nichtantwortende sind überwiegend Geschäftsreisende (kein Bedarf an App) → Sample driftet Richtung Pendler → Pendler-Sicht überrepräsentiert.",
      pitfall: "Falle: Eine schöne Response Rate verschleiert die Richtung der Verzerrung. Wer fehlt, ist die wichtigere Frage."
    },
    theoretical: {
      cat: "Qualitativ", name: "Theoretical Sampling", mini: "theoretical",
      tldr: "Fallauswahl im Qual ist nicht zufällig und nicht praktisch, sie ist iterativ gesteuert durch das, was die bisherige Analyse offen lässt.",
      long: "Theoretisches Sampling (Glaser/Strauss) ist das Gegenstück zur Zufallsstichprobe im Quant: jeder neue Fall wird nach seinem ERKENNTNISWERT ausgewählt, nicht nach Verfügbarkeit. Nach den ersten 6 Interviews steht eine vorläufige Theorie, die nächsten Fälle werden gezielt rekrutiert, um diese Theorie zu prüfen, zu erweitern oder zu falsifizieren. Das macht qualitative Forschung iterativ statt linear, und ist der Grund, warum man Fallzahlen vorab nicht festlegen kann.",
      example: "Nach 6 Pendler:innen-Interviews die Kategorie „Anschlussangst“ stabilisiert → gezielt 3 ICE-Wochenend-Reisende rekrutieren, um die Kategorie gegen Kontrastfälle zu prüfen.",
      pitfall: "Falle: Convenience Sampling („wer gerade Zeit hatte“) nicht nachträglich als Theoretical Sampling verkaufen."
    },
    reflexivity: {
      cat: "Qualitativ", name: "Reflexivität", mini: "reflexivity",
      tldr: "Forschende sind nicht unsichtbar, sie prägen, was beobachtbar wird. Reflexivität macht diese Prägung sichtbar und prüfbar.",
      long: "Qualitative Forschung kann sich nicht auf „neutrale Messinstrumente“ berufen, der Mensch IST das Instrument. Was Forschende sehen, fragen, deuten, wird von ihrer Position (Erfahrung, Sprache, Vorannahmen, Geschlecht, Status) mitgeprägt. Reflexivität ist die methodische Antwort darauf: in Reflexivitäts-Memos wird dokumentiert, wie die eigene Position auf Feldzugang, Interview-Dynamik und Deutung wirkt. Das ist kein Bauchgefühl-Schreiben, sondern Teil des Audit Trails.",
      example: "Reflexivitäts-Memo: „Als regelmäßige Bahnpendlerin teile ich die Frustration der Interviewten, ich muss gegensteuern, indem ich explizit nach entspannten Umstiegs-Erfahrungen frage und Gegenbeispiele suche.“",
      pitfall: "Falle: Reflexivität ≠ Selbstdarstellung. Es geht um Analysequalität, nicht um persönliche Geschichten."
    },
    curator: {
      cat: "AI Research", name: "Creator-to-curator", mini: "curator",
      tldr: "Wenn Produktion delegierbarer wird, liegt Wert stärker im Bewerten, Prüfen und Kuratieren.",
      long: "Die Forschungsrolle verschiebt sich vom Schreiben einzelner Sätze hin zur Auswahl der richtigen Fragen, Quellen, Modelle und Prüfschritte. Produktivität erster Ordnung unterschätzt diesen Wandel.",
      example: "Vorher: Forscherin schreibt 80% des Literatur-Reviews. Nachher: Forscherin entwirft die Search-Strategie, prüft 100% der Codings, akzeptiert/verwirft Synthesen.",
      pitfall: "Falle: Produktivität erster Ordnung unterschätzt den Rollenwandel."
    },
    institutional: {
      cat: "AI Research", name: "Institutional knowledge", mini: "institutional",
      tldr: "Differenzierung entsteht durch eigene Standards, Daten, Workflows und Urteilskraft.",
      long: "Wenn alle Zugang zu denselben Modellen haben, bleibt das Institutionelle das unique: kuratierte Datenbanken, etablierte Verfahren, geteilte Beurteilungsstandards.",
      example: "TH Lübeck × MPCM gemeinsame Audit-Datenbank für IR-readiness pro DAX-Unternehmen.",
      pitfall: "Falle: Modellzugang allein ist kein nachhaltiger Vorteil."
    },
    estimate: {
      cat: "Method Signature", name: "Estimate", mini: "posterior",
      tldr: "Schwache, sparse oder verrauschte Signale werden in belastbare Schätzungen für Entscheidungen übersetzt.",
      long: "Estimate steht für die Dissertation: hierarchische Bayes-Modelle für Conversion Rates auf Long-Tail-Keywords. Aus dünner Evidenz pro Bid Cell entsteht eine Posterior-Verteilung mit ehrlicher Unsicherheit.",
      example: "Pro Bid Cell: Beta-Binomial-Posterior + Prior aus vergleichbaren Cells → Entscheidung „Boost / Hold / Pause“.",
      pitfall: "Falle: Schätzung ist nur so gut wie Datenlogik, Modellannahmen und Validierung."
    },
    forecast: {
      cat: "Method Signature", name: "Forecast", mini: "convergence",
      tldr: "Zukunftsaussagen werden als strukturierte Unsicherheit sichtbar gemacht, nicht als Einzelprognose verkauft.",
      long: "Forecast steht für das Multi-LLM-Delphi: heterogene Modelle bilden ein Panel, das in zwei Runden zu strukturierten Forecasts kommt. Konvergenz, Divergenz und Konfidenz werden explizit.",
      example: "7 Foundation-Modelle, 2 Runden, 36 IR-Items × 8 Branchen = 288 Forecast-Zellen mit Median + IQR.",
      pitfall: "Falle: Forecasts brauchen Dissens, Szenarien und Plausibilitätsprüfung."
    },
    measure: {
      cat: "Method Signature", name: "Measure", mini: "validity",
      tldr: "Neue Konstrukte werden so operationalisiert, dass sie beobachtbar, prüfbar und entscheidungsfähig werden.",
      long: "Measure steht für AI-readiness als Score: 3-Dimensionen-Audit (Discoverability, Accessibility, Quality), nachvollziehbar, vergleichbar, reproduzierbar.",
      example: "12 DAX-IR-Sites, Score-Vektor pro Site, öffentliches Audit-Protokoll mit Rerun-Anleitung.",
      pitfall: "Falle: Messbarkeit ersetzt keine Konstruktklarheit."
    },
    promptInstrument: {
      cat: "Multi-LLM Delphi", name: "Structured prompt instrument", mini: "prompt-instrument",
      tldr: "Fixes Instrument macht Modellantworten vergleichbar und auswertbar.",
      long: "Das Prompt-Instrument ist das Pendant zum Fragebogen: feste Items, feste Skala, fester Kontext. Variation kommt durch das Modell, nicht durch die Frage.",
      example: "Pro IR-Item identischer Prompt mit Definition, Skala (0–10) und Begründungsaufforderung; 7 Modelle, 2 Runden.",
      pitfall: "Falle: Ohne gleiche Aufgabenstellung entsteht keine belastbare Vergleichslogik."
    },
    prior: {
      cat: "Bayes", name: "Prior", mini: "hbayes",
      tldr: "Vorwissen vor den neuen Daten, hier als Beta-Verteilung aus Pseudozählungen.",
      long: "Der Prior fasst zusammen, was wir vor den Daten plausibel halten. In Conversion-Modellen ist Beta(α, β) konjugiert zur Binomialverteilung, die Posterior bleibt analytisch in der Beta-Familie.",
      example: "Aus vergleichbaren Bahnhof-Cells: α = 9 (Pseudo-Conversions), β = 75 (Pseudo-Abbrüche) → Prior-Mittel 10,7%.",
      formal: "θ ~ Beta(α, β); E[θ] = α/(α+β).",
      pitfall: "Falle: Ein Prior muss fachlich plausibel und transparent sein."
    },
    likelihood: {
      cat: "Bayes", name: "Likelihood", mini: "sampling-error",
      tldr: "Wie wahrscheinlich sind die beobachteten Daten für verschiedene Werte von θ?",
      long: "Die Likelihood ist eine Funktion von θ bei festen Daten, keine Wahrscheinlichkeit für θ. Bei Conversions ist sie binomialverteilt.",
      example: "y = 4 Buchungen aus n = 120 Sessions → L(θ) ∝ θ⁴ · (1−θ)^116.",
      formal: "L(θ | y,n) = C(n,y) · θ^y · (1−θ)^(n−y).",
      pitfall: "Falle: Sie ist keine Wahrscheinlichkeit der Hypothese."
    },
    posteriorBayes: {
      cat: "Bayes", name: "Posterior", mini: "posterior",
      tldr: "Kombiniert Prior und Daten zu einer aktualisierten Unsicherheitsverteilung.",
      long: "Der Posterior ist die ganze Antwort der Bayesianischen Analyse, nicht nur ein Punktschätzer, sondern eine Verteilung. Median, Mittelwert und Glaubwürdigkeitsintervall lassen sich daraus ableiten.",
      example: "Prior Beta(9, 75) + y = 4, n = 120 → Posterior Beta(13, 191); Mittelwert ≈ 6,4%, Median ≈ 6,2%, 95%-CrI [3,7%; 9,7%].",
      formal: "θ | y,n ~ Beta(α+y, β+n−y).",
      pitfall: "Falle: Nicht nur der Mittelwert zählt, sondern die Unsicherheit."
    },
    theta: {
      cat: "Bayes", name: "θ", mini: "posterior",
      tldr: "Die unbekannte wahre Wahrscheinlichkeit, etwa Buchung fortgesetzt nach Umstiegsanzeige.",
      long: "θ ist das Ziel der Inferenz: die latente, nicht direkt beobachtbare Rate. Die beobachtete Quote ist nur ein verrauschter Hinweis auf θ.",
      example: "θ = P(Buchung abgeschlossen | Umstiegsanzeige gesehen). Beobachtet y/n; gesucht: Verteilung von θ.",
      formal: "θ ∈ [0, 1]; P(θ | y,n) ∝ P(y,n | θ) · P(θ).",
      pitfall: "Falle: Die beobachtete Rate ist nur ein unsicherer Hinweis auf θ."
    },
    pseudoCounts: {
      cat: "Bayes", name: "Pseudozählungen", mini: "sample",
      tldr: "α und β wirken wie vorgängige Conversions und Abbrüche aus vergleichbaren Fällen.",
      long: "Pseudozählungen machen den Prior interpretierbar: α steht für „so viele Erfolge habe ich vor den Daten schon gesehen“. Sie dürfen nicht stärker gewichtet werden, als das Vorwissen es trägt.",
      example: "Aus 5 vergleichbaren Bahnhöfen Median-CVR 10,7% bei mittlerer Stichprobengröße n=82 → α = 9, β = 75.",
      formal: "Prior Beta(α, β) entspricht (α + β − 2) virtuellen Beobachtungen.",
      pitfall: "Falle: Pseudozählungen dürfen nicht stärker gewichtet werden als sie begründbar sind."
    },
    credibleInterval: {
      cat: "Bayes", name: "Glaubwürdigkeitsintervall", mini: "ci",
      tldr: "Direkt interpretierbarer plausibler Bereich der Posterior-Verteilung.",
      long: "Im Gegensatz zum Konfidenzintervall ist das 95%-CrI direkt als „θ liegt mit 95% Wahrscheinlichkeit in diesem Bereich“ lesbar. Voraussetzung: man akzeptiert den Bayesianischen Rahmen.",
      example: "Posterior Beta(13, 191): 95%-CrI [3,7%; 9,7%]; Highest Density Interval.",
      formal: "CrI_{1−α} = {θ : ∫ P(θ|y) dθ = 1−α}.",
      pitfall: "Falle: Es ist nicht dasselbe wie ein frequentistisches Konfidenzintervall."
    },
    curriculumFit: {
      cat: "Transfer", name: "Curricular fit", mini: "joint-display",
      tldr: "Forschungsagenda wird in bestehende Module und Projektformate übersetzt.",
      long: "Curricular fit heißt: Forschungsthemen werden Teil bestehender Module, nicht Zusatzkurse. Studierendenprojekte werden zu Decision Artifacts mit echtem Empfänger.",
      example: "BWL-Bachelor Sem 5: „Service Research Project“ als 8-wöchiges Mixed-Methods-Vorhaben mit DB Regio als Praxispartner.",
      pitfall: "Falle: Fit überzeugt nur, wenn konkrete Lehr- und Projektformate sichtbar werden."
    },
    healthcareCapacity: {
      cat: "Transfer", name: "Healthcare capacity planning", mini: "fit",
      tldr: "Kapazität, Termine, Personal und Räume als Service-System mit knappen Ressourcen modellieren.",
      long: "Healthcare-Kapazitätsplanung ist kein reines IT-Thema, sondern Service-System-Design unter Knappheit. Wartelisten, Mehrfachbuchungen, Drop-outs und Eskalationspfade sind Service-Probleme mit Marketing-Methodenanschluss.",
      example: "Amsterdam UMC × PersonalAIze: Termin- und Raumallokation für Onkologie als hybrides Modell.",
      pitfall: "Falle: Das ist kein reines IT-Thema, sondern Prozess- und Verantwortungsdesign."
    },

    /* ---- Service marketing fundamentals (Folie 04) ---- */
    expectationGap: {
      cat: "Dienstleistung", name: "Erwartung vs. Erlebnis", mini: "validity",
      tldr: "Service-Qualität ist kein absoluter Wert, sondern eine Differenz, und genau deshalb muss Forschung beide Seiten getrennt messen.",
      long: "Reisende beurteilen nicht „wie gut war die Bahnfahrt“, sondern „wie weit ist sie hinter meiner Erwartung zurückgeblieben, oder übertroffen?“. Die Zufriedenheit entsteht aus dem Vergleich, nicht aus der absoluten Leistung. Folge: Wer mit hoher Erwartung kommt, ist von purer Erfüllung weniger beeindruckt als wer mit geringer Erwartung positiv überrascht wird (Disconfirmation-Paradigma: P < E → Unzufriedenheit, P > E → Begeisterung). Wer nur das Erlebnis misst, übersieht diese Erwartungsbasis. Methodisch: Erwartung vor Kontakt erfassen, Erlebnis nach Kontakt, Differenz auswerten (klassischer SERVQUAL-Ansatz).",
      example: "Pünktliche Ankunft bei mittelmäßiger Erwartung → Bottom-2 = 18 %. Pünktliche Ankunft bei hoher Erwartung → Bottom-2 = 42 %. Gleiches Erlebnis, anderer Vergleichsmaßstab.",
      pitfall: "Falle: Wer nur das Erlebnis misst, optimiert Service ins Leere, die Erwartung wandert sonst unkontrolliert mit."
    },
    contactMoment: {
      cat: "Dienstleistung", name: "Kontaktmoment (Uno-actu)", mini: "field",
      tldr: "Service entsteht und vergeht im selben Moment, wer ihn messen will, muss am Kontaktpunkt sein, nicht zwei Tage später.",
      long: "Das Uno-actu-Prinzip unterscheidet Service von Produkt: ein Auto kann ich auspacken, prüfen, zurückgeben. Eine Zugfahrt existiert nur, während sie passiert. Diese Gleichzeitigkeit von Produktion und Nutzung hat eine Konsequenz für die Methodenwahl: wenn ich erst nachträglich befrage, bekomme ich Erinnerung statt Erleben, gefärbt durch Endeindruck, Stimmung und nachgelagerte Ereignisse. Methoden wie In-Moment-Tracking, Tagebuchstudien oder Go-along sind deshalb für Service oft präziser als die klassische Nachher-Befragung.",
      example: "Beim Umstieg im Hamburger Hbf entsteht „Bahn-Service“ in 8 Minuten zwischen Aussteigen und Einsteigen, gemessen am Bahnsteig per Geofence-Survey, nicht eine Woche später per E-Mail.",
      pitfall: "Falle: Wer 7 Tage später fragt, misst Erinnerung, verzerrt durch Verklärung, Vergessen, Endeindruck."
    },
    contactVariance: {
      cat: "Dienstleistung", name: "Kontaktvarianz", mini: "scatter",
      tldr: "Servicequalität ist nicht konstant, sie hängt von Tag, Uhrzeit, Personal, Auslastung ab. Mittelwerte verbergen das Wichtigste.",
      long: "Anders als ein industriell gefertigtes Produkt schwankt eine Service-Erfahrung von Kontakt zu Kontakt: Wochentag, Tageszeit, Wetter, Personal, Mitreisende, eigene Verfassung, all das macht aus „der ICE 678“ jedes Mal ein anderes Produkt. Forschungsdesign muss diese Heterogenität als Befund behandeln, nicht als Störung. Touchpoints, Situationen und Segmente werden getrennt ausgewertet; ein Gesamt-Mittelwert ist meistens irreführend, weil er die kritischen Spitzen (Freitag 18 Uhr Hauptbahnhof) wegglättet.",
      example: "Anschlussinfo Bottom-2: Mo 7 h = 44 %, Sa 22 h = 18 %, Fr 7 h = 50 %. Mittelwert 36 % verschleiert die akute Pendler:innen-Krise.",
      pitfall: "Falle: Ein Gesamt-Mittelwert wirkt sachlich, ist aber gerade deshalb irreführend, weil er die kritischen Spitzen wegglättet. Immer nach Situation aufschlüsseln."
    },

    /* ---- Quantitative Güte erweitert (Folie 12) ---- */
    samplingError: {
      cat: "Inferenz", name: "Stichprobenfehler", mini: "sampling-error",
      tldr: "Die unbekannte Abweichung zwischen Stichproben-Schätzer und wahrem Populationswert in dieser einen konkreten Stichprobe.",
      long: "Stichprobenfehler ist das Phänomen, eine Kennzahl aus n Befragten landet fast nie exakt auf dem wahren Wert. In der konkreten Stichprobe bleibt der Fehler unbeobachtbar; wir wissen nur, dass er existiert. Abgrenzung: Der Standardfehler quantifiziert die erwartete Größe dieser Abweichung über alle hypothetisch möglichen Stichproben derselben Größe, also: Stichprobenfehler = Phänomen, Standardfehler = Messlatte.",
      example: "Wir messen Bottom-2 = 42% bei n = 2.500. Der wahre Anteil in der Grundgesamtheit liegt in der Nähe; ob er 41,5% oder 43,2% ist, bleibt unbekannt, wir kennen nur die typische Größenordnung der Abweichung.",
      formal: "ε = θ̂ − θ (Schätzer minus wahrer Wert) · in einer einzelnen Stichprobe unbeobachtbar.",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='60' x2='388' y2='60' stroke='#cbd5e1' stroke-width='1'/><line x1='280' y1='44' x2='280' y2='72' stroke='#0f172a' stroke-width='2'/><text x='280' y='84' font-family='DM Mono, monospace' font-size='10' fill='#0f172a' text-anchor='middle'>θ wahr</text><circle cx='138' cy='60' r='7' fill='#D9272E'/><text x='138' y='84' font-family='DM Mono, monospace' font-size='10' fill='#D9272E' text-anchor='middle'>θ̂ Stichprobe</text><line x1='148' y1='44' x2='268' y2='44' stroke='#D9272E' stroke-width='1.5' stroke-dasharray='4 3'/><polygon points='272,44 264,40 264,48' fill='#D9272E'/><text x='208' y='36' font-family='DM Mono, monospace' font-size='12' font-weight='700' fill='#D9272E' text-anchor='middle'>ε = ?</text></svg>",
      pitfall: "Falle: Mehr Daten schrumpfen nur den Zufallsanteil, systematische Verzerrung (Bias) bleibt."
    },
    selectionBias: {
      cat: "Stichprobe", name: "Selektionsbias", mini: "selection",
      tldr: "Wenn die Auswahl bestimmte Gruppen systematisch über- oder ausschließt, ist jede Verallgemeinerung schief, ganz egal wie sauber die Rechnung danach aussieht.",
      long: "Selektionsbias entsteht nicht im Datenerfassen, sondern davor, beim Auswahlverfahren. Wer die App-Befragung nur im DB Navigator macht, hat schon entschieden: Reisende ohne Smartphone fallen raus. Wer Studierende auf dem Campus interviewt, schließt Berufstätige aus. Der Bias lässt sich nicht im Nachhinein „rausrechnen“, man kann nur die Reichweite des Ergebnisses ehrlich auf die erreichte Gruppe einschränken. Gegenmaßnahme: Auswahlverfahren so wählen, dass die Zielpopulation überhaupt eine Chance hat, drin zu landen.",
      example: "Online-Befragung in der DB Navigator-App, n = 50.000 → ausschließlich technikaffine Pendler:innen → Aussagen über „alle Reisenden“ sind unzulässig, über App-Nutzer:innen ehrlich.",
      pitfall: "Falle: Mehr Daten verstärken den Bias nur präziser. Statistische Software warnt nicht davor, man muss es vorher erkennen."
    },
    standardError: {
      cat: "Inferenz", name: "Standardfehler", mini: "ci",
      tldr: "Die rechenbare Messlatte für Stichprobenfehler: Standardabweichung der Schätzung über hypothetisch viele Stichproben gleicher Größe.",
      long: "Der Standardfehler (SE) quantifiziert, wie stark der Schätzer von Stichprobe zu Stichprobe schwanken würde, also die typische Größe des Stichprobenfehlers. Aus ihm wird das Konfidenzintervall (KI = θ̂ ± z · SE). Abgrenzung: Stichprobenfehler ist die konkrete, unbekannte Abweichung in einer einzelnen Stichprobe; Standardfehler ist die berechenbare erwartete Größe dieser Abweichung über alle möglichen Stichproben. Phänomen vs. Messlatte.",
      example: "Bottom-2 = 42% bei n = 2.500 → SE = √(0,42·0,58/2.500) ≈ 0,99 pp → 95%-KI ≈ 42% ± 1,96·0,99 ≈ [40; 44].",
      formal: "SE(p̂) = √(p̂(1−p̂)/n); SE(M̄) = SD/√n.",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><line x1='20' y1='66' x2='388' y2='66' stroke='#cbd5e1' stroke-width='1'/><line x1='204' y1='14' x2='204' y2='78' stroke='#0f172a' stroke-width='2'/><text x='204' y='86' font-family='DM Mono, monospace' font-size='10' fill='#0f172a' text-anchor='middle'>θ wahr</text><circle cx='130' cy='66' r='4' fill='#D9272E' opacity='0.55'/><circle cx='150' cy='66' r='4' fill='#D9272E' opacity='0.65'/><circle cx='168' cy='66' r='4' fill='#D9272E' opacity='0.7'/><circle cx='182' cy='66' r='4' fill='#D9272E' opacity='0.8'/><circle cx='192' cy='66' r='4' fill='#D9272E' opacity='0.85'/><circle cx='200' cy='66' r='4' fill='#D9272E' opacity='0.9'/><circle cx='208' cy='66' r='4' fill='#D9272E' opacity='0.9'/><circle cx='216' cy='66' r='4' fill='#D9272E' opacity='0.85'/><circle cx='226' cy='66' r='4' fill='#D9272E' opacity='0.8'/><circle cx='240' cy='66' r='4' fill='#D9272E' opacity='0.7'/><circle cx='256' cy='66' r='4' fill='#D9272E' opacity='0.65'/><circle cx='278' cy='66' r='4' fill='#D9272E' opacity='0.55'/><line x1='164' y1='34' x2='244' y2='34' stroke='#0f172a' stroke-width='2'/><line x1='164' y1='28' x2='164' y2='40' stroke='#0f172a' stroke-width='2'/><line x1='244' y1='28' x2='244' y2='40' stroke='#0f172a' stroke-width='2'/><text x='204' y='24' font-family='DM Mono, monospace' font-size='12' font-weight='700' fill='#0f172a' text-anchor='middle'>≈ ±1 SE</text></svg>",
      pitfall: "Falle: Standardfehler ≠ Standardabweichung der Rohwerte. SD beschreibt Heterogenität der Befragten, SE die Unsicherheit der Schätzung."
    },
    power: {
      cat: "Inferenz", name: "Power", mini: "power",
      tldr: "Hat die Studie überhaupt eine Chance, einen echten Effekt zu finden? Zu kleine Studien produzieren ein „nicht signifikant“ ohne Aussagekraft.",
      long: "Power = 1 − β = Wahrscheinlichkeit, H₀ zu verwerfen, wenn H₁ tatsächlich gilt. Eine Studie mit zu wenig Power ist im Voraus zum Scheitern verurteilt: auch ein realer Effekt fällt nicht auf. Konvention: Power ≥ 0,80, d. h. 80 % Chance den Effekt zu finden. Die Power-Analyse läuft VOR der Studie: für welchen Mindesteffekt soll die Studie sensitiv sein, und wie viel n braucht man dafür? Wer die Power-Analyse spart, riskiert, viel Geld in eine Studie zu stecken, die nichts entscheiden kann.",
      example: "Power-Analyse vor Studie: für einen Mindesteffekt von RD = 2 pp bei α = .05 sind ≈ 9.200/9.200 Sessions nötig, um 80 % Power zu erreichen.",
      formal: "Power = P(reject H₀ | H₁ wahr) = 1 − β.",
      pitfall: "Falle: Hohe Power bei unsauberer Messung garantiert nur, dass man ein verzerrtes Ergebnis sicher findet."
    },
    modelFit: {
      cat: "Modell · Oberbegriff", name: "Modellfit", mini: "fit",
      tldr: "Sammelbegriff für mehrere Gütemaße eines Modells: R², RMSE, AIC, Residuen. Frage: passt das Modell zu Daten und Zweck?",
      long: "Modellfit-Maße bewerten, wie nah die Vorhersagen des Modells an den beobachteten Daten liegen. R² als Anteil erklärter Varianz, F-Test als Gesamttest, RMSE/MAE als Vorhersagefehler, AIC/BIC als Modellvergleich (kleinere Werte = besser), Residuendiagnostik als visuelle Prüfung, Cross-Validation für Generalisierbarkeit. Adjustierte Maße bestrafen unnötige Komplexität, wer 30 Prädiktoren ins Modell kippt, treibt R² hoch, ohne wirklich mehr zu erklären. R² ist also EIN Modellfit-Maß, nicht ein paralleles Konzept. Modellfit beantwortet die Frage „passt das Modell zu meinen Daten?“, nicht „ist das Modell kausal korrekt?“.",
      example: "Lineare Regression Zufriedenheit ~ Wartezeit + Tageszeit, n = 240: R² = .68, R²_adj = .66, RMSE = 0,82, F(2, 237) = 252, p < .001 → solider Fit mit zwei Prädiktoren, RMSE in Skalenpunkten interpretierbar.",
      formal: "AIC = 2k − 2 · ln(L); BIC = k · ln(n) − 2 · ln(L); RMSE = √(Σ(y_i − ŷ_i)²/n).",
      figure: "<svg width='408' height='88' viewBox='0 0 408 88' xmlns='http://www.w3.org/2000/svg'><line x1='30' y1='72' x2='388' y2='72' stroke='#cbd5e1' stroke-width='1'/><line x1='30' y1='10' x2='30' y2='72' stroke='#cbd5e1' stroke-width='1'/><line x1='40' y1='62' x2='320' y2='22' stroke='#D9272E' stroke-width='1.5'/><circle cx='55' cy='60' r='3' fill='#0f172a'/><circle cx='90' cy='52' r='3' fill='#0f172a'/><circle cx='130' cy='48' r='3' fill='#0f172a'/><circle cx='170' cy='42' r='3' fill='#0f172a'/><circle cx='210' cy='36' r='3' fill='#0f172a'/><circle cx='250' cy='30' r='3' fill='#0f172a'/><circle cx='290' cy='26' r='3' fill='#0f172a'/><rect x='332' y='14' width='68' height='58' fill='#fff' stroke='#cbd5e1' stroke-width='1'/><text x='338' y='26' font-family='DM Mono, monospace' font-size='8' fill='#D9272E'>R²</text><text x='338' y='38' font-family='DM Mono, monospace' font-size='8' fill='#D9272E'>RMSE</text><text x='338' y='50' font-family='DM Mono, monospace' font-size='8' fill='#D9272E'>AIC/BIC</text><text x='338' y='62' font-family='DM Mono, monospace' font-size='8' fill='#D9272E'>Residuen</text></svg>",
      pitfall: "Falle: Hoher Fit ist nicht Kausalität. Ein Modell kann perfekt passen und trotzdem ein Confounder fehlen."
    },

    /* ---- Experiment (Folie 15) ---- */
    fieldExperiment: {
      cat: "Experiment", name: "Feldexperiment", mini: "field",
      tldr: "Randomisierter Test unter realen Bedingungen, höhere externe Validität, mehr unkontrollierte Kontextfaktoren.",
      long: "Im Feldexperiment wird die Intervention im natürlichen Setting durchgeführt. Stärken: externe Validität, Verhaltensauthentizität. Schwächen: Confounder durch Kontext (Wetter, Tarif, Ereignisse).",
      example: "DB Navigator A/B-Test in Live-App: 18.400 Sessions, Treatment vs. Kontrolle randomisiert per Session-Hash über 30 Tage.",
      pitfall: "Falle: Feldnähe ist kein Freibrief für unkontrollierte Kontexte."
    },

    /* ---- Qualitative Güte erweitert (Folie 21) ---- */
    triangulation: {
      cat: "Mixed Methods", name: "Triangulation", mini: "joint-display",
      tldr: "Wenn eine einzige Methode immer eine bestimmte Perspektive hat, dann braucht man drei oder vier Methoden, um dieselbe Frage von verschiedenen Seiten zu beleuchten.",
      long: "Triangulation (Denzin) bringt mehrere Datenquellen, Methoden, Forschende oder Theorien auf dieselbe Frage. Vier Typen: Daten-Triangulation (verschiedene Zeitpunkte/Orte), Methoden-Triangulation (qual + quant), Forschenden-Triangulation (mehrere Codierende), Theorie-Triangulation (verschiedene Linsen). Der Zweck ist nicht Bestätigung („alle vier sagen dasselbe“), sondern strukturierter Vergleich: Konvergenz stärkt das Vertrauen, Divergenz zwingt zur Erklärung.",
      example: "Frage „Wo bricht Vertrauen in den Service?“: Bottom-2-Box (Quant, n=2.500) + 12 Interviews (Qual) + 6 Wochen Bahnsteig-Beobachtung (Etno) + 200 Beschwerdefälle (Doku), vier Methoden, eine Frage.",
      pitfall: "Falle: Triangulation ist nicht „so lange suchen, bis es passt“. Widersprüche müssen ausgehalten und erklärt werden."
    },

    /* ---- Inhaltsanalyse Detail (Folie 24) ---- */
    corpus: {
      cat: "Inhaltsanalyse", name: "Korpus", mini: "text-corpus",
      tldr: "Die Menge des untersuchten Textmaterials, definiert Reichweite und Verallgemeinerbarkeit.",
      long: "Der Korpus ist die Grundgesamtheit der Inhaltsanalyse. Groß heißt nicht repräsentativ: 5.400 Online-Bewertungen sind selbstselektiert, eine Quotenstichprobe aus internen Tickets oft aussagekräftiger.",
      example: "N = 5.400 Online-Bewertungen aus 12 Monaten, Filter: deutschsprachig, Bewertung mit Freitext, ≥ 30 Wörter.",
      pitfall: "Falle: Onlinebewertungen sind häufig selbstselektiert, Korpusgröße ersetzt nicht Repräsentativität."
    },
    codingApproach: {
      cat: "Inhaltsanalyse", name: "Codebildung: deduktiv / induktiv", mini: "deductive-inductive",
      tldr: "Deduktiv: Codes aus Theorie. Induktiv: Codes aus Material. In Praxis fast immer Mischung.",
      long: "Deduktive Codes prüfen Hypothesen; induktive Codes entdecken Frames im Material. In der Praxis kombiniert man beides: Mayrings „Strukturierende Inhaltsanalyse“ als deduktives Rahmenwerk plus „Induktive Kategorienbildung“ für Codes, die erst im Material entstehen.",
      example: "Start mit deduktivem Codebuch aus Service-Recovery-Theorie (8 Kategorien); 3 induktive Codes ergänzt aus offenen O-Tönen.",
      pitfall: "Falle: Induktiv heißt nicht regellos; deduktiv heißt nicht blind."
    },

    /* ---- Mixed Methods Designs (Folie 28) ---- */
    exploratorySequential: {
      cat: "Mixed Methods", name: "Explorativ-sequentiell", mini: "explanatory-seq",
      tldr: "Wenn man noch nicht weiß, was man messen soll, erst qualitativ die richtigen Konstrukte finden, dann quantitativ messen.",
      long: "Im explorativ-sequentiellen Design (QUAL → QUANT) entstehen die Messinstrumente aus dem qualitativen Material: Interviews liefern Codes, daraus werden Items entwickelt, die in der quantitativen Phase auf großer Stichprobe geprüft und kalibriert werden. Stärke: man misst, was die Befragten wirklich meinen, nicht was Forschende theoretisch annehmen. Schwäche: aufwändig und langsam, weil zwei vollständige Studien hintereinander stehen.",
      example: "12 Interviews liefern den Code „Anschlussangst“ mit 5 zugrundeliegenden O-Tönen → daraus 5-Item-Skala entwickelt → in n = 2.500-Personen-Befragung quantifiziert, α = .87.",
      pitfall: "Falle: O-Töne nicht wörtlich als Items übernehmen, sie müssen verallgemeinert und auf Konstruktvalidität geprüft werden."
    },
    convergentParallel: {
      cat: "Mixed Methods", name: "Konvergent-parallel", mini: "joint-display",
      tldr: "Wenn die Zeit eng ist und beide Perspektiven auf dieselbe Frage zielen, qual und quant gleichzeitig laufen lassen, dann im Joint Display zusammenführen.",
      long: "Im konvergenten Design werden QUAL und QUANT unabhängig und parallel erhoben und ausgewertet, erst danach im Joint Display zusammengeführt. Stärke: schnellere Time-to-Insight als bei sequentiellen Designs; beide Stränge gleichberechtigt. Risiko: ohne saubere Vorab-Abstimmung der Forschungsfragen zielen die zwei Stränge auf leicht unterschiedliche Aspekte, und die Integration wird zur Kosmetik.",
      example: "Parallel über 4 Wochen: 12 Interviews + n = 2.500-Survey. Joint Display kombiniert „Anschlussangst“ (qual) mit „Bottom-2 = 42 %“ (quant) → Meta-Inferenz: Mechanismus + Größe stimmen überein.",
      pitfall: "Falle: Nebeneinander erhoben heißt nicht automatisch integriert. Die gemeinsame Frage muss VORHER definiert sein."
    },
    buildIntegration: {
      cat: "Mixed Methods", name: "Build · Codes → Skala", mini: "build",
      tldr: "Qualitative Codes werden zu Items einer messbaren Skala, der Brückenpunkt im explorativen Design.",
      long: "„Build“ bezeichnet die Integrationsstelle, an der induktiv gewonnene Kategorien in messbare Items übersetzt werden. Hier entscheidet sich Inhaltsvalidität: deckt das Item den Bedeutungsraum?",
      example: "Code „Anschlussangst“ → Items: „Ich habe Sorge, den Anschluss zu verpassen“ (1–7 Likert) + 4 weitere.",
      pitfall: "Falle: Cronbach's α ersetzt keine Inhaltsvalidität."
    },
    explainIntegration: {
      cat: "Mixed Methods", name: "Explain · Muster → Interview", mini: "pattern-mechanism",
      tldr: "Erklärungsphase nach quantitativem Muster, gezielt Fälle für Tiefenverstehen auswählen.",
      long: "„Explain“ ist die zweite Phase im erklärend-sequentiellen Design: das quantitative Ergebnis bestimmt, welche Fälle qualitativ vertieft werden. Typisch: extreme Werte, Anomalien, Mechanismusfragen.",
      example: "Bottom-2 42% Anschlussinfo + r = −0,81 Wartezeit/Zufriedenheit → 12 Interviews bei Anschluss-Verlierern.",
      pitfall: "Falle: Qualitative Phase darf nicht nur nachträgliche Illustration sein."
    },
    mergeIntegration: {
      cat: "Mixed Methods", name: "Merge · Zahl + Zitat", mini: "joint-display",
      tldr: "Im konvergenten Design werden Datenarten in einer Matrix zusammengeführt, pro Frage Zahl + Zitat.",
      long: "Merge ist die Integrationsstelle bei parallelem Mixed-Methods-Design. Joint Display pro Frage: links die Zahl, rechts das Zitat, in der Mitte die Meta-Inferenz.",
      example: "Frage „Wo bricht Vertrauen?“ → 63% Abbruch nach Umstiegsanzeige + O-Ton „Ich wusste nicht, ob ich es schaffe“ → Mechanismus zum Effekt.",
      pitfall: "Falle: Nebeneinanderlegen ist noch keine Integration."
    },

    /* ---- Kolloquium-/Forschungs-Begriffe (Folien 37, 40, 42) ---- */
    lasso: {
      cat: "Modell", name: "LASSO", mini: "scatter",
      tldr: "Regression mit L1-Regularisierung, selektiert Variablen, schiebt schwache Koeffizienten auf 0.",
      long: "LASSO (Least Absolute Shrinkage and Selection Operator, Tibshirani 1996) löst Multikollinearität und Overfitting in hochdimensionalen Regressionen. Geeignet, wenn aus vielen Kandidaten-Features wenige relevante extrahiert werden sollen.",
      example: "Long-Tail-Keyword-Modellierung: 800 Kandidatenmerkmale je Keyword → LASSO schiebt 720 auf 0, behält 80 erklärungsstarke.",
      formal: "min Σ(yᵢ − β·xᵢ)² + λ · Σ|βⱼ|.",
      pitfall: "Falle: λ muss durch Cross-Validation gewählt werden."
    },
    hierarchicalBayes: {
      cat: "Modell", name: "Hierarchical Bayes", mini: "hbayes",
      tldr: "Mehrebenen-Bayes-Modell: einzelne Cells teilen Information über übergeordnete Verteilung.",
      long: "Hierarchical Bayes adressiert Sparse Data, indem es Cell-Schätzungen über eine Hyperprior-Verteilung verbindet. Cells mit wenig Daten werden zum globalen Mittel hin gezogen („Shrinkage“), Cells mit viel Daten behalten ihre Eigenständigkeit.",
      example: "θᵢ pro Bid Cell i, gemeinsamer Hyperprior θᵢ ~ Beta(α, β); α, β werden aus allen Cells geschätzt.",
      formal: "θᵢ | yᵢ,nᵢ,α,β ~ Beta(α+yᵢ, β+nᵢ−yᵢ); (α,β) ~ Hyperprior.",
      pitfall: "Falle: Stark abweichende Cells leiden unter unangemessenem Pooling."
    },
    dynamicLinearModels: {
      cat: "Modell", name: "Dynamic Linear Models", mini: "scatter",
      tldr: "Zeitvariante Regression, Koeffizienten dürfen sich über die Zeit ändern (State-Space).",
      long: "DLMs sind State-Space-Modelle, deren Parameter sich gemäß eines Zustandsprozesses entwickeln. Ideal für nicht-stationäre Märkte wie paid search, wo CVR über Wochen und Saisons drifted.",
      example: "Wöchentliche CVR-Schätzung pro Bid Cell mit drift-fähigem Intercept; Kalman-Filter-basiertes Update.",
      formal: "y_t = F_t · θ_t + ε_t; θ_t = G · θ_{t−1} + w_t.",
      pitfall: "Falle: Mehr Flexibilität heißt auch mehr Unsicherheit pro Schätzung."
    },
    collaborativeFiltering: {
      cat: "Modell", name: "Collaborative filtering", mini: "merge",
      tldr: "Schätzung schwacher Signale durch Ähnlichkeit zu anderen Einheiten, Cells lernen voneinander.",
      long: "Collaborative filtering nutzt Ähnlichkeitsstrukturen zwischen Einheiten (Keywords, Nutzer:innen, Cells), um Lücken aufzufüllen. In paid search: Wenn Keyword A ähnlich zu B,C,D ist, lernen wir A aus B, C, D.",
      example: "Keyword „Bachelor Wirtschaft Lübeck“ hat 0 Conversions; ähnliche Keywords haben 8%-CVR → geschätzte Posterior ≈ 8%.",
      pitfall: "Falle: Ähnlichkeit muss konstrukt-getreu definiert sein, nicht textueller Zufall."
    },
    userJourneyRegression: {
      cat: "Modell", name: "User-journey regression", mini: "journey-reg",
      tldr: "Modelliert Conversion als Funktion mehrerer Touchpoints in der Customer Journey.",
      long: "User-journey regression weist Conversion-Wahrscheinlichkeit nicht nur dem letzten Klick zu, sondern verteilt sie über vorgelagerte Touchpoints. Methodisch nahe an Multi-Touch Attribution.",
      example: "Conversion-Wahrscheinlichkeit = f(Display-Impressions, Search-Klicks t−7, Re-targeting t−1) statt nur Last-Click.",
      pitfall: "Falle: Identifikation kausaler Touchpoint-Beiträge ist nicht trivial, Beobachtungsdaten haben Confounding."
    },
    multiLLMPanel: {
      cat: "Multi-LLM Delphi", name: "Multi-LLM panel", mini: "llm-panel",
      tldr: "Heterogene Foundation-Modelle als Expert:innen-Panel, Diversität als Validitätsmechanismus.",
      long: "Statt einem LLM mehrere Rollen zu geben, werden mehrere verschiedene Modelle (GPT-4o, Claude, Gemini, Llama, Mistral, …) als unabhängige Stimmen behandelt. Modell-Heterogenität operationalisiert epistemische Vielfalt.",
      example: "n = 7 Foundation-Modelle, 2 Befragungsrunden, je 36 IR-Items pro 8 Branchen → 288 Antwortzellen pro Modell.",
      pitfall: "Falle: Modelle teilen Trainingsdaten, die „Unabhängigkeit“ der Stimmen ist eingeschränkt."
    },
    convergenceZones: {
      cat: "Multi-LLM Delphi", name: "Convergence zones", mini: "convergence",
      tldr: "Bereiche, in denen die Modelle nach zwei Runden konsistent dieselbe Richtung anzeigen.",
      long: "Konvergenzzonen sind die robusten Aussagen des Panels, dort, wo Modelle trotz unterschiedlicher Trainingsdaten zusammenkommen. Sie sind kandidatenstark für „Stand der Erwartung“ in einer Branche.",
      example: "Item „IR-Sites brauchen JSON-LD bis 2027“, 7/7 Modelle stimmen zu (Median 8/10, IQR < 1).",
      pitfall: "Falle: Konvergenz heißt nicht Wahrheit, sie kann auch geteilte Trainingsverzerrung anzeigen."
    },
    blindSpots: {
      cat: "Multi-LLM Delphi", name: "Blind spots", mini: "divergence",
      tldr: "Items, bei denen alle Modelle unsicher antworten, kein gemeinsames Wissen.",
      long: "Blind Spots zeigen Themen, in denen kein Modell ausreichend Trainingssignal hat. Für Forschung ist das ein Hinweis auf unterbelichtete Felder, in denen menschliche Primärrecherche besonders wertvoll bleibt.",
      example: "Item „Stimmungseffekt KI-generierter Earnings Calls auf Privatanleger“, alle 7 Modelle antworten mit Median 5/10, IQR > 3.",
      pitfall: "Falle: Blind Spots heißt nicht zwingend „kein echtes Phänomen“, nur „keine Modellrepräsentation“."
    },
    contestedFutures: {
      cat: "Multi-LLM Delphi", name: "Contested futures", mini: "divergence",
      tldr: "Items, bei denen Modelle systematisch unterschiedliche Richtungen vorhersagen.",
      long: "Contested Futures sind die spannendsten Ergebnisse: Modelle stimmen nicht überein, aber jedes für sich argumentiert konsistent. Diese Streitfälle sind methodisch wichtiger als Konvergenz, weil sie Optionalität sichtbar machen.",
      example: "Item „Regulatorischer Eingriff in AI-IR bis 2028“, 4 Modelle „wahrscheinlich“ (≥7/10), 3 Modelle „unwahrscheinlich“ (≤4/10).",
      pitfall: "Falle: Dissens darf nicht weggemittelt werden, beide Pole sind die Information."
    },
    capacityFlip: {
      cat: "AI Research", name: "Capacity flip", mini: "capacity",
      tldr: "Mit jeder Modellgeneration verschiebt sich, was menschliche Forscher:innen tun müssen versus dürfen.",
      long: "Der „Capacity Flip“ ist die These, dass mit jeder LLM-Generation Aufgaben aus dem menschlichen Pflichtbereich in den optionalen Bereich rutschen. Wert verschiebt sich vom Tun zum Steuern, Prüfen, Verantworten.",
      example: "Vor 3 Jahren: Forscherin schreibt Literatur-Review selbst. Heute: Forscherin entwirft Suchstrategie, prüft KI-Synthese, verwirft Halluzinationen.",
      pitfall: "Falle: Wer „mehr Output mit weniger Arbeit“ misst, übersieht den Rollenwandel."
    },
    gioia: {
      cat: "Codierung", name: "Gioia-Methodik", mini: "codes-items",
      tldr: "Strukturierte qualitative Datenanalyse: 1st-order Concepts → 2nd-order Themes → Aggregate Dimensions.",
      long: "Die Gioia-Methodik (Gioia, Corley, Hamilton 2013) macht qualitative Theoriebildung nachvollziehbar. Drei Codierungsstufen mit explizitem Data Structure als Anhang etablieren methodische Strenge für induktive Forschung.",
      example: "1st-order: O-Ton „Ich wusste nicht, ob ich es schaffe“ → 2nd-order: „Informationslücke“ → Aggregate: „Service-Vertrauensbruch“.",
      pitfall: "Falle: Gioia braucht eiserne Transparenz im Anhang, der Reiz ist Auditbarkeit, nicht Form."
    },
    prisma: {
      cat: "SLR", name: "PRISMA 2020", mini: "audit",
      tldr: "Berichtsstandard für Systematische Literaturreviews, definiert Such-, Screen-, Einschluss-Logik.",
      long: "PRISMA 2020 (Page et al.) ist der Reporting-Standard für SLRs. Das Flussdiagramm zeigt, wie viele Treffer aus welcher Quelle nach Screening übrigbleiben, Audit-Trail für Literaturarbeit.",
      example: "Identifiziert: 1.842 Treffer · nach Deduplikation: 1.214 · nach Title-/Abstract-Screening: 87 · nach Volltext: 31 eingeschlossen.",
      pitfall: "Falle: PRISMA prüft Berichtsqualität, nicht Inhaltsqualität der Studien selbst."
    },

    /* ---- Folie 10, Pattern-Kategorien (quantitative Erkenntnisformen) ---- */
    distribution: {
      cat: "Auswertung", name: "Verteilung", mini: "scatter",
      tldr: "Bevor man Mittelwerte vergleicht, muss man die Verteilung anschauen, sonst übersieht man das Wichtigste.",
      long: "Eine Verteilung zeigt, wie häufig welche Werte vorkommen. Mittelwert allein verbirgt die wesentliche Information: ein M = 4,3 bei einer 1–7-Skala kann „alle sind mittelmäßig zufrieden“ heißen ODER „die Hälfte ist sehr zufrieden, die andere Hälfte sehr unzufrieden“. Diese beiden Welten brauchen komplett verschiedene Antworten. Deshalb gilt: erst die Verteilung visualisieren (Histogramm, Boxplot), dann gezielt Kennzahlen wählen, Mittelwert für symmetrische Verteilungen, Median für schiefe, Bottom-2-Box für „akut unzufrieden“-Segmente.",
      example: "Anschluss-Bewertung Mittelwert 4,3 von 7 wirkt mittelmäßig. Histogramm zeigt: zweigipflig, 25 % bei Stufe 2 (akut unzufrieden), 30 % bei Stufe 6 (zufrieden). Zwei Märkte unter einer Zahl.",
      formal: "f(x) = P(X = x) bzw. F(x) = P(X ≤ x).",
      pitfall: "Falle: Nur den Mittelwert berichten heißt blind in eine Verteilung greifen, und das eigentliche Problem nicht finden."
    },
    mean: {
      cat: "Auswertung", name: "Mittelwert", mini: "scatter",
      tldr: "Schwerpunkt der Daten, perfekt für symmetrische Verteilungen, gefährlich bei Schiefe oder Ausreißern.",
      long: "Der arithmetische Mittelwert ist die Standardkennzahl für zentrale Tendenz und gut interpretierbar, aber er reagiert empfindlich auf Extremwerte (ein Reisender wartet 4 Stunden, der Wartezeit-Mittel verschiebt sich). Bei schiefen Verteilungen (Wartezeiten, Einkommen, Wohnkosten) berichtet der Median den „typischen Wert“ ehrlicher. Bei bimodalen Verteilungen ist keine Punktkennzahl ausreichend, dann braucht man die Verteilung oder Segmente.",
      example: "Bottom-2-Box = 42 % sagt für die Entscheidung „wie groß ist das Problem-Segment?“ mehr als Mittelwert 4,3. Beide Zahlen aus denselben Daten, eine handlungsrelevant, eine nicht.",
      formal: "M̄ = (1/n) · Σ xᵢ.",
      pitfall: "Falle: Mittelwert ohne SD und ohne Anteile berichtet ist die häufigste Verzerrung in Praxis-Reports."
    },
    dispersion: {
      cat: "Auswertung", name: "Streuung", mini: "scatter",
      tldr: "Sind sich die Befragten einig, oder spaltet sich der Markt? Streuung ist für viele Entscheidungen wichtiger als der Mittelwert.",
      long: "Die Standardabweichung (SD) misst, wie weit die Einzelwerte im Schnitt vom Mittelwert entfernt liegen. Hohe SD = heterogenes Erleben; niedrige SD = einheitliches Erleben. Zwei Service-Linien mit gleichem Mittelwert können völlig unterschiedlich gemanagt werden: Linie A mit niedrigem SD bedeutet konsistente Lieferung, Linie B mit hohem SD bedeutet Glücksspiel pro Kontakt. Letzteres ist für Marken-Vertrauen oft schädlicher als ein durchschnittlich niedrigerer Service.",
      example: "Zufriedenheit M = 4,3, SD = 1,9 → starke Streuung, jeder erlebt die Bahn anders. M = 4,3, SD = 0,3 → alle erleben einheitlich mittelmäßig.",
      formal: "SD = √( (1/(n−1)) · Σ (xᵢ − M̄)² ).",
      pitfall: "Falle: SD (Streuung der Rohwerte) nicht mit SE (Schätzunsicherheit) verwechseln, verschiedene Geschichten."
    },
    segmentation: {
      cat: "Auswertung", name: "Segment", mini: "cluster",
      tldr: "Ein Gesamt-Mittelwert blendet die wichtigste Information aus: wer leidet wo am meisten. Segmente machen die Heterogenität sichtbar.",
      long: "Segmentierung zerlegt eine Gesamtverteilung in interpretierbare Teilgruppen, nach Reiseanlass, Strecke, Tageszeit, Lebensphase. Forschungs- und Management-Relevanz entstehen genau dort, wo Segmente UNTERSCHIEDLICH reagieren. Ein Gesamtmittelwert von 36 % unzufrieden kann harmlos wirken; aufgesplittet zeigt sich, dass Pendler:innen bei 58 % liegen und Freizeitreisende bei 22 %, und die Entscheidung muss bei der schmerzhaften Gruppe ansetzen. Wichtig: Segmente sollten THEORETISCH begründet sein (Reisezweck ist ein bekanntes Differenzierungsmerkmal), nicht erst aus den Daten gefischt.",
      example: "Bottom-2 gesamt = 36 %. Aufgesplittet: Pendler:innen 58 %, Geschäftsreise 42 %, Freizeit 22 % → drei verschiedene Märkte unter einer Zahl.",
      pitfall: "Falle: Post-hoc-Segmentierung findet irgendein signifikantes Muster, Segmente vorab theoretisch begründen."
    },
    effect: {
      cat: "Auswertung", name: "Effekt", mini: "cohen",
      tldr: "Statistik beantwortet zwei Fragen getrennt: „Existiert ein Unterschied?“ (Signifikanz) und „Wie groß ist er?“ (Effektgröße). Beide sind nötig.",
      long: "Ein Effekt quantifiziert, wie groß die Wirkung tatsächlich ist, als Mittelwertdifferenz, Anteilsdifferenz (pp), oder standardisiert als Cohen's d. Bei sehr großen Stichproben werden auch winzige Unterschiede statistisch signifikant; ohne Effektgröße kann man Praxisrelevanz nicht beurteilen. Faustregeln: für Anteile gelten 2–5 pp als spürbar, 10 pp als groß; für d gilt 0,2 klein / 0,5 mittel / 0,8 groß. Aber: Domäne entscheidet, in der Bildungsforschung sind 0,2 schon groß, im UX 0,8 manchmal nicht ausreichend.",
      example: "Treatment senkt Abbruchquote von 63 % auf 41 % → Δ = −22 pp, Cohen's d ≈ 0,46 (mittel). Beide Zahlen brauchen ein Konfidenzintervall, um belastbar zu sein.",
      formal: "Δ = M_T − M_K; d = Δ / SD_pooled.",
      pitfall: "Falle: „Statistisch signifikant“ ohne Effektgröße ist keine Entscheidung wert."
    },
    quadrantTL: {
      cat: "Quadrant", name: "Erzählen lassen", mini: "quote",
      tldr: "Methoden, in denen Reisende selbst zu Wort kommen und ihr Erleben in eigenen Worten formen.",
      long: "Der obere-linke Quadrant kombiniert aktiv erhobene Sprache mit hoher Falltiefe. Hier interessiert weniger, wie oft etwas passiert, sondern wie Reisende es deuten, in welche Worte sie es kleiden, welche Vorgeschichte sie erzählen. Typisch sind leitfadengestützte Interviews, Critical-Incident-Erzählungen oder Tagebucheinträge. Output sind Mechanismen, Begründungen und Konstrukte, die später in Items übersetzt werden können.",
      example: "Frage: Was bedeutet ein verpasster Anschluss für Reisende? Zwölf leitfadengestützte Interviews, Mayring-Codierung, vier Bedeutungsmuster als Codebuch.",
      pitfall: "Falle: Was Reisende erzählen, ist nicht zwingend identisch mit dem, was sie tun."
    },
    quadrantTR: {
      cat: "Quadrant", name: "Feldnah beobachten", mini: "field",
      tldr: "Methoden, die Verhalten im echten Servicekontext aufnehmen, statt es zu erfragen.",
      long: "Der obere-rechte Quadrant kombiniert vorliegende oder beobachtbare Daten mit hoher Falltiefe. Forschende gehen ins Feld (Bahnhof, App, Lounge) und dokumentieren, was tatsächlich passiert, im Detail und in Reihenfolge. Typisch sind Ethnographie, Go-along, Think-aloud. Output sind Routinen, Improvisationen und Touchpoint-Beschreibungen, die im Interview niemand benannt hätte.",
      example: "Sechs Wochen teilnehmende Beobachtung am Hauptbahnhof, 18 Sessions, Feldnotizen getrennt nach Beobachtung, Kontext und Interpretation.",
      pitfall: "Falle: Anwesenheit der Forschenden verändert manchmal die Situation, Feldnotiz braucht reflexive Distanz."
    },
    quadrantBL: {
      cat: "Quadrant", name: "Interaktion vergleichen", mini: "consensus",
      tldr: "Methoden, die Aussprache und Aushandlung über mehrere Fälle hinweg vergleichbar machen.",
      long: "Der untere-linke Quadrant kombiniert aktiv erhobene Interaktion mit höherer Vergleichbarkeit. Es geht weniger um Einzelfall-Tiefe als um Sprachmuster, Konfliktlinien oder Aufgabenbarrieren, die sich über mehrere Gespräche oder Sessions wiederholen. Typisch sind Fokusgruppen, Think-aloud-Tests an Standardaufgaben oder halbstandardisierte Gruppendiskussionen mit fixem Themenraster.",
      example: "Drei Fokusgruppen à sechs Pendlerinnen zu drei Wording-Varianten der App-Anschlussanzeige, Konvergenz auf eine Sprache, Streit über die anderen zwei.",
      pitfall: "Falle: Dominante Stimmen können einen Konsens vortäuschen, den es so nicht gibt."
    },
    quadrantBR: {
      cat: "Quadrant", name: "Material codieren", mini: "deductive-inductive",
      tldr: "Methoden, die existierende Texte, Dokumente oder Online-Spuren systematisch in Kategorien überführen.",
      long: "Der untere-rechte Quadrant kombiniert vorliegendes Material mit hoher Vergleichbarkeit. Forschende erheben hier nichts Neues, sondern strukturieren existierende Inhalte regelgeleitet: Beschwerden, Forenposts, Servicedokumente, Open-Ends. Typisch sind qualitative Inhaltsanalyse, Netnographie und Dokumentenanalyse. Output sind Kategorien, Frames und Häufigkeiten mit Anker-Zitaten.",
      example: "1.200 Beschwerde-Tickets der DB, induktiv codiert mit zwei Codierenden, Cohen's κ = .78, fünf Hauptkategorien.",
      pitfall: "Falle: Kategorien sind eine Lese-Entscheidung der Forschenden, keine Wahrheit aus dem Material."
    },
    axisActive: {
      cat: "Datenzugang", name: "Aktiv erhoben", mini: "sample",
      tldr: "Die Daten entstehen erst durch die Forschungssituation: jemand fragt, stellt eine Aufgabe, moderiert eine Gruppe.",
      long: "Aktiv erhobene Daten setzen voraus, dass eine Forschungssituation geschaffen wird, sei es ein Interview, eine Fokusgruppe oder eine Usability-Aufgabe. Vorteil: man kommt an Sprache, Deutung und Begründung, also an Inhalte, die nicht von allein sichtbar werden. Preis: jede Forschungssituation ist eine konstruierte Situation, die Antworten formt, soziale Erwünschtheit, Aufgabenframing, Moderationseffekte sind unvermeidbar und müssen reflektiert werden.",
      example: "Leitfadeninterview mit Pendlerinnen, Fokusgruppen-Moderation zu Anschluss-Wording, Think-aloud-Test am Self-Service-Kiosk.",
      pitfall: "Falle: Die Forschungssituation beeinflusst, was Reisende sagen oder tun (Reaktivität)."
    },
    axisObserved: {
      cat: "Datenzugang", name: "Vorliegend oder beobachtet", mini: "text-corpus",
      tldr: "Die Daten sind bereits vorhanden oder entstehen ohne Befragungseingriff: Forschende lesen, beobachten, sammeln.",
      long: "Vorliegende oder beobachtete Daten sind Material, das nicht für die Forschungsfrage erzeugt wurde: Feldhandlungen, Logfiles, Beschwerden, Forenposts, Dokumente. Vorteil: keine Reaktivität, oft große Fallzahl, Verhalten statt Selbstauskunft. Preis: das Material muss inhaltlich passen, und der Kontext seiner Entstehung muss mitgelesen werden, sonst beantwortet man die Frage des Datenproduzenten, nicht die eigene.",
      example: "Ethnographische Feldnotizen am Bahnsteig, Forendiskussionen in einem Pendlerforum, Beschwerdeprotokolle der DB-Kundenbetreuung.",
      pitfall: "Falle: Was vorhanden ist, antwortet nicht automatisch auf die eigene Forschungsfrage."
    },
    axisDepth: {
      cat: "Erkenntnisziel", name: "Hohe Falltiefe", mini: "quote",
      tldr: "Wenige Fälle werden so detailreich erhoben, dass Kontext, Reihenfolge und Bedeutung verstanden werden.",
      long: "Falltiefe heißt: lieber sechs Fälle in je 90 Minuten als hundert Fälle in je zehn Minuten. Forschende rekonstruieren die Geschichte hinter dem Phänomen, hören Vorgeschichte und Wendepunkt, kommen an Mechanismen und Begründungen. Typisch für Phasen, in denen das Phänomen noch nicht gut verstanden ist und es zunächst Hypothesen, Begriffe und Konstrukte zu finden gilt.",
      example: "Zwölf Critical-Incident-Interviews zu verpassten Anschlüssen liefern vier typische Eskalationspfade.",
      pitfall: "Falle: Ein tiefer Fall ist analytisch reich, aber nicht automatisch typisch für die Grundgesamtheit."
    },
    axisBreadth: {
      cat: "Erkenntnisziel", name: "Hohe Vergleichbarkeit", mini: "pattern-mechanism",
      tldr: "Viele Fälle werden so ähnlich behandelt, dass sich Muster über die Fälle hinweg lesen lassen.",
      long: "Vergleichbarkeit heißt: bewusst Kontext reduzieren, damit Fälle aufeinander beziehbar werden. Typisch für die Phase, in der man bereits eine Vorstellung vom Phänomen hat und Kategorien, Frames oder Häufigkeiten prüfen will. Die Methodenwahl steuert das Maß: Inhaltsanalyse mit festem Codebuch, Fokusgruppen mit gleichem Themenraster, Tagebuchstudien mit identischen Prompts.",
      example: "1.200 Beschwerde-Tickets nach gleichem Codebuch codiert, fünf Hauptkategorien mit Anker-Zitaten und Häufigkeitsverteilung.",
      pitfall: "Falle: Mehr Vergleichbarkeit kostet immer Bedeutung; was nicht ins Codebuch passt, wird unsichtbar."
    }
  };

  /* ============================================================
     Figurenbibliothek, eine SVG-Illustration pro Begriff.
     Standard-viewBox: 408×88. Eingefärbt mit Brand-Tokens
     (--accent-red #D9272E, --ink #0f172a, --slate-300 #cbd5e1).
     Die Figuren werden NACH der explainers-Definition automatisch
     in jeden passenden Eintrag eingehängt (nur wenn noch kein
     `figure` gesetzt ist).
     ============================================================ */
  var F = (function () {
    var W = 408, H = 88, RED = "#D9272E", INK = "#0f172a", GREY = "#cbd5e1", AXIS = "#64748b";
    var FONT = "DM Mono, monospace";
    function wrap(inner) { return "<svg width='" + W + "' height='" + H + "' viewBox='0 0 " + W + " " + H + "' xmlns='http://www.w3.org/2000/svg'>" + inner + "</svg>"; }
    function t(x, y, txt, opts) {
      opts = opts || {};
      return "<text x='" + x + "' y='" + y + "' font-family='" + FONT + "' font-size='" + (opts.fs || 10) + "' fill='" + (opts.fill || INK) + "' text-anchor='" + (opts.anchor || "middle") + "'" + (opts.weight ? " font-weight='" + opts.weight + "'" : "") + ">" + txt + "</text>";
    }
    function axis(y) { return "<line x1='20' y1='" + y + "' x2='" + (W - 20) + "' y2='" + y + "' stroke='" + GREY + "' stroke-width='1'/>"; }
    function tick(x, top, bottom, color) { return "<line x1='" + x + "' y1='" + top + "' x2='" + x + "' y2='" + bottom + "' stroke='" + (color || INK) + "' stroke-width='2'/>"; }
    function dot(x, y, r, color, op) { return "<circle cx='" + x + "' cy='" + y + "' r='" + r + "' fill='" + color + "'" + (op != null ? " opacity='" + op + "'" : "") + "/>"; }

    return {
      /* ---- Verteilung: Glockenkurve ---- */
      distribution: function () {
        var p = "";
        for (var i = 0; i <= 40; i++) {
          var x = 30 + i * 8.7, z = (i - 20) / 6;
          var y = 70 - 50 * Math.exp(-(z * z) / 2);
          p += (i === 0 ? "M" : "L") + x + " " + y;
        }
        return wrap(
          axis(70) +
          "<path d='" + p + "' fill='" + INK + "' opacity='0.12' stroke='" + INK + "' stroke-width='2'/>" +
          /* Mittelwert in der Mitte */
          tick(204, 14, 70, RED) +
          t(204, 9, "Mittelwert M̄", { fs: 9, fill: RED, weight: 700 }) +
          /* Streuung als Bracket auf ±1 SD */
          "<line x1='152' y1='40' x2='256' y2='40' stroke='" + AXIS + "' stroke-width='1' stroke-dasharray='3 2'/>" +
          "<line x1='152' y1='36' x2='152' y2='44' stroke='" + AXIS + "' stroke-width='1'/>" +
          "<line x1='256' y1='36' x2='256' y2='44' stroke='" + AXIS + "' stroke-width='1'/>" +
          t(204, 35, "±1 SD", { fs: 9, fill: AXIS, weight: 700 }) +
          /* Achsen-Labels Likert-Beispiel */
          t(50, 86, "1 (gar nicht)", { fs: 9, fill: AXIS, anchor: "start" }) +
          t(204, 86, "Wertespanne", { fs: 9, fill: AXIS }) +
          t(358, 86, "7 (voll)", { fs: 9, fill: AXIS, anchor: "end" })
        );
      },

      /* ---- Mittelwert: zentraler Punkt im Datenstrich ---- */
      mean: function () {
        var dots = "";
        var xs = [60, 80, 100, 120, 140, 160, 180, 200, 220, 240, 260, 280, 300, 320, 340];
        for (var i = 0; i < xs.length; i++) dots += dot(xs[i], 56, 4, GREY);
        return wrap(
          axis(56) + dots +
          /* Einzelne Werte annotieren */
          t(60, 38, "x₁", { fs: 9, fill: AXIS }) +
          t(340, 38, "xₙ", { fs: 9, fill: AXIS }) +
          tick(200, 26, 70, RED) +
          t(200, 20, "M̄ = (1/n)·Σxᵢ", { fs: 11, fill: RED, weight: 700 }) +
          t(200, 84, "Schwerpunkt der Daten", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Streuung: Bracket über breite Datenpunkte ---- */
      dispersion: function () {
        var dots = "";
        var xs = [50, 80, 110, 130, 155, 180, 200, 220, 245, 270, 295, 325, 360];
        for (var i = 0; i < xs.length; i++) dots += dot(xs[i], 60, 4, GREY);
        return wrap(
          axis(60) + dots +
          /* Mittelwert-Tick */
          tick(204, 30, 70, INK) +
          t(204, 26, "M̄", { fs: 10, fill: INK, weight: 700 }) +
          /* ±1 SD Bracket */
          "<line x1='130' y1='45' x2='278' y2='45' stroke='" + AXIS + "' stroke-width='1' stroke-dasharray='3 2'/>" +
          "<line x1='130' y1='42' x2='130' y2='48' stroke='" + AXIS + "' stroke-width='1'/>" +
          "<line x1='278' y1='42' x2='278' y2='48' stroke='" + AXIS + "' stroke-width='1'/>" +
          t(170, 41, "−1 SD", { fs: 9, fill: AXIS, weight: 700 }) +
          t(238, 41, "+1 SD", { fs: 9, fill: AXIS, weight: 700 }) +
          /* Vollbreite ±2 SD */
          "<line x1='50' y1='17' x2='360' y2='17' stroke='" + RED + "' stroke-width='2'/>" +
          "<line x1='50' y1='13' x2='50' y2='21' stroke='" + RED + "' stroke-width='2'/>" +
          "<line x1='360' y1='13' x2='360' y2='21' stroke='" + RED + "' stroke-width='2'/>" +
          t(205, 11, "≈ ±2 SD enthält ~95% der Werte", { fs: 10, fill: RED, weight: 700 }) +
          t(204, 84, "SD = √(Σ(xᵢ − M̄)² / (n−1))", { fs: 10, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Segment: 3 Cluster (Bahnreise-Beispiel) ---- */
      segmentation: function () {
        function cluster(cx, color) { var s = ""; var off = [[-8, -4], [0, -8], [8, -4], [-4, 4], [4, 4], [0, 8]]; for (var i = 0; i < off.length; i++) s += dot(cx + off[i][0], 50 + off[i][1], 4, color, 0.85); return s; }
        return wrap(
          cluster(100, INK) + cluster(204, RED) + cluster(308, AXIS) +
          t(100, 22, "Pendler:innen", { fs: 10, fill: INK, weight: 700 }) + t(100, 80, "Bottom-2 = 58%", { fs: 9, fill: INK }) +
          t(204, 22, "Geschäftsreise", { fs: 10, fill: RED, weight: 700 }) + t(204, 80, "Bottom-2 = 42%", { fs: 9, fill: RED }) +
          t(308, 22, "Freizeit", { fs: 10, fill: AXIS, weight: 700 }) + t(308, 80, "Bottom-2 = 22%", { fs: 9, fill: AXIS })
        );
      },

      /* ---- Effekt: Vorher/Nachher Bars ---- */
      effect: function () {
        return wrap(
          "<rect x='90' y='30' width='60' height='44' fill='" + GREY + "'/>" +
          "<rect x='240' y='40' width='60' height='34' fill='" + RED + "'/>" +
          t(120, 22, "63%", { fs: 12, fill: INK, weight: 700 }) + t(120, 84, "Kontrolle", { fs: 10, fill: AXIS }) +
          t(270, 32, "41%", { fs: 12, fill: RED, weight: 700 }) + t(270, 84, "Treatment", { fs: 10, fill: RED }) +
          "<path d='M 160 50 L 230 50' stroke='" + INK + "' stroke-width='1.5'/><polygon points='230,50 222,46 222,54' fill='" + INK + "'/>" +
          t(195, 44, "Δ = −22 pp", { fs: 11, fill: INK, weight: 700 })
        );
      },

      /* ---- Likert: 7 Stufen mit Mittelwertstrich ---- */
      likert: function () {
        var vals = [10, 18, 22, 24, 14, 8, 4], bars = "";
        var bw = 38, gap = 6;
        for (var i = 0; i < 7; i++) {
          var x = 60 + i * (bw + gap), h = vals[i] * 2.0, y = 74 - h;
          bars += "<rect x='" + x + "' y='" + y + "' width='" + bw + "' height='" + h + "' fill='" + (i < 2 ? RED : GREY) + "'/>";
          bars += t(x + bw / 2, 84, (i + 1) + "", { fs: 10, fill: AXIS, weight: 700 });
        }
        /* Mittelwert-Linie */
        var meanX = 60 + 2.4 * (bw + gap) + bw / 2;
        return wrap(
          bars +
          "<line x1='" + meanX + "' y1='12' x2='" + meanX + "' y2='74' stroke='" + INK + "' stroke-width='2' stroke-dasharray='3 3'/>" +
          t(meanX, 9, "M̄ = 3,4", { fs: 10, fill: INK, weight: 700 }) +
          /* Bottom-2 Klammer über Stufen 1+2 */
          "<line x1='62' y1='20' x2='154' y2='20' stroke='" + RED + "' stroke-width='2'/>" +
          "<line x1='62' y1='16' x2='62' y2='24' stroke='" + RED + "' stroke-width='2'/>" +
          "<line x1='154' y1='16' x2='154' y2='24' stroke='" + RED + "' stroke-width='2'/>" +
          t(108, 14, "Bottom-2 = 28%", { fs: 9, fill: RED, weight: 700 }) +
          t(50, 84, "stimme gar nicht zu", { fs: 8, fill: AXIS, anchor: "start" }) +
          t(360, 84, "stimme voll zu", { fs: 8, fill: AXIS, anchor: "end" })
        );
      },

      /* ---- Bottom-2: gestapelte Likert mit Bottom-2 ---- */
      bottom2: function () {
        var w = 360, x = 24;
        return wrap(
          "<rect x='" + x + "' y='38' width='" + (w * 0.17) + "' height='30' fill='" + RED + "'/>" +
          "<rect x='" + (x + w * 0.17) + "' y='38' width='" + (w * 0.25) + "' height='30' fill='" + RED + "' opacity='0.7'/>" +
          "<rect x='" + (x + w * 0.42) + "' y='38' width='" + (w * 0.58) + "' height='30' fill='" + GREY + "'/>" +
          /* Stufen-Labels innerhalb der Balken */
          t(x + w * 0.085, 56, "Stufe 1", { fs: 9, fill: "#fff", weight: 700 }) +
          t(x + w * 0.295, 56, "Stufe 2", { fs: 9, fill: "#fff", weight: 700 }) +
          t(x + w * 0.71, 56, "Stufen 3–7", { fs: 10, fill: INK, weight: 700 }) +
          /* Bottom-2 Klammer */
          "<line x1='" + x + "' y1='26' x2='" + (x + w * 0.42) + "' y2='26' stroke='" + RED + "' stroke-width='2'/>" +
          "<line x1='" + x + "' y1='22' x2='" + x + "' y2='30' stroke='" + RED + "' stroke-width='2'/>" +
          "<line x1='" + (x + w * 0.42) + "' y1='22' x2='" + (x + w * 0.42) + "' y2='30' stroke='" + RED + "' stroke-width='2'/>" +
          t(x + w * 0.21, 18, "Bottom-2 = 42%", { fs: 11, fill: RED, weight: 700 }) +
          /* Skalenenden */
          t(x + 6, 80, "stimme gar nicht zu (1)", { fs: 9, fill: AXIS, anchor: "start" }) +
          t(x + w - 6, 80, "stimme voll zu (7)", { fs: 9, fill: AXIS, anchor: "end" })
        );
      },

      /* ---- Sample size: kleines n vs großes n ---- */
      sampleSize: function () {
        function fan(cx, points) { var s = ""; for (var i = 0; i < points; i++) { var a = -Math.PI / 2 + (i / (points - 1)) * Math.PI * 0.8 - Math.PI * 0.4; s += dot(cx + Math.cos(a) * 32, 56 + Math.sin(a) * 28, 3, INK, 0.7); } return s; }
        return wrap(
          fan(110, 5) + fan(300, 30) +
          t(110, 12, "n = 25", { fs: 11, fill: AXIS, weight: 700 }) +
          t(300, 12, "n = 2.500", { fs: 11, fill: INK, weight: 700 }) +
          /* Konfidenzbreite */
          "<line x1='80' y1='86' x2='140' y2='86' stroke='" + AXIS + "' stroke-width='3'/>" +
          t(110, 80, "KI ± 10pp", { fs: 9, fill: AXIS, weight: 700 }) +
          "<line x1='292' y1='86' x2='308' y2='86' stroke='" + INK + "' stroke-width='3'/>" +
          t(300, 80, "KI ± 1pp", { fs: 9, fill: INK, weight: 700 }) +
          t(204, 50, "SE_p = √(p(1−p)/n)", { fs: 10, fill: RED, weight: 700, anchor: "middle" })
        );
      },

      /* ---- Confidence Interval ---- */
      confidenceInterval: function () {
        return wrap(axis(50) + tick(204, 22, 58, INK) + dot(204, 50, 5, INK) +
          "<line x1='130' y1='50' x2='278' y2='50' stroke='" + RED + "' stroke-width='3'/>" +
          "<line x1='130' y1='40' x2='130' y2='60' stroke='" + RED + "' stroke-width='2'/>" +
          "<line x1='278' y1='40' x2='278' y2='60' stroke='" + RED + "' stroke-width='2'/>" +
          /* θ̂ marker */
          t(204, 18, "Schätzer θ̂ = 42%", { fs: 10, fill: INK, weight: 700 }) +
          /* lower/upper bound */
          t(130, 80, "untere", { fs: 9, fill: RED }) + t(130, 86, "Grenze 40%", { fs: 9, fill: RED, weight: 700 }) +
          t(278, 80, "obere", { fs: 9, fill: RED }) + t(278, 86, "Grenze 44%", { fs: 9, fill: RED, weight: 700 }) +
          /* width = ± z·SE */
          t(204, 80, "± 1,96 · SE", { fs: 9, fill: RED, weight: 700 }) +
          t(204, 86, "95%-KI", { fs: 10, fill: RED, weight: 700 }));
      },

      /* ---- p-Wert: Normalkurve mit Tail ---- */
      pvalue: function () {
        var p = "", pt = "";
        for (var i = 0; i <= 60; i++) {
          var x = 30 + i * 5.8, z = (i - 30) / 9;
          var y = 70 - 48 * Math.exp(-(z * z) / 2);
          p += (i === 0 ? "M" : "L") + x + " " + y;
        }
        var critIdx = 45, critX = 30 + critIdx * 5.8;
        for (var j = critIdx; j <= 60; j++) {
          var xt = 30 + j * 5.8, zt = (j - 30) / 9;
          var yt = 70 - 48 * Math.exp(-(zt * zt) / 2);
          pt += (j === critIdx ? "M" + xt + " 70 L" + xt + " " + yt : "L" + xt + " " + yt);
        }
        pt += " L" + (30 + 60 * 5.8) + " 70 Z";
        return wrap(
          axis(70) +
          "<path d='" + pt + "' fill='" + RED + "' opacity='0.65'/><path d='" + p + "' fill='none' stroke='" + INK + "' stroke-width='1.5'/>" +
          /* Mittelwert von H0 */
          tick(30 + 30 * 5.8, 18, 70, INK) +
          t(30 + 30 * 5.8, 13, "H₀-Mittel", { fs: 9, fill: INK, weight: 700 }) +
          /* α-Schwelle */
          "<line x1='" + critX + "' y1='40' x2='" + critX + "' y2='70' stroke='" + RED + "' stroke-width='1.5' stroke-dasharray='3 3'/>" +
          t(critX, 35, "α = .05", { fs: 9, fill: RED, weight: 700 }) +
          /* p-Wert Tail beobachtet */
          t(355, 56, "p-Wert", { fs: 11, fill: RED, weight: 700, anchor: "end" }) +
          t(355, 68, "= Tail-Fläche", { fs: 9, fill: RED, weight: 700, anchor: "end" }) +
          t(204, 86, "P(T ≥ t_obs | H₀)", { fs: 10, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Cohen's d: zwei überlappende Bells ---- */
      cohenD: function () {
        function bell(cx, color, op) {
          var s = "", p = "";
          for (var i = 0; i <= 40; i++) {
            var x = cx - 80 + i * 4, z = (i - 20) / 6;
            var y = 70 - 40 * Math.exp(-(z * z) / 2);
            p += (i === 0 ? "M" : "L") + x + " " + y;
          }
          s += "<path d='" + p + "' fill='" + color + "' opacity='" + op + "' stroke='" + color + "' stroke-width='1.5'/>";
          return s;
        }
        return wrap(
          axis(70) + bell(160, GREY, 0.6) + bell(248, RED, 0.5) +
          tick(160, 26, 70, INK) + tick(248, 26, 70, RED) +
          /* Gruppen-Mittelwerte */
          t(160, 20, "M_K (Kontrolle)", { fs: 9, fill: INK, weight: 700 }) +
          t(248, 20, "M_T (Treatment)", { fs: 9, fill: RED, weight: 700 }) +
          /* Distanz Δ */
          "<line x1='160' y1='40' x2='248' y2='40' stroke='" + INK + "' stroke-width='1.5'/>" +
          "<line x1='160' y1='37' x2='160' y2='43' stroke='" + INK + "' stroke-width='1.5'/>" +
          "<line x1='248' y1='37' x2='248' y2='43' stroke='" + INK + "' stroke-width='1.5'/>" +
          t(204, 36, "Δ = M_T − M_K", { fs: 10, fill: INK, weight: 700 }) +
          /* SD pooled = Breite einer Kurve */
          "<line x1='115' y1='65' x2='205' y2='65' stroke='" + AXIS + "' stroke-width='1' stroke-dasharray='3 2'/>" +
          t(160, 63, "≈ SD_pooled", { fs: 9, fill: AXIS, weight: 700 }) +
          t(204, 86, "d = Δ / SD_pooled", { fs: 10, fill: RED, weight: 700 })
        );
      },

      /* ---- Korrelation: Scatter mit Linie ---- */
      correlation: function () {
        var pts = "", xs = [40, 70, 95, 120, 145, 170, 200, 230, 260, 285, 315, 345, 372];
        for (var i = 0; i < xs.length; i++) {
          var ny = 28 + (xs[i] - 40) * 0.135 + (Math.sin(i * 1.7) * 6);
          pts += dot(xs[i], ny, 4, INK, 0.75);
        }
        return wrap(
          axis(76) +
          "<line x1='40' y1='28' x2='372' y2='73' stroke='" + RED + "' stroke-width='2'/>" + pts +
          t(204, 14, "r = −0,81 · negativ stark", { fs: 11, fill: RED, weight: 700 }) +
          /* Achsenbeschriftung mit Beispiel-Konstrukten */
          "<line x1='40' y1='76' x2='40' y2='80' stroke='" + AXIS + "'/>" +
          "<line x1='372' y1='76' x2='372' y2='80' stroke='" + AXIS + "'/>" +
          t(40, 86, "Wartezeit kurz", { fs: 9, fill: AXIS, anchor: "start" }) +
          t(372, 86, "Wartezeit lang", { fs: 9, fill: AXIS, anchor: "end" }) +
          /* y-Achse: Zufriedenheit */
          "<text x='14' y='30' font-family='" + FONT + "' font-size='9' fill='" + AXIS + "' transform='rotate(-90 14 30)' text-anchor='start'>Zufriedenheit hoch</text>" +
          "<text x='14' y='73' font-family='" + FONT + "' font-size='9' fill='" + AXIS + "' transform='rotate(-90 14 73)' text-anchor='end'>niedrig</text>" +
          /* Regressionsgerade-Label */
          t(290, 56, "Regression", { fs: 9, fill: RED, weight: 700, anchor: "start" })
        );
      },

      /* ---- r² / Modellfit ---- */
      rSquared: function () {
        var pts = "", xs = [50, 80, 110, 140, 170, 200, 230, 260, 290, 320, 350];
        for (var i = 0; i < xs.length; i++) {
          var ny = 70 - (xs[i] - 50) * 0.16 + (Math.cos(i * 2.1) * 4);
          pts += dot(xs[i], ny, 4, INK, 0.75);
        }
        return wrap(
          axis(76) +
          "<line x1='50' y1='70' x2='350' y2='22' stroke='" + RED + "' stroke-width='2'/>" + pts +
          /* Beispiel-Residuum als kleine Strecke */
          "<line x1='200' y1='42' x2='200' y2='52' stroke='" + AXIS + "' stroke-width='1' stroke-dasharray='2 2'/>" +
          t(208, 48, "Residuum", { fs: 9, fill: AXIS, anchor: "start" }) +
          t(204, 14, "R² = 0,68 → 68% Varianz erklärt", { fs: 11, fill: RED, weight: 700 }) +
          t(204, 86, "R² = 1 − SS_res / SS_tot", { fs: 10, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Odds Ratio: zwei Bars ---- */
      oddsRatio: function () {
        return wrap(
          "<rect x='80' y='40' width='80' height='34' fill='" + GREY + "'/>" +
          "<rect x='240' y='24' width='80' height='50' fill='" + RED + "'/>" +
          /* Anteile auf den Balken */
          t(120, 36, "p_K = 0,40", { fs: 10, fill: INK, weight: 700 }) +
          t(280, 20, "p_T = 0,52", { fs: 10, fill: RED, weight: 700 }) +
          /* Odds = p / (1−p) */
          t(120, 60, "Odds = 0,67", { fs: 10, fill: "#fff", weight: 700 }) +
          t(280, 50, "Odds = 1,08", { fs: 10, fill: "#fff", weight: 700 }) +
          t(120, 86, "Kontrolle", { fs: 9, fill: AXIS, weight: 700 }) +
          t(280, 86, "Treatment", { fs: 9, fill: RED, weight: 700 }) +
          t(200, 14, "OR = (p_T/(1−p_T)) / (p_K/(1−p_K)) = 1,61", { fs: 10, fill: INK, weight: 700 })
        );
      },

      /* ---- Power: H0 vs H1, Power-Bereich ---- */
      power: function () {
        function bellY(cx, x) { var z = (x - cx) / 12; return 70 - 36 * Math.exp(-(z * z) / 2); }
        function bellPath(cx) { var p = ""; for (var i = 0; i <= 60; i++) { var x = cx - 70 + i * 2.33; p += (i === 0 ? "M" : "L") + x + " " + bellY(cx, x); } return p; }
        function area(cx, from, to) { var p = "M" + from + " 70 "; var step = (to - from) / 30; for (var i = 0; i <= 30; i++) { var x = from + i * step; p += "L" + x + " " + bellY(cx, x) + " "; } return p + "L" + to + " 70 Z"; }
        var crit = 204, h0 = 150, h1 = 258;
        return wrap(
          axis(70) +
          /* α-Tail (rechts unter H₀) */
          "<path d='" + area(h0, crit, 220) + "' fill='" + RED + "' opacity='0.55'/>" +
          /* β-Bereich (links unter H₁) */
          "<path d='" + area(h1, 188, crit) + "' fill='" + AXIS + "' opacity='0.55'/>" +
          /* Power (rechts unter H₁) */
          "<path d='" + area(h1, crit, 328) + "' fill='" + RED + "' opacity='0.3'/>" +
          "<path d='" + bellPath(h0) + "' fill='none' stroke='" + INK + "' stroke-width='1.5'/>" +
          "<path d='" + bellPath(h1) + "' fill='none' stroke='" + INK + "' stroke-width='1.5'/>" +
          /* Schwelle c */
          "<line x1='" + crit + "' y1='14' x2='" + crit + "' y2='70' stroke='" + INK + "' stroke-width='1.5' stroke-dasharray='3 3'/>" +
          t(crit, 11, "Schwelle c", { fs: 9, fill: INK, weight: 700 }) +
          /* H₀ / H₁ */
          t(h0, 30, "H₀", { fs: 11, fill: INK, weight: 700 }) +
          t(h1, 30, "H₁", { fs: 11, fill: INK, weight: 700 }) +
          /* α-Label */
          t(212, 60, "α", { fs: 13, fill: "#fff", weight: 700, anchor: "start" }) +
          t(218, 84, "α (Fehler 1. Art)", { fs: 9, fill: RED, weight: 700, anchor: "start" }) +
          /* β-Label */
          t(196, 60, "β", { fs: 13, fill: "#fff", weight: 700, anchor: "end" }) +
          t(190, 84, "β (Fehler 2. Art)", { fs: 9, fill: AXIS, weight: 700, anchor: "end" }) +
          /* Power */
          t(290, 56, "1 − β", { fs: 11, fill: RED, weight: 700 }) +
          t(290, 70, "= Power", { fs: 9, fill: RED, weight: 700 })
        );
      },

      /* ---- Model fit ---- */
      modelFit: function () { return F.rSquared(); },

      /* ---- Risk Difference: Differenz zweier Anteile ---- */
      riskDifference: function () { return F.effect(); },

      /* ---- Power-Synonym ---- */
      statisticalValidity: function () { return F.power(); },

      /* ---- Validität / Objektivität / Reliabilität: Dartboard ---- */
      _dart: function (mode) {
        var cx = 204, cy = 44;
        var rings = "";
        for (var i = 4; i >= 1; i--) {
          rings += "<circle cx='" + cx + "' cy='" + cy + "' r='" + (i * 9) + "' fill='" + (i % 2 ? "#fff" : GREY) + "' opacity='0.6' stroke='" + AXIS + "' stroke-width='0.5'/>";
        }
        rings += "<circle cx='" + cx + "' cy='" + cy + "' r='3' fill='" + RED + "'/>";
        var dots = "";
        var pos;
        if (mode === "valid") { pos = [[200, 42], [206, 40], [208, 46], [202, 48], [204, 44]]; }
        else if (mode === "reliable") { pos = [[225, 30], [228, 33], [223, 33], [226, 36], [229, 30]]; }
        else { pos = [[204, 42]]; }
        for (var i = 0; i < pos.length; i++) dots += dot(pos[i][0], pos[i][1], 3.5, INK);
        /* Zentrum-Label */
        var legend =
          "<line x1='270' y1='" + cy + "' x2='240' y2='" + cy + "' stroke='" + RED + "' stroke-width='1'/>" +
          t(274, cy + 3, "θ wahr", { fs: 9, fill: RED, weight: 700, anchor: "start" });
        /* Treffer-Label (zum ersten Punkt) */
        var fx = pos[0][0], fy = pos[0][1];
        var tx = mode === "reliable" ? 320 : 134, ty = mode === "reliable" ? 30 : 30;
        legend +=
          "<line x1='" + (fx) + "' y1='" + fy + "' x2='" + tx + "' y2='" + ty + "' stroke='" + INK + "' stroke-width='1'/>" +
          t(tx, ty - 2, mode === "objective" ? "Messung" : "Messungen θ̂", { fs: 9, fill: INK, weight: 700, anchor: mode === "reliable" ? "start" : "end" });
        return wrap(rings + dots + legend + t(cx, 84, mode === "valid" ? "präzise und zentral (valide)" : mode === "reliable" ? "präzise, aber daneben (reliabel, nicht valide)" : "neutral durchgeführt (objektiv)", { fs: 10, fill: AXIS }));
      },

      /* ---- Quote/Interview ---- */
      quote: function () {
        return wrap(
          "<rect x='80' y='18' width='248' height='52' rx='4' fill='" + GREY + "' opacity='0.4' stroke='" + AXIS + "' stroke-width='1'/>" +
          "<text x='92' y='52' font-family='Instrument Serif, serif' font-size='38' fill='" + RED + "' font-weight='700'>“</text>" +
          t(170, 38, "Schaffe ich es?", { fs: 12, fill: INK, anchor: "start" }) +
          t(170, 56, ", I07, Pendlerin, 42", { fs: 10, fill: AXIS, anchor: "start" })
        );
      },

      /* ---- Fokusgruppe: Kreis mit Punkten ---- */
      focusgroup: function () {
        var dots = "", cx = 204, cy = 44, r = 26;
        var roles = ["Pendlerin", "Geschäft", "Familie", "Senior", "Studi", "Wenig-Nutzer"];
        for (var i = 0; i < 6; i++) {
          var a = (i / 6) * Math.PI * 2;
          var px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r;
          dots += dot(px, py, 6, RED, 0.85);
          /* Rollen-Label außen */
          var lx = cx + Math.cos(a) * (r + 28), ly = cy + Math.sin(a) * (r + 18);
          dots += t(lx, ly, roles[i], { fs: 8, fill: AXIS, weight: 700 });
        }
        dots += "<circle cx='" + cx + "' cy='" + cy + "' r='5' fill='" + INK + "'/>";
        dots += t(cx, cy + 2, "M", { fs: 8, fill: "#fff", weight: 700 });
        return wrap(dots + t(cx - 38, cy - 38, "Moderation", { fs: 8, fill: INK, weight: 700, anchor: "end" }) + t(cx, 86, "6–8 Teilnehmende · 60–90 min · moderiert", { fs: 9, fill: AXIS, weight: 700 }));
      },

      /* ---- Ethnographie: Feldsetting ---- */
      ethnography: function () {
        return wrap(
          "<rect x='40' y='20' width='328' height='44' fill='none' stroke='" + AXIS + "' stroke-width='1' stroke-dasharray='4 3'/>" +
          dot(80, 42, 4, INK, 0.6) + dot(110, 38, 4, INK, 0.6) + dot(145, 50, 4, INK, 0.6) + dot(200, 35, 4, INK, 0.6) + dot(245, 48, 4, INK, 0.6) + dot(290, 40, 4, INK, 0.6) + dot(330, 46, 4, INK, 0.6) +
          dot(180, 42, 6, RED) +
          t(180, 30, "Forscherin", { fs: 10, fill: RED, weight: 700 }) +
          t(204, 80, "Beobachten im Feld", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Inhaltsanalyse: codierte Textzeilen ---- */
      contentAnalysis: function () {
        var rows = "";
        for (var i = 0; i < 4; i++) {
          var y = 22 + i * 13;
          rows += "<rect x='40' y='" + y + "' width='160' height='6' fill='" + GREY + "'/>";
          rows += "<rect x='210' y='" + y + "' width='38' height='6' fill='" + (i % 2 ? RED : INK) + "'/>";
          rows += "<rect x='258' y='" + y + "' width='50' height='6' fill='" + AXIS + "' opacity='0.5'/>";
        }
        return wrap(
          rows +
          /* Spalten-Header */
          t(120, 14, "Beschwerdetext", { fs: 9, fill: AXIS, weight: 700 }) +
          t(229, 14, "Code", { fs: 9, fill: INK, weight: 700 }) +
          t(283, 14, "Kategorie", { fs: 9, fill: AXIS, weight: 700 }) +
          /* Beispiel-Annotation */
          "<path d='M 248 30 L 280 30' stroke='" + AXIS + "' stroke-width='0.8'/>" +
          t(320, 30, "→ Anschlussverlust", { fs: 9, fill: RED, weight: 700, anchor: "start" }) +
          t(320, 43, "→ Komfortlücke", { fs: 9, fill: INK, weight: 700, anchor: "start" }) +
          t(204, 86, "1.200 Tickets · κ = .78", { fs: 9, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Tagebuchstudie: timeline ---- */
      diaryStudy: function () {
        var line = "<line x1='40' y1='44' x2='368' y2='44' stroke='" + AXIS + "' stroke-width='1.5'/>";
        var marks = "";
        for (var i = 0; i < 8; i++) {
          var x = 50 + i * 41;
          marks += "<line x1='" + x + "' y1='38' x2='" + x + "' y2='50' stroke='" + (i % 2 ? RED : INK) + "' stroke-width='2'/>";
          marks += t(x, i % 2 ? 28 : 64, "T" + (i + 1), { fs: 9, fill: i % 2 ? RED : INK });
        }
        return wrap(line + marks + t(204, 84, "Eintrag pro Tag", { fs: 10, fill: AXIS }));
      },

      /* ---- Think-aloud: Aufgabe + Sprechblase ---- */
      thinkAloud: function () {
        return wrap(
          "<rect x='40' y='28' width='120' height='32' rx='3' fill='" + GREY + "' opacity='0.4' stroke='" + AXIS + "'/>" +
          t(100, 44, "Aufgabe", { fs: 10, fill: INK, weight: 700 }) +
          t(100, 56, "Verbindung buchen", { fs: 9, fill: AXIS }) +
          t(100, 18, "in der App", { fs: 9, fill: AXIS, weight: 700 }) +
          "<path d='M 168 44 L 190 38 L 190 50 Z' fill='" + RED + "'/>" +
          "<rect x='190' y='20' width='170' height='48' rx='4' fill='" + RED + "' opacity='0.12' stroke='" + RED + "'/>" +
          t(275, 34, "„Welche Variante", { fs: 10, fill: RED, weight: 700 }) +
          t(275, 46, "nehme ich denn jetzt?“", { fs: 10, fill: RED, weight: 700 }) +
          t(275, 60, "→ Barriere: Entscheidung", { fs: 9, fill: INK, weight: 700 }) +
          t(204, 84, "Vorgehen + lautes Denken simultan", { fs: 9, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Sättigung: Lernkurve flacht ab ---- */
      saturation: function () {
        var p = "M 30 70";
        for (var i = 0; i <= 30; i++) {
          var x = 30 + i * 11.6;
          var y = 70 - 50 * (1 - Math.exp(-i / 6));
          p += " L " + x + " " + y;
        }
        return wrap(axis(75) + "<path d='" + p + "' fill='none' stroke='" + RED + "' stroke-width='2.5'/>" + t(40, 22, "Erkenntniszuwachs", { fs: 10, fill: AXIS, anchor: "start" }) + t(360, 86, "Fallzahl →", { fs: 10, fill: AXIS, anchor: "end" }) + "<line x1='250' y1='22' x2='370' y2='22' stroke='" + INK + "' stroke-width='1.5' stroke-dasharray='3 3'/>" + t(310, 16, "Sättigung", { fs: 10, fill: INK, weight: 700 }));
      },

      /* ---- Theoretical Sampling: drei kontrastierende Fälle ---- */
      theoretical: function () {
        return wrap(
          dot(90, 44, 9, INK, 0.85) + t(90, 80, "typisch", { fs: 10, fill: AXIS }) +
          dot(204, 44, 9, RED, 0.85) + t(204, 80, "Kontrast", { fs: 10, fill: RED, weight: 700 }) +
          dot(318, 44, 9, AXIS, 0.8) + t(318, 80, "Negativfall", { fs: 10, fill: AXIS }) +
          "<line x1='98' y1='44' x2='195' y2='44' stroke='" + INK + "' stroke-width='1' stroke-dasharray='3 3'/>" +
          "<line x1='213' y1='44' x2='310' y2='44' stroke='" + INK + "' stroke-width='1' stroke-dasharray='3 3'/>" +
          t(204, 20, "gezielte Fallauswahl", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Reflexivität: Selbstbezugs-Loop ---- */
      reflexivity: function () {
        return wrap(
          "<circle cx='160' cy='44' r='22' fill='none' stroke='" + INK + "' stroke-width='2'/>" +
          t(160, 48, "Feld", { fs: 11, fill: INK, weight: 700 }) +
          "<circle cx='260' cy='44' r='22' fill='none' stroke='" + RED + "' stroke-width='2'/>" +
          t(260, 48, "Ich", { fs: 11, fill: RED, weight: 700 }) +
          "<path d='M 184 36 Q 210 22 234 36' fill='none' stroke='" + AXIS + "' stroke-width='1.5'/><polygon points='234,36 226,32 226,40' fill='" + AXIS + "'/>" +
          "<path d='M 234 52 Q 210 66 184 52' fill='none' stroke='" + AXIS + "' stroke-width='1.5'/><polygon points='184,52 192,48 192,56' fill='" + AXIS + "'/>" +
          t(204, 84, "Position wirkt auf Beobachtung", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Triangulation: 3-corner Dreieck (Bahn-Beispiel) ---- */
      triangulation: function () {
        return wrap(
          "<polygon points='204,18 80,70 328,70' fill='none' stroke='" + INK + "' stroke-width='2'/>" +
          dot(204, 18, 8, RED) + dot(80, 70, 8, INK) + dot(328, 70, 8, AXIS) +
          /* Datenquellen oben */
          t(204, 11, "Interviews", { fs: 10, fill: RED, weight: 700 }) +
          t(75, 84, "Bottom-2-Box", { fs: 10, fill: INK, weight: 700, anchor: "start" }) +
          t(333, 84, "Tickets", { fs: 10, fill: AXIS, weight: 700, anchor: "end" }) +
          /* Frage in der Mitte */
          t(204, 50, "Wo bricht Vertrauen?", { fs: 10, fill: INK, weight: 700 }) +
          t(204, 62, "(eine Frage, drei Datenarten)", { fs: 9, fill: AXIS })
        );
      },

      /* ---- Joint Display: 2-col matrix ---- */
      jointDisplay: function () {
        return wrap(
          "<rect x='40' y='20' width='150' height='52' fill='none' stroke='" + INK + "' stroke-width='1.5'/>" +
          "<rect x='218' y='20' width='150' height='52' fill='none' stroke='" + INK + "' stroke-width='1.5'/>" +
          t(115, 38, "QUANT-Befund", { fs: 11, fill: INK, weight: 700 }) +
          t(115, 58, "Bottom-2 = 42%", { fs: 10, fill: INK }) +
          t(293, 38, "QUAL-Befund", { fs: 11, fill: RED, weight: 700 }) +
          t(293, 58, "„Anschlussangst“", { fs: 10, fill: RED }) +
          "<path d='M 190 46 L 218 46' stroke='" + AXIS + "' stroke-width='1.5'/><polygon points='218,46 212,43 212,49' fill='" + AXIS + "'/>" +
          t(204, 84, "in einer Matrix gegenüberstellen", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Meta-Inferenz: Zwei Pfade fusionieren ---- */
      metaInference: function () {
        return wrap(
          "<rect x='40' y='18' width='90' height='22' fill='" + INK + "'/>" + t(85, 33, "QUANT", { fs: 10, fill: "#fff", weight: 700 }) +
          "<rect x='40' y='48' width='90' height='22' fill='" + RED + "'/>" + t(85, 63, "QUAL", { fs: 10, fill: "#fff", weight: 700 }) +
          "<path d='M 130 29 L 200 44' stroke='" + AXIS + "' stroke-width='1.5'/>" +
          "<path d='M 130 59 L 200 44' stroke='" + AXIS + "' stroke-width='1.5'/>" +
          "<rect x='200' y='28' width='130' height='32' fill='none' stroke='" + INK + "' stroke-width='2'/>" +
          t(265, 48, "Meta-Inferenz", { fs: 11, fill: INK, weight: 700 }) +
          t(204, 84, "Aussage über beide hinaus", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Sequential designs ---- */
      _seq: function (a, b, color1, color2) {
        var artifact1 = a === "QUANT" ? "Bottom-2 = 42%" : "„Anschlussangst“";
        var artifact2 = b === "QUANT" ? "n = 2.500 Survey" : "12 Interviews";
        return wrap(
          "<rect x='40' y='32' width='90' height='28' fill='" + color1 + "'/>" + t(85, 50, a, { fs: 11, fill: "#fff", weight: 700 }) +
          t(85, 76, artifact1, { fs: 9, fill: color1, weight: 700 }) +
          "<path d='M 140 46 L 180 46' stroke='" + INK + "' stroke-width='2'/><polygon points='180,46 172,42 172,50' fill='" + INK + "'/>" +
          t(160, 40, "speist", { fs: 9, fill: AXIS, weight: 700 }) +
          "<rect x='185' y='32' width='90' height='28' fill='" + color2 + "'/>" + t(230, 50, b, { fs: 11, fill: "#fff", weight: 700 }) +
          t(230, 76, artifact2, { fs: 9, fill: color2, weight: 700 }) +
          "<path d='M 285 46 L 320 46' stroke='" + INK + "' stroke-width='2'/><polygon points='320,46 312,42 312,50' fill='" + INK + "'/>" +
          t(304, 40, "stützt", { fs: 9, fill: AXIS, weight: 700 }) +
          "<rect x='325' y='30' width='44' height='32' fill='none' stroke='" + INK + "' stroke-width='2'/>" + t(347, 50, "◊", { fs: 14, fill: INK, weight: 700 }) +
          t(347, 76, "Entscheidung", { fs: 9, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Convergent parallel: 2 Tracks parallel ---- */
      convergentParallel: function () {
        return wrap(
          "<rect x='40' y='20' width='180' height='22' fill='" + INK + "'/>" + t(130, 35, "QUANT · n = 2.500", { fs: 11, fill: "#fff", weight: 700 }) +
          "<rect x='40' y='48' width='180' height='22' fill='" + RED + "'/>" + t(130, 63, "QUAL · 12 Interviews", { fs: 11, fill: "#fff", weight: 700 }) +
          "<path d='M 220 31 L 260 44' stroke='" + AXIS + "' stroke-width='2'/>" +
          "<path d='M 220 59 L 260 44' stroke='" + AXIS + "' stroke-width='2'/>" +
          "<rect x='260' y='30' width='110' height='30' fill='none' stroke='" + INK + "' stroke-width='2'/>" +
          t(315, 44, "Joint Display", { fs: 10, fill: INK, weight: 700 }) +
          t(315, 56, "+ Meta-Inferenz", { fs: 9, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Sampling-Auswahl ---- */
      selection: function () {
        var dots = "";
        for (var i = 0; i < 8; i++) {
          for (var j = 0; j < 3; j++) {
            var x = 60 + i * 35, y = 26 + j * 16;
            var picked = (i + j) % 3 === 0;
            dots += dot(x, y, 4, picked ? RED : GREY, picked ? 1 : 0.5);
          }
        }
        return wrap(dots + t(204, 84, "Auswahl bestimmt Reichweite", { fs: 10, fill: AXIS }));
      },

      /* ---- Selektionsbias ---- */
      selectionBias: function () {
        var dots = "";
        for (var i = 0; i < 8; i++) {
          for (var j = 0; j < 3; j++) {
            var x = 60 + i * 35, y = 26 + j * 16;
            var picked = i < 4;
            dots += dot(x, y, 4, picked ? RED : GREY, picked ? 1 : 0.45);
          }
        }
        return wrap(dots + t(140, 84, "ausgewählt", { fs: 10, fill: RED, weight: 700 }) + t(290, 84, "ignoriert", { fs: 10, fill: AXIS }));
      },

      /* ---- Nonresponse: Bar mit fehlendem Anteil ---- */
      nonresponse: function () {
        return wrap(
          "<rect x='60' y='34' width='180' height='30' fill='" + INK + "'/>" +
          "<rect x='240' y='34' width='110' height='30' fill='none' stroke='" + AXIS + "' stroke-width='1.5' stroke-dasharray='3 3'/>" +
          t(150, 24, "antwortet", { fs: 11, fill: INK, weight: 700 }) +
          t(295, 24, "antwortet nicht", { fs: 11, fill: AXIS, weight: 700 }) +
          t(204, 84, "Antwortbias ≠ Antwortquote", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Random assignment ---- */
      randomAssignment: function () {
        return wrap(
          "<rect x='150' y='14' width='108' height='22' fill='" + INK + "'/>" + t(204, 29, "Pool", { fs: 11, fill: "#fff", weight: 700 }) +
          "<path d='M 175 36 L 110 58' stroke='" + AXIS + "' stroke-width='1.5' stroke-dasharray='3 3'/><polygon points='110,58 118,53 118,61' fill='" + AXIS + "'/>" +
          "<path d='M 233 36 L 298 58' stroke='" + AXIS + "' stroke-width='1.5' stroke-dasharray='3 3'/><polygon points='298,58 290,53 290,61' fill='" + AXIS + "'/>" +
          "<rect x='70' y='58' width='80' height='22' fill='" + GREY + "'/>" + t(110, 73, "Kontrolle", { fs: 10, fill: INK, weight: 700 }) +
          "<rect x='258' y='58' width='80' height='22' fill='" + RED + "'/>" + t(298, 73, "Treatment", { fs: 10, fill: "#fff", weight: 700 }) +
          t(204, 50, "zufällig", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Control group ---- */
      controlGroup: function () { return F.randomAssignment(); },

      /* ---- Internal Validity: pfeil sauber innerhalb Experiment ---- */
      internalValidity: function () {
        return wrap(
          "<rect x='40' y='18' width='328' height='52' fill='none' stroke='" + INK + "' stroke-width='2'/>" +
          t(72, 36, "Treatment", { fs: 10, fill: INK, weight: 700, anchor: "start" }) +
          "<path d='M 130 44 L 280 44' stroke='" + RED + "' stroke-width='2.5'/><polygon points='280,44 272,40 272,48' fill='" + RED + "'/>" +
          t(204, 38, "kausal?", { fs: 11, fill: RED, weight: 700 }) +
          t(330, 36, "Effekt", { fs: 10, fill: INK, weight: 700, anchor: "end" }) +
          t(204, 86, "innerhalb der Studie", { fs: 10, fill: AXIS })
        );
      },

      /* ---- External Validity: Generalisierung ---- */
      externalValidity: function () {
        return wrap(
          "<rect x='40' y='30' width='80' height='32' fill='" + INK + "'/>" + t(80, 50, "Studie", { fs: 11, fill: "#fff", weight: 700 }) +
          "<path d='M 125 46 L 175 46' stroke='" + AXIS + "' stroke-width='2'/><polygon points='175,46 167,42 167,50' fill='" + AXIS + "'/>" +
          "<rect x='180' y='22' width='70' height='20' fill='none' stroke='" + RED + "' stroke-width='1.5'/>" + t(215, 36, "andere Stadt", { fs: 9, fill: RED }) +
          "<rect x='260' y='22' width='80' height='20' fill='none' stroke='" + RED + "' stroke-width='1.5'/>" + t(300, 36, "anderes Jahr", { fs: 9, fill: RED }) +
          "<rect x='180' y='52' width='70' height='20' fill='none' stroke='" + RED + "' stroke-width='1.5'/>" + t(215, 66, "andere Gruppe", { fs: 9, fill: RED }) +
          "<rect x='260' y='52' width='80' height='20' fill='none' stroke='" + RED + "' stroke-width='1.5'/>" + t(300, 66, "Praxisfeld", { fs: 9, fill: RED })
        );
      },

      /* ---- Mechanism: Kondition → Prozess → Effekt ---- */
      mechanism: function () {
        return wrap(
          "<rect x='30' y='28' width='84' height='38' fill='none' stroke='" + INK + "' stroke-width='1.5'/>" +
          t(72, 44, "Bedingung", { fs: 10, fill: INK, weight: 700 }) +
          t(72, 58, "Anschluss verloren", { fs: 9, fill: AXIS }) +
          "<path d='M 118 47 L 158 47' stroke='" + AXIS + "' stroke-width='1.5'/><polygon points='158,47 150,43 150,51' fill='" + AXIS + "'/>" +
          "<rect x='162' y='28' width='84' height='38' fill='" + RED + "' opacity='0.18' stroke='" + RED + "'/>" +
          t(204, 44, "Mechanismus", { fs: 10, fill: RED, weight: 700 }) +
          t(204, 58, "Informationslücke", { fs: 9, fill: RED }) +
          "<path d='M 250 47 L 290 47' stroke='" + AXIS + "' stroke-width='1.5'/><polygon points='290,47 282,43 282,51' fill='" + AXIS + "'/>" +
          "<rect x='294' y='28' width='84' height='38' fill='none' stroke='" + INK + "' stroke-width='1.5'/>" +
          t(336, 44, "Effekt", { fs: 10, fill: INK, weight: 700 }) +
          t(336, 58, "Buchungsabbruch", { fs: 9, fill: AXIS }) +
          t(204, 84, "Bedingung → Mechanismus → Effekt", { fs: 10, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Market Size: Großzahl-Indikator ---- */
      marketSize: function () {
        return wrap(
          "<rect x='60' y='34' width='30' height='40' fill='" + GREY + "'/>" +
          "<rect x='100' y='26' width='30' height='48' fill='" + GREY + "'/>" +
          "<rect x='140' y='14' width='30' height='60' fill='" + RED + "'/>" +
          "<rect x='180' y='22' width='30' height='52' fill='" + GREY + "'/>" +
          "<rect x='220' y='38' width='30' height='36' fill='" + GREY + "'/>" +
          "<rect x='260' y='46' width='30' height='28' fill='" + GREY + "'/>" +
          "<rect x='300' y='54' width='30' height='20' fill='" + GREY + "'/>" +
          t(155, 8, "kritisches Segment", { fs: 10, fill: RED, weight: 700 }) +
          t(204, 86, "Wie groß ist das Problem?", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Erwartungs-Erlebnis-Gap ---- */
      expectationGap: function () {
        return wrap(
          "<rect x='60' y='22' width='100' height='44' fill='" + GREY + "'/>" +
          t(110, 38, "Erwartung", { fs: 11, fill: INK, weight: 700 }) +
          t(110, 56, "Bottom-2 = 18%", { fs: 9, fill: INK }) +
          "<rect x='248' y='40' width='100' height='26' fill='" + RED + "'/>" +
          t(298, 56, "Erlebnis", { fs: 11, fill: "#fff", weight: 700 }) +
          t(298, 16, "Bottom-2 = 42%", { fs: 10, fill: RED, weight: 700 }) +
          /* Gap arrow */
          "<path d='M 165 44 L 240 44' stroke='" + INK + "' stroke-width='2' stroke-dasharray='4 3'/><polygon points='240,44 232,40 232,48' fill='" + INK + "'/>" +
          t(204, 38, "Gap = 24 pp", { fs: 11, fill: INK, weight: 700 }) +
          t(204, 84, "Qualität = Erwartung − Erlebnis (SERVQUAL-Logik)", { fs: 9, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Kontaktmoment / Uno-actu ---- */
      contactMoment: function () {
        return wrap(
          "<rect x='40' y='30' width='100' height='28' fill='" + GREY + "'/>" + t(90, 48, "Produktion", { fs: 10, fill: INK, weight: 700 }) +
          "<rect x='268' y='30' width='100' height='28' fill='" + GREY + "'/>" + t(318, 48, "Nutzung", { fs: 10, fill: INK, weight: 700 }) +
          "<rect x='160' y='30' width='88' height='28' fill='" + RED + "'/>" + t(204, 48, "Uno actu", { fs: 11, fill: "#fff", weight: 700 }) +
          t(204, 84, "fallen im Service zusammen", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Kontaktvarianz ---- */
      contactVariance: function () {
        var bars = "", vals = [44, 22, 56, 30, 50, 18, 60, 36];
        var labels = ["Mo 7h", "Di 14h", "Mi 8h", "Do 19h", "Fr 7h", "Sa 22h", "So 9h", "Mo 18h"];
        for (var i = 0; i < 8; i++) {
          var x = 60 + i * 36, h = vals[i];
          bars += "<rect x='" + x + "' y='" + (74 - h) + "' width='24' height='" + h + "' fill='" + (i === 4 ? RED : INK) + "' opacity='" + (i === 4 ? 1 : 0.4) + "'/>";
          bars += t(x + 12, 84, labels[i], { fs: 8, fill: AXIS });
        }
        return wrap(bars + t(204, 14, "Bottom-2 pro Touchpoint × Situation", { fs: 10, fill: RED, weight: 700 }));
      },

      /* ---- Tracking / Verhaltensspur ---- */
      tracking: function () {
        var line = "<path d='M 40 44 L 80 44 L 80 30 L 130 30 L 130 56 L 180 56 L 180 38 L 230 38 L 230 50 L 280 50 L 280 28 L 330 28 L 330 44 L 368 44' fill='none' stroke='" + RED + "' stroke-width='2'/>";
        return wrap(line + dot(80, 30, 4, INK) + dot(180, 38, 4, INK) + dot(280, 28, 4, INK) + t(204, 84, "Klick · Scroll · Abbruch · Weg", { fs: 10, fill: AXIS }));
      },

      /* ---- Non-reactive ---- */
      nonreactive: function () {
        return wrap(
          "<rect x='40' y='20' width='328' height='42' fill='none' stroke='" + AXIS + "' stroke-width='1' stroke-dasharray='4 3'/>" +
          dot(80, 36, 4, INK, 0.6) + dot(120, 50, 4, INK, 0.6) + dot(170, 40, 4, INK, 0.6) + dot(220, 32, 4, INK, 0.6) + dot(270, 46, 4, INK, 0.6) + dot(320, 38, 4, INK, 0.6) +
          "<rect x='200' y='65' width='8' height='8' fill='" + RED + "'/>" + t(204, 84, "Auge ohne Eingriff", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Operational ---- */
      operational: function () {
        var rows = "";
        for (var i = 0; i < 5; i++) {
          rows += "<rect x='50' y='" + (20 + i * 10) + "' width='200' height='6' fill='" + GREY + "' opacity='0.7'/>";
          rows += "<rect x='258' y='" + (20 + i * 10) + "' width='30' height='6' fill='" + INK + "'/>";
        }
        return wrap(rows + t(310, 50, "→ Frage", { fs: 11, fill: RED, weight: 700, anchor: "start" }) + t(204, 86, "Logs neu interpretieren", { fs: 10, fill: AXIS }));
      },

      /* ---- Privacy ---- */
      privacy: function () {
        var dots = "";
        for (var i = 0; i < 12; i++) dots += dot(60 + i * 26, 50, 4, INK, 0.4);
        dots += "<rect x='154' y='28' width='100' height='42' fill='none' stroke='" + RED + "' stroke-width='1.5' stroke-dasharray='3 3'/>";
        return wrap(dots + t(204, 22, "Aggregation", { fs: 10, fill: RED, weight: 700 }) + t(204, 86, "Gruppe statt Einzelfall", { fs: 10, fill: AXIS }));
      },

      /* ---- Secondary ---- */
      secondary: function () {
        return wrap(
          "<rect x='40' y='24' width='90' height='42' fill='" + GREY + "' opacity='0.5'/>" + t(85, 50, "alte Frage", { fs: 10, fill: AXIS }) +
          "<path d='M 134 46 L 184 46' stroke='" + INK + "' stroke-width='1.5'/><polygon points='184,46 176,42 176,50' fill='" + INK + "'/>" +
          "<rect x='188' y='24' width='90' height='42' fill='" + RED + "' opacity='0.18' stroke='" + RED + "'/>" + t(233, 50, "neue Frage", { fs: 10, fill: RED, weight: 700 }) +
          "<rect x='282' y='24' width='86' height='42' fill='" + INK + "' opacity='0.85'/>" + t(325, 50, "Datensatz", { fs: 10, fill: "#fff", weight: 700 }) +
          t(204, 86, "Daten wiederverwenden", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Stratified ---- */
      stratified: function () {
        var groups = "";
        var colors = [INK, RED, AXIS, "#94a3b8"];
        for (var g = 0; g < 4; g++) {
          for (var i = 0; i < 6; i++) {
            groups += dot(60 + i * 18 + g * 80, 44, 4, colors[g], 0.8);
          }
        }
        return wrap(groups + t(98, 22, "A", { fs: 10, fill: INK, weight: 700 }) + t(178, 22, "B", { fs: 10, fill: RED, weight: 700 }) + t(258, 22, "C", { fs: 10, fill: AXIS, weight: 700 }) + t(338, 22, "D", { fs: 10, fill: "#94a3b8", weight: 700 }) + t(204, 84, "feste Quote pro Schicht", { fs: 10, fill: AXIS }));
      },

      /* ---- Survey: 7-stufige Skala ---- */
      survey: function () { return F.likert(); },

      /* ---- Decision Artifact ---- */
      decisionArtifact: function () {
        return wrap(
          "<rect x='40' y='20' width='100' height='48' fill='none' stroke='" + AXIS + "' stroke-width='1.5'/>" + t(90, 48, "Evidenz", { fs: 11, fill: AXIS, weight: 700 }) +
          "<path d='M 142 44 L 188 44' stroke='" + INK + "' stroke-width='2'/><polygon points='188,44 180,40 180,48' fill='" + INK + "'/>" +
          "<rect x='192' y='20' width='176' height='48' fill='" + RED + "'/>" + t(280, 42, "ROLLOUT", { fs: 11, fill: "#fff", weight: 700 }) +
          t(280, 58, "wenn Δ ≥ 3pp", { fs: 10, fill: "#fff" }) +
          t(204, 84, "Befund → Handlung", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Bayes Prior: Beta-Kurve ---- */
      prior: function () {
        var p = "";
        for (var i = 0; i <= 60; i++) {
          var x = 30 + i * 5.8, t01 = i / 60;
          var y = 70 - 38 * Math.pow(t01, 1.8) * Math.pow(1 - t01, 6);
          p += (i === 0 ? "M" : "L") + x + " " + y;
        }
        return wrap(
          axis(70) +
          "<path d='" + p + "' fill='" + INK + "' opacity='0.2' stroke='" + INK + "' stroke-width='2'/>" +
          /* Erwartungswert der Beta (≈ Lage der Verteilung) */
          tick(102, 36, 70, INK) +
          t(102, 30, "E[θ] = α/(α+β)", { fs: 9, fill: INK, weight: 700 }) +
          t(70, 18, "Beta(α = 9, β = 75)", { fs: 11, fill: INK, weight: 700, anchor: "start" }) +
          /* Achsen-Beschriftung */
          t(50, 86, "θ = 0%", { fs: 9, fill: AXIS, anchor: "start" }) +
          t(204, 86, "Wahrscheinlichkeitsachse θ", { fs: 10, fill: AXIS }) +
          t(358, 86, "θ = 100%", { fs: 9, fill: AXIS, anchor: "end" })
        );
      },

      /* ---- Likelihood ---- */
      likelihood: function () {
        var p = "";
        for (var i = 0; i <= 60; i++) {
          var x = 30 + i * 5.8, t01 = i / 60;
          var y = 70 - 50 * Math.pow(t01, 4) * Math.pow(1 - t01, 12);
          p += (i === 0 ? "M" : "L") + x + " " + y;
        }
        return wrap(
          axis(70) +
          "<path d='" + p + "' fill='" + AXIS + "' opacity='0.18' stroke='" + AXIS + "' stroke-width='2'/>" +
          /* Maximum-Likelihood (y/n als Modus) */
          tick(165, 28, 70, AXIS) +
          t(165, 22, "ML-Schätzer y/n", { fs: 9, fill: AXIS, weight: 700 }) +
          t(204, 18, "L(θ | y = 4, n = 120)", { fs: 11, fill: AXIS, weight: 700, anchor: "middle" }) +
          t(50, 86, "θ = 0%", { fs: 9, fill: AXIS, anchor: "start" }) +
          t(204, 86, "L ∝ θʸ · (1 − θ)ⁿ⁻ʸ", { fs: 10, fill: AXIS, weight: 700 }) +
          t(358, 86, "θ = 100%", { fs: 9, fill: AXIS, anchor: "end" })
        );
      },

      /* ---- Posterior Bayes: 3 Kurven ---- */
      posteriorBayes: function () {
        function curve(a, b, color, opStroke) {
          var p = "";
          for (var i = 0; i <= 60; i++) {
            var x = 30 + i * 5.8, t01 = i / 60;
            var y = 70 - 38 * Math.pow(t01, a) * Math.pow(1 - t01, b);
            p += (i === 0 ? "M" : "L") + x + " " + y;
          }
          return "<path d='" + p + "' fill='none' stroke='" + color + "' stroke-width='2' opacity='" + opStroke + "'/>";
        }
        return wrap(
          axis(70) + curve(1.8, 6, INK, 0.7) + curve(4, 12, AXIS, 0.7) + curve(6, 16, RED, 1) +
          /* Prior, peak ca. x = 90 */
          tick(90, 38, 70, INK) +
          t(60, 14, "Prior · Beta(α, β)", { fs: 10, fill: INK, weight: 700, anchor: "start" }) +
          /* Likelihood, peak ca. x = 165 */
          tick(165, 38, 70, AXIS) +
          t(165, 14, "Likelihood · y, n", { fs: 10, fill: AXIS, weight: 700 }) +
          /* Posterior, peak ca. x = 200 */
          tick(200, 28, 70, RED) +
          t(310, 14, "Posterior · Beta(α+y, β+n−y)", { fs: 10, fill: RED, weight: 700, anchor: "end" }) +
          t(204, 86, "Update: Prior × Likelihood ∝ Posterior", { fs: 10, fill: RED, weight: 700 })
        );
      },

      /* ---- Theta ---- */
      theta: function () {
        return wrap(
          axis(56) +
          tick(220, 22, 70, RED) +
          t(220, 13, "θ wahr (P(Buchung))", { fs: 9, fill: RED, weight: 700 }) +
          t(220, 84, "unbekannt · gesucht", { fs: 9, fill: RED }) +
          dot(140, 56, 7, INK) +
          t(140, 38, "y/n = 4/120", { fs: 10, fill: INK, weight: 700 }) +
          t(140, 84, "beobachtet", { fs: 9, fill: INK, weight: 700 }) +
          "<line x1='148' y1='56' x2='212' y2='56' stroke='" + AXIS + "' stroke-width='1.5' stroke-dasharray='3 3'/>" +
          "<polygon points='212,56 204,52 204,60' fill='" + AXIS + "'/>" +
          t(180, 52, "Inferenz", { fs: 9, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Pseudo counts ---- */
      pseudoCounts: function () {
        return wrap(
          "<rect x='60' y='28' width='140' height='40' fill='" + INK + "' opacity='0.85'/>" +
          t(130, 46, "α = 9", { fs: 14, fill: "#fff", weight: 700 }) +
          t(130, 60, "Pseudo-Erfolge", { fs: 9, fill: "#fff" }) +
          "<rect x='208' y='28' width='140' height='40' fill='" + RED + "'/>" +
          t(278, 46, "β = 75", { fs: 14, fill: "#fff", weight: 700 }) +
          t(278, 60, "Pseudo-Misserfolge", { fs: 9, fill: "#fff" }) +
          t(204, 16, "Prior als virtuelle Beobachtungen", { fs: 10, fill: AXIS, weight: 700 }) +
          t(204, 84, "≈ α + β − 2 = 82 frühere Sessions", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Credible Interval ---- */
      credibleInterval: function () {
        var p = "", inner = "";
        for (var i = 0; i <= 60; i++) {
          var x = 30 + i * 5.8, t01 = i / 60;
          var y = 70 - 40 * Math.pow(t01, 6) * Math.pow(1 - t01, 14);
          p += (i === 0 ? "M" : "L") + x + " " + y;
          if (i >= 18 && i <= 42) inner += (i === 18 ? "M" + x + " 70 L" + x + " " + y : "L" + x + " " + y);
        }
        inner += " L" + (30 + 42 * 5.8) + " 70 Z";
        var lowX = 30 + 18 * 5.8, highX = 30 + 42 * 5.8;
        return wrap(
          axis(70) +
          "<path d='" + inner + "' fill='" + RED + "' opacity='0.45'/>" +
          "<path d='" + p + "' fill='none' stroke='" + INK + "' stroke-width='2'/>" +
          /* Intervallgrenzen */
          "<line x1='" + lowX + "' y1='44' x2='" + lowX + "' y2='70' stroke='" + RED + "' stroke-width='2'/>" +
          "<line x1='" + highX + "' y1='44' x2='" + highX + "' y2='70' stroke='" + RED + "' stroke-width='2'/>" +
          t(lowX, 80, "3,7%", { fs: 9, fill: RED, weight: 700 }) +
          t(highX, 80, "9,7%", { fs: 9, fill: RED, weight: 700 }) +
          /* Bedeutung */
          t(204, 38, "95% Wahrscheinlichkeit", { fs: 10, fill: RED, weight: 700 }) +
          t(204, 18, "Posterior-Verteilung von θ", { fs: 10, fill: INK, weight: 700 }) +
          t(204, 88, "→ θ liegt mit 95% in diesem Bereich", { fs: 9, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Kappa ---- */
      kappa: function () {
        return wrap(
          "<rect x='60' y='20' width='140' height='44' fill='none' stroke='" + INK + "' stroke-width='1.5'/>" + t(130, 14, "Coder A", { fs: 10, fill: INK, weight: 700 }) +
          "<rect x='208' y='20' width='140' height='44' fill='none' stroke='" + RED + "' stroke-width='1.5'/>" + t(278, 14, "Coder B", { fs: 10, fill: RED, weight: 700 }) +
          t(130, 38, "A · B · A · B", { fs: 11, fill: INK }) + t(278, 38, "A · B · A · A", { fs: 11, fill: RED }) +
          /* Übereinstimmungs-Annotationen */
          t(130, 56, "p_o (beobachtet)", { fs: 9, fill: INK, weight: 700 }) +
          t(278, 56, "p_e (Zufall)", { fs: 9, fill: RED, weight: 700 }) +
          t(204, 80, "κ = (p_o − p_e) / (1 − p_e)", { fs: 10, fill: AXIS, weight: 700 })
        );
      },

      /* ---- Krippendorff ---- */
      krippendorff: function () {
        return wrap(
          "<rect x='60' y='20' width='80' height='22' fill='" + INK + "' opacity='0.85'/>" + t(100, 35, "Coder A", { fs: 10, fill: "#fff", weight: 700 }) +
          "<rect x='164' y='20' width='80' height='22' fill='" + INK + "' opacity='0.7'/>" + t(204, 35, "Coder B", { fs: 10, fill: "#fff", weight: 700 }) +
          "<rect x='268' y='20' width='80' height='22' fill='" + INK + "' opacity='0.55'/>" + t(308, 35, "Coder C", { fs: 10, fill: "#fff", weight: 700 }) +
          t(204, 60, "≥ 3 Coder · beliebige Skala · missing OK", { fs: 10, fill: AXIS, weight: 600 }) +
          t(204, 78, "α = 1 − D_o / D_e", { fs: 10, fill: RED, weight: 700 })
        );
      },

      /* ---- Cronbach alpha ---- */
      cronbach: function () {
        var lines = "";
        for (var i = 0; i < 5; i++) lines += "<rect x='60' y='" + (24 + i * 8) + "' width='180' height='4' fill='" + (i === 2 ? RED : INK) + "' opacity='" + (i === 2 ? 1 : 0.5) + "'/>";
        for (var j = 0; j < 5; j++) for (var k = j + 1; k < 5; k++) lines += "<line x1='250' y1='" + (26 + j * 8) + "' x2='280' y2='" + (26 + k * 8) + "' stroke='" + AXIS + "' stroke-width='0.7' opacity='0.5'/>";
        return wrap(lines + t(310, 50, "α = .84", { fs: 13, fill: RED, weight: 700 }) + t(204, 84, "Items hängen zusammen", { fs: 10, fill: AXIS }));
      },

      /* ---- Content / Construct / Criterion Validity ---- */
      contentValidity: function () { return F._dart("valid"); },
      constructValidity: function () { return F._dart("valid"); },
      criterionValidity: function () { return F._dart("valid"); },
      validity: function () { return F._dart("valid"); },
      reliability: function () { return F._dart("reliable"); },
      objective: function () { return F._dart("objective"); },

      /* ---- Negative Cases / Member Check ---- */
      negativeCases: function () {
        var dots = "";
        for (var i = 0; i < 9; i++) dots += dot(50 + i * 30, 50, 5, INK, 0.6);
        dots += "<circle cx='320' cy='50' r='8' fill='" + RED + "'/>";
        return wrap(dots + t(168, 20, "Bestätigende Fälle", { fs: 10, fill: AXIS, anchor: "middle" }) + t(320, 24, "Negativfall", { fs: 10, fill: RED, weight: 700 }) + t(204, 86, "Gegenbelege gezielt suchen", { fs: 10, fill: AXIS }));
      },
      memberCheck: function () {
        return wrap(
          "<rect x='60' y='30' width='100' height='28' fill='" + INK + "'/>" + t(110, 48, "Deutung", { fs: 11, fill: "#fff", weight: 700 }) +
          "<rect x='248' y='30' width='100' height='28' fill='" + RED + "'/>" + t(298, 48, "Befragte", { fs: 11, fill: "#fff", weight: 700 }) +
          "<path d='M 162 38 L 246 38' stroke='" + AXIS + "' stroke-width='1.5'/><polygon points='246,38 238,34 238,42' fill='" + AXIS + "'/>" +
          "<path d='M 246 52 L 162 52' stroke='" + AXIS + "' stroke-width='1.5'/><polygon points='162,52 170,48 170,56' fill='" + AXIS + "'/>" +
          t(204, 84, "Rückkopplung ins Feld", { fs: 10, fill: AXIS })
        );
      },

      /* ---- Representativeness ---- */
      representativeness: function () {
        var dots = "";
        for (var i = 0; i < 30; i++) dots += dot(50 + (i % 10) * 32, 24 + Math.floor(i / 10) * 16, 3, INK, 0.3);
        var picked = [3, 7, 12, 16, 21, 25, 28];
        for (var k = 0; k < picked.length; k++) {
          var p = picked[k];
          dots += dot(50 + (p % 10) * 32, 24 + Math.floor(p / 10) * 16, 4, RED, 1);
        }
        return wrap(dots + t(204, 86, "Stichprobe spiegelt Grundgesamtheit", { fs: 10, fill: AXIS }));
      },

      /* ---- Bias ---- */
      bias: function () { return F.selectionBias(); },

      /* ---- Transparenz / Audit Trail ---- */
      transparency: function () {
        var rows = "";
        for (var i = 0; i < 5; i++) {
          var y = 22 + i * 10;
          rows += "<rect x='40' y='" + y + "' width='12' height='6' fill='" + RED + "'/>";
          rows += "<rect x='58' y='" + y + "' width='280' height='6' fill='" + GREY + "' opacity='0.6'/>";
        }
        return wrap(rows + t(204, 84, "jeder Schritt nachvollziehbar", { fs: 10, fill: AXIS }));
      },
      auditTrail: function () { return F.transparency(); },

      /* ---- Mayring / Coding / Invivo / Analytic / Category ---- */
      mayring: function () {
        return wrap(
          "<rect x='40' y='22' width='84' height='22' fill='" + AXIS + "' opacity='0.6'/>" + t(82, 37, "Material", { fs: 10, fill: "#fff", weight: 700 }) +
          "<path d='M 128 33 L 156 33' stroke='" + INK + "' stroke-width='1.5'/><polygon points='156,33 148,29 148,37' fill='" + INK + "'/>" +
          "<rect x='160' y='22' width='84' height='22' fill='" + INK + "'/>" + t(202, 37, "Code", { fs: 10, fill: "#fff", weight: 700 }) +
          "<path d='M 248 33 L 276 33' stroke='" + INK + "' stroke-width='1.5'/><polygon points='276,33 268,29 268,37' fill='" + INK + "'/>" +
          "<rect x='280' y='22' width='84' height='22' fill='" + RED + "'/>" + t(322, 37, "Kategorie", { fs: 10, fill: "#fff", weight: 700 }) +
          t(204, 84, "regelgeleitet verdichten", { fs: 10, fill: AXIS })
        );
      },
      invivo: function () { return F.quote(); },
      analyticCode: function () {
        return wrap(
          "<rect x='40' y='18' width='60' height='14' fill='" + GREY + "'/>" + t(70, 28, "Zitat", { fs: 9, fill: INK }) +
          "<rect x='40' y='34' width='60' height='14' fill='" + GREY + "'/>" + t(70, 44, "Zitat", { fs: 9, fill: INK }) +
          "<rect x='40' y='50' width='60' height='14' fill='" + GREY + "'/>" + t(70, 60, "Zitat", { fs: 9, fill: INK }) +
          "<path d='M 104 41 L 168 41' stroke='" + AXIS + "' stroke-width='1.5'/><polygon points='168,41 160,37 160,45' fill='" + AXIS + "'/>" +
          "<rect x='172' y='28' width='100' height='28' fill='" + RED + "' opacity='0.85'/>" + t(222, 46, "Code", { fs: 12, fill: "#fff", weight: 700 }) +
          t(204, 84, "Bündelung mit Regel", { fs: 10, fill: AXIS })
        );
      },
      category: function () {
        return wrap(
          dot(80, 30, 5, AXIS, 0.7) + dot(95, 50, 5, AXIS, 0.7) + dot(110, 32, 5, AXIS, 0.7) + dot(120, 52, 5, AXIS, 0.7) + dot(80, 70, 5, AXIS, 0.7) +
          "<rect x='62' y='18' width='80' height='62' fill='none' stroke='" + RED + "' stroke-width='2' stroke-dasharray='4 3'/>" +
          t(102, 86, "Kategorie", { fs: 10, fill: RED, weight: 700 }) +
          "<path d='M 152 50 L 198 50' stroke='" + INK + "' stroke-width='1.5'/><polygon points='198,50 190,46 190,54' fill='" + INK + "'/>" +
          t(280, 46, "interpretierbares", { fs: 10, fill: INK, weight: 700 }) + t(280, 60, "Muster", { fs: 10, fill: INK, weight: 700 })
        );
      },

      /* ---- Design Concept ---- */
      designConcept: function () {
        return wrap(
          "<rect x='40' y='22' width='90' height='44' fill='" + GREY + "'/>" + t(85, 50, "Kategorie", { fs: 10, fill: INK, weight: 700 }) +
          "<path d='M 134 46 L 180 46' stroke='" + INK + "' stroke-width='2'/><polygon points='180,46 172,42 172,50' fill='" + INK + "'/>" +
          "<polygon points='184,22 280,46 184,70' fill='" + RED + "'/>" +
          t(220, 50, "Begriff", { fs: 11, fill: "#fff", weight: 700 }) +
          "<path d='M 284 46 L 320 46' stroke='" + INK + "' stroke-width='2'/><polygon points='320,46 312,42 312,50' fill='" + INK + "'/>" +
          t(348, 50, "Design", { fs: 10, fill: INK, weight: 700 }) +
          t(204, 86, "Erkenntnis → Gestaltungssprache", { fs: 10, fill: AXIS })
        );
      }
    };
  })();

  /* Mappings auf die Helper-Funktionen, Bilder werden automatisch injiziert. */
  var figureLibrary = {
    distribution: F.distribution, mean: F.mean, dispersion: F.dispersion, segmentation: F.segmentation, effect: F.effect,
    likert: F.likert, survey: F.survey, bottom2: F.bottom2, sampleSize: F.sampleSize,
    confidenceInterval: F.confidenceInterval, pvalue: F.pvalue, cohenD: F.cohenD,
    correlation: F.correlation, rSquared: F.rSquared, oddsRatio: F.oddsRatio, power: F.power,
    modelFit: F.modelFit, riskDifference: F.riskDifference, statisticalValidity: F.statisticalValidity,
    objective: F.objective, reliability: F.reliability, validity: F.validity,
    contentValidity: F.contentValidity, constructValidity: F.constructValidity, criterionValidity: F.criterionValidity,
    cronbach: F.cronbach, kappa: F.kappa, krippendorff: F.krippendorff,
    quote: F.quote, focusgroup: F.focusgroup, ethnography: F.ethnography, contentAnalysis: F.contentAnalysis,
    diaryStudy: F.diaryStudy, thinkAloud: F.thinkAloud, saturation: F.saturation, theoretical: F.theoretical,
    reflexivity: F.reflexivity, triangulation: F.triangulation, jointDisplay: F.jointDisplay, metaInference: F.metaInference,
    explanatorySequential: function () { return F._seq("QUANT", "QUAL", INK_HEX(), RED_HEX()); },
    exploratorySequential: function () { return F._seq("QUAL", "QUANT", RED_HEX(), INK_HEX()); },
    convergentParallel: F.convergentParallel,
    randomAssignment: F.randomAssignment, controlGroup: F.controlGroup,
    internalValidity: F.internalValidity, externalValidity: F.externalValidity,
    mechanism: F.mechanism, marketSize: F.marketSize, decisionArtifact: F.decisionArtifact,
    expectationGap: F.expectationGap, contactMoment: F.contactMoment, contactVariance: F.contactVariance,
    tracking: F.tracking, nonreactive: F.nonreactive, operational: F.operational, privacy: F.privacy, secondary: F.secondary,
    stratified: F.stratified, selection: F.selection, selectionBias: F.selectionBias, nonresponse: F.nonresponse,
    bias: F.bias, transparency: F.transparency, auditTrail: F.auditTrail,
    mayring: F.mayring, invivo: F.invivo, analyticCode: F.analyticCode, category: F.category, designConcept: F.designConcept,
    negativeCases: F.negativeCases, memberCheck: F.memberCheck, representativeness: F.representativeness,
    prior: F.prior, likelihood: F.likelihood, posteriorBayes: F.posteriorBayes, theta: F.theta,
    pseudoCounts: F.pseudoCounts, credibleInterval: F.credibleInterval
  };
  function INK_HEX() { return "#0f172a"; } function RED_HEX() { return "#D9272E"; }

  Object.keys(figureLibrary).forEach(function (k) {
    if (explainers[k] && !explainers[k].figure) {
      try { explainers[k].figure = figureLibrary[k](); } catch (e) { /* skip on render error */ }
    }
  });

  function row(label, value) {
    if (!value) return "";
    var safe = String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;");
    return '<span class="metric-row"><span class="metric-row-label">' + label + '</span><span class="metric-row-body">' + safe + '</span></span>';
  }

  function makePopover(config) {
    var popover = document.createElement("span");
    popover.className = "metric-popover";
    var mini = config.mini || "fit";
    var html =
      '<span class="metric-pop-kicker"></span>' +
      '<strong></strong>' +
      '<span class="metric-explain"></span>';
    if (config.long)    html += row("Mehr", config.long);
    if (config.example) html += row("Beispiel", config.example);
    if (config.formal)  html += '<span class="metric-row metric-row--formal"><span class="metric-row-label">Formal</span><span class="metric-row-body metric-formal">' + String(config.formal).replace(/&/g, "&amp;").replace(/</g, "&lt;") + '</span></span>';
    if (config.figure)  html += '<span class="metric-row metric-row--figure"><span class="metric-row-label">Bild</span><span class="metric-row-body metric-figure">' + config.figure + '</span></span>';
    if (config.position) html += '<span class="metric-pop-position"><b>Warum hier?</b><span></span></span>';
    html += '<em></em>';
    popover.innerHTML = html;
    popover.querySelector(".metric-pop-kicker").textContent = config.cat || "";
    popover.querySelector("strong").textContent = config.name || "";
    popover.querySelector(".metric-explain").textContent = config.tldr || "";
    if (config.position) {
      popover.querySelector(".metric-pop-position span").textContent = String(config.position).replace(/^Position:\s*/i, "");
    }
    popover.querySelector("em").textContent = config.pitfall || "";
    return popover;
  }

  function compact(text) {
    return (text || "").replace(/\s+/g, " ").trim();
  }

  function attachExplainer(element, key) {
    if (!element || !key || !explainers[key]) return;
    if (element.closest(".metric-popover")) return;
    if (element.hasAttribute("data-explain")) return;
    if (!element.classList.contains("metric-chip")) element.classList.add("metric-chip");
    element.setAttribute("data-explain", key);
  }

  function enhanceByText(selector, pairs, labelSelector) {
    Array.from(document.querySelectorAll(selector)).forEach(function (element) {
      var labelNode = labelSelector ? element.querySelector(labelSelector) : element;
      var text = compact(labelNode ? labelNode.textContent : element.textContent);
      pairs.some(function (pair) {
        var needle = pair[0];
        var key = pair[1];
        var mode = pair[2] || "exact";
        var matches = mode === "includes" ? text.indexOf(needle) !== -1 : text === needle;
        if (!matches) return false;
        attachExplainer(element, key);
        return true;
      });
    });
  }

  function enhanceStaticTerms() {
    enhanceByText(".method-card .m-name", [
      ["Standardisierte Befragung", "survey"],
      ["Beobachtung & Tracking", "tracking"],
      ["Experiment", "randomAssignment"],
      ["Sekundärdatenanalyse", "secondary"]
    ]);

    enhanceByText(".tag", [
      ["n = 2.500", "sampleSize"],
      ["CSAT · Likert 1–7", "likert"],
      ["Bottom-2-Box", "bottom2"],
      ["geschichtete Stichprobe", "stratified"],
      ["non-reaktiv", "nonreactive"],
      ["In-App-Tracking", "tracking"],
      ["Betriebsdaten", "operational"],
      ["pseudonymisiert · aggregiert", "privacy"],
      ["n = 12", "qualSampleSize"],
      ["Leitfaden", "guide"],
      ["Sättigung", "saturation"],
      ["Mayring", "mayring"],
      ["teilnehmende Beobachtung", "ethnography"],
      ["Feldtagebuch", "fieldnote"],
      ["go along", "goalong"],
      ["QUANT → qual + A/B-Prüfung", "explanatorySequential"],
      ["erklärend-sequentiell", "explanatorySequential"],
      ["eine Designentscheidung", "decisionArtifact"]
    ]);

    enhanceByText(".method-dot", [
      ["Interview", "interview"],
      ["Critical Incident", "criticalIncident"],
      ["Tagebuchstudie", "diaryStudy"],
      ["Go-along", "goalong"],
      ["Fokusgruppe", "focusgroup"],
      ["Think-aloud", "thinkAloud"],
      ["SERVQUAL", "servqual"],
      ["Netnographie", "netnography"],
      ["Dokumentenanalyse", "documentAnalysis"],
      ["Ethnographie", "ethnography"],
      ["Inhaltsanalyse", "contentAnalysis"]
    ], "b");

    enhanceByText(".qual-evidence-step .evidence-head.qual-evidence-step .code-pill.qual-evidence-step .category-chip.qual-evidence-step.insight-card > div:last-child", [
      ["Original", "quote"],
      ["In-vivo-Code", "invivo"],
      ["„schaffe ich es?“", "invivo"],
      ["Analytischer Code", "analyticCode"],
      ["Anschlussangst", "analyticCode"],
      ["Kategorie", "category"],
      ["Kontrollverlust", "category"],
      ["Entscheidungssicherheit statt nur Zeitinformation.", "designConcept"]
    ]);

    enhanceByText(".quant-proof-value.quant-proof-bars b.blackbox-question.blackbox-core.qual-strength-panel b.warning-metric", [
      ["n = 2.500", "sampleSize"],
      ["Bottom-2 42%", "bottom2"],
      ["Bottom-2 36%", "bottom2"],
      ["Bottom-2 12%", "bottom2"],
      ["Warum sinkt Vertrauen?", "mechanism"],
      ["?", "mechanism"],
      ["Kontrollverlust", "category"],
      ["n = 12 ≠ 31%", "qualSampleSize"]
    ]);

    enhanceByText(".mm-joint-display .joint-head.mm-joint-display b.evidence-stage .stage-label.decision-row .d-q.decision-row .d-a.decision-row .d-method.compare-audit-line span", [
      ["QUAL-Befund", "mechanism"],
      ["QUANT-Befund", "marketSize"],
      ["Integrationsfrage", "jointDisplay"],
      ["Meta-Inferenz", "metaInference"],
      ["Anschlussangst", "mechanism"],
      ["−22 pp Abbruch", "riskDifference"],
      ["Passt Mechanismus zum Effekt?", "jointDisplay"],
      ["Ausrollen oder iterieren", "decisionArtifact"],
      ["QUANT", "marketSize"],
      ["QUAL", "mechanism"],
      ["QUANT A/B", "randomAssignment"],
      ["Begriffe unklar", "interview"],
      ["Zitat → Code", "analyticCode"],
      ["Interview", "interview"],
      ["Transparenz · Sättigung", "transparency"],
      ["Größe unklar", "survey"],
      ["Kennzahl + KI", "confidenceInterval"],
      ["Befragung", "survey"],
      ["Validität · Stichprobe", "constructValidity"],
      ["Wirkung unklar", "randomAssignment"],
      ["Δ + 95%-KI", "confidenceInterval"],
      ["Experiment", "randomAssignment"],
      ["Interne Validität", "internalValidity"],
      ["Transfer unklar", "jointDisplay"],
      ["Joint Display", "jointDisplay"],
      ["Mixed Methods", "metaInference"],
      ["Integration · Meta-Inferenz", "metaInference"],
      ["Frage: Wie viel vs. warum?", "jointDisplay"],
      ["Daten: Zahl vs. Sprache", "marketSize"],
      ["Güte: Validität vs. Transparenz", "constructValidity"]
    ]);

    enhanceByText(".serp-ad-label.sparse-cell-key.sparse-cell-value.tail-label.sparse-question", [
      ["bid cell", "bidcell"],
      ["conv.", "sparseData"],
      ["0-1", "sparseData"],
      ["CVR", "cvr"],
      ["?", "sparseData"],
      ["long tail", "longtail", "includes"],
      ["conversion probability", "cvr", "includes"]
    ]);

    enhanceByText(".transfer-step-title.venture-pill.core-node strong.ir-framework-pill", [
      ["Detect signal", "transferLoop"],
      ["Build frame", "transferLoop"],
      ["Publish thesis", "transferLoop"],
      ["Test fit", "transferLoop"],
      ["Encode", "decisionArtifact"],
      ["workflow design", "agentPipeline"],
      ["knowledge layer", "institutional"],
      ["audit trails", "auditTrail"],
      ["human release", "humanGate"],
      ["Context", "institutional"],
      ["Agents", "agentPipeline"],
      ["Control", "humanGate"],
      ["mean score", "aiReadiness"],
      ["machine-readable standards", "machineReadable"],
      ["programmatic access", "programmaticAccess"],
      ["Discoverability Can agents find it?", "aiReadiness"],
      ["Accessibility Can agents retrieve it?", "programmaticAccess"],
      ["Quality Can agents parse it?", "machineReadable"],
      ["AI invisibility", "aiReadiness"],
      ["Narrative loss", "informationAsymmetry"],
      ["Market effects", "informationAsymmetry"]
    ]);

    enhanceByText(".phase-title.output-file.red", [
      ["Search", "agentPipeline"],
      ["Frame", "decisionArtifact"],
      ["Produce", "agentPipeline"],
      ["Verify", "verification"],
      ["Revise", "humanGate"],
      ["verification_report.md", "verification"],
      ["orchestration_log.md", "auditTrail"],
      ["paper_diff.pdf", "verification"],
      ["01 · research contribution", "orchestration"],
      ["02 · researcher role", "curator"],
      ["03 · scientific control", "accountability"],
      ["Evidence = orchestration trace.", "auditTrail"],
      ["for research", "orchestration"],
      ["for teaching", "orchestration"],
      ["for institutions", "accountability"]
    ]);

    enhanceByText(".bayes-definition-stack span.bayes-definition-stack b.bayes-model-strip span", [
      ["θ", "theta"],
      ["wahre Weiterbuchungsrate", "theta"],
      ["α / β", "pseudoCounts"],
      ["Prior-Conversions / Prior-Abbrüche", "pseudoCounts"],
      ["y / n", "likelihood"],
      ["beobachtete Conversions / Sessions", "likelihood"],
      ["Prior", "prior"],
      ["θ ~ Beta(α, β)", "prior"],
      ["Daten", "likelihood"],
      ["y | θ ~ Binomial(n, θ)", "likelihood"],
      ["Posterior", "posteriorBayes"],
      ["θ | y,n ~ Beta(α+y, β+n−y)", "posteriorBayes"]
    ]);

    enhanceByText(".health-node-title.health-fit-title.closing-cell .panel-title", [
      ["Healthcare Planner", "healthcareCapacity"],
      ["Amsterdam UMC", "healthcareCapacity"],
      ["VU / PersonalAIze", "transferLoop"],
      ["TH Luebeck", "curriculumFit"],
      ["research fit", "transferLoop"],
      ["teaching fit", "curriculumFit"],
      ["campus fit", "curriculumFit"],
      ["Service and market evidence", "curriculumFit"],
      ["Digital service systems", "curriculumFit"],
      ["Student research as decision artifact", "decisionArtifact"]
    ]);

    enhanceByText(".health-fit-title", [
      ["sense", "estimate"],
      ["explain", "mechanism"],
      ["test", "randomAssignment"],
      ["encode", "decisionArtifact"]
    ]);

    enhanceByText(".method-mini-key.method-table b.method-card .panel-label.method-card-title", [
      ["Transparenz", "transparency"],
      ["Nachvollziehbarkeit", "transparency"],
      ["Reflexivität", "reflexivity"],
      ["Sättigung", "saturation"],
      ["Theoretical Sampling", "theoretical"],
      ["Fallkontrast", "negativeCases"],
      ["Cohen’s κ", "kappa"],
      ["Krippendorff’s α", "krippendorff"],
      ["Cronbach’s α", "cronbach"],
      ["Objektivität", "objective"],
      ["Reliabilität", "reliability"],
      ["Validität", "validity"],
      ["Inhaltsvalidität", "contentValidity"],
      ["Konstruktvalidität", "constructValidity"],
      ["Kriteriumsvalidität", "criterionValidity"],
      ["Negative Fälle", "negativeCases"],
      ["Member Check", "memberCheck"],
      ["Grundgesamtheit", "representativeness"],
      ["Auswahl", "selection"],
      ["Nonresponse", "nonresponse"],
      ["Konfidenz", "confidenceInterval"],
      ["Interne Validität", "internalValidity"],
      ["Externe Validität", "externalValidity"],
      ["Statistische Validität", "statisticalValidity"],
      ["n=12 als Prozentzahl", "qualSampleSize"],
      ["n=5.400 als automatisch repräsentativ", "bias"],
      ["Korrelation als Wirkung", "correlation"],
      ["Hohe Reliabilität als Validität", "validity"],
      ["Prozentuale Übereinstimmung", "kappa"],
      ["Konfidenzintervall", "confidenceInterval"],
      ["p-Wert", "pvalue"],
      ["Cohen’s d", "cohenD"],
      ["Korrelation r", "correlation"],
      ["R²", "rSquared"],
      ["Odds Ratio", "oddsRatio"],
      ["Nachvollziehbare Deutung.", "transparency"],
      ["Belastbare Messung.", "validity"],
      ["Begründete Integration.", "metaInference"],
      ["Keine Validitätsgarantie.", "validity"],
      ["Kontext statt Magiegrenze.", "kappa"]
    ]);

    /* ===== v2 erweiterte Verdrahtung: orphan-Chips wiren ===== */

    /* Folie 04, Drei Service-Eigenschaften */
    enhanceByText(".service-logic-top b", [
      ["Erwartung vs. Erlebnis", "expectationGap"],
      ["Kontaktmoment", "contactMoment"],
      ["Kontaktvarianz", "contactVariance"]
    ]);

    /* Folie 10, Pattern-Karten: 4 statistische Erkenntnisformen */
    enhanceByText(".pattern-head", [
      ["01 · Verteilung", "distribution"],
      ["02 · Segment", "segmentation"],
      ["03 · Korrelation", "correlation"],
      ["04 · Effekt", "effect"]
    ]);

    /* Folien 12 / 15 / 21 / 24 / 28, chips mit .metric-label */
    enhanceByText(".metric-chip", [
      /* Folie 12, Gütemaße quantitativ */
      ["Objektivität", "objective"],
      ["Reliabilität", "reliability"],
      ["Validität", "validity"],
      ["Cronbachs α", "cronbach"],
      ["Cronbach's α", "cronbach"],
      ["Fallzahl n", "sampleSize"],
      ["Stichprobenfehler", "samplingError"],
      ["Selektionsbias", "selectionBias"],
      ["Nonresponse", "nonresponse"],
      ["Standardfehler", "standardError"],
      ["95%-KI", "confidenceInterval"],
      ["p-Wert", "pvalue"],
      ["Power", "power"],
      ["Cohen's d", "cohenD"],
      ["Cohen’s d", "cohenD"],
      ["r / R²", "correlation"],
      ["Odds Ratio", "oddsRatio"],
      ["Modellfit", "modelFit"],

      /* Folie 15, Experiment */
      ["Design · Treatment/Kontrolle", "controlGroup"],
      ["Zuweisung · randomisiert", "randomAssignment"],
      ["Setting · Feldexperiment", "fieldExperiment"],

      /* Folie 21, Gütemaße qualitativ */
      ["Theoretical Sampling", "theoretical"],
      ["Sättigung", "saturation"],
      ["Transparenz", "transparency"],
      ["Ankerzitate", "quote"],
      ["Audit Trail", "auditTrail"],
      ["Cohen's κ", "kappa"],
      ["Cohen’s κ", "kappa"],
      ["Krippendorffs α", "krippendorff"],
      ["Krippendorff’s α", "krippendorff"],
      ["Krippendorff's α", "krippendorff"],
      ["Reflexivität", "reflexivity"],
      ["Gegenfälle", "negativeCases"],
      ["Triangulation", "triangulation"],

      /* Folie 24, Inhaltsanalyse */
      ["Korpus · N = 5.400", "corpus"],
      ["Codebildung · ded./ind.", "codingApproach"],
      ["Reliabilität · Doppelkodierung", "reliability"],
      ["Güte · κ = 0,79", "kappa"],

      /* Folie 28, Mixed Methods */
      ["01 · explorativ-sequentiell", "exploratorySequential"],
      ["02 · erklärend-sequentiell", "explanatorySequential"],
      ["03 · konvergent-parallel", "convergentParallel"],
      ["BUILD · Codes → Skala", "buildIntegration"],
      ["EXPLAIN · Muster → Interview", "explainIntegration"],
      ["MERGE · Zahl + Zitat", "mergeIntegration"],
      ["Joint Display", "jointDisplay"],
      ["Meta-Inferenz", "metaInference"],
      ["Inhaltsvalidität", "contentValidity"],

      /* Kolloquium, Folie 37 Paid Search Procedure */
      ["LASSO", "lasso"],
      ["Hierarchical Bayes", "hierarchicalBayes"],
      ["dynamic linear models", "dynamicLinearModels"],
      ["collaborative filtering", "collaborativeFiltering"],
      ["user-journey regression", "userJourneyRegression"],
      ["Posterior CVR", "posteriorBayes"],
      ["Cluster", "category"],

      /* Kolloquium, Folie 40 Multi-LLM Procedure */
      ["Multi-LLM panel, n=7", "multiLLMPanel"],
      ["Structured prompt instrument", "promptInstrument"],
      ["Convergence zones", "convergenceZones"],
      ["Blind spots", "blindSpots"],
      ["Contested futures", "contestedFutures"],

      /* Kolloquium, Folie 42 Copilot Fallacy */
      ["Capacity flip", "capacityFlip"],
      ["Creator-to-curator", "curator"],
      ["Institutional knowledge", "institutional"],
      ["Gioia", "gioia"],
      ["PRISMA 2020", "prisma"]
    ], ".metric-label");
  }

  enhanceStaticTerms();

  /* v2: Chip-Platzierung normalisieren, auf .method-card sitzt der Chip
     bisher auf .m-name (großer schwarzer Titel). Verschiebe ihn auf .m-num
     (kleines rotes Mono-Caps-Label), damit es konsistent zu .pattern-head
     auf Folie 10 ist. */
  Array.from(document.querySelectorAll(".method-card")).forEach(function (card) {
    var num = card.querySelector(".m-num");
    var name = card.querySelector(".m-name.metric-chip[data-explain]");
    if (!num || !name) return;
    var key = name.getAttribute("data-explain");
    var inlinePop = name.querySelector(":scope > .metric-popover");
    if (inlinePop) inlinePop.remove();
    name.classList.remove("metric-chip");
    name.removeAttribute("data-explain");
    name.removeAttribute("tabindex");
    name.removeAttribute("aria-haspopup");
    name.removeAttribute("aria-expanded");
    num.classList.add("metric-chip");
    num.setAttribute("data-explain", key);
    num.setAttribute("tabindex", "0");
    num.setAttribute("aria-haspopup", "dialog");
    num.setAttribute("aria-expanded", "false");
  });

  function populateDataExplainers() {
    Array.from(document.querySelectorAll(".metric-chip[data-explain]")).forEach(function (chip) {
      if (!chip.hasAttribute("tabindex")) chip.setAttribute("tabindex", "0");
      chip.setAttribute("aria-haspopup", "dialog");
      chip.setAttribute("aria-expanded", "false");
      var config = explainers[chip.getAttribute("data-explain")];
      if (!config) return;
      /* v2: always replace any inline-authored popover so the enriched
         data (long / example / formal) actually renders. */
      var existing = chip.querySelector(":scope > .metric-popover");
      if (existing) existing.remove();
      chip.appendChild(makePopover(config));
    });
  }

  populateDataExplainers();

  function chipsIn(scope) {
    return Array.from((scope || document).querySelectorAll(".metric-chip.is-open"));
  }

  function clearFit(chip) {
    chip.classList.remove("popover-align-left", "popover-align-right", "popover-above");
    var pop = chip.querySelector(".metric-popover");
    if (pop) {
      pop.style.maxHeight = "";
      pop.style.overflowY = "";
      pop.style.left = "";
      pop.style.right = "";
      pop.style.marginTop = "";
      pop.style.removeProperty("--popover-arrow-shift");
    }
  }

  /* Detect side-attached popovers (e.g. inside quality-detail-card or visual-step
     where the popover is anchored left/right of the chip, not below). For those
     the horizontal nudge logic must not run, but vertical clamping still helps. */
  function isSideAttached(chip) {
    return !!chip.closest(".quality-detail-card, .visual-step");
  }

  function fitPopover(chip) {
    if (!chip || chip.closest(".quality-detail-card.visual-step")) return;
    var popover = chip.querySelector(".metric-popover");
    var slide = chip.closest("section.slide");
    if (!popover || !slide) return;
    clearFit(chip);

    var slideRect = slide.getBoundingClientRect();
    var chipRect = chip.getBoundingClientRect();
    var pad = 14;
    var sideAttached = isSideAttached(chip);

    /* Vertikale Ausrichtung — zuerst, damit horizontale Messung danach stimmt.
       Wir wählen die Seite (oben/unten), die mehr Platz bietet, und cappen
       die Höhe auf den verfügbaren Raum — Scrollen ist besser als Überlauf. */
    var popRect = popover.getBoundingClientRect();
    var popH = popRect.height;
    var spaceBelow = slideRect.bottom - chipRect.bottom - 14 - pad;
    var spaceAbove = chipRect.top - slideRect.top - 14 - pad;
    var hardCap = slideRect.height - 2 * pad;

    var chooseAbove = false;
    if (!sideAttached) {
      if (popH <= spaceBelow) {
        /* passt vollständig darunter */
      } else if (popH <= spaceAbove) {
        chooseAbove = true;
      } else {
        chooseAbove = spaceAbove > spaceBelow;
      }
      if (chooseAbove) chip.classList.add("popover-above");
    }

    /* Vertikale Höhenbegrenzung — IMMER auf verfügbaren Raum cappen, niemals
       einen "minH-Bodensatz" setzen, der über die Slide-Grenze hinausragt. */
    var availableV;
    if (sideAttached) {
      availableV = slideRect.height - 2 * pad;
    } else {
      availableV = chooseAbove ? spaceAbove : spaceBelow;
    }
    var capV = Math.max(60, Math.min(hardCap, availableV));
    if (popH > capV) {
      /* Skalierung wegen deck-stage transform: rendered px ↦ intrinsic px */
      var vScale = popover.offsetHeight / (popRect.height || 1);
      popover.style.maxHeight = (capV * vScale) + "px";
      popover.style.overflowY = "auto";
    }

    /* Horizontale Ausrichtung — präzise inline-Korrektur statt grober CSS-Klasse.
       Wir messen das aktuelle Overflow und schieben den Popover exakt um diesen
       Betrag in den sichtbaren Bereich. Funktioniert für links- wie rechts-Überstand. */
    if (!sideAttached) {
      popRect = popover.getBoundingClientRect();
      var dx = 0;
      if (popRect.left < slideRect.left + pad) {
        dx = (slideRect.left + pad) - popRect.left;
      } else if (popRect.right > slideRect.right - pad) {
        dx = (slideRect.right - pad) - popRect.right;
      }
      if (dx !== 0) {
        var hScale = popover.offsetWidth / (popRect.width || 1);
        var dxInner = dx * hScale;
        /* Default-CSS positioniert den Popover mit `left:50%` + `transform:translate(-50%,…)`.
           Wir ergänzen den Shift über calc(50% + dx). */
        popover.style.left = "calc(50% + " + dxInner.toFixed(1) + "px)";
        popover.style.right = "auto";
        /* Pfeil dort verankern, wo der Chip steht (Mitte des Popovers minus dx) */
        popover.style.setProperty("--popover-arrow-shift", (-dxInner).toFixed(1) + "px");
      }
    }

    /* Side-attached Popovers (in .visual-step / .quality-detail-card) sind links/rechts
       am Chip verankert und mit translateY zentriert. Sie können oben/unten überlaufen,
       wenn der Chip nahe der Slide-Ober- oder Unterkante sitzt. Hier mit margin-top
       nachschieben. */
    if (sideAttached) {
      var popRectV = popover.getBoundingClientRect();
      var dyV = 0;
      if (popRectV.top < slideRect.top + pad) {
        dyV = (slideRect.top + pad) - popRectV.top;
      } else if (popRectV.bottom > slideRect.bottom - pad) {
        dyV = (slideRect.bottom - pad) - popRectV.bottom;
      }
      if (dyV !== 0) {
        var vScale2 = popover.offsetHeight / (popRectV.height || 1);
        popover.style.marginTop = (dyV * vScale2).toFixed(1) + "px";
      }
    }
  }

  function closeAll(scope) {
    chipsIn(scope).forEach(function (chip) {
      chip.classList.remove("is-open");
      chip.setAttribute("aria-expanded", "false");
      clearFit(chip);
    });
  }

  function openChip(chip) {
    var slide = chip.closest("section.slide") || document;
    closeAll(slide);
    chip.classList.add("is-open");
    chip.setAttribute("aria-expanded", "true");
    fitPopover(chip);
  }

  document.addEventListener("click", function (event) {
    var chip = event.target.closest(".metric-chip");
    if (!chip) {
      closeAll(document);
      return;
    }
    if (!chip.querySelector(".metric-popover")) return;
    event.stopPropagation();
    if (chip.classList.contains("is-open")) {
      chip.classList.remove("is-open");
      chip.setAttribute("aria-expanded", "false");
    } else {
      openChip(chip);
    }
  });

  document.addEventListener("keydown", function (event) {
    var chip = event.target.closest && event.target.closest(".metric-chip");
    if (event.key === "Escape") {
      closeAll(document);
      return;
    }
    if (!chip) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (chip.classList.contains("is-open")) {
        chip.classList.remove("is-open");
        chip.setAttribute("aria-expanded", "false");
      } else {
        openChip(chip);
      }
    }
  });

  document.addEventListener("focusin", function (event) {
    var chip = event.target.closest && event.target.closest(".metric-chip");
    if (chip && chip.querySelector(".metric-popover")) openChip(chip);
  });

  document.addEventListener("pointerover", function (event) {
    var chip = event.target.closest && event.target.closest(".metric-chip");
    if (chip && chip.querySelector(".metric-popover")) fitPopover(chip);
  });
})();
