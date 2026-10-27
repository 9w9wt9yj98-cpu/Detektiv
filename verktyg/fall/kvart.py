# Genererar fall/kvart-i-elva.json (källan för fallet – redigera här och kör om).
import json, os
T = True
def obj(id, typ, pos, **kw):
    d = {"id": id, "typ": typ, "pos": pos}; d.update(kw); return d
def ia(namn, text, fynd=None, material=None):
    d = {"namn": namn, "text": text}
    if fynd: d["ger_fynd"] = fynd
    if material: d["ger_material"] = material
    return d

fall = {"id": "kvart-i-elva", "version": 1,
 "meta": {"titel": "Kvart i elva", "miljo": "Urmakeri i Gamla stan", "epok": "1890-tal", "brottstyp": "stold", "langd": "medel",
   "uppskattad_tid_min": [15, 20], "svarighet": 3, "karnmekanik": "tidslinje", "bimekaniker": ["scen", "dokument"], "twist": None, "kraver_rang": 0,
   "accentfarg": "#2a3a5a", "omslag": "bilder/fall5/urmakeriet.jpg", "mal": "Ta reda på vem som stal kronometern Polaris", "handledning_mal": "monter"},
 "intro": {"rubrik": "Österlånggatan, Stockholm. En snönatt i december 1897.",
   "text": "Snön har fallit hela kvällen över Gamla stan. Strax före midnatt bultar nattväktaren på hos polisen: Fältskogs urmakeri har haft inbrott. Fönsterluckan mot gränden är uppbruten, och ur glasmontern är kronometern Polaris borta – urmakare Fältskogs mästerverk, värt mer än ett hus på Söder.\n\nÖverkonstapel August Strand möter dig i den kalla butiken. ”Konstigt inbrott”, säger han och pekar med blyertspennan. ”Luckan är bruten – men montern är öppnad med nyckel, utan en repa. Och väggklockan där på golvet stannade när den föll.”\n\n”Det här är en fråga om minuter. Ta reda på när det hände, vem som kan ha varit här just då – och vem som bara säger det.”",
   "uppdrag": "Vem stal kronometern – och hur hann hen?", "bild": "bilder/fall5/urmakeriet.jpg", "berattare": "Överkonstapel August Strand"},
 "personer": [
   {"id": "faltskog", "namn": "Johan Fältskog", "roll": "Urmakare, ägare av butiken", "misstankt": T, "beskrivning": "Kom direkt från sin dotters bröllopsmiddag, fortfarande i frack."},
   {"id": "karl", "namn": "Karl Ek", "roll": "Gesäll hos Fältskog", "misstankt": T, "beskrivning": "Ung och skuldsatt. Har egen nyckel till montern."},
   {"id": "rapp", "namn": "Anders Rapp", "roll": "Urmakare, Fältskogs förre kompanjon", "misstankt": T, "beskrivning": "Bröt med Fältskog för sex år sedan. Bitter, säger folk."},
   {"id": "lindh", "namn": "Fru Lindh", "roll": "Kund", "misstankt": T, "beskrivning": "Hennes handske hittades på golvet innanför dörren."},
   {"id": "vaktaren", "namn": "Nattväktare Holm", "roll": "Går rundorna i kvarteret", "misstankt": False, "beskrivning": "Slår larm vid elva."},
   {"id": "ekdahl", "namn": "Fru Ekdahl", "roll": "Granne, bor vägg i vägg", "misstankt": False, "beskrivning": "Sover lätt."},
   {"id": "hilma", "namn": "Hilma Rapp", "roll": "Rapps hustru", "misstankt": False, "beskrivning": "Väntade uppe på sin man."},
 ]}

