# Genererar fall/sista-akten.json (källan för fallet – redigera här och kör om).
import json, os
T = True
def obj(id, typ, pos, **kw):
    d = {"id": id, "typ": typ, "pos": pos}; d.update(kw); return d
def ia(namn, text, fynd=None, material=None):
    d = {"namn": namn, "text": text}
    if fynd: d["ger_fynd"] = fynd
    if material: d["ger_material"] = material
    return d
# 3D-modeller för förhandsgranskningen ?stil=verklig (se js/tre/modeller.js och modeller/KALLOR.md)
STOL = {"fil": "modeller/painted_wooden_chair_01.glb", "passa": "box"}
VAGGLAMPA = {"fil": "modeller/industrial_wall_lamp.glb", "passa": "skala", "skala": 0.8, "pos": [0, -0.17, 0.056], "lyser": ["industrial_wall_lamp_glass"]}

# Tidslinje (kontrolleras mot alla texter):
# 19.30 ridå upp, akt 1 · 20.50–21.10 paus · 21.10 akt 2 · 21.12 sista linkörningen, Kalle går ner för järnstegen (Persson ser honom)
# 21.20 Kalle vid regnmaskinen bredvid inspicientens pulpet, Märta ställer sig i kulissen bredvid Persson
# ca 21.26 fru Wall lämnar luckan: stegen ner, undre maskineriet, spiraltrappan upp till lindraget
# 21.30 Ågren tappar repliken – luckan är mörk och tom · 21.31 scen 2:3, Viveka vid tejpen
# 21.32 ”Nu eller aldrig, Henrik!” – sandsäcken faller på kritkrysset · 21.33 ridå · 21.35 du och Strand på scenen

fall = {
 "id": "sista-akten", "version": 1,
 "meta": {"titel": "Sista akten", "miljo": "Teater i Göteborg", "epok": "1950-tal", "brottstyp": "sabotage", "langd": "medel",
   "uppskattad_tid_min": [12, 18], "svarighet": 3, "karnmekanik": "forhor", "bimekaniker": ["scen"], "twist": None, "kraver_rang": 0,
   "accentfarg": "#5a1a22", "omslag": "bilder/fall7/teatern.jpg", "mal": "Ta reda på vem som släppte sandsäcken", "handledning_mal": "sandsacken"},
 "intro": {"rubrik": "Teater Lyran, Göteborg. Oktober 1952.",
   "text": "Premiärkväll på Teater Lyran. Du sitter på rad 8 bredvid kommissarie Nils Strand, som har fått biljetterna av teaterchefen. Andra akten av ”Den gröna salongen” har just nått sin stora scen när något rasar ned ur mörkret ovanför scenen.\n\nEn sandsäck på fyrtio kilo slår i scengolvet en meter från stjärnan, Viveka Sterner. Hon står kvar, vit i ansiktet. Ridån går ner, och salongen fylls av sorl.\n\nNär ni kommer upp på scenen ber Strand alla i ensemblen och personalen att stanna kvar. ”En sandsäck faller inte av sig själv”, säger han. ”Någon i det här huset vill fru Sterner illa. Ta reda på vem – och hur den kom upp dit.”",
   "uppdrag": "Vem släppte sandsäcken – och hur kom gärningspersonen upp på lindraget?", "bild": "bilder/fall7/teatern.jpg", "berattare": "Kommissarie Nils Strand"},
 "personer": [
   {"id": "viveka", "namn": "Viveka Sterner", "roll": "Skådespelerska, premiärens stjärna", "misstankt": False, "beskrivning": "Göteborgs mest omtalade aktris. Kräver mycket, av sig själv och av alla andra."},
   {"id": "wall", "namn": "Agnes Wall", "roll": "Sufflös", "misstankt": T, "beskrivning": "Har sufflerat på Lyran i trettioett år och bor i ett litet rum högst upp i teaterhuset. Har alltid en blyertspenna bakom örat."},
   {"id": "marta", "namn": "Märta Hallin", "roll": "Ung skådespelerska", "misstankt": T, "beskrivning": "Ny på teatern i höstas. Ambitiös, och lär sig alla roller utantill."},
   {"id": "wern", "namn": "Gösta Wern", "roll": "Regissör", "misstankt": T, "beskrivning": "Temperamentsfull. Har satt upp ”Den gröna salongen” på sitt eget sätt och tål inte att någon ändrar en enda replik."},
   {"id": "kalle", "namn": "Kalle Nilsson", "roll": "Scenmästare", "misstankt": T, "beskrivning": "Sköter linorna på lindraget och allt maskineri. Har nycklarna till hela scenhuset."},
   {"id": "ruth", "namn": "Ruth Sandell", "roll": "Inspicient", "misstankt": False, "beskrivning": "Leder föreställningen från sin pulpet bakom kulissen och skriver ner allt i körboken."},
   {"id": "persson", "namn": "Oskar Persson", "roll": "Brandman, brandvakt", "misstankt": False, "beskrivning": "Sitter vid järnstegen bakom vänstra kulissen under varje föreställning."},
   {"id": "agren", "namn": "Sven Ågren", "roll": "Skådespelare", "misstankt": False, "beskrivning": "Spelar Henrik mot fru Sterner. Har en lång monolog i andra akten."}
 ],
 "moment": [], "fynd": [], "slutsatser": [],
}

# Färger och ljus som går igen
SCENLJUS = {"omgivning": "#ffd9b0", "omgivning_styrka": 0.75, "bas": 0.42}
MORKT = {"omgivning": "#c8b8a0", "omgivning_styrka": 0.4, "bas": 0.22}

