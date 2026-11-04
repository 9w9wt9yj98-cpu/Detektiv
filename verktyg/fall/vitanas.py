# Genererar fall/nyarsnatten-pa-vitanas.json (källan för fallet – redigera här och kör om).
import json, os
T = True
def obj(id, typ, pos, **kw):
    d = {"id": id, "typ": typ, "pos": pos}; d.update(kw); return d
def ia(namn, text, fynd=None, material=None):
    d = {"namn": namn, "text": text}
    if fynd: d["ger_fynd"] = fynd
    if material: d["ger_material"] = material
    return d
K = lambda id, person, plats, fran, titel, typ="fakta", till=None, **kw: dict(id=id, person=person, plats=plats, fran=fran, titel=titel, typ=typ, **({"till": till} if till else {}), **kw)

# Tidslinje (kontrolleras mot alla texter):
# 22.45 Ingeborg och Lunde i balsalen · 22.55 hovmästaren serverar konjak i rökrummet: kaptenen och Axel
# 22.58 Ingeborg går upp (grevinnan), Lunde går ut på terrassen (kapellmästaren) · 23.00–23.30 Lunde och trädgårdsmästaren vid fyrverkeriet
# 23.05 Axel lämnar rökrummet · 23.08–23.14 polka: Axel och fröken Linde · 23.10 kammarjungfrun hos Ingeborg i gästflygeln
# 23.12 greven ringer överste Rehnberg från biblioteket · ca 23.13 kaptenen går från rökrummet uppför östra trappan (3 min)
# 23.14–23.22 kadrilj: Axel och grevinnan · 23.16 samtalet bryts, dörren, rösten, dunsen · ca 23.17 kaptenen tillbaka i rökrummet (3 min), bränner växeln
# 23.24–23.30 vals: kaptenen och fröken Linde, utan handskar · 23.25 kammarjungfrun hos Ingeborg igen · 23.45 hovmästaren finner greven
# Gångtider (minuter): balsalen–rökrummet 1, rökrummet–biblioteket 3 (östra trappan), balsalen–biblioteket 4 (galleriet),
# balsalen–terrassen 1, terrassen–biblioteket 6, balsalen–gästflygeln 4, gästflygeln–biblioteket 8, gästflygeln–rökrummet 5, terrassen–rökrummet 2

fall = {
 "id": "nyarsnatten-pa-vitanas", "version": 1,
 "meta": {"titel": "Nyårsnatten på Vitanäs", "miljo": "Slott i Skåne", "epok": "1910-tal", "brottstyp": "mord", "langd": "lang",
   "uppskattad_tid_min": [20, 30], "svarighet": 4, "karnmekanik": "tidslinje", "bimekaniker": ["scen"], "twist": None, "kraver_rang": 0,
   "accentfarg": "#2a3a5a", "omslag": "bilder/fall8/vitanas.jpg", "mal": "Ta reda på vem som dödade greve Vinge", "handledning_mal": "greven"},
 "intro": {"rubrik": "Vitanäs slott, Skåne. Nyårsafton 1912.",
   "text": "Snön faller tät över Vitanäs. I balsalen spelar en orkester från Malmö för hundra gäster, och klockan tolv ska greve Edvard Vinge hålla sitt nyårstal.\n\nMen greven kommer aldrig ner. Kvart i tolv hittar hovmästaren honom död i biblioteket i östra flygeln, med telefonluren dinglande i sladden.\n\nKommissarie August Strand från Stockholm är gäst på slottet. Han låter stänga portarna och samla gästerna. ”Ett stort hus har långa avstånd”, säger han. ”Ingen här kan ha varit på två ställen på en gång. Ta reda på var var och en befann sig – på minuten.”",
   "uppdrag": "Vem dödade greve Vinge – och hur hann gärningspersonen till biblioteket och tillbaka?", "bild": "bilder/fall8/vitanas.jpg", "berattare": "Kommissarie August Strand"},
 "personer": [
   {"id": "greven", "namn": "Edvard Vinge", "roll": "Greve, slottets herre, offret", "misstankt": False, "beskrivning": "Sträng och noggrann. Skötte godsets affärer själv in i minsta detalj."},
   {"id": "axel", "namn": "Axel Vinge", "roll": "Grevens son", "misstankt": T, "beskrivning": "Charmig och slösaktig. Har spelskulder som fadern vägrat betala."},
   {"id": "ingeborg", "namn": "Ingeborg Sand", "roll": "Grevinnans sällskapsdam", "misstankt": T, "beskrivning": "Tystlåten och lojal. Greven ville skicka henne från slottet efter ett gräl i höstas."},
   {"id": "lunde", "namn": "Harald Lunde", "roll": "Godsförvaltare", "misstankt": T, "beskrivning": "Sköter godsets räkenskaper. Har ansvar för kvällens fyrverkeri."},
   {"id": "ekwall", "namn": "Bengt Ekwall", "roll": "Kapten vid Skånska dragonerna", "misstankt": T, "beskrivning": "Grevens vän och jaktkamrat, i gala­uniform. Tjänstgör under överste Rehnberg i Ystad."},
   {"id": "sofia", "namn": "Sofia Vinge", "roll": "Grevinna", "misstankt": False, "beskrivning": "Värdinna för balen. Dansade kadriljen med sin son."},
   {"id": "stahl", "namn": "Ståhl", "roll": "Hovmästare", "misstankt": False, "beskrivning": "Har tjänat på Vitanäs i fyrtio år. Hittade greven."},
   {"id": "noren", "namn": "Elin Norén", "roll": "Telefonist på slottets växel", "misstankt": False, "beskrivning": "Sköter växeln i köksflygeln och får inte lämna den under sitt pass."},
   {"id": "linde", "namn": "Greta Linde", "roll": "Ung balgäst", "misstankt": False, "beskrivning": "Har sitt balkort fullt av namn och klockslag."},
   {"id": "rosen", "namn": "Rosén", "roll": "Kapellmästare", "misstankt": False, "beskrivning": "Leder orkestern efter en danslista med exakta tider."},
   {"id": "hulda", "namn": "Hulda", "roll": "Kammarjungfru", "misstankt": False, "beskrivning": "Passar upp på damerna i gästflygeln."},
   {"id": "holgersson", "namn": "Holgersson", "roll": "Trädgårdsmästare", "misstankt": False, "beskrivning": "Hjälper till med fyrverkeriet."},
   {"id": "sjostedt", "namn": "Doktor Sjöstedt", "roll": "Provinsialläkare, balgäst", "misstankt": False, "beskrivning": "Undersökte greven i biblioteket."}
 ],
 "moment": [], "fynd": [], "slutsatser": [],
}

INNE = {"omgivning": "#ffdcae", "omgivning_styrka": 0.6, "bas": 0.32}
CHANDELIER = lambda id, pos, skala=0.9: obj(id, "ljuskrona", pos, styrka=1.4, modell={"fil": "modeller/chandelier_03.glb", "passa": "skala", "skala": skala, "hanger": True})

