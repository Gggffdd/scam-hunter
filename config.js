// Конфигурация Telegram бота
const BOT_CONFIG = {
    token: '8405535827:AAFT8rUZeRUxsv_0_PiwSr25B9UCL2-kE0U',
    webAppUrl: window.location.origin,
    botUsername: 'scam_hunter_bot' // Замени на username твоего бота
};

// Telegram WebApp утилиты
const TelegramUtils = {
    // Инициализация Telegram WebApp
    init() {
        this.tg = window.Telegram.WebApp;
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        
        // Устанавливаем цветовую схему
        this.tg.setHeaderColor('#6366F1');
        this.tg.setBackgroundColor('#0F172A');
        
        return this.tg;
    },

    // Получение данных пользователя
    getUser() {
        return this.tg.initDataUnsafe?.user || {
            id: Math.floor(Math.random() * 1000000),
            first_name: 'Игрок',
            username: 'player'
        };
    },

    // Отправка данных на сервер бота
    async sendDataToBot(data) {
        try {
            const response = await fetch(`https://api.telegram.org/bot${BOT_CONFIG.token}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: this.getUser().id,
                    text: data.message,
                    parse_mode: 'HTML'
                })
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка отправки в бота:', error);
        }
    },

    // Отправка достижения в бота
    async sendAchievement(achievement) {
        const user = this.getUser();
        const message = `🎉 <b>Новое достижение!</b>\n\n` +
                       `👤 Игрок: ${user.first_name}${user.username ? ` (@${user.username})` : ''}\n` +
                       `🏆 ${achievement.name}\n` +
                       `📝 ${achievement.desc}\n\n` +
                       `🎮 Продолжайте играть в Scam Hunter!`;
        
        return await this.sendDataToBot({ message });
    },

    // Поделиться результатом
    async shareResults(score, casesCompleted, accuracy) {
        const user = this.getUser();
        const message = `🕵️‍♂️ <b>Мой результат в Scam Hunter!</b>\n\n` +
                       `👤 Игрок: ${user.first_name}\n` +
                       `🏆 Очки: ${score}\n` +
                       `📊 Пройдено кейсов: ${casesCompleted}/100\n` +
                       `🎯 Точность: ${accuracy}%\n\n` +
                       `🔗 <a href="${BOT_CONFIG.webAppUrl}">Присоединяйся к игре!</a>`;
        
        this.tg.shareMessage(message);
    }
};
