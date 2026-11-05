# Genererar fall/gront-black.json (källan för fallet – redigera här och kör om).
import json, os
T = True
def obj(id, typ, pos, **kw):
    d = {"id": id, "typ": typ, "pos": pos}; d.update(kw); return d
def ia(namn, text, fynd=None, material=None):
    d = {"namn": namn, "text": text}
    if fynd: d["ger_fynd"] = fynd
    if material: d["ger_material"] = material
    return d

# Natten mot torsdagen den 9 juli 1925. S/S Vätterstjärnan ligger förtöjd vid Borensberg, på väg mot Motala och Göteborg.
# 00.30 nattstewarden Pettersson sätter sig vid trappan (mellan hytt 2 och 3) · 01.00 konsuln låser sin dörr, inget brev
# ca 03 Oskar Ring river ett blad ur sitt ritblock, skriver brevet med grönt bläck och skjuter in det under hytt 5
# 06.30 konsuln vaknar och hittar brevet · 07.00 Pettersson går av · 07.30 frukost i salongen, purserns hyttlista visar sig bortriven
# Hyttraden längs korridoren: 1 2 | trappan och stewarden | 3 4 5 (konsuln). Från hytt 3 och 4 når man hytt 5 utan att passera stewarden.

fall = {
 "id": "gront-black", "version": 1,
 "meta": {"titel": "Grönt bläck", "miljo": "Kanalångare på Göta kanal", "epok": "1920-tal", "brottstyp": "utpressning", "langd": "medel",
   "uppskattad_tid_min": [12, 20], "svarighet": 3, "karnmekanik": "logikrutnat", "bimekaniker": ["scen"], "twist": None, "kraver_rang": 0,
   "accentfarg": "#2a5a5a", "omslag": "bilder/fall10/vatterstjarnan.jpg", "mal": "Ta reda på vem som skrev utpressningsbrevet", "handledning_mal": "konsuln"},
 "intro": {"rubrik": "S/S Vätterstjärnan, Göta kanal. Juli 1925.",
   "text": "Ångaren har legat förtöjd vid Borensberg över natten. Du reser till Göteborg tillsammans med konstapel Nils Strand, som har fått sin första ledighet – och just när frukostklockan ringer bultar konsul Fredrik Wahlgren på er hytt uppe på övre däck, röd i ansiktet, med ett papper i handen.\n\nNågon har i natt skjutit in ett brev under dörren till hans hytt. Det är skrivet med grönt bläck, i stora tryckbokstäver, och kräver tre tusen kronor före Motala.\n\n”Fyra passagerare bor i hyttkorridoren utom mig”, säger konsuln. ”En av dem skrev det här.” Strand stoppar pipan i fickan. ”Då tar vi reda på vem – innan vi är framme vid Motala.”",
   "uppdrag": "Vem skrev utpressningsbrevet till konsul Wahlgren?", "bild": "bilder/fall10/vatterstjarnan.jpg", "berattare": "Konstapel Nils Strand"},
 "personer": [
   {"id": "konsuln", "namn": "Fredrik Wahlgren", "roll": "Konsul, sågverksägare", "misstankt": False, "beskrivning": "Äger sågverket i Lövsund. Van att bli åtlydd."},
   {"id": "gerda", "namn": "Gerda Lilja", "roll": "Passagerare", "misstankt": T, "beskrivning": "Reser ensam till Göteborg. Vänlig och praktisk, med ett lugn som får andra att lugna sig."},
   {"id": "teodor", "namn": "Teodor Kask", "roll": "Passagerare", "misstankt": T, "beskrivning": "Allvarlig man i mörk kostym. Har känt konsulns familj i många år."},
   {"id": "rut", "namn": "Rut Malm", "roll": "Passagerare", "misstankt": T, "beskrivning": "Ung kvinna med kortklippt hår och skarpa frågor. Har bokat resan i sista stund."},
   {"id": "oskar", "namn": "Oskar Ring", "roll": "Passagerare", "misstankt": T, "beskrivning": "Tystlåten man i trettioårsåldern. Reser ensam och håller sig för sig själv."},
   {"id": "pettersson", "namn": "Pettersson", "roll": "Nattsteward", "misstankt": False, "beskrivning": "Ny ombord den här sommaren. Kan hyttnumren men inte namnen."},
 ],
 "moment": [], "fynd": [], "slutsatser": [],
}

