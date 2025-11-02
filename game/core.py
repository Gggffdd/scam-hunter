"""
GameCore - основной класс игры, управляющий всем циклом
"""

class GameCore:
    def __init__(self):
        pygame.init()
        self.screen_width = 1000
        self.screen_height = 700
        self.screen = pygame.display.set_mode((self.screen_width, self.screen_height))
        pygame.display.set_caption("Scam Hunter - Detect. Decide. Dominate.")
        
        self.clock = pygame.time.Clock()
        self.running = True
        self.current_state = "main_menu"  # main_menu, playing, case_complete
        
        # Инициализация систем
        self.case_manager = CaseManager()
        self.player_profile = PlayerProfile()
        self.game_ui = GameUI(self.screen_width, self.screen_height)
        
        # Текущий активный кейс
        self.active_case = None
        self.selected_choice = None
