import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

// Opciones para SSL en entornos de producción como Render
const dialectOptions = process.env.DB_SSL === 'true' 
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  : {};

const sequelize = new Sequelize(
    process.env.DB_NAME || 'bd_farmacia',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
        host:     process.env.DB_HOST || 'localhost',
        port:     process.env.DB_PORT || 3306,
        dialect:  process.env.DB_DIALECT || 'mysql',
        dialectOptions,
        pool:     {
            max:     5,
            min:     0,
            acquire: 30000,
            idle:    10000,
        },
        logging: process.env.NODE_ENV === 'development' ? console.log : false
    }
);

export default sequelize;
