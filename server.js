const express = require('express');
const path = require('path');
const app = express();
const PORT = promises.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const DEMO_USER = (
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com"
    }
)