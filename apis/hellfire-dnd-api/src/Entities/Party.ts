import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    BeforeInsert, BaseEntity
} from "typeorm";

@Entity({ name: "parties" })
export class Party extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column({ type: "varchar", length: 120 })
    name!: string;

    @Column({ type: "text", nullable: true })
    description!: string | null;

    @Index()
    @Column({ type: "uuid" })
    dmUserId!: string;

    @Index({ unique: true })
    @Column({ type: "varchar", length: 12 })
    inviteCode!: string;

    @Column({ type: "boolean", default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    @BeforeInsert()
    private ensureInviteCode() {
        if (!this.inviteCode) {
            // 10-ish chars, URL-safe-ish
            this.inviteCode = Party.generateInviteCode(10);
        }
    }

    static generateInviteCode(len: number = 10) {
        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0O1I
        let out = "";
        for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
        return out;
    }

    toSafeJSON() {
        return {
            id: this.id,
            name: this.name,
            description: this.description,
            dmUserId: this.dmUserId,
            inviteCode: this.inviteCode,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
