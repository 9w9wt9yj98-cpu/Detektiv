# Genererar fall/brudskalen.json (källan för fallet – redigera här och kör om).
import json, os
T = True
def obj(id, typ, pos, **kw):
    d = {"id": id, "typ": typ, "pos": pos}; d.update(kw); return d
def ia(namn, text, fynd=None, material=None):
    d = {"namn": namn, "text": text}
    if fynd: d["ger_fynd"] = fynd
    if material: d["ger_material"] = material
    return d

fall = {"id": "brudskalen", "version": 1,
 "meta": {"titel": "Brudskålen", "miljo": "Släktgård i Leksand", "epok": "Nutid", "brottstyp": "stöld", "langd": "medel",
   "uppskattad_tid_min": [10, 15], "svarighet": 3, "karnmekanik": "bildjamforelse", "bimekaniker": ["scen"], "twist": "offret-ar-garningsman", "kraver_rang": 0,
   "accentfarg": "#3a5a3a", "omslag": "bilder/fall4/garden.jpg", "mal": "Ta reda på vem som tog brudskålen – och när", "handledning_mal": "skanken"},
 "intro": {"rubrik": "Midsommarafton på Sahlins gård, Leksand.",
   "text": "Midsommarstången är rest, sillen är uppäten och dragspelet har tystnat. Gunnar Sahlin har ringt polisen: hans 1700-talsskål i silver, Brudskålen, är stulen från skänken i salen – mitt under festen.\n\n”Jag såg den halv fem, med sin gamla buckla på kanten”, säger han. ”Kvart i sex var den borta.”\n\nKriminalinspektör Nils Strand – samma Strand, men i ett annat sekel – är på semester i Leksand och har lovat att titta förbi. ”Tjugofem gäster med mobilkameror”, säger hen och ler. ”Det har ingen tjuv haft förr. Be om deras bilder, och jämför dem noga.”",
   "uppdrag": "Vem tog brudskålen – och när försvann den egentligen?", "bild": "bilder/fall4/garden.jpg", "berattare": "Kriminalinspektör Nils Strand"},
 "personer": [
   {"id": "gunnar", "namn": "Gunnar Sahlin", "roll": "Gårdens ägare, anmälde stölden", "misstankt": T, "beskrivning": "Stolt över gården och över skålen, som gått i släkten sedan 1760-talet."},
   {"id": "lena", "namn": "Lena Sahlin", "roll": "Gunnars fru", "misstankt": T, "beskrivning": "Hämtade sin mor på Arlanda under dagen."},
   {"id": "mikael", "namn": "Mikael Ström", "roll": "Antikhandlare, gäst", "misstankt": T, "beskrivning": "Kan silver. Gick tidigt från festen med en stor väska."},
   {"id": "olle", "namn": "Olle Sahlin", "roll": "Brorson, 19 år", "misstankt": T, "beskrivning": "Bar ut tårtan. Stod länge vid skänken."},
   {"id": "karin", "namn": "Karin Berglund", "roll": "Granne och gäst", "misstankt": False, "beskrivning": "Fotograferar allt. Var först in i salen."},
   {"id": "birgitta", "namn": "Birgitta Sahlin", "roll": "Lenas syster, stod för maten", "misstankt": False, "beskrivning": "Märkte först att skålen var borta."}
 ]}