# ---------- Rum 1: Scenen ----------
scen = {"id": "scenen", "namn": "Scenen", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 9.0, "djup": 6.4, "hojd": 5.0, "miljo": "inomhus", "bakgrund": "#0c0a0a", "dimma": [8, 18, "#120e0c"],
  "golv": "#3a2a1c", "verklig_golv": "plankor", "vagg": "puts", "putsfarg": "#2a2420", "panel": False,
  "ljus": SCENLJUS,
  "start": {"pos": [0.3, 2.45], "titta": 0},
  "objekt": [
    # Ridån är nere mot salongen (söder). Bakom oss: dekoren ”Den gröna salongen”.
    obj("ridan", "rida", [0, 0, 3.05], rot=180, bredd=9.0, hojd=5.0, interaktiv=ia("Ridån",
        "Du kikar ut genom springan i ridån. Salongen är halvtom nu. Rad 7, plats 12 – regissör Werns plats, mitt framför din egen. Du minns hans nacke under hela andra akten. Han satt kvar ända tills sandsäcken slog i golvet – då reste han sig.", "f-wern-alibi")),
    obj("luckan", "sufflorlucka", [0, 0, 2.55], rot=180, gar_till="undre", interaktiv=ia("Sufflörluckan",
        "Sufflörluckan sitter mitt i scenkanten, alldeles innanför ridån. När ridån är uppe ligger den i fullt rampljus framför publiken, så ingen kan klättra ner i den från scenen under föreställningen utan att hela salongen ser det. Sufflösen kommer hit underifrån. Inuti är det mörkt och trångt – en kort stege leder ner under scenen.")),
    obj("fond", "kuliss", [0, 0, -3.1], storlek=[6.4, 4.2], farg="#3e5a3e", stotta=False),
    obj("kv1", "kuliss", [-3.3, 0, -1.2], rot=90, storlek=[1.4, 3.6], farg="#3e5a3e", stotta=False),
    obj("kv2", "kuliss", [-3.3, 0, 0.9], rot=90, storlek=[1.4, 3.6], farg="#3e5a3e", stotta=False),
    obj("kh1", "kuliss", [3.3, 0, -1.2], rot=-90, storlek=[1.4, 3.6], farg="#3e5a3e", stotta=False),
    obj("kh2", "kuliss", [3.3, 0, 0.9], rot=-90, storlek=[1.4, 3.6], farg="#3e5a3e", stotta=False),
    obj("fatolj1", "fatolj", [-1.7, 0, -1.6], rot=20, modell={"fil": "modeller/arm_chair_01.glb", "passa": "box"}),
    obj("fatolj2", "fatolj", [1.7, 0, -1.6], rot=-20, modell={"fil": "modeller/arm_chair_01.glb", "passa": "box"}),
    obj("bord", "bord", [0, 0, -1.9], storlek=[1.0, 0.72, 0.6], modell={"fil": "modeller/round_wooden_table_01.glb", "passa": "box"}),
    obj("bok", "anteckningsbok", [0.2, 0.72, -1.9], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("vaxt", "krukvaxt", [-2.5, 0, -2.5], modell={"fil": "modeller/potted_plant_02.glb", "passa": "box"}),
    # Märkena och sandsäcken
    obj("krysset", "golvmarke", [0.4, 0, 0.5], marke="kryss", kollision=False),
    obj("tejpen", "golvmarke", [-0.6, 0, 0.5], marke="tejp", kollision=False, interaktiv=ia("Den vita tejpen",
        "En bit vit tejp på scengolvet, en meter från kritkrysset. Här stod fru Sterner när sandsäcken föll. Krysset med krita var hennes gamla plats i scen 2:3.", "f-tejpen")),
    obj("sandsacken", "sandsack", [0.4, 0, 0.5], liggande=True, interaktiv=ia("Sandsäcken",
        "En sandsäck i säckväv, fyrtio kilo. Den har spruckit i ena hörnet och sanden ligger utspilld. Den hängde i lina 7, rakt ovanför scenens mitt, och landade mitt på kritkrysset. Linan har följt med ner och ligger hoprasad bredvid – hel, varken skuren eller nött.", "f-sandsack")),
    # Vänster kulisser: brandvakten och järnstegen upp till lindraget
    obj("stegen", "stege", [-4.5, 0, -1.4], rot=90, hojd=5.0, gar_till="lindraget", interaktiv=ia("Järnstegen",
        "En järnstege längs väggen bakom vänstra kulissen, upp till lindraget åtta meter ovanför scenen. Brandmannens stol står vid foten.")),
    obj("brandstol", "stol", [-3.9, 0, -0.5], rot=90, modell=STOL),
    obj("persson", "person", [-3.9, 0, -0.5], rot=90, pose="sitta", rock="#1e2433", byxor="#1e2433", hatt="mossa", hattfarg="#1e2433", har="#6a6a6a", skagg=True, seed=4,
        interaktiv=ia("Brandman Persson", "Brandman Persson sitter kvar på sin stol vid järnstegen, med händerna knäppta i knät.", "f-persson", ["u-persson"])),
    # Höger kulisser: inspicientens pulpet med körboken och rapporten från generalrepetitionen
    obj("pulpet", "pulpet", [3.95, 0, 1.5], rot=-90),
    obj("korbok", "liggare", [3.9, 1.12, 1.5], rot=-90, interaktiv=ia("Inspicientens körbok",
        "Ruth Sandells körbok för kvällen, ifylld minut för minut: ”21.10 Ridå upp, akt II. 21.12 Fönsterduken ned – sista linkörningen till 21.45. 21.20 Regnmaskinen klar, Nilsson på plats. 21.30 Ågren tappar repliken i monologen – INGEN SUFFLERING! 21.31 Scen 2:3. 21.32 ’Nu eller aldrig, Henrik!’ – SANDSÄCK FALLER, lina 7. 21.33 Ridå.”", "f-korbok")),
    obj("rapporten", "papper", [4.05, 1.15, 1.8], antal=2, interaktiv=ia("Rapporten från generalrepetitionen",
        "Inspicientens rapport från generalrepetitionen i går kväll. ”Närvarande: hela ensemblen, fröken Hallin (ersättare), regissör Wern, scenmästare Nilsson och scenpersonalen. Frånvarande: fru Wall, sjuk – eleven Berit Lund sufflerade. Ändring: i scen 2:3 står fru Sterner vid den vita tejpen, en meter från kritkrysset. Krysset gäller inte längre.”", "f-genrep")),
    obj("ruth", "person", [3.7, 0, 0.7], rot=-110, kon="k", rock="#2a2a30", har="#3a2a1a", glasogon=True, seed=5,
        interaktiv=ia("Inspicient Sandell", "Ruth Sandell står kvar vid sin pulpet, blek men samlad.", "f-kalle-alibi", ["u-ruth"])),
    obj("strk1", "stralkastare", [-2.8, 0, 2.2], rot=150, lyser=True, lutning=25),
    obj("strk2", "stralkastare", [2.8, 0, 2.2], rot=-150, lyser=True, lutning=25),
    # Skådespelarna på scenen
    obj("viveka", "person", [-1.3, 0, 0.2], rot=30, kon="k", rock="#2e5a4a", har="#c8a050", seed=7,
        interaktiv=ia("Viveka Sterner", "Viveka Sterner har en sjal om axlarna och ett glas vatten i handen som skakar lite.", material=["u-viv", "u-viv-wall"])),
    obj("agren", "person", [1.5, 0, 0.0], rot=-40, rock="#2a2a2a", byxor="#2a2a2a", slips="#7a2e1f", har="#2a2018", seed=8,
        interaktiv=ia("Sven Ågren", "Sven Ågren, i frack, torkar sig i pannan med en näsduk.", material=["u-agren"])),
    obj("dorr", "dorr", [4.49, 0, -2.2], rot=-90, gar_till="logerna", interaktiv=ia("Till logekorridoren", "Dörren till logekorridoren, där de andra väntar.")),
    obj("skylt", "skylt", [4.48, 2.55, -2.2], rot=-90, text="LOGER", storlek=[0.5, 0.14], textstorlek=48)
  ]}}}

