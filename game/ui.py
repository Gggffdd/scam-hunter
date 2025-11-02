"""
GameUI - система пользовательского интерфейса и визуализации
"""

class GameUI:
    def __init__(self, screen_width: int, screen_height: int):
        self.screen_width = screen_width
        self.screen_height = screen_height
        
        # Цветовая схема
        self.COLORS = {
            'bg_primary': (240, 240, 245),
            'bg_secondary': (255, 255, 255),
            'text_primary': (30, 30, 30),
            'text_secondary': (100, 100, 100),
            'accent_green': (76, 175, 80),
            'accent_red': (244, 67, 54),
            'accent_blue': (70, 130, 230),
            'accent_orange': (255, 152, 0),
            'button_normal': (70, 130, 230),
            'button_hover': (50, 110, 210),
            'button_disabled': (200, 200, 200)
        }
        
        # Шрифты
        self.fonts = {
            'title': pygame.font.Font(None, 42),
            'header': pygame.font.Font(None, 32),
            'body': pygame.font.Font(None, 24),
            'small': pygame.font.Font(None, 20)
        }
        
        # UI элементы
        self.buttons = {}
        
    def draw_main_menu(self, screen, player_profile: 'PlayerProfile'):
        """Отрисовка главного меню"""
        screen.fill(self.COLORS['bg_primary'])
        
        # Заголовок игры
        title = self.fonts['title'].render("SCAM HUNTER", True, self.COLORS['text_primary'])
        subtitle = self.fonts['body'].render("Detect. Decide. Dominate.", True, self.COLORS['text_secondary'])
        
        screen.blit(title, (self.screen_width // 2 - title.get_width() // 2, 100))
        screen.blit(subtitle, (self.screen_width // 2 - subtitle.get_width() // 2, 160))
        
        # Кнопки меню
        button_y = 250
        button_height = 50
        button_width = 300
        
        self.buttons['start'] = self.draw_button(
            screen, "Начать охоту", 
            self.screen_width // 2 - button_width // 2, button_y,
            button_width, button_height
        )
        
        self.buttons['difficulty'] = self.draw_button(
            screen, f"Уровень: {player_profile.unlocked_difficulties[-1].title()}", 
            self.screen_width // 2 - button_width // 2, button_y + 70,
            button_width, button_height
        )
        
        # Статистика
        stats_y = 400
        stats_text = [
            f"Решено кейсов: {player_profile.cases_solved}",
            f"Общий счёт: {player_profile.total_score}",
            f"Точность: {self.calculate_accuracy(player_profile)}%",
            f"Рекордная серия: {player_profile.max_streak}"
        ]
        
        for i, text in enumerate(stats_text):
            stat_surface = self.fonts['body'].render(text, True, self.COLORS['text_secondary'])
            screen.blit(stat_surface, (self.screen_width // 2 - stat_surface.get_width() // 2, stats_y + i * 30))
    
    def draw_case_interface(self, screen, case: 'Case', player_profile: 'PlayerProfile'):
        """Отрисовка интерфейса кейса"""
        screen.fill(self.COLORS['bg_primary'])
        
        # Шапка с информацией
        header_rect = pygame.Rect(20, 20, self.screen_width - 40, 80)
        pygame.draw.rect(screen, self.COLORS['bg_secondary'], header_rect, border_radius=10)
        
        case_title = self.fonts['header'].render(case.title, True, self.COLORS['text_primary'])
        case_diff = self.fonts['small'].render(f"Сложность: {case.difficulty.upper()}", True, self.COLORS['text_secondary'])
        
        screen.blit(case_title, (40, 40))
        screen.blit(case_diff, (40, 70))
        
        # Область вопроса
        question_rect = pygame.Rect(20, 120, self.screen_width - 40, 120)
        pygame.draw.rect(screen, self.COLORS['bg_secondary'], question_rect, border_radius=10)
        
        question_text = self.wrap_text(case.get_current_question(), self.fonts['body'], self.screen_width - 80)
        for i, line in enumerate(question_text):
            screen.blit(line, (40, 140 + i * 25))
        
        # Область вариантов ответа
        choices = case.get_choices()
        choice_y = 260
        self.buttons.clear()
        
        for i, choice in enumerate(choices):
            button = self.draw_choice_button(
                screen, choice["text"],
                20, choice_y + i * 70,
                self.screen_width - 40, 60
            )
            self.buttons[f"choice_{i}"] = button
        
        # Панель статистики игрока
        self.draw_player_stats(screen, player_profile, 20, self.screen_height - 80)
    
    def draw_choice_button(self, screen, text: str, x: int, y: int, width: int, height: int) -> pygame.Rect:
        """Отрисовка кнопки выбора"""
        button_rect = pygame.Rect(x, y, width, height)
        mouse_pos = pygame.mouse.get_pos()
        
        # Определяем цвет кнопки
        if button_rect.collidepoint(mouse_pos):
            color = self.COLORS['button_hover']
        else:
            color = self.COLORS['button_normal']
        
        pygame.draw.rect(screen, color, button_rect, border_radius=8)
        pygame.draw.rect(screen, self.COLORS['text_primary'], button_rect, 2, border_radius=8)
        
        # Текст кнопки
        button_text = self.wrap_text(text, self.fonts['body'], width - 20)
        text_y = y + (height - len(button_text) * 25) // 2
        
        for i, line in enumerate(button_text):
            screen.blit(line, (x + 10, text_y + i * 25))
        
        return button_rect
    
    def draw_button(self, screen, text: str, x: int, y: int, width: int, height: int) -> pygame.Rect:
        """Отрисовка обычной кнопки"""
        return self.draw_choice_button(screen, text, x, y, width, height)
    
    def draw_player_stats(self, screen, player_profile: 'PlayerProfile', x: int, y: int):
        """Отрисовка статистики игрока"""
        stats_rect = pygame.Rect(x, y, 300, 60)
        pygame.draw.rect(screen, self.COLORS['bg_secondary'], stats_rect, border_radius=10)
        
        score_text = self.fonts['body'].render(f"Счёт: {player_profile.total_score}", True, self.COLORS['text_primary'])
        streak_text = self.fonts['small'].render(f"Серия: {player_profile.current_streak}", True, self.COLORS['accent_orange'])
        
        screen.blit(score_text, (x + 10, y + 10))
        screen.blit(streak_text, (x + 10, y + 35))
    
    def wrap_text(self, text: str, font, max_width: int) -> List[pygame.Surface]:
        """Перенос текста по словам"""
        words = text.split(' ')
        lines = []
        current_line = []
        
        for word in words:
            test_line = ' '.join(current_line + [word])
            test_surface = font.render(test_line, True, self.COLORS['text_primary'])
            
            if test_surface.get_width() <= max_width:
                current_line.append(word)
            else:
                lines.append(' '.join(current_line))
                current_line = [word]
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return [font.render(line, True, self.COLORS['text_primary']) for line in lines]
    
    def calculate_accuracy(self, player_profile: 'PlayerProfile') -> float:
        """Расчет точности принятия решений"""
        total = player_profile.correct_decisions + player_profile.wrong_decisions
        return round((player_profile.correct_decisions / total) * 100, 1) if total > 0 else 0.0
