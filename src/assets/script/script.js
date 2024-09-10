// Функция onClose(close) предназначена для обработки событий закрытия игры или контейнера.
// Она устанавливает обработчик onmessage на глобальный объект window, который вызывает функцию close()
// при получении определенных сообщений или условий.

export function onClose(close) {
  // Устанавливаем обработчик события onmessage
  window.onmessage = function (event) {
    // Добавляем обработчик события message
    window.addEventListener(
      'message',
      function (a) {
        // Проверяем условия для закрытия
        if (event.data == 'closeGame' || event.data == 'close' || event.data == 'notifyCloseContainer' || (event.data.indexOf && event.data.indexOf('GAME_MODE:LOBBY') >= 0)) {
          // Вызываем функцию close() при выполнении условий
          close();
        }
      },
      { once: true },
      false,
    );
  };
}

// Функция fullScreen() добавляет обработчик клика, который включает полноэкранный режим при каждом клике.

export function fullScreen() {
  // Вложенная функция toggleFullScreen(isFull) отвечает за включение и выключение полноэкранного режима.
  function toggleFullScreen(isFull) {
    // Проверяем текущий режим экрана и включаем/выключаем полноэкранный режим соответственно
    if ((document.fullScreenElement && document.fullScreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
      if (isFull === false) {
        return;
      }
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen();
      }
    } else {
      if (isFull === true) {
        return;
      }
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  // Добавляем обработчик клика при загрузке DOM
  document.addEventListener('DOMContentLoaded', function () {
    document.addEventListener('click', function (event) {
      toggleFullScreen(true);
    });
  });
}

// Функция windowResize() предназначена для обработки событий изменения размеров окна.
// Она отслеживает изменения ширины и высоты окна, а также определяет ряд условий для корректной
// работы на различных устройствах и браузерах.

export function windowResize() {
  // Получаем текущие значения ширины и высоты окна
  var w = window.innerWidth;
  var h = window.innerHeight;

  // Переменная isFullScreen используется для отслеживания полноэкранного режима
  var isFullScreen = false;

  // Определяем тип устройства и браузера для дополнительных проверок
  var ua = window.navigator.userAgent,
    iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i),
    webkit = !!ua.match(/WebKit/i),
    iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

  // Проверка ориентации экрана и наличия изменений
  if (window.orientation !== undefined && ((w > h && window.orientation == 0) || (w < h && window.orientation != 0))) {
    // Если есть изменения, запускаем функцию windowResize() через 1 секунду
    setTimeout(function () {
      windowResize();
    }, 1000);
    return;
  }

  // Получаем элемент с классом 'device-rotate' для работы с ориентацией мобильных устройств
  var deviceRotateElement = document.querySelector('.device-rotate');

  // Добавляем/удаляем класс 'active' в зависимости от ориентации и типа устройства
  if ((device.mobile() || device.tablet()) && window.orientation == 0) {
    deviceRotateElement?.classList.add('active');
  } else {
    deviceRotateElement?.classList.remove('active');
  }

  // Добавляем атрибут 'orientation' к body в зависимости от ориентации экрана на мобильных устройствах
  if (device.mobile() || device.tablet()) {
    document.body.setAttribute('orientation', window.orientation == 0 ? 'portrait' : 'landscape');
  }

  // Дополнительные проверки для iOS и Safari
  if (device.ios() && !device.desktop() && !device.tablet() && iOSSafari) {
    var bodyElement = document.body;
    var htmlBodyElement = document.documentElement || document.body.parentNode;

    // Добавляем/удаляем класс 'core-scrollcheck' в зависимости от условий
    if (bodyElement.classList.contains('mobile-game') && !bodyElement.classList.contains('game-without-scrollcheck')) {
      bodyElement.classList.add('core-scrollcheck');
    } else {
      bodyElement.classList.remove('core-scrollcheck');
    }

    // Проверяем, находится ли экран в полноэкранном режиме
    if (window.screen.width === h && window.orientation != 0) {
      isFullScreen = true;
    } else {
      isFullScreen = false;
    }

    // Управляем классами для стилей, связанных с полноэкранным режимом
    if (!isFullScreen && window.orientation != 0 && !bodyElement.classList.contains('game-without-scrollcheck') && bodyElement.classList.contains('mobile-game')) {
      htmlBodyElement.classList.remove('fullscreenSafari');
      htmlBodyElement.classList.add('notFullscreenSafari');
    } else if (!bodyElement.classList.contains('game-without-scrollcheck') && bodyElement.classList.contains('mobile-game')) {
      htmlBodyElement.classList.add('fullscreenSafari');
      htmlBodyElement.classList.remove('notFullscreenSafari');
    }
  }

  // Добавляем обработчик события resize для отслеживания изменений размеров окна
  window.addEventListener('resize', function () {
    // Избегаем рекурсивного вызова windowResize, если размеры не изменились
    var newW = window.innerWidth;
    var newH = window.innerHeight;
    if (w !== newW || h !== newH) {
      // Вызываем функцию windowResize() при изменении размеров окна
      windowResize();
    }
  });
}

// Функция syncWindowHeightFunc() предназначена для синхронизации высоты окна браузера при открытии модального окна.
// Она также управляет классами для отключения/включения скролла на iOS 15.

export function syncWindowHeightFunc() {
  // Переменная isIphone используется для определения, является ли устройство iPhone
  var isIphone = /iPhone/i.test(navigator.userAgent);

  // Переменная isIOS15 используется для определения, является ли устройство iPhone с версией iOS 15 и выше
  var isIOS15 = isIphone && parseInt(navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1], 10) >= 15;

  // Функция syncWindowHeight() синхронизирует высоту окна браузера при открытии модального окна
  var syncWindowHeight = function () {
    // Сохраняем текущую позицию скролла, если она не равна 0
    if (pageYOffset != 0) {
      localStorage.pageScroll = Math.round(pageYOffset);
    }

    // Управление классами для отключения/включения скролла на устройствах iOS 15
    if (isIphone && isIOS15) {
      document.querySelector('body').classList.add('disable-scroll');
      document.querySelector('html').classList.add('disable-scroll');
    } else {
      document.querySelector('body').classList.remove('disable-scroll');
      document.querySelector('html').classList.remove('disable-scroll');
    }

    // Установка CSS-переменной с высотой окна
    setTimeout(function () {
      document.documentElement.style.setProperty('--window-inner-height', window.innerHeight + 'px');
    }, 100);
  };

  // Вызываем функцию при открытии модального окна и навешиваем обработчик на событие ресайза
  syncWindowHeight();
  window.addEventListener('resize', syncWindowHeight);
}
