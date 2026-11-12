# 3D-modeller – källor och licenser

Modellerna används i den verkliga stilen, som är spelets standard sedan november 2026 (inte i den enkla `?stil=vanlig`; se `js/tre/modeller.js` och `docs/beslut.md`).
Alla kommer från [Poly Haven](https://polyhaven.com) och är licensierade **CC0 1.0** (public domain) –
fria att använda, ändra och sprida, även kommersiellt, utan krav på erkännande. Vi anger ändå upphovspersonerna.

Bearbetning: Poly Havens 1k-version (glTF) har gjorts om till en enda `.glb` med
`gltf-transform optimize --compress false --texture-compress webp --texture-size <1024|512> --simplify true --simplify-ratio <r> --simplify-error <e> --instance false`
– texturerna som WebP (1024 bildpunkter för möblerna, 512 för småsakerna), näten förenklade med meshoptimizer
(mest för pendylen, vasen, lampan, borden och bokskåpet) och utan geometrikomprimering, så att ingen avkodare behövs.
Utseendet i övrigt är oförändrat.

| Fil | Modell | Upphovspersoner | Källa | Licens | Används i |
|---|---|---|---|---|---|
| `gothic_bed_01.glb` | Gothic Bed 01 | Kirill Sannikov | https://polyhaven.com/a/GothicBed_01 | CC0 1.0 | Fall 1, sovrummet: sängen |
| `gothic_commode_01.glb` | Gothic Commode 01 | Kirill Sannikov | https://polyhaven.com/a/GothicCommode_01 | CC0 1.0 | Fall 1, sovrummet: byrån. Fall 5: butiksdisken. Fall 6, köket: byrån |
| `classic_nightstand_01.glb` | Classic Nightstand 01 | Kirill Sannikov | https://polyhaven.com/a/ClassicNightstand_01 | CC0 1.0 | Fall 1, sovrummet: fönsterbordet; köksgången: lampbordet. Fall 2, kupé 3: bordet |
| `arm_chair_01.glb` | Arm Chair 01 | Kirill Sannikov | https://polyhaven.com/a/ArmChair_01 | CC0 1.0 | Fall 1, sovrummet: fåtöljen. Fall 7, scenen: fåtöljerna. Fall 8, biblioteket och rökrummet: fåtöljerna. Fall 9, lobbyn: fåtöljen. Fall 11, disponentens rum: fåtöljen |
| `round_wooden_table_01.glb` | Round Wooden Table 01 | Ulan Cabanilla | https://polyhaven.com/a/round_wooden_table_01 | CC0 1.0 | Fall 1, sovrummet: sidobordet och bordet med anteckningsboken. Fall 3: bordet med anteckningsboken. Fall 7, scenen: bordet. Fall 8, rökrummet: småbordet |
| `mantel_clock_01.glb` | Mantel Clock 01 | Yann Kervran, Rico Cilliers | https://polyhaven.com/a/mantel_clock_01 | CC0 1.0 | Fall 1, sovrummet och matsalen; fall 6, köket: pendylen (urtavlan med rätt tid läggs på av spelet) |
| `vintage_oil_lamp.glb` | Vintage Oil Lamp | Monsta3D | https://polyhaven.com/a/vintage_oil_lamp | CC0 1.0 | Fall 1, sovrummet och köksgången; fall 5, poliskammaren och hos Rapps; fall 6, köket, biträdesstugan och väderstationen: oljelampan |
| `antique_ceramic_vase_01.glb` | Antique Ceramic Vase 01 | James Ray Cock | https://polyhaven.com/a/antique_ceramic_vase_01 | CC0 1.0 | Fall 1, sovrummet: den vältade vasen |
| `fancy_picture_frame_01.glb` | Fancy Picture Frame 01 | Rob Tuytel, Rico Cilliers | https://polyhaven.com/a/fancy_picture_frame_01 | CC0 1.0 | Fall 1, sovrummet; fall 4, salen: tavlan |
| `classic_console_01.glb` | Classic Console 01 | Kirill Sannikov | https://polyhaven.com/a/ClassicConsole_01 | CC0 1.0 | Fall 1, matsalen: skänken |
| `wooden_table_02.glb` | Wooden Table 02 | Serhii Khromov | https://polyhaven.com/a/wooden_table_02 | CC0 1.0 | Fall 1, matsalen: bordet med gästlistan. Fall 2, restaurangvagnen: borden. Fall 3: protokollbordet. Fall 4: skrivbordet. Fall 5: borden på poliskammaren och hos Rapps. Fall 6: borden i lanternan, biträdesstugan och väderstationen. Fall 8: skrivbordet i biblioteket och bordet på terrassen. Fall 9, skidrummet: bordet. Fall 11: skrivbordet hos disponenten, fotografens bord och det lilla bordet i ritkontoret |
| `dining_chair_02.glb` | Dining Chair 02 | James Ray Cock | https://polyhaven.com/a/dining_chair_02 | CC0 1.0 | Fall 1, matsalen: stolarna runt långbordet. Fall 8: grevinnans stol i balsalen och stolen i telefonväxeln. Fall 11: stolen vid ritbordet |
| `chandelier_03.glb` | Chandelier 03 | Kirill Sannikov | https://polyhaven.com/a/Chandelier_03 | CC0 1.0 | Fall 1, matsalen: ljuskronan. Fall 8, balsalen: ljuskronorna |
| `chandelier_01.glb` | Chandelier 01 | Kirill Sannikov | https://polyhaven.com/a/Chandelier_01 | CC0 1.0 | Fall 1, köksgången: taklampan. Fall 2, restaurangvagnen: ljuskronan |
| `potted_plant_02.glb` | Potted Plant 02 | Rico Cilliers | https://polyhaven.com/a/potted_plant_02 | CC0 1.0 | Fall 1, matsalen; fall 3, verandan: krukväxterna. Fall 7, scenen: krukväxten |
| `fancy_picture_frame_02.glb` | Fancy Picture Frame 02 | Rob Tuytel, Rico Cilliers | https://polyhaven.com/a/fancy_picture_frame_02 | CC0 1.0 | Fall 1, matsalen: tavlan |
| `side_table_tall_01.glb` | Side Table Tall 01 | James Ray Cock | https://polyhaven.com/a/side_table_tall_01 | CC0 1.0 | Fall 2, korridoren: bordet med anteckningsboken. Fall 5, gatan: bordet med anteckningsboken. Fall 7, logerna: bordet med anteckningsboken. Fall 8: borden i galleriet och balsalen. Fall 11: borden med anteckningsboken |
| `painted_wooden_table.glb` | Painted Wooden Table | Kirill Sannikov | https://polyhaven.com/a/painted_wooden_table | CC0 1.0 | Fall 3, verandan: middagsbordet (duken ligger kvar) |
| `painted_wooden_chair_01.glb` | Painted Wooden Chair 01 | Kuutti Siitonen | https://polyhaven.com/a/painted_wooden_chair_01 | CC0 1.0 | Fall 3: stolarna (platsnumren ligger kvar); fall 4: stolarna runt långbordet. Fall 7: brandmannens stol på scenen och stolen i logerna. Fall 10, hyttkorridoren: stewardens stol |
| `street_lamp_01.glb` | Street Lamp 01 | Josh Dean | https://polyhaven.com/a/street_lamp_01 | CC0 1.0 | Fall 5, gatan: gatlyktorna (glaset glöder som förut). Fall 8, terrassen: gaslyktorna |
| `dining_table.glb` | Dining Table | Aron Łyczek | https://polyhaven.com/a/dining_table | CC0 1.0 | Fall 6, köket: köksbordet med rutig duk |
| `oil_tin.glb` | Oil Tin | Niklas | https://polyhaven.com/a/oil_tin | CC0 1.0 | Fall 6, tornet och biträdesstugan: fotogenkannorna (en modell per kanna, `modell.delar`) |
| `industrial_wall_lamp.glb` | Industrial Wall Lamp | Kuutti Siitonen | https://polyhaven.com/a/industrial_wall_lamp | CC0 1.0 | Fall 7, lindraget och undre maskineriet; fall 9, arkivet: vägglamporna (burlampor; glaset glöder, `modell.lyser`). Fall 11, gruvbacken: gårdslamporna |
| `metal_office_desk.glb` | Metal Office Desk | Ulan Cabanilla | https://polyhaven.com/a/metal_office_desk | CC0 1.0 | Fall 9, arkivet: bordet med akten |
| `wall_clock.glb` | Wall Clock | PierreB3D | https://polyhaven.com/a/wall_clock | CC0 1.0 | Fall 11, ritkontoret och disponentens rum: väggklockorna (urtavlan med rätt tid läggs på av spelet och täcker modellens egen) |
| `vintage_cabinet_01.glb` | Vintage Cabinet 01 | Rico Cilliers | https://polyhaven.com/a/vintage_cabinet_01 | CC0 1.0 | Fall 11, disponentens rum: bokskåpet (står i bokhyllans ställe) |
| `lifebuoy.glb` | Lifebuoy | Hank Kaamura | https://polyhaven.com/a/lifebuoy | CC0 1.0 | Fall 10, promenaddäcket: livbojen på salongsväggen |

Licenstext: https://creativecommons.org/publicdomain/zero/1.0/ – Poly Havens licensvillkor: https://polyhaven.com/license
