## Administrar restaurantes: Crear un CRUD(Crear, Leer, Editar y Eliminar) un 
# restaurante con los siguientes campos: (Nombre, Descripción, Dirección,Ciudad, 
# Url foto restaurante).

from app.app import db
from sqlalchemy.orm import relationship

class Mesa(db.Model):

    __tablename__ = "mesas"

    #primary key
    id = db.Column(db.Integer, primary_key = True)
    numero = db.Column(db.Integer, nullable = False)
    
    reservada = db.Column(db.Boolean, default = False)
    Date_Reserva = db.Column(db.DateTime)

    restaurante_id = db.Column(db.Integer, db.ForeignKey("restaurantes.id"), nullable = False)
    restaurante = db.relationship("Restaurante", back_populates = "mesas")
    
    reservas = db.relationship("Reserva", back_populates = "mesa")



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
            'numero' : self.numero,
            'reservada' : self.reservada,
            'Date_Reserva' : Date_Reserva_format,
            'restaurante_id' : self.restaurante_id,
            'restaurante' : self.restaurante.getAttributes()
        }
        return Attributes

    
    def update(self):
        db.session.commit()

    def delete(self):
        db.session.delete(self)
        db.session.commit()


