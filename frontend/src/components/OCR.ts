const ENDPOINT_URL = "https://adventureworksocr.cognitiveservices.azure.com/";
const OCR_ENDPOINT = `${ENDPOINT_URL}vision/v3.2/ocr?language=en&detectOrientation=true`;
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
    const isBase64 = url.substring(0, 4) === "data";
    return await fetch(OCR_ENDPOINT, {
        method: "POST",
        headers: {
            "Content-Type": isBase64
                ? "application/octet-stream"
                : "application/json",
            "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
        },
        body: isBase64 ? makeBlob(url) : `{"url":"${url}"}`,
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
                        for (let text of words) {
                            fullText += text["text"]; // add space after word
                        }
                    }
                }
            }
            return fullText;
        });
    });
}

const CV_ENDPOINT_URL =
    "https://adventureworksobjectrecog-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/8dc317ee-4eb2-4ca2-8515-7841e836b3fa/classify/iterations/Iteration1/url";

const CV_ENDPOINT_IMAGE =
    "https://adventureworksobjectrecog-prediction.cognitiveservices.azure.com/customvision/v3.0/Prediction/8dc317ee-4eb2-4ca2-8515-7841e836b3fa/classify/iterations/Iteration1/image ";

export async function getPartType(url: string) {
    const isBase64 = url.substring(0, 4) === "data";
    return await fetch(isBase64 ? CV_ENDPOINT_IMAGE : CV_ENDPOINT_URL, {
        method: "POST",
        headers: {
            "Content-Type": isBase64
                ? "application/octet-stream"
                : "application/json",
            "Prediction-Key": "49abfcf6092c420284a00c0805cc64f7",
        },
        body: isBase64 ? makeBlob(url) : `{"url":"${url}"}`,
    }).then((data) => {
        return data.json().then((data) => {
            let finalPredictions = data.predictions.filter((prediction) => {
                return prediction.probability >= 0.85;
            });
            return finalPredictions;
        });
    });
}
