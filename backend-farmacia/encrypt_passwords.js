import bcrypt from 'bcryptjs';
import db from './app/models/index.js';

const { user: User } = db;

const encryptPasswords = async () => {
  try {
    const users = await User.findAll();

    for (const user of users) {
      if (!user.password.startsWith('$2a$')) { // Verifica si la contraseña ya está encriptada
        const hashedPassword = await bcrypt.hash(user.password, 8);
        user.password = hashedPassword;
        await user.save();
        console.log("Contraseña encriptada para el usuario: ${user.username}");
      } else {
        console.log("La contraseña del usuario ${user.username} ya está encriptada.");
      }
    }

    console.log('Proceso de encriptación completado.');
  } catch (error) {
    console.error('Error al encriptar contraseñas:', error);
  }
};

encryptPasswords();