const  AdminUser  = require('../models/adminUser.model');
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const password_hash = await bcrypt.hash(password, 10);
    const user = await AdminUser.create({ name, email, password_hash, role });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await AdminUser.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid email/password' });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid email/password' });
    res.json({ message: 'Login successful', user });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
