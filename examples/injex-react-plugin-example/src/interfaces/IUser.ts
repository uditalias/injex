export default interface IUser {
    id: string;
    name: string;
    email: string;
    created: number;
}

export interface IChatUser extends IUser {
    presence: "online" | "offline";
}