import { useState, useRef } from "react";
import {
    DefaultButton,
    PrimaryButton,
    TextField,
    Stack,
    IIconProps,
    initializeIcons,
    IStackItemStyles,
    ProgressIndicator,
} from "@fluentui/react";
import { FontSizes } from "@fluentui/theme";
import { getTextFromImage } from "./components/OCR";
import { Table } from "./components/TableExample";
// import Table from "./components/Table";

// icons
initializeIcons();
const uploadIcon: IIconProps = { iconName: "Upload" };
const searchIcon: IIconProps = { iconName: "Search" };
const linkIcon: IIconProps = { iconName: "Link" };

function App() {
    const [url, setUrl] = useState("");
    const [text, setText] = useState("");
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);

    // convert image to base64 url
    function encodeImageFileAsURL(element) {
        var file = element.files[0];
        var reader = new FileReader();
        setFileName(file.name);
        reader.onloadend = function () {
            const result: string = reader.result as string;
            setUrl(result);
        };
        reader.readAsDataURL(file);
    }

    // call Azure OCR API
    function handleSubmit() {
        setLoading(true);
        getTextFromImage(url).then((extractedText) => {
            setText(extractedText);
            setLoading(false);
        });
    }
    return (
        <Stack horizontal wrap horizontalAlign="space-evenly">
            <Stack
                grow
                tokens={{
                    childrenGap: "m",
                    padding: "m",
                }}
                // style={{ minWidth: "40%" }}
            >
                <TextField
                    label="Image URL"
                    value={url}
                    onChange={(e) =>
                        setUrl((e.target as HTMLTextAreaElement).value)
                    }
                    iconProps={linkIcon}
                    placeholder="https://example.com"
                />
                <input
                    type="file"
                    ref={fileRef}
                    onChange={(e) => encodeImageFileAsURL(e.target)}
                    hidden
                />
                {loading ? <ProgressIndicator /> : ""}
                <Stack
                    horizontal
                    verticalAlign="center"
                    tokens={{
                        childrenGap: "m",
                    }}
                >
                    <PrimaryButton
                        iconProps={searchIcon}
                        onClick={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        Search
                    </PrimaryButton>
                    <DefaultButton
                        iconProps={uploadIcon}
                        onClick={() => fileRef.current.click()}
                    >
                        Upload Image
                    </DefaultButton>
                    <p>{fileName}</p>
                </Stack>
            </Stack>
            <Stack style={{ minWidth: "50vw" }}>
                <Stack verticalAlign="start">
                    <p style={{ fontSize: FontSizes.size24 }}>
                        Your serial number: {text}
                    </p>
                </Stack>
                <Table />
            </Stack>
        </Stack>
    );
}

export default App;
