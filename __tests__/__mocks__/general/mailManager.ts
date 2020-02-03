import { define, singleton, inject, init } from "../../../src";
import { MailService } from "./mailService";
import { Mail } from "./mail";

@define()
@singleton()
export class MailManager {

	@inject() private mailService: MailService;
	@inject(Mail) private createMail: (message: string) => Mail;
	public initialized: boolean;

	constructor() {
		this.initialized = false;
	}

	@init()
	public initialize() {
		this.initialized = true;
	}

	public send(message: string | Mail) {

		this.mailService.send(
			message instanceof Mail
				? message
				: this.createMail(message)
		);
	}
}