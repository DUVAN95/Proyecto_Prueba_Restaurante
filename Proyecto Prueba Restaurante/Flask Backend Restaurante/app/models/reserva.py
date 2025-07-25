## Administrar restaurantes: Crear un CRUD(Crear, Leer, Editar y Eliminar) un 
# restaurante con los siguientes campos: (Nombre, Descripción, Dirección,Ciudad, 
# Url foto restaurante).

from app.app import db
from sqlalchemy.orm import relationship

class Reserva(db.Model):

    __tablename__ = "reservas"

    #primary key
    id = db.Column(db.Integer, primary_key = True)
    
    Date_Reserva = db.Column(db.DateTime)
    mesa_id = db.Column(db.Integer, db.ForeignKey("mesas.id"), nullable = False)
    mesa = db.relationship("Mesa", back_populates = "reservas")
    



    def save(self):
        db.session.add(self)
        db.session.commit()    

    def getAttributes(self):

        if(self.Date_Reserva == None):
            print("NONE*****************************************************")
            Date_Reserva_format = self.Date_Reserva
        else:
            Date_Reserva_format = self.Date_Reserva.strftime("%Y-%m-%d"),
        
        Attributes = {
            'id' : self.id,
            'Date_Reserva' : Date_Reserva_format,
            'mesa_id' : self.mesa_id,
            'mesa' : self.mesa.getAttributes()
        }
        return Attributes

    
    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


