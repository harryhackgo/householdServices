import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IClientCreationAttr {
  name: string;
}

@Table({ tableName: "client" })
export class Client extends Model<Client, IClientCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string | undefined;
}
