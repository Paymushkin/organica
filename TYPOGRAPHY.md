# Типографика проекта

## Шрифты

### Основные шрифты
- **Inter** - основной шрифт для заголовков и интерфейса
- **PT Sans** - дополнительный шрифт для текста

### Подключенные начертания
- **Inter**: Regular (400), Medium (500), SemiBold (600), Bold (700)
- **PT Sans**: Regular (400), Bold (700)

## Размеры шрифтов (десктоп)

### Заголовки
- **H1**: 72px - главные заголовки
- **H2**: 40px - заголовки секций
- **H3**: 32px - подзаголовки
- **H4**: 24px - мелкие заголовки
- **H5, H6**: 20px - дополнительные заголовки

### Тексты
- **Большой текст**: 20px - важная информация
- **Обычный текст**: 16px - основной текст

## Высота строки
- **Tight**: 1.2 - для заголовков
- **Normal**: 1.5 - для обычного текста
- **Relaxed**: 1.6 - для длинного текста

## Вес шрифта
- **Light**: 300
- **Normal**: 400
- **Medium**: 500
- **SemiBold**: 600
- **Bold**: 700

## Контейнер
- **Максимальная ширина**: 1200px
- **Отступы**: 16px (var(--spacing-md))

## Использование в CSS

```scss
// Заголовок H1
.heading-1 {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

// Обычный текст
.text-normal {
  font-family: var(--font-family-primary);
  font-size: var(--font-size-text);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-normal);
  color: var(--color-text-primary);
}

// Контейнер
.container {
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding-left: var(--container-padding);
  padding-right: var(--container-padding);
}
```

## Адаптивность

На мобильных устройствах размеры шрифтов автоматически уменьшаются:
- H1: 72px → 48px
- H2: 40px → 32px
- H3: 32px → 24px
- H4: 24px → 20px
- Большой текст: 20px → 18px
- Обычный текст: 16px → 14px

## Примеры применения

### Заголовки секций
```scss
.section-title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}
```

### Описания
```scss
.description {
  font-size: var(--font-size-text-large);
  line-height: var(--line-height-relaxed);
  color: var(--color-text-secondary);
}
```

### Кнопки
```scss
.btn {
  font-size: var(--font-size-text);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-primary);
}
```








