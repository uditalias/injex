import clsx from "clsx";
import * as React from "react";
import theme from "./theme.scss";

export default function Status({ className = "", status }) {
    return (
        <div className={clsx(theme.status, theme[status], className)}></div>
    );
}