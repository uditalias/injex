import { useModuleFactory } from "@injex/react-plugin";
import Header from "components/header";
import Input from "components/input";
import Messages from "components/messages";
import Users from "components/users";
import { Channel } from "models/channel";
import * as React from "react";
import theme from "./theme.scss";

export default function Chat({ channelName }: { channelName: string }): JSX.Element {
    const channel = useModuleFactory<Channel>('channel', [channelName]);

    const onInputSubmit = React.useCallback((message) => {
        channel.sendMessage(message);
    }, []);

    React.useEffect(() => {
        channel.connect();
    }, []);

    return (
        <div className={theme.chat}>
            <div className={theme.window}>
                <Header />
                <Users />
                <Messages messages={channel.messages} />
                <Input onSubmit={onInputSubmit} />
            </div>
        </div>
    );
}