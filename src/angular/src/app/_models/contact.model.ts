export class Contact {
  constructor(
    public id: string,
    public name: string, 
    public room: string,
    public type: string,
    public avatar: string,
    public members_count?: number) {}
}