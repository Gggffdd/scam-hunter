"""
CaseManager - загрузка и управление кейсами мошенничества
"""

class CaseManager:
    def __init__(self):
        self.cases = []
        self.load_cases()
        
    def load_cases(self):
        """Загрузка кейсов из JSON файла"""
        try:
            with open('data/cases.json', 'r', encoding='utf-8') as f:
                cases_data = json.load(f)
                self.cases = [Case(case_data) for case_data in cases_data]
        except FileNotFoundError:
            # Создаем демо-кейсы если файл не найден
            self.cases = self.create_demo_cases()
    
    def get_case_by_difficulty(self, difficulty: str) -> Optional['Case']:
        """Получить случайный кейс по сложности"""
        available_cases = [case for case in self.cases 
                          if case.difficulty == difficulty and not case.completed]
        return random.choice(available_cases) if available_cases else None
