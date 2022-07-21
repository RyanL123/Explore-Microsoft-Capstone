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
    const [text, setText] = useState("");
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
            setUrl(result);
        };
        reader.readAsDataURL(file);
    }

    // call Azure OCR API
    function handleSerialSubmit() {
        setLoading(true);
        getTextFromImage(url).then((extractedText) => {
            setText(extractedText);
            setLoading(false);
        });
    }

    function handlePartSubmit() {
        setLoading(true);
        getPartType(url).then((data) => {
            console.log(data);
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
                    value={url}
                    styles={{ root: { width: "100%" } }}
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
                <Stack verticalAlign="start">
                    <p style={{ fontSize: FontSizes.size24 }}>
                        Your serial number: {text}
                    </p>
                </Stack>
                <Database />
            </Stack>
        </Stack>
    );
}

export default App;