PANEL = "#d8ccb0"

# ---------- Rum 1: Hyttkorridoren ----------
korr = {"id": "korridoren", "namn": "Hyttkorridoren", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 2.2, "djup": 11.0, "hojd": 2.4, "miljo": "inomhus", "bakgrund": "#120e0a", "dimma": [6, 16, "#16110c"],
  "golv": "#5a3e26", "verklig_golv": "plankor", "vagg": "trapanel", "panelfarg": PANEL, "panel": False,
  "ljus": {"omgivning": "#ffe2b8", "omgivning_styrka": 0.6, "bas": 0.32},
  "start": {"pos": [-0.3, 4.6], "titta": 0},
  "objekt": [
    obj("matta", "matta", [0, 0, 0], storlek=[0.9, 10.2], kollision=False),
    *[obj(f"hytt{n}", "kupedorr", [1.09, 0, z], rot=-90, nummer=n, interaktiv=ia(f"Hytt {n}", txt)) for n, z, txt in [
        (1, 3.8, "Hytt 1, längst förut. Dörren är stängd; passageraren sitter uppe i salongen."),
        (2, 2.0, "Hytt 2. Dörren är stängd; passageraren sitter uppe i salongen."),
        (3, -0.2, "Hytt 3, akter om trappan. Dörren är stängd; passageraren sitter uppe i salongen."),
        (4, -2.0, "Hytt 4, akter om trappan och närmast konsulns. Dörren är stängd; passageraren sitter uppe i salongen.")]],
    obj("hytt5", "kupedorr", [1.09, 0, -3.8], rot=-90, nummer=5, interaktiv=ia("Hytt 5 – konsulns",
        "Konsulns hytt längst akterut. Springan under dörren är en god centimeter bred – ett brev glider in utan ett ljud. Konsuln låste dörren klockan ett och låg vaken en stund; då fanns inget brev.", "f-dorren")),
    obj("akterdorren", "dorr", [0, 0, -5.49], farg="#4a3a2a", interaktiv=ia("Akterdörren",
        "Dörren ut mot akterdäck är låst. Nyckeln har kaptenen, och han låste den själv klockan tolv. Låset är oskadat.", "f-akterdorr")),
    obj("trappan", "dorr", [-1.09, 0, 0.9], rot=90, gar_till="salongen", interaktiv=ia("Trappan upp till salongen",
        "Den smala trappan upp till salongen och däck. Den mynnar i korridoren mitt emellan hytt 2 och hytt 3 – den enda vägen ner hit, utom akterdörren.")),
    obj("stol", "stol", [-0.6, 0, 0.1], rot=90),
    obj("pettersson", "person", [-0.6, 0, 0.1], rot=90, pose="sitta", rock="#e8e2d2", byxor="#1a1a20", slips="#1a1a20", har="#5a4a3a", seed=50,
        interaktiv=ia("Nattstewarden Pettersson", "Pettersson reser sig när du kommer. ”Jag satt här på stolen vid trappan från halv ett till sju, min herre. När jag satte mig var korridoren tom och alla dörrar stängda. Ingen kom ned för trappan, och ingen gick förbi mig i korridoren – åt något håll. Men akter om mig kan man gå mellan hytt 3, 4 och 5 utan att passera. Det är ju bara ett par steg.”", "f-stewarden")),
    obj("konsuln", "person", [0.35, 0, -3.3], rot=-160, rock="#2a2a30", byxor="#2a2a30", slips="#6a1a2a", har="#9a9a9a", skagg=True, seed=51,
        interaktiv=ia("Konsul Wahlgren", "Konsuln håller fram brevet. Grönt bläck, stora tryckbokstäver, på ett blad rutat papper med en sliten kant upptill: ”LÄGG 3 000 KRONOR I LIVBÅT 2 FÖRE MOTALA. ANNARS FÅR TIDNINGARNA VETA VAD SOM HÄNDE PÅ SÅGEN I LÖVSUND.” ”Jag vaknade halv sju, och då låg det på mattan innanför dörren.” Konsuln sänker rösten. ”En olycka för två år sedan. En arbetare dog. Jag betalade änkan. Det är ingenting att skriva om.”", "f-brevet")),
    obj("skylt", "skylt", [0, 2.05, 5.48], rot=180, text="HYTTER 1–5", storlek=[0.6, 0.16], textstorlek=48),
    obj("hylla", "hylla", [-1.05, 1.1, -3.0], rot=90, storlek=[0.8]),
    obj("bok", "anteckningsbok", [-0.95, 1.12, -3.0], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("l1", "vagglampa", [-1.08, 1.85, 3.0], rot=90, styrka=0.9, rackvidd=4),
    obj("l2", "vagglampa", [-1.08, 1.85, -1.4], rot=90, styrka=0.9, rackvidd=4),
  ]}}}

