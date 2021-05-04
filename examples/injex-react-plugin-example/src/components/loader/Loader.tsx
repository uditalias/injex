import * as React from "react";
import clsx from "clsx";
import theme from "./theme.scss";

export default function Loader({ size = 60, color = "#fff", className = "" }: { size?: number; color?: string; className?: string }): JSX.Element {
    return (
        <div style={{ width: size }} className={clsx(theme.showbox, className)}>
            <div className={theme.loader}>
                <svg className={theme.circular} viewBox="25 25 50 50">
                    <circle className={theme.path} style={{ stroke: color }} cx="50" cy="50" r="20" fill="none" strokeWidth="2" strokeMiterlimit="10" />
                </svg>
            </div>
        </div>
    );
}