"""
PlayerProfile - управление профилем игрока, прогрессом и статистикой
"""

class PlayerProfile:
    def __init__(self):
        self.total_score = 0
        self.cases_solved = 0
        self.correct_decisions = 0
        self.wrong_decisions = 0
        self.current_streak = 0
        self.max_streak = 0
        self.unlocked_difficulties = ["beginner"]  # beginner, intermediate, expert, master
        
    def add_case_result(self, score: int, correct_choices: int, total_choices: int):
        """Обновить статистику после завершения кейса"""
        self.total_score += score
        self.cases_solved += 1
        self.correct_decisions += correct_choices
        self.wrong_decisions += (total_choices - correct_choices)
        
        # Обновляем серию правильных решений
        if correct_choices == total_choices:
            self.current_streak += 1
            self.max_streak = max(self.max_streak, self.current_streak)
        else:
            self.current_streak = 0
            
        # Проверяем открытие новых уровней сложности
        self.check_difficulty_unlock()
    
    def check_difficulty_unlock(self):
        """Проверка условий для открытия новых уровней сложности"""
        if self.cases_solved >= 3 and "intermediate" not in self.unlocked_difficulties:
            self.unlocked_difficulties.append("intermediate")
        if self.cases_solved >= 10 and "expert" not in self.unlocked_difficulties:
            self.unlocked_difficulties.append("expert")
        if self.max_streak >= 5 and "master" not in self.unlocked_difficulties:
            self.unlocked_difficulties.append("master")
