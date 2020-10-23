import * as React from "react";
import IChatMessage from "interfaces/IChatMessage";
import theme from "./theme.scss";
import Message from "./message";

export default function Messages({ messages }: { messages: IChatMessage[] }): JSX.Element {
    return (
        <div className={theme.messages}>
            <ul>
                {messages.map((message) => <Message key={message.id} message={message} />)}
            </ul>
        </div>
    );
}