# Genererar fall/lada-sju.json (källan för fallet – redigera här och kör om).
import json, os
T = True
def obj(id, typ, pos, **kw):
    d = {"id": id, "typ": typ, "pos": pos}; d.update(kw); return d
def ia(namn, text, fynd=None, material=None):
    d = {"namn": namn, "text": text}
    if fynd: d["ger_fynd"] = fynd
    if material: d["ger_material"] = material
    return d
def V(**kw): return kw

# Måndagen den 8 mars 1943, Storbergets gruva i Bergslagen. Solen går ned omkring 17.45; mörkläggningen börjar i skymningen.
# 08.30 ingenjör Falk lägger transportplanen i låda 7 och förseglar med remsan till vänster om handtaget; kamerans räkneverk står på 12
# 09.15 bild A (remsan till vänster, vedlåren tom, gardinen uppe, lampan över ritbordet, fröken Lindgren vid ritbordet)
# 09.15 Falk och fotografen Holm går till laven · 09.30 ned i gruvan · 11.30 upp
# ca 09.40–11.30 Maj Lindgren drar ner gardinen, öppnar låda 7, fotograferar planens åtta sidor på det lilla bordet med
#   kontorets reprokamera och klistrar en ny remsa – till höger om handtaget
# 10.30 vaktmästare Storm bär in ved (en minut): fröken står vid lilla bordet, gardinen är nere
# 11.40 bild B (remsan till höger, vedlåren full, gardinen nere, lampan över lilla bordet) – Maj är på väg ut på lunch
# 12.10 Maj lämnar ett rekommenderat brev på posten, till fru A. Hansen i Charlottenberg
# 12.52 disponent Brandel och herr Kessler kommer med tåget från Örebro
# 15.20 bild C (disponenten visar herr Kessler ritkontoret; remsan till höger, hel)
# 15.30–16.15 Kessler väntar ensam i ritkontoret · 16.15 Maj kommer tillbaka från magasinet och sliter av remsan
# 16.30 Falk hittar remsan bruten · 16.35 bild D · 18.30 Strand och du kommer från Örebro

fall = {
 "id": "lada-sju", "version": 1,
 "meta": {"titel": "Låda sju", "miljo": "Gruvkontor i Bergslagen", "epok": "1940-tal", "brottstyp": "spionage", "langd": "medel",
   "uppskattad_tid_min": [12, 20], "svarighet": 3, "karnmekanik": "bildjamforelse", "bimekaniker": ["scen"], "twist": None, "kraver_rang": 0,
   "accentfarg": "#5a3a2a", "omslag": "bilder/fall11/ritkontoret.jpg", "mal": "Ta reda på vem som kopierade transportplanen – och när", "handledning_mal": "ladan"},
 "intro": {"rubrik": "Storbergets gruva, Bergslagen. Mars 1943.",
   "text": "Det är beredskapstid, och malmen från Storberget går på järnväg mot hamnarna. Hur många tåg som går, och när, står i en hemlig transportplan. Den ligger i en förseglad låda i gruvkontorets ritkontor: låda sju.\n\nI eftermiddags hittade gruvingenjören förseglingen bruten. Mappen låg kvar, men bladen låg i fel ordning. Någon har haft planen framme – och den som vill stoppa malmtågen, eller skydda dem, betalar bra för en kopia.\n\nKommissarie Nils Strand vid statspolisen i Örebro tar dig med i bilen genom snön. ”Ingenting är stulet”, säger han. ”Det är det som är besvärligt. Men bolaget fyller sjuttiofem år, och en fotograf har gått runt på kontoret hela dagen. Vi börjar med lådan – sedan vill jag se vartenda fotografi.”",
   "uppdrag": "Vem kopierade transportplanen i låda sju – och när?", "bild": "bilder/fall11/ritkontoret.jpg", "berattare": "Kommissarie Nils Strand"},
 "personer": [
   {"id": "brandel", "namn": "Gustaf Brandel", "roll": "Disponent", "misstankt": False, "beskrivning": "Bolagets chef. Var i Örebro på förmiddagen och kom tillbaka med middagståget."},
   {"id": "falk", "namn": "Henrik Falk", "roll": "Gruvingenjör", "misstankt": T, "beskrivning": "Ansvarar för transportplanen och förseglade lådan i morse. Noggrann, och skakad."},
   {"id": "maj", "namn": "Maj Lindgren", "roll": "Ritare", "misstankt": T, "beskrivning": "Ritkontorets enda ritare sedan karlarna kallades in. Lugn och omtyckt av alla."},
   {"id": "storm", "namn": "Albin Storm", "roll": "Vaktmästare", "misstankt": T, "beskrivning": "Eldar kaminerna och skottar gården. Har arbetat vid gruvan i trettio år."},
   {"id": "kessler", "namn": "Otto Kessler", "roll": "Inköpare från ett tyskt stålverk", "misstankt": T, "beskrivning": "På besök för att förhandla om malmleveranser. Artig, välklädd och mycket intresserad av allt han ser."},
   {"id": "elsa", "namn": "Elsa Holm", "roll": "Fotograf", "misstankt": T, "beskrivning": "Anlitad från Örebro för bolagets jubileumsbok. Har gått runt med kamera och stativ hela dagen."},
   {"id": "ek", "namn": "Verner Ek", "roll": "Hissmaskinist", "misstankt": False, "beskrivning": "Sköter gruvhissen och för bok över alla som åker ned och upp."},
 ],
 "moment": [], "fynd": [], "slutsatser": [],
}

INNE = {"omgivning": "#ffdcae", "omgivning_styrka": 0.6, "bas": 0.34}

