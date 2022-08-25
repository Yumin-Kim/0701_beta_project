let startLat = 33.106102;
const endPointLat = 33.57313;
let startLng = 126.11546;
const endPointLng = 127.00601;
const sliceNumber = 0.00009
const point_lat = Math.round(Number((endPointLat - startLat).toFixed(5)) / sliceNumber)
const point_lng = Math.round(Number((endPointLng - startLng).toFixed(5)) / sliceNumber);
const distance = 100;

const convertArrayToLocation = (width, height) =>
    [startLng + width * sliceNumber, startLat + height * sliceNumber]

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
    convertArrayToLocation,
    ece3300_getCenterPoint,
    parseArrayToIndexNumber,
    parseIndexNumberToArray
}