# ---------- Rum 2: Salongen ----------
salong = {"id": "salongen", "namn": "Salongen", "mekanik": "scen", "last_upp_av": ["f-brevet"],
  "last_text": "Strand: ”Låt oss se brevet först.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 6.0, "djup": 5.2, "hojd": 2.5, "miljo": "inomhus", "bakgrund": "#120e0a", "dimma": [7, 16, "#16110c"],
  "golv": "#6a4a2c", "verklig_golv": "fiskben", "vagg": "trapanel", "panelfarg": "#8a6a48", "panel": False,
  "ljus": {"omgivning": "#fff0d8", "omgivning_styrka": 0.75, "bas": 0.38},
  "start": {"pos": [0.9, 1.5], "titta": 20},
  "objekt": [
    *[obj(f"fv{i}", "dagfonster", [-2.99, 0, z], rot=90) for i, z in enumerate([-1.4, 0.4])],
    *[obj(f"fh{i}", "dagfonster", [2.99, 0, z], rot=-90) for i, z in enumerate([-1.4, 0.4])],
    obj("bord1", "bord", [-1.4, 0, -0.6], storlek=[1.2, 0.74, 0.8], modell={"fil": "modeller/wooden_table_02.glb", "passa": "box"}),
    obj("bord2", "bord", [1.0, 0, -0.9], storlek=[1.2, 0.74, 0.8], modell={"fil": "modeller/wooden_table_02.glb", "passa": "box"}),
    obj("gerda", "person", [-2.0, 0, -0.1], rot=150, kon="k", rock="#4a5a6a", har="#8a6a4a", seed=52,
        interaktiv=ia("Gerda Lilja", "Gerda Lilja häller upp kaffe åt de andra. ”Grönt bläck? Jag skriver mina brev med blyerts, det är det enda som inte kladdar på en båt. Jag sov hela natten – fråga stewarden, jag gick aldrig förbi honom.”")),
    obj("teodor", "person", [-0.8, 0, -1.3], rot=-20, rock="#1a1a1e", byxor="#1a1a1e", slips="#eeeeee", har="#6a6a6a", glasogon=True, seed=53,
        interaktiv=ia("Teodor Kask", "Teodor Kask lägger ifrån sig tidningen. ”Jag har känt Fredriks far. Den sortens brev skriver man inte. Och jag har bara svart bläck i min reservoarpenna – har alltid haft.”")),
    obj("rut", "person", [1.6, 0, -0.3], rot=200, kon="k", rock="#2a3a2a", har="#2a1a10", seed=54,
        interaktiv=ia("Rut Malm", "Rut Malm ser på konsuln utan att blinka. ”Ja, jag vet vad som hände i Lövsund. Det är därför jag är här – jag skriver om det, öppet och under eget namn. Brev i grönt bläck under dörrar är inte min stil.”")),
    obj("oskar", "person", [0.4, 0, -1.6], rot=20, rock="#4a4034", byxor="#3a3428", har="#3a2a1a", seed=55,
        interaktiv=ia("Oskar Ring", "Oskar Ring rör om i kaffet och ser ut genom fönstret. ”Jag sov. Jag vet ingenting om något brev.” Mer säger han inte.")),
    obj("purser", "pulpet", [2.4, 0, 2.0], rot=-130),
    obj("passagerarboken", "liggare", [2.35, 1.12, 1.95], rot=-130, interaktiv=ia("Purserns passagerarbok",
        "Purserns bok ligger på pulpeten. Bladet med hyttlistan är bortrivet – bara en rad pappersflagor sitter kvar vid ryggen. Pursern själv steg av i Borensberg i går kväll och kommer ombord igen först i Motala. Stewarden kan hyttnumren, men inte namnen. Ni får pussla ihop vem som bor var av det passagerarna och stewarden säger.", "f-sidan")),
    obj("skrivbordet", "bord", [-2.3, 0, 1.8], storlek=[0.9, 0.74, 0.5], modell={"fil": "modeller/side_table_tall_01.glb", "passa": "box"}),
    obj("skrivdon", "skrivdon", [-2.3, 0.75, 1.8], interaktiv=ia("Salongens skrivbord",
        "Ångarens brevpapper med tryckt vinjett och ett bläckhorn med svart bläck. Stewarden säger att det är det enda bläcket ombord, utom det passagerarna har med sig själva – och grönt bläck har bara en av dem. ”Flaskan står på hyllan i hytt 4. Jag såg den när jag bäddade klockan elva i går kväll och igen i morse. Hytterna är låsta när passagerarna inte är i dem – nycklarna har de själva och jag.”", "f-ett-gront")),
    obj("ljuskrona", "ljuskrona", [0, 2.5, -0.6], styrka=1.0, modell={"fil": "modeller/chandelier_01.glb", "passa": "skala", "skala": 0.5, "hanger": True}),
    obj("trappan", "dorr", [0.8, 0, 2.59], rot=180, gar_till="korridoren", interaktiv=ia("Trappan ner", "Ner till hyttkorridoren.")),
    obj("dackdorr", "dorr", [-2.99, 0, 1.8], rot=90, gar_till="dacket", interaktiv=ia("Ut på promenaddäcket", "Ut på det överbyggda promenaddäcket.")),
    obj("bok", "anteckningsbok", [-1.4, 0.75, -0.4], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
  ]}}}

