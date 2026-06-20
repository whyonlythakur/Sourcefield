const EMOJI_REGEX = /(\p{Emoji_Presentation}|\p{Extended_Pictographic}|\u{200D}|\u{FE0F})+/gu;
const STICKER_REGEX = /<a?:\w+:\d+>/g;

module.exports = {
  name: 'massEmoji',
  enabled: false,
  threshold: 10,
  ladder: ['warn', 'mute', 'kick', 'ban'],
  async check(message, redisClient) {
    const content = message.content;
    if (!content) return { triggered: false, confidence: 0, evidence: null };

    const emojis = (content.match(EMOJI_REGEX) || []).length;
    const customEmojis = (content.match(STICKER_REGEX) || []).length;
    const totalEmoji = emojis + customEmojis;

    const threshold = message.guild.modules?.massEmoji?.threshold || 10;

    if (totalEmoji >= threshold) {
      return {
        triggered: true,
        confidence: Math.min(70 + (totalEmoji - threshold) * 5, 100),
        evidence: {
          emojiCount: totalEmoji,
          unicodeEmoji: emojis,
          customEmoji: customEmojis,
          threshold,
        },
        severity: totalEmoji >= threshold * 2 ? 'high' : 'medium',
      };
    }

    return { triggered: false, confidence: 0, evidence: null };
  },
};