# ---------- Urmakeriet ----------
urmakeriet = {"id": "urmakeriet", "namn": "Urmakeriet", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 5.0, "djup": 4.4, "hojd": 2.7, "miljo": "inomhus", "bakgrund": "#140e08", "dimma": [6, 15, "#1a120a"],
  "golv": "#5a3a22", "tapet": {"grund": "#3e4a36", "monster": "#2e3a28"}, "panel": "#3a2412",
  "ljus": {"omgivning": "#ffd9a8", "omgivning_styrka": 0.55, "bas": 0.3},
  "start": {"pos": [0.6, 1.5], "titta": -10},
  "objekt": [
    obj("matta", "matta", [0.6, 0, 0.8], storlek=[1.6, 2.2], kollision=False),
    obj("monter", "monter", [0.3, 0, -0.5], tom=True, interaktiv=ia("Glasmontern",
        "Glaset är helt. Låset i mässing är öppnat och står uppvridet – du ser inte en enda repa, inget märke efter dyrk. Det här låset har öppnats med nyckel. På sammetsbädden står Polaris stativ tomt.", "f-monter")),
    obj("lucka", "lucka", [-1.2, 0, -2.19], interaktiv=ia("Fönsterluckan",
        "Luckan mot gränden är uppbruten utifrån med ett järn – träet är splittrat kring regeln, och snö har blåst in över golvet. Den som kom in här klättrade över fönsterbänken.", "f-luckan")),
    obj("vaggur", "vaggur", [2.49, 0, -1.2], rot=-90, krossad=True, tid=[10, 47], interaktiv=ia("Den krossade väggklockan",
        "Väggklockan har slitits ned från sin krok bredvid fönstret och ligger krossad på golvet. Visarna har stannat på 22.47. Fältskog: ”Den gick på sekunden – jag ställde den efter Storkyrkan i förrgår.”", "f-klockan")),
    obj("krok", "skylt", [2.485, 1.95, -1.2], rot=-90, text="⌀", storlek=[0.08, 0.08], textstorlek=40),
    obj("bank", "arbetsbank", [-2.15, 0, 0.6], rot=90, bredd=1.6, styrka=1.6),
    obj("span", "span", [-1.4, 0, 0.6], yta=[1.4, 1.8], antal=90, interaktiv=ia("Spånen på golvet",
        "Golvet runt arbetsbänken är strött med ljusa ekspån. Fältskog: ”Mot halkan, när kunderna drar in snö. Ek luktar gott och fastnar i allt – i sulor, i byxuppslag, i rockar.”", "f-ekspan-golv")),
    obj("handske", "handske", [1.4, 0, 1.55], rot=30, farg="#6a6070", interaktiv=ia("En handske",
        "En damhandske i grå mocka, med ett broderat L, ligger innanför dörren. Den är torr – ingen snö har smält på den.", "f-handske")),
    obj("disk", "skank", [1.6, 0, 0.3], rot=-90, storlek=[1.4, 0.95, 0.5]),
    obj("kassabok", "liggare", [1.6, 0.95, 0.1], rot=-90, interaktiv=ia("Kassaboken",
        "Dagens sista anteckningar i Fältskogs prydliga stil: ”Kl. 16.20 Hr Berg, ny fjäder 3 kr. Kl. 17.00 Fru Lindh, lagning av armbandsur, 2 kr. Stängt 18.00.”", "f-lindh-kassabok")),
    obj("bok", "anteckningsbok", [1.6, 0.95, 0.65], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("urhylla", "urhylla", [1.2, 0, -2.19], bredd=1.6),
    obj("pendyl", "vaggur", [-2.49, 1.2, -1.2], rot=90, tid=[11, 52], farg="#3a2412"),
    obj("faltskog", "person", [1.3, 0, -1.55], rot=-35, rock="#1a1a1e", skjorta="#f6f2e8", slips="#f6f2e8", har="#b8b0a0", glasogon=True, seed=0,
        interaktiv=ia("Urmakare Fältskog", "Fältskog står i frack och ser grå ut. ”Tre nycklar finns till montern: min egen, min gesäll Karl Eks – och Rapps. Rapp var min kompanjon till -91, och låset byttes aldrig. Jag har ångrat det i sex år.\n\nSjälv satt jag på Grand Hôtel på min dotters bröllopsmiddag från sju till ett. Fyrtio gäster och hovmästaren har redan intygat det för konstapeln.”", "f-nyckelinnehavare", ["k-faltskog-grand"])),
    obj("lampa1", "vagglampa", [-2.48, 1.9, -0.3], rot=90, styrka=1.0, flimrar=True),
    obj("lampa2", "vagglampa", [2.48, 1.9, 0.9], rot=-90, styrka=1.1, flimrar=True),
    obj("dorr-ut", "dorr", [0.6, 0, 2.19], rot=180, farg="#3a2a1a", gar_till="gatan", interaktiv=ia("Ut på gatan", "Dörren ut mot Österlånggatan. Klockan över dörren pinglar när du öppnar.")),
  ]}}}

# ---------- Gatan ----------
gatan = {"id": "gatan", "namn": "Österlånggatan", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 4.2, "djup": 12.0, "hojd": 8.0, "miljo": "inomhus", "vagg": "fasad", "fasadfarg": "#b8925a", "tak": False, "panel": False, "sno": 900,
  "bakgrund": "#0c111c", "dimma": [5, 16, "#141a26"], "golv": {"typ": "sten"},
  "ljus": {"omgivning": "#9fb0d0", "omgivning_styrka": 0.55, "bas": 0.22},
  "start": {"pos": [0.2, 4.6], "titta": 0},
  "objekt": [
    obj("lykta1", "gaslykta", [1.6, 0, 2.6], styrka=3.4),
    obj("lykta2", "gaslykta", [-1.6, 0, -3.4], styrka=3.0),
    obj("dorr-butik", "dorr", [-2.09, 0, 1.0], rot=90, farg="#3a2a1a", gar_till="urmakeriet", interaktiv=ia("Fältskogs urmakeri", "Tillbaka in i butiken.")),
    obj("skylt", "skylt", [-2.085, 2.65, 1.0], rot=90, text="J. FÄLTSKOG · URMAKARE", storlek=[1.3, 0.24], textstorlek=40, grund="#2a1a0e", farg="#e8c878"),
    obj("luckan-ute", "skylt", [-2.085, 1.5, 2.4], rot=90, text="", storlek=[0.9, 1.1], grund="#4a3a2a", ram=False),
    obj("vaktaren", "person", [0.6, 0, 1.2], rot=200, rock="#2a3040", har="#5a4a3a", hatt="hatt", hattfarg="#1a1a1e", skagg=True, seed=2,
        interaktiv=ia("Nattväktare Holm", "Holm stampar av sig snön. ”Jag går samma runda varje natt, och jag känner på varenda lucka. Klockan tio var allt i ordning hos Fältskog. Halv elva också – jag minns att Storkyrkan slog medan jag stod här. Men klockan elva hängde luckan och slängde. Då slog jag larm.”", "f-vaktaren")),
    obj("ekdahl", "person", [1.75, 0, -1.4], rot=-100, kon="k", rock="#4a3a4a", har="#b0a8a0", hatt="sjalett", hattfarg="#e8e0d0", seed=1,
        interaktiv=ia("Fru Ekdahl", "Fru Ekdahl har en sjal över nattlinnet. ”Jag bor vägg i vägg. Jag låg och läste när Storkyrkan slog tre kvart – och strax efter, inte mer än en minut eller två, kom en skräll inifrån urmakeriet, som när något stort faller i golvet. Sedan var det tyst.”", "f-grannen")),
    obj("karl", "person", [-0.8, 0, -0.6], rot=120, rock="#3a3020", byxor="#2a2a24", har="#8a5a2a", hatt="mossa", hattfarg="#2a2a24", seed=3,
        interaktiv=ia("Karl Ek, gesäll", "Karl luktar punsch och ser inte på dig. ”Nyckeln? Den har jag här, i västfickan – den har inte lämnat mig. Jag satt på Den Gyldene Freden hela kvällen, från tio till halv tolv. Fråga vem som helst.”", material=["k-karl-pastar"])),
    obj("bod", "bord", [1.7, 0, 4.4], storlek=[0.6, 0.8, 0.5], farg="#4a3a2a"),
    obj("bok", "anteckningsbok", [1.7, 0.8, 4.4], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr-polis", "dorr", [2.09, 0, -2.0], rot=-90, farg="#2a3a4a", gar_till="poliskammaren", interaktiv=ia("Poliskammaren", "Strand har tagit hit papperen till ett rum på närmaste poliskammare.")),
    obj("polisskylt", "skylt", [2.085, 2.65, -2.0], rot=-90, text="POLIS", storlek=[0.7, 0.2], textstorlek=50, grund="#1a2a3a", farg="#e8e0c8"),
    obj("droska", "dorr", [0, 0, -5.99], farg="#1a1a1a", gar_till="rapps-hem", interaktiv=ia("Hyrdroskan till Kungsholmen", "En hyrdroska väntar i snön vid gränden. Kusken kan köra dig till Rapps våning på Kungsholmen.")),
  ]}}}

