
import {useState, useEffect} from "react"
import Restaurantes from "./restaurantes";
//import DatePicker from "react-datepicker";
import { useNavigate } from "react-router-dom";

export default function Reservas() {
    
    const navigate = useNavigate();
    var URL_Server = "http://localhost:5000";
    var Json_Mesa_Vacio = {
        id: null, 
        reservada: false,
        Date_Reserva: null
    }

    const[mesasTotal, setMesasTotal] = useState([]);
    const[mesas, setMesas] = useState([]);
    const[notificacion, setNotificacion] = useState([]);
    const[mesa, setMesa] = useState(Json_Mesa_Vacio); // Edit and New

    const[reservas, setReservas] = useState([]);
    const[reserva, setReserva] = useState([]);

    const[restaurantes, setRestaurantes] = useState([]);
    const[restaurante, setRestaurante] = useState([]);

    const[modo_Edicion, setModo_Edicion] = useState(false);

    const[max_reserva, set_MaxReserva] = useState(0);
    
    const[restaurante_mesaspake, setRestaurante_mesaspake] = useState("Sin nombre");

    

    useEffect(()=>{

        getAllMesas();
        getAllRestaurantes();
        getMesas_reservadas();
  
    },[]);


    const getAllMesas = () => {
        fetch(URL_Server + "/api/mesas")
            .then(response => response.json())
            .then(Json_Data => {setMesasTotal(Json_Data)})
            //.then(Json_Data => {setMesas(Json_Data); setReservas(Json_Data)})
    }

    const getMesas_reservadas = () => {
        fetch(URL_Server + "/api/mesas_reservadas")
            .then(response => response.json())
            .then(Json_Data => {setReservas(Json_Data)})
    }

    const updateMesa = (id, Json_Mesa) => {
        if(max_reserva <= 1){
            fetch(URL_Server + `/api/mesas/${id}`, {
                method : "PUT",
                headers : {"content-type": "application/json"},
                body :JSON.stringify({
                    reservada: Json_Mesa["reservada"],
                    Date_Reserva: Json_Mesa["Date_Reserva"]
                })
            })
                .then(response => response.json())
                .then(Json_Data => {setNotificacion(Json_Data.message); getAllMesas(); getMesas_reservadas(); set_MaxReserva(max_reserva+1);})
        }
        
    }

    const cancelReserva = (id) => {
        setMesa({...mesa, reservada : false, Date_Reserva: null})
        updateMesa(id, mesa)
    }

    const getAllRestaurantes = () => {
        fetch(URL_Server + "/api/restaurantes")
            .then(response => response.json())
            .then(Json_Data => setRestaurantes(Json_Data))
    }

    const restaurante_By_ID = (id) => {
        if(id==""){
            setMesas([]);
        }else{
            id = parseInt(id);
            for (const restaurante of restaurantes){
                if(restaurante.id == id){
                    setRestaurante(restaurante);
                    mesas_Restaurante(restaurante.mesas_id);
                    break;
                }
            }
        }
        
        
    }

    const mesas_Restaurante = (mesas_id) => {
        
        
        var lista_Mesas = [];
        
        for(const mesa_id of mesas_id){
            for (const mesa of mesasTotal){
                if(mesa.id == mesa_id.id){
                    if(mesa.reservada != true){
                        lista_Mesas.push(mesa);
                    }
                }
                
            }
        }
        
        setMesas(lista_Mesas);
        
    }

     const reinciar_Variables = () => {
        setRestaurante([]);
        setMesas([]);
        setMesa(Json_Mesa_Vacio);
        setModo_Edicion(false);
     }

   

    return <div className="App">

                <div className="container-fluid">
                    <div className="bg-light">
                        <h3>{notificacion}</h3>
                    </div>
                    <div>
                        <h1>Reservas</h1>
                        <button onClick={() => navigate("/restaurantes")}>Restaurantes</button>
                    </div>
                    <div className="row mt-3">
                        <div className="col md-4">
                            <button className="btn btn-dark" on onClick={() => {setMesa(Json_Mesa_Vacio)}} data-bs-toggle="modal" data-bs-target="#ModalForm">Agregar Reserva</button>
                        </div>    
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 col-lg-12"> {/*La tabla ocupa 12 de 12 divisiones para 8 de 12 seria col-12 col-lg-8 */}
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr><th>Reserva</th><th>ID</th><th>Restaurante</th><th>Mesa #</th><th>Fecha</th><th></th><th></th></tr>
                                    </thead>
                                    <tbody className="table-group-divider">
                                        {reservas.map((reserva,index) => (

                                            <tr>
                                                <td><b>Reserva</b></td>
                                                <td>{index + 1} : {reserva.id}</td>
                                                <td>{reserva.restaurante.name}</td>
                                                <td>{reserva.numero}</td>
                                                <td>{reserva.Date_Reserva}</td>
                                                <td><button className="btn btn-warning" data-bs-toggle="modal" data-bs-target="#ModalForm" onClick={() => {setReserva(reserva); setMesa(reserva); restaurante_By_ID(reserva.restaurante.id); setModo_Edicion(true);}}>Editar</button></td>
                                                <td><button className="btn btn-danger" onClick={() => cancelReserva(reserva.id)}>Cancelar Reserva</button></td>
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
                                {modo_Edicion == false && (<label className="h5">Agregar Reserva</label>)}
                                {modo_Edicion == true && (<label className="h5">Cambiar Fecha</label>)}
                                <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={()=>{reinciar_Variables()}}></button>
                            </div>
                            
                            <div className="modal-body">
                                
                                
                                {/* opciones  restaurante selec*/}
                                {/* opciones check mesa*/}
                                
                                {modo_Edicion == false &&(
                                    
                                    <div>
                                        <label>Seleccionar Restaurante:</label>
                                        <select id = "restaurante" value = {restaurante.id == null ? "": restaurante.id} className="form-control"  onChange={(event) => {restaurante_By_ID(event.target.value); setMesa(Json_Mesa_Vacio)}}>
                                            <option value=""></option>
                                            {restaurantes.map((restaurante2,index) => (
                                                <option value={restaurante2.id}>{restaurante2.name}</option>
                                            ))}
                                        </select>
                                        <br />

                                        <label><b>Fecha: </b></label> 
                                        <input type="date" value={mesa.Date_Reserva == null ? "" : mesa.Date_Reserva } onChange={(event) =>{setMesa({...mesa, Date_Reserva : event.target.value})}} ></input>
                                        <br />

                                        <label>Seleccionar Mesa en restaurante: <b>{restaurante.name}</b></label>
                                        <label className="form-control">
                                            {mesas.map((mesa_R, index) => (
                                                <label className="form-control"><input type="radio" name="mesas" value={mesa_R.id} checked={mesa_R.id == mesa.id} onClick={() => {setMesa({...mesa_R, reservada : true, Date_Reserva : mesa.Date_Reserva})}}></input> {mesa_R.numero} : id: {mesa_R.id}</label>
                                            ))}
                                        </label>
                                        <br />
                                    </div>
                                    )
                                }
                                
                                {modo_Edicion == true &&(
                                    <div>
                                        <label>Modificar Fecha en restaurante: <b>{restaurante.name}</b></label>
                                        <br />
                                        <label><b>Fecha: </b></label> 
                                        <input type="date" value={mesa.Date_Reserva == null ? "" : mesa.Date_Reserva } onChange={(event) =>{setMesa({...mesa, Date_Reserva : event.target.value})}} ></input>
                                    </div>
                                )}

                                <br />
                                
                                                    
                            </div>

                            <div className="modal-footer">
                                <div className="row-mt-3">
                                    
                                    {modo_Edicion == false && (<button className="btn btn-dark" data-bs-dismiss="modal" onClick={() => {updateMesa(mesa.id, mesa); reinciar_Variables()}}>Guardar</button>)}
                                    {modo_Edicion == true && (<button className="btn btn-dark" data-bs-dismiss="modal" onClick={() => {updateMesa(mesa.id, mesa); reinciar_Variables()}}>Cambiar Fecha</button>)}
                                    <button className="btn btn-danger" data-bs-dismiss="modal" onClick={() => {reinciar_Variables()}}>cerrar</button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            
            </div>



}

