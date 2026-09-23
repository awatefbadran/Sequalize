import { DataTypes, ENUM, STRING } from "sequelize";
import { sequelize } from "../connectionDB.js";
import userModel from "./user.model.js";


const postModel = sequelize.define("post", {
    title:{type:DataTypes.STRING,allowNull:false},
    content: { type: DataTypes.TEXT,allowNull:false},
  userId: {type: DataTypes.INTEGER,allowNull:false},
},{ timestamps: true, paranoid: true });

postModel.belongsTo(userModel,
   { 
    foreignKey: "userId"
   });

  
export default postModel;
