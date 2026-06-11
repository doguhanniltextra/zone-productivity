const ZONE_SELECTORS = {
  HOME: {
    FEED: 'ytd-browse[page-subtype="home"] #contents, ytd-browse[page-subtype="home"] #primary',
    PLACEHOLDER: 'ytd-browse[page-subtype="home"]'
  },
  WATCH: {
    RELATED: '#secondary #secondary-inner #related, ytd-watch-next-secondary-results-renderer',
    COMMENTS: '#comments, ytd-comments, #sections.ytd-comments'
  },
  SHORTS: {
    SHELF: 'ytd-rich-shelf-renderer[is-shorts], ytd-reel-shelf-renderer, ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])',
    SIDEBAR: 'ytd-guide-entry-renderer:has(a[title="Shorts"]), a[title="Shorts"], ytd-mini-guide-entry-renderer[aria-label="Shorts"]',
    MINI_GUIDE: 'ytd-mini-guide-entry-renderer:has(a[title="Shorts"])'
  }
};
