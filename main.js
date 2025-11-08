/**
 * Kiraeve Overlay - Main JavaScript
 * Fetches data from Cloudflare KV via API endpoint
 */

class KiraeveOverlay {
    constructor() {
        this.sessionId = this.getSessionIdFromUrl();
        this.playerMode = this.getPlayerModeFromUrl(); // 'p1', 'p2', or null for combined
        this.apiUrl = `https://kiraeve-overlay.com/api/data/${this.sessionId}`;
        this.data = null;
        this.animatingCounters = {}; // Track which counters are animating
        this.currentValues = { p1: 0, p2: 0 }; // Track current displayed values
        this.init();
    }

    /**
     * Get session ID from URL
     * Format: https://kiraeve-overlay.com/overlay/KIRA-XXXX-XXXX-XXXX
     * or: https://kiraeve-overlay.com/?session=KIRA-XXXX-XXXX-XXXX
     * or: https://kiraeve-overlay.com/?session=KIRA-XXXX-XXXX-XXXX&player=p1
     */
    getSessionIdFromUrl() {
        // First, try query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const sessionFromQuery = urlParams.get('session');
        if (sessionFromQuery) {
            return sessionFromQuery;
        }
        
        // Fall back to path
        const path = window.location.pathname;
        const parts = path.split('/').filter(p => p);
        
        // Find session ID (starts with KIRA-)
        const sessionId = parts.find(p => p.startsWith('KIRA-'));
        
        if (!sessionId) {
            console.error('No session ID found in URL');
            return 'demo';
        }
        
        return sessionId;
    }

    /**
     * Get player mode from URL (p1, p2, or combined)
     */
    getPlayerModeFromUrl() {
        // First, try query parameter
        const urlParams = new URLSearchParams(window.location.search);
        const playerFromQuery = urlParams.get('player');
        if (playerFromQuery) {
            return playerFromQuery;
        }
        
        // Fall back to path
        const path = window.location.pathname;
        if (path.includes('/p1')) return 'p1';
        if (path.includes('/p2')) return 'p2';
        return null; // combined
    }

    /**
     * Initialize overlay
     */
    async init() {
        console.log('Initializing Kiraeve Overlay...');
        console.log('Session ID:', this.sessionId);
        console.log('Player Mode:', this.playerMode || 'combined');
        
        // Initial load
        await this.fetchData();
        this.updateDisplay();
        
        // Auto-refresh every 200ms (same as localhost for instant updates)
        // Note: KV GET is cached at edge, so this doesn't hit KV every time
        setInterval(() => {
            this.fetchData();
        }, 200);
    }

