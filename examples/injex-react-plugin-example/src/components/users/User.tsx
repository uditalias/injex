import * as React from "react";
import { observer } from "mobx-react";
import IUser, { IChatUser } from "interfaces/IUser";
import { useInjex } from "@injex/react-plugin";
import { GravatarService } from "services/gravatarService";
import Avatar from "components/avatar";
import theme from "./theme.scss";
import Status from "components/status";

export default observer(({ user, presence }: { user: IUser, presence: "online" | "offline" }): JSX.Element => {
    const [inject] = useInjex();
    const gravatarService = inject<GravatarService>("gravatarService");

    return (
        <div className={theme.user}>
            <div className={theme.avatar}>
                <Avatar size={40} url={gravatarService.getImageUrl(user.email)} />
                <Status status={presence} className={theme.status} />
            </div>
            <div style={{ minWidth: 0 }}>
                <h1>{user.name}</h1>
                <h2>{user.email}</h2>
            </div>
        </div>
    );
});