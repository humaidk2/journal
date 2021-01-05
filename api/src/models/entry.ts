import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface EntryInstance extends Model {
    Id: string
    data: string
    createdAt: Date
    updatedAt: Date
}

export default function (sequelize: Sequelize): ModelCtor<EntryInstance> {
    return sequelize.define<EntryInstance>('Entry', {
        Id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        data: {
            type: DataTypes.STRING,
        },
        salt: {
            type: DataTypes.STRING,
        },
        UserId: {
            type: DataTypes.STRING,
        },
    })
}
