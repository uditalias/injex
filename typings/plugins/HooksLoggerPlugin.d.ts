import { IInjexPlugin } from "../interfaces";
import Injex from "../injex";
export default class HooksLoggerPlugin implements IInjexPlugin {
    apply(container: Injex): Promise<void>;
}
