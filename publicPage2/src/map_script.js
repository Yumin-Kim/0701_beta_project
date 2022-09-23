let clearMapTimer;
map.on('movestart', (e) => {
    clearTimeout(clearMapTimer)
    clearMapTimer = setTimeout(() => {
        let { lat, lng } = map.getCenter();
        AJAXRequestMethod({
            method: "POST",
            requestURL: `${serverURL}/ece3000/ece3300`,
            data: parseTile({ lng, lat })
        }).then((result) => {
            clearTimeout(clearMapTimer)
            let { data, extraData } = result;
            locationIndexingList = extraData
            const geoJSON = data.reduce((prev, cur) => {
                prev.push(cur.blockLocation)
                return prev
            }, [])

            selectedTilesCustom_classname(geoJSON, "green")
        }).catch((err) => {
            console.log(err);
        });
    }, 2000)
});


map.on("zoom", () => {
    const zoomSize = map.getZoom();
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