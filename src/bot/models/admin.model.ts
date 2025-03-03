import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IAdminCreationAttr {
  user_id: number;
  name: string | undefined;
  number: string | undefined;
  location: string | undefined;
  last_state: string;
}

@Table({ tableName: "admin" })
export class Admin extends Model<Admin, IAdminCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  user_id: number | undefined;

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