# ---------- Rum 1: Biblioteket ----------
bibl = {"id": "biblioteket", "namn": "Biblioteket", "mekanik": "scen", "payload": {"visning": "3d", "rum": {
  "bredd": 7.0, "djup": 6.0, "hojd": 3.6, "miljo": "inomhus", "bakgrund": "#120c08", "dimma": [8, 18, "#16100a"],
  "golv": "#4a2e1a", "verklig_golv": "fiskben", "tapet": {"grund": "#3a2a3a", "monster": "#2e2030"}, "panel": "#3a2414",
  "ljus": INNE,
  "start": {"pos": [1.8, 2.2], "titta": 40},
  "objekt": [
    obj("matta", "matta", [0, 0, 0.2], storlek=[3.6, 2.6], kollision=False),
    obj("skrivbord", "bord", [-0.6, 0, -1.6], storlek=[1.6, 0.76, 0.8], modell={"fil": "modeller/wooden_table_02.glb", "passa": "box"}),
    obj("greven", "taeckt", [-0.4, 0, -0.5], rot=80, interaktiv=ia("Greve Vinge",
        "Greven ligger på mattan framför skrivbordet, under en filt som doktor Sjöstedt har lagt över honom. Han har ett hårt slag i bakhuvudet. Bredvid ligger mässingsbrevpressen från skrivbordet – ett lejon på en marmorfot – med blod på foten.", "f-slaget")),
    obj("telefonen", "vaggtelefon", [-2.0, 0, -2.99], luren_av=True, interaktiv=ia("Väggtelefonen",
        "Telefonen på väggen bakom skrivbordet. Luren hänger i sin sladd ner mot golvet. Ingen har rört den – Strand ville att den skulle hänga som den hängde.")),
    obj("blocket", "papper", [-0.9, 0.77, -1.65], interaktiv=ia("Anteckningsblocket",
        "På skrivbordet ligger ett block med grevens prydliga handstil: ”Ring överste Rehnberg i kväll. Växeln på 20 000 kr – namnteckningen är INTE min.” Under det, hårt understruket: ”Han ska få veta det före tolvslaget.”", "f-blocket")),
    obj("rakenskap", "liggare", [0.0, 0.77, -1.55], interaktiv=ia("Räkenskapsboken",
        "Godsets räkenskapsbok ligger uppslagen. I marginalen har greven skrivit med rödpenna vid flera rader: ”Lunde – förklara!” Det gäller virkesförsäljningen i höstas.", "f-rakenskap")),
    obj("handsken", "handske", [-0.3, 0.0, -2.1], farg="#f2efe6", interaktiv=ia("En vit handske",
        "Under skrivbordet ligger en vit glacéhandske i herrstorlek, av det slag som herrarna bär till dansen. Den är inte grevens – han bär båda sina.", "f-handsken")),
    obj("fonstret", "dagfonster", [3.49, 0, -0.6], rot=-90, interaktiv=ia("Fönstret mot terrassen",
        "Fönstret är stängt och haspat inifrån. Snön ligger orörd på det yttre blecket och i rabatten nedanför. Ingen har kommit in den här vägen i kväll.", "f-fonstret")),
    obj("hylla1", "bokhylla", [-3.25, 0, 0.2], rot=90, storlek=[2.4, 2.6]),
    obj("hylla2", "bokhylla", [1.6, 0, -2.75], storlek=[2.4, 2.6]),
    obj("kakelugn", "kakelugn", [2.9, 0, 2.2], rot=-90, form="rund", hojd=2.8),
    obj("fatolj", "fatolj", [1.4, 0, 0.4], rot=-120, modell={"fil": "modeller/arm_chair_01.glb", "passa": "box"}),
    obj("kandelaber", "kandelaber", [-2.6, 0, -1.9], lyser=True),
    obj("sjostedt", "person", [-2.0, 0, 0.8], rot=150, rock="#1a1a1e", byxor="#1a1a1e", slips="#eeeeee", har="#8a8a8a", glasogon=True, skagg=True, seed=21,
        interaktiv=ia("Doktor Sjöstedt", "Doktor Sjöstedt torkar sina glasögon. ”Ett enda kraftigt slag bakifrån, med brevpressen. Han föll framåt och dog nästan genast. Ingen olycka – man faller inte på bakhuvudet framåt. Döden inträffade mellan elva och tjugo i tolv; närmare än så kan jag inte säga.”", "f-lakaren")),
    obj("dorr", "dorr", [0, 0, 2.99], rot=180, gar_till="galleriet", interaktiv=ia("Till galleriet", "Dörren ut till porträttgalleriet, som leder till balsalen.")),
    obj("trappdorr", "dorr", [-3.49, 0, 2.0], rot=90, interaktiv=ia("Östra trappan",
        "En smal dörr till östra trappan, som går ner till rökrummet. Strand har ställt en betjänt vid foten av den, så den är stängd för dig nu – men i kväll var den öppen.")),
    obj("bok", "anteckningsbok", [1.0, 0.0, 2.2], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
  ]}}}

# ---------- Rum 2: Porträttgalleriet ----------
galleri = {"id": "galleriet", "namn": "Porträttgalleriet", "mekanik": "scen", "last_upp_av": ["f-slaget"],
  "last_text": "Strand: ”Börja här, hos greven.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 3.4, "djup": 16.0, "hojd": 4.2, "miljo": "inomhus", "bakgrund": "#120c08", "dimma": [8, 20, "#16100a"],
  "golv": "#5a3a22", "verklig_golv": "fiskben", "tapet": {"grund": "#5a2a26", "monster": "#4a201c"}, "panel": "#3a2414",
  "ljus": INNE,
  "start": {"pos": [0, -6.6], "titta": 180},
  "objekt": [
    obj("matta", "matta", [0, 0, 0], storlek=[1.4, 14.5], kollision=False),
    *[obj(f"portratt{i}", "tavla", [-1.69, 1.9, z], rot=90, storlek=[0.9, 1.2], seed=30 + i) for i, z in enumerate([-5.5, -2.5, 0.5, 3.5])],
    *[obj(f"rustning{i}", "rustning", [1.35, 0, z], rot=-90, vapen=v) for i, (z, v) in enumerate([(-4.0, "hillebard"), (2.0, "svard")])],
    obj("gobelang", "gobelang", [1.69, 0, -1.0], rot=-90, storlek=[2.2, 1.7], motiv="jakt", seed=4),
    *[obj(f"kand{i}", "kandelaber", [-1.3, 0, z], lyser=True) for i, z in enumerate([-4.0, 2.0])],
    obj("kartbord", "bord", [1.2, 0, 5.0], storlek=[0.8, 0.76, 0.6], modell={"fil": "modeller/side_table_tall_01.glb", "passa": "box"}),
    obj("kartan", "papper", [1.2, 0.77, 5.0], antal=2, interaktiv=ia("Strands skiss över slottet",
        "Strand har ritat en skiss över slottet och gått sträckorna med hovmästaren, med fickur, i rask takt. Balsalen–rökrummet 1 minut, rökrummet–biblioteket uppför östra trappan 3, balsalen–biblioteket genom galleriet 4, balsalen–terrassen 1, terrassen–biblioteket 6, terrassen–rökrummet 2, balsalen–gästflygeln 4, gästflygeln–rökrummet 5 och gästflygeln–biblioteket 8. Snabbare än så går ingen i balklänning eller uniform.", "f-gangtider")),
    obj("bok", "anteckningsbok", [1.0, 0.77, 5.25], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("stahl", "person", [-0.6, 0, -3.0], rot=170, rock="#1a1a22", byxor="#1a1a22", slips="#eeeeee", har="#cfcfcf", seed=22,
        interaktiv=ia("Hovmästare Ståhl", "Hovmästare Ståhl står rak i ryggen, men händerna darrar. ”Jag bar in konjak till rökrummet fem i elva. Kaptenen och unge greven satt där. När jag kom tillbaka med vatten fem över gick unge greven just ut mot balsalen. Kaptenen satt kvar med tidningen. Kvart i tolv gick jag upp för att påminna greven om talet – och fann honom.”", "f-hovmastaren", ["k-axel-rok", "k-ekwall-rok"])),
    obj("ingeborg", "person", [0.5, 0, 0.8], rot=-60, kon="k", rock="#2a2a3a", har="#5a4030", seed=23,
        interaktiv=ia("Fröken Sand", "Ingeborg Sand har en sjal om axlarna och är blek. ”Jag hade huvudvärk och gick upp till mitt rum i gästflygeln strax före elva. Där låg jag tills de kom och hämtade mig. Hulda kan intyga det.”", material=["k-ingeborg-pastar"])),
    obj("hulda", "person", [-0.4, 0, 1.7], rot=130, kon="k", rock="#2a2a2a", forklade=True, har="#7a5a3a", hatt="sjalett", hattfarg="#eeeeee", seed=24,
        interaktiv=ia("Kammarjungfrun Hulda", "Hulda niger. ”Jag bar upp ett huvudvärkspulver till fröken Sand tio över elva, och tjugofem över tittade jag in igen med ett glas vatten. Båda gångerna låg hon i sängen. Det slog tio över på tornuret när jag gick upp första gången.”", material=["k-ingeborg-hulda1", "k-ingeborg-hulda2"])),
    obj("vaxeldorr", "dorr", [-1.69, 0, 6.2], rot=90, gar_till="vaxeln", interaktiv=ia("Till köksflygeln", "En tjänstedörr till köksflygeln och slottets telefonväxel.")),
    obj("bibldorr", "dorr", [0, 0, -7.99], gar_till="biblioteket", interaktiv=ia("Till biblioteket", "Biblioteket i östra flygeln.")),
    obj("baldorr", "dorr", [0, 0, 7.99], rot=180, gar_till="balsalen", interaktiv=ia("Till balsalen", "Dubbeldörrarna till balsalen.")),
  ]}}}

