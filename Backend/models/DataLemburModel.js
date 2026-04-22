import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const DataLembur = db.define(
  "data_lembur",
  {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    pegawai_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    nik: {
      type: DataTypes.STRING(16),
      allowNull: false,
    },
    nama_pegawai: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    tanggal_lembur: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    jam_lembur: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    alasan: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "rejected"),
      allowNull: false,
      defaultValue: "pending",
    },
    approved_by: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  { freezeTableName: true }
);

export default DataLembur;
