
import { DataTypes} from "sequelize";
import { sequelize } from "../connectionDB.js";

const userModel = sequelize.define("user", {
    name:{type:DataTypes.STRING ,allowNull:false},
    email: {
       type: DataTypes.STRING,
        unique: true,
        validate: { isEmail: true },
        allowNull:false
    },
  password: { type: DataTypes.STRING ,
    validate:{checkPasswordLength(value){
        if(value.length<=6){
            throw new Error( "Password must be greater than 6 characters" );
        }
    }},
    allowNull:false
  },

    role:{type:DataTypes.ENUM("user","admin"),
        allowNull:false

    }

},{
hooks: 
{
     beforeCreate: (user) =>{
         if (user.name.length <= 2) {
             throw new Error( "Name must be greater than 2 characters" ); 
            } }}
            });

         
export default userModel;

