//取得網路上的資源
function HTTPGetData(urlStr, callback_fn) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", urlStr, true);
    rawFile.setRequestHeader("Content-type", "application/json+fhir");
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {
            let ret = rawFile.responseText;
            callback_fn(ret);
        }
    }
    rawFile.send();
}

function HTTPPostData(urlStr, dataStr, callback_fn) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("POST", urlStr, true);
    rawFile.setRequestHeader("Content-type", "application/json+fhir");
    rawFile.onreadystatechange = function() {
        console.log(rawFile.readyState);
        if (rawFile.readyState === 4) {
            ret = rawFile.responseText;
            callback_fn(ret);
        }
    }
    rawFile.send(dataStr);
}