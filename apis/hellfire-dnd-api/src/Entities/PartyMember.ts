import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
    Unique, BaseEntity
} from "typeorm";

export type PartyRole = "DM" | "PLAYER";

@Entity({ name: "party_members" })
@Unique("uq_party_member", ["partyId", "userId"])
export class PartyMember extends BaseEntity {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index()
    @Column({ type: "uuid" })
    partyId!: string;

    @Index()
    @Column({ type: "uuid" })
    userId!: string;

    @Column({ type: "varchar", length: 10, default: "PLAYER" })
    partyRole!: PartyRole;

    @Column({ type: "varchar", length: 80, nullable: true })
    characterName!: string | null;

    @Column({ type: "boolean", default: true })
    isActive!: boolean;

    @CreateDateColumn({ type: "timestamptz" })
    createdAt!: Date;

    @UpdateDateColumn({ type: "timestamptz" })
    updatedAt!: Date;

    toSafeJSON() {
        return {
            id: this.id,
            partyId: this.partyId,
            userId: this.userId,
            partyRole: this.partyRole,
            characterName: this.characterName,
            isActive: this.isActive,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}
