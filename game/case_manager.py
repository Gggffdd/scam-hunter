"""
CaseManager - загрузка и управление кейсами мошенничества
"""

import json
import random
from typing import List, Dict, Any, Optional

class Case:
    def __init__(self, case_data: Dict[str, Any]):
        self.id = case_data["id"]
        self.title = case_data["title"]
        self.description = case_data["description"]
        self.difficulty = case_data["difficulty"]
        self.dialogue_tree = case_data["dialogue_tree"]
        self.dialogue_engine = DialogueEngine(self.dialogue_tree)
        self.completed = False
        
    def get_current_question(self) -> str:
        return self.dialogue_engine.get_current_question()
    
    def get_choices(self) -> List[Dict]:
        return self.dialogue_engine.get_available_choices()
    
    def make_choice(self, choice_index: int) -> Dict[str, Any]:
        return self.dialogue_engine.make_choice(choice_index)

class CaseManager:
    def __init__(self):
        self.cases: List[Case] = []
        self.load_cases()
        
    def load_cases(self):
        """Загрузка кейсов из JSON файла"""
        try:
            with open('data/cases.json', 'r', encoding='utf-8') as f:
                cases_data = json.load(f)
                self.cases = [Case(case_data) for case_data in cases_data]
        except FileNotFoundError:
            print("Файл cases.json не найден. Создаем демо-кейсы...")
            self.cases = self.create_demo_cases()
    
    def create_demo_cases(self) -> List[Case]:
        """Создание демо-кейсов если файл не найден"""
        demo_cases = [
            {
                "id": "demo_001",
                "title": "Демо-кейс: Подозрительная предоплата",
                "description": "Тестовый кейс для демонстрации",
                "difficulty": "beginner",
                "dialogue_tree": {
                    "start": "node_1",
                    "nodes": {
                        "node_1": {
                            "question": "Клиент просит перевести предоплату на личную карту. Ваши действия?",
                            "choices": [
                                {
                                    "text": "Настаиваю на использовании гаранта",
                                    "feedback": "✅ Правильно! Всегда используйте защищенные способы оплаты.",
                                    "points": 10,
                                    "correct": True,
                                    "is_final": True
                                },
                                {
                                    "text": "Соглашаюсь на условия",
                                    "feedback": "❌ Рискованно! Перевод на личные кошельки небезопасен.",
                                    "points": 0,
                                    "correct": False,
                                    "is_final": True
                                }
                            ]
                        }
                    }
                }
            }
        ]
        return [Case(case_data) for case_data in demo_cases]
    
    def get_case_by_difficulty(self, difficulty: str) -> Optional[Case]:
        """Получить случайный кейс по сложности"""
        available_cases = [case for case in self.cases 
                          if case.difficulty == difficulty and not case.completed]
        return random.choice(available_cases) if available_cases else None
    
    def get_all_cases(self) -> List[Case]:
        """Получить все кейсы"""
        return self.cases
