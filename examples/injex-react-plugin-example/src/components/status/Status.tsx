import clsx from "clsx";
import * as React from "react";
import theme from "./theme.scss";

export default function Status({ className = "", status }: { className: string; status: "online" | "offline" }): JSX.Element {
    return (
        <div className={clsx(theme.status, theme[status], className)}></div>
    );
}