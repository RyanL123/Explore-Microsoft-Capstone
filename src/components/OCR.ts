const ENDPOINT_URL = "https://adventureworksocr.cognitiveservices.azure.com/";
const OCR_ENDPOINT = `${ENDPOINT_URL}vision/v3.2/ocr`;
const SUBSCRIPTION_KEY = "f2c848871684499cb002561d34ebff64";

function makeBlob(dataURL: string) {
    var BASE64_MARKER = ";base64,";
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(",");
        var contentType = parts[0].split(":")[1];
        var raw = decodeURIComponent(parts[1]);
        return new Blob([raw], { type: contentType });
    }
    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(":")[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

export async function getTextFromImage(url: string) {
    return await fetch(OCR_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": "application/octet-stream",
            "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
        },
        // body: `{"url":"${url}"}`,
        body: makeBlob(url),
    }).then((data) => {
        return data.json().then((data) => {
            const regions = data["regions"];
            console.log(data);
            let fullText = "";
            // format: regions => lines => words => text
            if (regions) {
                for (let text of regions) {
                    const lines = text["lines"];
                    for (let word of lines) {
                        const words = word["words"];
                        fullText += "\n"; // line break in between sentences
                        for (let text of words) {
                            console.log(text["text"]);
                            fullText += text["text"] + " "; // add space after word
                        }
                    }
                }
            }
            return fullText;
        });
    });
}
