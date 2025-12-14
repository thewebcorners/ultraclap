const { ProductMedia } = require('../models');
const cloudinary = require('../utils/cloudinary');

exports.getAll = async (req, res) => {
  try { const data = await ProductMedia.findAll(); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getById = async (req, res) => {
  try { const data = await ProductMedia.findByPk(req.params.id); res.json(data); } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.create = async (req, res) => {
  try {
    const data = req.body;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'productMedias' }, (err, res) => { if(err) reject(err); else resolve(res); });
        stream.end(req.file.buffer);
      });
      data.image_url = result.secure_url;
    }
    const obj = await ProductMedia.create(data);
    res.json(obj);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.update = async (req, res) => {
  try {
    const obj = await ProductMedia.findByPk(req.params.id);
    if (!obj) return res.status(404).json({ message: 'Not found' });
    const data = req.body;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: 'productMedias' }, (err, res) => { if(err) reject(err); else resolve(res); });
        stream.end(req.file.buffer);
      });
      data.image_url = result.secure_url;
    }
    await obj.update(data);
    res.json(obj);
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.delete = async (req, res) => {
  try {
    const obj = await ProductMedia.findByPk(req.params.id);
    if (!obj) return res.status(404).json({ message: 'Not found' });
    await obj.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { res.status(500).json({ error: err.message }); }
};
