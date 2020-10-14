export default interface IChatMessage {
    channel: string;
    created: number;
    from: string;
    text: string;
}