# ---------- Rum 3: Balsalen ----------
bal = {"id": "balsalen", "namn": "Balsalen", "mekanik": "scen", "last_upp_av": ["f-slaget"],
  "last_text": "Strand: ”Börja här, hos greven.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 14.0, "djup": 10.0, "hojd": 6.0, "miljo": "inomhus", "bakgrund": "#140e08", "dimma": [12, 28, "#1a120a"],
  "golv": "#6a4a2c", "verklig_golv": "fiskben", "tapet": {"grund": "#d8c8a0", "monster": "#c8b890"}, "panel": "#8a6a48",
  "ljus": {"omgivning": "#ffe2b8", "omgivning_styrka": 0.8, "bas": 0.4},
  "start": {"pos": [0, 3.6], "titta": 0},
  "objekt": [
    *[obj(f"pelare{i}", "pelare", [x, 0, z], hojd=6.0, radie=0.28) for i, (x, z) in enumerate([(-4.5, -2.5), (4.5, -2.5), (-4.5, 2.5), (4.5, 2.5)])],
    CHANDELIER("krona1", [-2.5, 6.0, 0]), CHANDELIER("krona2", [2.5, 6.0, 0]),
    obj("flygel", "flygel", [-4.6, 0, -3.6], rot=150),
    obj("notstall", "notstall", [-1.8, 0, -4.4], antal=4, seed=5),
    obj("kakelugn", "kakelugn", [6.55, 0, -3.6], rot=-90, form="kantig", hojd=3.2),
    obj("rosen", "person", [-2.6, 0, -3.9], rot=10, rock="#141418", byxor="#141418", slips="#eeeeee", har="#3a3a3a", skagg=True, seed=25,
        interaktiv=ia("Kapellmästare Rosén", "Kapellmästare Rosén håller sin danslista. ”Vi spelar efter klockan, min herre. Polkan 23.08 till 23.14, kadriljen 23.14 till 23.22, valsen 23.24 till 23.30. Godsförvaltaren kom hit och frågade om tiden för fyrverkeriet – det var strax före elva, sedan gick han ut på terrassen.”", "f-danslistan", ["k-lunde-bal"])),
    obj("sofia", "person", [3.0, 0, -1.2], rot=-150, kon="k", rock="#3a1a2a", har="#9a8a7a", seed=26,
        interaktiv=ia("Grevinnan", "Grevinnan sitter rak på en stol med torra ögon. ”Fröken Sand satt hos mig här tills strax före elva, då gick hon upp med huvudvärk. Axel dansade kadriljen med mig – från början till slut. Han var korrekt som alltid, handskar och allt.”", material=["k-ingeborg-bal", "k-axel-kadrilj"])),
    obj("sofiastol", "stol", [3.0, 0, -1.2], rot=-150),
    obj("axel", "person", [1.4, 0, 2.6], rot=170, rock="#141418", byxor="#141418", slips="#eeeeee", har="#c8a050", seed=27,
        interaktiv=ia("Axel Vinge", "Axel Vinge står vid fönstret med ett tomt glas. ”Jag har dansat här hela kvällen. Fråga vem ni vill.”", material=["k-axel-pastar"])),
    obj("linde", "person", [-1.4, 0, 1.6], rot=120, kon="k", rock="#e8d8e8", har="#3a2418", seed=28,
        interaktiv=ia("Fröken Linde", "Greta Linde håller fram sitt balkort, med en liten penna i ett snöre. ”Polkan dansade jag med unge greve Vinge, och valsen tjugofyra över med kapten Ekwall. Han hade inga handskar på sig i valsen – det är inte comme il faut, men jag sa ingenting.”", "f-balkortet", ["k-axel-polka", "k-ekwall-vals"])),
    obj("rokdorr", "dorr", [6.99, 0, 1.5], rot=-90, gar_till="rokrummet", interaktiv=ia("Till rökrummet", "En dörr till herrarnas rökrum, alldeles intill balsalen.")),
    obj("terrdorr", "dorr", [0, 0, 4.99], rot=180, gar_till="terrassen", interaktiv=ia("Ut på terrassen", "Glasdörrarna ut mot terrassen. Snön yr utanför.")),
    obj("galldorr", "dorr", [0, 0, -4.99], gar_till="galleriet", interaktiv=ia("Till galleriet", "Dubbeldörrarna till porträttgalleriet och östra flygeln.")),
    obj("bord", "bord", [-5.4, 0, 2.6], storlek=[0.9, 0.76, 0.6], modell={"fil": "modeller/side_table_tall_01.glb", "passa": "box"}),
    obj("bok", "anteckningsbok", [-5.4, 0.77, 2.6], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
  ]}}}

