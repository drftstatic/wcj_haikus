const HASHTAG_LOOKUP = {
    shows: { },
    eras: { },
    wrestlers: { },
};

// Populate HASHTAG_LOOKUP with data
HASHTAG_LOOKUP.shows = {
    'RAW': '#WWERAW',
    'SmackDown': '#SmackDown',
    'NXT': '#WWENXT',
    'WrestleMania': '#WrestleMania',
    'Royal Rumble': '#RoyalRumble',
    'SummerSlam': '#SummerSlam',
    'Survivor Series': '#SurvivorSeries',
    'Money in the Bank': '#MITB',
};
HASHTAG_LOOKUP.eras = {
    'Attitude': '#AttitudeEra',
    'Ruthless Aggression': '#RuthlessAggression',
    'Reality': '#RealityEra',
    'PG': '#PGEra',
    'Tribal Chief': '#TribalChief',
};
HASHTAG_LOOKUP.wrestlers = {
    'Roman Reigns': '#RomanReigns',
    'Seth Rollins': '#SethRollins',
    'Becky Lynch': '#BeckyLynch',
    'Daniel Bryan': '#DanielBryan',
    'Hulk Hogan': '#HulkHogan',
    'Steve Austin': '#StoneCold',
};

export function buildHashtags(inputs) {
    const required = ['#WrestlingCircleJerks', '#WrestlingHaiku'];
    const optional = new Set();

    // Add show/ppv tag
    if (inputs.show && HASHTAG_LOOKUP.shows[inputs.show]) {
        optional.add(HASHTAG_LOOKUP.shows[inputs.show]);
    }

    // Add era tag
    if (inputs.era && HASHTAG_LOOKUP.eras[inputs.era]) {
        optional.add(HASHTAG_LOOKUP.eras[inputs.era]);
    }

    // Add wrestler tag
    if (inputs.wrestlers && inputs.wrestlers.length > 0) {
        const wrestler = inputs.wrestlers[0]; // Prioritize first wrestler
        if (HASHTAG_LOOKUP.wrestlers[wrestler]) {
            optional.add(HASHTAG_LOOKUP.wrestlers[wrestler]);
        }
    }
    
    // Combine and limit to 2 optional tags
    const finalOptional = Array.from(optional).slice(0, 2);

    return [...required, ...finalOptional];
}

export function buildTweetText(haiku, meta, hashtags, format = 'full') {
    const MAX_LEN = 280;
    const haikuText = `${haiku.line1} / ${haiku.line2} / ${haiku.line3}`;
    const tagsText = hashtags.join(' ');

    // 1. Full version
    let context = '';
    if (format === 'full') {
        const contextParts = [meta.show, meta.era].filter(Boolean);
        if (contextParts.length > 0) {
            context = ` — ${contextParts.join(' • ')}`;
        }
    }
    let tweet = `${haikuText}${context}\n${tagsText}`;
    if (tweet.length <= MAX_LEN) return tweet;

    // 2. Drop context
    tweet = `${haikuText}\n${tagsText}`;
    if (tweet.length <= MAX_LEN) return tweet;

    // 3. Drop optional hashtags
    const requiredTags = buildHashtags({ seed: 0 }).join(' '); // seed is irrelevant here
    tweet = `${haikuText}\n${requiredTags}`;
    if (tweet.length <= MAX_LEN) return tweet;

    // 4. Compact separators
    const compactHaiku = `${haiku.line1} | ${haiku.line2} | ${haiku.line3}`;
    tweet = `${compactHaiku}\n${requiredTags}`;
    
    // Final check, truncate if still too long (unlikely but safe)
    return tweet.slice(0, MAX_LEN);
}