three.js r186 (0.186.1), MIT. Buntad till en fil med esbuild: three/build/three.module.js --bundle --minify --format=esm

`addons/` – GLTFLoader (`loaders/GLTFLoader.js`) med beroendena `utils/BufferGeometryUtils.js` och `utils/SkeletonUtils.js`, oförändrade ur npm-paketet three@0.186.1 (`examples/jsm/`) förutom att `from 'three'` är omskrivet till den relativa sökvägen `../../three.module.min.js`. Används bara i förhandsgranskningen `?stil=verklig` (`js/tre/modeller.js`).
