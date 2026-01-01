import { Service } from "typedi";
import { DataSource, EntitySchema, MixedList } from "typeorm";

// register entites here
const APP_ENTITIES: MixedList<string | Function | EntitySchema<any>> = [
];

@Service()
export default class DatabaseService {
	private _dataSource: DataSource;

	public get postgresSource() {
		if (this._dataSource == null)
			this._dataSource = new DataSource({
				type: "postgres",
				host: process.env.DATABASE_HOST,
				username: process.env.DATABASE_USERNAME,
				password: process.env.DATABASE_PASSWORD,
				database: process.env.DATABASE_NAME,
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
			});

		return this._dataSource;
	}

	public Connect(success: () => void): void {
		try {
			console.log("DATABASE SERVICE: Connecting to database");
			this.postgresSource
				.initialize()
				.then(() => success())
				.catch((error) => console.log(error));
		} catch (exception: any) {
			console.log("DATABASE SERVICE ERROR:", exception);
			success();
		}
	}
}