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
            badge = { emoji: '🟣', text: 'Э
