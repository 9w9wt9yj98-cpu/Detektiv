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
| `gothic_commode_01.glb` | Gothic Commode 01 | Kirill Sannikov | https://polyhaven.com/a/GothicCommode_01 | CC0 1.0 | Fall 1, sovrummet: byrån. Fall 5: butiksdisken |
| `classic_nightstand_01.glb` | Classic Nightstand 01 | Kirill Sannikov | https://polyhaven.com/a/ClassicNightstand_01 | CC0 1.0 | Fall 1, sovrummet: fönsterbordet; köksgången: lampbordet. Fall 2, kupé 3: bordet |
| `arm_chair_01.glb` | Arm Chair 01 | Kirill Sannikov | https://polyhaven.com/a/ArmChair_01 | CC0 1.0 | Fall 1, sovrummet: fåtöljen |
| `round_wooden_table_01.glb` | Round Wooden Table 01 | Ulan Cabanilla | https://polyhaven.com/a/round_wooden_table_01 | CC0 1.0 | Fall 1, sovrummet: sidobordet och bordet med anteckningsboken. Fall 3: bordet med anteckningsboken |
| `mantel_clock_01.glb` | Mantel Clock 01 | Yann Kervran, Rico Cilliers | https://polyhaven.com/a/mantel_clock_01 | CC0 1.0 | Fall 1, sovrummet och matsalen: pendylen (urtavlan med rätt tid läggs på av spelet) |
| `vintage_oil_lamp.glb` | Vintage Oil Lamp | Monsta3D | https://polyhaven.com/a/vintage_oil_lamp | CC0 1.0 | Fall 1, sovrummet och köksgången; fall 5, poliskammaren och hos Rapps: oljelampan |
| `antique_ceramic_vase_01.glb` | Antique Ceramic Vase 01 | James Ray Cock | https://polyhaven.com/a/antique_ceramic_vase_01 | CC0 1.0 | Fall 1, sovrummet: den vältade vasen |
| `fancy_picture_frame_01.glb` | Fancy Picture Frame 01 | Rob Tuytel, Rico Cilliers | https://polyhaven.com/a/fancy_picture_frame_01 | CC0 1.0 | Fall 1, sovrummet; fall 4, salen: tavlan |
| `classic_console_01.glb` | Classic Console 01 | Kirill Sannikov | https://polyhaven.com/a/ClassicConsole_01 | CC0 1.0 | Fall 1, matsalen: skänken |
| `wooden_table_02.glb` | Wooden Table 02 | Serhii Khromov | https://polyhaven.com/a/wooden_table_02 | CC0 1.0 | Fall 1, matsalen: bordet med gästlistan. Fall 2, restaurangvagnen: borden. Fall 3: protokollbordet. Fall 4: skrivbordet. Fall 5: borden på poliskammaren och hos Rapps |
| `dining_chair_02.glb` | Dining Chair 02 | James Ray Cock | https://polyhaven.com/a/dining_chair_02 | CC0 1.0 | Fall 1, matsalen: stolarna runt långbordet |
| `chandelier_03.glb` | Chandelier 03 | Kirill Sannikov | https://polyhaven.com/a/Chandelier_03 | CC0 1.0 | Fall 1, matsalen: ljuskronan |
| `chandelier_01.glb` | Chandelier 01 | Kirill Sannikov | https://polyhaven.com/a/Chandelier_01 | CC0 1.0 | Fall 1, köksgången: taklampan. Fall 2, restaurangvagnen: ljuskronan |
| `potted_plant_02.glb` | Potted Plant 02 | Rico Cilliers | https://polyhaven.com/a/potted_plant_02 | CC0 1.0 | Fall 1, matsalen; fall 3, verandan: krukväxterna |
| `fancy_picture_frame_02.glb` | Fancy Picture Frame 02 | Rob Tuytel, Rico Cilliers | https://polyhaven.com/a/fancy_picture_frame_02 | CC0 1.0 | Fall 1, matsalen: tavlan |
| `side_table_tall_01.glb` | Side Table Tall 01 | James Ray Cock | https://polyhaven.com/a/side_table_tall_01 | CC0 1.0 | Fall 2, korridoren: bordet med anteckningsboken. Fall 5, gatan: bordet med anteckningsboken |
| `painted_wooden_table.glb` | Painted Wooden Table | Kirill Sannikov | https://polyhaven.com/a/painted_wooden_table | CC0 1.0 | Fall 3, verandan: middagsbordet (duken ligger kvar) |
| `painted_wooden_chair_01.glb` | Painted Wooden Chair 01 | Kuutti Siitonen | https://polyhaven.com/a/painted_wooden_chair_01 | CC0 1.0 | Fall 3: stolarna (platsnumren ligger kvar); fall 4: stolarna runt långbordet |
| `street_lamp_01.glb` | Street Lamp 01 | Josh Dean | https://polyhaven.com/a/street_lamp_01 | CC0 1.0 | Fall 5, gatan: gatlyktorna (glaset glöder som förut) |

Licenstext: https://creativecommons.org/publicdomain/zero/1.0/ – Poly Havens licensvillkor: https://polyhaven.com/license
