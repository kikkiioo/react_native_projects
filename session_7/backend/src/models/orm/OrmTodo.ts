import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({name: "habits"}) // table name
export class OrmTodo {
    @PrimaryGeneratedColumn()
    habit_id: number;

    @Column()
    user_id: number;

    @Column()
    habit:string;

    @Column()
    number_of_times_in_week:number;

    @Column()
    is_deleted: boolean;

    @Column()
    created: string;

}
