// Функция scrollToSection прокручивает блок .view к первому найденному элементу с указанным селектором с учетом указанного смещения
export const scrollToSection = (sectionSelector, offset) => {
  // Находим первый элемент внутри блока .view по селектору
  let match = document.querySelector('.view ' + sectionSelector);

  // Проверяем, найден ли элемент
  if (match) {
    // Вычисляем смещение, заданное пользователем, или устанавливаем 0, если не задано
    const yOffset = offset || 0;

    // Получаем верхнюю координату элемента относительно верхней границы блока .view
    const elementTop = match.getBoundingClientRect().top + document.querySelector('.view').scrollTop;

    // Прокручиваем блок .view к верхней части элемента с учетом смещения
    document.querySelector('.view').scrollTo({
      top: elementTop - yOffset,
      behavior: 'auto',
    });
  }
};