# ---------- Rum 4: Rökrummet ----------
rok = {"id": "rokrummet", "namn": "Rökrummet", "mekanik": "scen", "last_upp_av": ["f-slaget"],
  "last_text": "Strand: ”Börja här, hos greven.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 7.0, "djup": 6.0, "hojd": 3.4, "miljo": "inomhus", "bakgrund": "#120c08", "dimma": [8, 18, "#16100a"],
  "golv": "#4a3020", "verklig_golv": "plankor", "vagg": "trapanel", "panelfarg": "#4a2a18", "panel": False,
  "ljus": INNE,
  "start": {"pos": [-2.3, 0.4], "titta": -90},
  "objekt": [
    obj("biljard", "biljardbord", [0.6, 0, 0.4], rot=90),
    obj("eldstad", "eldstad", [3.3, 0, -1.4], rot=-90, interaktiv=ia("Den öppna spisen",
        "Elden har nästan brunnit ner. Längst in i askan ligger förkolnade rester av ett tjockt papper med en blå stämpel: ”…ÅNSKA BANKEN … VÄXEL … 20 000 …” och en bit av en namnteckning: ”…d Vinge”. Någon har bränt det i kväll – det har inte hunnit falla sönder.", "f-branda")),
    obj("fatolj1", "fatolj", [-2.4, 0, -1.6], rot=40, modell={"fil": "modeller/arm_chair_01.glb", "passa": "box"}),
    obj("fatolj2", "fatolj", [-0.9, 0, -2.2], rot=10, modell={"fil": "modeller/arm_chair_01.glb", "passa": "box"}),
    obj("smabord", "bord", [-1.7, 0, -1.4], storlek=[0.6, 0.6, 0.6], modell={"fil": "modeller/round_wooden_table_01.glb", "passa": "box"}),
    obj("glas", "vinglas", [-1.75, 0.61, -1.4]),
    obj("karaff", "karaff", [-1.55, 0.61, -1.45]),
    obj("rustning", "rustning", [-3.0, 0, 2.3], rot=135, vapen=None),
    obj("ekwall", "person", [-0.4, 0, 2.2], rot=200, rock="#1e2a4a", byxor="#1e2a4a", slips="#c8a040", har="#5a4030", skagg=True, seed=29,
        interaktiv=ia("Kapten Ekwall", "Kapten Bengt Ekwall, i dragonernas blå galauniform, står vid biljardbordet med kön i handen och händerna bara. ”En fruktansvärd natt. Jag satt här i rökrummet med tidningen ända till halv tolv – jag dansar inte gärna. Edvard var min bäste vän.”", material=["k-ekwall-pastar"])),
    obj("baldorr", "dorr", [-3.49, 0, -0.4], rot=90, gar_till="balsalen", interaktiv=ia("Till balsalen", "Tillbaka till balsalen.")),
    obj("trappdorr", "dorr", [3.49, 0, 1.6], rot=-90, interaktiv=ia("Östra trappan",
        "Dörren till östra trappan, som leder upp till biblioteket. En betjänt står vakt här nu på Strands order.")),
    obj("bok", "anteckningsbok", [-1.6, 0.61, -1.25], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("l1", "vagglampa", [-3.48, 2.1, 1.4], rot=90, styrka=1.0, rackvidd=5),
    obj("l2", "vagglampa", [0.6, 2.1, -2.98], styrka=1.0, rackvidd=5),
  ]}}}

# ---------- Rum 5: Telefonväxeln ----------
vaxel = {"id": "vaxeln", "namn": "Telefonväxeln", "mekanik": "scen", "last_upp_av": ["f-slaget"],
  "last_text": "Strand: ”Börja här, hos greven.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 4.0, "djup": 3.6, "hojd": 3.0, "miljo": "inomhus", "bakgrund": "#140e08", "dimma": [6, 14, "#1a120a"],
  "golv": "#6a5038", "vagg": "puts", "putsfarg": "#d8ccb0", "panel": "#5a5a4a",
  "ljus": INNE,
  "start": {"pos": [0.8, 1.0], "titta": 0},
  "objekt": [
    obj("vaxelbordet", "telefonvaxel", [-0.6, 0, -1.8]),
    obj("stol", "stol", [-0.6, 0, -0.75], rot=180),
    obj("journalen", "liggare", [0.3, 0.75, -1.45], interaktiv=ia("Växeljournalen",
        "Fröken Noréns journal, rad för rad: ”23.12 Bibl. (anknytning 7) → rikssamtal Ystad 112, överste Rehnberg. Kopplat. 23.16 Samtalet brutet. Ringt upp bibl. 23.17, 23.25, 23.35 – inget svar. 23.40 Anmält till hovmästaren.”", "f-journalen")),
    obj("noren", "person", [0.9, 0, -0.9], rot=-150, kon="k", rock="#3a3a4a", har="#6a4a2a", seed=30,
        interaktiv=ia("Fröken Norén", "Elin Norén har fortfarande hörtelefonen om halsen. ”Jag kopplade greven till Ystad 23.12 och låg kvar på linjen en stund för att höra att det gick fram. Greven sa: ’Rehnberg, det gäller en av dina officerare.’ Sedan hörde jag en dörr, och greven sa skarpt: ’Vad vill du? Jag talar i telefon!’ Så en duns, och sedan ingenting. Klockan på växeln visade 23.16. Jag får inte lämna växeln, så jag ringde upp igen och igen.”", "f-noren")),
    obj("klocka", "vaggur", [1.3, 1.9, -1.79]),
    obj("dorr", "dorr", [1.99, 0, 0.6], rot=-90, gar_till="galleriet", interaktiv=ia("Till galleriet", "Tillbaka genom köksflygeln till porträttgalleriet.")),
    obj("bok", "anteckningsbok", [0.3, 0.75, -1.7], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("l1", "vagglampa", [-1.98, 2.0, 0.0], rot=90, styrka=1.0, rackvidd=4),
  ]}}}