# ---------- Rum 3: Promenaddäcket ----------
dack = {"id": "dacket", "namn": "Promenaddäcket", "mekanik": "scen", "last_upp_av": ["f-brevet"],
  "last_text": "Strand: ”Låt oss se brevet först.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 8.0, "djup": 5.0, "hojd": 2.6, "miljo": "veranda", "panel": "#ece6d6",
  "ljus": {"omgivning": "#fff6e0", "omgivning_styrka": 0.9, "bas": 0.45, "sol": 1.3},
  "start": {"pos": [-2.6, 1.6], "titta": -60},
  "objekt": [
    obj("livbaten", "livbat", [1.4, 0, -1.2], langd=4.0, nummer=2, interaktiv=ia("Livbåt 2",
        "Livbåt 2 står på sina klossar vid relingen. Det är hit pengarna ska läggas ”före Motala”. Ännu ligger ingenting i den – och från salongens fönster syns båten hela tiden.", "f-livbaten")),
    obj("dackstol1", "stol", [-2.4, 0, -1.6], rot=20),
    obj("ritblocket", "papper", [-2.4, 0.46, -1.6], antal=3, interaktiv=ia("Ett ritblock på en däcksstol",
        "Ett ritblock med rutat papper ligger kvar på en däcksstol – av det slag ingenjörer och ritare använder. Översta bladet är tomt. Ett blad är utrivet, och den slitna kanten passar precis mot brevets. Inget namn på pärmen.", "f-ritblocket")),
    obj("dackstol2", "stol", [-0.6, 0, 1.6], rot=160),
    obj("manuset", "papper", [-0.6, 0.46, 1.6], interaktiv=ia("Maskinskrivna sidor",
        "Några maskinskrivna sidor under en sten för att inte blåsa bort: ”Olyckan i Lövsund – vad konsul Wahlgren aldrig berättade.” Rent maskinskrivet, utan en enda handskriven rad.", "f-manuset")),
    obj("bord", "bord", [2.6, 0, 1.6], storlek=[0.7, 0.72, 0.6], modell={"fil": "modeller/round_wooden_table_01.glb", "passa": "box"}),
    obj("bok", "anteckningsbok", [2.6, 0.73, 1.6], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [-3.0, 0, 2.49], rot=180, gar_till="salongen", interaktiv=ia("In i salongen", "Tillbaka in i salongen.")),
  ]}}}

