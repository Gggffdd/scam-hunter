// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();

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
        setTimeout(() => {
            this.showMainMenu();
        }, 2000);
    }

    // Система данных игрока
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

    // Генерация кейсов
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
                            question: "Клиент @safe_deal_2024 пишет: 'Переведите предоплату 5000₽ на карту, после этого вышлю товар. Гарантирую быструю отправку!'",
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
                                    next_node: "node_2"
                                },
                                {
                                    text: "🔍 Попросить гарантии",
                                    feedback: "⚠️ Частично верно. Гарантии важны, но лучше использовать официальные защищенные сервисы.",
                                    points: 5,
                                    correct: false,
                                    next_node: "end"
                                }
                            ]
                        },
                        "node_2": {
                            question: "Клиент отвечает: 'Нет, только предоплата! У меня много покупателей, если не хотите - не мешайте.'",
                            choices: [
                                {
                                    text: "🚫 Прекратить общение",
                                    feedback: "✅ Правильно! Давление и отказ от безопасных способов - явные признаки мошенничества.",
                                    points: 15,
                                    correct: true,
                                    next_node: "end"
                                },
                                {
                                    text: "💬 Попытаться уговорить",
                                    feedback: "❌ Рискованно. Мошенники редко соглашаются на честные условия. Лучше найти другого продавца.",
                                    points: 0,
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
                            question: "Пришло SMS: 'Ваш банковский счет заблокирован. Для разблокировки перейдите по ссылке: bank-security-update.ru'",
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
            title: `${scenario.title} #${id}`,
            difficulty: "beginner",
            ...scenario
        };
    }

    createIntermediateCase(id) {
        return {
            id: `case_${id}`,
            title: `Фейковый гарант #${id}`,
            difficulty: "intermediate",
            dialogue: {
                start: "node_1",
                nodes: {
                    "node_1": {
                        question: "Продавец предлагает использовать 'проверенного гаранта' @super_garant с рейтингом 4.9. Гарант просит перевести деньги на его кошелек для 'безопасного хранения'.",
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
                                next_node: "node_2"
                            }
                        ]
                    },
                    "node_2": {
                        question: "При проверке вы обнаруживаете, что аккаунт создан 3 дня назад, а отзывы выглядят поддельными.",
                        choices: [
                            {
                                text: "🚫 Отказаться от сделки",
                                feedback: "✅ Верное решение! Множество красных флагов указывают на мошенничество.",
                                points: 20,
                                correct: true,
                                next_node: "end"
                            },
                            {
                                text: "💬 Спросить объяснений",
                                feedback: "❌ Рискованно. Мошенники придумают оправдания. Лучше прекратить общение.",
                                points: 5,
                                correct: false,
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
            title: `Социальная инженерия #${id}`,
            difficulty: "advanced",
            dialogue: {
                start: "node_1",
                nodes: {
                    "node_1": {
                        question: "Вам звонит 'сотрудник банка'. Он называет ваши полные данные и говорит о подозрительной операции. Для 'безопасности' просит сообщить код из SMS.",
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
            title: `Многоуровневая атака #${id}`,
            difficulty: "expert",
            dialogue: {
                start: "node_1",
                nodes: {
                    "node_1": {
                        question: "Вы участвуете в сложной сделке с недвижимостью. 'Риелтор' прислал подделанные документы, 'банковский сотрудник' подтверждает сделку по телефону, а 'технический специалист' просит установить 'специальное приложение' для безопасной передачи документов.",
                        choices: [
                            {
                                text: "🔄 Проверить все контакты",
                                feedback: "✅ Верно! При сложных сделках проверяйте каждого участника через официальные каналы.",
                                points: 30,
                                correct: true,
                                next_node: "node_2"
                            },
                            {
                                text: "⚡ Довериться специалистам",
                                feedback: "❌ Опасно! Сложные мошеннические схемы используют множество участников для создания видимости легальности.",
                                points: 0,
                                correct: false,
                                next_node: "end"
                            }
                        ]
                    },
                    "node_2": {
                        question: "При проверке вы обнаруживаете, что номера телефонов не соответствуют официальным, а приложение запрашивает подозрительные разрешения.",
                        choices: [
                            {
                                text: "🚨 Прекратить сделку и сообщить в банк",
                                feedback: "✅ Идеально! Вы раскрыли сложную мошенническую схему и защитили свои средства.",
                                points: 40,
                                correct: true,
                                next_node: "end"
                            },
                            {
                                text: "💬 Попросить альтернативные способы",
                                feedback: "⚠️ Рискованно. При множественных красных флагах лучше полностью отказаться от сделки.",
                                points: 10,
                                correct: false,
                                next_node: "end"
                            }
                        ]
                    }
                }
            }
        };
    }

    // Управление экранами
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
        let badge = { icon: '🟢', text: 'Новичок' };

        if (completed >= 71) {
            badge = { icon: '🔴', text: 'Мастер' };
        } else if (completed >= 31) {
            badge = { icon: '🟣', text: 'Эксперт' };
        } else if (completed >= 11) {
            badge = { icon: '🔵', text: 'Детектив' };
        }

        document.getElementById('playerBadge').innerHTML = `
            <span class="badge-icon">${badge.icon}</span>
            <span class="badge-text">${badge.text}</span>
        `;
    }

    // Система кейсов
    showCases() {
        this.showScreen('casesScreen');
        this.renderCasesGrid();
    }

    renderCasesGrid() {
        const grid = document.getElementById('casesGrid');
        grid.innerHTML = '';

        this.cases.forEach((caseItem, index) => {
            const isCompleted = this.playerData.completedCases.includes(caseItem.id);
            const isLocked = index > 0 && !this.playerData.completedCases.includes(this.cases[index - 1].id);

            const caseCard = document.createElement('div');
            caseCard.className = `case-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`;
            caseCard.innerHTML = `
                <div class="case-number">${index + 1}</div>
                <div class="case-difficulty difficulty-${caseItem.difficulty}">
                    ${this.getDifficultyText(caseItem.difficulty)}
                </div>
            `;

            if (!isLocked) {
                caseCard.onclick = () => this.startCase(caseItem);
            }

            grid.appendChild(caseCard);
        });
    }

    getDifficultyText(difficulty) {
        const texts = {
            'beginner': 'Новичок',
            'intermediate': 'Средний',
            'advanced': 'Продвинутый',
            'expert': 'Эксперт'
        };
        return texts[difficulty] || difficulty;
    }

    // Игровой процесс
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
        document.getElementById('caseTitle').textContent = this.currentCase.title;
        document.getElementById('caseDifficulty').textContent = this.getDifficultyText(this.currentCase.difficulty);
        document.getElementById('caseDifficulty').className = `case-difficulty difficulty-${this.currentCase.difficulty}`;

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
        document.getElementById('feedbackContainer').classList.remove('show');
    }

    makeChoice(choice) {
        this.showFeedback(choice);
        
        // Обновление статистики игрока
        this.updatePlayerStatsAfterChoice(choice);
        
        // Продолжение или завершение кейса
        if (choice.next_node && choice.next_node !== 'end') {
            this.currentNode = choice.next_node;
            setTimeout(() => this.updateGameUI(), 3000);
        } else {
            this.completeCase();
        }
    }

    showFeedback(choice) {
        const feedbackContainer = document.getElementById('feedbackContainer');
        let feedbackClass = 'feedback-incorrect';
        
        if (choice.correct) {
            feedbackClass = 'feedback-correct';
        } else if (choice.points > 0) {
            feedbackClass = 'feedback-partial';
        }

        feedbackContainer.className = `feedback-container ${feedbackClass} show`;
        feedbackContainer.innerHTML = `
            <div class="feedback-title">
                ${choice.correct ? '✅ Правильно!' : choice.points > 0 ? '⚠️ Частично верно' : '❌ Ошибка'}
                <span>+${choice.points} очков</span>
            </div>
            <div class="feedback-text">${choice.feedback}</div>
        `;
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

        // Обновление точности
        const totalChoices = this.playerData.completedCases.length * 2 + 1; // Примерная формула
        const correctChoices = this.playerData.stats.beginner.correct + 
                             this.playerData.stats.intermediate.correct +
                             this.playerData.stats.advanced.correct +
                             this.playerData.stats.expert.correct;
        
        this.playerData.accuracy = totalChoices > 0 ? Math.round((correctChoices / totalChoices) * 100) : 0;

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
            
            setTimeout(() => {
                this.showMainMenu();
            }, 4000);
        }
    }

    // Статистика и достижения
    showStats() {
        this.showScreen('statsScreen');
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const stats = this.playerData.stats;
        
        document.getElementById('statTotalScore').textContent = this.playerData.totalScore;
        document.getElementById('statCasesCompleted').textContent = this.playerData.completedCases.length;
        document.getElementById('statAccuracy').textContent = `${this.playerData.accuracy}%`;
        document.getElementById('statMaxStreak').textContent = this.playerData.maxStreak;

        document.getElementById('statBeginner').textContent = `${stats.beginner.completed}/20`;
        document.getElementById('statIntermediate').textContent = `${stats.intermediate.completed}/30`;
        document.getElementById('statAdvanced').textContent = `${stats.advanced.completed}/30`;
        document.getElementById('statExpert').textContent = `${stats.expert.completed}/20`;
    }

    showAchievements() {
        this.showScreen('achievementsScreen');
        this.renderAchievements();
    }

    renderAchievements() {
        const achievements = [
            { id: 'first_case', name: 'Первый кейс', desc: 'Пройдите первый кейс', icon: '🎮' },
            { id: 'beginner_master', name: 'Мастер новичка', desc: 'Пройдите все кейсы для новичков', icon: '🟢' },
            { id: 'streak_5', name: 'Серия побед', desc: '5 правильных ответов подряд', icon: '🔥' },
            { id: 'perfect_case', name: 'Идеальное прохождение', desc: 'Наберите максимальные очки в кейсе', icon: '⭐' },
            { id: 'detective', name: 'Детектив', desc: 'Пройдите 30 кейсов', icon: '🔍' },
            { id: 'expert', name: 'Эксперт', desc: 'Пройдите 50 кейсов', icon: '🎓' },
            { id: 'master', name: 'Мастер', desc: 'Пройдите все 100 кейсов', icon: '🏆' }
        ];

        const grid = document.getElementById('achievementsGrid');
        grid.innerHTML = '';

        achievements.forEach(achievement => {
            const isUnlocked = this.checkAchievementUnlocked(achievement.id);
            
            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
            card.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            `;
            
            grid.appendChild(card);
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

function startNewGame() {
    const availableCases = game.cases.filter(caseItem => 
        !game.playerData.completedCases.includes(caseItem.id)
    )[0];
    
    if (availableCases) {
        game.startCase(availableCases);
    } else {
        alert('🎉 Поздравляем! Вы прошли все кейсы!');
    }
}

function showCases() {
    game.showCases();
}

function showStats() {
    game.showStats();
}

function showAchievements() {
    game.showAchievements();
}

function showMainMenu() {
    game.showMainMenu();
}

// Инициализация игры при загрузке
document.addEventListener('DOMContentLoaded', () => {
    game = new ScamHunterGame();
});
