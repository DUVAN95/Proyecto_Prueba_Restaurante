
from flask import Flask
from flask_cors import CORS

#from config import Config
from config import db, Config
## Los modelos se deben importar despues de inicializar la base de datos db = SQLAlchemy()
from app.models import restaurante
from app.models import mesa
from app.models import reserva

from app.routes.main import main

import os




def inicializar_APP ():
    
    static_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'static')

    app = Flask(__name__, static_folder=static_path, static_url_path="/static")
    CORS(app) ## permite peticiones desde otro origen distinto al del backend

    ## Registrar Rutas
    app.register_blueprint(main)

    #Configurar Base de Datos
    config = Config()
    config.Inicializar_DataBase(app)
    config.Conectar_DataBaase(app)

    config.Inicializar_Imagenes(app)

    return app



