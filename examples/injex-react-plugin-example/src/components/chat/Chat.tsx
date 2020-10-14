import { useInjex } from "@injex/react-plugin";
import Input from "components/input";
import Messages from "components/messages";
import Users from "components/users";
import { Channel } from "models/channel";
import * as React from "react";
import theme from "./theme.scss";

export default function Chat({ channelName }): JSX.Element {
    const [inject] = useInjex();
    const channel = React.useMemo(() => inject<(name: string) => Channel>("createChannel")(channelName), []);

    return (
        <div className={theme.chat}>
            <div className={theme.window}>
                <Users />
                <Messages channel={channel} />
                <Input />
            </div>
        </div>
    );
}