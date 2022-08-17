let startLat = 33.10621;
const endPointLat = 33.57313;
const point_lat = (endPointLat - startLat) / 0.00009
let startLng = 126.11546;
const endPointLng = 127.00601;
const point_lng = (endPointLng - startLng) / 0.00009;
const point_lat_floor = Math.floor(point_lat);
const point_lng_floor = Math.floor(point_lng);


// const a = Array(point_lat_floor).fill().map(lat => {
//   const prevlat = startLat;
//   startLat = Number((startLat + 0.00009).toFixed(5))
//   return Array(point_lng_floor).fill().map((v) => {
//     const prevlng = startLng;
//     startLng = Number((startLng + 0.00009).toFixed(5))
//     return [prevlat, prevlng];
//   })
// })


mapboxgl.accessToken =
  "pk.eyJ1Ijoid20xMTE4MTExOCIsImEiOiJja3k5ZGR5ajcwNTl5MnhwZDQ1Nzk5Z2ZhIn0.HRjY1eXlyQlUABFgqz6plQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: [126.46949, 33.5052],
  zoom: 18,
});
map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
//
const userSelectData = [
  [
    126.46564937914617,
    33.50659324517873,
    126.46573948430172,
    33.50668335033427
  ],
  [
    126.46564937914617,
    33.50668335033427,
    126.46573948430172,
    33.50677345548981
  ],
  [
    126.46564937914617,
    33.50677345548981,
    126.46573948430172,
    33.50686356064536
  ],
  [
    126.46564937914617,
    33.50686356064536,
    126.46573948430172,
    33.50695366580091
  ],
  [
    126.46564937914617,
    33.50695366580091,
    126.46573948430172,
    33.50704377095644
  ],
  [
    126.46573948430172,
    33.50659324517873,
    126.46582958945727,
    33.50668335033427
  ],
  [
    126.46573948430172,
    33.50668335033427,
    126.46582958945727,
    33.50677345548981
  ],
  [
    126.46573948430172,
    33.50677345548981,
    126.46582958945727,
    33.50686356064536
  ],
  [
    126.46573948430172,
    33.50686356064536,
    126.46582958945727,
    33.50695366580091
  ],
  [
    126.46573948430172,
    33.50695366580091,
    126.46582958945727,
    33.50704377095644
  ],
  [
    126.46582958945727,
    33.50659324517873,
    126.46591969461281,
    33.50668335033427
  ],
  [
    126.46582958945727,
    33.50668335033427,
    126.46591969461281,
    33.50677345548981
  ],
  [
    126.46582958945727,
    33.50677345548981,
    126.46591969461281,
    33.50686356064536
  ],
  [
    126.46582958945727,
    33.50686356064536,
    126.46591969461281,
    33.50695366580091
  ],
  [
    126.46582958945727,
    33.50695366580091,
    126.46591969461281,
    33.50704377095644
  ],
  [
    126.46591969461281,
    33.50659324517873,
    126.46600979976836,
    33.50668335033427
  ],
  [
    126.46591969461281,
    33.50668335033427,
    126.46600979976836,
    33.50677345548981
  ],
  [
    126.46591969461281,
    33.50677345548981,
    126.46600979976836,
    33.50686356064536
  ],
  [
    126.46591969461281,
    33.50686356064536,
    126.46600979976836,
    33.50695366580091
  ],
  [
    126.46591969461281,
    33.50695366580091,
    126.46600979976836,
    33.50704377095644
  ],
  [
    126.46600979976836,
    33.50659324517873,
    126.4660999049239,
    33.50668335033427
  ],
  [
    126.46600979976836,
    33.50668335033427,
    126.4660999049239,
    33.50677345548981
  ],
  [
    126.46600979976836,
    33.50677345548981,
    126.4660999049239,
    33.50686356064536
  ],
  [
    126.46600979976836,
    33.50686356064536,
    126.4660999049239,
    33.50695366580091
  ],
  [
    126.46600979976836,
    33.50695366580091,
    126.4660999049239,
    33.50704377095644
  ],
  [
    126.4660999049239,
    33.50659324517873,
    126.46619001007943,
    33.50668335033427
  ],
  [
    126.4660999049239,
    33.50668335033427,
    126.46619001007943,
    33.50677345548981
  ],
  [
    126.4660999049239,
    33.50677345548981,
    126.46619001007943,
    33.50686356064536
  ],
  [
    126.4660999049239,
    33.50686356064536,
    126.46619001007943,
    33.50695366580091
  ],
  [
    126.4660999049239,
    33.50695366580091,
    126.46619001007943,
    33.50704377095644
  ],
  [
    126.46619001007943,
    33.50659324517873,
    126.46628011523498,
    33.50668335033427
  ],
  [
    126.46619001007943,
    33.50668335033427,
    126.46628011523498,
    33.50677345548981
  ],
  [
    126.46619001007943,
    33.50677345548981,
    126.46628011523498,
    33.50686356064536
  ],
  [
    126.46619001007943,
    33.50686356064536,
    126.46628011523498,
    33.50695366580091
  ],
  [
    126.46619001007943,
    33.50695366580091,
    126.46628011523498,
    33.50704377095644
  ],
  [
    126.46628011523498,
    33.50659324517873,
    126.46637022039053,
    33.50668335033427
  ],
  [
    126.46628011523498,
    33.50668335033427,
    126.46637022039053,
    33.50677345548981
  ],
  [
    126.46628011523498,
    33.50677345548981,
    126.46637022039053,
    33.50686356064536
  ],
  [
    126.46628011523498,
    33.50686356064536,
    126.46637022039053,
    33.50695366580091
  ],
  [
    126.46628011523498,
    33.50695366580091,
    126.46637022039053,
    33.50704377095644
  ],
  [
    126.46637022039053,
    33.50659324517873,
    126.46646032554608,
    33.50668335033427
  ],
  [
    126.46637022039053,
    33.50668335033427,
    126.46646032554608,
    33.50677345548981
  ],
  [
    126.46637022039053,
    33.50677345548981,
    126.46646032554608,
    33.50686356064536
  ],
  [
    126.46637022039053,
    33.50686356064536,
    126.46646032554608,
    33.50695366580091
  ],
  [
    126.46637022039053,
    33.50695366580091,
    126.46646032554608,
    33.50704377095644
  ],
  [
    126.46646032554608,
    33.50659324517873,
    126.4665504307016,
    33.50668335033427
  ],
  [
    126.46646032554608,
    33.50668335033427,
    126.4665504307016,
    33.50677345548981
  ],
  [
    126.46646032554608,
    33.50677345548981,
    126.4665504307016,
    33.50686356064536
  ],
  [
    126.46646032554608,
    33.50686356064536,
    126.4665504307016,
    33.50695366580091
  ],
  [
    126.46646032554608,
    33.50695366580091,
    126.4665504307016,
    33.50704377095644
  ]
]