# ---------- Poliskammaren ----------
polis = {"id": "poliskammaren", "namn": "Poliskammaren", "mekanik": "scen", "last_upp_av": ["f-nyckelinnehavare"],
  "last_text": "Strand: ”Ta reda på vilka som har nyckel till montern först. Fråga Fältskog.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 4.2, "djup": 3.8, "hojd": 2.8, "miljo": "inomhus", "bakgrund": "#140e08", "dimma": [6, 15, "#1a120a"],
  "golv": "#4a3420", "tapet": {"grund": "#8a7a5a", "monster": "#766848"}, "panel": "#3a2a1a",
  "ljus": {"omgivning": "#ffdcae", "omgivning_styrka": 0.6, "bas": 0.32},
  "start": {"pos": [0.2, 1.3], "titta": 0},
  "objekt": [
    obj("bord", "bord", [0.2, 0, -0.6], storlek=[1.6, 0.76, 0.8], farg="#5a3a20"),
    obj("liggaren", "liggare", [-0.35, 0.76, -0.6], storlek=[0.46, 0.32], farg="#2a3a2a", interaktiv=ia("Pantlåneliggaren",
        "Liggaren från Pantlånekontoret på Hornsgatan, som har kvällsöppet till midnatt. Kassören skriver klockslaget vid varje post. Näst sista raden: ”22.40 – Karl Ek, gesäll. Ett fickur i silver, graverat E.E. Utlånat 8 kr.” Kassören minns honom: ”Han såg ut som han skämdes.”", material=["k-karl-pant"])),
    obj("intyget", "papper", [0.3, 0.76, -0.75], antal=1, interaktiv=ia("Krögarens intyg",
        "Krögaren på Den Gyldene Freden har skrivit under: ”Karl Ek satt vid fönsterbordet från kl. 10 till strax efter kvart över tio, då han gick. Han kom tillbaka kl. 11.05 och satt kvar till halv tolv. Jag minns det, för han betalade med blanka sedlar.”", material=["k-karl-freden1", "k-karl-freden2"])),
    obj("protokollet", "papper", [0.75, 0.76, -0.55], antal=2, interaktiv=ia("Urmakargillets protokoll",
        "Protokoll fört vid Urmakargillets decembersammanträde: ”… Ordföranden förklarade mötet avslutat kl. 10.30 e.m.” Under står de närvarandes namn. Ett av dem: Anders Rapp.", material=["k-rapp-gillet"])),
    obj("biljetten", "papper", [-0.7, 0.76, -0.45], antal=1, interaktiv=ia("Spårvagnsbiljett och rapport",
        "En spårvagnsbiljett, stämplad vid Slussen kl. 22.40, som fru Lindh lämnat fram. Fastnålad: spårvagnskonduktörens rapport. ”Damen med grå kappa, utan handskar, åkte med från Slussen 22.40 till ändhållplatsen Skanstull, där vi var 22.52. Hon frös om händerna.”", material=["k-lindh-sparvagn"])),
    obj("karta", "tavelkarta", [0.2, 1.55, -1.89], storlek=[1.2, 0.8], textstorlek=19,
        text="GÅNGTIDER (minuter)  –  uppmätta av polisen\n\nGillets hus – urmakeriet ........ 6\nGillets hus – Rapps hem ......... 15\nUrmakeriet – Rapps hem .......... 18\nFreden – urmakeriet .............. 4\nFreden – pantlånekontoret ........ 16\nPantlånekontoret – urmakeriet ... 20\nGrand Hôtel – urmakeriet ......... 12\nSlussen – urmakeriet .............. 5",
        interaktiv=ia("Kartan med gångtider", "Strand har nålat upp en karta över Stadsholmen, Södermalm och Kungsholmen. ”Jag har låtit en konstapel gå sträckorna i kväll, i snön, i rask takt”, säger han. ”Tiderna stämmer – snabbare än så går ingen.” Nu kan du lägga upp tidslinjen i anteckningsboken.", "f-gangtider")),
    obj("lindh", "person", [-1.4, 0, 0.4], rot=60, kon="k", rock="#8a8a90", har="#6a4a2a", hatt="hatt", hattfarg="#4a3a4a", seed=2,
        interaktiv=ia("Fru Lindh", "Fru Lindh är upprörd. ”Jag har kommit för att hämta min handske, inget annat! Jag var hos Fältskog klockan fem med mitt armbandsur och måste ha tappat den då. I kväll var jag hos min syster vid Slussen och åkte spårvagn hem. Nyckel? Till en monter? Vad skulle jag med en sådan till?”", "f-lindh-utsaga")),
    obj("strand", "person", [1.4, 0, 0.2], rot=-70, rock="#1e2433", har="#4a3a2a", hatt="mossa", hattfarg="#1e2433", seed=0, skagg=True,
        interaktiv=ia("Överkonstapel Strand", "”Allt jag har fått in i kväll ligger på bordet”, säger Strand. ”Liggare, intyg, protokoll. Vissa säger sanningen, några ljuger – men gångtiderna ljuger aldrig.”")),
    obj("pulpet", "pulpet", [1.7, 0, -1.4], rot=-30),
    obj("bokhylla", "bokhylla", [-2.09, 0, -0.8], rot=90, storlek=[1.2, 2.0]),
    obj("lampa", "oljelampa", [0.9, 0.76, -0.85], ljus=True, styrka=2.2),
    obj("fonster", "fonster", [2.09, 0, 0.9], rot=-90),
    obj("bok", "anteckningsbok", [0.0, 0.76, -0.35], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [-0.6, 0, 1.89], rot=180, gar_till="gatan", interaktiv=ia("Ut på gatan", "Tillbaka ut på Österlånggatan.")),
  ]}}}

