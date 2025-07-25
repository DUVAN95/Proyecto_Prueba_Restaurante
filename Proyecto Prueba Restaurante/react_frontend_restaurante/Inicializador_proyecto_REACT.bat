@echo off

echo 'Creando Proyecto Reactl ...'
npx create-react-app frontend_restaurante

echo 'Instalando Router Dom ...'
npm install react-router-dom

echo 'Instalando bootstrap ...'
npm i bootstrap

echo 'intalar datepiker...'
npm install react-datepicker

echo 'Ejecutando el servidor React...'
cd frontend_restaurante npm start