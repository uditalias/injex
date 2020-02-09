import { IInjexPlugin, Constructor } from "../interfaces";
import Injex from "../injex";
import metadataHandlers from "../utils/metadata";
import { Colors } from "../utils/colors";

export default class HooksLoggerPlugin implements IInjexPlugin {
	public async apply(container: Injex): Promise<void> {
		container
			.hooks
			.berforeCreateInstance
			.tap(this.constructor.name, (construct: Constructor, args: any[] = []) => {
				const metadata = metadataHandlers.getMetadata(construct);
				container.logger.debug(`${this.constructor.name} Creating instance: ${Colors.FgCyan}${String(metadata.name)}${Colors.Reset} with ${args.length ? 'args: ' : 'no args.'}${args}`);
			});
	}
}