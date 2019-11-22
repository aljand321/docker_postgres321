import model from '../models';
const fetch = require('node-fetch');


const { PapeletaInternacion } = model;
const { Consultas } = model;
const { emergencia } = model;
const { Citas_Medicas } = model;
const { Pacientes } = model;
class papeletaInt{
    static enviarPapeletaINT(req, res){
      if(req.body.fechaIngreso == ""){
        res.status(400).json({
          success:false,
          msg: "Fecha es obligatorio"
        })
      }else if(req.body.diagnostico == ""){
        res.status(400).json({
          success:false,
          msg: "Diagnostico no puede estar vacío"
        })
      }else if(req.body.especialidad != ""){
        fetch('http://localhost:4600/api/especialidad_nombre/'+ req.body.especialidad)
        .then(resp => resp.json())
        .then(resp => {
        console.log(resp, "   <<<<<<<<<<<<<<<<<<<<<<    esto es lo que quiero ver")
          if(resp == ""){
            res.status(400).json({
              success: false,
              msg: "No existe esa especialidad"
            })
          }else{

            const { tipoConsulta,fechaIngreso, Historial,nombreDoctor,apellidoD1,apellidoD2,diagnostico,especialidad,id_medico } = req.body
            if(!tipoConsulta || !Historial || !nombreDoctor || !id_medico){
              if(!tipoConsulta){
                res.status(400).json({
                  success:false,
                  msg:"NO se esta mandando tipo de consulta"
                })

              }else if(!Historial){
                res.status(400).json({
                  success:false,
                  msg:"No se esta mandando el historial del paciente"
                })

              }else if(!nombreDoctor){
                res.status(400).json({
                  success:false,
                  msg:"No se esta mandando el nombre del doctor"
                })

              }else if (!id_medico){
                res.status(400).json({
                  success:false,
                  msg:"No se esta mandando el id del medico"
                })

              }
            }else{
              const { idConsultaMedica } = req.params
              const { idEmergencia } = req.params
              var id_especialidad = resp[0].id
  
              return PapeletaInternacion
              .create({
                tipoConsulta,
                fechaIngreso, 
                Historial, 
                nombreDoctor,
                diagnostico,
                especialidad,   // esto es el area de internacion a la que va estar registrado el paciente
                idConsultaMedica,  // este id se llena cuando se registran los datos desde consulta medica
                idEmergencia,  // este id se llena cuando se llenan los datos desde emergencia 
                id_medico, // este es el id del medico
                id_especialidad  
              })
              .then(data => res.status(200).send({
                  success: true,
                  msg: 'Se inserto con exito',
                  data
              }))
              .catch(error => res.status(400).send(error));   
            }
            
          }
        })
        .catch(error => {
          res.status(500).json({
            success:false,
            msg:"Algo salio mal con el servidor de cuadernos",
            error
          })
        })
         
      }else{
        res.status(400).json({
          success:false,
          msg: "Por favor selecione Area de internacion"
        })
      }
          
    }
    //sev para mostrar las papeletas de internacion
    static verPapeletaINT(req,res){
        return PapeletaInternacion                
            .findAll()
            .then(data => res.status(200).send(data));    
    }
     //para mostrar Papeleta Internacion segun consulta
     static onlyPInternacion(req, res){                
        var id = req.params.id;  
        PapeletaInternacion.findAll({
           where: {idConsultaMedica: id}
           //attributes: ['id', ['description', 'descripcion']]
         }).then((data) => {
           res.status(200).json(data);
         });     
    }

    static One_p(req, res){                
      var id = req.params.id_p;  
      PapeletaInternacion.findAll({
         where: {id: id}
         //attributes: ['id', ['description', 'descripcion']]
       }).then((data) => {
         res.status(200).json(data);
      });     
    }

    //serv para mostar papeleta de internacion segun emergencia
    static PEmergecia(req, res){                
      var id = req.params.id;  
      PapeletaInternacion.findAll({
         where: {idEmergencia: id}
         //attributes: ['id', ['description', 'descripcion']]
       }).then((data) => {
         res.status(200).json(data);
       });     
  }

