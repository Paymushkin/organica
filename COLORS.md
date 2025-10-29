# Цветовая палитра проекта

## Основные цвета

### Зеленые оттенки
- **#418F55** - основной цвет элементов (`--color-primary`)
- **#154B3E** - темный зеленый (`--color-primary-dark`)
- **#53B053** - светло зеленый (`--color-primary-light`)
- **rgba(42, 111, 43, 0.60)** - полупрозрачный зеленый (`--color-primary-transparent`)
- **rgba(65, 143, 85, 0.1)** - самый прозрачный зеленый (`--color-primary-light-transparent`)

### Фоновые цвета
- **rgba(245, 255, 249, 1)** - фон страницы (`--color-bg-primary`)
- **#ffffff** - белый фон (`--color-bg-secondary`)

### Текстовые цвета
- **#000000** - черный текст (`--color-text-primary`)
- **#E7EBEA** - дополнительный цвет шрифта (`--color-text-secondary`)

### Цвета границ
- **#2A6F2B** - основной цвет бордера (`--color-border`)
- **rgba(42, 111, 43, 0.40)** - полупрозрачный бордер (`--color-border-transparent`)
- **#E7EBEA** - светлый бордер (`--color-border-light`)
- **#154B3E** - темный бордер (`--color-border-dark`)

## Радиусы закругления

- **4px** - маленький радиус (`--radius-sm`)
- **8px** - средний радиус (`--radius-md`)
- **20px** - большой радиус (`--radius-lg`)
- **50%** - полное закругление (`--radius-full`)

## Использование в CSS

```scss
// Основной цвет
.element {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  border-radius: var(--radius-md);
}

// Прозрачный фон
.overlay {
  background: var(--color-primary-transparent);
  border-radius: var(--radius-lg);
}

// Темный вариант
.dark-element {
  background: var(--color-primary-dark);
  color: var(--color-text-inverse);
  border-radius: var(--radius-sm);
}

// Границы
.border-main {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.border-transparent {
  border: 1px solid var(--color-border-transparent);
  border-radius: var(--radius-md);
}
```

## Примеры применения

### Кнопки
- Основная кнопка: `--color-primary` + `--radius-sm`
- Вторичная кнопка: `--color-primary-light` + `--radius-md`
- Темная кнопка: `--color-primary-dark` + `--radius-lg`

### Карточки
- Обычная карточка: `--color-bg-primary` + `--radius-md`
- Прозрачная карточка: `--color-primary-light-transparent` + `--radius-lg`

### Фоны секций
- Основной фон: `--color-bg-primary`
- Прозрачный фон: `--color-primary-transparent`
