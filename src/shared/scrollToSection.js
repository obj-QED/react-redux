// Функция scrollToSection прокручивает страницу к указанному разделу с учетом указанного смещения
export const scrollToSection = (section, offset) => {
  // Находим элемент на странице по селектору
  let match = document.querySelector(section);

  // Проверяем, найден ли элемент
  if (match) {
    // Вычисляем смещение, заданное пользователем, или устанавливаем 0, если не задано
    const yOffset = offset || 0;

    // Получаем верхнюю координату элемента относительно видимой части страницы
    const elementTop = match.getBoundingClientRect().top + window.pageYOffset;

    // Проверяем, находится ли верхняя часть элемента достаточно высоко на странице
    if (elementTop > 200) {
      // Прокручиваем страницу к верхней части элемента с учетом смещения
      window.scroll({
        top: elementTop - yOffset,
        behavior: 'auto',
      });
    }
  }
};
