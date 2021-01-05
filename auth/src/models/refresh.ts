import { Sequelize, Model, DataTypes, ModelCtor } from 'sequelize'

interface RefreshInstance extends Model {
    token: string
}

export default function (sequelize: Sequelize): ModelCtor<RefreshInstance> {
    return sequelize.define<RefreshInstance>('Refresh', {
        token: {
            type: DataTypes.STRING,
            primaryKey: true,
        },
    })
}
