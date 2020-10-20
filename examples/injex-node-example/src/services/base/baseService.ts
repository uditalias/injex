import { inject } from "@injex/core";
import IEnvironment from "../../interfaces/IEnvironment";

/**
 * The BaseService is an abstract class.
 * It demonstrate how to @inject dependencies to it's inherited child.
 * Note that this class is not @define since the inherited child is @define.
 */
export abstract class BaseService {
    @inject() protected env: IEnvironment;
}