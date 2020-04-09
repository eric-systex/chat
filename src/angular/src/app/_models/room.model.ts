export class Room {
  constructor(
    public name: string, 
    public last_message: string, 
    public last_modified: number, 
    public avatar: string, 
    public id?: string) {
  }
}