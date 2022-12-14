let startLat = 33.106102;
const endPointLat = 33.57313;
const point_lat = (endPointLat - startLat) / 0.00009
let startLng = 126.11546;
const endPointLng = 127.00601;
const point_lng = (endPointLng - startLng) / 0.00009;
const point_lat_floor = Math.floor(point_lat);
const point_lng_floor = Math.floor(point_lng);
let ece8110_data;
let toggle = 0;
const a = parseTile({ lng: 126.46573, lat: 33.50650 })

mapboxgl.accessToken =
  "pk.eyJ1IjoiZGJhbHMwIiwiYSI6ImNsNXM0ZGt3ZTBqdHEzaW4weHVvMnR5bmcifQ.r8jA3ImPlpp6W5K0EcwkMw";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: centerPoint,
  zoom: 17,
});
map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

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
  // map.loadImage(
  //   'https://docs.mapbox.com/mapbox-gl-js/assets/colorado_flag.png',
  //   (err, image) => {
  //     // Throw an error if something goes wrong.
  //     if (err) throw err;

  //     // Add the image to the map style.
  //     map.addImage('pattern', image);

  //     // Create a new layer and style it using `fill-pattern`.
  //     map.addLayer({
  //       'id': 'pattern-layer',
  //       'type': 'fill',
  //       'source': 'source',
  //       'paint': {
  //         'fill-pattern': 'pattern'
  //       }
  //     });
  //   }
  // );
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
      "fill-opacity": 0.4,
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
  if (location.pathname.replace("/", "").split(".")[0] === "ece8110") {
    $("#adminxrp").text(`${tileAdminInfo.currentamount}`)
    map.on(MaplibreGrid.GRID_CLICK_EVENT, ({ bbox }) => {
      // const popup = new mapboxgl.Popup({ closeOnClick: false })
      //   .setLngLat(centerPoint)
      //   .setHTML('<h1>Hello World!</h1>')
      //   .addTo(map);
      if (activeSelecting) {
        activeSelecting = false;
        document.getElementById("has-resource").classList.add("resource-show");
        selectedCells = [...selectedCells, ...tempSelectedCells];
      } else {
        activeSelecting = true;
        selectedTiles([bbox]);
      }
    });
    map.on(MaplibreGrid.GRID_MOUSE_MOVE_EVENT, ({ bboxes }) => {
      if (bboxes.length > 0) {
        selectedTiles(bboxes);
      }
    });
  } else {
    map.on(MaplibreGrid.GRID_CLICK_EVENT, async ({ bbox }) => {
      const { data: ece3200Data, status } = await AJAXRequestMethod({
        method: "POST",
        requestURL: `${serverURL}/ece3000/ece3200`,
        data: parseTile({ lng: bbox[0], lat: bbox[1] })
      })
      if (status === 1310) {
        const { landInfo, memberInfo } = ece3200Data
        const geoJSON = landInfo.reduce((prev, cur) => {
          prev.push(cur.blockLocation)
          return prev
        }, [])
        selectedTilesCustom_classname(geoJSON, "blue")
        // await
        const popup = new mapboxgl.Popup({ closeOnClick: true })
          .setLngLat([bbox[0].toFixed(5), bbox[1].toFixed(5)])
          .setHTML(`<p style="margin:0px">${memberInfo.email}</p>`)
          .addTo(map);
      }
      activeSelecting = true;
      selectedTiles([bbox]);
      // }
    });
    map.on(MaplibreGrid.GRID_MOUSE_MOVE_EVENT, ({ bboxes }) => {
      if (bboxes.length > 0) {
        // selectedTiles(bboxes);
      }
    });
  }

  AJAXRequestMethod({
    method: "POST",
    requestURL: `${serverURL}/ece3000/ece3300`,
    data: parseTile(centerLocation)
  }).then((result) => {
    let { data, extraData } = result;
    locationIndexingList = extraData;
    const geoJSON = data.reduce((prev, cur) => {
      prev.push(cur.blockLocation)
      return prev
    }, [])
    selectedTilesCustom_classname(geoJSON, "green")
  }).catch((err) => {
    console.log(err);
  });
  const selectedTiles = (bboxes) => {
    toggle++;
    const parseData = bboxes.map((v, i) => {
      const [leftlng, leftlat, rightlng, rightlat] = v;
      return [leftlat.toFixed(5), leftlng.toFixed(5), rightlat.toFixed(5), rightlng.toFixed(5)]
    })
    const firstlng = Number(bboxes[0][0].toFixed(5))
    const firstlat = Number(bboxes[0][1].toFixed(5))

    if (bboxes.length > 1) {
      const lastlng = Number(bboxes[bboxes.length - 1][0].toFixed(5))
      const lastlat = Number(bboxes[bboxes.length - 1][1].toFixed(5))
      const firstData = parseTile({ lat: firstlat, lng: firstlng })
      const lastData = parseTile({ lat: lastlat, lng: lastlng })
      if (toggle === 2) {
        toggle = 0;
        ece8110_data = bboxes.map((bbox) => {
          const lng = Number(bbox[0].toFixed(5))
          const lat = Number(bbox[1].toFixed(5))
          return parseTile({ lat, lng })
        })
      }
    }
    /**
     * ?????? ????????? ???????????? ????????? ?????? 
     */
    if (toggle == 2) {
    }
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
    //????????? ?????? ????????? ece8110
    $("#selecttile").text(`${newSelectedCells.length} Tiles`)
    $("#selectlocation").text(`?????? : ${newSelectedCells[newSelectedCells.length - 1].geometry.bbox[1].toFixed(5)} ,${newSelectedCells[newSelectedCells.length - 1].geometry.bbox[0].toFixed(5)}`);
    $("#selecttileprice").text(`${Number(tileAdminInfo.currentamount) * newSelectedCells.length} XRP`)
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
    $("#selectlocation").text("?????? :")
    $("#selecttile").text("??????????????????")
    $("#selecttileprice").text("??????????????????")
    document.getElementById("tile-counts").innerText = "0";
    document.getElementById("no-selected").classList.add("selected-show");
    document.getElementById("has-selected").classList.remove("selected-show");
    document.getElementById("has-resource").classList.remove("resource-show");
    document.getElementById("has-details").classList.remove("detail-show");
  });

  // Show details
  document.getElementById("show-details").addEventListener("click", () => {
    alert("Look at inspect console");
  });


  // Collapse/expand resources
  let expandResources = true;
  document.getElementById("resources-btn").addEventListener("click", () => {
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
  const testData1 = [
    [
      126.46573,
      33.50650,
      126.46582,
      33.50659
    ]
  ]
  // selectedTilesCustom(testData1)
  // selectedTilesCustom(testData1)
  // selectedTilesCustom(userSelectData)
  // selectedTilesCustom_classname(testData, "blue")
  // selectedTilesCustom_classname(selectBlackBox, "black")
  // selectedTilesCustom_loadImage(testData)
});

function selectedTiles_g() {
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
};


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

function parseTile({ lat, lng }) {
  lng = Number(lng.toFixed(5))
  lat = Number(lat.toFixed(5))
  const width = Math.round(Number(lng - startLng.toFixed(5)) / 0.00009)
  const height = Math.round(Number(lat - startLat.toFixed(5)) / 0.00009)
  return { width, height }
}