# ---------- Rum 2: Lindraget ----------
lindrag = {"id": "lindraget", "namn": "Lindraget", "mekanik": "scen", "last_upp_av": ["f-sandsack"],
  "last_text": "Strand pekar på sandsäcken: ”Titta på den först – var hängde den?”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 2.6, "djup": 8.0, "hojd": 2.8, "miljo": "inomhus", "bakgrund": "#0a0808", "dimma": [4, 12, "#0e0b0a"],
  "golv": "#3a2c20", "verklig_golv": "plankor", "vagg": "puts", "putsfarg": "#2a2420", "panel": False,
  "ljus": MORKT,
  "start": {"pos": [0.0, 3.2], "titta": 0},
  "objekt": [
    obj("racket", "racke", [0.75, 0, 0], rot=90, langd=8.0),
    obj("nagelbanken", "nagelbank", [-1.3, 0, -0.6], rot=90, langd=3.0, antal=10, tom=[6], hojd=2.8, interaktiv=ia("Nagelbänken",
        "Tio naglar. Nio linor sitter belagda i prydliga åttor med ett låsslag överst. Nagel 7 är tom – lina 7 bar sandsäcken rakt ovanför scenens mitt, och den har rusat upp genom blocket i taket och ligger nu nere på scenen. Ingenting här är avbrutet eller skuret. En lina som är belagd på en nagel lossnar inte av sig själv: någon har lyft av den.", "f-lina")),
    obj("penna", "skrivdon", [-0.85, 0.0, 0.25], blackhorn=False, penna="blyerts", interaktiv=ia("En blyertspenna",
        "En kort gul blyertspenna ligger på golvet framför nagelbänken. Den är tuggad i änden.", "f-penna")),
    obj("schemat", "tavelkarta", [-1.285, 1.45, 2.0], rot=90, storlek=[0.6, 0.7], textstorlek=24,
        text="KÖRSCHEMA AKT II\n\n21.10  Ridå upp\n21.12  Fönsterduken ned\n—  inga körningar  —\n21.45  Månen upp\n22.05  Ridå",
        interaktiv=ia("Körschemat", "Körschemat för andra akten sitter fastnålat på väggen. Efter fönsterduken kl. 21.12 finns inga linkörningar förrän 21.45 – lindraget ska vara tomt under scen 2:3. Körningarna görs på replik: härifrån ser man inte scengolvet för strålkastarna, men man hör varje ord.", "f-korschema")),
    *[obj(f"sack{i}", "sandsack", [1.05, 0, z], y0=0.5, hojd=2.8, kollision=False) for i, z in enumerate([-2.6, -1.3, 1.1])],
    obj("trappan", "spiraltrappa", [-0.4, 0, -3.2], radie=0.75, hojd=2.8, gar_till="undre", interaktiv=ia("Spiraltrappan",
        "En smal spiraltrappa av järn i lindragets norra ände. Den går hela vägen ner till undre maskineriet, under scenen. I dammet på trappstegen syns färska spår.", "f-trappa")),
    obj("stegtopp", "stege", [-1.3, 0, 3.6], rot=90, hojd=1.2, gar_till="scenen", interaktiv=ia("Järnstegen ner",
        "Järnstegen ner till scenen. Längst ner sitter brandman Persson på sin stol – han ser rakt upp längs stegen.")),
    obj("bok", "anteckningsbok", [-0.9, 0.0, 1.4], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("l1", "vagglampa", [-1.28, 2.1, -1.8], rot=90, styrka=0.8, rackvidd=4, modell=VAGGLAMPA),
    obj("l2", "vagglampa", [-1.28, 2.1, 2.8], rot=90, styrka=0.7, rackvidd=4, modell=VAGGLAMPA)
  ]}}}

# ---------- Rum 3: Undre maskineriet ----------
undre = {"id": "undre", "namn": "Undre maskineriet", "mekanik": "scen", "last_upp_av": ["f-lina"],
  "last_text": "Strand: ”Först lindraget. Hur släppte sandsäcken – och hur kommer man dit upp?”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 6.0, "djup": 4.6, "hojd": 2.3, "miljo": "inomhus", "bakgrund": "#0a0808", "dimma": [4, 11, "#0c0a08"],
  "golv": "#3a3026", "vagg": "sten", "panel": False,
  "ljus": MORKT,
  "start": {"pos": [-0.5, -0.2], "titta": 180},
  "objekt": [
    obj("lucktrappan", "stege", [0, 0, 2.3], rot=180, hojd=2.3, gar_till="scenen", interaktiv=ia("Stegen till sufflörluckan",
        "En kort stege leder upp i sufflörluckan, rakt ovanför. Det är sufflösens egen väg: hon går ner hit och upp i luckan, och kommer upp på samma sätt.", "f-lucktrappa")),
    obj("hyllan", "hylla", [1.4, 0, 2.05], rot=180, storlek=[1.0]),
    obj("exemplaret", "liggare", [0.45, 0.0, 1.75], rot=200, interaktiv=ia("Sufflörsexemplaret",
        "Sufflösens manus ligger i dammet vid stegens fot, uppslaget i scen 2:3, som om någon har tappat det i brådskan. Vid repliken ”Nu eller aldrig, Henrik!” står det i marginalen, med blyerts: ”V. vid krysset.” Det finns ingen ändring från generalrepetitionen i går.", "f-exemplaret")),
    obj("spar", "fotspar", [0, 0, 0], kollision=False, punkter=[[0.0, 1.9], [-0.8, 0.6], [-1.8, -0.8], [-2.1, -1.3]], interaktiv=ia("Spår i dammet",
        "Färska spår i dammet går från stegen under sufflörluckan fram till spiraltrappan, och tillbaka. Små skor med låg klack.", "f-spar")),
    obj("trappan", "spiraltrappa", [-2.2, 0, -1.4], radie=0.75, hojd=2.3, gar_till="lindraget", interaktiv=ia("Spiraltrappan", "Spiraltrappan upp till lindraget.")),
    obj("maskindorren", "dorr", [2.99, 0, -0.6], rot=-90, interaktiv=ia("Dörren till logekorridoren",
        "Dörren mellan undre maskineriet och logekorridoren är låst. En emaljskylt: ”Obehöriga äga ej tillträde. Nycklar hos scenmästaren och sufflösen.” Låset är oskadat.", "f-maskindorr")),
    obj("scenluckan", "skylt", [1.4, 1.75, -2.27], text="SCENLUCKORNA 1 OCH 2\nfastskruvade under föreställning", storlek=[0.9, 0.3], textstorlek=30, interaktiv=ia("Scenluckan",
        "Scenen har två luckor ner hit, och båda sitter rakt ovanför. De är fastskruvade underifrån med fyra vingmuttrar var, och dekorens bord och den ena fåtöljen står ovanpå. Ingen har öppnat dem i kväll – muttrarna sitter hårt och är dammiga.", "f-scenlucka")),
    obj("bank", "arbetsbank", [2.2, 0, 1.6], rot=-90),
    *[obj(f"sack{i}", "sandsack", [x, 0, -1.9], liggande=True) for i, x in enumerate([0.4, 0.9])],
    obj("bok", "anteckningsbok", [2.2, 0.9, 1.4], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("l1", "vagglampa", [0.6, 1.9, -2.27], styrka=0.7, rackvidd=4, modell=VAGGLAMPA),
    obj("l2", "vagglampa", [-2.98, 1.9, 0.8], rot=90, styrka=0.6, rackvidd=4, modell=VAGGLAMPA)
  ]}}}

