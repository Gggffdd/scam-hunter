"""
GameCore - основной класс игры, управляющий всем циклом
"""

import pygame
import sys
import random
from typing import Optional
from game.case_manager import CaseManager
from game.dialogue_system import DialogueEngine
from game.player import PlayerProfile
from game.ui import GameUI

class GameCore:
    def __init__(self):
        pygame.init()
        self.screen_width = 1000
        self.screen_height = 700
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption("Scam Hunter - Detect. Decide. Dominate.")
        
        self.clock = pygame.time.Clock()
        self.running = True
        
        # Состояния игры
        self.STATES = {
            "MAIN_MENU": "main_menu",
            "PLAYING": "playing", 
            "CASE_COMPLETE": "case_complete",
            "FEEDBACK": "feedback"
        }
        self.current_state = self.STATES["MAIN_MENU"]
        
        # Инициализация систем
        self.case_manager = CaseManager()
        self.player_profile = PlayerProfile()
        self.game_ui = GameUI(self.screen_width, self.screen_height)
        
        # Текущий активный кейс
        self.active_case: Optional['Case'] = None
        self.feedback_data: Optional[dict] = None
        self.feedback_timer: int = 0
        
    def handle_events(self):
        """Обработка всех событий игры"""
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False
                
            elif event.type == pygame.KEYDOWN:
                self.handle_keydown(event)
                
            elif event.type == pygame.MOUSEBUTTONDOWN:
                self.handle_mouse_click()
    
    def handle_keydown(self, event):
        """Обработка нажатий клавиш"""
        if event.key == pygame.K_ESCAPE:
            if self.current_state == self.STATES["PLAYING"]:
                self.current_state = self.STATES["MAIN_MENU"]
                self.active_case = None
            else:
                self.running = False
                
        elif event.key == pygame.K_r and self.current_state == self.STATES["FEEDBACK"]:
            # Перезапуск кейса после фидбека
            self.start_new_case()
    
    def handle_mouse_click(self):
        """Обработка кликов мыши"""
        mouse_pos = pygame.mouse.get_pos()
        
        if self.current_state == self.STATES["MAIN_MENU"]:
            self.handle_main_menu_click(mouse_pos)
            
        elif self.current_state == self.STATES["PLAYING"]:
            self.handle_gameplay_click(mouse_pos)
            
        elif self.current_state == self.STATES["FEEDBACK"]:
            self.handle_feedback_click(mouse_pos)
    
    def handle_main_menu_click(self, mouse_pos):
        """Обработка кликов в главном меню"""
        if self.game_ui.buttons.get('start') and self.game_ui.buttons['start'].collidepoint(mouse_pos):
            self.start_new_case()
            
        elif self.game_ui.buttons.get('difficulty') and self.game_ui.buttons['difficulty'].collidepoint(mouse_pos):
            self.cycle_difficulty()
    
    def handle_gameplay_click(self, mouse_pos):
        """Обработка кликов во время геймплея"""
        if not self.active_case:
            return
            
        # Проверяем клики по кнопкам выбора
        for button_key, button_rect in self.game_ui.buttons.items():
            if button_rect.collidepoint(mouse_pos) and button_key.startswith("choice_"):
                choice_index = int(button_key.split("_")[1])
                self.process_player_choice(choice_index)
                break
    
    def handle_feedback_click(self, mouse_pos):
        """Обработка кликов в режиме фидбека"""
        # Автопереход через 3 секунды или по клику
        self.start_new_case()
    
    def process_player_choice(self, choice_index: int):
        """Обработка выбора игрока"""
        if not self.active_case:
            return
            
        result = self.active_case.make_choice(choice_index)
        self.feedback_data = result
        
        if result.get("is_final", False):
            # Кейс завершен
            self.complete_case(result)
        else:
            # Продолжаем кейс
            self.current_state = self.STATES["PLAYING"]
    
    def start_new_case(self):
        """Начать новый случайный кейс"""
        # Выбираем сложность на основе прогресса игрока
        available_difficulties = self.player_profile.unlocked_difficulties
        selected_difficulty = random.choice(available_difficulties)
        
        self.active_case = self.case_manager.get_case_by_difficulty(selected_difficulty)
        
        if self.active_case:
            self.current_state = self.STATES["PLAYING"]
            self.feedback_data = None
        else:
            # Если кейсов нет - возвращаем в меню
            self.current_state = self.STATES["MAIN_MENU"]
    
    def complete_case(self, result: dict):
        """Завершение кейса и обновление статистики"""
        # Рассчитываем очки за кейс
        base_points = result.get("points", 0)
        streak_bonus = self.player_profile.current_streak * 2
        total_points = base_points + streak_bonus
        
        # Обновляем статистику игрока
        correct_choices = 1 if result.get("correct", False) else 0
        total_choices = 1  # В упрощенной версии
        
        self.player_profile.add_case_result(total_points, correct_choices, total_choices)
        self.active_case.completed = True
        
        # Показываем фидбэк
        self.feedback_data = result
        self.feedback_data["total_points"] = total_points
        self.feedback_data["streak_bonus"] = streak_bonus
        
        self.current_state = self.STATES["FEEDBACK"]
        self.feedback_timer = pygame.time.get_ticks()
    
    def cycle_difficulty(self):
        """Циклическое переключение сложности"""
        difficulties = self.player_profile.unlocked_difficulties
        current_index = difficulties.index(self.player_profile.unlocked_difficulties[-1])
        next_index = (current_index + 1) % len(difficulties)
        
        # В реальной реализации здесь бы менялась сложность
        # Сейчас просто демонстрация функционала UI
    
    def update(self):
        """Обновление состояния игры"""
        if self.current_state == self.STATES["FEEDBACK"]:
            # Автоматический переход через 3 секунды
            current_time = pygame.time.get_ticks()
            if current_time - self.feedback_timer > 3000:
                self.start_new_case()
    
    def render(self):
        """Отрисовка игры"""
        self.screen.fill(self.game_ui.COLORS['bg_primary'])
        
        if self.current_state == self.STATES["MAIN_MENU"]:
            self.game_ui.draw_main_menu(self.screen, self.player_profile)
            
        elif self.current_state == self.STATES["PLAYING"] and self.active_case:
            self.game_ui.draw_case_interface(self.screen, self.active_case, self.player_profile)
            
        elif self.current_state == self.STATES["FEEDBACK"] and self.feedback_data:
            self.draw_feedback_screen()
        
        pygame.display.flip()
    
    def draw_feedback_screen(self):
        """Отрисовка экрана с фидбэком"""
        feedback_rect = pygame.Rect(100, 100, self.screen_width - 200, self.screen_height - 200)
        pygame.draw.rect(self.screen, self.game_ui.COLORS['bg_secondary'], feedback_rect, border_radius=15)
        
        # Заголовок результата
        result_color = self.game_ui.COLORS['accent_green'] if self.feedback_data.get('correct') else self.game_ui.COLORS['accent_red']
        result_text = "ПРАВИЛЬНО!" if self.feedback_data.get('correct') else "НУЖНО БЫЛО ЛУЧШЕ"
        
        title = self.game_ui.fonts['header'].render(result_text, True, result_color)
        self.screen.blit(title, (self.screen_width // 2 - title.get_width() // 2, 150))
        
        # Фидбэк
        feedback_text = self.feedback_data.get('feedback', '')
        wrapped_feedback = self.game_ui.wrap_text(feedback_text, self.game_ui.fonts['body'], self.screen_width - 300)
        
        for i, line in enumerate(wrapped_feedback):
            self.screen.blit(line, (self.screen_width // 2 - line.get_width() // 2, 220 + i * 30))
        
        # Очки
        points_text = self.game_ui.fonts['body'].render(
            f"Очки: +{self.feedback_data.get('total_points', 0)} "
            f"(бонус серии: +{self.feedback_data.get('streak_bonus', 0)})", 
            True, self.game_ui.COLORS['text_primary']
        )
        self.screen.blit(points_text, (self.screen_width // 2 - points_text.get_width() // 2, 350))
        
        # Инструкция
        instruction = self.game_ui.fonts['small'].render(
            "Кликните или подождите 3 секунды для следующего кейса...",
            True, self.game_ui.COLORS['text_secondary']
        )
        self.screen.blit(instruction, (self.screen_width // 2 - instruction.get_width() // 2, 450))
    
    def run(self):
        """Главный игровой цикл"""
        while self.running:
            self.handle_events()
            self.update()
            self.render()
            self.clock.tick(60)
        
        pygame.quit()
        sys.exit()
