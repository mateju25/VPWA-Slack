export class User {
  constructor(
    public id: number,
    public username: string,
    public fullname: string,
    public email: string,
    public preference: Preference,
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
    public user: User,
    public createdAt: string
  ) {}
}

export class UnreadMessage {
  constructor(public id: number, public channel: Channel, public user: User) {}
}
