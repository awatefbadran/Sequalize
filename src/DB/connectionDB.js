import { Sequelize } from "sequelize";


export const sequelize = new Sequelize('sequalize', 'root', 'root', {
    port:"3306",
  host: '127.0.0.1',
  dialect: "mysql"
});

export const connection = async ()=>{
    try {
  await sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}
}

export const syncDB = async ()=>{
    try {
  await sequelize.sync({alter:false,force:false});
  console.log('sync has been established successfully.');
} catch (error) {
  console.error('sync Unable to connect to the database:', error);
}
}