export interface Habit{
 habitId?:number | null;
 user_id?:number;
 description: string;
 number_of_times_in_week: number;
 is_deleted: boolean;
}
