/**
 * 전역 변수
 */
const member = location.search.replaceAll("?", "").split("=")[1];
const serverURL = "http://localhost:3000"
window.onload = () => {
    const aLinkTag = document.getElementsByClassName("manuLinkTag")
    Array(aLinkTag.length).fill().forEach((v, i) => {
        aLinkTag[i].setAttribute("href", `${aLinkTag[i].getAttribute("href")}?member=${member}`)
    })
    const btn8000 = document.getElementsByClassName("btn8000")
    if (btn8000.length !== 0) {
        Array(btn8000.length).fill().forEach((v, i) => {
            console.log(btn8000[i].value);
            if (btn8000[i].value.trim() !== "") {
                btn8000[i].setAttribute("onclick", `location.href='${btn8000[i].getAttribute("value")}?member=${member}'`)
            }
        })
    }

    const btn7000 = document.getElementsByClassName("btn7000")
    if (btn7000.length !== 0) {
        Array(btn7000.length).fill().forEach((v, i) => {
            console.log(btn7000[i].value);
            if (btn7000[i].value.trim() !== "") {
                btn7000[i].setAttribute("onclick", `location.href='${btn7000[i].getAttribute("value")}?member=${member}'`)
            }
        })
    }

}