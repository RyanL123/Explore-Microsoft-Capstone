import { useState, useRef } from "react";
import {
    DefaultButton,
    PrimaryButton,
    TextField,
    Stack,
    IIconProps,
    ProgressIndicator,
    IContextualMenuProps,
} from "@fluentui/react";
import { FontSizes } from "@fluentui/theme";
import { getTextFromImage, getPartType } from "./components/OCR";
import Database from "./components/Database";

// icons
const uploadIcon: IIconProps = { iconName: "Upload" };
const searchIcon: IIconProps = { iconName: "Search" };
const linkIcon: IIconProps = { iconName: "Link" };

function App() {
    const [url, setUrl] = useState("");
    const [base64url, setBase64url] = useState("");
    const [text, setText] = useState("");
    const [parts, setParts] = useState("");
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const fileRef = useRef(null);

    // dropdown
    const menuProps: IContextualMenuProps = {
        items: [
            {
                key: "serial",
                text: "By serial number",
                iconProps: { iconName: "QRcode" },
                onClick: (e) => {
                    e.preventDefault();
                    handleSerialSubmit();
                },
            },
            {
                key: "part",
                text: "By part",
                iconProps: { iconName: "PictureFill" },
                onClick: (e) => {
                    e.preventDefault();
                    handlePartSubmit();
                },
            },
        ],
        directionalHintFixed: true,
    };

    // convert image to base64 url
    function encodeImageFileAsURL(element) {
        var file = element.files[0];
        var reader = new FileReader();
        setFileName(file.name);
        reader.onloadend = function () {
            const result: string = reader.result as string;
            setBase64url(result);
            setUrl(""); // cleanse search by link field
        };
        reader.readAsDataURL(file);
    }

    // call Azure OCR API
    function handleSerialSubmit() {
        setLoading(true);
        // use url if present, otherwise attempt to use binary image file
        getTextFromImage(url === "" ? base64url : url).then((extractedText) => {
            setText(extractedText);
            setLoading(false);
        });
    }

    function handlePartSubmit() {
        setLoading(true);
        getPartType(url).then((data) => {
            let concatenatedParts = "";
            data.forEach((part) => (concatenatedParts += `${part.tagName} `));
            setParts(concatenatedParts);
            setLoading(false);
        });
    }

    return (
        <Stack
            wrap
            horizontalAlign="center"
            verticalAlign="center"
            style={{ padding: "2vh 10vw" }}
        >
            <Stack
                style={{ width: "100%" }}
                tokens={{
                    childrenGap: "m",
                    padding: "m",
                }}
            >
                <TextField
                    label="Image URL"
                    description="Enter a link to the image or upload one"
                    value={url}
                    styles={{ root: { width: "100%" } }}
                    onChange={(e) => {
                        // erase the uploaded image
                        setBase64url("");
                        setFileName("");
                        // set the link
                        setUrl((e.target as HTMLTextAreaElement).value);
                    }}
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
                    wrap
                    horizontal
                    verticalAlign="center"
                    tokens={{
                        childrenGap: "m",
                    }}
                >
                    <PrimaryButton
                        iconProps={searchIcon}
                        text="Search"
                        menuProps={menuProps}
                    />
                    <DefaultButton
                        iconProps={uploadIcon}
                        onClick={() => fileRef.current.click()}
                    >
                        Upload Image
                    </DefaultButton>
                    <p>{fileName}</p>
                </Stack>
            </Stack>
            <Stack tokens={{ padding: "m" }} style={{ width: "100%" }}>
                <img
                    src={base64url}
                    style={{ maxWidth: "200px", height: "auto" }}
                ></img>
                <Stack verticalAlign="start">
                    <p style={{ fontSize: FontSizes.size24 }}>
                        Your serial number: {text}
                    </p>
                    <p style={{ fontSize: FontSizes.size24 }}>
                        Predicted parts: {parts}
                    </p>
                </Stack>
                <Database filter={text} key={text} />
            </Stack>
        </Stack>
    );
}

export default App;
