import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request) {
  const { take } = await request.json()

  if (!take) {
    return Response.json({ error: 'No take provided' }, { status: 400 })
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a snarky wrestling haiku bot. Create haikus (5-7-5 syllable structure) about wrestling takes.
          
          Rules:
          - Must be EXACTLY 5-7-5 syllables
          - Be funny and sarcastic 
          - Reference current wrestling events (as of September 2025)
          - Use wrestling terminology
          - Roast bad takes mercilessly
          - Never break kayfabe in the haiku itself
          
          You must respond with a JSON object containing:
          1. "haiku": The three-line haiku (separated by newlines)
          2. "hashtags": Array of 1-2 SPECIFIC hashtags that wrestling fans actually use on Twitter
          3. "mentions": Array of 0-1 Twitter handles ONLY if a specific person is the subject
          
          Hashtag Guidelines:
          - Use hashtags that are CURRENTLY TRENDING in wrestling Twitter
          - If mentioning WWE content, use the show hashtag (#WWERaw, #SmackDown, #WWENXT)
          - If mentioning AEW content, use the show hashtag (#AEWDynamite, #AEWCollision)
          - For PPVs, use the specific event hashtag if relevant
          - AVOID generic tags like #Wrestling or #ProWrestling
          - ONLY use wrestler-specific hashtags if they have a known catchphrase hashtag
          
          Mention Guidelines:
          - ONLY tag someone if they are the direct subject of the take
          - Verify the wrestler is active in September 2025
          - Use their actual Twitter handle (e.g., @TonyKhan, @CMPunk)
          - Do NOT tag random wrestlers just because they're mentioned
          
          Example response:
          {
            "haiku": "Tony Khan tweets much\\nFans beg for restraint online\\nBook the show instead",
            "hashtags": ["#AEWDynamite"],
            "mentions": ["@TonyKhan"]
          }`
        },
        {
          role: 'user',
          content: `Write a haiku about: ${take}`
        }
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.8,
      max_tokens: 200,
      response_format: { type: "json_object" }
    })

    let responseData
    try {
      responseData = JSON.parse(completion.choices[0]?.message?.content || '{}')
    } catch (e) {
      // Fallback if JSON parsing fails
      responseData = {
        haiku: completion.choices[0]?.message?.content || "Bot is taking bumps\nTry again in a moment\nTechnical issues",
        hashtags: [],
        mentions: []
      }
    }

    // Ensure we have a haiku
    if (!responseData.haiku) {
      responseData.haiku = "Server botched the spot\nLike a green wrestler on live\nPlease try once again"
    }

    return Response.json(responseData)
  } catch (error) {
    console.error('Groq API error:', error)
    return Response.json({ 
      haiku: "Server botched the spot\nLike a green wrestler on live\nPlease try once again"
    })
  }
}