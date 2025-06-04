from PIL import Image

def make_pixel_art(input_path, output_path, pixel_size=16):
    """
    input_path: шлях до оригінального PNG-файлу
    output_path: шлях для збереження піксель-арт зображення
    pixel_size: розмір пікселів у фінальній картинці (чим менше, тим детальніше)
    """
    # Відкрити зображення
    img = Image.open(input_path)

    # Зменшити зображення до меншої ширини (для ефекту піксель-арту)
    small_width = img.width // pixel_size
    small_height = img.height // pixel_size

    # Зменшити розмір
    img_small = img.resize((small_width, small_height), resample=Image.BILINEAR)

    # Збільшити зображення назад до оригінального розміру з інтерполяцією NEAREST
    result = img_small.resize(img.size, Image.NEAREST)

    # Зберегти
    result.save(output_path)
    print(f"Піксель-арт збережено як {output_path}")

# Приклад використання
make_pixel_art("input.png", "output_pixel_art.png", pixel_size=16)
