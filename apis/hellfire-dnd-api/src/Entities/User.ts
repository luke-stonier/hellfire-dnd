import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    BeforeInsert, BaseEntity,
} from "typeorm";
import bcrypt from "bcrypt";

export type UserRole = "DM" | "PLAYER" | "ADMIN";

@Entity({ name: "users" })
export class User extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({ unique: true })
    @Column({ type: "varchar", length: 320 })
    email!: string;

    @Column({ type: "varchar", length: 100 })
    displayName!: string;

    @Column({ type: "varchar", length: 255 })
    passwordHash!: string;

    @Column({ type: "varchar", length: 20, default: "PLAYER" })
    role!: UserRole;

    @Column({ type: "boolean", default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @BeforeInsert()
    normalizeEmail() {
        this.email = this.email.trim().toLowerCase();
    }

    async setPassword(plain: string) {
        this.passwordHash = await bcrypt.hash(plain, 12);
    }

    async verifyPassword(plain: string) {
        return bcrypt.compare(plain, this.passwordHash);
    }

    toSafeJSON() {
        return {
            id: this.id,
            email: this.email,
            displayName: this.displayName,
            role: this.role,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
