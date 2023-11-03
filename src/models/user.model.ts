export enum Role {
    user,
    admin,
    worker,
    dishwasher,
    chef
  }
export type UserServiceModel = {
    name: string,
    username: string,
    password: string,
    salary: number,
    role: string,
    phone: string
}
