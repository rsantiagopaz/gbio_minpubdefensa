<?php

$to      = 'rsantiagopaz@yahoo.com.ar';
$subject = 'asunto';
$message = 'mensaje';
$headers = 'From: webmaster@example.com' . "\r\n" .
    'Reply-To: webmaster@example.com' . "\r\n" .
    'X-Mailer: PHP/' . phpversion();

mail($to, $subject, $message, $headers);

?>