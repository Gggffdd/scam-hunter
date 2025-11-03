// Инициализация Telegram
const tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

// Конфигурация бота
const BOT_TOKEN = '8405535827:AAFT8rUZeRUxsv_0_PiwSr25B9UCL2-kE0U';

class ScamHunterGame {
    constructor() {
        this.playerData = this.loadPlayerData();
        this.cases = this.generateCases();
        this.currentCase = null;
        this.currentNode = null;
        this.init();
    }

    init() {
        this.showScreen('loadingScreen');
        this.simulateLoading();
        this.initTelegramUser();
    }

    simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 5;
            document.getElementById('loadingProgress').style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.showMainMenu();
                }, 500);
            }
        }, 100);
    }

    initTelegramUser() {
        const user = tg.initDataUnsafe?.user;
        if (user) {
            const userInfo = document.getElementById('userInfo');
            userInfo.innerHTML = `
                👤 ${user.first_name}${user.username ? ` (@${user.username})` : ''}
            `;
        }
    }

    loadPlayerData() {
        const saved = localStorage.getItem('scamHunterData');
        if (saved) {
            return JSON.parse(saved);
        }
        
        const defaultData = {
            totalScore: 0,
            completedCases: [],
            accuracy: 0,
            currentStreak: 0,
            maxStreak: 0,
            stats: {
                beginner: { completed: 0, correct: 0 },
                intermediate: { completed: 0, correct: 0 },
                advanced: { completed: 0, correct: 0 },
                expert: { completed: 0, correct: 0 }
            },
            achievements: []
        };
        
        localStorage.setItem('scamHunterData', JSON.stringify(defaultData));
        return defaultData;
    }

    savePlayerData() {
        localStorage.setItem('scamHunterData', JSON.stringify(this.playerData));
    }

    generateCases() {
        const cases = [];
        
        // Уровни 1-20: Новичок
        for (let i = 1; i <= 20; i++) {
            cases.push(this.createBeginnerCase(i));
        }
        
        return cases;
    }

    createBeginnerCase(id) {
        const scenarios = [
            {
                title: "Подозрительная предоплата",
                dialogue: {
                    start: "node_1",
                    nodes: {
                        "node_1": {
                            question: "Клиент @safe_deal_2024 пишет: 'Переведите предоплату 5000₽ на карту, после этого вышлю товар. Гарантирую быструю отправку!' Что вы делаете?",
                            choices: [
                                {
                                    text: "✅ Согласиться на предоплату",
                                    feedback: "❌ Опасно! Мошенники часто исчезают после получения предоплаты. Всегда используйте защищенные способы оплаты.",
                                    points: 0,
                                    correct: false,
                                    next_node: "end"
                                },
                                {
                                    text: "🛡️ Предложить безопасную сделку",
                                    feedback: "✅ Верно! Безопасные способы: наложенный платеж, гарант сервисы, или личная встреча.",
                                    points: 10,
                                    correct: true,
                                    next_node: "end"
                                }
                            ]
                        }
                    }
                }
            },
            {
                title: "Фишинговая ссылка", 
                dialogue: {
                    start: "node_1",
                    nodes: {
                        "node_1": {
                            question: "Пришло SMS: 'Ваш банковский счет заблокирован. Для разблокировки перейдите по ссылке: bank-security-update.ru' Ваши действия?",
                            choices: [
                                {
                                    text: "🔗 Перейти по ссылке",
                                    feedback: "❌ Опасно! Это фишинговая ссылка для кражи данных. Банки никогда не шлют такие SMS.",
                                    points: 0,
                                    correct: false,
                                    next_node: "end"
                                },
                                {
                                    text: "📱 Позвонить в банк",
                                    feedback: "✅ Верно! Всегда звоните по официальному номеру банка для проверки.",
                                    points: 12,
                                    correct: true,
                                    next_node: "end"
                                }
                            ]
                        }
                    }
                }
            }
        ];
        
        const scenario = scenarios[(id - 1) % scenarios.length];
        return {
            id: `case_${id}`,
            title: scenario.title,
            difficulty: "beginner",
            ...scenario
        };
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    showMainMenu() {
        this.updatePlayerStats();
        this.showScreen('mainMenu');
    }

    updatePlayerStats() {
        document.getElementById('totalScore').textContent = this.playerData.totalScore;
        document.getElementById('accuracy').textContent = `${this.playerData.accuracy}%`;
        document.getElementById('streak').textContent = this.playerData.currentStreak;

        const completed = this.playerData.completedCases.length;
        const progress = (completed / 100) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${completed}/100`;

        this.updatePlayerBadge();
    }

    updatePlayerBadge() {
        const completed = this.playerData.completedCases.length;
        let badge = { emoji: '🟢', text: 'Новичок' };

        if (completed >= 71) badge = { emoji: '🔴', text: 'Мастер' };
        else if (completed >= 31) badge = { emoji: '🟣', text: 'Эксперт' };
        else if (completed >= 11) badge = { emoji: '🔵', text: 'Детектив' };

        document.querySelector('.badge-emoji').textContent = badge.emoji;
        document.querySelector('.badge-text').textContent = badge.text;
    }

    showCasesScreen() {
        this.showScreen('casesScreen');
        this.renderCasesGrid();
    }

    renderCasesGrid() {
        const grid = document.getElementById('casesGrid');
        grid.innerHTML = '';

        this.cases.forEach((caseItem, index) => {
            const isCompleted = this.playerData.completedCases.includes(caseItem.id);
            const isLocked = index > 0 && !this.playerData.completedCases.includes(this.cases[index - 1].id);

            const caseElement = document.createElement('div');
            caseElement.className = `case-item ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
            caseElement.innerHTML = `
                <div class="case-number">${index + 1}</div>
                <div class="case-difficulty difficulty-${caseItem.difficulty}">
                    ${this.getDifficultyText(caseItem.difficulty)}
                </div>
            `;

            if (!isLocked) {
                caseElement.onclick = () => this.startCase(caseItem);
            }

            grid.appendChild(caseElement);
        });
    }

    getDifficultyText(difficulty) {
        const texts = {
            'beginner': 'Новичок',
            'intermediate': 'Средний', 
            'advanced': 'Продв.',
            'expert': 'Эксперт'
        };
        return texts[difficulty] || difficulty;
    }

    startCase(caseItem) {
        this.currentCase = caseItem;
        this.currentNode = caseItem.dialogue.start;
        this.showScreen('gameScreen');
        this.updateGameUI();
    }

    updateGameUI() {
        if (!this.currentCase || !this.currentNode) return;

        const node = this.currentCase.dialogue.nodes[this.currentNode];
        const caseIndex = this.cases.findIndex(c => c.id === this.currentCase.id) + 1;
        
        document.getElementById('caseTitle').textContent = this.currentCase.title;
        document.getElementById('caseDifficulty').textContent = this.getDifficultyText(this.currentCase.difficulty);
        document.getElementById('caseDifficulty').className = `difficulty-badge difficulty-${this.currentCase.difficulty}`;
        document.getElementById('caseNumber').textContent = `#${caseIndex}`;
        document.getElementById('dialogueText').textContent = node.question;

        const choicesContainer = document.getElementById('choicesContainer');
        choicesContainer.innerHTML = '';

        node.choices.forEach((choice) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.onclick = () => this.makeChoice(choice);
            choicesContainer.appendChild(button);
        });

        document.getElementById('feedbackContainer').classList.remove('show');
        this.updateCurrentGameStats();
    }

    makeChoice(choice) {
        this.showFeedback(choice);
        this.updatePlayerStatsAfterChoice(choice);
        
        if (choice.next_node && choice.next_node !== 'end') {
            setTimeout(() => {
                this.currentNode = choice.next_node;
                this.updateGameUI();
            }, 3000);
        } else {
            setTimeout(() => {
                this.completeCase();
                this.showMainMenu();
            }, 3000);
        }
    }

    showFeedback(choice) {
        const feedbackContainer = document.getElementById('feedbackContainer');
        const feedbackContent = feedbackContainer.querySelector('.feedback-content');
        
        feedbackContent.className = 'feedback-content ';
        if (choice.correct) {
            feedbackContent.classList.add('correct');
        } else if (choice.points > 0) {
            feedbackContent.classList.add('partial');
        } else {
            feedbackContent.classList.add('incorrect');
        }

        document.getElementById('feedbackIcon').textContent = choice.correct ? '✅' : '❌';
        document.getElementById('feedbackTitle').textContent = choice.correct ? 'Правильно!' : 'Ошибка';
        document.getElementById('feedbackText').textContent = choice.feedback;

        feedbackContainer.classList.add('show');
    }

    updatePlayerStatsAfterChoice(choice) {
        this.playerData.totalScore += choice.points;

        if (choice.correct) {
            this.playerData.currentStreak++;
            this.playerData.maxStreak = Math.max(this.playerData.maxStreak, this.playerData.currentStreak);
        } else {
            this.playerData.currentStreak = 0;
        }

        this.savePlayerData();
        this.updateCurrentGameStats();
    }

    updateCurrentGameStats() {
        document.getElementById('currentScore').textContent = this.playerData.totalScore;
        document.getElementById('currentStreak').textContent = this.playerData.currentStreak;
    }

    completeCase() {
        if (this.currentCase && !this.playerData.completedCases.includes(this.currentCase.id)) {
            this.playerData.completedCases.push(this.currentCase.id);
            const difficulty = this.currentCase.difficulty;
            this.playerData.stats[difficulty].completed++;
            this.savePlayerData();
        }
    }

    showStatsScreen() {
        this.showScreen('statsScreen');
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const stats = this.playerData.stats;
        const completed = this.playerData.completedCases.length;
        
        document.getElementById('statTotalScore').textContent = this.playerData.totalScore;
        document.getElementById('statCasesCompleted').textContent = completed;
        document.getElementById('statAccuracy').textContent = `${this.playerData.accuracy}%`;
        document.getElementById('statMaxStreak').textContent = this.playerData.maxStreak;

        document.getElementById('statBeginner').textContent = `${stats.beginner.completed}/20`;
        document.getElementById('statIntermediate').textContent = `${stats.intermediate.completed}/30`;
        document.getElementById('statAdvanced').textContent = `${stats.advanced.completed}/30`;
        document.getElementById('statExpert').textContent = `${stats.expert.completed}/20`;
    }

    showAchievementsScreen() {
        this.showScreen('achievementsScreen');
        this.renderAchievements();
    }

    renderAchievements() {
        const achievements = [
            { id: 'first_case', name: 'Первый кейс', desc: 'Пройдите первый кейс', icon: '🎮' },
            { id: 'beginner_master', name: 'Мастер новичка', desc: 'Пройдите все кейсы для новичков', icon: '🟢' },
            { id: 'streak_5', name: 'Серия побед', desc: '5 правильных ответов подряд', icon: '🔥' },
            { id: 'detective', name: 'Детектив', desc: 'Пройдите 30 кейсов', icon: '🔍' }
        ];

        const grid = document.getElementById('achievementsGrid');
        grid.innerHTML = '';

        achievements.forEach(achievement => {
            const isUnlocked = this.checkAchievementUnlocked(achievement.id);
            
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement-item ${isUnlocked ? 'unlocked' : ''}`;
            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-name">${achievement.name}</div>
                    <div class="achievement-desc">${achievement.desc}</div>
                </div>
                <div class="achievement-status">${isUnlocked ? '✅' : '🔒'}</div>
            `;
            
            grid.appendChild(achievementElement);
        });
    }

    checkAchievementUnlocked(achievementId) {
        const completed = this.playerData.completedCases.length;
        
        switch(achievementId) {
            case 'first_case': return completed >= 1;
            case 'beginner_master': return this.playerData.stats.beginner.completed >= 20;
            case 'streak_5': return this.playerData.maxStreak >= 5;
            case 'detective': return completed >= 30;
            default: return false;
        }
    }

    async shareResults() {
        const user = tg.initDataUnsafe?.user;
        const message = `🕵️‍♂️ <b>Мой результат в Scam Hunter!</b>\n\n` +
                       `👤 Игрок: ${user?.first_name || 'Аноним'}\n` +
                       `🏆 Очки: ${this.playerData.totalScore}\n` +
                       `📊 Пройдено кейсов: ${this.playerData.completedCases.length}/100\n` +
                       `🎯 Точность: ${this.playerData.accuracy}%\n\n` +
                       `🔗 Присоединяйся к игре!`;
        
        // Пытаемся отправить через бота
        try {
            await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: user?.id || '123456',
                    text: message,
                    parse_mode: 'HTML'
                })
            });
        } catch (error) {
            console.log('Ошибка отправки, но игра продолжает работать');
        }

        tg.showPopup({
            title: 'Результат отправлен!',
            message: 'Ваш результат отправлен в Telegram',
            buttons: [{ type: 'ok' }]
        });
    }

    openBot() {
        tg.openTelegramLink('https://t.me/scam_hunter_bot');
    }
}

// Глобальные функции
let game;

function startGame() {
    const availableCases = game.cases.filter(caseItem => 
        !game.playerData.completedCases.includes(caseItem.id)
    );
    
    if (availableCases.length > 0) {
        game.startCase(availableCases[0]);
    } else {
        tg.showPopup({
            title: 'Поздравляем! 🎉',
            message: 'Вы прошли все кейсы!',
            buttons: [{ type: 'ok' }]
        });
    }
}

function showScreen(screenId) {
    switch(screenId) {
        case 'mainMenu':
            game.showMainMenu();
            break;
        case 'casesScreen':
            game.showCasesScreen();
            break;
        case 'statsScreen':
            game.showStatsScreen();
            break;
        case 'achievementsScreen':
            game.showAchievementsScreen();
            break;
        default:
            game.showScreen(screenId);
    }
}

function shareResults() {
    game.shareResults();
}

function openBot() {
    game.openBot();
}

// Запуск игры
document.addEventListener('DOMContentLoaded', () => {
    game = new ScamHunterGame();
});