# ---------- Salen ----------
salen = {"id": "salen", "namn": "Salen", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 7.0, "djup": 6.0, "hojd": 2.8, "miljo": "inomhus", "bakgrund": "#e8e0cc", "dimma": [10, 24, "#e8e0cc"],
  "golv": "#b8946a", "tapet": {"grund": "#ece4d0", "monster": "#d6c8a8"}, "panel": "#cfc4a8",
  "ljus": {"omgivning": "#fff4dc", "omgivning_styrka": 0.95, "bas": 0.5},
  "start": {"pos": [-1.1, 0.7], "titta": 8},
  "objekt": [
    obj("matta", "matta", [0.9, 0, 1.2], storlek=[2.6, 3.8], kollision=False),
    obj("skank", "skank", [0, 0, -2.7], storlek=[1.8, 0.95, 0.5]),
    obj("skanken", "skal", [0, 0.95, -2.7], tom=True, halostorlek=0.4, halo=[0, 1.15, -2.62], interaktiv=ia("Skänken",
        "Platsen där brudskålen stod. I det tunna lagret damm på skänken syns en ljus ring efter skålens fot. Vasen och ljusstaken står kvar.", "f-tom-plats")),
    obj("vas", "vas", [-0.62, 0.95, -2.7]),
    obj("ljusstake", "ljusstake", [0.62, 0.95, -2.7], ljus=True, styrka=0.8),
    obj("fonster", "dagfonster", [0, 0, -2.99], y0=1.15, hojd=1.15, bredd=1.0, gardin=True, dragen=True),
    obj("fonster2", "dagfonster", [-3.49, 0, -0.6], rot=90, gardin=True),
    obj("fonster3", "dagfonster", [-3.49, 0, 1.6], rot=90, gardin=True),
    obj("langbord", "langbord", [1.1, 0, 1.3], rot=90, storlek=[1.1, 0.76, 3.0], kuvert=8, stolar=True),
    obj("bok", "anteckningsbok", [0.2, 0.77, 1.5], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dalahast", "dalahast", [1.7, 0.77, 1.2]),
    obj("blommor", "vas", [1.1, 0.77, 1.15]),
    obj("tavla", "tavla", [-3.48, 1.55, 0.5], rot=90, storlek=[0.7, 0.5], seed=12),
    obj("gunnar", "person", [-1.7, 0, -1.3], rot=40, rock="#e8e4d8", byxor="#3a4a5a", har="#9a9a96", glasogon=True, seed=2,
        interaktiv=ia("Gunnar Sahlin", "Gunnar är röd om kinderna. ”Jag såg den halv fem, med sin gamla buckla på kanten – den har haft den sedan farfars tid. Kvart i sex var den borta! Jag var ensam här på gården hela förmiddagen och fixade inför festen, ingen kunde ha kommit åt den då.”", ["f-gunnar-anmalan", "f-gunnar-ensam"])),
    obj("olle", "person", [2.3, 0, -1.2], rot=-60, rock="#2a3a5a", byxor="#3a3a40", har="#5a3a20", seed=4,
        interaktiv=ia("Olle Sahlin", "Olle skruvar på sig. ”Jag bar in tårtan vid fem och ställde mig vid skänken för att ta en bild åt faster. Skålen stod där när jag gick ut igen, det syns ju på bilden.” Han visar sin mobil.", material=["bild-d"])),
    obj("birgitta", "person", [-2.4, 0, 2.0], rot=200, kon="k", rock="#c8a0b0", har="#b89a6a", forklade=True, seed=1,
        interaktiv=ia("Birgitta Sahlin", "Birgitta torkar händerna på förklädet. ”Jag tog en bild på dukningen tjugo över fem – och då var skålen redan borta. Jag trodde Gunnar hade ställt undan den.”", material=["bild-e"])),
    obj("dorr-ut", "dorr", [-1.6, 0, 2.99], rot=180, farg="#2e4a3a", gar_till="garden", interaktiv=ia("Ut på gården", "Farstudörren ut mot gården och midsommarstången.")),
    obj("dorr-kontor", "dorr", [3.49, 0, -1.4], rot=-90, farg="#6a5a40", gar_till="kontoret", interaktiv=ia("Gunnars kontor", "Dörren till Gunnars lilla kontor.")),
  ]}}}

