<?php
include __DIR__ . '/vendor/autoload.php';

$kernel = \AspectMock\Kernel::getInstance();
$kernel->init([
	'debug' => true,
	'includePaths' => [__DIR__.'/src']
]);
$kernel->loadFile('src/Article.php');
$kernel->loadFile('src/SebWeb.php');
$kernel->loadFile('src/MenuItem.php');
?>