import * as React from "react";
import { useInjex } from "@injex/react-plugin";
import Input from "components/input";
import Messages from "components/messages";
import Users from "components/users";
import { Channel } from "models/channel";
import theme from "./theme.scss";
import Header from "components/header";

export default function Chat({ channelName }: { channelName: string }): JSX.Element {
    const [inject] = useInjex();

    const channel = React.useMemo<Channel>(() => {
        const createChannel = inject<(name: string) => Channel>("createChannel");
        return createChannel(channelName);
    }, []);

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