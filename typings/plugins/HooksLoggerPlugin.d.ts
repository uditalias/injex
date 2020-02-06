import { IInjexPlugin } from "../interfaces";
import Injex from "../injex";
export default class HooksLoogerPlugin implements IInjexPlugin {
    apply(container: Injex): void;
}
