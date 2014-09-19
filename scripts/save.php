<?php
    require_once "google/appengine/api/cloud_storage/CloudStorageTools.php";
    echo "dsss";
    echo CloudStorageTools::getDefaultGoogleStorageBucketName() ;
    session_start();
echo file_get_contents("gs://silken-eye-693.appspot.com/settings.json");
    if ($_POST <> NULL && $_POST['security'] == session_id()) {
        file_put_contents ("gs://silken-eye-693.appspot.com/settings.json", $_POST['data']);
    } else {
        echo "ERROR: Security check problem!";
    }
?>