# ---------- Rapps hem ----------
rapp = {"id": "rapps-hem", "namn": "Rapps kök på Kungsholmen", "mekanik": "scen", "last_upp_av": ["f-nyckelinnehavare"],
  "last_text": "Kusken skakar på huvudet. ”Vart ska herrn? Fråga urmakarn först vem ni ska besöka.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 4.0, "djup": 3.6, "hojd": 2.6, "miljo": "inomhus", "bakgrund": "#140e08", "dimma": [6, 14, "#1a120a"],
  "golv": "#6a4a2c", "vagg": "puts", "putsfarg": "#d8ccb0", "panel": "#4a5a4a",
  "ljus": {"omgivning": "#ffd9a8", "omgivning_styrka": 0.55, "bas": 0.3},
  "start": {"pos": [0.0, 1.2], "titta": 0},
  "objekt": [
    obj("spis", "vedspis", [-1.3, 0, -1.45], styrka=1.6),
    obj("kokbord", "bord", [0.6, 0, -0.5], storlek=[1.2, 0.76, 0.7], farg="#8a6a44", duk=True),
    obj("ritningen", "papper", [0.8, 0.76, -0.55], antal=3, interaktiv=ia("Ritningen på köksbordet",
        "En sliten ritning av ett kronometerverk. I hörnet: ”Polaris – konstr. A. Rapp & J. Fältskog, 1889”. Någon har strukit över Fältskogs namn med hårda pennstreck.", "f-motiv")),
    obj("kokur", "vaggur", [1.99, 1.0, -0.6], rot=-90, tid=[11, 52], farg="#6a4a2a", interaktiv=ia("Köksuret",
        "Ett enkelt köksur. Du jämför med ditt fickur: det går på minuten rätt. Hilma: ”August ställer det varje söndag efter Kungsholms kyrka.”", "f-kokur")),
    obj("rocken", "rock", [-1.99, 0, 0.4], rot=90, span=True, farg="#2a2a34", interaktiv=ia("Rapps rock på kroken",
        "Rapps vinterrock hänger på kroken, ännu fuktig av snö. I rockuppslagen och i fickans söm sitter ljusa, färska ekspån.", "f-ekspan-rapp")),
    obj("rapp", "person", [0.9, 0, 0.6], rot=-140, rock="#3a3028", byxor="#2a2a24", har="#9a9086", skagg=True, seed=1,
        interaktiv=ia("Anders Rapp", "Rapp sitter kvar vid bordet med kaffekoppen. ”Gillesmötet slutade halv elva och jag gick raka vägen hem, som alltid. Jag var hemma kvart i elva. Fältskogs butik? Där har jag inte satt min fot på sex år. Han stal Polaris från mig en gång – nu har någon stulit den från honom. Det kallar jag rättvisa.”", "f-rapp-ej-butik", ["k-rapp-pastar"])),
    obj("hilma", "person", [-0.6, 0, -0.9], rot=30, kon="k", rock="#5a3a3a", har="#7a6a5a", forklade=True, seed=3,
        interaktiv=ia("Hilma Rapp", "Hilma ser på sin man och sedan på dig. ”Han kom hem fem över elva. Jag vet det, för köksuret slog elva medan jag lade in ved, och kaffet hade knappt hunnit koka när han stod i dörren. Varför skulle jag säga något annat?”", material=["k-rapp-hem"])),
    obj("hylla", "hylla", [1.99, 1.5, 0.9], rot=-90),
    obj("lampa", "oljelampa", [0.4, 0.76, -0.75], ljus=True, styrka=2.0),
    obj("fonster", "fonster", [0.2, 0, -1.79]),
    obj("bok", "anteckningsbok", [0.3, 0.76, -0.25], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("dorr", "dorr", [-0.8, 0, 1.79], rot=180, farg="#4a3a2a", gar_till="gatan", interaktiv=ia("Droskan tillbaka", "Droskan kör dig tillbaka till Österlånggatan.")),
  ]}}}

