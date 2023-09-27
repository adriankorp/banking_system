import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelizeService from '../../common/services/sequelize.service';

const sequelize = sequelizeService.getSequelize();

export interface CustomerAttributes
    extends Model<InferAttributes<CustomerAttributes>, InferCreationAttributes<CustomerAttributes>> {
    id: CreationOptional<string>;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    address: string;
    phone: string;
}

export const Customer = sequelize.define<CustomerAttributes>(
    'Customer',
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
            },
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 100],
            },
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [5, 100],
            },
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        tableName: 'customers',
    },
);

export default Customer;
