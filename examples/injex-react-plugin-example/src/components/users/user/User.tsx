import * as React from "react";
import IUser from "interfaces/IUser";
import { useInjex } from "@injex/react-plugin";
import { GravatarService } from "services/gravatarService";
import Avatar from "components/avatar";
import theme from "./theme.scss";
import Status from "components/status";
import clsx from "clsx";

export default function User({ user, presence, slim = false }: { user: IUser; presence: "online" | "offline"; slim?: boolean }): JSX.Element {
    const [inject] = useInjex();
    const gravatarService = inject<GravatarService>("gravatarService");

    return (
        <div className={clsx(theme.user, {
            [theme.slim]: slim
        })}>
            <div className={theme.avatar}>
                <Avatar size={slim ? 30 : 40} url={gravatarService.getImageUrl(user.email)} />
                <Status status={presence} className={theme.status} />
            </div>
            <div style={{ minWidth: 0 }}>
                <h1>{user.name}</h1>
                <h2>{user.email}</h2>
            </div>
        </div>
    );
}