def K(id, namn, varden): return {"id": id, "namn": namn, "varden": [{"id": v, "namn": n} for v, n in varden]}
rutnat = {"id": "hyttlistan", "namn": "Hyttlistan", "mekanik": "logikrutnat", "last_upp_av": ["f-sidan"],
  "last_text": "Hyttlistan finns i purserns bok i salongen – titta där först.",
  "payload": {
  "rubrik": "Vem bor i vilken hytt?",
  "instruktion": "Bladet med hyttlistan är bortrivet. Tryck i en ruta för att växla mellan tom, ✗ och ✓. Hytt 1–4 ligger i rad längs korridoren, och ”bredvid” betyder hytten intill. Konsulns hytt 5 ligger efter hytt 4; stewarden satt vid trappan mellan hytt 2 och 3.",
  "ledtrad_rubrik": "Vad stewarden och passagerarna säger",
  "lost_text": "Hyttlistan är rekonstruerad och stämmer med alla uppgifter.",
  "kategorier": [
    K("person", "Passagerare", [("gerda", "Gerda Lilja"), ("teodor", "Teodor Kask"), ("rut", "Rut Malm"), ("oskar", "Oskar Ring")]),
    K("hytt", "Hytt", [("h1", "Hytt 1"), ("h2", "Hytt 2"), ("h3", "Hytt 3"), ("h4", "Hytt 4")]),
    K("yrke", "Yrke", [("kyrkoherde", "Kyrkoherde"), ("sjukskoterska", "Sjuksköterska"), ("journalist", "Journalist"), ("ingenjor", "Ingenjör")]),
    K("skriver", "Skriver med", [("svart", "Svart bläck"), ("blyerts", "Blyerts"), ("maskin", "Skrivmaskin"), ("gront", "Grönt bläck")]),
  ],
  "grannar": {"kategori": "hytt", "par": [["h1", "h2"], ["h2", "h3"], ["h3", "h4"]]},
  "bord": {"typ": "korridor", "ordning": ["h1", "h2", "h3", "h4"], "huvud": "konsuln", "vakt_efter": 2, "vakt": "stewarden", "aria": "Hytterna längs korridoren så som du har markerat dem"},
  "ledtradar": [
    {"id": "L1", "text": "Journalisten skriver allt på maskin.", "regler": [{"typ": "samma", "a": "journalist", "b": "maskin"}]},
    {"id": "L2", "text": "Ingenjören bor i hytt 4.", "regler": [{"typ": "samma", "a": "ingenjor", "b": "h4"}]},
    {"id": "L3", "text": "Gerda Lilja bor bredvid den som skriver på maskin – hon hörde skrivmaskinen genom väggen hela kvällen.", "regler": [{"typ": "bredvid", "a": "gerda", "b": "maskin"}]},
    {"id": "L4", "text": "Den som skriver med svart bläck bor i en hytt med udda nummer.", "regler": [{"typ": "en_av", "a": "svart", "b": ["h1", "h3"]}]},
    {"id": "L5", "text": "Gerda Lilja har kyrkoherden på ena sidan och Rut Malm på den andra.", "regler": [{"typ": "mellan", "a": "gerda", "b": "kyrkoherde", "c": "rut"}]},
    {"id": "L6", "text": "Oskar Ring bor inte bredvid sjuksköterskan.", "regler": [{"typ": "inte_bredvid", "a": "oskar", "b": "sjukskoterska"}]},
    {"id": "L7", "text": "Den som skriver med grönt bläck bor inte bredvid kyrkoherden.", "regler": [{"typ": "inte_bredvid", "a": "gront", "b": "kyrkoherde"}]},
  ],
  "losning": {"teodor": {"hytt": "h1", "yrke": "kyrkoherde", "skriver": "svart"}, "gerda": {"hytt": "h2", "yrke": "sjukskoterska", "skriver": "blyerts"}, "rut": {"hytt": "h3", "yrke": "journalist", "skriver": "maskin"}, "oskar": {"hytt": "h4", "yrke": "ingenjor", "skriver": "gront"}},
  "ger_fynd_nar_lost": "f-hyttlistan"}}