const selectBlackBox = [
  [
    126.46474832759077,
    33.50551198331222,
    126.46483843274628,
    33.50560208846776
  ],
  [
    126.46474832759077,
    33.50560208846776,
    126.46483843274628,
    33.505692193623304
  ],
  [
    126.46474832759077,
    33.505692193623304,
    126.46483843274628,
    33.50578229877884
  ],
  [
    126.46474832759077,
    33.50578229877884,
    126.46483843274628,
    33.50587240393439
  ],
  [
    126.46474832759077,
    33.50587240393439,
    126.46483843274628,
    33.50596250908993
  ],
  [
    126.46474832759077,
    33.50596250908993,
    126.46483843274628,
    33.506052614245476
  ],
  [
    126.46474832759077,
    33.506052614245476,
    126.46483843274628,
    33.50614271940101
  ],
  [
    126.46474832759077,
    33.50614271940101,
    126.46483843274628,
    33.50623282455656
  ],
  [
    126.46474832759077,
    33.50623282455656,
    126.46483843274628,
    33.5063229297121
  ],
  [
    126.46474832759077,
    33.5063229297121,
    126.46483843274628,
    33.50641303486764
  ],
  [
    126.46483843274628,
    33.50551198331222,
    126.46492853790183,
    33.50560208846776
  ],
  [
    126.46483843274628,
    33.50560208846776,
    126.46492853790183,
    33.505692193623304
  ],
  [
    126.46483843274628,
    33.505692193623304,
    126.46492853790183,
    33.50578229877884
  ],
  [
    126.46483843274628,
    33.50578229877884,
    126.46492853790183,
    33.50587240393439
  ],
  [
    126.46483843274628,
    33.50587240393439,
    126.46492853790183,
    33.50596250908993
  ],
  [
    126.46483843274628,
    33.50596250908993,
    126.46492853790183,
    33.506052614245476
  ],
  [
    126.46483843274628,
    33.506052614245476,
    126.46492853790183,
    33.50614271940101
  ],
  [
    126.46483843274628,
    33.50614271940101,
    126.46492853790183,
    33.50623282455656
  ],
  [
    126.46483843274628,
    33.50623282455656,
    126.46492853790183,
    33.5063229297121
  ],
  [
    126.46483843274628,
    33.5063229297121,
    126.46492853790183,
    33.50641303486764
  ],
  [
    126.46492853790183,
    33.50551198331222,
    126.46501864305739,
    33.50560208846776
  ],
  [
    126.46492853790183,
    33.50560208846776,
    126.46501864305739,
    33.505692193623304
  ],
  [
    126.46492853790183,
    33.505692193623304,
    126.46501864305739,
    33.50578229877884
  ],
  [
    126.46492853790183,
    33.50578229877884,
    126.46501864305739,
    33.50587240393439
  ],
  [
    126.46492853790183,
    33.50587240393439,
    126.46501864305739,
    33.50596250908993
  ],
  [
    126.46492853790183,
    33.50596250908993,
    126.46501864305739,
    33.506052614245476
  ],
  [
    126.46492853790183,
    33.506052614245476,
    126.46501864305739,
    33.50614271940101
  ],
  [
    126.46492853790183,
    33.50614271940101,
    126.46501864305739,
    33.50623282455656
  ],
  [
    126.46492853790183,
    33.50623282455656,
    126.46501864305739,
    33.5063229297121
  ],
  [
    126.46492853790183,
    33.5063229297121,
    126.46501864305739,
    33.50641303486764
  ],
  [
    126.46501864305739,
    33.50551198331222,
    126.46510874821294,
    33.50560208846776
  ],
  [
    126.46501864305739,
    33.50560208846776,
    126.46510874821294,
    33.505692193623304
  ],
  [
    126.46501864305739,
    33.505692193623304,
    126.46510874821294,
    33.50578229877884
  ],
  [
    126.46501864305739,
    33.50578229877884,
    126.46510874821294,
    33.50587240393439
  ],
  [
    126.46501864305739,
    33.50587240393439,
    126.46510874821294,
    33.50596250908993
  ],
  [
    126.46501864305739,
    33.50596250908993,
    126.46510874821294,
    33.506052614245476
  ],
  [
    126.46501864305739,
    33.506052614245476,
    126.46510874821294,
    33.50614271940101
  ],
  [
    126.46501864305739,
    33.50614271940101,
    126.46510874821294,
    33.50623282455656
  ],
  [
    126.46501864305739,
    33.50623282455656,
    126.46510874821294,
    33.5063229297121
  ],
  [
    126.46501864305739,
    33.5063229297121,
    126.46510874821294,
    33.50641303486764
  ],
  [
    126.46510874821294,
    33.50551198331222,
    126.46519885336845,
    33.50560208846776
  ],
  [
    126.46510874821294,
    33.50560208846776,
    126.46519885336845,
    33.505692193623304
  ],
  [
    126.46510874821294,
    33.505692193623304,
    126.46519885336845,
    33.50578229877884
  ],
  [
    126.46510874821294,
    33.50578229877884,
    126.46519885336845,
    33.50587240393439
  ],
  [
    126.46510874821294,
    33.50587240393439,
    126.46519885336845,
    33.50596250908993
  ],
  [
    126.46510874821294,
    33.50596250908993,
    126.46519885336845,
    33.506052614245476
  ],
  [
    126.46510874821294,
    33.506052614245476,
    126.46519885336845,
    33.50614271940101
  ],
  [
    126.46510874821294,
    33.50614271940101,
    126.46519885336845,
    33.50623282455656
  ],
  [
    126.46510874821294,
    33.50623282455656,
    126.46519885336845,
    33.5063229297121
  ],
  [
    126.46510874821294,
    33.5063229297121,
    126.46519885336845,
    33.50641303486764
  ],
  [
    126.46519885336845,
    33.50551198331222,
    126.465288958524,
    33.50560208846776
  ],
  [
    126.46519885336845,
    33.50560208846776,
    126.465288958524,
    33.505692193623304
  ],
  [
    126.46519885336845,
    33.505692193623304,
    126.465288958524,
    33.50578229877884
  ],
  [
    126.46519885336845,
    33.50578229877884,
    126.465288958524,
    33.50587240393439
  ],
  [
    126.46519885336845,
    33.50587240393439,
    126.465288958524,
    33.50596250908993
  ],
  [
    126.46519885336845,
    33.50596250908993,
    126.465288958524,
    33.506052614245476
  ],
  [
    126.46519885336845,
    33.506052614245476,
    126.465288958524,
    33.50614271940101
  ],
  [
    126.46519885336845,
    33.50614271940101,
    126.465288958524,
    33.50623282455656
  ],
  [
    126.46519885336845,
    33.50623282455656,
    126.465288958524,
    33.5063229297121
  ],
  [
    126.46519885336845,
    33.5063229297121,
    126.465288958524,
    33.50641303486764
  ],
  [
    126.465288958524,
    33.50551198331222,
    126.46537906367955,
    33.50560208846776
  ],
  [
    126.465288958524,
    33.50560208846776,
    126.46537906367955,
    33.505692193623304
  ],
  [
    126.465288958524,
    33.505692193623304,
    126.46537906367955,
    33.50578229877884
  ],
  [
    126.465288958524,
    33.50578229877884,
    126.46537906367955,
    33.50587240393439
  ],
  [
    126.465288958524,
    33.50587240393439,
    126.46537906367955,
    33.50596250908993
  ],
  [
    126.465288958524,
    33.50596250908993,
    126.46537906367955,
    33.506052614245476
  ],
  [
    126.465288958524,
    33.506052614245476,
    126.46537906367955,
    33.50614271940101
  ],
  [
    126.465288958524,
    33.50614271940101,
    126.46537906367955,
    33.50623282455656
  ],
  [
    126.465288958524,
    33.50623282455656,
    126.46537906367955,
    33.5063229297121
  ],
  [
    126.465288958524,
    33.5063229297121,
    126.46537906367955,
    33.50641303486764
  ],
  [
    126.46537906367955,
    33.50551198331222,
    126.4654691688351,
    33.50560208846776
  ],
  [
    126.46537906367955,
    33.50560208846776,
    126.4654691688351,
    33.505692193623304
  ],
  [
    126.46537906367955,
    33.505692193623304,
    126.4654691688351,
    33.50578229877884
  ],
  [
    126.46537906367955,
    33.50578229877884,
    126.4654691688351,
    33.50587240393439
  ],
  [
    126.46537906367955,
    33.50587240393439,
    126.4654691688351,
    33.50596250908993
  ],
  [
    126.46537906367955,
    33.50596250908993,
    126.4654691688351,
    33.506052614245476
  ],
  [
    126.46537906367955,
    33.506052614245476,
    126.4654691688351,
    33.50614271940101
  ],
  [
    126.46537906367955,
    33.50614271940101,
    126.4654691688351,
    33.50623282455656
  ],
  [
    126.46537906367955,
    33.50623282455656,
    126.4654691688351,
    33.5063229297121
  ],
  [
    126.46537906367955,
    33.5063229297121,
    126.4654691688351,
    33.50641303486764
  ]
]
let selectGreenBox = []
const selectGreenBox1 = [
  [
    126.46591969461281,
    33.50551198331222,
    126.46600979976836,
    33.50560208846776
  ],
  [
    126.46591969461281,
    33.50560208846776,
    126.46600979976836,
    33.505692193623304
  ],
  [
    126.46591969461281,
    33.505692193623304,
    126.46600979976836,
    33.50578229877884
  ],
  [
    126.46600979976836,
    33.50551198331222,
    126.4660999049239,
    33.50560208846776
  ],
  [
    126.46600979976836,
    33.50560208846776,
    126.4660999049239,
    33.505692193623304
  ],
  [
    126.46600979976836,
    33.505692193623304,
    126.4660999049239,
    33.50578229877884
  ],
  [
    126.4660999049239,
    33.50551198331222,
    126.46619001007943,
    33.50560208846776
  ],
  [
    126.4660999049239,
    33.50560208846776,
    126.46619001007943,
    33.505692193623304
  ],
  [
    126.4660999049239,
    33.505692193623304,
    126.46619001007943,
    33.50578229877884
  ],
  [
    126.46619001007943,
    33.50551198331222,
    126.46628011523498,
    33.50560208846776
  ],
  [
    126.46619001007943,
    33.50560208846776,
    126.46628011523498,
    33.505692193623304
  ],
  [
    126.46619001007943,
    33.505692193623304,
    126.46628011523498,
    33.50578229877884
  ],
  [
    126.46628011523498,
    33.50551198331222,
    126.46637022039053,
    33.50560208846776
  ],
  [
    126.46628011523498,
    33.50560208846776,
    126.46637022039053,
    33.505692193623304
  ],
  [
    126.46628011523498,
    33.505692193623304,
    126.46637022039053,
    33.50578229877884
  ],
  [
    126.46637022039053,
    33.50551198331222,
    126.46646032554608,
    33.50560208846776
  ],
  [
    126.46637022039053,
    33.50560208846776,
    126.46646032554608,
    33.505692193623304
  ],
  [
    126.46637022039053,
    33.505692193623304,
    126.46646032554608,
    33.50578229877884
  ],
  [
    126.46646032554608,
    33.50551198331222,
    126.4665504307016,
    33.50560208846776
  ],
  [
    126.46646032554608,
    33.50560208846776,
    126.4665504307016,
    33.505692193623304
  ],
  [
    126.46646032554608,
    33.505692193623304,
    126.4665504307016,
    33.50578229877884
  ],
  [
    126.4665504307016,
    33.50551198331222,
    126.46664053585715,
    33.50560208846776
  ],
  [
    126.4665504307016,
    33.50560208846776,
    126.46664053585715,
    33.505692193623304
  ],
  [
    126.4665504307016,
    33.505692193623304,
    126.46664053585715,
    33.50578229877884
  ],
  [
    126.46664053585715,
    33.50551198331222,
    126.4667306410127,
    33.50560208846776
  ],
  [
    126.46664053585715,
    33.50560208846776,
    126.4667306410127,
    33.505692193623304
  ],
  [
    126.46664053585715,
    33.505692193623304,
    126.4667306410127,
    33.50578229877884
  ]
]
const selectGreenBox2 = [
  [
    126.46591969461281,
    33.505692193623304,
    126.46600979976836,
    33.50578229877884
  ],
  [
    126.46591969461281,
    33.50578229877884,
    126.46600979976836,
    33.50587240393439
  ],
  [
    126.46591969461281,
    33.50587240393439,
    126.46600979976836,
    33.50596250908993
  ],
  [
    126.46591969461281,
    33.50596250908993,
    126.46600979976836,
    33.506052614245476
  ],
  [
    126.46591969461281,
    33.506052614245476,
    126.46600979976836,
    33.50614271940101
  ],
  [
    126.46591969461281,
    33.50614271940101,
    126.46600979976836,
    33.50623282455656
  ],
  [
    126.46591969461281,
    33.50623282455656,
    126.46600979976836,
    33.5063229297121
  ],
  [
    126.46591969461281,
    33.5063229297121,
    126.46600979976836,
    33.50641303486764
  ],
  [
    126.46600979976836,
    33.505692193623304,
    126.4660999049239,
    33.50578229877884
  ],
  [
    126.46600979976836,
    33.50578229877884,
    126.4660999049239,
    33.50587240393439
  ],
  [
    126.46600979976836,
    33.50587240393439,
    126.4660999049239,
    33.50596250908993
  ],
  [
    126.46600979976836,
    33.50596250908993,
    126.4660999049239,
    33.506052614245476
  ],
  [
    126.46600979976836,
    33.506052614245476,
    126.4660999049239,
    33.50614271940101
  ],
  [
    126.46600979976836,
    33.50614271940101,
    126.4660999049239,
    33.50623282455656
  ],
  [
    126.46600979976836,
    33.50623282455656,
    126.4660999049239,
    33.5063229297121
  ],
  [
    126.46600979976836,
    33.5063229297121,
    126.4660999049239,
    33.50641303486764
  ]
]
selectGreenBox = [...selectGreenBox1, ...selectGreenBox2]
//
// Grid COnfi
const grid = new MaplibreGrid.Grid({
  gridWidth: 0.00009,
  gridHeight: 0.00009,
  minZoom: 17,
  maxZoom: 22,
  units: "degrees",
  paint: {
    "line-opacity": 1,
  },
});
map.addControl(grid);

