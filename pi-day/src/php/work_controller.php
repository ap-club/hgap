<?php
include('pdo_connection.php');

if (isset($_POST['clientToken'])) {
  $token = $_POST['clientToken'];

  $stmt = $pdo->prepare('SELECT SUM(num_terms) AS total FROM `pi-day` WHERE `done` = 1 AND `token` = BINARY ?');
  $stmt->execute([$token]);
  $personal_sum = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

  $stmt = $pdo->prepare('SELECT SUM(num_terms) AS total FROM `pi-day` WHERE `done` = 1');
  $stmt->execute();
  $sum = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

  if (empty($personal_sum)) $personal_sum = 0;
  if (empty($sum)) $sum = 0;

  if ($sum < 3000) {
    $block_size = 100;
  } else if ($sum >= 3000 && $sum < 5000) {
    $block_size = 70;
  } else if ($sum >= 5000 && $sum < 7000) {
    $block_size = 50;
  } else if ($sum >= 7000 && $sum < 9000) {
    $block_size = 30;
  } else if ($sum >= 9000 && $sum < 11000) {
    $block_size = 10;
  }

  if (isset($_POST['statUpdate'])) {
    exit('{"totalTerms":' . strval($sum) . ',"personalTerms":' . strval($personal_sum) . '}');
    } else if (isset($_POST['getWork'])) {
    $stmt = $pdo->prepare('INSERT INTO `pi-day` (`token`, `start_term`, `num_terms`) VALUES (?, ?, ?)');
    $stmt->execute([$token, $sum, $block_size]);
    $end = $sum + $block_size;
    exit('{"totalTerms":' . strval($sum) . ',"personalTerms":' . strval($personal_sum) . ',"start":' . strval($sum) . ',"end":' . strval($end) . '}');
  } else if (isset($_POST['submitWork'])) {
    $stmt = $pdo->prepare('UPDATE `pi-day` SET `done` = 1 WHERE `start_term` = ? AND `token` = BINARY ?');
    $stmt->execute([$_POST['submitWork'], $token]);

    if ($stmt->rowCount() === 1) {
      $sum += $block_size;
      $personal_sum += $block_size;
    }

    exit('{"totalTerms":' . strval($sum) . ',"personalTerms":' . strval($personal_sum) . '}');
  }
}

exit('Nice try.');
?>
