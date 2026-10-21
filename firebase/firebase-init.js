// --- Local Storage Mock for Firebase ---
// Replaces Firebase Authentication and Firestore with local storage equivalents.

// Global mocks for script.js direct usage
const auth = {
    get currentUser() {
        const uid = localStorage.getItem('stark_nexus_active_user');
        return uid ? { uid } : null;
    }
};

const db = {
    collection: function(colName) {
        if (colName === 'users') {
            return {
                doc: function(docId) {
                    return {
                        update: async function(data) {
                            let users = JSON.parse(localStorage.getItem('stark_nexus_users') || '[]');
                            const userIndex = users.findIndex(u => u.uid === docId);
                            if (userIndex !== -1) {
                                users[userIndex] = { ...users[userIndex], ...data };
                                localStorage.setItem('stark_nexus_users', JSON.stringify(users));
                            } else {
                                throw new Error("User not found");
                            }
                        },
                        get: async function() {
                            let users = JSON.parse(localStorage.getItem('stark_nexus_users') || '[]');
                            const user = users.find(u => u.uid === docId);
                            if (user) {
                                return {
                                    data: function() { return user; }
                                };
                            } else {
                                throw new Error("User not found");
                            }
                        }
                    };
                }
            };
        }
        return {};
    }
};

class ScoreService {
    constructor() {
        this.storageKey = 'stark_nexus_scores';
    }

    async saveScore(game, level, scoreData) {
        const activeUserId = localStorage.getItem('stark_nexus_active_user');
        if (!activeUserId) return false;

        let allUsers = JSON.parse(localStorage.getItem('stark_nexus_users') || '[]');
        const user = allUsers.find(u => u.uid === activeUserId);
        if (!user) return false;

        try {
            let scores = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
            scores.push({
                id: Date.now().toString(),
                userId: activeUserId,
                userEmail: user.email,
                game,
                level,
                timestamp: new Date().toISOString(),
                ...scoreData
            });
            localStorage.setItem(this.storageKey, JSON.stringify(scores));
            console.log(`[LOCAL] Core score synced successfully.`);
            return true;
        } catch (error) {
            console.error("[LOCAL] Score Sync Error:", error);
            return false;
        }
    }

    async getScores(game = null) {
        const activeUserId = localStorage.getItem('stark_nexus_active_user');
        if (!activeUserId) return [];

        let scores = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
        let query = scores.filter(s => s.userId === activeUserId);
        
        if (game) {
            query = query.filter(s => s.game === game);
        }

        query.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        return query;
    }
}

class AuthService {
    constructor() {
        this.usersKey = 'stark_nexus_users';
        this.activeUserKey = 'stark_nexus_active_user';
    }

    async register(email, alias, access_code) {
        try {
            let users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
            
            if (users.find(u => u.email === email)) {
                if (typeof window.showToast === 'function') window.showToast("Agent already exists.");
                else if (typeof showToast === 'function') showToast("Agent already exists.");
                return { success: false };
            }
            
            if (access_code.length < 6) {
                if (typeof window.showToast === 'function') window.showToast("Access code too weak.");
                else if (typeof showToast === 'function') showToast("Access code too weak.");
                return { success: false };
            }

            const newUser = {
                uid: `STARK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                email,
                alias,
                access_code,
                user_id: `STARK-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                created_at: new Date().toISOString()
            };

            users.push(newUser);
            localStorage.setItem(this.usersKey, JSON.stringify(users));
            
            localStorage.setItem(this.activeUserKey, newUser.uid);

            console.log(`[LOCAL] New agent registered: ${alias}`);
            return { success: true, alias };
        } catch (error) {
            console.error("[LOCAL] Registration Error:", error.message);
            if (typeof window.showToast === 'function') window.showToast("Registration failed.");
            else if (typeof showToast === 'function') showToast("Registration failed.");
            return { success: false };
        }
    }

    async login(email, access_code) {
        try {
            let users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
            const user = users.find(u => u.email === email && u.access_code === access_code);

            if (user) {
                localStorage.setItem(this.activeUserKey, user.uid);
                console.log(`[LOCAL] Agent authenticated: ${user.alias || email}`);
                return { success: true, alias: user.alias || email };
            } else {
                throw new Error("Invalid credentials");
            }
        } catch (error) {
            console.error("[LOCAL] Login Error:", error.message);
            if (typeof window.showToast === 'function') window.showToast("Invalid credentials or system rejection.");
            else if (typeof showToast === 'function') showToast("Invalid credentials or system rejection.");
            return { success: false };
        }
    }

    async logout() {
        localStorage.removeItem(this.activeUserKey);
        localStorage.removeItem('stark_nexus_token');
        window.location.reload();
    }

    async getCurrentUser() {
        return new Promise((resolve) => {
            const activeUserId = localStorage.getItem(this.activeUserKey);
            if (activeUserId) {
                let users = JSON.parse(localStorage.getItem(this.usersKey) || '[]');
                const user = users.find(u => u.uid === activeUserId);
                if (user) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            } else {
                resolve(null);
            }
        });
    }
}

// Export to window for access by other scripts
window.AuthService = AuthService;
window.ScoreService = ScoreService;
