import sequelize from 'sequelize'
import { Sequelize } from 'sequelize'
import UserCreator from './user'
import EntryCreator from './entry'

export default function (dbName: any) {
    const dbHost: any = process.env.JOURNAL_DB_HOST
    const dbUsername: any = process.env.JOURNAL_DB_USER
    const dbPassword: any = process.env.JOURNAL_DB_PASS

    const sequelize = new Sequelize(dbName, dbUsername, dbPassword, {
        host: dbHost,
        dialect: 'mysql',
        logging: false,
    })
    const User = UserCreator(sequelize)
    const Entry = EntryCreator(sequelize)

    User.hasMany(Entry, {
        foreignKey: { allowNull: false },
        onDelete: 'CASCADE',
    })
    Entry.belongsTo(User)

    return {
        User,
        Entry,
        sequelize,
    }
}
