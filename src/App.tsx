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
import { getTextFromImage, getPartType } from "./util/OCR";
import Database from "./components/Database";
import Chat from "./components/Chat";

// icons
const uploadIcon: IIconProps = { iconName: "Upload" };
const searchIcon: IIconProps = { iconName: "Search" };
const linkIcon: IIconProps = { iconName: "Link" };
const clearIcon: IIconProps = { iconName: "Clear" };
const chatIcon: IIconProps = { iconName: "Chat" };

function App() {
    const [url, setUrl] = useState("");
    const [base64url, setBase64url] = useState("");
    const [serialNumber, setSerialNumber] = useState("");
    const [parts, setParts] = useState([]);
    const [fileName, setFileName] = useState("");
    const [loading, setLoading] = useState(false);
    const [chatIsOpen, setChatIsOpen] = useState(false);
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
            setSerialNumber(extractedText);
            setLoading(false);
        });
    }

    function handlePartSubmit() {
        setLoading(true);
        getPartType(url).then((data) => {
            let concatenatedParts = "";
            let allParts = [];
            data.forEach((part) => allParts.push(part.tagName));
            setParts(allParts);
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
                    <DefaultButton
                        iconProps={clearIcon}
                        onClick={() => {
                            // cleanse all fields
                            setBase64url("");
                            setUrl("");
                            setParts([]);
                            setSerialNumber("");
                            setFileName("");
                        }}
                    >
                        Clear
                    </DefaultButton>
                    <DefaultButton
                        iconProps={chatIcon}
                        onClick={() => {
                            setChatIsOpen(true);
                        }}
                    >
                        Chat
                    </DefaultButton>
                    <p>{fileName}</p>
                </Stack>
            </Stack>
            <Stack tokens={{ padding: "m" }} style={{ width: "100%" }}>
                <img
                    src={base64url === "" ? url : base64url}
                    style={{ maxWidth: "200px", height: "auto" }}
                ></img>
                <Stack verticalAlign="start">
                    <p style={{ fontSize: FontSizes.size24 }}>
                        Your serial number: {serialNumber}
                    </p>
                    <p style={{ fontSize: FontSizes.size24 }}>
                        Predicted parts:{" "}
                        {parts.map((part) => (
                            <span key={part}>{part} </span>
                        ))}
                    </p>
                </Stack>
                <Database serialFilter={serialNumber} partsFilter={parts} />
            </Stack>

            <Chat setChatIsOpen={setChatIsOpen} chatIsOpen={chatIsOpen} />
        </Stack>
    );
}

export default App;
