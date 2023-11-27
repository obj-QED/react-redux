## React, Redux

Проект "Code Helpers" представляет собой инструментарий для облегчения написания кода, предоставляя полезные сниппеты, правила форматирования и команды для удобной разработки.

## Code Helpers

- Передаем notification таким способом

```bash
  {error && <Notification errorResponse={{ message: error }} />}
```

## Code Guide

### Порядок написания времени (date)

- Format:

```
  YYYY.MM.DD, HH:MM:SS
```

- Правила кода для SCSS
  Используем миксин для шрифтов:

```bash
  @include font(16, 16, 400, цвет);
```

- Правила кода запросов. Для HTTP-запросов используем только библиотеку axios. Пример базового API:

```bash
import { get, post, put, del } from 'src/api/baseApi';
```

- Дополнительные правила

  Для сетки используем миксин: @include flexbox();
  Для отступов используем миксин: @include pxToRem(16);
  Проверка файлов на соответствие стилю: yarn check-format || yarn format

## ВАЖНО React и прочее теперь импортировать не надо, в вебпаке настроил, чтобы на автомате подгружался

### Вместо React используем Preact

- Для хуков импортируем отсюда

```bash
import { useState, useEffect, useRef, useMemo, useCallback, useReducer, useContext } from 'preact/hooks';
```

- Для остальных функции импортируем отсюда

```bash
import { memo, Fragment, createPortal, forwardRef, Children } from 'preact/compat';
```

### Правила кода для scss

- Для font используем миксин

```bash
@include font(16, 16, 400, цвет)
```

### Правила кода запросов

- Используем только axios

```bash
базовый апи src/api/baseApi (используем необходимый метод)
```

- Для сетки используем миксин

```bash
@include flexbox();
```

- Для отступов используем миксин

```bash
@include pxToRem(16);
```

- Проверка файлов на соответствие стилю

```bash
yarn check-format || yarn format
```

## Команды

```bash
yarn  prettier      # автоматической форматирования файлов с расширением .js и .jsx в соответствии с конфигурацией .prettierrc.json.
yarn  lint          # Запускает ESLint для проверки кода в директории src/. Флаг --debug позволяет выводить дополнительную отладочную информацию.
yarn  lint:write    # Использует ESLint для проверки кода в директории src/, но с флагом --fix, который автоматически исправляет простые проблемы.
yarn  format        # последовательно запускает Prettier, затем ESLint для файлов с расширением .js и .jsx, и затем Stylelint для файлов SCSS с целью автоматического исправления.
yarn  check-format  # выполняет проверку форматирования (без исправлений) для файлов с расширением .js и .jsx, а затем проверяет стиль с помощью ESLint и Stylelint с флагом --quiet, чтобы не выводить лишний вывод.
yarn  pre-commit      # Запускает lint-staged (команда для проверки только измененных файлов) и затем тесты перед коммитом и перед отправкой (push) изменений в репозиторий.

lsof -i :3000     #  узнаем порт и через kill -9 сбрасываем
```

## Структура

```bash
build/       # Папка сборки (результат работы над проектом)
src/         # Исходники
  assets/    # Шрифты, Mixins, Style container
  component/ # Компоненты
  elements/  # Элементы как input, dropdown, Switcher и т.д.
  pages/     # Страницы проекта
  store/     # Служебные файлы redux
  shared/    # функции и утилиты
public/      # Исходники
  img/       # Общие для всех блоков изображения
  js/        # Общие js-файлы, в т.ч. точка сборки для webpack и общие модули
```