# ---------- Gården ----------
garden = {"id": "garden", "namn": "Gården", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 16.0, "djup": 14.0, "hojd": 3, "miljo": "ute", "bakgrund": "#cfdce0", "dimma": [18, 46, "#e6e6d4"], "gras": "#6a8a40",
  "grus": [[-1.6, -4.5, 2.2, 5], [0, 4.6, 15, 3.2]],
  "ljus": {"omgivning": "#fff6e0", "omgivning_styrka": 1.0, "bas": 0.45, "sol": 1.5},
  "start": {"pos": [-1.6, -5.4], "titta": 170},
  "objekt": [
    obj("hus", "hus", [0, 0, -7.0], bredd=9, dorr=False),
    obj("dorr-in", "dorr", [-1.6, 0, -6.98], farg="#2e4a3a", gar_till="salen", interaktiv=ia("In i salen", "Farstudörren in till salen.")),
    obj("stang", "midsommarstang", [3.2, 0, -0.5]),
    obj("kaffebord", "bord", [-3.6, 0, -1.6], rund=True, storlek=[1.1, 0.74, 1.1], duk=True),
    obj("stol1", "stolModern", [-3.6, 0, -0.85], rot=180),
    obj("stol2", "stolModern", [-4.35, 0, -1.6], rot=90),
    obj("lena", "person", [-3.6, 0, -0.85], rot=180, pose="sitta", kon="k", rock="#5a6a8a", har="#6a4a2a", seed=3,
        interaktiv=ia("Lena Sahlin", "”Jag åkte hemifrån halv nio för att hämta mamma på Arlanda – det är två och en halv timme dit. Mammas flyg var försenat, vi kom inte iväg förrän kvart i ett. Vi kom tillbaka precis när bussen hade kommit, strax efter kvart över tre.” Hon nickar mot den röda Volvon.", "f-lena-resa")),
    obj("mor", "person", [-4.35, 0, -1.6], rot=90, pose="sitta", kon="k", rock="#a05a6a", har="#d8d4cc", glasogon=True, seed=0),
    obj("karin", "person", [-2.4, 0, -0.9], rot=200, kon="k", rock="#e8d090", har="#8a5a3a", hatt="sjalett", hattfarg="#c8d8a0", seed=2,
        interaktiv=ia("Karin Berglund", "Karin håller upp mobilen. ”Jag var först in i salen när bussen kom, så jag tog en bild på skänken direkt – den är så vacker. Och en till efter kaffet.”", material=["bild-b", "bild-c"])),
    obj("volvo", "bil", [5.6, 0, -3.6], rot=200, farg="#8a2a22", regnr="LEK 619", interaktiv=ia("Lenas bil",
        "En röd Volvo. På instrumentbrädan ligger parkeringskvittot från Arlanda: infart 11.02, utfart 12.44.", "f-parkering")),
    obj("buss", "buss", [-1.5, 0, 5.4], rot=90, text="BERGSLAGSBUSS"),
    obj("korlogg", "parm", [3.9, 0.0, 4.0], farg="#3a3a3a", etikett="Körlogg", interaktiv=ia("Bussens körlogg",
        "Chauffören har lagt körloggen på trappsteget: ”Midsommarbeställning Sahlin. Avg. Leksands station 14.50 – ank. gården 15.14. 25 resenärer, samt catering (B. Sahlin).” Alla gästerna kom med bussen – Olle, Mikael och Karin står på listan.", "f-buss")),
    obj("mikael", "person", [6.0, 0, 1.6], rot=-110, rock="#3a3a44", byxor="#2a2a30", har="#2a2018", skagg=True, seed=1,
        interaktiv=ia("Mikael Ström", "”Jag gick tio i fem för att hinna till en auktion i Rättvik. Gunnar ringde och bad mig komma tillbaka. Väskan? Titta själv.”", "f-mikael-gick")),
    obj("vaska", "resvaska", [6.5, 0, 2.2], rot=-20, interaktiv=ia("Mikaels väska",
        "En stor läderväska. I den ligger en tom tårtbricka i silver som Mikael lånat ut till Birgitta – och en auktionskatalog. Ingen skål.", "f-mikael-vaska")),
    obj("bok", "anteckningsbok", [-3.3, 0.74, -1.85], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    *[obj(f"bjork{i}", "bjork", p, seed=i, hojd=5 + (i % 3)) for i, p in enumerate([[-6.8, 0, -4.5], [-7.0, 0, 1.5], [6.9, 0, -5.8], [7.0, 0, 5.6], [-6.6, 0, 6.2]])],
    obj("gran1", "gran", [-9.5, 0, -2]), obj("gran2", "gran", [9.8, 0, 2]),
    obj("gard1", "gardesgard", [-8.0, 0, 0], rot=90, langd=14), obj("gard2", "gardesgard", [8.0, 0, 0], rot=90, langd=14),
    obj("gard3", "gardesgard", [0, 0, 7.0], langd=16),
  ]}}}