# ---------- Rum 4: Logekorridoren ----------
loger = {"id": "logerna", "namn": "Logekorridoren", "mekanik": "scen", "last_upp_av": ["f-sandsack"],
  "last_text": "Strand: ”Börja på scenen. De andra väntar i logekorridoren.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 2.8, "djup": 9.0, "hojd": 2.7, "miljo": "inomhus", "bakgrund": "#120e0a", "dimma": [6, 14, "#16110c"],
  "golv": "#4a3828", "vagg": "puts", "putsfarg": "#c8b89a", "panel": "#5a4632",
  "ljus": {"omgivning": "#ffdcae", "omgivning_styrka": 0.55, "bas": 0.3},
  "start": {"pos": [0.0, 3.6], "titta": 0},
  "objekt": [
    obj("matta", "matta", [0, 0, 0], storlek=[1.2, 8.0], kollision=False),
    obj("dorr", "dorr", [0, 0, 4.49], rot=180, gar_till="scenen", interaktiv=ia("Till scenen", "Tillbaka till scenen.")),
    obj("maskindorr", "dorr", [1.39, 0, 2.2], rot=-90, interaktiv=ia("Dörren till undre maskineriet", "En låst dörr med emaljskylt: ”Undre maskineriet. Obehöriga äga ej tillträde.”")),
    # Fru Sterners loge längst in: sminkbordet med brevutkastet och Werns lapp
    obj("sminkbordet", "sminkbord", [0, 0, -4.2], storlek=[1.2, 0.75, 0.5], lyser=True),
    obj("brevet", "papper", [-0.3, 0.76, -4.15], interaktiv=ia("Brevutkastet",
        "På sminkbordet ligger ett brevutkast i fru Sterners handstil, till teaterchefen: ”Fru Wall måste bort till nyår. Hon mumlar, och hon kommer för sent med replikerna. Annars spelar jag inte i vår.” Brevet är daterat i förrgår.", "f-brevet")),
    obj("lappen", "papper", [0.35, 0.76, -4.1], interaktiv=ia("En lapp under spegeln",
        "Instucken under spegelns ram: ”Ni spelar MIN pjäs, inte er egen. Gör som jag säger eller gå. /G. W.”", "f-lappen")),
    obj("anslag", "tavelkarta", [-1.385, 1.45, -1.6], rot=90, storlek=[0.7, 0.8], textstorlek=24,
        text="DEN GRÖNA SALONGEN\nRollista\n\nLaura ........ V. Sterner\nHenrik ....... S. Ågren\n\nErsättare för\nfru Sterner:\nM. Hallin",
        interaktiv=ia("Anslagstavlan", "Rollistan sitter på anslagstavlan. Fröken Märta Hallin är fru Sterners ersättare – faller fru Sterner bort är det hon som spelar Laura.", "f-rollistan")),
    obj("kladstallning", "kladstallning", [1.05, 0, -1.4], rot=-90, langd=1.6, seed=3),
    obj("stol1", "stol", [-0.95, 0, 0.6], rot=90, modell=STOL),
    obj("wall", "person", [-0.95, 0, 0.6], rot=90, pose="sitta", kon="k", rock="#4a4048", har="#b8b0a8", glasogon=True, hatt="sjalett", hattfarg="#5a4a5a", seed=9,
        interaktiv=ia("Fru Wall", "Agnes Wall sitter på en stol med en kopp te i händerna, i låga, nötta skor. Hon fingrar efter pennan bakom örat, men den är inte där.", material=["u-wall-lucka", "u-wall-genrep"])),
    obj("marta", "person", [0.75, 0, 0.2], rot=-120, kon="k", rock="#7a2e3a", har="#3a2418", seed=10,
        interaktiv=ia("Märta Hallin", "Märta Hallin står vid klädställningen, fortfarande sminkad, i höga klackar.", material=["u-marta-loge"])),
    obj("kalle", "person", [0.8, 0, 3.0], rot=-150, rock="#3a3a34", byxor="#2a2a26", hatt="mossa", hattfarg="#2a2a26", har="#5a4a3a", forklade=True, seed=11,
        interaktiv=ia("Kalle Nilsson", "Kalle Nilsson har en nyckelknippa i en kedja vid bältet och smuts på händerna.", material=["u-kalle-knut", "u-kalle-nyckel"])),
    obj("wern", "person", [-0.7, 0, 3.4], rot=150, rock="#1a1a22", byxor="#1a1a22", slips="#5a1a22", har="#8a8a8a", seed=12,
        interaktiv=ia("Regissör Wern", "Gösta Wern går fram och tillbaka med händerna på ryggen.", material=["u-wern-salong", "u-wern-viveka"])),
    obj("fallbord", "bord", [-0.95, 0, -0.4], storlek=[0.5, 0.72, 0.4], modell={"fil": "modeller/side_table_tall_01.glb", "passa": "box"}),
    obj("bok", "anteckningsbok", [-0.95, 0.72, -0.4], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("l1", "vagglampa", [-1.38, 2.0, -3.0], rot=90, styrka=1.0, rackvidd=4),
    obj("l2", "vagglampa", [1.38, 2.0, 0.0], rot=-90, styrka=1.0, rackvidd=4),
    obj("l3", "vagglampa", [-1.38, 2.0, 2.8], rot=90, styrka=0.9, rackvidd=4)
  ]}}}

