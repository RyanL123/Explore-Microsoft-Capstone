import { useState } from "react";

function App() {
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const ENDPOINT_URL =
        "https://adventureworksocr.cognitiveservices.azure.com/";
    const OCR_ENDPOINT = `${ENDPOINT_URL}vision/v3.2/ocr`;
    const SUBSCRIPTION_KEY = "f2c848871684499cb002561d34ebff64";
    function handleSubmit() {
        fetch(OCR_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Ocp-Apim-Subscription-Key": SUBSCRIPTION_KEY,
            },
            body: `{"url":"${url}"}`,
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
                            fullText += "\n";
                            for (let text of words) {
                                console.log(text["text"]);
                                fullText += text["text"];
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
