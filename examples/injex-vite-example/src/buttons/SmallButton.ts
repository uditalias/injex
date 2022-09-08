import { alias, define, singleton } from '@injex/core';
import { ButtonType } from '../common/enums';
import IButtonProps from "../interfaces/IButtonProps";
import IUIView from '../interfaces/IUIView';

@define()
@singleton()
@alias("IButton")
export class SmallButton implements IUIView {
    public readonly Type = ButtonType.Small;

    public render(props: IButtonProps): string {
        return `
            <button style="font-size: 14px; padding: 10px;">${props.text}</button>
        `;
    }
}