# ---------- Kontoret ----------
kontoret = {"id": "kontoret", "namn": "Gunnars kontor", "mekanik": "scen", "last_upp_av": ["f-gunnar-anmalan"],
  "last_text": "Dörren är stängd. Det är Gunnars kontor – prata med honom först.",
  "payload": {"visning": "3d", "rum": {
  "bredd": 3.6, "djup": 3.4, "hojd": 2.5, "miljo": "inomhus", "bakgrund": "#e0dcc8", "dimma": [8, 18, "#e0dcc8"],
  "golv": "#a8845a", "tapet": {"grund": "#d4d8c0", "monster": "#bcc4a4"}, "panel": "#c8c0a0",
  "ljus": {"omgivning": "#fff4dc", "omgivning_styrka": 0.9, "bas": 0.5},
  "start": {"pos": [-0.8, 1.1], "titta": -22},
  "objekt": [
    obj("fonster", "dagfonster", [0.2, 0, -1.69], gardin=True),
    obj("skrivbord", "bord", [0.2, 0, -1.25], storlek=[1.4, 0.75, 0.7], farg="#8a6a44"),
    obj("stol", "stolModern", [0.2, 0, -0.6], rot=180, farg="#8a6a44"),
    obj("dator", "dator", [0.0, 0.75, -1.3], skarm="insta", halo=[0.0, 1.05, -1.3], interaktiv=ia("Gunnars dator",
        "Datorn står på. Gunnars Instagram är öppet: ett inlägg från i morse kl. 09.12 – ”Putsat brudskålen inför festen! 🌸”. Du sparar bilden.", material=["bild-a"])),
    obj("parmen", "parm", [0.6, 0.75, -1.2], etikett="Försäkring", interaktiv=ia("Pärmen ”Försäkring”",
        "Överst ligger ett brev från försäkringsbolaget, daterat i mars: ”Vi bekräftar att försäkringsvärdet för silverskål, 1760-tal, höjts från 180 000 kr till 650 000 kr.” Bakom brevet: försäkringsfotot av skålen från 2019.", "f-forsakring", ["bild-f"])),
    obj("hylla", "bokhylla", [1.79, 0, 0.2], rot=-90, storlek=[1.2, 2.0]),
    obj("bok", "anteckningsbok", [-0.3, 0.75, -1.1], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [-1.79, 0, 0.6], rot=90, farg="#6a5a40", gar_till="salen", interaktiv=ia("Till salen", "Tillbaka ut i salen.")),
  ]}}}

