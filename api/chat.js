// Skill Setu backend — Groq
// API key stays on the server.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    res.status(500).json({
      error: 'GROQ_API_KEY missing in .env'
    });
    return;
  }

  try {
    const { mode, prompt } = req.body || {};

    if (!prompt || (mode !== 'chat' && mode !== 'extract')) {
      res.status(400).json({
        error: 'Invalid request'
      });
      return;
    }

    const isExtract = mode === 'extract';

    const groqBody = {
      model: 'openai/gpt-oss-120b',
      max_completion_tokens: isExtract ? 3000 : 400,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    // Force the final Skill Report to be JSON
    if (isExtract) {
      groqBody.response_format = {
        type: 'json_object'
      };
    }

    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(groqBody)
      }
    );

    const data = await response.json();

    if (!response.ok) {
      res.status(response.status).json({
        error: data.error?.message || 'Groq API error'
      });
      return;
    }

    const text =
      data.choices?.[0]?.message?.content || '';

    if (!text) {
      res.status(500).json({
        error: 'Groq returned an empty response'
      });
      return;
    }

    res.status(200).json({ text });

  } catch (err) {
    console.error('Skill Setu backend error:', err);

    res.status(500).json({
      error: err.message || 'Server error'
    });
  }
};