# ---------- Rum 1: Ritkontoret ----------
# Samma uppställning som på fotografierna, sedd från söder: kamin och vedlår till vänster, fönstret, väggklockan,
# ritbordet, det lilla bordet och ritningsskåpet längst till höger.
ritkontor = {"id": "ritkontoret", "namn": "Ritkontoret", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 6.4, "djup": 5.2, "hojd": 2.9, "miljo": "inomhus", "bakgrund": "#120e0a", "dimma": [7, 16, "#16110c"],
  "golv": "#5a4028", "verklig_golv": "plankor", "vagg": "puts", "putsfarg": "#cfc8b4", "panel": "#5a4a36",
  "ljus": INNE,
  "start": {"pos": [0.3, 1.9], "titta": 0},
  "objekt": [
    obj("kaminen", "kamin", [-2.75, 0, -2.1], hojd=2.9),
    obj("vedlaren", "vedlar", [-2.05, 0, -2.25], interaktiv=ia("Vedlåren", "Vedlåren vid kaminen är full av björkved. Vaktmästaren fyller den när den är tom.")),
    obj("fonstret", "dagfonster", [-1.3, 0, -2.59], natt=True, interaktiv=ia("Fönstret mot gruvbacken",
        "Fönstret vetter mot gruvbacken och laven. Överst sitter mörkläggningsgardinen, en svart rullgardin av papp. Just nu är den nerdragen, för det är mörkt ute. ”Den dras ner i skymningen, vid sextiden”, säger ingenjör Falk. ”På dagen har vi den uppe – en ritare behöver allt ljus hon kan få.”")),
    obj("klockan", "vaggur", [0.35, 1.95, -2.58]),
    obj("ritbordet", "ritbord", [-0.3, 0, -1.35], lyser=True),
    obj("lillabordet", "bord", [1.25, 0, -2.0], storlek=[0.7, 0.72, 0.5], interaktiv=ia("Det lilla bordet",
        "Ett litet avlastningsbord mellan ritbordet och ritningsskåpet. I bordsskivan sitter fyra färska hål efter häftstift, i en rektangel precis så stor som ett maskinskrivet ark. Någon har nålat fast papper här, ett i taget.", "f-haftstift")),
    obj("ladan", "ritningsskap", [2.5, 0, -1.83], forseglad=7, bruten=True, interaktiv=ia("Låda sju",
        "Ritningsskåpets sjunde låda står på glänt. Förseglingsremsan – en pappersremsa klistrad över springan, till höger om handtaget – är avsliten på mitten. I lådan ligger mappen ”Transportplan mars–april. Hemlig” kvar. Den har åtta maskinskrivna blad, men de ligger i fel ordning: sidan 5 överst. Ingenting fattas.", "f-ladan")),
    obj("falk", "person", [2.75, 0, -0.6], rot=-55, rock="#4a4a44", byxor="#3a3a36", slips="#2a2a3a", har="#6a5a3a", glasogon=True, seed=61,
        interaktiv=ia("Ingenjör Falk", "Henrik Falk torkar glasögonen för tredje gången. ”Jag lade planen i låda sju halv nio i morse och klistrade remsan över springan – till vänster om handtaget, det gör jag alltid, och jag skriver H.F. på den. Sedan gick jag med fotografen till gruvan. Halv fem skulle jag hämta planen, och då var remsan avsliten. Jag bad fröken Holm ta en bild av skåpet genast, innan någon rörde något. Här är den.”",
          "f-falk-remsa", ["bild-d"])),
    obj("maj", "person", [-1.5, 0, 0.1], rot=30, kon="k", rock="#5a6a5a", har="#8a5a2a", seed=62,
        interaktiv=ia("Fröken Lindgren", "Maj Lindgren ser dig rakt i ögonen. ”Jag satt vid ritbordet hela förmiddagen, från nio tills jag gick på lunch kvart i tolv. Skåpet står tre meter ifrån mig. Ingen rörde det – den ende som var här inne var Storm med veden, och han var borta igen på en minut. På eftermiddagen var det värre: disponenten skickade mig till magasinet, och den tyske herrn satt här alldeles ensam.”", "f-maj-ensam")),
    obj("kameraskapet", "kameraskap", [2.68, 0, 0.7], rot=-90, interaktiv=ia("Kameraskåpet",
        "Här står kontorets reprokamera: en liten kamera på en pelare, med två lampor, som används när ritningar ska kopieras. Skåpet är låst med ett patentlås, och låset är oskadat. Falk låser upp åt dig. ”Bara fröken Lindgren och jag har nyckel.” I liggaren står hans egen rad från i morse: ”8/3 kl. 08.30. Räkneverk 12. Låda 7 förseglad. H.F.” Kamerans räkneverk står nu på 20, och filmen som sitter i är ny och oexponerad. ”Räkneverket ställer man för hand när man byter film”, säger Falk tyst. ”Det har ingen gjort. Åtta bilder – och jag har inte rört kameran i dag.”", "f-kameran")),
    obj("kappan", "rock", [-3.19, 0, 0.9], rot=90, farg="#3a4a5a", interaktiv=ia("Fröken Lindgrens kappa",
        "En blå vinterkappa hänger på kroken innanför dörren. I fickan ligger ett postkvitto: ”Rekommenderat brev. Storberget 8.3.43 kl. 12.10. Till fru A. Hansen, Charlottenberg.” Strand vänder på det. ”Charlottenberg. Sista stationen före norska gränsen.”", "f-kvittot")),
    obj("stol", "stol", [-0.3, 0, -0.55], rot=180),
    obj("bord2", "bord", [-1.2, 0, 2.2], storlek=[0.8, 0.74, 0.5]),
    obj("bok", "anteckningsbok", [-1.2, 0.75, 2.2], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr-disp", "dorr", [-3.19, 0, 2.0], rot=90, gar_till="disponenten", interaktiv=ia("Till disponentens rum", "Dörren till disponentens rum, där de andra väntar.")),
    obj("dorr-ut", "dorr", [1.9, 0, 2.59], rot=180, gar_till="gruvbacken", interaktiv=ia("Ut på gruvbacken", "Ytterdörren ut mot gruvbacken och laven.")),
    obj("l1", "vagglampa", [3.18, 2.1, -0.6], rot=-90, styrka=1.1, rackvidd=5),
    obj("l2", "vagglampa", [-0.6, 2.2, 2.58], rot=180, styrka=1.0, rackvidd=5),
  ]}}}

