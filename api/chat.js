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
      // gpt-oss spends part of this budget on hidden reasoning; too small a cap
      // for chat left no room for the reply and returned empty content.
      max_completion_tokens: isExtract ? 3000 : 1000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    };

    // A short follow-up question needs little reasoning; keep it light and fast.
    if (!isExtract) {
      groqBody.reasoning_effort = 'low';
    }

    // Force the final Skill Report to be JSON
    if (isExtract) {
      groqBody.response_format = {
        type: 'json_object'
      };
    }

    // On a 429 rate limit, wait 2s and retry, then 4s and retry once more.
    const retryDelaysMs = [2000, 4000];
    let response;
    for (let attempt = 0; ; attempt++) {
      response = await fetch(
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

      if (response.status !== 429 || attempt >= retryDelaysMs.length) break;

      await response.text().catch(() => {}); // free the connection before retrying
      const delay = retryDelaysMs[attempt];
      console.warn(`Groq rate limited (429), retry ${attempt + 1} in ${delay}ms`);
      await new Promise(r => setTimeout(r, delay));
    }

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