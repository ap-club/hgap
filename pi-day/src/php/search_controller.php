<?php
$url = 'https://pi-day-services.hgap.club/search';
echo file_get_contents($url . '?' . $_SERVER['QUERY_STRING']);
?>
