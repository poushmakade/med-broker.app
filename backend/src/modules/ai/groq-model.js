const chooseGroqModel = async (client) => {
  const models = await client.models.list();
  const available = new Set((models.data || []).map(model => model.id));
  const candidates = process.env.GROQ_MODEL
    ? [process.env.GROQ_MODEL]
    : ['llama-3.3-70b-versatile', 'openai/gpt-oss-20b', 'llama-3.1-8b-instant', 'qwen/qwen3-32b'];
  const model = candidates.find(id => available.has(id));
  if (!model) throw new Error('No supported chat model is available; configure GROQ_MODEL for this account');
  return model;
};
module.exports = { chooseGroqModel };