# ---------- Rum 2: Disponentens rum ----------
disp = {"id": "disponenten", "namn": "Disponentens rum", "mekanik": "scen", "last_upp_av": ["f-ladan"],
  "last_text": "Strand: ”Lådan först. Sedan pratar vi med de andra.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 5.6, "djup": 4.8, "hojd": 2.9, "miljo": "inomhus", "bakgrund": "#120e0a", "dimma": [7, 16, "#16110c"],
  "golv": "#4a3020", "verklig_golv": "fiskben", "tapet": {"grund": "#4a4a3a", "monster": "#3e3e30"}, "panel": "#3a2a1a",
  "ljus": INNE,
  "start": {"pos": [1.9, 1.5], "titta": 50},
  "objekt": [
    obj("matta", "matta", [0, 0, 0.2], storlek=[3.0, 2.2], kollision=False),
    obj("skrivbord", "bord", [-0.2, 0, -1.5], storlek=[1.7, 0.76, 0.8]),
    obj("lampa", "oljelampa", [0.4, 0.77, -1.6], ljus=True, styrka=2.2),
    obj("brandel", "person", [-0.2, 0, -2.0], rot=10, rock="#2a2a30", byxor="#2a2a30", slips="#5a1a22", har="#9a9a9a", skagg=True, seed=63,
        interaktiv=ia("Disponent Brandel", "Gustaf Brandel står bakom skrivbordet med händerna på ryggen. ”Jag var i Örebro på länsstyrelsen i förmiddags och tog middagståget hem. Herr Kessler satt i samma kupé. Tjugo över tre visade jag honom ritkontoret, och fröken Holm tog en bild av oss åt jubileumsboken – här är kopian. Halv fyra blev jag kallad till telefon, och fröken Lindgren hade jag skickat till magasinet efter pärmar. Herr Kessler fick vänta ensam där inne. Det var dumt av mig.”", material=["bild-c"])),
    obj("besoksboken", "liggare", [-0.7, 0.77, -1.4], rot=10, interaktiv=ia("Besöksboken",
        "Kontorets besöksbok ligger på skrivbordet. Dagens enda rad: ”8/3 kl. 13.05. Herr O. Kessler, Rheinhausen. Anlände med disponenten med tåget från Örebro 12.52.” Instuckna i boken sitter två tågbiljetter, Örebro–Storberget, klippta av konduktören i dag.", "f-taget")),
    obj("kessler", "person", [-1.9, 0, 0.5], rot=70, rock="#1a1a1e", byxor="#2a2a2e", slips="#6a6a6a", har="#c8b070", seed=64,
        interaktiv=ia("Herr Kessler", "Otto Kessler bugar lätt. ”Jag kom med tåget tolv och femtiotvå, tillsammans med Herr Disponenten. Jag väntade i ritkontoret från halv fyra till kvart över fyra, det är riktigt. Jag satt på stolen vid ritbordet och läste min tidning. Skåpet rörde jag inte. När jag gick kom den unga damen tillbaka med sina pärmar.”", "f-kessler-vantade")),
    obj("stol1", "fatolj", [-2.1, 0, -0.9], rot=60),
    obj("portfoljen", "vaska", [-2.1, 0.42, -0.9], interaktiv=ia("Herr Kesslers portfölj",
        "Portföljen står öppen på fåtöljen; herr Kessler har själv bett er titta. Överst ligger en Leica i läderfodral. Räkneverket står på 3. ”Stationen, laven och hotellet”, säger han. ”Minnen.” Strand nickar. ”Vi framkallar filmen. Men tre bilder räcker inte till åtta blad.”", "f-kessler-kamera")),
    obj("elsa", "person", [1.5, 0, -0.3], rot=-40, kon="k", rock="#6a3a2a", har="#2a1a10", seed=65,
        interaktiv=ia("Fotograf Holm", "Elsa Holm har lagt upp sina kopior på bordet, ännu fuktiga från mörkrummet, och slår upp sin fotojournal. ”Jag skriver upp varje plåt. Kvart över nio tog jag ritkontoret, med fröken Lindgren vid ritbordet. Sedan gick ingenjör Falk och jag raka vägen till laven och åkte ned – jag tog sex plåtar där nere. Vi kom upp halv tolv, och tjugo i tolv tog jag ritkontoret en gång till, för ljusets skull. Fröken Lindgren var på väg ut på lunch och ville inte vara med. Varsågod, ta dem.”",
          "f-fotojournal", ["bild-a", "bild-b"])),
    obj("fotobord", "bord", [2.2, 0, -0.6], storlek=[0.7, 0.74, 1.2]),
    *[obj(f"kopia{i}", "papper", [2.2, 0.75, z], rot=r) for i, (z, r) in enumerate([(-0.95, 10), (-0.6, -15), (-0.25, 5)])],
    obj("portratt", "tavla", [-0.2, 1.9, -2.38], storlek=[0.8, 1.0], motiv="portratt", seed=33),
    obj("hylla", "bokhylla", [2.55, 0, 1.6], rot=-90, storlek=[1.4, 2.2]),
    obj("fonster", "dagfonster", [-2.79, 0, 1.0], rot=90, natt=True),
    obj("klocka", "vaggur", [1.6, 1.95, -2.38]),
    obj("bord3", "bord", [0.6, 0, 1.8], storlek=[0.7, 0.74, 0.5]),
    obj("bok", "anteckningsbok", [0.6, 0.75, 1.8], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [2.79, 0, 0.6], rot=-90, gar_till="ritkontoret", interaktiv=ia("Till ritkontoret", "Tillbaka till ritkontoret.")),
    obj("l1", "vagglampa", [-2.78, 2.1, -1.0], rot=90, styrka=1.0, rackvidd=5),
  ]}}}

