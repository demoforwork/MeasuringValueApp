<?php // login.php
require_once '../scripts/openid.php';
$openid = new LightOpenID("silken-eye-693.appspot.com");

if ($openid->mode) {
    if ($openid->mode == 'cancel') {
        echo "User has canceled authentication!";
    } elseif($openid->validate()) {
        $data = $openid->getAttributes();
        $email = $data['contact/email'];
        $first = $data['namePerson/first'];
        echo "Identity: $openid->identity <br>";
        echo "Email: $email <br>";
        echo "First name: $first";
    } else {
        echo "The user has not logged in";
    }
} else {
    echo "Go to index page to log in.";
}
?>
