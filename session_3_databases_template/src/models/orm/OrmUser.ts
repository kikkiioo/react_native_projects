import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({name: "users"}) // table name
export class OrmUser {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    username: string;

    @Column()
    password:string;

    @Column()
    is_deleted: boolean;

    @Column()
    created: Date;

}