    //serv para sacar las consultas de un paciente
    static getPinternacionPaciente(req, res){                
      var historial = req.params.historial;
      var tipoConsulta = req.params.tipoConsulta;
      PapeletaInternacion.findAll({
          where: { Historial: historial, tipoConsulta:tipoConsulta },
          //attributes: ['id', ['description', 'descripcion']]
          include: [
            { model: Consultas, attributes:[ 'id'],
            include:[
              { model: Citas_Medicas, attributes:['id'],
            include:[
              {model: Pacientes, attributes:['id','nombre','apellidop','apellidom','fechanacimiento','sexo']}
            ]}]
           }]
        }).then((resp) => {
          res.status(200).json(resp);
        });     
    }
    //serv para sacar lista p internaciones segun historial de emergencia
    static ListPinternacion(req, res){                
      var historial = req.params.historial;
      PapeletaInternacion.findAll({
          where: { Historial: historial, tipoConsulta : 'emeregencia' } ,
           //attributes: ['id', ['description', 'descripcion']]
          include: [
            { model: emergencia, attributes:[ 'id'],
            include:[
              { model: Citas_Medicas, attributes:['id'],
            include:[
              {model: Pacientes, attributes:['id','nombre','apellidop','apellidom','fechanacimiento','sexo']}
            ] }
            ]
           }
          ]
        }).then((resp) => {
          res.status(200).json(resp);
        });     
    }
    static ListPinternacion_hist(req, res){                
      var historial = req.params.historial;
      PapeletaInternacion.findAll({
          where: { Historial: historial } 
        }).then((resp) => {
          res.status(200).json(resp);
        });     
    }
    static upinternacion(req, res) {
     
      const { tipoConsulta, Historial,diagnostico,especialidad } = req.body
      
      fetch('http://localhost:4600/api/especialidad_nombre/'+ especialidad)
        .then(resp => resp.json())
        .then(resp => {
          if(resp == ""){
            res.status(400).json({
              success: false,
              msg: "No existe esa especialidad"
            })
          }else{
            var id_especialidad = resp[0].id
            var estado_update = 'false'
            return PapeletaInternacion
            .findByPk(req.params.id)
            .then((data) => { 
              data.update({
                estado_update:estado_update || data.estado_update,
                tipoConsulta: tipoConsulta || data.tipoConsulta,

                Historial: Historial || data.Historial,  

                diagnostico: diagnostico || data.diagnostico, 
                especialidad: especialidad || data.especialidad , 
                id_especialidad: id_especialidad || data.id_especialidad   

              })
              .then(update => {
                res.status(200).send({
                  success:true,
                  msg: 'Actualizado',
                  data: {
                    estado_update:estado_update || update.estado_update,
                    tipoConsulta: tipoConsulta || update.tipoConsulta,
                  
                    Historial: Historial || update.Historial,  

                    diagnostico: diagnostico || update.diagnostico,
                    especialidad:especialidad || update.especialidad,
                    id_especialidad: id_especialidad || update.id_especialidad   

                  }
                })
              })
              .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
          }
    })
      
  }
  // este serv va a mostrar los datos de tipo true solamente
  static PINterTRUE(req, res){ 
    const { id_especialidad } = req.params               
    PapeletaInternacion.findAll({
        where: { estado: true, id_especialidad:id_especialidad },
        //attributes: ['id', ['description', 'descripcion']]
        
      }).then((resp) => {
        res.status(200).json(resp);
      });     
  }
  // este serv va a mostrar los datos de tipo false solamente
  static PINterFALSE(req, res){ 
    const { id_especialidad } = req.params                   
    PapeletaInternacion.findAll({
        where: { estado: false, id_especialidad:id_especialidad },
        //attributes: ['id', ['description', 'descripcion']]
       
      }).then((resp) => {
        res.status(200).json(resp);
      });     
  }
  // para traer una sola papeleta de internacion
  static idPinternacion(req, res){ 
    const { id, tipoCons } = req.params;
    if (tipoCons == "emeregencia"){
      PapeletaInternacion.findAll({
        where: { id: id },
        //attributes: ['id', ['description', 'descripcion']]
        include: [
          { model: emergencia, attributes:[ 'id'],
          include:[
            { model: Citas_Medicas, attributes:['id'],
          include:[
            {model: Pacientes, attributes:['id','nombre','apellidop','apellidom','fechanacimiento','sexo']}
          ] }
          ]
         }
        ]
      }).then((resp) => {
        res.status(200).json(resp);
      });     
    } else { // esto de aqui va a traer las consultas medicas
      PapeletaInternacion.findAll({
        where: { id: id },
        //attributes: ['id', ['description', 'descripcion']]
        include: [
          { model: Consultas, attributes:[ 'id'],
          include:[
            { model: Citas_Medicas, attributes:['id'],
          include:[
            {model: Pacientes, attributes:['id','nombre','apellidop','fechanacimiento','sexo']}
          ] }
          ]
         }
        ]
      }).then((resp) => {
        res.status(200).json(resp);
      }); 
    }               
    
  }

  static estadoPInternacion(req,res){
    var estado;
    return PapeletaInternacion
    .findByPk(req.params.idPinternacion)
    .then((data) => {
      data.update({
        estado : estado  || data.estado == false
      })
      .then(update => {
        res.status(200).send({
          success:true,
          msg: 'Se actualizo el estado',
          data : {
            estado : estado  || update.estado 
          }
        })
        .catch(error => res.status(400).send(error))
      })
      .catch(error => res.status(400).send(error))
    })
  }
}

setInterval(update_estado, 60000 )  

function update_estado (req,res){
  return PapeletaInternacion                
  .findAll({
    where:{estado_update : true}
  })
  .then(data => {
    var estado_update1 = 'false'
    if(data != ""){
      for (var i = 0; i < data.length; i++){
        console.log(data[i].id," entro no se por que")
       
        return PapeletaInternacion
        .findByPk(data[i].id)
        .then((data) => { 
          data.update({
            estado_update:estado_update1 
          })
          .then(update => {
            console.log(update.estado_update," estado actualizado")
          })
          .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
      }
      
    }
  });  
}

export default papeletaInt