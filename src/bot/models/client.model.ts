import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IClientCreationAttr {
  user_id: number;
  role: string | undefined;
  name: string | undefined;
  number: string | undefined;
  location: string | undefined;
  last_state: string;
}

@Table({ tableName: "client" })
export class Client extends Model<Client, IClientCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  user_id: number | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  role: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  name: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  number: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last_state: string | undefined;
}
