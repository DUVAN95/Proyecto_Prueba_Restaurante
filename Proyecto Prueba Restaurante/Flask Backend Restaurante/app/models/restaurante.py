## Administrar restaurantes: Crear un CRUD(Crear, Leer, Editar y Eliminar) un 
# restaurante con los siguientes campos: (Nombre, Descripción, Dirección,Ciudad, 
# Url foto restaurante).

from app.app import db
from sqlalchemy.orm import relationship

class Restaurante(db.Model):

    __tablename__ = "restaurantes"

    #primary key
    id = db.Column(db.Integer, primary_key = True)
    
    name = db.Column(db.String(50), nullable = False)
    description = db.Column(db.String(100))
    address = db.Column(db.String(50))
    city = db.Column(db.String(50))
    photo_url = db.Column(db.String(100))

    mesas = db.relationship("Mesa", back_populates = "restaurante", cascade="all, delete-orphan")

    def save(self):
        db.session.add(self)
        db.session.commit()

    

    def getAttributes(self):
        #print("entre a atributos RESTAURANTE")
        
        Lista_Mesas = []
        for mesa in self.mesas:
            Lista_Mesas.append({'id':mesa.id})

        Attributes = {
            'id' : self.id,
            'name' : self.name,
            'description' : self.description,
            'address' : self.address,
            'city' : self.city,
            'photo_url' : self.photo_url,
            'mesas_id': Lista_Mesas
        }
        #print(Attributes)
        return Attributes

    def getMesasRestaurante(self):
        
        Lista_Mesas = []
        for mesa in self.mesas:
            Lista_Mesas.append(mesa)
            
        return Lista_Mesas
    
    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


