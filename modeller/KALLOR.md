# 3D-modeller – källor och licenser

Modellerna används bara i förhandsgranskningen `?stil=verklig` (se `js/tre/modeller.js` och `docs/beslut.md`).
Alla kommer från [Poly Haven](https://polyhaven.com) och är licensierade **CC0 1.0** (public domain) –
fria att använda, ändra och sprida, även kommersiellt, utan krav på erkännande. Vi anger ändå upphovspersonerna.

Bearbetning: Poly Havens 1k-version (glTF) har gjorts om till en enda `.glb` med
`gltf-transform optimize --compress false --texture-compress webp --texture-size <1024|512> --simplify true --simplify-ratio <r> --simplify-error <e> --instance false`
– texturerna som WebP (1024 bildpunkter för möblerna, 512 för småsakerna), näten förenklade med meshoptimizer
(mest för pendylen, vasen, lampan och borden) och utan geometrikomprimering, så att ingen avkodare behövs.
Utseendet i övrigt är oförändrat.

| Fil | Modell | Upphovspersoner | Källa | Licens | Används i |
|---|---|---|---|---|---|
| `gothic_bed_01.glb` | Gothic Bed 01 | Kirill Sannikov | https://polyhaven.com/a/GothicBed_01 | CC0 1.0 | Fall 1, sovrummet: sängen |
| `gothic_commode_01.glb` | Gothic Commode 01 | Kirill Sannikov | https://polyhaven.com/a/GothicCommode_01 | CC0 1.0 | Fall 1, sovrummet: byrån |
| `classic_nightstand_01.glb` | Classic Nightstand 01 | Kirill Sannikov | https://polyhaven.com/a/ClassicNightstand_01 | CC0 1.0 | Fall 1, sovrummet: fönsterbordet |
| `arm_chair_01.glb` | Arm Chair 01 | Kirill Sannikov | https://polyhaven.com/a/ArmChair_01 | CC0 1.0 | Fall 1, sovrummet: fåtöljen |
| `round_wooden_table_01.glb` | Round Wooden Table 01 | Ulan Cabanilla | https://polyhaven.com/a/round_wooden_table_01 | CC0 1.0 | Fall 1, sovrummet: sidobordet och bordet med anteckningsboken |
| `mantel_clock_01.glb` | Mantel Clock 01 | Yann Kervran, Rico Cilliers | https://polyhaven.com/a/mantel_clock_01 | CC0 1.0 | Fall 1, sovrummet: pendylen (urtavlan med 21.14 läggs på av spelet) |
| `vintage_oil_lamp.glb` | Vintage Oil Lamp | Monsta3D | https://polyhaven.com/a/vintage_oil_lamp | CC0 1.0 | Fall 1, sovrummet: oljelampan |
| `antique_ceramic_vase_01.glb` | Antique Ceramic Vase 01 | James Ray Cock | https://polyhaven.com/a/antique_ceramic_vase_01 | CC0 1.0 | Fall 1, sovrummet: den vältade vasen |
| `fancy_picture_frame_01.glb` | Fancy Picture Frame 01 | Rob Tuytel, Rico Cilliers | https://polyhaven.com/a/fancy_picture_frame_01 | CC0 1.0 | Fall 1, sovrummet: tavlan |

Licenstext: https://creativecommons.org/publicdomain/zero/1.0/ – Poly Havens licensvillkor: https://polyhaven.com/license
