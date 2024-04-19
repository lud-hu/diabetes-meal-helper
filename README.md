# Diabetes Meal Helper

[![Unit tests](https://github.com/lud-hu/diabetes-meal-helper/actions/workflows/unittest.yml/badge.svg)](https://github.com/lud-hu/diabetes-meal-helper/actions/workflows/unittest.yml)
[![Deploy](https://github.com/lud-hu/diabetes-meal-helper/actions/workflows/firebase-hosting-merge.yml/badge.svg)](https://github.com/lud-hu/diabetes-meal-helper/actions/workflows/firebase-hosting-merge.yml)

description: tbd

## Setup for local development

Make sure to have node and npm installed.
For starting the firebase emulator locally, you also need the cli: https://firebase.google.com/docs/cli

```bash
# install all dependencies
$ npm install

# startup backend (firebase firestore emulator)
$ npm run emulator

# startup frontend
$ npm run dev
```

Then, go to `http://localhost:5173/konfigurieren` to configure today's meal and to `http://localhost:5173/einnehmen` to log the intake of the meal.