export const ZONE_CONSTANTS = {
  STORAGE_KEYS: {
    SETTINGS: 'zone_settings',
    PATTERN_DATA: 'zone_pattern_data',
    STUDY_STATE: 'zone_study_state'
  },
  STUDY: {
    ALARM_NAME: 'zone_study_alarm',
    PHASES: {
      WORK: 'WORK',
      BREAK: 'BREAK'
    }
  },
  PATTERN: {
    SEARCH_PARAMS: ['q', 'search_query', 'query', 'p'],
    MAX_NODES: 200,
    MERGE_THRESHOLD_MS: 120000  // 2 min — same hostname within this window = update existing node
  },
  DEFAULT_SETTINGS: {
    hideHomeAndRecommendations: true,
    hideComments: true,
    hideShorts: true,
    blockSocial: false,
    blockForums: false,
    blockStreaming: false
  },
  BLOCK_LISTS: {
    SOCIAL: [
      'instagram.com', 'facebook.com', 'twitter.com', 'x.com', 'abs.twimg.com', 't.co'
    ],
    FORUMS: [
      'reddit.com', '9gag.com', 'news.ycombinator.com'
    ],
    STREAMING: [
      'netflix.com', 'twitch.tv', 'disneyplus.com', 'primevideo.com'
    ]
  },
  CLASSES: {
    HIDE_HOME: 'zone-hide-home',
    HIDE_COMMENTS: 'zone-hide-comments',
    HIDE_SHORTS: 'zone-hide-shorts'
  }
};
