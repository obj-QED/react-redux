<?php
$config = array(
    'system' => 'new',
    'title' => 'best casino',
    'meta' => array(
        'keywords' => '',
        'H1' => '',
        'description' => ''
    ),
    'styles' => array( 'style' ),
    'scripts' => array( 'main' ),
    'corePage' => 'api.php',
    'continents' => array(
        'eur' => array(),
        'usa' => array(),
        'asia' => array(),
        'australia' => array(),
        'africa' => array()
    ),
    'beforeAuthorize' => false,
    'labels' => array( 'all', 'new', 'search', 'top', 'tvbet', 'test', 'live_betting', 'fast_games', 'fishing', 'merkur', 'vegas', 'kslot', 'bingo', 'yggdrasil', 'dlv', 'cq9', 'bally', 'apollo', 'table_games', 'quickspin', 'microgaming', 'aristocrat', 'gclub', 'scientific_games', 'pragmatic', 'habanero', 'sg', 'novomatic', 'apex', 'amatic', 'igrosoft', 'igt', 'egt', 'wazdan', 'netent', 'megajack', 'betsoft', 'coolfire', 'tomhorn', 'playtech' ),
    'disableGames' => array(),
    'authorization' => array(
        'name' => 'artbetcasino',
        'key' => '12312423sfdf'
    ),
    'crypted' => array(
        'payments' => array(),
        'limits' => array(
            'USD' => array(
                'in' => array(
                    'max' => 7777,
                    'min' =>99
                ),
                'out' => array(
                    'max' => 1111,
                    'min' => 99
                )
            )
        ),
        'paymentKey' => 'sdfonerginfs39nbun9snb7n7sb',
        'captchaSecret' => '6Le05ycUAAAAAE28I1yR7jnumw83xNKxvq7KZ-ND'
    ),
    'page' => array(
        'debug' => true,
        //неизменяемые настройки стиля
        'cleanUrl' => true,
        'withoutLogoutError' => true,
        'windowResize' =>
        array(
            'width' => 1024,
            'height' => 768
        ),
        'IOSScrollCheck' => true,
        'mobileFullScreen' => true,
        'disablePreloadImages' => true,
        'jackpotType' => 'pharaon',
        'reactJackpotWin' => '',
        'launcher' => false,
        //конфиги
        'updateInterval' => 5000,
        'topGamesCount' => 15,
        'widthMode' => 1,
        'disableGames' => array(),
        'jackpotsShow' => array(
            'index' => true,
            'games' => true,
            'header' => true,
            'launcher'=> true
        ),
        'showMoreAllGames' => false,
        'withoutPayment' => true, // работает при casino => true
        'casinoBeforeLogin' => false, // какой спорт отображать до логина
        'casino' => false,
        'demoForGames' => false, //отображать возможность открыть демку игры

        'beforeLoginForms' => array(
            'email' => false,
            'phone' => false,
            'full' => true,
        ),
        'captchaKey' => '',

        'languages' => array( 'en', 'ru', 'es', 'fr', 'cn', 'ko', 'vi', 'it', 'pt' ),

        'PWA' => true, // возможность добавить иконку сайта на главный экран
        'theme_color' => '#000', //цвет темы для PWA
    )
)
?>