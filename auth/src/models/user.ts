import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface UserInstance extends Model {
    Id: string
    username: string
    email: string
    password: string
    firstName: string
    lastName: string
    dateOfBirth: Date
    active: boolean
    encryptedKey: string
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
        email: {
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
        active: {
            type: DataTypes.BOOLEAN,
        },
        encryptedKey: {
            type: DataTypes.STRING,
        },
        passwordSalt: {
            type: DataTypes.STRING,
        },
    })
}
