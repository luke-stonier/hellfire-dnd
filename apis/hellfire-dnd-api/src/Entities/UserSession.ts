import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    Index, BaseEntity,
} from "typeorm";
import { User } from "./User";

@Entity({ name: "user_sessions" })
export class UserSession extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index()
    @Column({ type: "uuid" })
    userId!: string;

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user!: User;

    // Store a hashed refresh token (never store raw)
    @Column({ type: "varchar", length: 255 })
    refreshTokenHash!: string;

    @Column({ type: "timestamptz" })
    expiresAt!: Date;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @Column({ type: "timestamptz", nullable: true })
    revokedAt!: Date | null;
}