K = lambda id, person, plats, fran, titel, typ="fakta", till=None, **kw: dict(id=id, person=person, plats=plats, fran=fran, titel=titel, typ=typ, **({"till": till} if till else {}), **kw)
tidslinje = {"id": "tidslinjen", "namn": "Tidslinjen", "mekanik": "tidslinje", "last_upp_av": ["f-gangtider"],
  "last_text": "Utan gångtider går det inte att räkna. Strand har en karta på poliskammaren.",
  "payload": {
  "kort_instruktion": "Lägg tidskorten på rätt person och pröva var och en mot brottstiden.",
  "instruktion": "Tryck på ett tidskort och sedan ”Lägg här” hos den person det gäller. Gångtiderna mellan platserna räknas ut åt dig: rött betyder omöjligt, gult att tid saknas i redovisningen. Heldragna kort kommer från oberoende källor, streckade är personens eget påstående. När brottstiden är fastställd kan du pröva varje person mot den. Fel kostar ingenting.",
  "fran": "22.00", "till": "23.30", "lucka_min": 15,
  "personer": ["faltskog", "karl", "rapp", "lindh"],
  "platser": {"urmakeriet": "urmakeriet", "grand": "Grand Hôtel", "freden": "Den Gyldene Freden", "pant": "pantlånekontoret", "gillet": "gillets hus", "rapp_hem": "Rapps hem", "sparvagn": "spårvagnen"},
  "gangtider": [["gillet", "urmakeriet", 6], ["gillet", "rapp_hem", 15], ["urmakeriet", "rapp_hem", 18], ["freden", "urmakeriet", 4], ["freden", "pant", 16], ["pant", "urmakeriet", 20], ["grand", "urmakeriet", 12], ["sparvagn", "urmakeriet", 5]],
  "kort": [
    K("k-faltskog-grand", "faltskog", "grand", "19.00", "Bröllopsmiddagen på Grand", till="01.00", ikon="🥂", kalla="40 gäster och hovmästaren", text="Fältskog satt till bords hela kvällen."),
    K("k-karl-pastar", "karl", "freden", "22.00", "”Satt på Freden hela kvällen”", typ="pastaende", till="23.30", ikon="🍺", kalla="Karl själv", text="Karl: från tio till halv tolv."),
    K("k-karl-freden1", "karl", "freden", "22.00", "På Den Gyldene Freden", till="22.20", ikon="🍺", kalla="krögaren", text="Gick strax efter kvart över tio."),
    K("k-karl-pant", "karl", "pant", "22.40", "Pantsätter ett fickur", ikon="⌚", kalla="pantlåneliggaren", text="Hornsgatan, kl. 22.40 enligt liggaren."),
    K("k-karl-freden2", "karl", "freden", "23.05", "Tillbaka på Freden", till="23.30", ikon="🍺", kalla="krögaren", text="Kom tillbaka 23.05."),
    K("k-rapp-gillet", "rapp", "gillet", "20.00", "Gillesmötet", till="22.30", ikon="📜", kalla="protokollet", text="Mötet avslutades 22.30; Rapp skrev under."),
    K("k-rapp-pastar", "rapp", "rapp_hem", "22.45", "”Hemma kvart i elva”", typ="pastaende", till="23.30", ikon="🏠", kalla="Rapp själv", text="Rapp: gick raka vägen hem."),
    K("k-rapp-hem", "rapp", "rapp_hem", "23.05", "Kommer hem", ankomst=True, ikon="🏠", kalla="hustrun och köksuret", text="Hilma: han kom fem över elva."),
    K("k-lindh-sparvagn", "lindh", "sparvagn", "22.40", "Spårvagnen Slussen–Skanstull", till="22.52", ikon="🚋", kalla="biljetten och konduktören", text="Stämplad 22.40, av vid Skanstull 22.52."),
  ],
  "brott": {"plats": "urmakeriet", "fran": "22.45", "till": "22.47", "kraver": ["f-brottstid"], "fraga": "i urmakeriet", "text": "Vid montern – om hen gjorde det"},
  "konflikter": [
    {"id": "m-karl", "kraver": ["k-karl-pastar", "k-karl-pant"], "ger_fynd": "f-karl-ljuger", "text": "Karl säger att han satt på Freden hela kvällen – men kl. 22.40 stod han vid disken på pantlånekontoret på Hornsgatan."},
    {"id": "m-rapp", "kraver": ["k-rapp-pastar", "k-rapp-hem"], "ger_fynd": "f-rapp-lucka", "text": "Rapp säger att han var hemma kvart i elva. Hustrun säger fem över elva. Raka vägen från gillet tar 15 minuter – han kom 20 minuter för sent."},
  ],
  "prov": [
    {"id": "p-faltskog", "person": "faltskog", "vantat": "omojlig", "kraver": ["k-faltskog-grand", "f-brottstid"], "ger_fynd": "f-faltskog-omojlig", "text_omojlig": "Fältskog satt på Grand Hôtel inför fyrtio gäster hela kvällen. Han kan inte ha varit i butiken 22.45."},
    {"id": "p-karl", "person": "karl", "vantat": "omojlig", "kraver": ["k-karl-freden1", "k-karl-pant", "k-karl-freden2", "f-brottstid"], "ger_fynd": "f-karl-omojlig", "text_omojlig": "Kl. 22.40 stod Karl på pantlånekontoret. Därifrån är det 20 minuter till urmakeriet – han kunde vara där tidigast 23.00. Karl kan uteslutas, fast han ljög."},
    {"id": "p-rapp", "person": "rapp", "vantat": "mojlig", "kraver": ["k-rapp-gillet", "k-rapp-hem", "f-brottstid"], "ger_fynd": "f-rapp-hinner", "text_mojlig": "Gillet 22.30 → urmakeriet 6 minuter: framme 22.36. Ut genom luckan 22.47 → hem 18 minuter: 23.05. Precis när hustrun säger att han kom. Det går ihop på minuten."},
    {"id": "p-lindh", "person": "lindh", "vantat": "omojlig", "kraver": ["k-lindh-sparvagn", "f-brottstid"], "ger_fynd": "f-lindh-omojlig", "text_omojlig": "Fru Lindh satt på spårvagnen mellan Slussen och Skanstull 22.40–22.52. Hon kan inte ha varit i butiken 22.45."},
  ]}}

