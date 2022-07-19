import { useState } from "react";

function App() {
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const ENDPOINT_URL =
        "https://adventureworksocr.cognitiveservices.azure.com/";
    const OCR_ENDPOINT = `${ENDPOINT_URL}vision/v3.2/ocr`;
    const SUBSCRIPTION_KEY = "f2c848871684499cb002561d34ebff64";

    // convert base64url to blob object
    function makeBlob(dataURL) {
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

    // convert image to base64 url
    function encodeImageFileAsURL(element) {
        console.log(element);
        var file = element.files[0];
        var reader = new FileReader();
        reader.onloadend = function () {
            console.log("RESULT", reader.result);
            setUrl(reader.result);
        };
        reader.readAsDataURL(file);
    }

    // call Azure OCR API
    function handleSubmit() {
        fetch(OCR_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/octet-stream",
                "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
            },
            // body: `{"url":"${url}"}`,
            body: makeBlob(url),
        }).then((data) => {
            data.json().then((data) => {
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
                setText(fullText);
            });
        });
    }
    return (
        <div className="App">
            <form>
                <label>Image URL</label>
                <input value={url} onChange={(e) => setUrl(e.target.value)} />
                <input
                    type="file"
                    onChange={(e) => encodeImageFileAsURL(e.target)}
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    Submit
                </button>
                <h1>{text}</h1>
            </form>
        </div>
    );
}

export default App;
