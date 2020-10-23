import clsx from "clsx";
import * as React from "react";
import theme from "./theme.scss";

function Avatar({ url, size = 50, className = "" }: { url: string; size?: number; className?: string }): JSX.Element {
    return (
        <div className={clsx(theme.avatar, className)} style={{ width: size, height: size }} >
            <img src={url} />
        </div>
    );
}

export default React.memo(Avatar);