# ---------- Rum 3: Gruvbacken ----------
backen = {"id": "gruvbacken", "namn": "Gruvbacken", "mekanik": "scen", "last_upp_av": ["f-ladan"],
  "last_text": "Strand: ”Lådan först. Sedan pratar vi med de andra.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 12.0, "djup": 10.0, "hojd": 12.0, "miljo": "inomhus", "vagg": "fasad", "fasadfarg": "#7a4a3a", "tak": False, "panel": False, "sno": 800,
  "bakgrund": "#0c111c", "dimma": [9, 28, "#141a26"], "golv": {"typ": "sno"},
  "ljus": {"omgivning": "#9fb0d0", "omgivning_styrka": 0.6, "bas": 0.3},
  "start": {"pos": [1.6, 3.6], "titta": 15},
  "objekt": [
    obj("laven", "gruvlave", [0, 0, -3.0], interaktiv=ia("Laven",
        "Laven reser sig över schaktet, med linhjulen högt där uppe. Härifrån går hissen ned i gruvan, etthundrafemtio meter. Det finns ingen annan väg upp eller ned.")),
    obj("lykta1", "gaslykta", [-2.6, 0, -1.2], styrka=3.2),
    obj("lykta2", "gaslykta", [3.4, 0, 2.2], styrka=2.8),
    obj("pulpet", "pulpet", [-1.9, 0, -1.9], rot=20),
    obj("nedfartsboken", "liggare", [-1.9, 1.12, -1.9], rot=20, interaktiv=ia("Nedfartsboken",
        "Hissmaskinistens bok ligger på pulpeten vid lavens port, med en rad för var och en som åker ned eller upp. Måndag 8 mars: ”09.30 ned: ing. Falk, fotograf Holm. 11.30 upp: ing. Falk, fotograf Holm.” Båda raderna är signerade V. Ek.", "f-nedfart")),
    obj("ek", "person", [-0.9, 0, -1.3], rot=25, rock="#3a3a34", byxor="#2a2a26", hatt="mossa", hattfarg="#2a2a26", har="#5a4a3a", skagg=True, seed=66,
        interaktiv=ia("Hissmaskinist Ek", "Verner Ek slår ut med handen mot laven. ”Ingen kommer ned eller upp utan att jag kör hissen, och jag skriver upp var och en. Ingenjören och fotografen åkte ned halv tio och kom upp halv tolv. Fröken med kameran var blå om näsan. Däremellan stod korgen stilla.”")),
    obj("storm", "person", [2.6, 0, 1.2], rot=-25, rock="#4a3a2a", byxor="#3a3026", hatt="mossa", hattfarg="#3a3026", har="#8a8a8a", skagg=True, seed=67,
        interaktiv=ia("Vaktmästare Storm", "Albin Storm ställer ifrån sig vedkorgen. ”Halv elva bar jag in ved till ritkontoret, för låren var tom. Fröken Lindgren satt inte vid ritbordet. Hon stod vid det lilla bordet intill, och rullgardinen var nerdragen mitt på blanka förmiddagen – solen bländade i snön, sa hon. Jag tömde korgen och gick. En minut, inte mer. Nycklar till skåpen där inne har jag aldrig haft; jag har pannrummet och vedboden.”", "f-storm")),
    obj("vedkorg", "vedlar", [3.1, 0, 0.8], rot=30),
    obj("vagn", "malmvagn", [3.6, 0, -2.6], rot=10),
    obj("trampat", "trampad_sno", [-1.2, 0, -1.2], storlek=3.0, seed=4),
    *[obj(f"stig{i}", "trampad_sno", [x, 0, z], storlek=1.5, seed=7 + i) for i, (x, z) in enumerate([(0.2, 0.3), (0.9, 1.7), (1.5, 3.2), (2.3, 1.6)])],
    obj("bord", "bord", [-3.6, 0, 2.6], storlek=[0.8, 0.74, 0.5]),
    obj("bok", "anteckningsbok", [-3.6, 0.75, 2.6], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [1.6, 0, 4.99], rot=180, gar_till="ritkontoret", interaktiv=ia("In i ritkontoret", "Tillbaka in i värmen i ritkontoret.")),
    obj("skylt", "skylt", [1.6, 2.5, 4.98], rot=180, text="STORBERGETS GRUFAKTIEBOLAG · KONTOR", storlek=[2.0, 0.24], textstorlek=34, grund="#2a1a0e", farg="#e8c878"),
  ]}}}

