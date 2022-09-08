import { define, singleton } from '@injex/core';

@define()
@singleton()
export class ClockManager {
    public getTime(): number {
        return Date.now();
    }
}