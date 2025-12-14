module.exports = {
    success: (res, data, code = 200) => res.status(code).json({ success: true, data }),
    error: (res, message = 'Server Error', code = 500) => res.status(code).json({ success: false, message })
};