import { IChatUser } from "./IUser";

export default interface IChatMessage {
    id?: string;
    self: boolean;
    channel: string;
    created: number;
    from: IChatUser;
    text: string;
}