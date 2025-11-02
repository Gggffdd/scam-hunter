"""
Scam Hunter - Главный запускной файл игры
"""

import pygame
import sys
from game.core import GameCore

def main():
    """Точка входа в приложение"""
    try:
        game = GameCore()
        game.run()
    except Exception as e:
        print(f"Ошибка запуска игры: {e}")
        pygame.quit()
        sys.exit(1)

if __name__ == "__main__":
    main()
