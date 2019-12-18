import model from '../models';

const { Consultas } = model;
const { Citas_Medicas } = model;
const { Pacientes } = model;
const { PapeletaInternacion } = model;
const { Recetas } = model;

class Consulta {
    
    static reg_consulta(req, res) {
      
      const { tipoConsulta,fechaConsulta,numeroHistorial,anamnesis,diagnostico,tratamiento,observaciones,id_medico } = req.body
      return Consultas
      .findAll({
        where :{ id_cita : req.params.id_cita }
      })
      .then(data1 => {
        if (data1 != ""){
          res.status(400).json({
            success:false,
            msg:"Ya no se puede registrar otra consulta en esta cita médica"
          })
        }else{
          if(tipoConsulta == "" || anamnesis == "" || fechaConsulta == "" || numeroHistorial == "" || isNaN(numeroHistorial) || diagnostico == "" || tratamiento == "" || id_medico == "" || isNaN(id_medico)){
            if(tipoConsulta == ""){
              res.status(400).json({
                success:false,
                msg:"El tipo de consulta no puede estar vació"
              })
            }else if (fechaConsulta == ""){
              res.status(400).json({
                success:false,
                msg:"Inserte la fecha actual por favor"
              })
            }else if(numeroHistorial == ""){
              res.status(400).json({
                success:false,
                msg:"Numero historial no puede estar vació"
              })
            }else if(isNaN(numeroHistorial)){
              res.status(400).json({
                success:false,
                msg:"Numero historial no pude contener letras"
              })
            }else if(diagnostico == ""){
              res.status(400).json({
                success:false,
                msg:"Inserte el diagnostico del paciente por favor"
              })
            }else if(tratamiento == ""){
              res.status(400).json({
                success:false,
                msg:"Inserte tratamiento por favor"
              })
            }else if(id_medico == "" || isNaN(id_medico)){
              res.status(400).json({
                success:false,
                msg:"Id de medico no se esta mandando"
              })
            }else if(anamnesis == ""){
              res.status(400).json({
                success:false,
                msg:"Inserte motivo de conulta del paciente"
              })
            }
          }else{
            return Citas_Medicas
            .findAll({
              where: { id : req.params.id_cita}
            })
            .then(cita_data => {
              if(cita_data[0].estado_atendido == false){
                res.status(400).json({
                  success:false,
                  msg: "Esta consulta ya no se puede registrar por que ya paso el tiempo"
                })
              }else{
                var  id_cita  = req.params.id_cita;
                return Consultas
                .create({
                  id_cita,  // este es el id de la cita medica
                  tipoConsulta,
                  fechaConsulta,
                  numeroHistorial,
                  anamnesis,
                  diagnostico,
                  tratamiento,
                  observaciones,
                  id_medico
                })
                .then(consultaData => res.status(201).send({
                  success: true,
                  msg: 'Consulta guardada',
                  consultaData
                }))
              }
            });
            
          }
        }
      });
     
    }
    static getConsulta(req, res) {
      return Consultas
     .findAll()
     .then(Consultas => res.status(200).send(Consultas));
     }
     
     //serv para sacar las consultas de un paciente
     static getConsultaPaciente(req, res){                
      var historial = req.params.historial;
      var tipoConsulta = req.params.tipoConsulta;
      Consultas.findAll({
          where: { numeroHistorial: historial, tipoConsulta:tipoConsulta },
          //attributes: ['id', ['description', 'descripcion']]
          include:[
            { model:Citas_Medicas, attributes:['id'],
              include:[{
                model:Pacientes, attributes:[ 'id','nombre','apellidop','apellidom']
              }]
            }
          ]
        }).then((resp) => {
          res.status(200).json(resp);
        });     
     }
     //serv para solo una consulta medica
     static onlyConsulta(req, res){                
      var id = req.params.id;  
      Consultas.findAll({
        where: {id: id},        
         //attributes: ['id', ['description', 'descripcion']]
         include:[ {model:Citas_Medicas,attributes:['id', 'medico']}]
        }).then((data) => {
          res.status(200).json(data);
        });     
      }
      //serv para solo una consulta segun su cita para poder actualizar
     static updateConsulta(req, res){                
      var id = req.params.id;  
      Consultas.findAll({
        where: {id_cita: id}
         //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
          res.status(200).json(data);
        });     
      }
    static updateCOnsPost(req, res) {
        const { estado_update,anamnesis,diagnostico,tratamiento,observaciones } = req.body
        return Consultas
        .findAll({
          where:{ id : req.params.id }
        })
        .then(data => {          
          if (data[0].estado_update == false){
            res.status(400).json({
              success:false,
              msg : "Solo se puede actualizar una sola ves"
            })
          }else{
            if( diagnostico == "" || tratamiento == "" || anamnesis == ""){
              if(diagnostico == ""){
                res.status(400).json({
                  success:false,
                  msg:"Inserte el diagnostico del paciente por favor"
                })
              }else if(tratamiento == ""){
                res.status(400).json({
                  success:false,
                  msg:"Inserte tratamiento por favor"
                })
              }else if(anamnesis == ""){
                res.status(400).json({
                  success:false,
                  msg:"Inserte motivo de conulta del paciente"
                })
              }
            }else{
              return Consultas
              .findByPk(req.params.id)
              .then((data) => {
                data.update({
                  estado_update: estado_update || data.estado_update,
                  anamnesis: anamnesis || data.anamnesis,  
                  diagnostico: diagnostico || data.diagnostico,  
                  tratamiento: tratamiento || data.tratamiento,  
                  observaciones: observaciones || data.observaciones 
                })
                .then(update => {
                  res.status(200).send({
                    success:true,
                    msg: 'Sala actualizado',
                    data: {                  
                      estado_update: estado_update || update.estado_update,
                      anamnesis: anamnesis || update.anamnesis,  
                      diagnostico: diagnostico || update.diagnostico,  
                      tratamiento: tratamiento || update.tratamiento,  
                      observaciones: observaciones || update.observaciones 
                    }
                  })
                })
                .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
            }
          }
        });
       
        
    }
     //serv para solo una consulta medica
     static One_Consulta_id(req, res){                
      var id = req.params.id_consulta;  
      Consultas.findAll({
        where: {id: id},        
         //attributes: ['id', ['description', 'descripcion']]
         
        }).then((data) => {
          res.status(200).json(data);
        });     
      }

    // ruta para poder mostrar una consulta con su papeleta de internacion
    static get_one_conulta_p(req, res) {
      const { id_cita } = req.params
      return Consultas
      .findAll({
        where:{id_cita : id_cita },
        include:[{
          model : Recetas
        }]
      })
      .then(Consultas => res.status(200).send(Consultas));
    }
}
    export default Consulta;


    