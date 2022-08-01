import { useState } from "react";
import { Stack, TextField, PrimaryButton } from "@fluentui/react";

const HOST = "https://qnamakeradventure.azurewebsites.net/qnamaker";
const KB_ID =
    "/knowledgebases/d51361f2-704e-47d8-bae4-3008826b7385/generateAnswer";
const ENDPOINT_KEY = "EndpointKey c57494ec-a783-41de-b62f-b787ba282fa9";

function Chat() {
    const [messages, setMessages] = useState([{}]);
    const [userMessage, setUserMessage] = useState("");
    function handleSubmit() {
        console.log("test");
        setMessages([...messages, { fromUser: true, content: userMessage }]);
        fetch(HOST + KB_ID, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: ENDPOINT_KEY,
            },
            body: `{"question":"${userMessage}"}`,
        }).then((data) => {
            data.json().then((data) => {
                setMessages([
                    ...messages,
                    { fromUser: false, content: data.answers[0].answer },
                ]);
                console.log(data.answers[0].answer);
            });
        });
    }
    return (
        <Stack>
            <TextField
                value={userMessage}
                onChange={(e) => {
                    setUserMessage((e.target as HTMLTextAreaElement).value);
                }}
            />
            <PrimaryButton onClick={() => handleSubmit()}>Send</PrimaryButton>
            {/* {messages.map((message) => message.content)} */}
        </Stack>
    );
}

export default Chat;
