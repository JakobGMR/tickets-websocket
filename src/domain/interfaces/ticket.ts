export interface Ticket{
    id: string;
    number: number;
    createdAt: Date;
    handleAtDesk?: string; // which desk is this ticket at
    handleAt?: Date;
    done: boolean;
    doneAt?: Date;
}