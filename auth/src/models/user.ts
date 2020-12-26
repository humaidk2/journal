import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface UserInstance extends Model {
    Id: string
    username: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth: Date
}

export default function (sequelize: Sequelize): ModelCtor<UserInstance> {
    return sequelize.define<UserInstance>('User', {
        Id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        username: {
            type: DataTypes.STRING,
        },
        password: {
            type: DataTypes.STRING,
        },
        firstName: {
            type: DataTypes.STRING,
        },
        lastName: {
            type: DataTypes.STRING,
        },
        dateOfBirth: {
            type: DataTypes.DATE,
        },
    })
}
