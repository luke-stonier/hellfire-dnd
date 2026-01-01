import "reflect-metadata";
import { Repository, ObjectLiteral, ObjectId, BaseEntity, FindOneOptions, FindOptionsWhere, FindManyOptions, DeleteResult } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";

export type _ObjectId = string | number | Date | ObjectId | string[] | number[] | Date[];

export interface IDatabaseUtil {
	Update<T>(existingData: _ObjectId, dataToUpdate: QueryDeepPartialEntity<T>): Promise<boolean>;
	Upsert<T>(dataToUpdate: QueryDeepPartialEntity<T>, conflictPaths: string[]): Promise<ObjectLiteral>;
	Save<T>(dataToInsert: T): Promise<T>;
	Insert<T>(dataToInsert: QueryDeepPartialEntity<T>): Promise<ObjectLiteral>;
	WhereLike<T>(existingData: FindOptionsWhere<T>): Promise<T[]>;
	Where<T>(existingData: FindManyOptions<T>): Promise<T[]>;
	SingleOrDefault<T>(existingData: FindOneOptions<T>): Promise<T | null>;
	Delete<T>(data: FindOptionsWhere<T>): Promise<DeleteResult>;
}

export class DatabaseUtil<T extends BaseEntity> implements IDatabaseUtil {
	public dataType: T;
	constructor(private repository: Repository<T | any>) {}

	/*
		Update record and returns status of change
	*/
	public async Update<T>(data: _ObjectId, updatedData: QueryDeepPartialEntity<T>): Promise<boolean> {
		var updateResult = await this.repository.update(data, updatedData);
		return updateResult.affected !== undefined && updateResult.affected > 0;
	}

	/*
		Update record if exists, Insert if new and returns status of change
	*/
	public async Upsert<T>(data: QueryDeepPartialEntity<T>, conflictPaths: string[] = ["id"]): Promise<ObjectLiteral> {
		var updateResult = await this.repository.upsert(data, {
			skipUpdateIfNoValuesChanged: true,
			conflictPaths: conflictPaths,
		});
		return updateResult.identifiers;
	}

	/*
		Inserts into DB, modifies data 'ID' prop and returns
	*/
	public async Save<T>(data: T): Promise<T> {
		var createdRecord = await this.repository.save(data);
		return createdRecord;
	}

	/*
		Inserts into DB
	*/
	public async Insert<T>(data: QueryDeepPartialEntity<T>): Promise<ObjectLiteral> {
		var createdRecord = await this.repository.insert(data);
		return createdRecord;
	}

	/*
		Finds all of datatype where attribute is matched
	*/
	public async WhereLike<T>(data: FindOptionsWhere<T>): Promise<T[]> {
		var results = await this.repository.findBy(data);
		return results;
	}

	/*
		Finds all of datatype where attribute is matched
	*/
	public async Where<T>(data: FindManyOptions<T>): Promise<T[]> {
		var results = await this.repository.find(data);
		return results;
	}

	/*
		Finds one of datatype where attribute is matched or nothing if not found
	*/
	public async SingleOrDefault<T>(data: FindOneOptions<T>): Promise<T | null> {
		var result = await this.repository.findOne(data);
		return result;
	}

	public async Count<T>(data: FindManyOptions): Promise<[T[], number]> {
		var results = await this.repository.findAndCount(data);
		return results;
	}

	public async Delete<T>(data: FindOptionsWhere<T>): Promise<DeleteResult> {
		var result = await this.repository.delete(data);
		return result;
	}
}
