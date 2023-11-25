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
    role_id: number,
    phone: string,
    email: string,
    joined_date: string
}
