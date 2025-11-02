"""
DialogueEngine - движок древовидных диалогов и принятия решений
"""

class DialogueEngine:
    def __init__(self, dialogue_tree: Dict[str, Any]):
        self.dialogue_tree = dialogue_tree
        self.current_node_id = dialogue_tree["start"]
        self.decision_path = []  # История принятых решений
        
    @property
    def current_node(self) -> Dict[str, Any]:
        return self.dialogue_tree["nodes"][self.current_node_id]
    
    def get_current_question(self) -> str:
        return self.current_node["question"]
    
    def get_available_choices(self) -> List[Dict[str, Any]]:
        return self.current_node.get("choices", [])
    
    def make_choice(self, choice_index: int) -> Dict[str, Any]:
        """Принять решение и перейти к следующему узлу"""
        choices = self.get_available_choices()
        
        if 0 <= choice_index < len(choices):
            choice = choices[choice_index]
            
            # Сохраняем историю решений
            self.decision_path.append({
                "question": self.get_current_question(),
                "choice": choice["text"],
                "timestamp": pygame.time.get_ticks()
            })
            
            result = {
                "feedback": choice.get("feedback", ""),
                "points": choice.get("points", 0),
                "is_final": choice.get("is_final", False),
                "correct": choice.get("correct", True)
            }
            
            # Переход к следующему узлу если не финальный
            next_node = choice.get("next_node")
            if next_node and not result["is_final"]:
                self.current_node_id = next_node
                
            return result
            
        return {"error": "Invalid choice"}
