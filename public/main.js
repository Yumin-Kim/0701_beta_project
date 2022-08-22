let startLat = 33.106102;
const endPointLat = 33.57313;
const point_lat = (endPointLat - startLat) / 0.00009
let startLng = 126.11546;
const endPointLng = 127.00601;
const point_lng = (endPointLng - startLng) / 0.00009;
const point_lat_floor = Math.floor(point_lat);
const point_lng_floor = Math.floor(point_lng);
let centerLocation = { lng: 126.46573, lat: 33.50650 }
let toggle = 0;
function AJAXRequestMethod({ method, requestURL, data }) {
  return new Promise((res, rej) => {
    const XHR = new XMLHttpRequest();
    XHR.open(method, requestURL);
    XHR.setRequestHeader("Content-Type", "application/json");
    XHR.send(JSON.stringify(data));
    XHR.onreadystatechange = target => {
      try {
        if (XHR.status === 200 && XHR.response.trim() !== "" && XHR.readyState == 4) {
          res(JSON.parse(XHR.response));
        }
      } catch (error) {
        console.log(XHR.response);
        console.log(error)
      }
    };
  });
}
const a = parseTile({ lng: 126.46573, lat: 33.50650 })
console.log(a);


mapboxgl.accessToken =
  "pk.eyJ1Ijoid20xMTE4MTExOCIsImEiOiJja3k5ZGR5ajcwNTl5MnhwZDQ1Nzk5Z2ZhIn0.HRjY1eXlyQlUABFgqz6plQ";
const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/satellite-streets-v11",
  center: [126.46573,
    33.50650],
  zoom: 18,
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
  AJAXRequestMethod({
    method: "POST",
    requestURL: `${serverURL}/ece3000/ece3300`,
    data: parseTile(centerLocation)
  }).then((result) => {
    console.log(result);
    let { data } = result;
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
    console.log(toggle);

    if (bboxes.length > 1) {
      const lastlng = Number(bboxes[bboxes.length - 1][0].toFixed(5))
      const lastlat = Number(bboxes[bboxes.length - 1][1].toFixed(5))
      const firstData = parseTile({ lat: firstlat, lng: firstlng })
      const lastData = parseTile({ lat: lastlat, lng: lastlng })

      if (toggle === 2) {
        toggle = 0;
        const data = bboxes.map((bbox) => {
          const lng = Number(bbox[0].toFixed(5))
          const lat = Number(bbox[1].toFixed(5))
          return parseTile({ lat, lng })
        })
        AJAXRequestMethod({
          method: "POST",
          requestURL: `${serverURL}/ece8000/ece8120_rev?member=${member}`,
          data: {
            data
          }
        }).then((result) => {
          console.log(result);
          // let center = result.data;
          // center = [...center, center[0] + 0.00009, center[1] - 0.00009]
          // console.log("firstData", firstData);
          selectedTilesCustom_classname([center], "blue")
        }).catch((err) => {
          console.log(err);
        });
        // AJAXRequestMethod({
        //   method: "POST",
        //   requestURL: "${serverURL}/ece3000",
        //   data: lastData
        // }).then((result) => {
        //   let center = result.data;
        //   center = [...center, center[0] + 0.00009, center[1] - 0.00009]
        //   console.log("lastData", lastData);
        //   selectedTilesCustom_classname([center], "green")
        // }).catch((err) => {
        //   console.log(err);
        // });
      }
    }
    /**
     * 박스 하나만 선택하고 구매한 경우 
     */
    if (toggle == 2) {
      console.log("Hello");
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

function parseTile({ lat, lng }) {
  lng = Number(lng.toFixed(5))
  lat = Number(lat.toFixed(5))
  const width = Math.round(Number(lng - startLng.toFixed(5)) / 0.00009)
  const height = Math.round(Number(lat - startLat.toFixed(5)) / 0.00009)
  return { width, height }
}