# ---------- Rum 6: Terrassen ----------
terr = {"id": "terrassen", "namn": "Terrassen", "mekanik": "scen", "last_upp_av": ["f-slaget"],
  "last_text": "Strand: ”Börja här, hos greven.”",
  "payload": {"visning": "3d", "rum": {
  "bredd": 18.0, "djup": 12.0, "hojd": 12.0, "miljo": "inomhus", "vagg": "fasad", "fasadfarg": "#c8a868", "tak": False, "panel": False, "sno": 900,
  "bakgrund": "#0c111c", "dimma": [10, 32, "#141a26"], "golv": {"typ": "sten"},
  "ljus": {"omgivning": "#9fb0d0", "omgivning_styrka": 0.6, "bas": 0.28},
  "start": {"pos": [0, 1.6], "titta": 0},
  "objekt": [
    obj("fasaden", "slottsfasad", [-1.0, 0, -6.0], bredd=16, hojd=12, upplysta=[1, 2, 3, 5, 9, 10], kollision=False),
    obj("balustrad", "balustrad", [0, 0, 3.0], langd=12, sno=True),
    obj("fyrverkeri", "fyrverkeri", [2.6, 0, 1.6], rot=-20, interaktiv=ia("Fyrverkeriet",
        "Lådorna med raketer står färdiga för tolvslaget. Snön på locken är bortborstad, och runt dem är snön nertrampad av två par stövlar.", "f-fyrverkeri")),
    obj("lunde", "person", [3.6, 0, 0.8], rot=-120, rock="#3a3226", byxor="#2a2a26", hatt="hatt", hattfarg="#2a2420", har="#6a5a4a", skagg=True, seed=31,
        interaktiv=ia("Godsförvaltare Lunde", "Harald Lunde har snö på axlarna. ”Jag har stått här ute med fyrverkeriet sedan elva. Holgersson och jag. Räkenskaperna? Greven och jag var oense om virkespriset – det är allt.”", material=["k-lunde-pastar"])),
    obj("holgersson", "person", [1.4, 0, 2.0], rot=160, rock="#4a3a2a", byxor="#3a3026", hatt="mossa", hattfarg="#3a3026", har="#8a7a6a", seed=32,
        interaktiv=ia("Trädgårdsmästare Holgersson", "Holgersson stampar av sig snön. ”Förvaltaren kom ut ett par minuter före elva, och vi stod här tillsammans vid lådorna till halv tolv, då gick han in en sväng och kom tillbaka. Han gick inte någonstans, vi skulle ju ha allt klart till tolv.”", material=["k-lunde-holgersson"])),
    obj("dorr", "dorr", [-1.0, 0, -5.97], gar_till="balsalen", interaktiv=ia("In i balsalen", "Glasdörrarna in till balsalen.")),
    obj("bank", "bord", [-3.5, 0, 1.2], storlek=[1.0, 0.76, 0.6], modell={"fil": "modeller/wooden_table_02.glb", "passa": "box"}),
    obj("bok", "anteckningsbok", [-3.5, 0.77, 1.2], funktion="anteckningsbok", interaktiv={"namn": "Anteckningsboken"}),
    obj("lykta1", "gaslykta", [-6.0, 0, 2.6], styrka=1.4),
    obj("lykta2", "gaslykta", [6.0, 0, 2.6], styrka=1.4),
  ]}}}

tidslinje = {"id": "tidslinjen", "namn": "Tidslinjen", "mekanik": "tidslinje", "last_upp_av": ["f-gangtider"],
  "last_text": "Utan gångtider går det inte att räkna. Strand har ritat en skiss över slottet i porträttgalleriet.",
  "payload": {
  "kort_instruktion": "Lägg tidskorten på rätt person och pröva var och en mot brottstiden.",
  "instruktion": "Tryck på ett tidskort och sedan ”Lägg här” hos den person det gäller. Gångtiderna mellan platserna räknas ut åt dig: rött betyder omöjligt, gult att tid saknas i redovisningen. Heldragna kort kommer från andra källor än personen själv – vittnen, papper och klockor –, streckade är personens eget påstående. När brottstiden är fastställd kan du pröva varje person mot den. Fel kostar ingenting.",
  "fran": "22.45", "till": "23.45", "lucka_min": 15,
  "personer": ["axel", "ingeborg", "lunde", "ekwall"],
  "platser": {"balsalen": "balsalen", "rokrummet": "rökrummet", "biblioteket": "biblioteket", "gastflygeln": "gästflygeln", "terrassen": "terrassen"},
  "gangtider": [["balsalen", "rokrummet", 1], ["rokrummet", "biblioteket", 3], ["balsalen", "biblioteket", 4], ["balsalen", "terrassen", 1], ["terrassen", "biblioteket", 6], ["terrassen", "rokrummet", 2], ["balsalen", "gastflygeln", 4], ["gastflygeln", "rokrummet", 5], ["gastflygeln", "biblioteket", 8]],
  "kort": [
    K("k-axel-pastar", "axel", "balsalen", "22.45", "”Dansade hela kvällen”", typ="pastaende", till="23.45", ikon="🕺", kalla="Axel själv", text="Axel: i balsalen hela kvällen."),
    K("k-axel-rok", "axel", "rokrummet", "22.55", "Konjak i rökrummet", till="23.05", ikon="🥃", kalla="hovmästaren", text="Satt med kaptenen 22.55; gick ut mot balsalen 23.05."),
    K("k-axel-polka", "axel", "balsalen", "23.08", "Polkan med fröken Linde", till="23.14", ikon="💃", kalla="balkortet och danslistan", text="Polkan 23.08–23.14."),
    K("k-axel-kadrilj", "axel", "balsalen", "23.14", "Kadriljen med grevinnan", till="23.22", ikon="💃", kalla="grevinnan och danslistan", text="Hela kadriljen, 23.14–23.22."),
    K("k-ingeborg-bal", "ingeborg", "balsalen", "22.45", "Hos grevinnan i balsalen", till="22.58", ikon="🪑", kalla="grevinnan", text="Gick upp strax före elva."),
    K("k-ingeborg-pastar", "ingeborg", "gastflygeln", "23.00", "”I mitt rum från elva”", typ="pastaende", till="23.45", ikon="🛏️", kalla="fröken Sand själv", text="Låg med huvudvärk."),
    K("k-ingeborg-hulda1", "ingeborg", "gastflygeln", "23.10", "Huvudvärkspulvret", ikon="💊", kalla="kammarjungfrun och tornuret", text="Hulda bar upp pulver 23.10."),
    K("k-ingeborg-hulda2", "ingeborg", "gastflygeln", "23.25", "Ett glas vatten", ikon="🥛", kalla="kammarjungfrun", text="Hulda tittade in igen 23.25."),
    K("k-lunde-bal", "lunde", "balsalen", "22.45", "Frågar om fyrverkeriet", till="22.58", ikon="🎻", kalla="kapellmästaren", text="Gick ut på terrassen strax före elva."),
    K("k-lunde-pastar", "lunde", "terrassen", "23.00", "”Vid fyrverkeriet från elva”", typ="pastaende", till="23.30", ikon="🎆", kalla="Lunde själv", text="Lunde: på terrassen hela tiden."),
    K("k-lunde-holgersson", "lunde", "terrassen", "23.00", "Vid lådorna med Holgersson", till="23.30", ikon="🎆", kalla="trädgårdsmästaren", text="Tillsammans vid fyrverkeriet till halv tolv."),
    K("k-ekwall-pastar", "ekwall", "rokrummet", "22.45", "”Tidningen till halv tolv”", typ="pastaende", till="23.30", ikon="📰", kalla="kaptenen själv", text="Kaptenen: satt i rökrummet hela tiden."),
    K("k-ekwall-rok", "ekwall", "rokrummet", "22.55", "Konjak i rökrummet", till="23.05", ikon="🥃", kalla="hovmästaren", text="Satt kvar med tidningen när Axel gick 23.05."),
    K("k-ekwall-vals", "ekwall", "balsalen", "23.24", "Valsen med fröken Linde", till="23.30", ikon="💃", kalla="balkortet och danslistan", text="Dansade valsen 23.24 – utan handskar."),
  ],
  "brott": {"plats": "biblioteket", "fran": "23.16", "till": "23.17", "kraver": ["f-brottstid"], "fraga": "i biblioteket", "text": "I biblioteket – om det var den här personen"},
  "konflikter": [
    {"id": "m-axel", "kraver": ["k-axel-pastar", "k-axel-rok"], "ger_fynd": "f-axel-ljog", "text": "Axel säger att han dansade i balsalen hela kvällen – men 22.55–23.05 satt han i rökrummet med kaptenen."},
    {"id": "m-ekwall", "kraver": ["k-ekwall-pastar", "k-ekwall-vals"], "ger_fynd": "f-ekwall-ljog", "text": "Kaptenen säger att han satt i rökrummet till halv tolv och inte dansar gärna – men 23.24 dansade han valsen i balsalen med fröken Linde."},
  ],
  "prov": [
    {"id": "p-axel", "person": "axel", "vantat": "omojlig", "kraver": ["k-axel-kadrilj", "f-brottstid"], "ger_fynd": "f-axel-omojlig", "text_omojlig": "Axel dansade kadriljen med sin mor i balsalen 23.14–23.22. Han kan inte ha varit i biblioteket 23.16."},
    {"id": "p-ingeborg", "person": "ingeborg", "vantat": "omojlig", "kraver": ["k-ingeborg-hulda1", "f-brottstid"], "ger_fynd": "f-ingeborg-omojlig", "text_omojlig": "23.10 låg fröken Sand i sin säng i gästflygeln. Därifrån är det 8 minuter till biblioteket – tidigast 23.18. Hon hann inte."},
    {"id": "p-lunde", "person": "lunde", "vantat": "omojlig", "kraver": ["k-lunde-holgersson", "f-brottstid"], "ger_fynd": "f-lunde-omojlig", "text_omojlig": "Lunde stod vid fyrverkeriet med trädgårdsmästaren 23.00–23.30. Han kan inte ha varit i biblioteket 23.16."},
    {"id": "p-ekwall", "person": "ekwall", "vantat": "mojlig", "kraver": ["k-ekwall-rok", "k-ekwall-vals", "f-brottstid"], "ger_fynd": "f-ekwall-hinner", "text_mojlig": "Rökrummet 23.05 → östra trappan 3 minuter → biblioteket 23.16 → tillbaka 3 minuter → rökrummet 23.20 → balsalen 1 minut → valsen 23.24. Det går ihop, med minuter till godo."},
  ]}}

