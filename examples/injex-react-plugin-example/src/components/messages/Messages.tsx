import { Channel } from "models/channel";
import * as React from "react";
import theme from "./theme.scss";

export default function Messages({ channel }: { channel: Channel; }): JSX.Element {
    return <div className={theme.messages} />;
}