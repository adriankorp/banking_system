import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes } from 'sequelize';
import sequelizeService from '../../common/services/sequelize.service';
import { generateAccountNumber } from '../../common/utils/utils';
import Customer from '../../customer/models/customer.model';

const sequelize = sequelizeService.getSequelize();

export interface AccountAttributes
    extends Model<InferAttributes<AccountAttributes>, InferCreationAttributes<AccountAttributes>> {
    id: CreationOptional<number>;
    accountNumber: CreationOptional<string>;
    balance: CreationOptional<number>;
    customerId: string;
}

export const Account = sequelize.define<AccountAttributes>(
    'Account',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        accountNumber: {
            type: DataTypes.STRING,
            unique: true,
        },
        balance: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 100000,
        },
        customerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
    },
    {
        tableName: 'accounts',
        hooks: {
            beforeCreate: async (account) => {
                let unique = false;
                while (!unique) {
                    const accountNumber = generateAccountNumber();
                    // eslint-disable-next-line no-await-in-loop
                    const existingAccount = await Account.findOne({
                        where: { accountNumber },
                    });

                    if (!existingAccount) {
                        account.accountNumber = accountNumber;
                        unique = true;
                    }
                }
            },
        },
    },
);

Customer.hasOne(Account, {
    foreignKey: 'customerId',
});

Account.belongsTo(Customer, {
    foreignKey: 'customerId',
    onDelete: 'CASCADE',
});

export default Account;
