import { Column, Table } from '../../src'

const UserStatus = ['online', 'away', 'offline']
type IUserStatus = keyof typeof UserStatus

@Table('users')
export class User {
  @Column((t) => t.bigIncrements())
  id!: string

  @Column((t) => t.string('name').notNullable().defaultTo(''))
  name!: string

  @Column((t) => t.boolean('isDeleted').notNullable().defaultTo(false))
  isDeleted!: string

  @Column((t) => t.enum('status', UserStatus).notNullable().defaultTo('online'))
  status!: IUserStatus

  @Column((t) => t.dateTime('createdAt').notNullable())
  createdAt!: string
}