fall["moment"] = [urmakeriet, gatan, polis, rapp, tidslinje]

fall["fynd"] = [
  {"id": "f-monter", "titel": "Montern öppnad med nyckel", "ikon": "🔑", "typ": "nyckel", "text": "Monterns lås är öppnat utan en repa – med nyckel. Polaris är borta."},
  {"id": "f-luckan", "titel": "Luckan bruten utifrån", "ikon": "🪵", "typ": "bakgrund", "text": "Fönsterluckan mot gränden är uppbruten med ett järn. Tjuven klättrade in den vägen."},
  {"id": "f-klockan", "titel": "Klockan stannade 22.47", "ikon": "🕰️", "typ": "nyckel", "text": "Väggklockan, som gick på sekunden, slets ned och stannade på 22.47."},
  {"id": "f-ekspan-golv", "titel": "Ekspån i verkstaden", "ikon": "🪵", "typ": "stod", "text": "Fältskog strör ekspån på golvet mot halka. De fastnar i sulor, uppslag och rockar."},
  {"id": "f-handske", "titel": "Fru Lindhs handske", "ikon": "🧤", "typ": "avledande", "galler": ["lindh"], "text": "En grå mockahandske med broderat L låg innanför dörren – torr, utan smält snö.", "forklaring": "Fru Lindh tappade den vid sitt besök kl. 17.00. Den var torr – den kom inte in med någon i snöyran i natt."},
  {"id": "f-lindh-kassabok", "titel": "Fru Lindh i kassaboken", "ikon": "📒", "typ": "bakgrund", "galler": ["lindh"], "text": "Kassaboken: fru Lindh var i butiken kl. 17.00 med sitt armbandsur. Butiken stängde 18.00."},
  {"id": "f-nyckelinnehavare", "titel": "Tre nycklar", "ikon": "🗝️", "typ": "nyckel", "galler": ["faltskog", "karl", "rapp"], "text": "Nyckel till montern har bara Fältskog, gesällen Karl Ek och förre kompanjonen Rapp. Låset byttes aldrig."},
  {"id": "f-vaktaren", "titel": "Väktarens rundor", "ikon": "🏮", "typ": "nyckel", "text": "Nattväktaren: luckan var hel kl. 22.00 och 22.30, men uppbruten kl. 23.00."},
  {"id": "f-grannen", "titel": "Skrällen efter tre kvart", "ikon": "🔔", "typ": "nyckel", "text": "Fru Ekdahl hörde en skräll inifrån urmakeriet en minut eller två efter att Storkyrkan slagit tre kvart – strax efter 22.45."},
  {"id": "f-gangtider", "titel": "Gångtiderna", "ikon": "🗺️", "typ": "bakgrund", "text": "Polisen har gått sträckorna i snön. Snabbare än så går ingen."},
  {"id": "f-lindh-utsaga", "titel": "Fru Lindhs kväll", "ikon": "🗣️", "typ": "bakgrund", "galler": ["lindh"], "text": "Fru Lindh: var i butiken kl. 17, åkte spårvagn hem från Slussen i kväll. Har ingen nyckel."},
  {"id": "f-motiv", "titel": "Ritningen till Polaris", "ikon": "📐", "typ": "stod", "galler": ["rapp"], "text": "Polaris konstruerades av Rapp och Fältskog tillsammans. Rapp har strukit över Fältskogs namn."},
  {"id": "f-kokur", "titel": "Köksuret går rätt", "ikon": "⏰", "typ": "stod", "galler": ["rapp"], "text": "Köksuret hos Rapps går på minuten rätt."},
  {"id": "f-ekspan-rapp", "titel": "Spån i Rapps rock", "ikon": "🧥", "typ": "nyckel", "galler": ["rapp"], "text": "I Rapps fuktiga rockuppslag sitter färska ekspån – samma sort som på Fältskogs verkstadsgolv."},
  {"id": "f-rapp-ej-butik", "titel": "”Inte på sex år”", "ikon": "🗣️", "typ": "stod", "galler": ["rapp"], "text": "Rapp säger att han inte har satt sin fot i Fältskogs butik på sex år."},
  {"id": "f-brottstid", "titel": "Brottstiden 22.45–22.47", "ikon": "⏱️", "typ": "nyckel", "text": "Väktaren, grannen och den stannade klockan pekar på samma tid: inbrottet skedde 22.45–22.47."},
  {"id": "f-bara-nyckel", "titel": "Bara en nyckelinnehavare", "ikon": "🗝️", "typ": "nyckel", "galler": ["lindh"], "text": "Luckan kan vem som helst bryta upp, men montern öppnades med nyckel. Bara Fältskog, Karl Ek och Rapp kan ha gjort det."},
  {"id": "f-karl-ljuger", "titel": "Karl ljög om krogen", "ikon": "🍺", "typ": "avledande", "galler": ["karl"], "text": "Karl satt inte på Freden hela kvällen – kl. 22.40 var han på pantlånekontoret.", "forklaring": "Karl ljög av skam: han pantsatte sin fars fickur för att betala en skuld. Han ljög om var han var – inte om montern."},
  {"id": "f-rapp-lucka", "titel": "Rapps tjugo minuter", "ikon": "⏳", "typ": "nyckel", "galler": ["rapp"], "text": "Rapp lämnade gillet 22.30. Raka vägen hem tar 15 minuter, men han kom hem 23.05 – 20 minuter senare än han säger."},
  {"id": "f-faltskog-omojlig", "titel": "Fältskog på Grand", "ikon": "🥂", "typ": "nyckel", "galler": ["faltskog"], "text": "Fältskog satt på Grand Hôtel inför fyrtio gäster hela kvällen."},
  {"id": "f-karl-omojlig", "titel": "Karl hann inte", "ikon": "⌚", "typ": "nyckel", "galler": ["karl"], "text": "Pantlånekontoret 22.40 + 20 minuters gång = tidigast 23.00 i urmakeriet. Då var det redan över."},
  {"id": "f-rapp-hinner", "titel": "Rapps omväg går ihop", "ikon": "🧭", "typ": "nyckel", "galler": ["rapp"], "text": "Gillet 22.30 → urmakeriet 22.36 → ut 22.47 → hemma 23.05. Omvägen via Österlånggatan går ihop på minuten."},
  {"id": "f-lindh-omojlig", "titel": "Fru Lindh på spårvagnen", "ikon": "🚋", "typ": "nyckel", "galler": ["lindh"], "text": "Fru Lindh satt på spårvagnen Slussen–Skanstull 22.40–22.52."},
]

