import { alias, define, singleton } from '@injex/core';
import { ButtonType } from 'common/enums';
import IUIView from 'interfaces/IUIView';

@define()
@singleton()
@alias("IButton")
export class BigButton implements IUIView {
    public readonly Type = ButtonType.Big;

    public render(props): string {
        return `
            <button style="font-size: 32px; padding: 20px;">${props.text}</button>
        `;
    }
}