forhor = {"id": "forhoret", "namn": "Förhör", "mekanik": "forhor", "payload": {
  "visning": "forhor", "kort_instruktion": "Leta efter utsagor som inte kan vara sanna samtidigt.",
  "instruktion": "Tryck på en utsaga och sedan på en annan utsaga – eller ett fynd – som den inte kan stämma med. Tryck sedan på Invänd! Fel invändningar kostar ingenting.",
  "utsagor": [
    {"id": "u-viv", "person": "viveka", "titel": "Fru Sterner om scenen", "text": "Gösta flyttade mig till tejpen i går, på generalrepetitionen. Jag stod där, precis som han sagt. Hade jag stått vid krysset som förut …"},
    {"id": "u-viv-wall", "person": "viveka", "titel": "Fru Sterner om sufflösen", "kraver": ["f-brevet"], "text": "Brevet? Ja, jag har sagt till chefen att jag vill ha en ny sufflös. Agnes mumlar. Jag sa det rakt ut i logekorridoren i förrgår – alla hörde det, Agnes också. Men hon har bott i det där rummet uppe under taket i över trettio år – vart skulle hon ta vägen? Det har jag inte tänkt på."},
    {"id": "u-agren", "person": "agren", "titel": "Ågren om monologen", "text": "Klockan halv tio tappade jag repliken mitt i monologen. Jag tittade ner mot luckan – den var mörk och tom. Ingen viskade något. Jag fick hitta på en mening tills jag kom på texten igen."},
    {"id": "u-ruth", "person": "ruth", "titel": "Inspicienten om Kalle", "text": "Kalle stod vid regnmaskinen bakom kulissen, en meter från min pulpet, från tjugo över nio tills ridån gick ner. Jag gav honom signalerna själv. Han rörde sig inte därifrån."},
    {"id": "u-persson", "person": "persson", "titel": "Brandvakten om stegen", "text": "Kalle kom ner för stegen tolv över nio, efter sista linkörningen. Efter det gick ingen upp eller ner – jag satt här vid foten hela tiden. Fröken Hallin stod bredvid mig i kulissen från tjugo över nio tills ridån gick ner. Hon ska inte stå där, men jag sa inget."},
    {"id": "u-wall-lucka", "person": "wall", "titel": "Fru Wall om andra akten", "text": "Jag satt i min lucka hela andra akten, från ridå upp till ridå ner. Jag lämnade den inte en sekund. Det gör jag aldrig."},
    {"id": "u-wall-genrep", "person": "wall", "titel": "Fru Wall om generalrepetitionen", "text": "I går låg jag sjuk, ja, en elev fick suffla. Men jag har följt den här pjäsen i sex veckor. Jag vet var var och en står."},
    {"id": "u-marta-loge", "person": "marta", "titel": "Märta om andra akten", "text": "Jag satt i min loge och lyssnade i högtalaren hela andra akten. Jag var inte ens i närheten av scenen."},
    {"id": "u-marta-erkann", "person": "marta", "titel": "Märta medger", "kraver": ["f-marta-ljog"], "text": "Ja … jag stod i kulissen. Ersättare får inte stå där under föreställning, men jag ville se hur hon gör scenen. Persson såg mig hela tiden. Jag rörde mig inte från hans sida."},
    {"id": "u-kalle-knut", "person": "kalle", "titel": "Kalle om lina 7", "text": "Lina 7 slog jag fast på nageln klockan sju, åttor och ett låsslag, som alltid. Det lossnar inte av sig självt – aldrig. När jag gick ner tolv över nio var lindraget tomt."},
    {"id": "u-kalle-nyckel", "person": "kalle", "titel": "Kalle om nycklarna", "text": "Nyckeln till undre maskineriet sitter i min kedja. Den andra har fru Wall – hon går den vägen till sin lucka. Fler finns inte."},
    {"id": "u-wern-salong", "person": "wern", "titel": "Wern om andra akten", "text": "Jag satt på rad 7 hela akten, som jag alltid gör på premiärer. Var annars?"},
    {"id": "u-wern-viveka", "person": "wern", "titel": "Wern om fru Sterner", "text": "Viveka och jag? Vi har aldrig haft ett ont ord mellan oss. Hon är den bästa Laura jag kunnat önska mig."},
    {"id": "u-wern-erkann", "person": "wern", "titel": "Wern medger", "kraver": ["f-wern-ljog"], "text": "Nåja. Vi grälade om scen 2:3 – det var därför jag flyttade henne till tejpen i går, för husfridens skull. Men jag satt i salongen. Fråga vem ni vill."}
  ],
  "motsagelser": [
    {"id": "m-wall", "par": [["u-wall-lucka", "f-korbok"], ["u-wall-lucka", "u-agren"]], "ger_fynd": "f-wall-borta", "text": "Fru Wall säger att hon inte lämnade luckan en sekund – men när Ågren tappade repliken kl. 21.30 var luckan mörk och tom, och ingen sufflerade."},
    {"id": "m-marta", "par": [["u-marta-loge", "u-persson"], ["u-marta-loge", "f-persson"]], "ger_fynd": "f-marta-ljog", "text": "Märta säger att hon satt i logen – men brandman Persson såg henne i kulissen från 21.20 tills ridån gick ner."},
    {"id": "m-wern", "par": [["u-wern-viveka", "f-lappen"]], "ger_fynd": "f-wern-ljog", "text": "Wern säger att de aldrig har haft ett ont ord – men hans egen lapp under hennes spegel säger: ”Gör som jag säger eller gå.”"}
  ],
  "fel_text": "Strand skakar på huvudet: ”De två kan mycket väl vara sanna samtidigt.” Ingen motsägelse – försök med något annat."
}}

fall["moment"] = [scen, lindrag, undre, loger, forhor]

