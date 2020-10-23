import * as React from "react";
import theme from "./theme.scss";

export default function Input({ onSubmit }: { onSubmit: (text: string) => void }): JSX.Element {
    const [text, setText] = React.useState("");

    const onTextChanged = React.useCallback((e) => {
        setText(e.target.value);
    }, []);

    const validText = React.useMemo(() => !!text.trim(), [text]);

    const onSubmitMessage = React.useCallback(() => {
        if (!validText) {
            return;
        }

        onSubmit(text);
        setText("");
    }, [validText, text]);

    const onKeyUp = React.useCallback((e) => {
        if (e.which === 13) {
            onSubmitMessage();
        }
    }, [validText, text]);

    return (
        <div className={theme.input} >
            <input placeholder="Type a message" type="text" autoFocus value={text} onChange={onTextChanged} onKeyUp={onKeyUp} />
            <button disabled={!validText} onClick={onSubmitMessage}>
                <i className="material-icons">send</i>
            </button>
        </div>
    );
}