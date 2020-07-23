<?php

namespace Plugins\Counter;

use \Typemill\Plugin;
use Symfony\Component\Yaml\Yaml;

class Index extends Plugin
{
  
  public static function getSubscribedEvents(){}


  public function howManyWords()
  {
    $yaml_file = realpath(__DIR__ . '/../../settings/settings.yaml');
    $yaml = Yaml::parse(file_get_contents($yaml_file));
    $words4minute = $yaml['plugins']['counter']['words4minute'];
    if(!$words4minute){
      $words4minute = '160';
    }
    return $words4minute;
  }


  public function index()
  {
	$characters 	= $_GET['characters'];
	$words			= $_GET['words'];
	$phrases		= $_GET['phrases'];
	$readingTime	= $_GET['readingTime']; 

    // get Twig Instance and add the thesaurus template-folder to the path
    $twig = $this->getTwig();
    $loader = $twig->getLoader();
    $loader->addPath(__DIR__ . '/templates/');

    // which language
    $userSettings = \Typemill\Settings::getUserSettings();
    $language = $userSettings['language'];
    $filename = $language . '.thesaurus.sqlite';
    $dbfile = __DIR__ . '/data/' . $filename;

    // THIS WORKS BUT I DON'T LIKE IT AT ALL.
    // LABELS SHOULD BE AVAILABLE THROUGH RESEARCH THAT ONE IN INDEX.PHP
    $labels = \Typemill\Translations::loadTranslations('admin');
    
    return $twig->fetch('counter.twig',
      array(
        'characters'    => $characters,
        'words'         => $words,
        'phrases'       => $phrases,
        'readingTime'   => $readingTime,
        'labels'        => $labels
      )
    );
  }

}
