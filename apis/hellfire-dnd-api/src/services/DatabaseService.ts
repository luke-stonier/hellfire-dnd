import { Service } from "typedi";
import {DataSource, DataSourceOptions, EntitySchema, MixedList} from "typeorm";

// register entites here
const APP_ENTITIES: MixedList<string | Function | EntitySchema<any>> = [
];

@Service()
export default class DatabaseService {
	private _dataSource: DataSource;

	public get postgresSource() {
		if (this._dataSource == null) {
			const conf = {
				type: "postgres",
				host: process.env.DB_HOST,
				username: process.env.DB_USER,
				password: process.env.DB_PASSWORD,
				database: process.env.DB_NAME,
				port: 5432,
				synchronize: process.env.ENV_NAME === "LOCAL", // only synchronize in development
				logging: false,
				entities: APP_ENTITIES,
				migrations: [],
				subscribers: [],
				extra: {
					ssl: {
						rejectUnauthorized: false,
					},
				},
			} as DataSourceOptions;
			this._dataSource = new DataSource(conf);
		}

		return this._dataSource;
	}

	public Connect(success: () => void): void {
		try {
			console.log("DATABASE SERVICE: Connecting to database");
			this.postgresSource
				.initialize()
				.then(() => {
					console.log("Connected to database ✅");
					success();
				})
				.catch((error) => console.log(error));
		} catch (exception: unknown) {
			console.log("DATABASE SERVICE ERROR:", exception);
			success();
		}
	}
}