V = lambda **kw: kw
bilder = {"id": "bilderna", "namn": "Bilderna", "mekanik": "bildjamforelse", "payload": {
  "kort_instruktion": "Jämför bilderna två och två.",
  "instruktion": "Välj två bilder i remsan. Tryck på en detalj som skiljer dem åt – eller på något som är exakt likadant och betyder något. Alla skillnader är inte viktiga. Fel tryck kostar ingenting.",
  "bilder": [
    {"id": "bild-f", "ordning": 0, "tid": "2019", "kort": "Försäkring", "titel": "Försäkringsfotot", "kalla": "Gunnars pärm", "motiv": "narbild", "varden": V(bakgrund="sammet", tidning="forsakring", skal="finns", kant="buckla", handtag="S")},
    {"id": "bild-a", "ordning": 1, "tid": "09.12", "kort": "Instagram", "titel": "”Putsat brudskålen inför festen!”", "kalla": "Gunnars Instagram", "motiv": "narbild", "varden": V(bakgrund="kok", tidning="dagens", skal="finns", kant="buckla", handtag="S")},
    {"id": "bild-b", "ordning": 2, "tid": "15.16", "kort": "Karin", "titel": "Skänken när gästerna kom", "kalla": "Karins mobil", "motiv": "skank", "varden": V(skal="finns", kant="slat", handtag="slat", vas="v", ljus="slackt", gardin="oppen", utsikt="bil-in", person="ingen")},
    {"id": "bild-c", "ordning": 3, "tid": "16.05", "kort": "Karin", "titel": "Skänken efter kaffet", "kalla": "Karins mobil", "motiv": "skank", "varden": V(skal="finns", kant="slat", handtag="slat", vas="h", ljus="slackt", gardin="oppen", utsikt="kaffebord", person="ingen")},
    {"id": "bild-d", "ordning": 4, "tid": "17.05", "kort": "Olle", "titel": "Olle med tårtan", "kalla": "Olles mobil", "motiv": "skank", "varden": V(skal="finns", kant="slat", handtag="slat", vas="h", ljus="tand", gardin="oppen", utsikt="kaffebord", person="olle")},
    {"id": "bild-e", "ordning": 5, "tid": "17.20", "kort": "Birgitta", "titel": "Dukningen", "kalla": "Birgittas mobil", "motiv": "skank", "varden": V(skal="borta", vas="h", ljus="tand", gardin="dragen", utsikt="dold", person="ingen")}
  ],
  "upptackter": [
    {"id": "u-akta-kant", "region": "kant", "varden": ["buckla", "buckla"], "kraver": ["bild-a", "bild-f"], "ger_fynd": "f-akta", "text": "Samma buckla på kanten som på försäkringsfotot från 2019. Skålen på morgonbilden är den äkta."},
    {"id": "u-akta-s", "region": "handtag", "varden": ["S", "S"], "kraver": ["bild-a", "bild-f"], "ger_fynd": "f-akta", "kravs": False, "text": "Samma S i handtaget som på försäkringsfotot. Skålen på morgonbilden är den äkta."},
    {"id": "u-datum", "region": "tidning", "varden": ["dagens", "forsakring"], "kraver": ["bild-a", "bild-f"], "ger_fynd": "f-bild-idag", "text": "Bredvid skålen på Instagrambilden ligger dagens Dala-Demokraten, fredag 19 juni. Bilden är tagen i dag – inte en gammal bild."},
    {"id": "u-kopia-kant", "region": "kant", "varden": ["buckla", "slat"], "kraver": ["bild-a", "bild-b"], "ger_fynd": "f-kopia", "text": "Morgonens skål har en buckla på kanten. Skålen på eftermiddagens bilder har ingen. Det är inte samma skål!"},
    {"id": "u-kopia-s", "region": "handtag", "varden": ["S", "slat"], "kraver": ["bild-a", "bild-b"], "ger_fynd": "f-kopia", "kravs": False, "text": "Morgonens skål har ett S i handtaget. Skålen på eftermiddagens bilder har släta handtag. Det är inte samma skål!"},
    {"id": "u-borta", "region": "skal", "varden": ["finns", "borta"], "bilder": ["bild-d", "bild-e"], "kraver": ["bild-d", "bild-e"], "ger_fynd": "f-borta", "narmare": "Skålen är borta på den ena bilden. Jämför med den senaste bilden där den fortfarande syns.", "text": "Kl. 17.05 står skålen kvar bredvid Olle. Kl. 17.20 är den borta. Skålen på skänken försvann mellan 17.05 och 17.20."},
    {"id": "u-lena", "region": "utsikt", "varden": ["bil-in", "kaffebord"], "kraver": ["bild-b", "bild-c"], "ger_fynd": "f-lena-ankomst", "text": "Genom fönstret på Karins första bild, kl. 15.16, kör en röd bil just in genom grinden – Lenas Volvo. På bilden 16.05 sitter Lena och hennes mor vid kaffebordet."},
    {"id": "u-olle", "region": "person", "varden": ["ingen", "olle"], "kraver": ["bild-c", "bild-d"], "ger_fynd": "f-olle-skank", "text": "Kl. 17.05 står Olle tätt intill skänken med tårtan. Men skålen står kvar bredvid honom på bilden."}
  ],
  "regioner": {
    "vas": {"oviktig": "Vasen har flyttats till andra sidan skänken. Någon har bara gjort plats – det har ingen betydelse."},
    "ljus": {"oviktig": "Ljusen har tänts till middagen. Oviktigt."},
    "gardin": {"oviktig": "Gardinerna har dragits för mot kvällssolen. Oviktigt."},
    "utsikt": {"oviktig": "Utsikten genom fönstret har ändrats, men det säger inget om skålen."},
    "bakgrund": {"oviktig": "Bilderna är tagna på olika platser. Titta hellre på själva skålen."},
    "kant": {"lika": "Kanten ser likadan ut på båda bilderna."},
    "handtag": {"lika": "Handtagen ser likadana ut på båda bilderna."}
  }}}

fall["moment"] = [salen, garden, kontoret, bilder]