fall["fynd"] = [
  {"id": "f-sandsack", "titel": "Sandsäcken", "ikon": "🎭", "typ": "nyckel", "text": "En sandsäck på fyrtio kilo föll kl. 21.32 och landade mitt på kritkrysset, en meter från fru Sterner. Den hängde i lina 7, rakt ovanför scenens mitt. Linan ligger hel bredvid säcken."},
  {"id": "f-tejpen", "titel": "Tejpen och krysset", "ikon": "✖️", "typ": "nyckel", "text": "Fru Sterner stod vid den vita tejpen, en meter från kritkrysset. Krysset var hennes gamla plats i scen 2:3."},
  {"id": "f-genrep", "titel": "Generalrepetitionen", "ikon": "📋", "typ": "nyckel", "galler": ["wall"], "text": "Vid generalrepetitionen i går flyttades fru Sterner i scen 2:3 från kritkrysset till den vita tejpen. Alla var där utom fru Wall, som låg sjuk."},
  {"id": "f-korbok", "titel": "Körboken", "ikon": "📖", "typ": "nyckel", "galler": ["wall"], "text": "Inspicientens körbok: 21.30 Ågren tappar repliken – ingen sufflering. 21.32 sandsäcken faller på repliken ”Nu eller aldrig, Henrik!”. 21.33 ridå."},
  {"id": "f-persson", "titel": "Brandvakten vid stegen", "ikon": "🧯", "typ": "nyckel", "galler": ["marta"], "text": "Brandman Persson satt vid järnstegen hela kvällen. Kalle kom ner kl. 21.12; efter det gick ingen upp eller ner. Märta Hallin stod bredvid Persson i kulissen från 21.20 tills ridån gick ner."},
  {"id": "f-kalle-alibi", "titel": "Kalle vid regnmaskinen", "ikon": "🌧️", "typ": "nyckel", "galler": ["kalle"], "text": "Inspicienten: Kalle stod vid regnmaskinen, en meter från hennes pulpet, från 21.20 tills ridån gick ner. Hon gav honom signalerna själv."},
  {"id": "f-wern-alibi", "titel": "Wern på rad 7", "ikon": "💺", "typ": "nyckel", "galler": ["wern"], "text": "Regissör Wern satt på rad 7, mitt framför dig, hela andra akten. Han satt kvar ända tills sandsäcken föll."},
  {"id": "f-lina", "titel": "Lina 7", "ikon": "🪢", "typ": "nyckel", "text": "Nagel 7 på nagelbänken är tom, och lina 7 ligger hel nere på scenen – varken skuren eller nött. En belagd lina lossnar inte av sig själv: någon lyfte av den från nageln när sandsäcken föll."},
  {"id": "f-korschema", "titel": "Körschemat", "ikon": "🗒️", "typ": "stod", "text": "Inga linkörningar mellan 21.12 och 21.45 – lindraget var tomt under scen 2:3. Körningarna görs på replik: man ser inte scengolvet därifrån, men hör varje ord."},
  {"id": "f-penna", "titel": "Blyertspennan", "ikon": "✏️", "typ": "stod", "galler": ["wall"], "text": "En kort gul blyertspenna, tuggad i änden, låg på golvet framför nagelbänken."},
  {"id": "f-trappa", "titel": "Spiraltrappan", "ikon": "🌀", "typ": "nyckel", "text": "Utom järnstegen från scenen leder bara spiraltrappan upp till lindraget – från undre maskineriet. I dammet på trappan syns färska spår."},
  {"id": "f-maskindorr", "titel": "Dörren till maskineriet", "ikon": "🔐", "typ": "nyckel", "galler": ["kalle", "wall"], "text": "Dörren mellan logekorridoren och undre maskineriet är låst och oskadad. Nycklar finns bara hos scenmästaren och sufflösen."},
  {"id": "f-lucktrappa", "titel": "Stegen till luckan", "ikon": "🪜", "typ": "nyckel", "galler": ["wall"], "text": "Från sufflörluckan leder en kort stege rakt ner i undre maskineriet – sufflösens egen väg. Från scenen kommer ingen ner i luckan under föreställning utan att publiken ser det."},
  {"id": "f-scenlucka", "titel": "Scenluckorna", "ikon": "🔩", "typ": "stod", "text": "Scenens två luckor är fastskruvade underifrån med dammiga vingmuttrar, och dekorens möbler står ovanpå. Ingen har öppnat dem i kväll."},
  {"id": "f-spar", "titel": "Spåren i dammet", "ikon": "👞", "typ": "stod", "text": "Färska spår i dammet går från stegen under sufflörluckan till spiraltrappan och tillbaka. Små skor med låg klack."},
  {"id": "f-exemplaret", "titel": "Sufflörsexemplaret", "ikon": "📕", "typ": "nyckel", "galler": ["wall"], "text": "Sufflösens manus låg tappat vid stegens fot. Där står vid repliken ”Nu eller aldrig, Henrik!”: ”V. vid krysset.” Ändringen från generalrepetitionen finns inte med."},
  {"id": "f-brevet", "titel": "Brevutkastet", "ikon": "✉️", "typ": "stod", "galler": ["wall"], "text": "Fru Sterner har skrivit till teaterchefen: fru Wall måste bort till nyår, annars spelar hon inte i vår.", "forklaring": "Motivet: fru Wall skulle förlora både arbetet och rummet i teaterhuset där hon bott i över trettio år."},
  {"id": "f-rollistan", "titel": "Ersättaren", "ikon": "🎟️", "typ": "avledande", "galler": ["marta"], "text": "Märta Hallin är fru Sterners ersättare. Faller fru Sterner bort är det hon som spelar Laura.", "forklaring": "Ett motiv – men Märta stod bredvid brandvakten hela scenen, och hon visste om ändringen från generalrepetitionen."},
  {"id": "f-lappen", "titel": "Werns lapp", "ikon": "📝", "typ": "avledande", "galler": ["wern"], "text": "Under fru Sterners spegel: ”Ni spelar MIN pjäs, inte er egen. Gör som jag säger eller gå. /G. W.”", "forklaring": "Wern grälade med henne om scen 2:3 – det var därför han flyttade henne till tejpen. Han satt på rad 7 hela akten."},
  {"id": "f-wall-borta", "titel": "Luckan var tom", "ikon": "🕳️", "typ": "nyckel", "galler": ["wall"], "text": "Fru Wall säger att hon inte lämnade sufflörluckan en sekund – men kl. 21.30 var luckan mörk och tom, och ingen sufflerade när Ågren tappade repliken."},
  {"id": "f-marta-ljog", "titel": "Märta i kulissen", "ikon": "🎭", "typ": "avledande", "galler": ["marta"], "text": "Märta sa att hon satt i logen, men hon stod i kulissen bredvid brandvakten från 21.20 tills ridån gick ner.", "forklaring": "Hon ljög för att ersättare inte får stå i kulisserna under föreställning – och hennes lögn ger henne i själva verket ett alibi."},
  {"id": "f-wern-ljog", "titel": "Grälet", "ikon": "💢", "typ": "avledande", "galler": ["wern"], "text": "Wern sa att han och fru Sterner aldrig haft ett ont ord, men hans lapp under hennes spegel säger annat.", "forklaring": "Ett gräl om en scen är inget mordförsök. Wern satt på rad 7 hela akten – och han visste bättre än någon att hon inte längre stod vid krysset."}
]

