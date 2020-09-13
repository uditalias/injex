export default interface IMailProvider {
    send(message: string): Promise<void>;
}