fall["fynd"] = [
  {"id": "f-tom-plats", "titel": "Tom plats på skänken", "ikon": "🫙", "typ": "bakgrund", "text": "En ljus ring i dammet visar var skålen stod på skänken i salen."},
  {"id": "f-gunnar-anmalan", "titel": "Gunnars anmälan", "ikon": "🗣️", "typ": "nyckel", "galler": ["gunnar"], "text": "Gunnar: ”Jag såg den halv fem, med sin gamla buckla på kanten. Kvart i sex var den borta.”"},
  {"id": "f-gunnar-ensam", "titel": "Ensam på gården", "ikon": "🏡", "typ": "nyckel", "galler": ["gunnar"], "text": "Gunnar var ensam på gården hela förmiddagen tills bussen kom – det säger han själv."},
  {"id": "f-forsakring", "titel": "Höjd försäkring", "ikon": "📄", "typ": "stod", "galler": ["gunnar"], "text": "I mars höjde Gunnar skålens försäkringsvärde från 180 000 kr till 650 000 kr."},
  {"id": "f-akta", "titel": "Morgonens skål är äkta", "ikon": "🏺", "typ": "nyckel", "text": "Skålen på Gunnars bild kl. 09.12 har samma buckla och samma S i handtaget som försäkringsfotot."},
  {"id": "f-bild-idag", "titel": "Dagens tidning", "ikon": "📰", "typ": "stod", "text": "På morgonbilden ligger dagens Dala-Demokraten bredvid skålen. Bilden är från i dag, 09.12."},
  {"id": "f-kopia", "titel": "En annan skål", "ikon": "🔍", "typ": "nyckel", "text": "Skålen på alla bilder från 15.16 och framåt saknar bucklan och S:et. Det är en kopia – den äkta skålen byttes ut före 15.16."},
  {"id": "f-borta", "titel": "Kopian försvinner", "ikon": "⌛", "typ": "bakgrund", "text": "Skålen på skänken (kopian) försvann mellan 17.05 och 17.20."},
  {"id": "f-buss", "titel": "Bussen kom 15.14", "ikon": "🚌", "typ": "nyckel", "galler": ["mikael", "olle"], "text": "Alla gästerna, och maten, kom med samma buss. Den nådde gården kl. 15.14."},
  {"id": "f-parkering", "titel": "Parkeringskvittot", "ikon": "🅿️", "typ": "nyckel", "galler": ["lena"], "text": "Lenas bil stod på Arlanda 11.02–12.44."},
  {"id": "f-lena-resa", "titel": "Lenas resa", "ikon": "✈️", "typ": "stod", "galler": ["lena"], "text": "Lena åkte hemifrån halv nio. Arlanda ligger två och en halv timme från gården."},
  {"id": "f-lena-ankomst", "titel": "Lenas bil kommer", "ikon": "🚗", "typ": "nyckel", "galler": ["lena"], "text": "På bilden kl. 15.16 kör Lenas bil just in på gården."},
  {"id": "f-mikael-gick", "titel": "Mikael gick tidigt", "ikon": "🚶", "typ": "avledande", "galler": ["mikael"], "text": "Mikael kom med bussen och gick 16.50 med en stor väska.", "forklaring": "Han gick före 17.05 – och då stod kopian fortfarande kvar på Olles bild."},
  {"id": "f-mikael-vaska", "titel": "Mikaels väska", "ikon": "💼", "typ": "avledande", "galler": ["mikael"], "text": "I väskan: en tom tårtbricka i silver och en auktionskatalog.", "forklaring": "Väskan som såg misstänkt ut innehöll bara tårtbrickan."},
  {"id": "f-olle-skank", "titel": "Olle vid skänken", "ikon": "🎂", "typ": "avledande", "galler": ["olle"], "text": "Olle stod tätt intill skänken med tårtan kl. 17.05.", "forklaring": "Skålen stod kvar när Olle gick – och det var ändå bara kopian."}
]