    /**
     * Fetch data from API
     */
    async fetchData() {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            this.data = await response.json();
            this.updateDisplay();
        } catch (error) {
            console.error('Failed to fetch data:', error);
            // Use default data on error
            if (!this.data) {
                this.data = this.getDefaultData();
                this.updateDisplay();
            }
        }
    }

    /**
     * Default data structure
     */
    getDefaultData() {
        return {
            mode: 'single',
            maxWins: 2,
            players: {
                p1: { wins: 0, name: 'P1', showName: true },
                p2: { wins: 0, name: 'P2', showName: true }
            },
            settings: {
                font: 'MrBeast',
                fontSize: 120,
                fontColor: '#FFFFFF',
                borderEnabled: true,
                borderColor: '#000000',
                borderSize: 4
            },
            playerSettings: {
                p1: {},
                p2: {}
            }
        };
    }

    /**
     * Update display with current data
     */
    updateDisplay() {
        if (!this.data) return;

        const mode = this.data.mode || 'single';
        const maxWins = this.data.maxWins || 2;
        const p1 = this.data.players?.p1 || { wins: 0, name: 'P1', showName: true };
        const p2 = this.data.players?.p2 || { wins: 0, name: 'P2', showName: true };
        const settings = this.data.settings || {};
        const p1Settings = this.data.playerSettings?.p1 || {};
        const p2Settings = this.data.playerSettings?.p2 || {};

        // Determine what to show based on player mode
        const showP1 = !this.playerMode || this.playerMode === 'p1';
        const showP2 = (mode === 'dual' && !this.playerMode) || this.playerMode === 'p2';

        // Update P1
        if (showP1) {
            this.updatePlayer('p1', p1, maxWins, settings, p1Settings);
            document.getElementById('p1Section').style.display = 'flex';
        } else {
            document.getElementById('p1Section').style.display = 'none';
        }

        // Update P2
        if (showP2) {
            this.updatePlayer('p2', p2, maxWins, settings, p2Settings);
            document.getElementById('p2Section').style.display = 'flex';
        } else {
            document.getElementById('p2Section').style.display = 'none';
        }

        // Apply global font if specified
        if (settings.font) {
            // Use the same font family as localhost (Komika Axis default)
            const fontFamily = `'${settings.font}', 'Komika Axis', 'Impact', 'Arial Black', sans-serif`;
            document.body.style.fontFamily = fontFamily;
            // Also apply to counters
            const counters = document.querySelectorAll('.counter');
            counters.forEach(c => {
                if (!c.style.fontFamily) c.style.fontFamily = fontFamily;
            });
        }
    }

    /**
     * Update individual player display
     */
    updatePlayer(player, data, maxWins, globalSettings, playerSettings) {
        const nameEl = document.getElementById(`${player}Name`);
        const counterEl = document.getElementById(`${player}Counter`);

        // Update name
        if (nameEl) {
            nameEl.textContent = data.name || player.toUpperCase();
            nameEl.style.display = data.showName !== false ? 'block' : 'none';
        }

        // Update counter with smooth animation
        if (counterEl) {
            const targetValue = data.wins || 0;
            
            // Animate counter if value changed
            if (this.currentValues[player] !== targetValue) {
                this.animateCounter(player, this.currentValues[player], targetValue, maxWins, counterEl);
                this.currentValues[player] = targetValue;
            } else {
                // Just update max wins if it changed
                const currentText = counterEl.textContent;
                const expectedText = `${targetValue}/${maxWins}`;
                if (currentText !== expectedText) {
                    counterEl.textContent = expectedText;
                }
            }

            // Apply player-specific settings
            const fontSize = playerSettings.fontSize || globalSettings.fontSize || 120;
            const fontColor = playerSettings.fontColor || globalSettings.fontColor || '#FFFFFF';
            const borderEnabled = playerSettings.borderEnabled !== undefined 
                ? playerSettings.borderEnabled 
                : (globalSettings.borderEnabled !== false);
            const borderColor = playerSettings.borderColor || globalSettings.borderColor || '#000000';
            const borderSize = playerSettings.borderSize || globalSettings.borderSize || 4;

            counterEl.style.fontSize = `${fontSize}px`;
            counterEl.style.color = fontColor;

            if (borderEnabled) {
                counterEl.style.textShadow = `
                    -${borderSize}px -${borderSize}px 0 ${borderColor},  
                    ${borderSize}px -${borderSize}px 0 ${borderColor},
                    -${borderSize}px ${borderSize}px 0 ${borderColor},
                    ${borderSize}px ${borderSize}px 0 ${borderColor}
                `;
            } else {
                counterEl.style.textShadow = 'none';
            }

            // Apply player-specific font
            if (playerSettings.font) {
                counterEl.style.fontFamily = `'${playerSettings.font}', 'Komika Axis', 'Impact', 'Arial Black', sans-serif`;
            } else if (globalSettings.font) {
                counterEl.style.fontFamily = `'${globalSettings.font}', 'Komika Axis', 'Impact', 'Arial Black', sans-serif`;
            }
        }
    }

    /**
     * Animate counter from old value to new value
     * Counts up/down one by one for smooth effect
     */
    animateCounter(player, fromValue, toValue, maxWins, counterEl) {
        // Cancel any existing animation
        if (this.animatingCounters[player]) {
            clearInterval(this.animatingCounters[player]);
        }

        // If same value, nothing to do
        if (fromValue === toValue) return;

        const direction = toValue > fromValue ? 1 : -1;
        const steps = Math.abs(toValue - fromValue);
        const duration = Math.min(steps * 150, 1000); // 150ms per step, max 1 second
        const stepDuration = duration / steps;

        let current = fromValue;

        // Pulse animation on start
        counterEl.classList.add('updated');
        setTimeout(() => {
            counterEl.classList.remove('updated');
        }, 300);

        this.animatingCounters[player] = setInterval(() => {
            current += direction;
            counterEl.textContent = `${current}/${maxWins}`;

            if (current === toValue) {
                clearInterval(this.animatingCounters[player]);
                this.animatingCounters[player] = null;
            }
        }, stepDuration);
    }
}

// Initialize when page loads
window.addEventListener('DOMContentLoaded', () => {
    new KiraeveOverlay();
});
