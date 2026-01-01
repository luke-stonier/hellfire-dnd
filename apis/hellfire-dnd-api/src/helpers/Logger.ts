export default class Logger {
	public static Log(message: string): void {
		console.warn(`${new Date().toLocaleString("en-GB")}: ${message}`);
	}
}
