import model from '../models';
import Paciente from './pacientes';

const { emergencia } = model;
const { Citas_Medicas } = model;
const { Pacientes } = model;
class Emergencias {
    static Emergencia(req, res){
        const { fechaAtencion, Nhistorial,nombreDoctor,motivoConsulta,diagnostico,tratamiento,observaciones,idDoctor } = req.body
        if(!fechaAtencion || !Nhistorial || !nombreDoctor || !motivoConsulta || !diagnostico || diagnostico.length == 0 || !tratamiento || !idDoctor){
          if(!fechaAtencion){
            res.status(200).json({
              success:false,
              msg:"Fecha es Obligatorio"
            })
          }else if (!Nhistorial){
            res.status(200).json({
              success:false,
              msg:"No se esta mandando el N° de historial del paciente"
            })
          }else if(!nombreDoctor){
            res.status(200).json({
              success:false,
              msg:"No se esta mandando el nombre del doctor"
            })
          }else if(!motivoConsulta){
            res.status(200).json({
              success:false,
              msg:"Motivo de consulta es obligatorio"
              
            })
          }else if(!diagnostico || diagnostico.length == 0){
            res.status(200).json({
              success:false,
              msg:"El diagnostico es obligatorio"
             
            })
          }else if(!tratamiento){
            res.status(400).json({
              success:false,
              msg:"Trata miento es obligatorio"
            })
          }else if (!idDoctor){
            res.status(400).json({
              success:false,
              msg:"Id de medico no se esta mandando"
            })
          }
        }else{
          const  { idCita }  = req.params
          return emergencia
          .create({
            fechaAtencion,
            Nhistorial,
            nombreDoctor,
            motivoConsulta,
            diagnostico,
            tratamiento,
            observaciones,
            idCita,
            idDoctor           
          })
          .then(data => res.status(200).send({
              success: true,
              msg: "Se insertaron los datos correctamente",
              data
          }))
          .catch(error => res.status(400).send(error));       
        }
        
    }
    // Servicio para para mostrar emergencias
    static getEmergencia(req, res) {
        return emergencia                
        .findAll()
        .then(data => res.status(200).send(data));                       
    }

    // Servicio para para mostrar emergencias mas doctor
     static one_consulta_emg(req, res) {
      const { id } = req.params;
      return emergencia                
      .findAll({
        where : { id : id },
        include:[ {model:Citas_Medicas,attributes:['id', 'medico']}]
      })
      .then(data => res.status(200).send(data));                       
    }

    //serv para mostrar emergencia segun id de cita
    static onlyEmergencia(req, res){                
        var id = req.params.id;  
        emergencia.findAll({
           where: {idCita: id}
           //attributes: ['id', ['description', 'descripcion']]
         }).then((data) => {
           res.status(200).json(data);
         });     
    }
    // emergencia segun historial
    static emergenciaH(req, res){                
        var historial = req.params.historial;  
        emergencia.findAll({
           where: {Nhistorial: historial},
           //attributes: ['id', 'fechaAtencion','Nhistorial','nombreDoctor','apellidoD1','diagnostico','idCita'],
           include:[
               {model: Citas_Medicas,attributes: ['id'], 
               include:[{
                model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom']
               }
            
            ] }
           ]
         }).then((data) => {
           res.status(200).json(data);
        });     
    }
    static updateEmergencia(req, res) {
      const {motivoConsulta,diagnostico,tratamiento,observaciones } = req.body
      return emergencia                
      .findAll({
        where:{id:req.params.id}
      })
      .then(data => {
        if(data[0].estado_update == false){
          res.status(400).json({
            success:false,
            msg:"Esa consulta ya no se puede actualizar"
          })
        }else{
          
         var estado = "false"
          return emergencia
            .findByPk(req.params.id)
            .then((data) => {
              data.update({
                estado_update: estado,
                motivoConsulta: motivoConsulta || data.motivoConsulta,  
                diagnostico: diagnostico || data.diagnostico,  
                tratamiento: tratamiento || data.tratamiento, 
                observaciones: observaciones || data.observaciones,                    
              })
              .then(update => {
                res.status(200).send({
                  success: true,
                  msg: 'Se actualizo los datos en la consulta de emergencia',
                  data: {
                    
                    estado_update: estado || update.estado,  
                    motivoConsulta: motivoConsulta || update.motivoConsulta,  
                    diagnostico: diagnostico || update.diagnostico,  
                    tratamiento: tratamiento || update.tratamiento, 
                    observaciones: observaciones || update.observaciones,                    
             
                  }
                })
              })
              .catch(error => {
                console.log(error)
                res.status(400).json({
                  success:false,
                  msg: "no se puedo actualizar los datos"
                })
              });
            })
            .catch(error =>{
              console.log(error)
              res.status(500).json({
                success:false,
                msg: "no se puedo actualizar los datos"
              })
            });
        }
      });   
        
    }
    //este serv es para traer datos de la emergecnia segun su id 
    static dataEmergecnai(req, res){                
      var id = req.params.id;  
      emergencia.findAll({
         where: {id: id},
         //attributes: ['id', 'nombreDoctor', 'apellidoD1','apellidoD2']
       }).then((data) => {
         res.status(200).json(data);
       });     
    }
    //datos de emeregencia segun id
    static emergenciaP(req, res){                
      var id = req.params.id;  
      emergencia.findAll({
         where: { id : id },
         
         include:[
             {model: Citas_Medicas,attributes: ['id'], 
             include:[{
              model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom','fechanacimiento','sexo']
             }
          
          ] }
         ]
       }).then((data) => {
         res.status(200).json(data);
      });     
    }
    
}

export default Emergencias

/* setTimeout(()=>{
  update();
},10000);
 */
setInterval(update, 60000 )  

function update (req, res){
  return emergencia                
  .findAll({
    where : { estado_update : 'true'}
  })
  .then(data => {
    if (data){
      
      for(var i = 0; i < data.length; i++){
        //console.log(data[i].id, " esto es el id de la farmacia")
        var estado = "false"
        return emergencia
        .findByPk(data[i].id)
        .then((data) => {
          data.update({
            estado_update: estado,                              
        })
        .then(update => {
          console.log (update, " Se actualizarion los datos")
        })
        .catch(error => {
            console.log(error)
            res.status(400).json({
              success:false,
              msg: "no se puedo actualizar los datos"
            })
          });
        })
        .catch(error =>{
          console.log(error)
          res.status(500).json({
            success:false,
            msg: "no se puedo actualizar los datos"
          })
        }); 
      } 
    }
   
  }); 
  
}