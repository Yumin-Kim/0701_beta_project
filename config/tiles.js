let startLat = 33.106102;
const endPointLat = 33.57313;
let startLng = 126.11546;
const endPointLng = 127.00601;
const sliceNumber = 0.00009
const point_lat = Math.round(Number((endPointLat - startLat).toFixed(5)) / sliceNumber)
const point_lng = Math.round(Number((endPointLng - startLng).toFixed(5)) / sliceNumber);
const distance = 50;
// 3888
// 4414

// 3897, 4439
const convertArrayToLocation = (width, height) =>
    [startLng + width * sliceNumber, startLat + height * sliceNumber]

// const tiles = Array(point_lat).fill().map(lat => {
//     startLng = 126.11546
//     startLat = Number((startLat + sliceNumber).toFixed(5))
//     return Array(point_lng).fill().map((v) => {
//         const prevlng = startLng;
//         startLng = Number((startLng + sliceNumber).toFixed(5))
//         return [prevlng, startLat];
//     })
// })

function parseArrayToIndexNumber(x, y) {
    return y * point_lng + x
}
function parseIndexNumberToArray(x) {
    if (x > point_lng) {
        const a = Math.floor(x / point_lng);
        const b = x - (point_lng * a)
        return [b, a]
    } else {
        return [x, 0]
    }
}
// console.log(parseIndexNumberToArray(44026748));
// console.log(parseArrayToIndexNumber(3893, 4449));
// console.log(getCenterFromDistanceTiles(40, 10))

function ece3300_getCenterPoint(x, y) {
    const minX = x - distance / 2;
    const minY = y - distance / 2;

    const minIndexing = parseArrayToIndexNumber(minX, minY)
    let tmp = 0;
    let tmpDistance = 0;
    console.log(point_lat);
    console.log(point_lng);
    return Array(distance).fill().map((v, index) => {
        tmp = minIndexing;
        tmpDistance = minIndexing + distance
        return [tmp + index * point_lng, tmpDistance + index * point_lng]
    })
}

module.exports = {
    // tiles,
    convertArrayToLocation,
    ece3300_getCenterPoint,
    parseArrayToIndexNumber,
    parseIndexNumberToArray
}