import { Column, DataType, Model, Table } from "sequelize-typescript";

interface IMasterCreationAttr {
  user_id: number;
  service: string | undefined;
  name: string | undefined;
  number: string | undefined;
  workshop_name: string | undefined;
  address: string | undefined;
  near_to: string | undefined;
  location: string | undefined;
  start_time: number | undefined;
  end_time: number | undefined;
  per_client_time: number | undefined;
  last_state: string | undefined;
}

@Table({ tableName: "master" })
export class Master extends Model<Master, IMasterCreationAttr> {
  @Column({
    type: DataType.BIGINT,
    primaryKey: true,
  })
  user_id: number | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  service: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  username: string | undefined;

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
  workshop_name: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  address: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  near_to: string | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  location: string | undefined;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  start_time: number | undefined;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  end_time: number | undefined;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  per_client_time: number | undefined;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  last_state: string | undefined;
}