fall["slutsatser"] = [
  {"id": "s-tid", "kraver": ["f-vaktaren", "f-grannen", "f-klockan"], "ger_fynd": "f-brottstid", "fraga": "När skedde inbrottet?", "alternativ": [
    {"text": "Mellan 22.00 och 22.30.", "svar": "Väktaren känner på luckan varje runda. Halv elva var den hel."},
    {"text": "Strax efter 22.45 – klockan stannade 22.47.", "ratt": True},
    {"text": "Efter 23.00, när väktaren slog larm.", "svar": "Kl. 23.00 var luckan redan bruten. Och grannen hörde skrällen strax efter tre kvart."},
    {"text": "Det går inte att veta – klockan kan ha ställts om.", "svar": "Klockan kan man ställa om, men inte väktarens runda och Storkyrkans slag. Tre oberoende källor säger samma sak."}],
   "slutsats": "Väktaren (hel 22.30, bruten 23.00), grannen (skräll strax efter 22.45) och klockan (22.47) säger samma sak: inbrottet skedde 22.45–22.47. Brottstiden syns nu på tidslinjen."},
  {"id": "s-nyckel", "kraver": ["f-monter", "f-nyckelinnehavare", "f-luckan"], "ger_fynd": "f-bara-nyckel", "fraga": "Luckan bröts upp, men montern öppnades med nyckel. Vem kan ha tagit kronometern?", "alternativ": [
    {"text": "Vem som helst som tog sig in genom luckan.", "svar": "In kommer vem som helst – men monterns lås har inte en repa. Den som öppnade det hade nyckel."},
    {"text": "Bara någon av de tre med nyckel: Fältskog, Karl Ek eller Rapp.", "ratt": True},
    {"text": "Fru Lindh – hennes handske låg ju innanför dörren.", "svar": "Handsken förklarar inte hur montern öppnades utan en repa. Fru Lindh har ingen nyckel."}],
   "slutsats": "Bara de tre nyckelinnehavarna kan ha öppnat montern: Fältskog, Karl Ek och Rapp. Luckan bröts nog upp för att det skulle se ut som ett vanligt inbrott."},
  {"id": "s-karl", "kraver": ["f-karl-ljuger", "f-karl-omojlig"], "efter": ["s-tid"], "fraga": "Karl ljög om var han var. Betyder det att han är tjuven?", "alternativ": [
    {"text": "Ja – den som ljuger har något att dölja.", "svar": "Han hade något att dölja – men vad? Räkna på gångtiden från där han faktiskt var."},
    {"text": "Nej – kl. 22.40 var han på Hornsgatan, 20 minuter bort. Han hann inte.", "ratt": True}],
   "slutsats": "Karl ljög av skam för pantsättningen, inte för stölden. Han kan inte ha varit i butiken 22.45."},
  {"id": "s-rapp", "kraver": ["f-rapp-lucka", "f-rapp-hinner"], "efter": ["s-tid"], "fraga": "Rapp kom hem 20 minuter senare än raka vägen. Vad räcker 20 minuter till?", "alternativ": [
    {"text": "En promenad i snön – det säger ingenting.", "svar": "Kanske – men räkna på omvägen: gillet → urmakeriet → hem."},
    {"text": "En omväg via urmakeriet: 6 + 18 minuter, plus några minuter vid montern.", "ratt": True},
    {"text": "Han tog en droska och var hemma tidigare.", "svar": "Hustrun och köksuret säger 23.05 – inte tidigare."}],
   "slutsats": "Omvägen via Österlånggatan tar 24 minuter i stället för 15. Med några minuter vid montern kommer man hem precis 23.05."},
  {"id": "s-span", "kraver": ["f-ekspan-golv", "f-ekspan-rapp", "f-rapp-ej-butik"], "fraga": "Rapp säger att han inte varit i butiken på sex år. Vad säger spånen i hans rock?", "alternativ": [
    {"text": "Ingenting – spån finns överallt.", "svar": "Färska ekspån i en rock som fortfarande är våt av kvällens snö?"},
    {"text": "Att han har varit i Fältskogs verkstad – i kväll.", "ratt": True}],
   "slutsats": "Rapp ljuger: färska ekspån från verkstadsgolvet sitter i hans snövåta rock."},
  {"id": "s-handske", "kraver": ["f-handske", "f-lindh-kassabok"], "fraga": "Varför låg fru Lindhs handske i butiken?", "alternativ": [
    {"text": "Hon tappade den under inbrottet.", "svar": "Handsken var torr, och hon har ingen nyckel."},
    {"text": "Hon tappade den vid sitt besök kl. 17.00.", "ratt": True}],
   "slutsats": "Handsken är ett villospår: fru Lindh tappade den på eftermiddagen."},
]

