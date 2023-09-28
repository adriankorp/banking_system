import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelizeService from '../../common/services/sequelize.service';

const sequelize = sequelizeService.getSequelize();

export interface TransactionAttributes
    extends Model<InferAttributes<TransactionAttributes>, InferCreationAttributes<TransactionAttributes>> {
    id: CreationOptional<number>;
    customerId: string;
    amount: number;
    title: string;
    description: string;
    to: string;
    fromAccount: string;
    toAccount: string;
}

export const Transaction = sequelize.define<TransactionAttributes>(
    'Transaction',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        customerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fromAccount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        toAccount: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'transactions',
    },
);

export default Transaction;
