// const ELCPrice = 200;
// const minerPrice = 120000;
// const minerHeart = 3;
// const tileELCPrice = minerPrice / minerHeart;
// const date = 14
// const miningDate = 24 * date;
// const tileFindELC = tileELCPrice / ELCPrice
// const r1 = 10000;
// const r2 = 1000;
// const r3 = 100;
// const findTilesR1 = tileFindELC * r1 * r2 * r3;
// const findTilesR2 = findTilesR1 / 2;
// let memberResource = 0;
// let tileResource = findTilesR1;

// const unixTime = Math.floor(new Date().getTime() / 1000);
// let memberR = 0;
// let allR = findTilesR1;

// for (i = 0; i < miningDate; i++) {
//     let test = Math.floor(findTilesR1 / 1.2) > memberR
//     let aa;
//     if (test) {
//         // aa = Math.floor((unixTime / allR) * (((findTilesR1 / miningDate * ((Math.random() * 5) + 4))) * ((Math.random() * 5) + miningDate)))
//         // aa = Math.floor((unixTime / allR) * (((findTilesR1 / miningDate * ((Math.random() * 5) + miningDate + r3))))) + findTilesR1 / miningDate
//         // aa = Math.floor((unixTime / allR) * (Math.random() * 4) + 1) + findTilesR1 / miningDate
//         aa = Math.floor((unixTime / allR) * (Math.random() * 4) + 1) + findTilesR1 / miningDate * Math.round((Math.random() * 4) + 5)
//     } else if (i === miningDate - 1) {
//         if (memberR > findTilesR1) {
//             aa = 0;
//         } else {
//             aa = findTilesR1 - memberR
//         }
//     } else {
//         aa = Math.floor((unixTime / allR) * (Math.random() * 4) + 1) + findTilesR1 / miningDate / 3
//     }
//     aa = Math.round(aa)
//     allR -= aa
//     memberR += aa;
//     console.log(aa);
//     if (test) {
//         console.log("=============================");
//         console.log(findTilesR1);
//         console.log(memberR);
//         console.log(test);
//     }
//     console.log(findTilesR1 / 2 > memberR);
//     console.log(`mining ....사용자 총 자원${memberR} ${findTilesR1} ${aa} //턴 ${i + 1}`)
// }
// console.log(`mining ....사용자 총 자원${memberR} ${findTilesR1}`)
// console.log((findTilesR1 / 1.1));

const ELCPrice = 200;
const minerPrice = 120000;
const minerHeart = 3;
const tileELCPrice = minerPrice / minerHeart;
const date = 14
const miningDate = 24 * date;
const tileFindELC = tileELCPrice / ELCPrice
const r1 = 10000;
const r2 = 1000;
const r3 = 100;
const findTilesR1 = tileFindELC * r1 * r2 * r3;
const findTilesR2 = findTilesR1 / 2;
let memberResource = 0;
let tileResource = findTilesR1;

const unixTime = Math.floor(new Date().getTime() / 1000);
let memberR = 0;
let allR = findTilesR1;
for (i = 0; i < miningDate; i++) {
    let test = Math.floor(findTilesR1 / 1.1) > memberR
    let aa;
    if (test) {
        aa = Math.floor((unixTime / allR) * (Math.random() * 100) + 5) + findTilesR1 / miningDate * Math.round((Math.random() * 12) + 1)
    } else if (i === miningDate - 1) {
        if (memberR > findTilesR1) {
            aa = 0;
        } else {
            aa = findTilesR1 - memberR
        }
    } else {
        aa = Math.floor((unixTime / allR) * (Math.random() * 100) + 1) + findTilesR1 / miningDate / Math.round((Math.random() * 100) + 1)
    }
    aa = Math.round(aa)
    allR -= aa
    memberR += aa;
    if (test) {
        console.log("=============================");
        console.log(`mining ....사용자 총 자원${memberR} ${findTilesR1} ${aa} //턴 ${i + 1}`)
        console.log("=============================");
    }
    console.log(`mining ....사용자 총 자원${memberR} ${findTilesR1} ${aa} //턴 ${i + 1}`)
}
console.log(Math.floor(findTilesR1 / miningDate));
