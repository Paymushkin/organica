# Иконки и логотипы

## Структура

Все SVG иконки преобразованы в Pug миксины и организованы в папке `src/pug/icons/`:

```
src/pug/icons/
├── index.pug              # Главный файл для подключения всех иконок
├── icon-category.pug      # Иконка категории
├── icon-close.pug         # Иконка закрытия
├── icon-home.pug          # Иконка дома
├── icon-phone.pug         # Иконка телефона
├── icon-developer-guide.pug # Иконка руководства разработчика
├── icon-documents.pug     # Иконка документов
├── icon-folder-match.pug  # Иконка папки с совпадением
├── icon-groups.pug        # Иконка групп
├── icon-people.pug        # Иконка людей
├── icon-partner-exchange.pug # Иконка обмена партнеров
├── icon-pills.pug         # Иконка таблеток
├── icon-transportation.pug # Иконка транспорта
└── logos/
    └── logo-bella.pug     # Логотип Bella
```

## Использование

### Подключение в Pug

```pug
// Подключение всех иконок
include icons/index

// Использование иконки
+icon-home('24')
+icon-phone('32')
+icon-close('16')

// Использование логотипа
+logo-bella('175', '48')
```

### Параметры

Все иконки принимают параметр `size` для размера (по умолчанию 24px):
- `+icon-home()` - размер по умолчанию (24px)
- `+icon-home('32')` - размер 32px
- `+icon-home('16')` - размер 16px

Логотипы принимают параметры `width` и `height`:
- `+logo-bella()` - размер по умолчанию (175x48)
- `+logo-bella('150', '40')` - кастомный размер

## Стилизация

### Базовые классы

```scss
// Размеры
.icon--sm { width: 16px; height: 16px; }
.icon--md { width: 24px; height: 24px; }
.icon--lg { width: 32px; height: 32px; }
.icon--xl { width: 48px; height: 48px; }

// Цвета
.icon--primary { color: var(--color-primary); }
.icon--secondary { color: var(--color-text-secondary); }
.icon--white { color: var(--color-text-inverse); }

// Эффекты
.icon--hover { cursor: pointer; }
.icon--spin { animation: spin 1s linear infinite; }
.icon--pulse { animation: pulse 2s infinite; }
```

### Примеры использования

```pug
// Иконка с размерами и цветом
+icon-home('24').icon.icon--md.icon--primary

// Иконка с эффектами
+icon-close('16').icon.icon--sm.icon--hover

// Логотип с размерами
+logo-bella('150', '40').logo.logo--md
```

## Доступные иконки

### Основные иконки
- `icon-category` - категории
- `icon-close` - закрытие
- `icon-home` - дом/главная
- `icon-phone` - телефон
- `icon-developer-guide` - руководство разработчика
- `icon-documents` - документы
- `icon-folder-match` - папка с совпадением
- `icon-groups` - группы
- `icon-people` - люди
- `icon-partner-exchange` - обмен партнеров
- `icon-pills` - таблетки
- `icon-transportation` - транспорт

### Логотипы
- `logo-bella` - логотип Bella

## Особенности

1. **Текущий цвет**: Все иконки используют `fill="currentColor"`, что позволяет легко менять цвет через CSS
2. **Масштабируемость**: SVG иконки масштабируются без потери качества
3. **Доступность**: Все иконки имеют семантические имена и могут быть легко стилизованы
4. **Производительность**: Иконки встроены в HTML, что исключает дополнительные HTTP-запросы

## Добавление новых иконок

1. Создайте новый `.pug` файл в папке `src/pug/icons/`
2. Добавьте миксин с SVG содержимым
3. Подключите в `index.pug`
4. Добавьте стили в `src/scss/examples/_icons.scss` при необходимости


















