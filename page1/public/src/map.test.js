//  // map.addSource('route', {
//   //   'type': 'geojson',
//   //   'data': {
//   //     'type': 'Feature',
//   //     'properties': {},
//   //     'geometry': {
//   //       'type': 'LineString',
//   //       'coordinates': [
//   //         [126.115461, 33.57313],
//   //         [127.006015, 33.57313],
//   //         [127.006015, 33.106217],
//   //         [126.115461, 33.106217],
//   //         [126.115461, 33.57313],
//   //       ]
//   //     }
//   //   }
//   // });

//   // map.addSource('route1', {
//   //   'type': 'geojson',
//   //   'data': {
//   //     'type': 'Feature',
//   //     'properties': {},
//   //     'geometry': {
//   //       'type': 'LineString',
//   //       'coordinates': [
//   //         [126.46565, 33.57413],
//   //         [126.46565, 33.10631],
//   //       ]
//   //     }
//   //   }
//   // });
//   // map.addSource('route2', {
//   //   'type': 'geojson',
//   //   'data': {
//   //     'type': 'Feature',
//   //     'properties': {},
//   //     'geometry': {
//   //       'type': 'LineString',
//   //       'coordinates': [
//   //         [126.46574, 33.57413],
//   //         [126.46574, 33.10631],
//   //       ]
//   //     }
//   //   }
//   // });
//   // // 0.00007
//   // // 0.00007
//   // map.addSource('route3', {
//   //   'type': 'geojson',
//   //   'data': {
//   //     'type': 'Feature',
//   //     'properties': {},
//   //     'geometry': {
//   //       'type': 'LineString',
//   //       'coordinates': [
//   //         [126.115461, 33.50659],
//   //         [127.006015, 33.50659],
//   //       ]
//   //     }
//   //   }
//   // });
//   // map.addSource('route4', {
//   //   'type': 'geojson',
//   //   'data': {
//   //     'type': 'Feature',
//   //     'properties': {},
//   //     'geometry': {
//   //       'type': 'LineString',
//   //       'coordinates': [
//   //         [126.115461, 33.50651],
//   //         [127.006015, 33.50651],
//   //       ]
//   //     }
//   //   }
//   // });


//   map.addLayer({
//     'id': 'route',
//     'type': 'line',
//     'source': 'route',
//     'layout': {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     'paint': {
//       'line-color': '#888',
//       'line-width': 8
//     }
//   });
//   map.addLayer({
//     'id': 'route1',
//     'type': 'line',
//     'source': 'route1',
//     'layout': {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     'paint': {
//       'line-color': 'red',
//       'line-width': 1
//     }
//   });
//   map.addLayer({
//     'id': 'route2',
//     'type': 'line',
//     'source': 'route2',
//     'layout': {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     'paint': {
//       'line-color': 'orange',
//       'line-width': 1
//     }
//   });
//   map.addLayer({
//     'id': 'route3',
//     'type': 'line',
//     'source': 'route3',
//     'layout': {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     'paint': {
//       'line-color': 'blue',
//       'line-width': 1
//     }
//   });
//   map.addLayer({
//     'id': 'route4',
//     'type': 'line',
//     'source': 'route4',
//     'layout': {
//       'line-join': 'round',
//       'line-cap': 'round'
//     },
//     'paint': {
//       'line-color': 'yellow',
//       'line-width': 1
//     }
//   });