"""Brute-force-verifiering av logikrutnätet i Fall 3 (Middagen på Solgläntan).
Platser 1-4 medsols från överstens högra sida: ordningen runt bordet är
Översten-1-2-3-4-Översten. Plats 1 och 4 sitter bredvid översten."""
from itertools import permutations
P = ["Astrid", "Bertil", "Cecilia", "David"]
YRKE = ["läkare", "advokat", "konstnär", "pastor"]
DRYCK = ["sherry", "whisky", "champagne", "te"]
KVINNOR = {"Astrid", "Cecilia"}
def bredvid(a, b): return abs(a - b) == 1
lösningar = []
for plats in permutations(range(1, 5)):
    s = dict(zip(P, plats))
    for y in permutations(YRKE):
        yr = dict(zip(P, y)); vem_y = {v: k for k, v in yr.items()}
        for d in permutations(DRYCK):
            dr = dict(zip(P, d)); vem_d = {v: k for k, v in dr.items()}
            if dr["Astrid"] != "champagne": continue                          # L1
            if s[vem_y["läkare"]] not in (2, 3): continue                    # L2
            if s[vem_y["advokat"]] not in (1, 4) or dr[vem_y["advokat"]] == "te": continue  # L3
            w = s[vem_d["whisky"]]                                           # L4
            if not (bredvid(w, s[vem_y["advokat"]]) and bredvid(w, s[vem_y["konstnär"]])): continue
            if bredvid(s["Bertil"], s["Cecilia"]): continue                  # L5
            if dr["David"] == "te": continue                                 # L6
            if s[vem_d["sherry"]] != 1: continue                             # L7
            if vem_y["pastor"] in KVINNOR: continue                        # L8
            if s["David"] in (1, 4): continue                                 # L9
            lösningar.append((s, yr, dr))
print("Antal lösningar:", len(lösningar))
for s, yr, dr in lösningar:
    for p in sorted(P, key=lambda x: s[x]):
        print(f"  plats {s[p]}: {p:8} {yr[p]:9} {dr[p]}")
    print("  -> plats 4 (överstens vänstra sida):", [p for p in P if s[p] == 4][0])
