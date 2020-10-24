interface Window {
    firebase: any;
}

declare module "*.scss" {
    interface IClassNames {
        [className: string]: string;
    }
    const classNames: IClassNames;
    export = classNames;
}

declare module "*.jpg" {
    const Image: string;
    export = Image;
}

declare module "*.webp" {
    const Image: string;
    export = Image;
}

declare module "*.svg" {
    const Image: string;
    export = Image;
}