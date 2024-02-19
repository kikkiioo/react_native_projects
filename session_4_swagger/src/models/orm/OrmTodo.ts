import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity({name: "todos"}) // table name
export class OrmTodo {
    @PrimaryGeneratedColumn()
    todo_id: number;

    @Column()
    user_id: number;

    @Column()
    todo:string;

    @Column()
    is_deleted: boolean;

    @Column()
    created: Date;

}