fall["moment"] = [bibl, galleri, bal, rok, vaxel, terr, tidslinje]

fall["fynd"] = [
  {"id": "f-slaget", "titel": "Slaget", "ikon": "🦁", "typ": "nyckel", "text": "Greven slogs ihjäl bakifrån med mässingsbrevpressen från sitt eget skrivbord."},
  {"id": "f-lakaren", "titel": "Läkarens bedömning", "ikon": "🩺", "typ": "nyckel", "text": "Doktor Sjöstedt: ett enda slag bakifrån, ingen olycka. Döden inträffade mellan 23.00 och 23.40."},
  {"id": "f-journalen", "titel": "Växeljournalen", "ikon": "📒", "typ": "nyckel", "text": "23.12 kopplades greven från biblioteket till överste Rehnberg i Ystad. 23.16 bröts samtalet. Biblioteket svarade inte på uppringningarna 23.17, 23.25 och 23.35."},
  {"id": "f-noren", "titel": "Det telefonisten hörde", "ikon": "🎧", "typ": "nyckel", "text": "Fröken Norén hörde greven säga ”det gäller en av dina officerare”, sedan en dörr, ”Vad vill du?”, en duns – och tystnad. Växelns klocka visade 23.16."},
  {"id": "f-blocket", "titel": "Grevens anteckning", "ikon": "📝", "typ": "nyckel", "text": "”Ring överste Rehnberg i kväll. Växeln på 20 000 kr – namnteckningen är INTE min. Han ska få veta det före tolvslaget.”", "forklaring": "Någon hade förfalskat grevens namn på en växel – och greven tänkte anmäla det till överste Rehnberg, chef för en av sina officerare."},
  {"id": "f-rakenskap", "titel": "Räkenskapsboken", "ikon": "📕", "typ": "avledande", "galler": ["lunde"], "text": "I räkenskapsboken har greven skrivit ”Lunde – förklara!” vid virkesförsäljningen.", "forklaring": "Ett motiv – men Lunde stod vid fyrverkeriet med trädgårdsmästaren hela tiden."},
  {"id": "f-handsken", "titel": "Den vita handsken", "ikon": "🧤", "typ": "nyckel", "galler": ["ekwall"], "text": "Under skrivbordet låg en vit glacéhandske i herrstorlek. Den är inte grevens."},
  {"id": "f-fonstret", "titel": "Fönstret mot terrassen", "ikon": "❄️", "typ": "stod", "text": "Bibliotekets fönster är haspat inifrån, och snön utanför är orörd. Ingen kom in utifrån."},
  {"id": "f-gangtider", "titel": "Gångtiderna", "ikon": "🗺️", "typ": "bakgrund", "text": "Strand och hovmästaren har gått sträckorna med fickur. Snabbare än så går ingen."},
  {"id": "f-hovmastaren", "titel": "Hovmästarens konjak", "ikon": "🥃", "typ": "stod", "galler": ["axel", "ekwall"], "text": "Hovmästaren serverade kaptenen och Axel i rökrummet 22.55. Axel gick 23.05; kaptenen satt kvar ensam med tidningen."},
  {"id": "f-danslistan", "titel": "Danslistan", "ikon": "🎼", "typ": "bakgrund", "text": "Orkestern spelar efter klockan: polkan 23.08–23.14, kadriljen 23.14–23.22, valsen 23.24–23.30."},
  {"id": "f-balkortet", "titel": "Fröken Lindes balkort", "ikon": "💌", "typ": "nyckel", "galler": ["ekwall"], "text": "Fröken Linde dansade polkan med Axel och valsen 23.24 med kapten Ekwall – som inte hade några handskar på sig."},
  {"id": "f-fyrverkeri", "titel": "Spåren vid fyrverkeriet", "ikon": "🎆", "typ": "stod", "galler": ["lunde"], "text": "Snön runt fyrverkeriet är nertrampad av två par stövlar."},
  {"id": "f-branda", "titel": "Den brända växeln", "ikon": "🔥", "typ": "nyckel", "galler": ["ekwall"], "text": "I rökrummets öppna spis ligger nybrända rester av en bankväxel på 20 000 kr med en bit av grevens namnteckning."},
  {"id": "f-brottstid", "titel": "Brottstiden 23.16", "ikon": "⏱️", "typ": "nyckel", "text": "Växeljournalen, telefonisten och läkaren pekar på samma tid: greven dödades 23.16 i biblioteket."},
  {"id": "f-axel-ljog", "titel": "Axel i rökrummet", "ikon": "🥃", "typ": "avledande", "galler": ["axel"], "text": "Axel sa att han dansade hela kvällen, men 22.55–23.05 satt han i rökrummet.", "forklaring": "Axel bad kaptenen om pengar till sina spelskulder och ville inte att modern skulle få veta det. Han ljög om rökrummet – inte om biblioteket."},
  {"id": "f-ekwall-ljog", "titel": "Kaptenens vals", "ikon": "💃", "typ": "nyckel", "galler": ["ekwall"], "text": "Kaptenen säger att han satt i rökrummet till halv tolv och inte dansar gärna – men 23.24 dansade han valsen i balsalen."},
  {"id": "f-axel-omojlig", "titel": "Axel i kadriljen", "ikon": "💃", "typ": "nyckel", "galler": ["axel"], "text": "Axel dansade kadriljen med grevinnan 23.14–23.22."},
  {"id": "f-ingeborg-omojlig", "titel": "Fröken Sand i gästflygeln", "ikon": "🛏️", "typ": "nyckel", "galler": ["ingeborg"], "text": "23.10 låg fröken Sand i gästflygeln, 8 minuter från biblioteket. Hon kunde vara där tidigast 23.18."},
  {"id": "f-lunde-omojlig", "titel": "Lunde vid fyrverkeriet", "ikon": "🎆", "typ": "nyckel", "galler": ["lunde"], "text": "Lunde stod vid fyrverkeriet med trädgårdsmästaren 23.00–23.30."},
  {"id": "f-ekwall-hinner", "titel": "Kaptenen hinner", "ikon": "🧭", "typ": "nyckel", "galler": ["ekwall"], "text": "Rökrummet → östra trappan → biblioteket 23.16 → rökrummet → balsalen 23.24. Det går ihop, med minuter till godo."},
]