fall["slutsatser"] = [
  {"id": "s-akta", "kraver": ["f-akta", "f-bild-idag"], "fraga": "Vad visar Gunnars morgonbild?", "alternativ": [
    {"text": "En gammal bild – den kan vara från vilken dag som helst.", "svar": "Dagens tidning ligger bredvid skålen. Bilden är från i dag."},
    {"text": "Den äkta skålen, i dag kl. 09.12.", "ratt": True},
    {"text": "En kopia.", "svar": "Bucklan och S:et stämmer med försäkringsfotot från 2019."}],
   "slutsats": "Kl. 09.12 i dag fanns den äkta brudskålen på gården."},
  {"id": "s-kopia", "kraver": ["f-kopia"], "efter": ["s-akta"], "fraga": "Skålen på eftermiddagens bilder saknar bucklan och S:et. Vad betyder det?", "alternativ": [
    {"text": "Någon har lagat bucklan under festen.", "svar": "Bucklan saknas redan på bilden kl. 15.16, när gästerna klev in – och ett ingraverat S går inte att laga bort."},
    {"text": "Det är en kopia. Den äkta skålen byttes ut mellan 09.12 och 15.16.", "ratt": True},
    {"text": "Bilderna är för dåliga för att säga något.", "svar": "Handtagen syns tydligt på alla bilder – släta."}],
   "slutsats": "Skålen gästerna såg var en kopia. Den äkta försvann mellan 09.12 och 15.16 – innan festen ens börjat."},
  {"id": "s-vem", "kraver": ["f-buss", "f-parkering", "f-lena-resa", "f-lena-ankomst", "f-gunnar-ensam"], "efter": ["s-kopia"], "fraga": "Vem var på gården mellan 09.12 och 15.16?", "alternativ": [
    {"text": "Gästerna.", "svar": "Alla gästerna kom med bussen kl. 15.14, och då var bytet redan gjort."},
    {"text": "Lena.", "svar": "Lena åkte halv nio och stod på Arlanda 11.02–12.44. Hem är det två och en halv timme – hon körde in på gården först kl. 15.16."},
    {"text": "Bara Gunnar.", "ratt": True}],
   "slutsats": "Under hela tiden då skålen kan ha bytts ut fanns bara en person på gården: Gunnar själv."},
  {"id": "s-logn", "kraver": ["f-gunnar-anmalan", "f-kopia"], "efter": ["s-kopia"], "fraga": "Gunnar säger att han såg skålen ”med sin gamla buckla” kl. 16.30. Stämmer det?", "alternativ": [
    {"text": "Ja – han känner väl sin egen skål.", "svar": "Det var just det han gjorde. Men kl. 16.30 stod kopian där – utan buckla."},
    {"text": "Nej. Kl. 16.30 stod kopian där, utan buckla. Han beskriver skålen han vet att den ska vara.", "ratt": True}],
   "slutsats": "Gunnar ljuger om bucklan. Han visste inte att bilderna skulle avslöja bytet."},
  {"id": "s-stold", "kraver": ["f-borta"], "efter": ["s-kopia"], "fraga": "Kopian försvann mellan 17.05 och 17.20. Är det den som tog den som är tjuven?", "alternativ": [
    {"text": "Ja – den som tog skålen från skänken är skyldig.", "svar": "Det som togs från skänken var bara kopian. Den äkta skålen var borta sedan förmiddagen."},
    {"text": "Nej. Den ”stölden” var iscensatt – den äkta skålen var redan borta.", "ratt": True}],
   "slutsats": "Stölden under festen var ett skådespel med en kopia, inför tjugofem vittnen."},
  {"id": "s-motiv", "kraver": ["f-forsakring"], "efter": ["s-vem"], "fraga": "Varför skulle någon ”stjäla” sin egen skål?", "alternativ": [
    {"text": "För att sälja den till Mikael.", "svar": "Mikaels väska innehöll bara tårtbrickan. Titta i Gunnars papper."},
    {"text": "För försäkringspengarna: värdet höjdes nyss från 180 000 till 650 000 kr.", "ratt": True}],
   "slutsats": "Motivet: försäkringen. Gunnar skulle få 650 000 kr för en skål han fortfarande hade kvar."}
]

fall["losning"] = {"skyldig": "gunnar", "hur": "byte", "hur_text": "Gunnar bytte ut den äkta skålen mot en kopia på förmiddagen, när han var ensam på gården. Under festen lät han kopian ”försvinna” och anmälde stölden för att få ut försäkringen.",
  "bevisgrupper": [["f-kopia", "f-gunnar-ensam"], ["f-akta", "f-kopia", "f-gunnar-ensam"], ["f-kopia", "f-gunnar-anmalan"], ["f-forsakring", "f-kopia", "f-gunnar-ensam"], ["f-kopia", "f-buss", "f-gunnar-ensam"]],
  "uteslutningar": {"lena": ["f-parkering", "f-lena-ankomst", "f-kopia"], "mikael": ["f-buss", "f-kopia"], "olle": ["f-buss", "f-kopia", "f-olle-skank"]},
  "uteslutningar_text": {
    "lena": "Lena stod på Arlanda 11.02–12.44, två och en halv timme bort, och körde in på gården kl. 15.16 – när kopian redan stod på skänken.",
    "mikael": "Mikael kom med bussen 15.14, efter bytet. Väskan innehöll en tårtbricka.",
    "olle": "Olle kom med bussen 15.14. Skålen stod kvar när han gick från skänken – och det var bara kopian."}}
