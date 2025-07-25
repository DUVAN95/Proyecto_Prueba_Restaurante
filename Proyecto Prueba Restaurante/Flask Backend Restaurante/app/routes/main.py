from flask import request, jsonify, Blueprint
#from app.app import db
from app.models.restaurante import Restaurante
from app.models.mesa import Mesa
from app.models.reserva import Reserva
from datetime import datetime

from werkzeug.utils import secure_filename
import os

main = Blueprint("main", __name__)

### ///////////////////////////  APIS RESTAURANTES  /////////////////////////

# Leer restaurantes
@main.route("/api/restaurantes")
def getAllRestaurantes():
    
    Letra = request.args.get("letra", default=None)
    Ciudad = request.args.get("ciudad", default=None)
    if(Letra == None and Ciudad == None):
        restaurantes = Restaurante.query.all()
    else:
        if(Letra != None):
            restaurantes = Restaurante.query.filter(Restaurante.name.ilike(f"{Letra}%"))
        else:
            restaurantes = Restaurante.query.filter(Restaurante.city == Ciudad).all()



    #restaurantes = Restaurante.query.all()
    Lista_Restaurantes=[]
    contador = 0

    for restaurante in restaurantes:
        contador = contador + 1 
        Lista_Restaurantes.append(restaurante.getAttributes())

    print("\n\n\n******************************** get: " + str(Lista_Restaurantes))
    print("\n\n\n******************************** Restaurantes contados: " + str(contador))
    return jsonify(Lista_Restaurantes)

# Crear restaurantes
@main.route("/api/restaurantes", methods=["POST"])
def addRestaurante():

    data_json = request.get_json()
    print(data_json)

    photo_url = None
    imagen = request.files.get("imagen")
    if imagen != None :
        nombre_archivo = secure_filename(imagen.filename)
        ruta_url = os.path.join('static/imagenes', nombre_archivo)
        imagen.save(ruta_url)
        photo_url = f"/{ruta_url}"

    new_Restaurante = Restaurante(
        name = data_json["name"],
        description =data_json["description"],
        address = data_json["address"],
        city =data_json["city"],
        #photo_url = photo_url
    )

    ## Agregar 15 mesas al restaurante creado.
    for i in range(15):
        new_Mesa = Mesa(numero = i + 1)
        new_Restaurante.mesas.append(new_Mesa)
    
    new_Restaurante.save() 

    return jsonify(message="El Restaurante fue creado correctamente")


#Agregar imagen

@main.route("/api/addImagenRestaurante", methods=["POST"])
def addImagenRestaurante():


    id = request.form.get("id")
    imagen = request.files.get("imagen")
    print("******************************************* request")
    print(request.form)

    photo_url = None
    if imagen != None :
        nombre_archivo = secure_filename(imagen.filename)
        ruta_url = os.path.join("static", "imagenes", nombre_archivo)
        imagen.save(ruta_url)
        photo_url =  f"/static/imagenes/{nombre_archivo}"

    restaurante = Restaurante.query.get(id)
    restaurante.photo_url = photo_url
    restaurante.update()


    return jsonify(message="El Restaurante fue creado correctamente")




# Actualizar restaurantes
@main.route("/api/restaurantes/<int:id>", methods=["PUT"])
def updateRestaurante(id):

    data_json = request.get_json()
    print(data_json)
    restaurante = Restaurante.query.get(id)
    
    restaurante.name = data_json["name"]
    restaurante.description =data_json["description"]
    restaurante.address = data_json["address"]
    restaurante.city = data_json["city"]
    restaurante.photo_url = data_json["photo_url"]
    
    restaurante.update()
    return jsonify(message="El Restaurante fue actualizado correctamente")


# Eliminar restaurantes
@main.route("/api/restaurantes/<int:id>", methods=["DELETE"])
def deleteRestaurante(id):

    restaurante = Restaurante.query.get(id)
    restaurante.delete()
    return jsonify(message="El Restaurante fue eliminado correctamente")




### ///////////////////////////  APIS MESAS (Reservas)  /////////////////////////

# Leer mesas
@main.route("/api/mesas")
def getAllMesas():
    
    mesas = Mesa.query.all()
    Lista_Mesas=[]
    contador = 1

    for mesa in mesas:
        contador = contador + 1
        Lista_Mesas.append(mesa.getAttributes())

    #print("\n\n\n******************************** get mesas: " + str(Lista_Mesas))
    print("\n\n\n******************************** Mesas contados: " + str(contador))
    
    
    return jsonify(Lista_Mesas)

# Leer mesas
@main.route("/api/mesas_reservadas")
def getMesas_reservadas():
    
    mesas = Mesa.query.filter(Mesa.reservada == True).all()
    Lista_Mesas=[]
    contador = 1

    for mesa in mesas:
        contador = contador + 1
        Lista_Mesas.append(mesa.getAttributes())
    
    return jsonify(Lista_Mesas)

# Actualizar mesa
@main.route("/api/mesas/<int:id>", methods=["PUT"])
def updateMesa(id):

    print("\n\n\n\n*************************Reservando en API")
    data_json = request.get_json()
    print(data_json)
    mesa = Mesa.query.get(id)
    mesa.reservada = data_json["reservada"]
    
    if(data_json["Date_Reserva"] != None):
        mesa.Date_Reserva = datetime.fromisoformat(data_json["Date_Reserva"])
    else:
        mesa.Date_Reserva = None
    #mesa.reservada = True
    
    mesa.update()
    print("\n\n\n\n .............. FIN Reservando en API")
    return jsonify(message="La reserva fue realizada")





### ///////////////////////////  APIS RESERVAS  /////////////////////////

@main.route("/api/reservas")
def getReservas():
    
    reservas = Reserva.query.all()
    Lista_Reservas=[]
    contador = 1

    for reserva in reservas:
        contador = contador + 1
        Lista_Reservas.append(reserva.getAttributes())
    
    return jsonify(Lista_Reservas)



@main.route("/api/reservas", methods=["POST"])
def addReservas():

    data_json = request.get_json()
    print(data_json)
    new_Reservas = Reserva(
        mesa_id = data_json["name"],
        Date_Time = data_json["Date_Time"]
    )
   
    new_Reservas.save() 

    return jsonify(message="El Reservas fue creado correctamente")


# Actualizar reservas
@main.route("/api/reservas/<int:id>", methods=["PUT"])
def updateReservas(id):

    data_json = request.get_json()
    print(data_json)
    reserva = Reserva.query.get(id)
    
    reserva.name = data_json["name"]
    reserva.description =data_json["description"]
    reserva.address = data_json["address"]
    reserva.city = data_json["city"]
    reserva.photo_url = data_json["photo_url"]
    
    reserva.update()
    return jsonify(message="El reserva fue actualizado correctamente")


# Eliminar reserva
@main.route("/api/reservas/<int:id>", methods=["DELETE"])
def deleteReservas(id):

    reserva = Reserva.query.get(id)
    reserva.delete()
    return jsonify(message="El Reservas fue eliminado correctamente")









