<?php

header('Content-Type: application/json');

http_response_code(422);

echo json_encode([
    'data' => [
        'email' => ['Please enter an email address'],
        'password' => ['Please enter a password'],
    ]
]);