fall["losning"] = {"skyldig": "rapp", "hur": "omvag",
  "hur_text": "På väg hem från gillet gick Rapp via Österlånggatan. Han bröt upp luckan för att det skulle se ut som ett vanligt inbrott, öppnade montern med sin gamla nyckel och slet ned väggklockan när han klättrade ut 22.47. Hemma var han 23.05.",
  "bevisgrupper": [["f-rapp-hinner", "f-rapp-lucka"], ["f-rapp-hinner", "f-ekspan-rapp"], ["f-rapp-lucka", "f-ekspan-rapp"], ["f-bara-nyckel", "f-karl-omojlig", "f-rapp-hinner"], ["f-rapp-hinner", "f-faltskog-omojlig", "f-karl-omojlig"], ["f-brottstid", "f-rapp-lucka"]],
  "uteslutningar": {"faltskog": ["f-faltskog-omojlig"], "karl": ["f-karl-omojlig", "f-karl-ljuger"], "lindh": ["f-bara-nyckel", "f-lindh-omojlig"]},
  "uteslutningar_text": {
    "faltskog": "Satt på Grand Hôtel inför fyrtio gäster från sju till ett.",
    "karl": "Stod vid pantlånedisken på Hornsgatan 22.40 – tjugo minuter från urmakeriet. Han ljög om krogen av skam, inte för stölden.",
    "lindh": "Har ingen nyckel, och satt på spårvagnen till Skanstull 22.40–22.52. Handsken tappade hon kl. 17."}}
fall["anklagelse"] = {"hur_fraga": "Hur gick det till?", "hur_alternativ": [
    {"id": "dyrk", "text": "Tjuven tog sig in genom luckan och dyrkade upp montern"},
    {"id": "omvag", "text": "På väg hem från gillet: bröt upp luckan och öppnade montern med en gammal nyckel"},
    {"id": "lanad", "text": "Tjuven lånade gesällens nyckel medan han satt på krogen"},
    {"id": "efter", "text": "Efter elva, sedan väktaren gått förbi"}], "hur_kravs": False, "bevis_max": 3}
fall["ledtradar"] = [
  {"niva": 1, "kostnad": 10, "kraver": ["f-vaktaren", "f-grannen", "f-klockan"], "text": "Fastställ först när inbrottet skedde. Tre oberoende källor pekar på samma tidpunkt."},
  {"niva": 2, "kostnad": 25, "kraver": ["f-nyckelinnehavare", "f-monter", "f-gangtider"], "text": "Montern öppnades med nyckel. Lägg nyckelinnehavarnas tidskort på tidslinjen och pröva var och en mot brottstiden."},
  {"niva": 3, "kostnad": 50, "kraver": ["k-karl-pant", "k-rapp-gillet", "k-rapp-hem"], "text": "Karl ljuger – men var var han kl. 22.40? Jämför sedan Rapps raka hemväg med när hans hustru säger att han kom hem."}]
fall["aterkoppling"] = {
  "ratt": "Rapp gav sig själv alibit ”kvart i elva”. Men den som går raka vägen kommer inte hem tjugo minuter för sent. De tjugo minuterna räckte precis till en omväg via Österlånggatan – och ekspånen följde med hem i rocken.",
  "efterord": "Polaris hittades i Rapps verkstadsskåp, inlindad i ett sämskskinn. ”Den var min”, sa han till Strand. ”Hälften av den, i alla fall.” Karl Ek fick tillbaka sin fars fickur – Fältskog löste ut det åt honom dagen efter.",
  "fel": {
    "karl": "Karl ljög, men om något annat. Pantlånekontoret ligger tjugo minuter bort, och klockan 22.40 stod han vid disken.",
    "faltskog": "Fältskog höll tal på sin dotters bröllop inför fyrtio gäster. Ingen promenad i världen gör honom till tjuven.",
    "lindh": "Handsken är torr och tappades klockan fem. Fru Lindh har ingen nyckel och satt på spårvagnen när klockan föll.",
    "rapp": ""},
  "fel_allman": "Överkonstapel Strand drar på munnen och skakar på huvudet …",
  "forklaring_steg": [
    {"text": "Väktaren såg luckan hel 22.30 och bruten 23.00. Grannen hörde skrällen strax efter tre kvart, och klockan stannade 22.47. Inbrottet skedde 22.45–22.47.", "fynd": ["f-vaktaren", "f-grannen", "f-klockan", "f-brottstid"]},
    {"text": "Montern öppnades med nyckel, utan en repa. Bara Fältskog, Karl Ek och Rapp har nyckel.", "fynd": ["f-monter", "f-nyckelinnehavare", "f-bara-nyckel"]},
    {"text": "Fältskog satt på Grand Hôtel inför fyrtio gäster.", "fynd": ["f-faltskog-omojlig"]},
    {"text": "Karl ljög om krogen, men 22.40 var han på pantlånekontoret – tjugo minuter bort. Han kunde vara i butiken tidigast 23.00.", "fynd": ["f-karl-ljuger", "f-karl-omojlig"]},
    {"text": "Rapp lämnade gillet 22.30. Raka vägen hem tar 15 minuter, men hustrun säger 23.05. Omvägen via urmakeriet – 6 + 18 minuter och en stund vid montern – går ihop på minuten.", "fynd": ["f-rapp-lucka", "f-rapp-hinner", "f-kokur"]},
    {"text": "Rapp säger att han inte varit i butiken på sex år, men färska ekspån från verkstadsgolvet sitter i hans snövåta rock. Motivet: Polaris var till hälften hans konstruktion.", "fynd": ["f-ekspan-rapp", "f-ekspan-golv", "f-motiv"]},
    {"text": "Fru Lindhs handske är ett villospår: hon tappade den kl. 17 och satt på spårvagnen när klockan föll.", "fynd": ["f-handske", "f-lindh-omojlig"]}]}

ut = os.path.join(os.path.dirname(__file__), '..', '..', 'fall', 'kvart-i-elva.json')
json.dump(fall, open(ut, 'w'), ensure_ascii=False, indent=2)
print('skrev', os.path.normpath(ut))