fall["slutsatser"] = [
  {"id": "s-olycka", "kraver": ["f-lina", "u-kalle-knut"], "fraga": "Kan sandsäcken ha fallit av sig själv?", "alternativ": [
    {"text": "Ja – linan gled av nageln.", "svar": "Kalle lade linan i åttor med ett låsslag. Den lossnar inte av sig själv – någon lyfte av den."},
    {"text": "Ja – linan var nött och brast.", "svar": "Linan ligger hel på scenen, varken skuren eller nött."},
    {"text": "Nej – någon lyfte av linan från nageln, uppe på lindraget, när sandsäcken föll kl. 21.32.", "ratt": True}],
   "slutsats": "Det var ingen olycka. Någon stod vid nagelbänken på lindraget kl. 21.32."},
  {"id": "s-vagen", "kraver": ["f-trappa", "f-persson"], "efter": ["s-olycka"], "fraga": "Hur kom gärningspersonen upp på lindraget?", "alternativ": [
    {"text": "Uppför järnstegen från scenen.", "svar": "Brandman Persson satt vid stegen hela kvällen. Efter att Kalle kom ner kl. 21.12 gick ingen upp eller ner."},
    {"text": "Den gömde sig där uppe redan i pausen.", "svar": "Kalle var på lindraget till 21.12, och då var det tomt. Efter det gick ingen upp för stegen."},
    {"text": "Uppför spiraltrappan från undre maskineriet.", "ratt": True}],
   "slutsats": "Ingen använde järnstegen. Vägen gick genom undre maskineriet och uppför spiraltrappan."},
  {"id": "s-undre", "kraver": ["f-maskindorr", "f-lucktrappa", "f-scenlucka"], "efter": ["s-vagen"], "fraga": "Vilka kunde ta sig in i undre maskineriet under andra akten?", "alternativ": [
    {"text": "Vem som helst bakom scenen.", "svar": "Dörren från logekorridoren var låst och oskadad, och scenluckorna var fastskruvade."},
    {"text": "Den som hade nyckel till dörren – Kalle och fru Wall – eller den som satt i sufflörluckan.", "ratt": True},
    {"text": "Den som öppnade en scenlucka.", "svar": "Båda scenluckorna är fastskruvade underifrån, muttrarna är dammiga och dekorens möbler står ovanpå."}],
   "slutsats": "Under akten kom man bara in i undre maskineriet med nyckel – Kalles eller fru Walls – eller genom sufflörluckan, där fru Wall satt."},
  {"id": "s-kalle", "kraver": ["f-kalle-alibi"], "efter": ["s-undre"], "fraga": "Kalle har nyckel och kan linorna bättre än någon. Kan han ha gjort det?", "alternativ": [
    {"text": "Ja – han har nyckeln och slog själv knuten.", "svar": "Var befann han sig kl. 21.32?"},
    {"text": "Nej – inspicienten såg honom vid regnmaskinen, en meter från sin pulpet, från 21.20 tills ridån gick ner.", "ratt": True}],
   "slutsats": "Kalle kan uteslutas. Han stod vid regnmaskinen under inspicientens ögon."},
  {"id": "s-lucka", "kraver": ["f-wall-borta"], "efter": ["s-undre"], "fraga": "Fru Wall säger att hon satt i sufflörluckan hela akten. Stämmer det?", "alternativ": [
    {"text": "Ja – sufflösen sitter alltid i luckan.", "svar": "Vad hände när Ågren tappade repliken kl. 21.30?"},
    {"text": "Nej – kl. 21.30 var luckan mörk och tom, och ingen sufflerade när Ågren tappade repliken.", "ratt": True}],
   "slutsats": "Fru Wall lämnade luckan strax före 21.30 – just när någon gick genom undre maskineriet och uppför spiraltrappan."},
  {"id": "s-krysset", "kraver": ["f-sandsack", "f-tejpen", "f-genrep", "f-exemplaret"], "fraga": "Sandsäcken föll på kritkrysset – fru Sterners plats fram till i går. Vem trodde fortfarande att hon stod där?", "alternativ": [
    {"text": "Alla i ensemblen.", "svar": "Alla i ensemblen var på generalrepetitionen när hon flyttades till tejpen."},
    {"text": "Regissören.", "svar": "Det var Wern själv som flyttade henne."},
    {"text": "Den som missade generalrepetitionen – vars manus fortfarande säger ”V. vid krysset”.", "ratt": True}],
   "slutsats": "Bara den som missade generalrepetitionen kunde tro att fru Sterner stod vid krysset. Det var fru Wall – och hennes manus säger fortfarande ”V. vid krysset”."},
  {"id": "s-marta", "kraver": ["f-marta-ljog", "f-rollistan"], "fraga": "Märta ljög om att hon satt i logen, och hon får rollen om fru Sterner faller bort. Kan hon ha gjort det?", "alternativ": [
    {"text": "Ja – hon hade motiv och ljög.", "svar": "Var stod hon när hon ljög om var hon var?"},
    {"text": "Nej – hon stod i kulissen bredvid brandman Persson från 21.20, och hon var på generalrepetitionen.", "ratt": True}],
   "slutsats": "Märta ljög för att hon inte fick stå i kulissen – men just där såg brandvakten henne hela tiden."}
]

