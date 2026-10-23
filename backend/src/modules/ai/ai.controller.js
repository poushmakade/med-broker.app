const aiService = require('./ai.service');

module.exports = {
  chat: async (req, res, next) => {
    try {
      const { message, sessionId, context } = req.body || {};

      if (typeof message !== 'string' || !message.trim() || message.length > 4000) {
        return res.status(400).json({
          success: false,
          message: 'message must contain 1 to 4000 characters'
        });
      }

      if (sessionId !== undefined && (typeof sessionId !== 'string' || !/^[A-Za-z0-9_-]{1,128}$/.test(sessionId))) {
        return res.status(400).json({success:false,message:'Invalid chat session ID'});
      }
      if (context !== undefined && (!context || typeof context !== 'object' || Array.isArray(context))) {
        return res.status(400).json({success:false,message:'context must be an object'});
      }

      const result = await aiService.chatWithRag({
        message: String(message).trim(),
        sessionId,
        context,
        user: req.user || null
      });

      return res.json({
        success: true,
        data: result
      });
    } catch (error) {
      return next(error);
    }
  }
};