fall["moment"] = [korr, salong, dack, rutnat]

fall["fynd"] = [
  {"id": "f-brevet", "titel": "Brevet", "ikon": "✉️", "typ": "nyckel", "text": "Utpressningsbrevet är skrivet med grönt bläck i tryckbokstäver, på ett blad rutat papper med en sliten kant upptill. Det kräver 3 000 kronor i livbåt 2 före Motala, annars ska tidningarna få veta om olyckan på sågen i Lövsund."},
  {"id": "f-dorren", "titel": "Under konsulns dörr", "ikon": "🚪", "typ": "bakgrund", "text": "Brevet sköts in under dörren till hytt 5 mellan klockan ett och halv sju i natt."},
  {"id": "f-akterdorr", "titel": "Akterdörren låst", "ikon": "🔒", "typ": "stod", "text": "Akterdörren låstes av kaptenen klockan tolv och var låst hela natten. Låset är oskadat."},
  {"id": "f-stewarden", "titel": "Stewarden vid trappan", "ikon": "🪑", "typ": "nyckel", "text": "Nattstewarden satt vid trappan mellan hytt 2 och 3 från 00.30 till 07.00. Ingen kom ned för trappan och ingen passerade honom i korridoren. Akter om honom ligger hytt 3, 4 och 5."},
  {"id": "f-sidan", "titel": "Hyttlistan bortriven", "ikon": "📕", "typ": "bakgrund", "text": "Bladet med hyttlistan är bortrivet ur purserns bok, och pursern är i land till Motala. Vem som bor var får pusslas ihop av vad passagerarna och stewarden säger."},
  {"id": "f-ett-gront", "titel": "En enda flaska grönt bläck", "ikon": "🧪", "typ": "nyckel", "text": "Ombord finns bara svart bläck och det passagerarna har med sig. Den enda flaskan grönt bläck står på hyllan i hytt 4, som är låst när passageraren inte är där."},
  {"id": "f-ritblocket", "titel": "Ritblocket", "ikon": "📐", "typ": "nyckel", "galler": ["oskar"], "text": "Ett ritblock med rutat papper av det slag ingenjörer använder ligger på en däcksstol. Ett blad är utrivet, och kanten passar mot brevets."},
  {"id": "f-livbaten", "titel": "Livbåt 2", "ikon": "🛶", "typ": "bakgrund", "text": "Livbåt 2, där pengarna ska läggas, syns hela tiden från salongens fönster. Ännu ligger ingenting i den."},
  {"id": "f-manuset", "titel": "Rut Malms artikel", "ikon": "📰", "typ": "avledande", "galler": ["rut"], "text": "Maskinskrivna sidor om olyckan i Lövsund: ”vad konsul Wahlgren aldrig berättade”.", "forklaring": "Rut Malm vet om olyckan och skriver om den – öppet, under eget namn och på maskin. Ett motiv att granska konsuln, inte att pressa honom på pengar."},
  {"id": "f-hyttlistan", "titel": "Hyttlistan", "ikon": "🛏️", "typ": "nyckel", "galler": ["teodor", "gerda", "rut", "oskar"], "text": "Hytt 1: Teodor Kask, kyrkoherde, svart bläck. Hytt 2: Gerda Lilja, sjuksköterska, blyerts. Hytt 3: Rut Malm, journalist, skrivmaskin. Hytt 4: Oskar Ring, ingenjör, grönt bläck."},
]