# ---------- Fotografierna ----------
A = V(remsa="vanster", ved="tom", gardin="uppe", utsikt="lave", lampa="ritbord", klocka="09.15", person="ritare")
B = V(remsa="hoger", ved="full", gardin="nere", utsikt="dold", lampa="kopiebord", klocka="11.40", person="ingen")
C = V(remsa="hoger", ved="full", gardin="uppe", utsikt="lave", lampa="ritbord", klocka="15.20", person="besok")
D = V(remsa="bruten", ved="full", gardin="uppe", utsikt="lave", lampa="ritbord", klocka="16.35", person="ingenjor")
bilder = {"id": "bilderna", "namn": "Fotografierna", "mekanik": "bildjamforelse", "payload": {
  "kort_instruktion": "Jämför fotografierna två och två.",
  "instruktion": "Fotografen tog fyra bilder av ritkontoret under dagen, alla från samma plats. Välj två bilder i remsan och tryck på en detalj som skiljer dem åt. Alla skillnader är inte viktiga, och tiden mellan bilderna spelar roll: jämför helst bilder som ligger nära varandra. Fel tryck kostar ingenting.",
  "bilder": [
    {"id": "bild-a", "ordning": 1, "tid": "09.15", "kort": "Morgon", "titel": "Ritkontoret på morgonen", "kalla": "Elsa Holms plåt nr 2", "motiv": "ritkontor", "varden": A},
    {"id": "bild-b", "ordning": 2, "tid": "11.40", "kort": "Före lunch", "titel": "Ritkontoret före lunch", "kalla": "Elsa Holms plåt nr 9", "motiv": "ritkontor", "varden": B},
    {"id": "bild-c", "ordning": 3, "tid": "15.20", "kort": "Besöket", "titel": "Disponenten visar herr Kessler ritkontoret", "kalla": "Elsa Holms plåt nr 12", "motiv": "ritkontor", "varden": C},
    {"id": "bild-d", "ordning": 4, "tid": "16.35", "kort": "Efteråt", "titel": "Skåpet efter upptäckten", "kalla": "Elsa Holms plåt nr 13", "motiv": "ritkontor", "varden": D},
  ],
  "upptackter": [
    {"id": "u-flyttad", "region": "remsa", "varden": ["vanster", "hoger"], "bilder": ["bild-a", "bild-b"], "kraver": ["bild-a", "bild-b"], "ger_fynd": "f-omforseglad",
     "narmare": "Förseglingsremsan sitter på olika sidor om handtaget på de här två bilderna. Men när bytte den sida? Jämför två bilder som ligger närmare varandra i tid.",
     "text": "Kl. 09.15 sitter förseglingsremsan till vänster om handtaget på låda sju. Kl. 11.40 sitter den till höger. Det är inte samma remsa: lådan har öppnats och förseglats om mellan 09.15 och 11.40."},
    {"id": "u-bruten", "region": "remsa", "varden": ["hoger", "bruten"], "bilder": ["bild-c", "bild-d"], "kraver": ["bild-c", "bild-d"], "ger_fynd": "f-bruten-sent",
     "narmare": "Remsan är hel på den ena bilden och avsliten på den andra. Jämför med den sista bilden där den fortfarande är hel.",
     "text": "Kl. 15.20 sitter remsan hel, till höger om handtaget. Kl. 16.35 är den avsliten och lådan står på glänt. Remsan slets av mellan 15.20 och 16.35."},
    {"id": "u-ved", "region": "ved", "varden": ["tom", "full"], "bilder": ["bild-a", "bild-b"], "kraver": ["bild-a", "bild-b"], "ger_fynd": "f-ved",
     "narmare": "Vedlåren är tom på den ena bilden och full på den andra. Jämför två bilder som ligger närmare varandra i tid.",
     "text": "Kl. 09.15 är vedlåren vid kaminen tom. Kl. 11.40 är den full. Någon bar in ved till ritkontoret under förmiddagen."},
    {"id": "u-gardin", "region": "gardin", "varden": ["uppe", "nere"], "kraver": ["bild-b"], "ger_fynd": "f-gardin",
     "text": "På bilden kl. 11.40 är mörkläggningsgardinen nerdragen, mitt på förmiddagen. På de andra bilderna är den uppe, och mörkläggningen börjar inte förrän i skymningen."},
    {"id": "u-lampa", "region": "lampa", "varden": ["ritbord", "kopiebord"], "kraver": ["bild-b"], "ger_fynd": "f-lampan",
     "text": "På bilden kl. 11.40 är ritbordslampan vriden bort från ritbordet. Den är tänd och lyser rakt ned på det lilla bordet intill. På de andra bilderna sitter den över ritbordet."},
  ],
  "regioner": {
    "remsa": {"narmare": "Remsan ser inte likadan ut på de här två bilderna, men mer än en sak har hänt med den under dagen. Jämför två bilder som ligger närmare varandra i tid.", "lika": "Förseglingsremsan sitter likadant på båda bilderna."},
    "ved": {"lika": "Vedlåren ser likadan ut på båda bilderna."},
    "gardin": {"lika": "Gardinen är uppe på båda bilderna."},
    "lampa": {"lika": "Lampan sitter över ritbordet på båda bilderna."},
    "utsikt": {"oviktig": "Utsikten mot laven syns inte när gardinen är nere. Titta på gardinen i stället.", "lika": "Samma utsikt mot laven på båda bilderna."},
    "klocka": {"oviktig": "Väggklockan visar samma tid som fotografen har skrivit i sin journal. Bilderna är tagna när hon säger."},
    "person": {"oviktig": "Det är olika personer i bild. Fotografens journal och de som var med säger vilka de är."},
    "bakgrund": {"lika": "Här har ingenting ändrats."},
  }}}

fall["moment"] = [ritkontor, disp, backen, bilder]

