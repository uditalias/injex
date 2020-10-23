import { useInjex } from "@injex/react-plugin";
import User from "components/users/user";
import { AuthManager } from "managers/authManager";
import { PresenceManager } from "managers/presenceManager";
import * as React from "react";
import theme from "./theme.scss";

export default function Header({ }): JSX.Element {
    const [inject] = useInjex();
    const authManager = inject<AuthManager>("authManager");
    const presenceManager = inject<PresenceManager>("presenceManager");

    return (
        <div className={theme.header}>
            <User presence="online" slim={true} user={authManager.user} />
            <div className={theme.online}>
                {presenceManager.onlineCount} Online
            </div>
        </div>
    );
}