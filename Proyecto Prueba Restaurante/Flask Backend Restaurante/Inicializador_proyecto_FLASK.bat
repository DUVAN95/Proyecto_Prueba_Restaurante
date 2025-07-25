@echo off

echo 'Creando entorno virtual ...'
python -m venv venv

echo 'Activando el entorno virtual...'
call venv\Scripts\activate.bat

echo 'Instalando flask...'
pip install flask flask-cors

echo 'Instalando lask Migrate ...'
pip install flask-migrate

echo 'Indicar el archivo que ejecuta la aplicacion ...'
$env:FLASK_APP = "Run:app"

echo 'Inicializar las migraciones y crear la carpeta migrations ...'
flask db init
@REM // Comentario: Hacer commit cada que cambie estructura de la base de datos
@REM //         flask db migrate -m "agregando campos a Mesa"
@REM // Aplicar cambios a la base de datos 
@REM //         flask db upgrade

echo 'instalando ORM SQLAlchemy'
pip install flask flask_sqlalchemy flask_cors mysqlclient