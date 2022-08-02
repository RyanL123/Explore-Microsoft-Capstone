import { useState, useRef, useEffect } from "react";
import { Stack, TextField, PrimaryButton, Panel } from "@fluentui/react";

const HOST = "https://qnamakeradventure.azurewebsites.net/qnamaker";
const KB_ID =
    "/knowledgebases/d51361f2-704e-47d8-bae4-3008826b7385/generateAnswer";
const ENDPOINT_KEY = "EndpointKey c57494ec-a783-41de-b62f-b787ba282fa9";

interface Message {
    fromUser: boolean;
    content: string;
}

function Chat({ setChatIsOpen, chatIsOpen }) {
    const [messages, setMessages] = useState([]);
    const [userMessage, setUserMessage] = useState("");
    const messagesEndRef = useRef(null); // dummy div

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function scrollToBottom() {
        // scroll chat to dummy div at the bottom when messages are updated
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    function handleSubmit() {
        const tempUserMessage = userMessage; // record state to cleanse text field
        setUserMessage("");
        setMessages((previousMessages) => [
            { fromUser: true, content: tempUserMessage },
            ...previousMessages,
        ]);
        fetch(HOST + KB_ID, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: ENDPOINT_KEY,
            },
            body: `{"question":"${tempUserMessage}"}`,
        }).then((data) => {
            data.json().then((data) => {
                setMessages((previousMessages) => [
                    { fromUser: false, content: data.answers[0].answer },
                    ...previousMessages,
                ]);
            });
        });
    }
    return (
        <Panel
            isLightDismiss
            isOpen={chatIsOpen}
            headerText="Talk to our AI assistant!"
            isHiddenOnDismiss={true}
            onRenderFooterContent={() => (
                <form>
                    <Stack horizontal tokens={{ childrenGap: "s1" }}>
                        <Stack grow>
                            <TextField
                                placeholder="e.g. 'I need a bike'"
                                value={userMessage}
                                onChange={(e) => {
                                    setUserMessage(
                                        (e.target as HTMLTextAreaElement).value
                                    );
                                }}
                                style={{ flexGrow: "2" }}
                            />
                        </Stack>
                        <Stack>
                            <PrimaryButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                }}
                                type="submit"
                                iconProps={{ iconName: "Send" }}
                            >
                                Send
                            </PrimaryButton>
                        </Stack>
                    </Stack>
                </form>
            )}
            isFooterAtBottom={true}
            onDismiss={() => {
                setChatIsOpen(false);
            }}
        >
            <Stack tokens={{ childrenGap: "s1" }}>
                <Stack
                    style={{
                        height: "80%",
                        overflowY: "scroll",
                        display: "flex",
                        flexDirection: "column-reverse",
                        scrollbarWidth: "none",
                    }}
                >
                    {messages.map((message) => (
                        <Stack
                            horizontalAlign={message.fromUser ? "end" : "start"}
                        >
                            <p
                                style={{
                                    backgroundColor: message.fromUser
                                        ? "#e8ebfa"
                                        : "#f5f5f5",
                                    color: "black",
                                    padding: "10px",
                                    borderRadius: "6px",
                                }}
                            >
                                {message.content}
                            </p>
                        </Stack>
                    ))}
                </Stack>
                <div ref={messagesEndRef}></div>
            </Stack>
        </Panel>
    );
}

export default Chat;
