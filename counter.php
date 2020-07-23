<?php

namespace Plugins\Counter;

use \Typemill\Plugin;

class Counter extends Plugin
{

  public static function getSubscribedEvents()
  {
    return array(
      'onTwigLoaded' => 'onTwigLoaded'
    );
  }


  public static function addNewRoutes()
  {
    return array(
      array(
        'httpMethod'  => 'get', 
        'route'       => '/counter_tool', 
        'class'       => 'Plugins\counter\index:index'
      )
    );
  }


  public function onTwigLoaded()
  {
    if(!isset($_SESSION['user'])) {
      return;
    }

    $this->addCSS('/counter/public/counter.css');

    $this->addJS('/counter/public/counterutils.js');
    $this->addJS('/counter/public/startutils.js');

    $this->addJS('/counter/public/global.js');
    $this->addJS('/counter/public/raw.js');
    $this->addJS('/counter/public/visual.js');
  }

}

?>