fall["fynd"] = [
  {"id": "f-ladan", "titel": "Låda sju", "ikon": "🗄️", "typ": "bakgrund", "text": "Förseglingsremsan på låda sju är avsliten. Mappen med transportplanen ligger kvar, med alla åtta blad – men i fel ordning. Någon har haft planen framme utan att ta den."},
  {"id": "f-falk-remsa", "titel": "Falks försegling", "ikon": "✍️", "typ": "nyckel", "text": "Ingenjör Falk förseglade låda sju kl. 08.30, med remsan till vänster om handtaget som alltid. Kl. 16.30 fann han den avsliten."},
  {"id": "f-maj-ensam", "titel": "Fröken Lindgrens förmiddag", "ikon": "📐", "typ": "nyckel", "galler": ["maj", "storm"], "text": "Maj Lindgren säger att hon satt i ritkontoret hela förmiddagen, från nio till kvart i tolv, och att ingen rörde skåpet. Bara Storm var inne, en minut, med ved."},
  {"id": "f-kameran", "titel": "Reprokameran", "ikon": "📷", "typ": "nyckel", "galler": ["maj", "falk"], "text": "Kontorets reprokamera står i ett låst skåp med oskadat lås. Bara Falk och fröken Lindgren har nyckel. Räkneverket stod på 12 kl. 08.30 och står nu på 20: åtta bilder har tagits i dag, och filmen är utbytt. Planen har åtta blad."},
  {"id": "f-haftstift", "titel": "Hålen i det lilla bordet", "ikon": "📌", "typ": "stod", "text": "I det lilla bordet intill ritbordet sitter fyra färska hål efter häftstift, i en rektangel så stor som ett maskinskrivet ark. Papper har nålats fast där, ett i taget."},
  {"id": "f-kvittot", "titel": "Postkvittot", "ikon": "📮", "typ": "stod", "galler": ["maj"], "text": "I fröken Lindgrens kappficka ligger ett kvitto på ett rekommenderat brev, inlämnat i dag kl. 12.10, till fru A. Hansen i Charlottenberg vid norska gränsen."},
  {"id": "f-fotojournal", "titel": "Fotografens journal", "ikon": "📓", "typ": "bakgrund", "text": "Elsa Holm fotograferade ritkontoret kl. 09.15, 11.40, 15.20 och 16.35. Efter den första bilden gick hon och ingenjör Falk raka vägen till laven, och de kom tillbaka först 11.40. Då var fröken Lindgren på väg ut på lunch."},
  {"id": "f-taget", "titel": "Tåget från Örebro", "ikon": "🚂", "typ": "nyckel", "galler": ["kessler"], "text": "Disponent Brandel och herr Kessler kom till Storberget med tåget från Örebro kl. 12.52. Biljetterna är klippta i dag."},
  {"id": "f-kessler-vantade", "titel": "Kessler ensam i ritkontoret", "ikon": "🪑", "typ": "avledande", "galler": ["kessler"], "text": "Herr Kessler väntade ensam i ritkontoret från 15.30 till 16.15, medan disponenten satt i telefon och fröken Lindgren var i magasinet.", "forklaring": "Remsan slets av just då han satt där – men lådan var öppnad och omförseglad redan på förmiddagen, innan hans tåg hade kommit."},
  {"id": "f-kessler-kamera", "titel": "Kesslers Leica", "ikon": "🎞️", "typ": "avledande", "galler": ["kessler"], "text": "Herr Kessler har en Leica i portföljen. Räkneverket står på 3.", "forklaring": "Tre bilder räcker inte till åtta blad, och planen kopierades med kontorets egen kamera – medan Kessler satt på tåget."},
  {"id": "f-nedfart", "titel": "Nedfartsboken", "ikon": "⛏️", "typ": "nyckel", "galler": ["falk", "elsa"], "text": "Hissmaskinistens bok: ingenjör Falk och fotograf Holm åkte ned i gruvan kl. 09.30 och kom upp kl. 11.30. Det finns ingen annan väg upp."},
  {"id": "f-storm", "titel": "Storm med veden", "ikon": "🪵", "typ": "nyckel", "galler": ["storm", "maj"], "text": "Vaktmästare Storm bar in ved kl. 10.30 och var inne en minut. Fröken Lindgren stod då vid det lilla bordet, och mörkläggningsgardinen var nerdragen. Storm har inga nycklar till skåpen i ritkontoret."},
  {"id": "f-omforseglad", "titel": "Remsan har bytt sida", "ikon": "🔁", "typ": "nyckel", "text": "På bilden 09.15 sitter remsan till vänster om handtaget, på bilden 11.40 till höger. Låda sju öppnades och förseglades om mellan 09.15 och 11.40."},
  {"id": "f-bruten-sent", "titel": "Remsan avsliten på eftermiddagen", "ikon": "✂️", "typ": "stod", "text": "På bilden 15.20 är remsan hel, på bilden 16.35 avsliten. Den slets av mellan 15.20 och 16.35."},
  {"id": "f-ved", "titel": "Vedlåren fylldes", "ikon": "🔥", "typ": "stod", "galler": ["storm"], "text": "Vedlåren var tom 09.15 och full 11.40. Någon bar in ved under förmiddagen, som Storm säger."},
  {"id": "f-gardin", "titel": "Gardinen nere på förmiddagen", "ikon": "🪟", "typ": "stod", "text": "Kl. 11.40 var mörkläggningsgardinen nerdragen, fast det var ljust ute. Ingen såg in i ritkontoret från gruvbacken."},
  {"id": "f-lampan", "titel": "Lampan över det lilla bordet", "ikon": "💡", "typ": "stod", "text": "Kl. 11.40 var ritbordslampan vriden så att den lyste rakt ned på det lilla bordet – där häftstiftshålen sitter."},
  {"id": "f-brottstid", "titel": "Planen kopierades på förmiddagen", "ikon": "⏱️", "typ": "nyckel", "text": "Falk satte remsan till vänster kl. 08.30, och där satt den 09.15. Kl. 11.40 satt en ny remsa till höger. Låda sju öppnades mellan 09.15 och 11.40."},
  {"id": "f-iscensatt", "titel": "Eftermiddagen var en kuliss", "ikon": "🎭", "typ": "stod", "text": "Remsan slets av på eftermiddagen för att det skulle se ut som om lådan öppnades då – när herr Kessler satt ensam i ritkontoret."},
]

