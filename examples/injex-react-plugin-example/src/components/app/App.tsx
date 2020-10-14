import * as React from "react";
import { useInjex } from "@injex/react-plugin";
import { AuthManager } from "managers/authManager";
import SpreadLoader from "components/spread-loader";
import Chat from "components/chat";
import Login from "components/login";

export default function App(): JSX.Element {
    const [inject] = useInjex();
    const authManager = inject<AuthManager>("authManager");

    if (authManager.isLoading) {
        return <SpreadLoader />;
    }

    if (authManager.isLoggedIn) {
        return <Chat channelName="general" />;
    }

    return <Login />;
};