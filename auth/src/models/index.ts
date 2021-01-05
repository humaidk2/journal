import sequelize, { DataTypes } from 'sequelize'
import { Sequelize } from 'sequelize'
import UserCreator from './user'
import RefreshCreator from './refresh'

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

    const Refresh = RefreshCreator(sequelize)

    User.hasMany(Refresh, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    Refresh.belongsTo(User)

    return {
        User,
        Refresh,
        sequelize,
    }
}
