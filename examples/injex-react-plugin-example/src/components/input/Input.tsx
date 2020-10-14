import * as React from "react";
import theme from "./theme.scss";

export default function Input(): JSX.Element {
    return (
        <div className={theme.input} >
            <input type="text" autoFocus />
            <button>
                <i className="material-icons">send</i>
            </button>
        </div>
    );
}