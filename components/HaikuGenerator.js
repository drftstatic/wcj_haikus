'use client'

import { useState } from 'react'

export default function HaikuGenerator() {
  const [take, setTake] = useState('')
  const [haiku, setHaiku] = useState('')
  const [hashtags, setHashtags] = useState([])
  const [mentions, setMentions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [copied, setCopied] = useState(false)

  const generateHaiku = async () => {
    if (!take.trim()) return

    setLoading(true)
    setShowResult(false)
    setCopied(false)

    try {
      const response = await fetch('/api/haiku', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ take })
      })

      const data = await response.json()
      setHaiku(data.haiku)
      setHashtags(data.hashtags || [])
      setMentions(data.mentions || [])
      setShowResult(true)
    } catch (error) {
      console.error('Error:', error)
      setHaiku("Server taking bumps\nLike a young wrestler learning\nTry again later")
      setHashtags([])
      setMentions([])
      setShowResult(true)
    } finally {
      setLoading(false)
    }
  }

  const copyHaiku = () => {
    navigator.clipboard.writeText(`${haiku}\n\n🤼 via wrestlinghaiku.com`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const tweetHaiku = () => {
    // Use AI-generated hashtags and mentions, with defaults
    const allHashtags = ['#WrestlingHaiku', '#WrestlingCircleJerks', ...(hashtags || [])]
    const allMentions = [...(mentions || [])]
    
    // Build the tweet text
    const hashtagString = allHashtags.join(' ')
    const mentionString = allMentions.join(' ')
    const text = encodeURIComponent(`${haiku}\n\n${hashtagString} ${mentionString}`)
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank')
  }

  const reset = () => {
    setTake('')
    setHaiku('')
    setHashtags([])
    setMentions([])
    setShowResult(false)
    setCopied(false)
  }

  return (
    <div className="min-h-screen flex flex-col px-4 py-6 md:py-12">
      {/* Header */}
      <header className="w-full max-w-2xl mx-auto mb-8 md:mb-12">
        <nav className="flex justify-between items-center">
          <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            #WCJHaiku
          </div>
          <a 
            href="https://wrestlingcirclejerks.com" 
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm md:text-base text-gray-400 hover:text-white transition"
          >
            Listen to Podcast →
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full">
        {/* Hero Text - Compact on mobile */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold mb-3 md:mb-6 leading-tight">
            Wrestling takes
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              as poetry
            </span>
          </h1>
          <p className="text-base md:text-xl text-gray-400">
            17 syllables of squared circle truth
          </p>
        </div>

        {/* Input Section - More compact */}
        {!showResult && (
          <div className="glass rounded-2xl p-6 md:p-8 mb-6">
            <label className="block text-sm text-gray-400 mb-2 md:mb-3">
              Drop your hottest wrestling take
            </label>
            <textarea
              value={take}
              onChange={(e) => setTake(e.target.value)}
              placeholder="Tony Khan needs to stop tweeting..."
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 text-base md:text-lg resize-none focus:outline-none focus:border-purple-400 transition"
              rows="3"
            />
            <div className="flex justify-end mt-4 md:mt-6">
              <button
                onClick={generateHaiku}
                disabled={loading || !take.trim()}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 md:px-8 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Generate Haiku'}
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-flex gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full pulse"></div>
              <div className="w-2 h-2 bg-pink-400 rounded-full pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full pulse" style={{animationDelay: '0.4s'}}></div>
            </div>
            <p className="text-gray-400 mt-4 text-sm md:text-base">Crafting your masterpiece...</p>
          </div>
        )}

        {/* Result - Full screen on mobile */}
        {showResult && !loading && (
          <div className="glass rounded-2xl p-6 md:p-8 neon-glow">
            <div className="flex justify-between items-start mb-4">
              <span className="text-xs md:text-sm text-purple-400 font-semibold uppercase tracking-wider">
                Your Haiku
              </span>
              <button
                onClick={copyHaiku}
                className="text-gray-400 hover:text-white transition relative"
                title="Copy haiku"
              >
                {copied ? '✓' : '📋'}
                {copied && (
                  <span className="absolute -top-8 -right-2 text-xs bg-white/10 px-2 py-1 rounded">
                    Copied!
                  </span>
                )}
              </button>
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-line mb-6 md:mb-8 font-light">
              {haiku}
            </div>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                onClick={tweetHaiku}
                className="flex-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 py-3 rounded-xl transition font-semibold"
              >
                Share on 𝕏
              </button>
              <button
                onClick={reset}
                className="flex-1 sm:flex-initial px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition"
              >
                New Take
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer - More compact */}
      <footer className="w-full max-w-2xl mx-auto mt-12 md:mt-16 pt-6 md:pt-8 border-t border-white/10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="text-center sm:text-left">
            <p className="text-gray-400 text-xs md:text-sm">
              <a 
                href="https://wrestlingcirclejerks.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition"
              >
                Wrestling Circle Jerks
              </a>
              {' × '}
              <span className="text-purple-400">AI Haiku</span>
            </p>
          </div>
          <div className="text-gray-400 text-xs md:text-sm">
            Built by{' '}
            <a 
              href="https://fladrycreative.co" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition"
            >
              Fladry Creative
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}