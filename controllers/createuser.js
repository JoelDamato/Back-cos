const bcrypt = require('bcryptjs');
const User = require('../models/Users'); // Importar el modelo de usuario

const createUser = async (req, res) => {
  try {
    console.log('Cuerpo de la solicitud recibido:', req.body);

    const { nombre, email, password, cursos, rol } = req.body;

    // Validaciones de campos
    if (!nombre || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }

    // Validar el formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'El formato del email no es válido' });
    }

    // Validar longitud de la contraseña
    if (password.length < 6) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear un nuevo usuario
    const user = new User({
      nombre,
      email,
      password: hashedPassword,
      cursos: cursos || [],
      rol: rol || 'user',
    });

    await user.save();

    return res.status(201).json({ message: 'Usuario creado exitosamente.' });

  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = createUser;