fall["anklagelse"] = {"hur_fraga": "Hur försvann den äkta skålen?", "hur_alternativ": [
    {"id": "fest", "text": "Någon tog den från skänken mellan 17.05 och 17.20"},
    {"id": "vaska", "text": "Den bars ut i en väska under festen"},
    {"id": "byte", "text": "Den byttes ut mot en kopia på förmiddagen, innan gästerna kom"},
    {"id": "fonster", "text": "Någon lyfte ut den genom fönstret under kaffet"}], "hur_kravs": False, "bevis_max": 3}
fall["ledtradar"] = [
  {"niva": 1, "kostnad": 10, "kraver": ["bild-a", "bild-f", "bild-b"], "text": "Jämför Gunnars morgonbild med försäkringsfotot. Jämför sedan med eftermiddagens bilder. Titta på kanten."},
  {"niva": 2, "kostnad": 25, "kraver": ["f-kopia", "f-buss"], "text": "Skålen på festen är inte samma skål. När byttes den ut – och vilka fanns på gården då?"},
  {"niva": 3, "kostnad": 50, "kraver": ["f-gunnar-ensam", "f-gunnar-anmalan"], "text": "Mellan 09.12 och 15.14 var gården tom på alla utom en person. Och vem påstod att han såg bucklan kl. 16.30?"}]
fall["aterkoppling"] = {
  "ratt": "Den bästa stölden är den som aldrig händer. Gunnar bytte skålen i lugn och ro på förmiddagen. Sedan lät han en kopia ”försvinna” inför tjugofem vittnen. Han glömde bara att han själv hade lagt ut beviset på Instagram.",
  "efterord": "Offret var gärningsmannen. Den äkta brudskålen hittades samma kväll i båthuset, inlindad i en gammal sovsäck. Kopian låg i Gunnars bil. Han hade beställt den av en silversmed i Falun i maj – ”för att kunna visa skålen utan att vara rädd om den”, som han sa.",
  "fel": {
    "mikael": "En antikhandlare med väska ser misstänkt ut. Men han kom med bussen efter bytet, och väskan innehöll en tårtbricka.",
    "olle": "Olle stod vid skänken med tårtan, men skålen stod kvar när han gick – och det var dessutom bara kopian.",
    "lena": "Lena stod på Arlanda och körde in på gården kl. 15.16. Då stod kopian redan på skänken.",
    "gunnar": ""},
  "fel_allman": "Strand höjer ett ögonbryn …",
  "forklaring_steg": [
    {"text": "Gunnars Instagrambild kl. 09.12 visar samma buckla och samma S som försäkringsfotot, och dagens tidning ligger bredvid. Skålen var äkta i morse.", "fynd": ["f-akta", "f-bild-idag"]},
    {"text": "Alla bilder från 15.16 och framåt visar en skål utan buckla och med släta handtag. Det är en kopia. Den äkta skålen byttes ut mellan 09.12 och 15.16.", "fynd": ["f-kopia"]},
    {"text": "Gästerna kom med bussen 15.14. Lena stod på Arlanda till 12.44 och körde in på gården 15.16. Bara Gunnar var på gården när bytet kan ha skett – det säger han själv.", "fynd": ["f-buss", "f-parkering", "f-lena-ankomst", "f-gunnar-ensam"]},
    {"text": "Gunnar säger att han såg skålen ”med sin gamla buckla” kl. 16.30. Men då stod kopian där. Han beskriver skålen han vet att den borde vara.", "fynd": ["f-gunnar-anmalan"]},
    {"text": "Kopian försvann 17.05–17.20 – stölden var iscensatt. Olle och Mikael är villospår: skålen stod kvar efter dem, och det var ändå bara kopian.", "fynd": ["f-borta", "f-olle-skank", "f-mikael-vaska"]},
    {"text": "Motivet: i mars höjde Gunnar försäkringsvärdet från 180 000 till 650 000 kr. Gunnar Sahlin, som anmälde stölden, är skyldig till försäkringsbedrägeri.", "fynd": ["f-forsakring"]}]}
ut = os.path.join(os.path.dirname(__file__), '..', '..', 'fall', 'brudskalen.json')
json.dump(fall, open(ut, 'w'), ensure_ascii=False, indent=2)
print('skrev', os.path.normpath(ut))