fall["losning"] = {"skyldig": "wall", "hur": "lucka", "hur_text": "Hon lämnade sufflörluckan strax före 21.30, gick ner för stegen genom undre maskineriet och uppför spiraltrappan till lindraget, och lyfte av lina 7 på repliken ”Nu eller aldrig, Henrik!”.",
  "bevisgrupper": [["f-wall-borta", "f-exemplaret"], ["f-wall-borta", "f-lucktrappa"], ["f-wall-borta", "f-genrep"], ["f-exemplaret", "f-lina", "f-trappa"], ["f-wall-borta", "f-penna"]],
  "uteslutningar": {"marta": ["f-persson", "f-genrep"], "wern": ["f-wern-alibi", "f-genrep"], "kalle": ["f-kalle-alibi", "f-genrep"]},
  "uteslutningar_text": {
    "marta": "Hon stod i kulissen bredvid brandman Persson från 21.20 och gick aldrig uppför stegen. Och hon var på generalrepetitionen – hon visste att fru Sterner inte längre stod vid krysset.",
    "wern": "Han satt på rad 7, mitt framför dig, hela akten. Och det var han själv som flyttade fru Sterner till tejpen.",
    "kalle": "Inspicienten såg honom vid regnmaskinen från 21.20 tills ridån gick ner. Och han var på generalrepetitionen."}}
fall["anklagelse"] = {"hur_fraga": "Hur kom gärningspersonen åt sandsäcken?", "hur_alternativ": [
    {"id": "stegen", "text": "Uppför järnstegen från scenen"},
    {"id": "dorren", "text": "Genom dörren från logekorridoren, med scenmästarens nyckel"},
    {"id": "lucka", "text": "Från sufflörluckan, genom undre maskineriet och uppför spiraltrappan"},
    {"id": "olycka", "text": "Ingen – linan lossnade av sig själv"}], "hur_kravs": False, "bevis_max": 3}
fall["ledtradar"] = [
  {"niva": 1, "kostnad": 10, "kraver": ["f-sandsack", "f-lina"], "text": "Börja med frågan om det var en olycka. Gå upp på lindraget och titta på linan och nageln som sandsäcken hängde i – och ta reda på vilka vägar som leder dit upp."},
  {"niva": 2, "kostnad": 25, "kraver": ["f-trappa", "f-persson", "f-maskindorr", "f-lucktrappa"], "text": "Om någon stod vid nagelbänken kl. 21.32: vilken väg tog den upp, och vilka kunde över huvud taget ta sig in i undre maskineriet under akten? Ta sedan reda på var var och en av dem befann sig."},
  {"niva": 3, "kostnad": 50, "kraver": ["f-kalle-alibi", "f-genrep", "f-korbok", "f-exemplaret"], "text": "Scenmästaren syntes vid regnmaskinen hela tiden. Sandsäcken föll på det gamla kritkrysset – vem trodde fortfarande att fru Sterner stod där? Och vad hände när Ågren tappade repliken kl. 21.30?"}]
fall["aterkoppling"] = {
  "ratt": "Den som sitter i sufflörluckan ser allt och syns aldrig. Agnes Wall hade bott i sitt rum under taket i över trettio år, och nu skulle fru Sterner få henne utkastad till nyår. Strax före halv tio smög hon ner ur luckan, genom undre maskineriet och uppför spiraltrappan. Hon lyfte av lina 7 på repliken hon kunde utantill – men hennes manus visste inte att fru Sterner hade flyttats en meter vid generalrepetitionen, den enda kväll hon saknats. Ågren tappade repliken, och ingen viskade den till honom.",
  "fel": {
    "marta": "Märta ljög om logen, men just därför har hon ett alibi: brandvakten såg henne i kulissen hela scenen. Och hon visste var fru Sterner skulle stå.",
    "wern": "Wern grälade med fru Sterner – men han satt framför dig på rad 7, och det var han som flyttade henne till tejpen.",
    "kalle": "Kalle har nyckeln och kan linorna, men inspicienten såg honom vid regnmaskinen hela tiden."},
  "fel_allman": "Kommissarie Strand rynkar pannan …",
  "forklaring_steg": [
    {"text": "Lina 7 är hel och har lyfts av nageln. Det var ingen olycka – någon stod på lindraget kl. 21.32.", "fynd": ["f-lina", "f-sandsack"]},
    {"text": "Brandvakten satt vid järnstegen, och efter 21.12 gick ingen upp. Den enda andra vägen är spiraltrappan från undre maskineriet.", "fynd": ["f-persson", "f-trappa"]},
    {"text": "Dörren till undre maskineriet var låst, och scenluckorna fastskruvade. In kom bara den som hade nyckel – Kalle eller fru Wall – eller den som satt i sufflörluckan.", "fynd": ["f-maskindorr", "f-scenlucka", "f-lucktrappa"]},
    {"text": "Kalle stod vid regnmaskinen under inspicientens ögon. Märta stod bredvid brandvakten, och Wern satt på rad 7.", "fynd": ["f-kalle-alibi", "f-marta-ljog", "f-wern-alibi"]},
    {"text": "Fru Wall säger att hon inte lämnade luckan – men kl. 21.30 var den tom, och ingen sufflerade Ågren.", "fynd": ["f-wall-borta", "f-korbok"]},
    {"text": "Sandsäcken föll på kritkrysset, inte på tejpen. Den som släppte den visste inte om ändringen vid generalrepetitionen, och fru Walls manus säger fortfarande ”V. vid krysset”.", "fynd": ["f-genrep", "f-exemplaret", "f-tejpen"]},
    {"text": "Fru Wall är skyldig. Fru Sterner ville få henne avskedad till nyår – och med arbetet skulle hon förlora rummet där hon bott i över trettio år.", "fynd": ["f-brevet", "f-penna"]}]}

# Miljöljud per rum (se js/ljud.js)
LJUD = {"undre": ["dropp"], "lindraget": [{"typ": "vind", "styrka": 0.2}]}
for m in fall["moment"]:
  if m["id"] in LJUD: m["payload"]["rum"]["ljud"] = LJUD[m["id"]]

# Hur rummen skrivs i löptext (”Det finns mer att hitta på scenen”, ”Gå till scenen”)
TEXT_I = {"scenen": "på scenen", "lindraget": "på lindraget", "undre": "i undre maskineriet", "logerna": "i logekorridoren"}
for m in fall["moment"]:
  if m["id"] in TEXT_I: m["text_i"] = TEXT_I[m["id"]]

ut = os.path.join(os.path.dirname(__file__), '..', '..', 'fall', 'sista-akten.json')
json.dump(fall, open(ut, 'w'), ensure_ascii=False, indent=2)
print('skrev', os.path.normpath(ut))
