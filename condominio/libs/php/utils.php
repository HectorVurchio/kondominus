<?php
use PHPMailer\PHPMailer\PHPMailer;
require "PHPMailer/Exception.php";
require "PHPMailer/PHPMailer.php";
require "PHPMailer/SMTP.php";

class Utils{
 private $infoError;
 public function getInfoError(){
	return $this->infoError;
 }
 function getToken($length=32){
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet.= "0123456789";
    for($i=0;$i<$length;$i++){
        $token .= $codeAlphabet[$this->crypto_rand_secure(0,strlen($codeAlphabet))];
    }
    return $token;
}
 
function crypto_rand_secure($min, $max) {
    $range = $max - $min;
    if ($range < 0) return $min; // not so random...
    $log = log($range, 2);
    $bytes = (int) ($log / 8) + 1; // length in bytes
    $bits = (int) $log + 1; // length in bits
    $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
    do {
        $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
        $rnd = $rnd & $filter; // discard irrelevant bits
    } while ($rnd >= $range);
    return $min + $rnd;
}
 
 // send email using built in php mailer
public function sendEmailViaPhpMail($send_to_email, $subject, $body){
   $mail = new PHPMailer;
   $mail->isSendmail();
   $mail->setFrom('info@cartecdevenezuela.com', 'Cartec De Venezuela');
   $mail->addReplyTo('info@cartecdevenezuela.com', 'Cartec De Venezuela');
   $mail->addAddress($send_to_email);
   $mail->Subject = $subject;
   $mail->msgHTML($body);
   if ($mail->send()) {
      return true;
   } else {
     $this->infoError = $mail->ErrorInfo;
      return false;
   }
}
 
}
?>