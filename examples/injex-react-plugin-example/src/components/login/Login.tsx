import * as React from "react";
import theme from "./theme.scss";
import image from "assets/img/undraw_Group_chat_re_frmo.svg";
import logo from "assets/img/logo.svg";
import google from "assets/img/google.svg";
import { useInjex } from "@injex/react-plugin";
import { AuthManager } from "managers/authManager";
import Loader from "components/loader";

export default function Login(): JSX.Element {
    const [inject] = useInjex();
    const authManager = inject<AuthManager>("authManager");

    return (
        <div className={theme.login}>
            <div className={theme.img}>
                <img src={image} />
            </div>
            <div className={theme.form}>
                <img className={theme.logo} src={logo} />
                <h1>Injex Framework</h1>
                <h2>React chat application demo</h2>
                <p>This application shows the Injex framework in action inside a React application, using the Injex React Plugin.</p>
                <p>The following services & libraries are used:</p>
                <div className={theme.stack}>
                    Injex, Injex React Plugin, Injex Env Plugin, React, React DOM, MobX, MobX React, Google Firebase
                </div>
                <button onClick={authManager.login}>
                    {authManager.isLoginRedirect ? <Loader className={theme.loader} size={32} color="var(--theme-color-0)" /> : <img src={google} />}  Login with <span>Google</span>
                </button>
            </div>
        </div>
    );
}