fall["slutsatser"] = [
  {"id": "s-vagen", "kraver": ["f-stewarden", "f-akterdorr", "f-dorren"], "fraga": "Varifrån kom den som sköt in brevet under konsulns dörr?", "alternativ": [
    {"text": "Uppifrån, nerför trappan.", "svar": "Stewarden satt vid trappan hela natten. Ingen kom ned."},
    {"text": "Utifrån, genom akterdörren.", "svar": "Kaptenen låste den klockan tolv, och låset är oskadat."},
    {"text": "Från hytt 1 eller 2.", "svar": "Då hade brevskrivaren måst gå förbi stewarden vid trappan."},
    {"text": "Från hytt 3 eller 4 – akter om stewarden.", "ratt": True}],
   "slutsats": "Brevskrivaren bor i hytt 3 eller 4. Bara därifrån når man konsulns dörr utan att passera stewarden."},
  {"id": "s-blacket", "kraver": ["f-brevet", "f-ett-gront"], "fraga": "Brevet är skrivet med grönt bläck. Vad betyder det?", "alternativ": [
    {"text": "Ingenting – vem som helst kan ha lånat bläck.", "svar": "Den enda flaskan står i hytt 4, och hytten är låst när passageraren inte är där."},
    {"text": "Att brevet skrevs i hytt 4, där den enda flaskan grönt bläck står.", "ratt": True}],
   "slutsats": "Brevet skrevs av den som bor i hytt 4 – där står det gröna bläcket."},
  {"id": "s-papperet", "kraver": ["f-brevet", "f-ritblocket"], "fraga": "Varifrån kommer papperet brevet är skrivet på?", "alternativ": [
    {"text": "Från salongens skrivbord.", "svar": "Ångarens brevpapper har tryckt vinjett. Brevet är skrivet på rutat ritpapper."},
    {"text": "Ur ritblocket på däcket – rutat ritpapper av det slag ingenjörer använder.", "ratt": True}],
   "slutsats": "Bladet är utrivet ur ritblocket på däcket. Kanten passar."},
  {"id": "s-hytt4", "kraver": ["f-hyttlistan"], "efter": ["s-vagen", "s-blacket"], "fraga": "Vem bor akter om stewarden och skriver med grönt bläck?", "alternativ": [
    {"text": "Rut Malm i hytt 3.", "svar": "Hon bor akter om stewarden – men hon skriver allt på maskin."},
    {"text": "Oskar Ring i hytt 4.", "ratt": True},
    {"text": "Gerda Lilja i hytt 2.", "svar": "Hytt 2 ligger förut om stewarden, och Gerda skriver med blyerts."}],
   "slutsats": "Oskar Ring, ingenjör i hytt 4, skriver med grönt bläck – och kan nå konsulns dörr utan att passera stewarden."},
  {"id": "s-rut", "kraver": ["f-manuset", "f-hyttlistan"], "efter": ["s-vagen"], "fraga": "Rut Malm bor i hytt 3 och skriver om olyckan i Lövsund. Kan hon ha skrivit brevet?", "alternativ": [
    {"text": "Ja – hon bor akter om stewarden och har motiv.", "svar": "Var finns det gröna bläcket – och vad skriver hon själv med?"},
    {"text": "Nej – hon har inget grönt bläck. Den enda flaskan står i den låsta hytt 4.", "ratt": True}],
   "slutsats": "Rut Malm granskar konsuln öppet. Hon skriver på maskin och har inget grönt bläck."},
]

fall["losning"] = {"skyldig": "oskar", "hur": "hytt4",
  "hur_text": "Från hytt 4, akter om stewarden. Oskar Ring rev ett blad ur sitt ritblock, skrev brevet med sitt gröna bläck i tryckbokstäver och sköt in det under konsulns dörr, två steg bort – utan att passera stewarden vid trappan.",
  "bevisgrupper": [["f-hyttlistan", "f-stewarden", "f-ett-gront"], ["f-hyttlistan", "f-ritblocket"], ["f-hyttlistan", "f-ett-gront"], ["f-stewarden", "f-ritblocket", "f-hyttlistan"]],
  "uteslutningar": {"teodor": ["f-stewarden", "f-hyttlistan"], "gerda": ["f-stewarden", "f-hyttlistan"], "rut": ["f-ett-gront", "f-hyttlistan"]},
  "uteslutningar_text": {
    "teodor": "Bor i hytt 1, förut om stewarden, och skriver med svart bläck. Han hade måst gå förbi stewarden.",
    "gerda": "Bor i hytt 2, förut om stewarden, och skriver med blyerts.",
    "rut": "Bor i hytt 3 och vet om Lövsund, men skriver allt på maskin. Det gröna bläcket står i hytt 4."}}
fall["anklagelse"] = {"hur_fraga": "Hur kom brevet under konsulns dörr?", "hur_alternativ": [
    {"id": "trappan", "text": "Någon kom ned för trappan från salongen i natt"},
    {"id": "akter", "text": "Någon kom in utifrån genom akterdörren"},
    {"id": "hytt4", "text": "Från hytt 4, akter om stewarden, utan att passera honom"},
    {"id": "hytt2", "text": "Från hytt 2, medan stewarden slumrade"}], "hur_kravs": False, "bevis_max": 3}
