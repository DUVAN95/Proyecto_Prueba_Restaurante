
import {useState, useEffect} from "react"
import { useNavigate } from "react-router-dom";

export default function Restaurantes() {
    
    const navigate = useNavigate();

    var URL_Server = "http://localhost:5000";
    var Json_Restaurante_Vacio = {
        id: null, 
        name: "",
        city: "",
        address: "",
        description: "",
        photo_url: ""
    }

    const[restaurantes, setRestaurantes] = useState([]);
    const[notificacion, setNotificacion] = useState([]);
    
    const[ver_Lista_Restaurantes, setVer_Lista_Restaurantes] = useState(true);
    const[modal_Form, setModal_Form] = useState(false);
    const[restaurante, setRestaurante] = useState(Json_Restaurante_Vacio); // Edit and New


    

    useEffect(()=>{

        getAllRestaurantes();
  
    },[]);


    const getAllRestaurantes = () => {
        fetch(URL_Server + "/api/restaurantes")
            .then(response => response.json())
            .then(Json_Data => setRestaurantes(Json_Data))
    }

    const insertRestaurante = (Json_New_Restaurante) => {
        fetch(URL_Server + `/api/restaurantes`, {
            method : "POST",
            headers : {"content-type": "application/json"},
            body :JSON.stringify({
                name: Json_New_Restaurante["name"],
                city: Json_New_Restaurante["city"],
                address: Json_New_Restaurante["address"],
                description: Json_New_Restaurante["description"],
                photo_url: Json_New_Restaurante["photo_url"]
            })
        })
            .then(response => response.json())
            .then(Json_Data => {setNotificacion(Json_Data.message); getAllRestaurantes();})
    }

    const updateRestaurante = (id, Json_Restaurante) => {
        fetch(URL_Server + `/api/restaurantes/${id}`, {
            method : "PUT",
            headers : {"content-type": "application/json"},
            body :JSON.stringify({
                name: Json_Restaurante["name"],
                city: Json_Restaurante["city"],
                address: Json_Restaurante["address"],
                description: Json_Restaurante["description"],
                photo_url: Json_Restaurante["photo_url"]
            })
        })
            .then(response => response.json())
            .then(Json_Data => {setNotificacion(Json_Data.message); getAllRestaurantes();})
    }

    const deleteRestaurante = (id) => {
        fetch(URL_Server + `/api/restaurantes/${id}`, {
            method : "DELETE",
        })
        .then(response => response.json())
        .then(Json_Data => {setNotificacion(Json_Data.message); getAllRestaurantes();})
    }

    return <div className="App">

                <div className="container-fluid">
                    <div className="bg-light">
                        <h3>{notificacion}</h3>
                    </div>
                    <div>
                        <h1>Reservas</h1>
                        <button onClick={() => navigate("/")}>Reservas</button>
                    </div>
                    <div className="row mt-3">
                        <div className="col md-4">
                            <button className="btn btn-dark" on onClick={() => {setModal_Form(true); setRestaurante(Json_Restaurante_Vacio)}} data-bs-toggle="modal" data-bs-target="#ModalForm">Agregar Restaurante</button>
                        </div>    
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-lg-12"> {/*La tabla ocupa 12 de 12 divisiones para 8 de 12 seria col-12 col-lg-8 */}
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr><th>ID</th><th>Nombre</th><th>Ciudad</th><th>Dirección</th><th>Descripción</th><th></th><th></th></tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {restaurantes.map((restaurante,index) => (

                                            <tr>
                                                <td>{index + 1} : {restaurante.id}</td>
                                                <td>{restaurante.name}</td>
                                                <td>{restaurante.city}</td>
                                                <td>{restaurante.address}</td>
                                                <td>{restaurante.description}</td>
                                                <td><button className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#ModalForm" onClick={() => {setModal_Form(true); setRestaurante(restaurante)}}>Editar</button></td>
                                                <td><button className="btn btn-danger" onClick={() => deleteRestaurante(restaurante.id)}>Eliminar</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>


                <div id="ModalForm" className="modal fade">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            
                            <div className="modal-header bg-secondary text-white">
                                <label className="h5">Agregar Restaurante</label>
                                <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            
                            <div className="modal-body">
                                <label>Nombre de restaurante:</label>
                                <input type="text" name= "name" value={restaurante.name} onChange={(event) => setRestaurante({...restaurante, name: event.target.value})} className="form-control" placeholder="Nombre"></input>
                                <br />
                                
                                <label>Ciudad:</label>
                                <input type="text" name= "city" value = {restaurante.city} onChange={(event) => setRestaurante({...restaurante, city: event.target.value})} className="form-control" placeholder="Ciudad"></input>
                                <br />

                                <label>Direccion:</label>
                                <input type="text" name= "address" value={restaurante.address} onChange={(event) => setRestaurante({...restaurante, address: event.target.value})} className="form-control" placeholder="Dirección"></input>
                                <br />

                                <label>Descripcion:</label>
                                <input type="text" name= "description" value={restaurante.description} onChange={(event) => setRestaurante({...restaurante, description: event.target.value})} className="form-control" placeholder="Descripción"></input>
                                <br />

                            </div>

                            <div className="modal-footer">
                                <div className="row-mt-3">
                                    {restaurante.id == null && (<button className="btn btn-dark" data-bs-dismiss="modal" onClick={() => {insertRestaurante(restaurante); setRestaurante(Json_Restaurante_Vacio); setModal_Form(false); }}>Guardar</button>)}
                                    {restaurante.id != null && (<button className="btn btn-dark" data-bs-dismiss="modal" onClick={() => {updateRestaurante(restaurante.id, restaurante); setRestaurante(Json_Restaurante_Vacio); setModal_Form(false); }}>Actualizar</button>)}
                                    <button className="btn btn-danger" data-bs-dismiss="modal" onClick={() => {setModal_Form(false); setRestaurante(Json_Restaurante_Vacio)}}>cerrar</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            
            </div>



}

