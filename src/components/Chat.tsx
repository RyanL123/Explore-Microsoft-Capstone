import { useState, useRef, useEffect } from "react";
import { Stack, TextField, PrimaryButton, Panel } from "@fluentui/react";

interface Message {
    fromUser: boolean;
    content: string;
}

function Chat({ setChatIsOpen, chatIsOpen }) {
    const [messages, setMessages] = useState([
        { fromUser: false, content: "What can I help you with today?" },
    ]);
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
        fetch(process.env.REACT_APP_QNA_MAKER_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: process.env.REACT_APP_QNA_MAKER_KEY,
            },
            body: `{"question":"${tempUserMessage}"}`,
        }).then((data) => {
            data.json().then((data) => {
                // replace markdown links with anchor tags
                var sanitizedContent = data.answers[0].answer.replace(
                    /\[([^\]]+)\]\(([^\)]+)\)/g,
                    '<a href="$2">$1</a>'
                );
                // replace return characters with line break
                sanitizedContent = sanitizedContent.replace(
                    /(\r\n|\n|\r)/gm,
                    "\n"
                );
                // replace asterisk with bullet points
                sanitizedContent = sanitizedContent.replaceAll("*", "&#8226");
                setMessages((previousMessages) => [
                    {
                        fromUser: false,
                        // replace enter character with line break
                        content: sanitizedContent,
                    },
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
                                    whiteSpace: "pre-line",
                                }}
                            >
                                <div
                                    dangerouslySetInnerHTML={{
                                        __html: message.content,
                                    }}
                                />
                                {/* {message.content} */}
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
