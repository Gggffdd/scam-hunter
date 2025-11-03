// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();
tg.enableClosingConfirmation();

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

    loadPlayerData() {
        const saved = localStorage.getItem('scamHunterData');
        if (saved) {
            return JSON.parse(saved);
        }
        
        return {
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
        
        // Уровни 21-50: Средний
        for (let i = 21; i <= 50; i++) {
            cases.push(this.createIntermediateCase(i));
        }
        
        // Уровни 51-80: Продвинутый
        for (let i = 51; i <= 80; i++) {
            cases.push(this.createAdvancedCase(i));
        }
        
        // Уровни 81-100: Эксперт
        for (let i = 81; i <= 100; i++) {
            cases.push(this.createExpertCase(i));
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
                                },
                                {
                                    text: "🔍 Попросить гарантии",
                                    feedback: "⚠️ Частично верно. Гарантии важны, но лучше использовать официальные защищенные сервисы.",
                                    points: 5,
                                    correct: false,
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
                                },
                                {
                                    text: "❌ Проигнорировать",
                                    feedback: "✅ Правильно! Игнорирование подозрительных сообщений - лучшая защита.",
                                    points: 8,
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

    createIntermediateCase(id) {
        return {
            id: `case_${id}`,
            title: "Фейковый гарант",
            difficulty: "intermediate",
            dialogue: {
                start: "node_1",
                nodes: {
                    "node_1": {
                        question: "Продавец предлагает использовать 'проверенного гаранта' @super_garant с рейтингом 4.9. Гарант просит перевести деньги на его кошелек для 'безопасного хранения'. Ваш ход?",
                        choices: [
                            {
                                text: "✅ Довериться гаранту",
                                feedback: "❌ Осторожно! Фейковые гаранты - распространенная схема. Проверяйте официальные каналы сервиса.",
                                points: 0,
                                correct: false,
                                next_node: "end"
                            },
                            {
                                text: "🔍 Проверить аккаунт гаранта",
                                feedback: "✅ Правильно! Всегда проверяйте: дату регистрации, отзывы, официальные контакты.",
                                points: 15,
                                correct: true,
                                next_node: "end"
                            }
                        ]
                    }
                }
            }
        };
    }

    createAdvancedCase(id) {
        return {
            id: `case_${id}`,
            title: "Социальная инженерия",
            difficulty: "advanced",
            dialogue: {
                start: "node_1",
                nodes: {
                    "node_1": {
                        question: "Вам звонит 'сотрудник банка'. Он называет ваши полные данные и говорит о подозрительной операции. Для 'безопасности' просит сообщить код из SMS. Что делаете?",
                        choices: [
                            {
                                text: "📞 Назвать код",
                                feedback: "❌ Критическая ошибка! Это код подтверждения операции. Мошенник украдет ваши деньги.",
                                points: 0,
                                correct: false,
                                next_node: "end"
                            },
                            {
                                text: "🚫 Прервать звонок",
                                feedback: "✅ Правильно! Никогда не сообщайте коды из SMS. Перезвоните в банк по официальному номеру.",
                                points: 25,
                                correct: true,
                                next_node: "end"
                            }
                        ]
                    }
                }
            }
        };
    }

    createExpertCase(id) {
        return {
            id: `case_${id}`,
            title: "Многоуровневая атака",
            difficulty: "expert",
            dialogue: {
                start: "node_1",
                nodes: {
                    "node_1": {
                        question: "Вы участвуете в сложной сделке с недвижимостью. 'Риелтор' прислал подделанные документы, 'банковский сотрудник' подтверждает сделку по телефону. Ваши действия?",
                        choices: [
                            {
                                text: "🔄 Проверить все контакты",
                                feedback: "✅ Верно! При сложных сделках проверяйте каждого участника через официальные каналы.",
                                points: 30,
                                correct: true,
                                next_node: "end"
                            },
                            {
                                text: "⚡ Довериться специалистам",
                                feedback: "❌ Опасно! Сложные мошеннические схемы используют множество участников для создания видимости легальности.",
                                points: 0,
                                correct: false,
                                next_node: "end"
                            }
                        ]
                    }
                }
            }
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
        // Обновление основной статистики
        document.getElementById('totalScore').textContent = this.playerData.totalScore;
        document.getElementById('accuracy').textContent = `${this.playerData.accuracy}%`;
        document.getElementById('streak').textContent = this.playerData.currentStreak;

        // Прогресс бар
        const completed = this.playerData.completedCases.length;
        const progress = (completed / 100) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        document.getElementById('progressText').textContent = `${completed}/100`;

        // Бейдж игрока
        this.updatePlayerBadge();
    }

    updatePlayerBadge() {
        const completed = this.playerData.completedCases.length;
        let badge = { emoji: '🟢', text: 'Новичок' };

        if (completed >= 71) {
            badge = { emoji: '🔴', text: 'Мастер' };
        } else if (completed >= 31) {
            badge = { emoji: '🟣', text: 'Эксперт' };
        } else if (completed >= 11) {
            badge = { emoji: '🔵', text: 'Детектив' };
        }

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
        
        // Обновление заголовка
        const caseIndex = this.cases.findIndex(c => c.id === this.currentCase.id) + 1;
        document.getElementById('caseTitle').textContent = this.currentCase.title;
        document.getElementById('caseDifficulty').textContent = this.getDifficultyText(this.currentCase.difficulty);
        document.getElementById('caseDifficulty').className = `difficulty-badge difficulty-${this.currentCase.difficulty}`;
        document.getElementById('caseNumber').textContent = `#${caseIndex}`;

        // Обновление диалога
        document.getElementById('dialogueText').textContent = node.question;

        // Очистка и создание вариантов ответа
        const choicesContainer = document.getElementById('choicesContainer');
        choicesContainer.innerHTML = '';

        node.choices.forEach((choice, index) => {
            const button = document.createElement('button');
            button.className = 'choice-btn';
            button.textContent = choice.text;
            button.onclick = () => this.makeChoice(choice);
            choicesContainer.appendChild(button);
        });

        // Скрытие фидбека
        document.getElementById('feedbackContainer').classList.add('hidden');
        
        // Обновление текущих статов
        this.updateCurrentGameStats();
    }

    makeChoice(choice) {
        this.showFeedback(choice);
        
        // Обновление статистики игрока
        this.updatePlayerStatsAfterChoice(choice);
        
        // Продолжение или завершение кейса
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
        
        // Установка класса в зависимости от правильности ответа
        feedbackContent.className = 'feedback-content ';
        if (choice.correct) {
            feedbackContent.classList.add('correct');
        } else if (choice.points > 0) {
            feedbackContent.classList.add('partial');
        } else {
            feedbackContent.classList.add('incorrect');
        }

        // Установка контента
        document.getElementById('feedbackIcon').textContent = choice.correct ? '✅' : choice.points > 0 ? '⚠️' : '❌';
        document.getElementById('feedbackTitle').textContent = choice.correct ? 'Правильно!' : choice.points > 0 ? 'Частично верно' : 'Ошибка';
        document.getElementById('feedbackText').textContent = choice.feedback;

        // Показ фидбека
        feedbackContainer.classList.remove('hidden');
        feedbackContainer.classList.add('show');
    }

    updatePlayerStatsAfterChoice(choice) {
        // Обновление очков
        this.playerData.totalScore += choice.points;

        // Обновление серии
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
            
            // Обновление статистики по сложности
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
        
        // Расчет точности (упрощенный)
        const totalChoices = completed * 2;
        const correctChoices = Math.floor(totalChoices * (this.playerData.accuracy / 100));
        this.playerData.accuracy = totalChoices > 0 ? Math.round((correctChoices / totalChoices) * 100) : 0;

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
            { id: 'detective', name: 'Детектив', desc: 'Пройдите 30 кейсов', icon: '🔍' },
            { id: 'expert', name: 'Эксперт', desc: 'Пройдите 50 кейсов', icon: '🎓' },
            { id: 'master', name: 'Мастер', desc: 'Пройдите все 100 кейсов', icon: '🏆' }
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
            case 'expert': return completed >= 50;
            case 'master': return completed >= 100;
            default: return false;
        }
    }
}

// Глобальные функции для вызова из HTML
let game;

function startGame() {
    const availableCases = game.cases.filter(caseItem => 
        !game.playerData.completedCases.includes(caseItem.id)
    );
    
    if (availableCases.length > 0) {
        game.startCase(availableCases[0]);
    } else {
        alert('🎉 Поздравляем! Вы прошли все кейсы!');
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

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    game = new ScamHunterGame();
});
