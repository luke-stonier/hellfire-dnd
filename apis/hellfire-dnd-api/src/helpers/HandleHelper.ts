export class HandleHelper {
    public static Handle(str: string): string {
        return str.replace(/[\W_]+/g, "-").toLowerCase();
    }
}
