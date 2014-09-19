<?php

require_once 'google/appengine/api/users/UserService.php';
 
use google\appengine\api\users\UserService;


$email = UserService::getCurrentUser()->email;
$domain = explode("@", $email)[1];

if ($domain == "google.com") {

?>
<!DOCTYPE html>
<html>
    <head>
        <title>Administration tools - Measuring Value Application</title>
        <link rel="stylesheet" type="text/css" href="/styles/main.css">
        <link rel="stylesheet" type="text/css" href="/styles/adm.css">
        <link rel="stylesheet" type="text/css" href="/styles/startup.css">
        <link rel="stylesheet" type="text/css" href="/styles/flipper.css">

        <script src="/scripts/lib/jquery-2.1.1.min.js"></script>
        <script src="//code.jquery.com/ui/1.11.1/jquery-ui.js"></script>
        <script src="/scripts/lib/jquery.velocity.min.js"></script>
        <script src="/scripts/settings.js"></script>

        <!-- libraries -->
        <script src="/scripts/lib/flipper.js"></script>
        <script src="/scripts/lib/sandbox.js"></script>
        <script src="/scripts/lib/stripe.js"></script>

        <!-- utilities for managing google drive actions -->
        <script src="/scripts/utils/serve_json.js"></script>

        <!-- object Result -->
        <script src="/scripts/objects/results.js"></script>

        <!-- main controllers -->
        <script src="/scripts/admin.js"></script>
        <script src="/scripts/startup.js"></script>

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css">
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/js/bootstrap.min.js"></script>

    </head>

    <body>
        <div id="flipper" class="flipper">
            <div class="page" id="admin">
                <div class="page-container">
                    <header class="teal page-header"><h1>Admin panel</h1></header>

                    <div class="content">
                        <div class="panel panel-default">
                            <div class="panel-heading">
                                <h3 class="panel-title">Instructions</h3>
                            </div>
                            <div class="panel-body">
                                <p>Click on a section header to add a new element to the section. For example, click on <b>Measures</b> to add a new value measure. Fields for adding new elements will be visible at the end of the section.</p>
                                <p>Click on the element in the section to edit it. For example, click on one vaule measure to change it. All changes are visible in-place.
                                </p>
                                <p>You delete the element clearing the text field.</p>
                                <p><a href="https://drive.google.com/a/altostrat.com/folderview?id=0B6OimKuEL04sbDZFQmRUS0sxMDA&usp=sharing">Here</a> you can find <strong>generated spreadsheets</strong></p>
                            </div>
                        </div>
                        <div class='admin-panel'>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="overlay" class="overlay">
            <div class="background"></div>
            <div class="foreground">
                <div class="foreground-container"></div>
            </div>
        </div>
        <div class="hidden">
            <div id="overlays">
                <div id="overlay-error" class="overlay-content">
                    <div class="content">
                        <p class="error"></p>
                        <div class="actions">
                            <button class="continue">Continue</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <iframe id="sandbox-scripts" class="hidden" src="/scripts/sandbox-scripts.html"></iframe>
    </body>
</html>
<?php
} else {
    header ("Location: /");
}
?>
