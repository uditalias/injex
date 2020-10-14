import Loader from "components/loader";
import * as React from "react";
import theme from "./theme.scss";

export default function SpreadLoader({ text = "Loading..." }): JSX.Element {
    return (
        <div className={theme.container}>
            <Loader className={theme.loader} color="#393B3C" size={40} /> {text}
        </div>
    );
}