let selectedCells = [];
let tempSelectedCells = [];
const selectedCellsId = "selected-cells";
const beforeByselectedCellsId = "selected-cells-before";
const loadImageData = {
  'type': 'Feature',
  'properties': {},
  'geometry': {
    'type': 'Polygon',
    'coordinates': [
      [
        [
          126.46555,
          33.50650
        ],
        [
          126.46564,
          33.506503
        ],
        [
          126.46564937914617,
          33.50659324517873
        ],
        [
          126.46555927399064,
          33.50659324517873
        ],
        [
          126.46555927399064,
          33.506503140023185
        ]
      ]]
  }
}
map.on("load", () => {

  map.addSource('route', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [126.115461, 33.57313],
          [127.006015, 33.57313],
          [127.006015, 33.106217],
          [126.115461, 33.106217],
          [126.115461, 33.57313],
        ]
      }
    }
  });

  map.addSource('route1', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [126.46565, 33.57413],
          [126.46565, 33.10631],
        ]
      }
    }
  });
  map.addSource('route2', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [126.46574, 33.57413],
          [126.46574, 33.10631],
        ]
      }
    }
  });
  // 0.00007
  // 0.00007
  map.addSource('route3', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [126.115461, 33.50659],
          [127.006015, 33.50659],
        ]
      }
    }
  });
  map.addSource('route4', {
    'type': 'geojson',
    'data': {
      'type': 'Feature',
      'properties': {},
      'geometry': {
        'type': 'LineString',
        'coordinates': [
          [126.115461, 33.50651],
          [127.006015, 33.50651],
        ]
      }
    }
  });


  map.addLayer({
    'id': 'route',
    'type': 'line',
    'source': 'route',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': '#888',
      'line-width': 8
    }
  });
  map.addLayer({
    'id': 'route1',
    'type': 'line',
    'source': 'route1',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': 'red',
      'line-width': 1
    }
  });
  map.addLayer({
    'id': 'route2',
    'type': 'line',
    'source': 'route2',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': 'orange',
      'line-width': 1
    }
  });
  map.addLayer({
    'id': 'route3',
    'type': 'line',
    'source': 'route3',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': 'blue',
      'line-width': 1
    }
  });
  map.addLayer({
    'id': 'route4',
    'type': 'line',
    'source': 'route4',
    'layout': {
      'line-join': 'round',
      'line-cap': 'round'
    },
    'paint': {
      'line-color': 'yellow',
      'line-width': 1
    }
  });
  // Select polygon source
  map.addSource(selectedCellsId, {
    type: "geojson",
    data: { type: "FeatureCollection", features: selectedCells },
  });
  map.addSource(beforeByselectedCellsId, {
    type: "geojson",
    data: { type: "FeatureCollection", features: selectedCells },
  });
  map.addSource("blue", {
    type: "geojson",
    data: { type: "FeatureCollection", features: selectedCells },
  });
  map.addSource("black", {
    type: "geojson",
    data: { type: "FeatureCollection", features: selectedCells },
  });
  map.addSource("green", {
    type: "geojson",
    data: { type: "FeatureCollection", features: selectedCells },
  });

  map.addSource('source', {
    'type': 'geojson',
    'data': []
  });
  map.loadImage(
    'https://docs.mapbox.com/mapbox-gl-js/assets/colorado_flag.png',
    (err, image) => {
      // Throw an error if something goes wrong.
      if (err) throw err;

      // Add the image to the map style.
      map.addImage('pattern', image);

      // Create a new layer and style it using `fill-pattern`.
      map.addLayer({
        'id': 'pattern-layer',
        'type': 'fill',
        'source': 'source',
        'paint': {
          'fill-pattern': 'pattern'
        }
      });
    }
  );
  map.addLayer({
    id: selectedCellsId,
    source: selectedCellsId,
    type: "fill",
    paint: {
      "fill-color": "red",
      "fill-opacity": 0.6,
      "fill-outline-color": "transparent",
    },
  });
  map.addLayer({
    id: "green",
    source: "green",
    type: "fill",
    paint: {
      "fill-color": "green",
      "fill-opacity": 0.9,
      "fill-outline-color": "transparent",
    },
  });
  map.addLayer({
    id: "black",
    source: "black",
    type: "fill",
    paint: {
      "fill-color": "black",
      "fill-opacity": 0.6,
      "fill-outline-color": "transparent",
    },
  });
  map.addLayer({
    id: beforeByselectedCellsId,
    source: beforeByselectedCellsId,
    type: "fill",
    paint: {
      "fill-color": "yellow",
      "fill-opacity": 0.6,
      "fill-outline-color": "transparent",
    },
  });
  map.addLayer({
    id: "blue",
    source: "blue",
    type: "fill",
    paint: {
      "fill-color": "blue",
      "fill-opacity": 0.6,
      "fill-outline-color": "transparent",
    },
  });
  let activeSelecting = false;
  map.on(MaplibreGrid.GRID_CLICK_EVENT, ({ bbox }) => {
    if (activeSelecting) {
      activeSelecting = false;
      document.getElementById("has-resource").classList.add("resource-show");
      selectedCells = [...selectedCells, ...tempSelectedCells];
    } else {
      console.log(bbox);
      activeSelecting = true;
      console.log("activeSelecting False");
      selectedTiles([bbox]);
    }
  });
  map.on(MaplibreGrid.GRID_MOUSE_MOVE_EVENT, ({ bboxes }) => {
    if (bboxes.length > 0) {
      selectedTiles(bboxes);
    }
  });

  const selectedTiles = (bboxes) => {
    console.log("=======================SelectedTiles=====================")
    console.log(bboxes)
    const parseData = bboxes.map((v, i) => {
      const [leftlng, leftlat, rightlng, rightlat] = v;
      return [leftlat.toFixed(5), leftlng.toFixed(5), rightlat.toFixed(5), rightlng.toFixed(5)]
    })
    console.log(parseData)
    console.log("=======================SelectedTiles=====================")
    tempSelectedCells = [];
    bboxes.forEach((bbox) => {
      const cellIndex = selectedCells.findIndex(
        (x) => x.geometry.bbox.toString() === bbox.toString()
      );
      if (cellIndex !== -1) return;

      const coordinates = [
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[1]],
          [bbox[2], bbox[3]],
          [bbox[0], bbox[3]],
          [bbox[0], bbox[1]],
        ],
      ];

      const cell = {
        type: "Feature",
        geometry: { type: "Polygon", bbox, coordinates },
      };

      tempSelectedCells.push(cell);
    });

    const newSelectedCells = [...selectedCells, ...tempSelectedCells];
    console.log("SelectedTitles");
    console.log(newSelectedCells);
    const source = map.getSource(selectedCellsId);
    source.setData({
      type: "FeatureCollection",
      features: newSelectedCells,
    });

    if (newSelectedCells.length > 0) {
      document.getElementById("tile-counts").innerText =
        newSelectedCells.length;
      document.getElementById("no-selected").classList.remove("selected-show");
      document.getElementById("has-selected").classList.add("selected-show");
      document.getElementById("has-details").classList.add("detail-show");
    }
  };

  // Remove selected tiles
  document.getElementById("remove-selected").addEventListener("click", () => {
    selectedCells = [];
    const sourceSelect = map.getSource(selectedCellsId);
    sourceSelect.setData({
      type: "FeatureCollection",
      features: selectedCells,
    });

    document.getElementById("tile-counts").innerText = "0";
    document.getElementById("no-selected").classList.add("selected-show");
    document.getElementById("has-selected").classList.remove("selected-show");
    document.getElementById("has-resource").classList.remove("resource-show");
    document.getElementById("has-details").classList.remove("detail-show");
  });

  // Show details
  document.getElementById("show-details").addEventListener("click", () => {
    console.log(
      "coordinates",
      selectedCells.map((s) => ({
        c: s.geometry.coordinates[0],
        b: s.geometry.bbox,
      }))
    );
    alert("Look at inspect console");
  });


  // Collapse/expand resources
  let expandResources = true;
  document.getElementById("resources-btn").addEventListener("click", () => {
    console.log("Test");
    if (expandResources) {
      document
        .getElementById("resources-list")
        .classList.remove("resources-list-show");
      document
        .getElementById("resources-arrow")
        .classList.remove("resources-expand");
    } else {
      document
        .getElementById("resources-list")
        .classList.add("resources-list-show");
      document
        .getElementById("resources-arrow")
        .classList.add("resources-expand");
    }
    expandResources = !expandResources;
  });
  const testData = [[126.46546, 33.50668, 126.46555, 33.50677], [126.46555, 33.50668, 126.46564, 33.50677]]
  const testData_1 = [[
    126.46492853790183,
    33.50659324517873,
    126.46501864305739,
    33.50668335033427
  ], [
    126.46501864305739,
    33.50659324517873,
    126.46510874821294,
    33.50668335033427
  ]]
  let lat = 33.50650;
  let lng = 126.46555;
  const point = [];
  Array(1).fill().forEach((v, i) => {
    lng = Number(lng.toFixed(5))
    lat = Number(lat.toFixed(5))
    const arr = [lng, 33.50677, lng + 0.000095, 33.50677]
    point.push(arr)
    lng += 0.000095;
  })
  console.log(point);
  const testData1 = [
    // [
    //   126.46574,
    //   33.506505,
    //   126.46583,
    //   33.506595
    // ],
    [
      126.46573,
      33.50650,
      126.46582,
      33.50659
    ]
  ]
  selectedTilesCustom(testData1)
  // selectedTilesCustom(testData1)
  // selectedTilesCustom(userSelectData)
  selectedTilesCustom_classname(testData, "blue")
  selectedTilesCustom_classname(selectBlackBox, "black")
  selectedTilesCustom_classname(selectGreenBox, "green")
  // selectedTilesCustom_loadImage(testData)
});
// map.on("click", () => {
//   console.log("Hello")
// })
map.on('movestart', (e) => {
  console.log('event type:', e.type);
  let { lat, lng } = map.getCenter();
  lng = Number(lng.toFixed(5))
  lat = Number(lat.toFixed(5))
  console.log(lat, lng);
  // console.log(point_lat_floor);
  // console.log(point_lng_floor);
  const b1 = lat - startLat
  const b2 = lng - startLng
  console.log(Number(b2.toFixed(5)));
  console.log(Number(b2.toFixed(5)) / 0.00009);
  const c1 = Math.round(Number(b1.toFixed(5)) / 0.00009)
  const c2 = Math.round(Number(b2.toFixed(5)) / 0.00009)
  // console.log(c2 / 0.00009);
  // console.log(c1 * point_lat_floor);
  // console.log(c2);
  console.log(c1 * point_lat_floor + c2);
  // console.log(point_lat_floor * point_lng_floor);

  // alert(lat, lng)
  // event type: boxzoomstart
});
map.on("zoom", () => {
  const zoomSize = map.getZoom();

  console.log(zoomSize);
  // if (!map.hasControl(grid)) {
  //   map.addControl(grid);
  // } else {
  //   grid.update();
  // }
})

