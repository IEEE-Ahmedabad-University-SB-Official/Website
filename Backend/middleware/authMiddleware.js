const apiKey = process.env.API_KEY;

const authMiddleware = async (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    next();
};

export default authMiddleware; 