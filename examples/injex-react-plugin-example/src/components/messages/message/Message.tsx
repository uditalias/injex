import IChatMessage from "interfaces/IChatMessage";
import * as React from "react";
import theme from "./theme.scss";
import clsx from "clsx";

function Message({ message }: { message: IChatMessage }): JSX.Element {
    const time = new Date(message.created);

    return (
        <li className={clsx(theme.message, {
            [theme.me]: message.self
        })}>
            <div className={theme.inner}>
                <div className={theme.username}>{message.from.name}</div>
                <div className={theme.text}>{message.text}</div>
                <div className={theme.time}>{time.toLocaleTimeString()}</div>
            </div>
        </li>
    );
}

export default React.memo(Message);