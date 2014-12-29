<?php
$host = $_SERVER['HTTP_HOST'];
$uri = rtrim(dirname($_SERVER['PHP_SELF']), '/\\');
$extra = 'src/html/create-page.html';

header("Location: http://$host$uri/$extra");
?>