fall["slutsatser"] = [
  {"id": "s-tid", "kraver": ["f-journalen", "f-noren", "f-lakaren"], "ger_fynd": "f-brottstid", "fraga": "När dödades greven?", "alternativ": [
    {"text": "Någon gång mellan elva och tjugo i tolv – närmare går det inte att säga.", "svar": "Läkaren kan inte säga närmare – men växeln kan."},
    {"text": "23.16, när telefonsamtalet bröts.", "ratt": True},
    {"text": "23.40, när telefonisten anmälde det.", "svar": "Då hade biblioteket redan inte svarat på tre uppringningar."}],
   "slutsats": "Växeljournalen, telefonisten och läkaren säger samma sak: greven dödades 23.16. Brottstiden syns nu på tidslinjen."},
  {"id": "s-utifran", "kraver": ["f-fonstret", "f-slaget", "f-lakaren"], "fraga": "Kan någon ha kommit in utifrån, eller var det en olycka?", "alternativ": [
    {"text": "En inbrottstjuv kom in genom fönstret.", "svar": "Fönstret är haspat inifrån och snön utanför är orörd."},
    {"text": "Greven föll och slog sig.", "svar": "Doktorn: ett slag bakifrån med brevpressen. Man faller inte på bakhuvudet framåt."},
    {"text": "Nej – gärningspersonen fanns i huset och kom genom en dörr.", "ratt": True}],
   "slutsats": "Gärningspersonen kom inifrån slottet, genom galleriet eller östra trappan."},
  {"id": "s-motiv", "kraver": ["f-blocket", "f-noren", "f-branda"], "fraga": "Vad ville greven säga till överste Rehnberg?", "alternativ": [
    {"text": "Att godsförvaltaren fifflat med virket.", "svar": "Det gäller räkenskapsboken, inte översten. Greven sa ”en av dina officerare”."},
    {"text": "Att en av överstens officerare hade förfalskat hans namn på en växel på 20 000 kr.", "ratt": True},
    {"text": "Att han ville önska gott nytt år.", "svar": "Läs anteckningen på blocket."}],
   "slutsats": "Greven tänkte anmäla en officer för en förfalskad växel. Resterna av den ligger i rökrummets spis."},
  {"id": "s-handsken", "kraver": ["f-handsken", "f-balkortet"], "fraga": "En herrhandske låg under skrivbordet. Vems kan den vara?", "alternativ": [
    {"text": "Grevens egen.", "svar": "Greven bär båda sina handskar."},
    {"text": "Den som dansade utan handskar efter mordet.", "ratt": True},
    {"text": "Vem som helst av herrarna.", "svar": "Herrarna bär handskar till dansen – vem saknade sina?"}],
   "slutsats": "Kapten Ekwall dansade valsen 23.24 utan handskar. Den vita handsken under skrivbordet passar honom."},
  {"id": "s-axel", "kraver": ["f-axel-ljog", "f-axel-omojlig"], "efter": ["s-tid"], "fraga": "Axel ljög om rökrummet och har spelskulder. Är han gärningsmannen?", "alternativ": [
    {"text": "Ja – den som ljuger har något att dölja.", "svar": "Han hade något att dölja – men var befann han sig 23.16?"},
    {"text": "Nej – han dansade kadriljen med sin mor 23.14–23.22.", "ratt": True}],
   "slutsats": "Axel ljög om skulderna, inte om mordet. Han dansade kadriljen när greven dog."},
  {"id": "s-lunde", "kraver": ["f-rakenskap", "f-lunde-omojlig"], "efter": ["s-tid"], "fraga": "Greven ville ha en förklaring av Lunde. Kan han ha gjort det?", "alternativ": [
    {"text": "Ja – räkenskaperna ger honom motiv.", "svar": "Motiv är inget bevis. Var stod han 23.16?"},
    {"text": "Nej – han stod vid fyrverkeriet med trädgårdsmästaren 23.00–23.30.", "ratt": True}],
   "slutsats": "Lunde har motiv men ett vittne: han stod på terrassen med Holgersson."},
  {"id": "s-ekwall", "kraver": ["f-ekwall-ljog", "f-ekwall-hinner"], "efter": ["s-tid"], "fraga": "Kaptenen säger att han satt i rökrummet till halv tolv. Vad visar tidslinjen?", "alternativ": [
    {"text": "Att han talar sanning – hovmästaren såg honom där.", "svar": "Hovmästaren såg honom 22.55–23.05. Efter det?"},
    {"text": "Att han ljuger: 23.24 dansade han i balsalen, och från rökrummet hinner man till biblioteket och tillbaka på åtta minuter.", "ratt": True}],
   "slutsats": "Kaptenen var ensam i rökrummet från 23.05, och östra trappan leder rakt upp till biblioteket. Hans omväg går ihop på minuten."},
]

