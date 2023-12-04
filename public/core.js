function Core() {
  this.init = function (params) {
    var url = document.location.href;
    this.page = url.substring(url.lastIndexOf('/') + 1, url.indexOf('?') == -1 ? url.length : url.indexOf('?'));
    if (this.page == '') {
      this.page = 'index.php';
    }

    if (!params) {
      params = {};
    }

    if ((!window.config && params.page) || this.initialized) {
      if (params.page) {
        config = { page: params.page };
      }
      config = this.query({ config: true });
      config.system.authorized = localStorage.getItem('token') ? true : false;
    } else {
      config.system.authorized = localStorage.getItem('token') ? true : false;
    }

    if (!this.initialized) {
      this.instantUpdate = params.instantUpdate ? true : false;
      if (config.mobileUrl && device.mobile()) {
        window.location.href = config.mobileUrl;
      }
      this.getUrlVars();
      this.widthMode(config.widthMode);

      //favorite games РІ getgamelist

      this.functions = { changePage: {}, reloadPage: [], drawGameList: [], preload: [] };
      this.elements = { jackpots: [], news: [], bonuses: [] };
      this.odometers = {};

      if (config.tickets) {
        this.ticket = { count: 0 };
      }

      var _this = this;

      this.addPushFunction('drawGameList', 'gameList');
      this.addPushFunction('reloadPage', 'terminal');
      this.addPushFunction('preload', 'preloadInfo');

      this.elements.news.push = function (elem) {
        this[this.length] = elem;
        $(elem).addClass('core-news');
        _this.newsElementRotate(this.length - 1);
      };

      this.elements.bonuses.push = function (elem, notLoadTemplate) {
        //this[this.length]={element: elem,timers: {'hours':{},'wager':{},'wheel':{},'wager_period':{}}};
        this[this.length] = { element: elem };
        if (!notLoadTemplate) {
          var html = $(elem).html();
          $(elem).load('/' + _this.corePath + '/template/bonuses-information.tpl', function () {
            $(elem).addClass('core-bonuses-info');
            $(elem).prepend(html);
            $(elem + ' .bonuses-button').click(function () {
              $(elem).toggleClass('active');
              if ($(elem).hasClass('active')) _this.reloadPage(true);
            });
            _this.reloadPage();
          });
        } else {
          _this.reloadPage();
        }
      };

      this.elements.jackpots.push = function (elem) {
        if (elem.odometer) elem.disableOdometer = false;
        this[this.length] = elem;
        _this.jackpotsDraw();
      };
      if (!config.disablePreloadImages) {
        $(window).load(function () {
          setTimeout(function () {
            _this.preloadImages();
          }, 100);
        });
      }

      // this.elements.tournaments.push=function(elem, notLoadTemplate) {
      //     if (!notLoadTemplate) {
      //         var html=$(elem).html();
      //         $(elem).load('/'+_this.corePath+"/template/tournaments.tpl",function() {
      //             _this.tournamentsHandler();
      //             _this.reloadPage();
      //         })
      //     } else {
      //         _this.reloadPage();
      //     }
      // }

      window.close = function () {
        _this.closeGame();
      };
      window.gclose = window.close;

      $(window).resize(function () {
        _this.windowResize();
      });
      $(window).on('orientationchange', function () {
        _this.windowResize();
      });
      window.addEventListener(
        'popstate',
        function (e) {
          if (_this.gameInfo) {
            _this.closeGame();
          }
          if ($('.wheel').hasClass('active')) {
            _this.closeWheel();
          }
          if ($('.jackpot-win').hasClass('active')) {
            _this.jackpotWinClose();
          }
        },
        false,
      );
      /*window.addEventListener("hashchange", function() {
                console.log('lol');
                _this.getUrlVars();
                if (_this.gameInfo && !(_this.get.name)) {
                    _this.closeGame();
                }
            }, false);*/
      if (device.mobile() || device.tablet()) {
        $(document).click(() => {
          if (config.system.authorized) {
            this.toggleFullScreen(true);
          }
        });
      }

      this.initialized = true;

      $(document).ready(function () {
        if (device.ios() && config.IOSScrollCheck) {
          _this.IOSScrollChecker();
        }

        if (config.system.authorized) {
          $('body').addClass('authorized');

          if (!config.cleanUrl) {
            var p = ['p', 'u', 'id', 'password'],
              clean_uri = location.protocol + '//' + location.host + location.pathname,
              url = document.location.href,
              params = url.split('?')[1].split('&');

            params = params.filter((param) => {
              return p.indexOf(param.split('=')[0]) < 0;
            });

            setTimeout(() => {
              window.history.pushState({}, document.title, clean_uri + '?' + params.join('&'));
            }, 0);
          }
        }

        //if (config.cleanUrl) {
        //    var clean_url = location.protocol + "//" + location.host + location.pathname.replace(_this.page, '');
        //
        //    setTimeout(()=>{
        //        window.history.pushState({}, document.title, clean_url)
        //    },0);
        //}

        _this.windowResize();

        if (localStorage.u && localStorage.p) {
          var u = localStorage.u;
          var p = localStorage.p;
          localStorage.clear('u');
          localStorage.clear('p');
          _this.logoutReloadTimeout = setTimeout(function () {
            _this.get.u = u;
            _this.get.p = p;
            _this.getReload();
            window.location.reload();
          }, 4000);
        }

        _this.showLogoutError();

        if (_this.get.error) {
          alert(_this.get.error.replace(/%20/g, ' '));
          delete _this.get.error;
          _this.getReload();
        }

        if (_this.get.u && _this.get.p && !config.system.authorized) {
          if (localStorage.logout) {
            localStorage.removeItem('logout');
            _this.afterLogoutTimeout = setTimeout(function () {
              window.location.reload();
            }, 4000);
          } else {
            core.userLogin(_this.get.u, _this.get.p, 0);
          }
        }

        if (_this.get.session && _this.get.time && !config.system.authorized) {
          core.userLogin(_this.get.session, _this.get.time, 1);
        }

        if (_this.get.id) {
          delete _this.get.id;
          delete _this.get.password;
          _this.getReload();
        }

        window.onmessage = function (event) {
          if (event.data == 'closeGame' || event.data == 'close' || event.data == 'notifyCloseContainer' || (event.data.indexOf && event.data.indexOf('GAME_MODE:LOBBY') >= 0)) {
            window.gclose();
          } else if (event.data == 'closeWheel') {
            _this.closeWheel();
          }
          if (event.data.closeGame !== undefined) {
            _this.closeGame(event.data.closeGame);
          }
        };
        if (config.system.authorized) {
          _this.reloadTerminal();
        } else if (config.system.beforeAuthorize) {
          _this.beforeAuthorize();
        } else {
          $('body').addClass('no-authorize');
        }

        if (config.PWA && !localStorage.pwa) {
          _this.a2hsFunction();
        }
        if (config.PWA) {
          _this.initServiceWorker();
        }
        if (!_this.checkIfFlashEnabled() && !config.system.authorized && config.downloadApp && ((!device.desktop() && device.android()) || device.windows())) {
          _this.showDownloadAppPopup();
        }
      });
    } else {
      this.reloadTerminal();
    }
  };
  this.checkIfFlashEnabled = function () {
    var isFlashEnabled = false;
    // РџСЂРѕРІРµСЂРєР° РґР»СЏ РІСЃРµС… Р±СЂР°СѓР·РµСЂРѕРІ, РєСЂРѕРјРµ IE
    if (typeof navigator.plugins != 'undefined' && typeof navigator.plugins['Shockwave Flash'] == 'object') {
      isFlashEnabled = true;
    } else if (typeof window.ActiveXObject != 'undefined') {
      // РџСЂРѕРІРµСЂРєР° РґР»СЏ IE
      try {
        if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) {
          isFlashEnabled = true;
        }
      } catch (e) {}
    }
    return isFlashEnabled;
  };
  this.IOSScrollChecker = function () {
    window.addEventListener(
      'touchmove',
      (ev) => {
        if (!$('#safarihelper').hasClass('active') && $('body').hasClass('mobile-game')) {
          //ev.preventDefault();
        }
      },
      { passive: false },
    );
  };
  this.toggleFullScreen = function (isFull) {
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
  };
  this.windowResize = function () {
    let w = window.innerWidth;
    let h = window.innerHeight;

    var _this = this,
      isFullScreen = false;

    var ua = window.navigator.userAgent,
      iOS = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i),
      webkit = !!ua.match(/WebKit/i),
      iOSSafari = iOS && webkit && !ua.match(/CriOS/i);

    //РєРѕСЃС‚С‹Р»СЊ РґР»СЏ ios
    if (window.orientation !== undefined && ((w > h && window.orientation == 0) || (w < h && window.orientation != 0))) {
      setTimeout(function () {
        _this.windowResize();
      }, 1000);
      return;
    }

    if (config.deviceRotate && localStorage.getItem('user-token')) {
      if ((device.mobile() || device.tablet()) && window.orientation == 0) {
        $('.device-rotate').addClass('active');
      } else {
        $('.device-rotate').removeClass('active');
      }
    }

    if (device.mobile() || device.tablet()) {
      $('body').attr('orientation', window.orientation == 0 ? 'portrait' : 'landscape');
    }

    if (device.ios() && !device.desktop() && !device.tablet() && config.IOSScrollCheck && iOSSafari) {
      if (($('body').hasClass('mobile-game') && !$('body').hasClass('game-without-scrollcheck')) || config.IOSScrollCheck != 'onlygame') {
        $('body').addClass('core-scrollcheck');
      } else {
        $('body').removeClass('core-scrollcheck');
      }

      if (window.screen.width === h && window.orientation != 0) {
        isFullScreen = true;
      } else {
        isFullScreen = false;
      }

      /*
            if (this.contentName=='launcher' && (window.orientation==0 || this.gameInfo.game.content.exitButton_mobile==1)) {
                $('body').height(h);
                $('body').width(w);
            } else {
                $('body').height(h+2000);
                $('body').width(w);
            }*/

      _this.scrollAnimation = _this.scrollAnimation
        ? _this.scrollAnimation
        : new _this.SpriteAnimation({
            height: 304,
            width: 91,
            sliceCount: 40,
            rowSliceCount: 20,
            elementId: '#safarihelper',
            duration: 2000,
            activeClass: 'active',
          });

      if (
        !isFullScreen &&
        window.orientation != 0 &&
        !$('body').hasClass('game-without-scrollcheck') &&
        (config.IOSScrollCheck != 'onlygame' || $('body').hasClass('mobile-game'))
      ) {
        _this.scrollAnimation.start();
        $('html, body').removeClass('fullscreenSafari').addClass('notFullscreenSafari');

        // setTimeout(()=>{
        //     _this.scrollAnimation.stop();
        //     $('html, body').removeClass('notFullscreenSafari fullscreenSafari');
        // }, 5000)
      } else if (!$('body').hasClass('game-without-scrollcheck') && (config.IOSScrollCheck != 'onlygame' || $('body').hasClass('mobile-game'))) {
        _this.scrollAnimation.stop();
        $('html, body').addClass('fullscreenSafari').removeClass('notFullscreenSafari');
      }
    }
  };
  this.detectBrowser = function () {
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
      return 'Firefox';
    } else if (navigator.userAgent.indexOf('MSIE') != -1 || !!document.documentMode == true) {
      return 'IE'; //crap
    } else {
      return 'Unknown';
    }
  };
}