function selectedTilesCustom(bboxes) {
  tempSelectedCells = [];
  bboxes.forEach((bbox) => {
    const coordinates = [
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[1]],
        [bbox[2], bbox[3]],
        [bbox[0], bbox[3]],
        [bbox[0], bbox[1]],
      ],
    ];

    const cell = {
      type: "Feature",
      geometry: { type: "Polygon", bbox, coordinates },
    };
    tempSelectedCells.push(cell);
  });

  const newSelectedCells = [...tempSelectedCells];
  console.log("SelectedTitles");
  console.log(newSelectedCells);
  const source = map.getSource(beforeByselectedCellsId);
  source.setData({
    type: "FeatureCollection",
    features: newSelectedCells,
  });

  // if (newSelectedCells.length > 0) {
  //   document.getElementById("tile-counts").innerText =
  //     newSelectedCells.length;
  //   document.getElementById("no-selected").classList.remove("selected-show");
  //   document.getElementById("has-selected").classList.add("selected-show");
  //   document.getElementById("has-details").classList.add("detail-show");
  // }
};

function selectedTilesCustom_classname(bboxes, className) {
  tempSelectedCells = [];
  bboxes.forEach((bbox) => {
    const coordinates = [
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[1]],
        [bbox[2], bbox[3]],
        [bbox[0], bbox[3]],
        [bbox[0], bbox[1]],
      ],
    ];

    const cell = {
      type: "Feature",
      geometry: { type: "Polygon", bbox, coordinates },
    };
    tempSelectedCells.push(cell);
  });

  const newSelectedCells = [...tempSelectedCells];
  console.log("SelectedTitles");
  console.log(newSelectedCells);
  const source = map.getSource(className);
  source.setData({
    type: "FeatureCollection",
    features: newSelectedCells,
  });

}

function selectedTilesCustom_loadImage(bboxes) {
  tempSelectedCells = [];
  bboxes.forEach((bbox) => {
    const coordinates = [
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[1]],
        [bbox[2], bbox[3]],
        [bbox[0], bbox[3]],
        [bbox[0], bbox[1]],
      ],
    ];

    const cell = {
      type: "Feature",
      geometry: { type: "Polygon", bbox, coordinates },
    };
    tempSelectedCells.push(cell);
  });

  const newSelectedCells = [...tempSelectedCells];
  console.log("SelectedTitles");
  console.log(newSelectedCells);
  const source = map.getSource("source");
  source.setData(loadImageData);

  if (newSelectedCells.length > 0) {
    document.getElementById("tile-counts").innerText =
      newSelectedCells.length;
    document.getElementById("no-selected").classList.remove("selected-show");
    document.getElementById("has-selected").classList.add("selected-show");
    document.getElementById("has-details").classList.add("detail-show");
  }
};