fall["losning"] = {"skyldig": "ekwall", "hur": "trappan",
  "hur_text": "Från rökrummet uppför östra trappan till biblioteket, där greven just talade med överste Rehnberg. Efter slaget tog kaptenen den förfalskade växeln, gick samma väg tillbaka, brände den i rökrummets spis och dansade valsen 23.24 – utan sin ena handske, som låg kvar under skrivbordet.",
  "bevisgrupper": [["f-ekwall-hinner", "f-ekwall-ljog"], ["f-ekwall-hinner", "f-handsken"], ["f-ekwall-hinner", "f-branda"], ["f-handsken", "f-balkortet", "f-branda"], ["f-ekwall-ljog", "f-branda"], ["f-ekwall-hinner", "f-axel-omojlig", "f-lunde-omojlig"]],
  "uteslutningar": {"axel": ["f-axel-omojlig"], "ingeborg": ["f-ingeborg-omojlig"], "lunde": ["f-lunde-omojlig"]},
  "uteslutningar_text": {
    "axel": "Dansade kadriljen med grevinnan i balsalen 23.14–23.22. Han ljög om rökrummet för att dölja att han bad kaptenen om pengar.",
    "ingeborg": "Låg i gästflygeln när kammarjungfrun kom med pulvret 23.10 – åtta minuter från biblioteket.",
    "lunde": "Stod vid fyrverkeriet på terrassen med trädgårdsmästaren 23.00–23.30."}}
fall["anklagelse"] = {"hur_fraga": "Hur kom gärningspersonen till biblioteket?", "hur_alternativ": [
    {"id": "galleriet", "text": "Från balsalen genom porträttgalleriet"},
    {"id": "fonstret", "text": "Utifrån, genom fönstret mot terrassen"},
    {"id": "trappan", "text": "Från rökrummet uppför östra trappan – och samma väg tillbaka"},
    {"id": "olycka", "text": "Ingen – greven föll och slog sig"}], "hur_kravs": False, "bevis_max": 3}
fall["ledtradar"] = [
  {"niva": 1, "kostnad": 10, "kraver": ["f-journalen", "f-noren", "f-gangtider"], "text": "Börja med två frågor: exakt när dog greven, och hur långt är det mellan slottets rum? Växeln i köksflygeln och skissen i galleriet ger dig svaren. Lägg sedan tidskorten på tidslinjen."},
  {"niva": 2, "kostnad": 25, "kraver": ["f-brottstid", "k-axel-kadrilj", "k-ingeborg-hulda1", "k-lunde-holgersson", "k-ekwall-vals"], "text": "Pröva var och en mot 23.16. Vilka har ett vittne som håller dem kvar någon annanstans – och vem var ensam, med en kort väg till biblioteket?"},
  {"niva": 3, "kostnad": 50, "kraver": ["k-ekwall-rok", "f-handsken", "f-balkortet", "f-branda"], "text": "Den som satt ensam kvar i rökrummet efter 23.05 hade östra trappan rakt upp till biblioteket. Vem dansade valsen 23.24 utan handskar – och vad ligger i rökrummets spis?"}]
fall["aterkoppling"] = {
  "ratt": "Ett stort hus har långa avstånd – men inte från alla rum. Kaptenen satt ensam i rökrummet med östra trappan rakt upp till biblioteket. Han hade skrivit grevens namn på en växel på 20 000 kr, och när greven ringde hans överste för att anmäla det gick han upp. Tillbaka i rökrummet brände han växeln i spisen och gick in och dansade valsen, som om ingenting hänt. Men den ena vita handsken låg kvar under skrivbordet.",
  "fel": {
    "axel": "Axel ljög om rökrummet för att dölja sina skulder – men han dansade kadriljen med sin mor när greven dog.",
    "ingeborg": "Fröken Sand låg i gästflygeln 23.10, åtta minuter från biblioteket. Hon hann inte.",
    "lunde": "Räkenskaperna ger Lunde ett motiv, men trädgårdsmästaren stod bredvid honom vid fyrverkeriet hela tiden."},
  "fel_allman": "Kommissarie Strand stryker sig över mustaschen och skakar på huvudet …",
  "forklaring_steg": [
    {"text": "Växeljournalen och telefonisten: samtalet bröts 23.16, efter en dörr, en röst och en duns. Läkaren: ett slag bakifrån, ingen olycka.", "fynd": ["f-journalen", "f-noren", "f-lakaren", "f-brottstid"]},
    {"text": "Fönstret var haspat och snön orörd. Gärningspersonen kom inifrån slottet.", "fynd": ["f-fonstret"]},
    {"text": "Axel dansade kadriljen 23.14–23.22. Fröken Sand låg i gästflygeln 23.10, åtta minuter bort. Lunde stod vid fyrverkeriet med trädgårdsmästaren.", "fynd": ["f-axel-omojlig", "f-ingeborg-omojlig", "f-lunde-omojlig"]},
    {"text": "Kaptenen satt ensam i rökrummet från 23.05. Han säger att han satt kvar till halv tolv, men dansade valsen 23.24. Östra trappan till biblioteket tar tre minuter – omvägen går ihop.", "fynd": ["f-ekwall-ljog", "f-ekwall-hinner", "f-hovmastaren"]},
    {"text": "Greven tänkte anmäla en officer för en förfalskad växel på 20 000 kr. Resterna av växeln ligger i rökrummets spis.", "fynd": ["f-blocket", "f-branda"]},
    {"text": "Under skrivbordet låg en vit herrhandske – och kapten Ekwall dansade valsen utan handskar.", "fynd": ["f-handsken", "f-balkortet"]}]}

# Miljöljud per rum (se js/ljud.js)
LJUD = {"biblioteket": [{"typ": "tick", "styrka": 0.6}], "rokrummet": ["brasa"], "vaxeln": ["tick"], "terrassen": [{"typ": "vind", "styrka": 0.7}]}
for m in fall["moment"]:
  if m["id"] in LJUD: m["payload"]["rum"]["ljud"] = LJUD[m["id"]]

ut = os.path.join(os.path.dirname(__file__), '..', '..', 'fall', 'nyarsnatten-pa-vitanas.json')
json.dump(fall, open(ut, 'w'), ensure_ascii=False, indent=2)
print('skrev', os.path.normpath(ut))
