import { AliasMap, define, inject, injectAlias, singleton } from '@injex/core';
import IEnvironment from '../interfaces/IEnvironment';
import IUIView from '../interfaces/IUIView';

@define()
@singleton()
export class ButtonManager {
    @inject() private env!: IEnvironment;

    @injectAlias("IButton", "Type") private buttons!: AliasMap<string, IUIView>;

    public getButtonView(): IUIView {
        return this.buttons[this.env.buttonType];
    }
}