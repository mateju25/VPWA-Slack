export class User {
  constructor(
    public id: number,
    public username: string,
    public fullname: string,
    public email: string,
    public state_id: number,
    public state: string,
    public channels: Channel[],
    public notificationsOn: boolean = true
  ) {}
}

export class Channel {
  constructor(
    public id: number,
    public name: string,
    public isPrivate: boolean,
    public topped: boolean = false
  ) {}
}

export class Role {
  constructor(public id: number, public name: string) {}
}

export class RelationUserChannel {
  constructor(
    public id: number,
    public user: User,
    public channel: Channel,
    public relation: Role
  ) {}
}

export class Message {
  constructor(
    public id: number,
    public text: string,
    public writtenBy: User,
    public belongsTo: Channel,
    public currentlyBeingTyped: boolean,
    public created: number | null
  ) {}
}

export class UnreadMessage {
  constructor(public id: number, public channel: Channel, public user: User) {}
}
