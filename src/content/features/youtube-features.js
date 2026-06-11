/**
 * Base Feature Class
 * All new YouTube focus features should extend this.
 */
class ZoneFeature {
    constructor(name, settingKey) {
        this.name = name;
        this.settingKey = settingKey;
        this.isEnabled = false;
    }

    // To be implemented by subclasses
    generateCss() {
        return '';
    }

    update(settings) {
        this.isEnabled = settings[this.settingKey];
    }
}

/**
 * Feature: Home & Recommendations
 */
class HomeFeature extends ZoneFeature {
    constructor() {
        super('Home & Recommendations', 'hideHomeAndRecommendations');
    }

    generateCss() {
        if (!this.isEnabled) return '';
        return `
            ${ZONE_SELECTORS.HOME.FEED}, ${ZONE_SELECTORS.WATCH.RELATED} { display: none !important; }
            ${ZONE_SELECTORS.HOME.PLACEHOLDER}::before { 
                content: "Zone: Focus Mode Active. No more distractions."; 
                display: block; 
                padding: 120px 40px; 
                font-size: 28px; 
                font-weight: 500;
                color: #888888; 
                text-align: center; 
                font-family: 'Roboto', Arial, sans-serif;
            }
        `;
    }
}

/**
 * Feature: Comments
 */
class CommentsFeature extends ZoneFeature {
    constructor() {
        super('Comments', 'hideComments');
    }

    generateCss() {
        if (!this.isEnabled) return '';
        return `${ZONE_SELECTORS.WATCH.COMMENTS} { display: none !important; }`;
    }
}

/**
 * Feature: Shorts
 */
class ShortsFeature extends ZoneFeature {
    constructor() {
        super('Shorts', 'hideShorts');
    }

    generateCss() {
        if (!this.isEnabled) return '';
        return `${ZONE_SELECTORS.SHORTS.SHELF}, ${ZONE_SELECTORS.SHORTS.SIDEBAR}, ${ZONE_SELECTORS.SHORTS.MINI_GUIDE} { display: none !important; }`;
    }
}
