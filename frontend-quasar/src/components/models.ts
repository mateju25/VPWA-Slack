export class User {
  constructor(
    public id: number,
    public username: string,
    public fullname: string,
    public email: string,
    public preference: Preference,
    //TODO remove state
    public state: string
  ) {}
}

export class Preference {
  constructor(
    public id: number,
    public stateName: string,
    public darkMode: boolean,
    public notificationsOn: boolean
  ) {}
}

export class Channel {
  constructor(
    public id: number,
    public name: string,
    public isPrivate: boolean,
    public owners: User[],
    public members: User[],
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
