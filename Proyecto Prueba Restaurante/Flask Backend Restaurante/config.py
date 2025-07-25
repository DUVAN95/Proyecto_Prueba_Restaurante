from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os

db = SQLAlchemy()

class Config():

    def Inicializar_DataBase(self, app):
        
        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqldb://root:MYSQL123@localhost/comercio'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        
        db.init_app(app)
        migrate = Migrate(app, db)

    def Conectar_DataBaase(self, app):
        
        with app.app_context():
            try:
                db.engine.connect()
                print("Conexión exitosa a la base de datos")
                print(app.config['SQLALCHEMY_DATABASE_URI'])
            except Exception as e:
                print("Error de conexión:", e)
            db.create_all()
            print("Base de datos establecida y/o creada")
    
    def Inicializar_Imagenes(self, app):
        app.config['UPLOAD_FOLDER'] = os.path.join('static', 'imagenes')
        app.config['MAX_CONTENT_LENGTH'] = 5 * 1024 * 1024
