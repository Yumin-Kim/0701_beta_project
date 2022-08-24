/**
 * 전역 변수
 */
const querystring = location.search.split("?")[1];
let member = querystring.split("=")[1].split("&")[0];
let centerLocation = { lng: null, lat: null }
let centerPoint = [126.46573,
    33.50650];
let center
// 타일 확인 시 동작
if (querystring.split("=").length > 2) {
    console.log(querystring);
    const a = querystring.split("&")
    a.forEach(v => {
        const [key, value] = v.split("=");
        console.log(key);
        if (key !== "member")
            centerLocation[`${key}`] = Number(value)
    })
    centerPoint = [...Object.values(centerLocation)]
} else {
    centerLocation = { lng: 126.46573, lat: 33.50650 }
}
// const serverURL = "http://localhost:3000";
const serverURL = "http://13.209.96.192:3000"
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
function selectCodeNameTpCodeTable({ data, codeName }) {
    let description = ""
    data.forEach((v) => {
        if (v.code === Number(codeName)) {
            description = v.description;
        }
    })
    return description
}
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