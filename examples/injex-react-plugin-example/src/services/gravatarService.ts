import { define, singleton } from "@injex/core";
import md5 from "blueimp-md5";

@define()
@singleton()
export class GravatarService {
    public getImageUrl(email: string, size: number = 50): string {
        return `https://www.gravatar.com/avatar/${md5(email)}?s=${size}`;
    }
}