fall["ledtradar"] = [
  {"niva": 1, "kostnad": 10, "kraver": ["f-brevet", "f-stewarden", "f-akterdorr"], "text": "Börja med vägen till konsulns dörr: var satt stewarden, och vilka hytter når man utan att gå förbi honom? Titta sedan noga på brevet – vad är det skrivet med, och på?"},
  {"niva": 2, "kostnad": 25, "kraver": ["f-ett-gront", "f-sidan", "f-ritblocket"], "text": "Brevskrivaren bor akter om stewarden och har det gröna bläcket. Lös hyttlistan i anteckningsboken: vem bor i hytt 3 och 4, och vem skriver med vad? Vems är ritblocket på däcket?"},
  {"niva": 3, "kostnad": 50, "kraver": ["f-sidan", "f-ett-gront", "f-ritblocket"], "text": "Börja rutnätet med Gerda Lilja: hon har grannar på båda sidor, så hon bor i hytt 2 eller 3 – och ingenjören bor i hytt 4. Det gröna bläcket står i hytt 4, två steg från konsulns dörr. Vem bor där – och vem använder rutat ritpapper?"}]
fall["aterkoppling"] = {
  "ratt": "En korridor, en stol och en flaska bläck. Stewarden vid trappan stängde vägen för hytt 1 och 2, och av de två som bodde akter om honom skrev den ena allt på maskin. Den andra hade det gröna bläcket – och ett ritblock med ett blad för lite. Oskar Rings bror var arbetaren som dog i Lövsund. Pengarna skulle gå till änkan, sa han till Strand; konsulns ”ersättning” hade räckt till begravningen och inte mer.",
  "fel": {
    "teodor": "Kyrkoherden bor i hytt 1 och skriver med svart bläck. Han hade måst gå förbi stewarden.",
    "gerda": "Sjuksköterskan bor i hytt 2, förut om stewarden, och skriver med blyerts.",
    "rut": "Rut Malm bor akter om stewarden och vet om Lövsund – men det gröna bläcket står i den låsta hytt 4."},
  "fel_allman": "Konstapel Strand tänder pipan och skakar på huvudet …",
  "forklaring_steg": [
    {"text": "Stewarden satt vid trappan mellan hytt 2 och 3 hela natten, och akterdörren var låst. Brevskrivaren bor i hytt 3 eller 4.", "fynd": ["f-stewarden", "f-akterdorr", "f-dorren"]},
    {"text": "Brevet är skrivet med grönt bläck, och det finns bara en flaska ombord. Papperet är utrivet ur ritblocket på däcket.", "fynd": ["f-brevet", "f-ett-gront", "f-ritblocket"]},
    {"text": "Hyttlistan: hytt 3 Rut Malm, journalist, skrivmaskin. Hytt 4 Oskar Ring, ingenjör, grönt bläck.", "fynd": ["f-hyttlistan"]},
    {"text": "Rut Malm skriver om Lövsund, men öppet och på maskin. Oskar Ring skrev brevet.", "fynd": ["f-manuset"]}]}

# Miljöljud per rum (se js/ljud.js)
LJUD = {"korridoren": [{"typ": "dropp", "styrka": 0.3}], "salongen": [{"typ": "tick", "styrka": 0.4}], "dacket": ["faglar"]}
for m in fall["moment"]:
  if m["id"] in LJUD and "rum" in m["payload"]: m["payload"]["rum"]["ljud"] = LJUD[m["id"]]

TEXT_I = {"korridoren": "i hyttkorridoren", "salongen": "i salongen", "dacket": "på promenaddäcket"}
for m in fall["moment"]:
  if m["id"] in TEXT_I: m["text_i"] = TEXT_I[m["id"]]

ut = os.path.join(os.path.dirname(__file__), '..', '..', 'fall', 'gront-black.json')
json.dump(fall, open(ut, 'w'), ensure_ascii=False, indent=2)
print('skrev', os.path.normpath(ut))
