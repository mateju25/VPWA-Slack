export class User {
  constructor(
    public id: number,
    public nickname: string,
    public fullName: string,
    public email: string,
    public state: string
  ) {}
}

export class Channel {
  constructor(
    public id: number,
    public name: string,
    public isPrivate: boolean,
    //docasne + sa bude dorabat cez message
    public seen: boolean,
  ) {}
}

export class Relation {
  constructor(
    public id: number,
    public name: string,
  ) {}
}

export class RelationUserChannel {
  constructor(
    public id: number,
    public user: User,
    public channel: Channel,
    public relation: Relation,
  ) {}
}