fall["slutsatser"] = [
  {"id": "s-nar", "kraver": ["f-falk-remsa", "f-omforseglad"], "ger_fynd": "f-brottstid", "fraga": "När öppnades låda sju?", "alternativ": [
    {"text": "Mellan 15.20 och 16.35, när remsan slets av.", "svar": "Då slets remsan av. Men vilken remsa? Falk satte sin till vänster om handtaget."},
    {"text": "Före 08.30, innan Falk förseglade den.", "svar": "På bilden 09.15 sitter Falks egen remsa kvar, till vänster. Då var lådan orörd."},
    {"text": "Mellan 09.15 och 11.40 – då byttes Falks remsa mot en ny, på fel sida.", "ratt": True}],
   "slutsats": "Lådan öppnades mellan 09.15 och 11.40. Remsan som slets av på eftermiddagen var redan en ny."},
  {"id": "s-sent", "kraver": ["f-bruten-sent", "f-kessler-vantade"], "efter": ["s-nar"], "ger_fynd": "f-iscensatt", "fraga": "Lådan var redan öppnad och omförseglad på förmiddagen. Varför slets remsan av på eftermiddagen?", "alternativ": [
    {"text": "Någon öppnade lådan en gång till för att kopiera resten.", "svar": "Räkneverket visar åtta bilder, och planen har åtta blad. Allt var redan kopierat."},
    {"text": "För att det skulle se ut som om det hände då – när herr Kessler satt ensam där.", "ratt": True},
    {"text": "Remsan lossnade av sig själv.", "svar": "Den är avsliten på mitten, och lådan står på glänt."}],
   "slutsats": "Den avslitna remsan var en kuliss som pekade ut eftermiddagen och herr Kessler."},
  {"id": "s-kessler", "kraver": ["f-taget", "f-kessler-kamera"], "efter": ["s-nar"], "fraga": "Herr Kessler har en kamera och satt ensam i ritkontoret. Kan han ha kopierat planen?", "alternativ": [
    {"text": "Ja – han hade både tillfälle och kamera.", "svar": "På eftermiddagen, ja. Men när öppnades lådan – och var var han då?"},
    {"text": "Nej – lådan öppnades på förmiddagen, och hans tåg kom 12.52.", "ratt": True}],
   "slutsats": "Kessler kan uteslutas. Han satt på tåget från Örebro när lådan öppnades."},
  {"id": "s-gruvan", "kraver": ["f-nedfart", "f-kameran", "f-fotojournal"], "efter": ["s-nar"], "fraga": "Ingenjör Falk har nyckel till kameraskåpet, och fotografen har egna kameror. Kan någon av dem ha gjort det?", "alternativ": [
    {"text": "Ja – Falk kunde öppna både lådan och kameraskåpet.", "svar": "Var var han mellan 09.15 och 11.40?"},
    {"text": "Ja – fotografen hade kamera med sig hela dagen.", "svar": "Var var hon mellan 09.15 och 11.40?"},
    {"text": "Nej – de gick till laven efter bilden 09.15, åkte ned 09.30 och kom upp 11.30.", "ratt": True}],
   "slutsats": "Falk och fotografen kan uteslutas. De var nere i gruvan nästan hela tiden, och resten av tiden tillsammans."},
  {"id": "s-kamera", "kraver": ["f-kameran", "f-ladan"], "fraga": "Hur kopierades planen?", "alternativ": [
    {"text": "Den skrevs av för hand.", "svar": "Åtta maskinskrivna blad med tider och siffror tar timmar att skriva av."},
    {"text": "Den fotograferades med kontorets reprokamera: åtta bilder, åtta blad.", "ratt": True},
    {"text": "Den bars ut ur kontoret och lämnades tillbaka.", "svar": "Räkneverket på kontorets egen kamera har gått från 12 till 20 i dag."}],
   "slutsats": "Planen fotograferades blad för blad med reprokameran. Den som gjorde det hade nyckel till kameraskåpet."},
  {"id": "s-storm", "kraver": ["f-storm", "f-kameran"], "efter": ["s-nar"], "fraga": "Vaktmästare Storm var i ritkontoret på förmiddagen. Kan han ha gjort det?", "alternativ": [
    {"text": "Ja – han var där inne just under den tid det gäller.", "svar": "En minut, med en vedkorg. Och med vilken kamera?"},
    {"text": "Nej – han var inne en minut och har ingen nyckel till kameraskåpet.", "ratt": True}],
   "slutsats": "Storm kan uteslutas. Han bar in ved och gick, och kameraskåpet kan han inte öppna."},
  {"id": "s-maj", "kraver": ["f-maj-ensam"], "efter": ["s-nar", "s-kamera"], "fraga": "Fröken Lindgren säger att hon satt i ritkontoret hela förmiddagen och att ingen rörde skåpet. Vad betyder det?", "alternativ": [
    {"text": "Att lådan inte kan ha öppnats på förmiddagen.", "svar": "Fotografierna visar att den öppnades då. Remsan bytte sida."},
    {"text": "Att någon smög in utan att hon märkte det.", "svar": "Åtta blad skulle nålas fast och fotograferas, tre meter från hennes stol."},
    {"text": "Att hon själv var den enda som kunde göra det – och hon har nyckel till kameran.", "ratt": True}],
   "slutsats": "Lådan öppnades medan Maj Lindgren, med egna ord, satt ensam i rummet. Hon har nyckel till kameraskåpet."},
]

fall["losning"] = {"skyldig": "maj", "hur": "repro",
  "hur_text": "På förmiddagen, när Falk och fotografen var nere i gruvan, drog Maj Lindgren ner mörkläggningsgardinen, öppnade låda sju, nålade fast planens åtta blad ett i taget på det lilla bordet och fotograferade dem med kontorets reprokamera. Sedan klistrade hon en ny remsa över lådan – till höger om handtaget. På eftermiddagen slet hon av den, så att det skulle se ut som om herr Kessler hade öppnat lådan.",
  "bevisgrupper": [["f-brottstid", "f-maj-ensam", "f-kameran"], ["f-brottstid", "f-maj-ensam"], ["f-brottstid", "f-kameran", "f-nedfart"], ["f-omforseglad", "f-maj-ensam", "f-kameran"], ["f-brottstid", "f-storm", "f-kameran"]],
  "uteslutningar": {"falk": ["f-nedfart", "f-brottstid"], "elsa": ["f-nedfart", "f-brottstid"], "kessler": ["f-taget", "f-brottstid"], "storm": ["f-storm", "f-kameran"]},
  "uteslutningar_text": {
    "falk": "Falk gick till laven efter bilden 09.15, åkte ned 09.30 och kom upp 11.30. Lådan öppnades medan han var nere i gruvan.",
    "elsa": "Fotografen var nere i gruvan tillsammans med Falk från 09.30 till 11.30.",
    "kessler": "Kessler kom med tåget 12.52. Lådan öppnades och förseglades om före 11.40.",
    "storm": "Storm var inne en minut med ved och har ingen nyckel till kameraskåpet."}}
