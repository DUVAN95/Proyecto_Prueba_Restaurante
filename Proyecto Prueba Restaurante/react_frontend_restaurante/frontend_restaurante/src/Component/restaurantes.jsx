
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
    
    const[filtro, setFiltro] = useState("Ninguno");
    const[text_filtro, setText_Filtro] = useState("");

    const [fotografia, setfotografia] = useState(null);
    

    useEffect(()=>{

        getAllRestaurantes();
  
    },[]);


    const getAllRestaurantes = () => {
        fetch(URL_Server + "/api/restaurantes")
            .then(response => response.json())
            .then(Json_Data => setRestaurantes(Json_Data))
    }

    
    const getRestaurantesByFiltro = (filtro) => {
        
        var complementourl = ""

        if(filtro == "Letra"){
            complementourl = "?letra=" + text_filtro
        }else{
            if(filtro == "Ciudad"){
                complementourl = "?ciudad=" + text_filtro
            }
        }
        
        fetch(URL_Server + "/api/restaurantes" + complementourl)
            .then(response => response.json())
            .then(Json_Data => setRestaurantes(Json_Data))
    }

    // const getRestaurantesByCiudad = (Ciudad) => {
        
    //     fetch(URL_Server + "/api/restaurantes?Ciudad=" + Ciudad)
    //         .then(response => response.json())
    //         .then(Json_Data => setRestaurantes(Json_Data))
    // }

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

    const addImagenRestaurante = (id) => {

        const Datos_Envio = new FormData();
        Datos_Envio.append("id", id);
        
        if (fotografia != null) {
            Datos_Envio.append("imagen", fotografia); 
        }

        fetch(URL_Server + `/api/addImagenRestaurante`, {
            method: "POST",
            body: Datos_Envio
        })
        .then(response => {response.json(); setfotografia(null)})
        .then(Json_Data => {getAllRestaurantes(); setfotografia(null)})


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
                        <div className="col-12 col-lg-4">
                            <label><b>Filtro: </b></label>
                            <input type="text" name= "name" value={text_filtro} onChange={(event) => setText_Filtro(event.target.value)} className="form-control" placeholder="Digite"></input>
                            <label><b>Tipo Filtro: </b></label>
                            <label >Ninguno <input type="radio" name="filtro"  onClick={() => {setFiltro("Ninguno")}}></input></label>
                            <label >Letra <input type="radio" name="filtro"  onClick={() => {setFiltro("Letra")}}></input></label>
                            <label >Ciudad <input type="radio" name="filtro"  onClick={() => {setFiltro("Ciudad")}}></input></label>
                            <button onClick={() => getRestaurantesByFiltro(filtro)}>Filtrar</button>
                        </div>                    
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
                                        <tr><th>ID</th><th>Nombre</th><th>Ciudad</th><th>Dirección</th><th>Descripción</th><th>Fotografia</th><th></th><th></th></tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {restaurantes.map((restaurante,index) => (

                                            <tr>
                                                <td>{index + 1} : {restaurante.id}</td>
                                                <td>{restaurante.name}</td>
                                                <td>{restaurante.city}</td>
                                                <td>{restaurante.address}</td>
                                                <td>{restaurante.description}</td>
                                                <div>
                                                    <div >
                                                        {restaurante.photo_url && (<img src={URL_Server + restaurante.photo_url} alt={`Foto del restaurante ${restaurante.name}`} style={{ width: "200px" }} />)}
                                                    </div>
                                                    {!restaurante.photo_url && (
                                                        <div>
                                                            <input type="file" accept="image/*" onChange={(e) => setfotografia(e.target.files[0])}/>
                                                            <button className="btn btn-dark" onClick={() => {addImagenRestaurante(restaurante.id)}}>Subir</button>
                                                        </div>
                                                    )}
                                                </div>
                                                    
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
                                {restaurante.id == null && (<label className="h5">Agregar Restaurante</label>)}
                                {restaurante.id != null && (<label className="h5">Edición Restaurante</label>)}
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

                                {/* <label>Fotografía:</label>
                                <input type="file" className="form-control" accept="image/*" onChange={(e) => setfotografia(e.target.files[0])}/> */}


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

