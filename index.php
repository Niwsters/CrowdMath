<!doctype html>

<?php
require_once('src/autoload.php');

$sebWeb = new SebWeb();
$sebWeb->setMainMenu([
					 'frontpage.html' => 'Home',
					 'about.html' => 'About',
					 'contact.html' => 'Contact',
					 'services.html' => 'Services'
					 ]);
?>

<html lang="en">
<head>
  <meta charset="ISO-8859-1" />

  <title>Seb</title>
  <meta name="description" content="Seb's spot!">
  <meta name="author" content="Sebastian Everett Eriksson">

  <link rel="stylesheet" href="master.css?v=1.0">

  <!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->
</head>

<body>

<div id="wrapper">

<div id="header">
<h1>Sebastian Everett Eriksson</h1>
<h2 id="tagline">Engineer, Teacher and Developer
</div>

<div id="main-menu">
<?php $sebWeb->renderMainMenu(); ?>
</div>

<div id="content">
<?php $sebWeb->renderContent(); ?>
</div>

<div id="navigation"></div>

</div>

</body>
</html>