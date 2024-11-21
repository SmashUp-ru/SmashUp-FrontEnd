export class Bitmask {
    bitmask: number;

    constructor(bitmask: number) {
        this.bitmask = bitmask;
    }

    read(bit: number): boolean {
        return ((this.bitmask >> bit) & 1) == 1;
    }

    toString(): string {
        return 'Bitmask{' + this.bitmask + '}';
    }
}
