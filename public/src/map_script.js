map.on('movestart', (e) => {
    console.log('event type:', e.type);
    let { lat, lng } = map.getCenter();
    console.log(lat, lng);
    const { width, height } = parseTile({ lat, lng })

    AJAXRequestMethod({
        method: "POST",
        requestURL: `http://localhost:3000/ece3000/ece3300`,
        data: parseTile({ lng, lat })
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
});


map.on("zoom", () => {
    const zoomSize = map.getZoom();

    console.log(zoomSize);
    // selectedTilesCustom_classname(selectGreenBox, "green")
    // if (zoomSize < 17) {
    //     selectedTilesCustom_classname([], "green")
    //     // newSelectedCells = [];
    //     selectedCells = [];
    //     const sourceSelect = map.getSource(selectedCellsId);
    //     sourceSelect.setData({
    //         type: "FeatureCollection",
    //         features: selectedCells,
    //     });
    // }
})