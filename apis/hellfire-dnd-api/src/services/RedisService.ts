import { Service } from "typedi";
import { createClient, TimeSeriesAggregationType } from "redis";
import { ENVIRONMENT } from "../environment";

@Service()
export default class RedisService {
	private connected: boolean = false;

	private redisClient = createClient({
		password: ENVIRONMENT.REDIS_PASSWORD,
		socket: {
			host: ENVIRONMENT.REDIS_HOST,
			port: 6379,
		},
	});

	constructor() {}

	public async setupRedis(): Promise<void> {
		if (this.connected) return;
		this.connected = true;
		this.redisClient.on("connect", () => console.log("REDIS CONNECTING"));
		this.redisClient.on("error", (err) => this.handleError(err));
		this.redisClient.on("ready", () => this.handleConnected());
		await this.redisClient.connect();
	}

	private handleConnected(): void {
		console.log("REDIS CONNECTED");
		this.connected = true;
	}

	private handleError(err: string): void {
		console.log("REDIS ERROR:", err);
		this.redisClient.disconnect();
		this.connected = false;

		setTimeout(async () => {
			await this.redisClient.connect();
		}, 5000);
	}

	private notOpen<T>(r: T): T {
		console.log("REDIS CONENCTION UNAVAILABLE");
		return r;
	}

	public async echo(str: string): Promise<boolean> {
		if (!this.redisClient.isReady) return this.notOpen<boolean>(false);
		this.redisClient.echo(`[${new Date(Date.now()).toISOString()}] ${str}`);
		return true;
	}

	public async TSADD(metric: string, key: number, value: number): Promise<boolean> {
		if (!this.redisClient.isReady) return this.notOpen<boolean>(false);
		await this.redisClient.ts.ADD(metric, key, value);
		return true;
	}

	public async TSRange(metric: string, from: number, to: number, span: number): Promise<any[]> {
		if (!this.redisClient.isReady) return this.notOpen<any[]>([]);
		try {
			const resp = await this.redisClient.ts.RANGE(metric, from, to, {
				AGGREGATION: {
					type: TimeSeriesAggregationType.SUM,
					timeBucket: span,
					EMPTY: true,
				},
			});
			return resp;
		} catch (exception: any) {
			return [];
		}
	}
}