fall["anklagelse"] = {"hur_fraga": "Hur och när kopierades planen?", "hur_alternativ": [
    {"id": "leica", "text": "På eftermiddagen, med en egen kamera, när remsan slets av"},
    {"id": "repro", "text": "På förmiddagen, med kontorets reprokamera – och lådan förseglades om"},
    {"id": "gruvan", "text": "Mappen bars ut ur kontoret och kopierades någon annanstans"},
    {"id": "natten", "text": "Tidigt i morse, innan lådan förseglades"}], "hur_kravs": False, "bevis_max": 3}
fall["ledtradar"] = [
  {"niva": 1, "kostnad": 10, "kraver": ["f-ladan", "f-falk-remsa", "bild-a", "bild-b", "bild-c", "bild-d"], "text": "Samla alla fyra fotografierna och fråga ingenjör Falk exakt hur han förseglade lådan. Titta sedan på låda sju på varje bild, i tur och ordning. Sitter remsan likadant hela dagen?"},
  {"niva": 2, "kostnad": 25, "kraver": ["f-omforseglad", "f-nedfart", "f-taget", "f-kameran"], "text": "Remsan bytte sida mellan 09.15 och 11.40. Det är den tiden som räknas – inte eftermiddagen. Vilka var över huvud taget i kontoret då? Titta i nedfartsboken och besöksboken, och ta reda på vilken kamera som har tagit åtta bilder i dag."},
  {"niva": 3, "kostnad": 50, "kraver": ["f-brottstid", "f-maj-ensam", "f-storm", "f-kameran"], "text": "Under förmiddagen var två personer i ritkontoret. Den ena bar in ved och gick efter en minut. Den andra säger själv att hon satt där hela tiden – och bara två personer har nyckel till kameraskåpet, varav den ene var nere i gruvan."}]
fall["aterkoppling"] = {
  "ratt": "Den avslitna remsan pekade på eftermiddagen och på herr Kessler. Men fotografen hade redan tagit en bild för mycket: tjugo i tolv satt remsan på fel sida om handtaget, gardinen var nere och lampan lyste över det lilla bordet. Maj Lindgrens fästman Arne Hansen är norrman och sitter i tyskt fångläger. Filmen låg i brevet till hans mor i Charlottenberg, och den skulle vidare över gränsen till dem som spränger järnvägar. ”Det är deras kanoner som görs av vår malm”, sa hon till Strand. Han svarade inte på en lång stund. ”Det må så vara, fröken Lindgren. Men lagen frågar inte åt vilket håll en hemlighet reser.” Brevet stoppades på posten i Charlottenberg samma kväll.",
  "fel": {
    "falk": "Ingenjören har nyckel till allt – men han var hundrafemtio meter under jord när remsan bytte sida.",
    "elsa": "Fotografen hade kameror nog, men hon stod i gruvan med ingenjören och frös. Nedfartsboken har båda namnen.",
    "kessler": "Herr Kessler rätar på sig. ”Jag satt i ert tåg från Örebro, Herr Kommissar, tillsammans med Herr Disponenten.” Remsan bytte sida före lunch.",
    "storm": "Storm bar in en korg ved och gick. Kameraskåpet har han aldrig haft nyckel till."},
  "fel_allman": "Kommissarie Strand ser länge på fotografierna …",
  "forklaring_steg": [
    {"text": "Falk förseglade låda sju 08.30 med remsan till vänster om handtaget. På bilden 09.15 sitter den där. På bilden 11.40 sitter en remsa till höger. Lådan öppnades och förseglades om mellan 09.15 och 11.40.", "fynd": ["f-falk-remsa", "f-omforseglad", "f-brottstid"]},
    {"text": "Remsan slets av mellan 15.20 och 16.35, när herr Kessler hade suttit ensam i ritkontoret. Det var en kuliss: allt var redan kopierat.", "fynd": ["f-bruten-sent", "f-kessler-vantade", "f-iscensatt"]},
    {"text": "Planen fotograferades med kontorets reprokamera: räkneverket gick från 12 till 20, och planen har åtta blad. Bara Falk och fröken Lindgren har nyckel. Bladen nålades fast på det lilla bordet, under lampan, med gardinen nerdragen.", "fynd": ["f-kameran", "f-haftstift", "f-lampan", "f-gardin"]},
    {"text": "Falk och fotografen var nere i gruvan 09.30–11.30. Kessler och disponenten kom med tåget 12.52. Storm bar in ved 10.30 och var inne en minut, utan nyckel.", "fynd": ["f-nedfart", "f-taget", "f-storm", "f-ved"]},
    {"text": "Maj Lindgren säger själv att hon satt i ritkontoret hela förmiddagen och att ingen rörde skåpet. Då var det hon. Filmen postade hon 12.10, till Charlottenberg vid norska gränsen.", "fynd": ["f-maj-ensam", "f-kvittot"]}]}

# Miljöljud per rum (se js/ljud.js)
LJUD = {"ritkontoret": ["brasa", {"typ": "tick", "styrka": 0.4}], "disponenten": [{"typ": "tick", "styrka": 0.4}], "gruvbacken": [{"typ": "vind", "styrka": 0.5}]}
for m in fall["moment"]:
  if m["id"] in LJUD and "rum" in m["payload"]: m["payload"]["rum"]["ljud"] = LJUD[m["id"]]

TEXT_I = {"ritkontoret": "i ritkontoret", "disponenten": "i disponentens rum", "gruvbacken": "på gruvbacken"}
for m in fall["moment"]:
  if m["id"] in TEXT_I: m["text_i"] = TEXT_I[m["id"]]

ut = os.path.join(os.path.dirname(__file__), '..', '..', 'fall', 'lada-sju.json')
json.dump(fall, open(ut, 'w'), ensure_ascii=False, indent=2)
print('skrev', os.path.normpath(ut))
