import model from '../models';

const { epicrisis } = model;
const { Pacientes } = model;
const { Internaciones } = model;


class Epicrisis{
    static reg_epicrisis(req,res){
        const { historial,Fecha_internacion,Fecha_alta,
          datos_clinicos,diagnostico_admicion,diagnostico_egreso,
          condicion_egreso,causa_egreso,examenes_complementario,
          tratamiento_quirurgico,tratamiento_medico,complicaciones,
          pronostico_vital,pronostico_funcional,control_tratamiento,
          recomendaciones,id_medico
        } = req.body;
        const { id_internacion } = req.params;

        return Internaciones                
          .findAll({
              where : { id : id_internacion }
          })
          .then(data => {
            if( data == "" ){
              res.status(400).json({
                  success:false,
                  msg:"No se puede registrar"
              })
            }else{
              if(data[0].estado_alta == true ){
                res.status(400).json({
                    success : false,
                    msg : "No se pude registrar, por que el paciente ya fue dado de alta"
                })
              }else{
                if( historial == "" || isNaN(historial) || Fecha_internacion == "" || Fecha_alta == "" || id_medico == "" || condicion_egreso == "" || causa_egreso == ""){
                  if(historial == ""){
                    res.status(400).json({
                      success:false,
                      msg:"Historail no se esta mandando"
                    })
                  }else if (isNaN(historial)){
                    res.status(400).json({
                      success:false,
                      msg:"Historial solo puede contener numeros"
                    })
                  }else if (Fecha_internacion == ""){
                    res.status(400).json({
                      success:false,
                      msg:"Fecha internacion es obligatorio"
                    })
                  }else if (Fecha_alta == ""){
                    res.status(400).json({
                      success:false,
                      msg:"Fecha de alta es obligatorio"
                    })
                  }else if (id_medico == ""){
                    res.status(400).json({
                      success:false,
                      msg:"Identificador del medico no se esta mandando"
                    })
                  }else if (condicion_egreso == ""){
                    res.status(400).json({
                      success:false,
                      msg:"Condicion de egreso es obligatorio"
                    })
                  }else if (causa_egreso == ""){
                    res.status(400).json({
                      success:false,
                      msg:"Causa de egreso"
                    })
                  }
                }else{
        
                  return epicrisis                
                  .findAll({
                    where:{ id_internacion : id_internacion }
                  })
                  .then(resp => {
                    if (resp != ""){
                      res.status(400).json({
                        success:false,
                        msg:"Ya se registro el alta de este paciente"
                      })
                    }else{
                      return Pacientes                
                      .findAll({
                        where:{ numeroHistorial : historial }
                      })
                      .then(data => {
                        if(data == ""){
                          res.status(400).json({
                            success:false,
                            msg:"Ese paciente no esta registrado"
                          })
                        }else {
                          
                          return epicrisis
                          .create({
                              historial,
                              Fecha_internacion,
                              Fecha_alta,
                  
                              datos_clinicos,
                              diagnostico_admicion,
                              diagnostico_egreso,
                  
                              condicion_egreso,
                              causa_egreso,
                              examenes_complementario,
                  
                              tratamiento_quirurgico,
                              tratamiento_medico,
                              complicaciones,
                  
                              pronostico_vital,
                              pronostico_funcional,
                              control_tratamiento,
                  
                              recomendaciones,
                              id_internacion,
                              id_medico
                          })
                          .then(data => res.status(200).send({
                              success: true,
                              msg: "Se insertaron los datos",
                              data
                          })) 
                        }
                      });
                    }
                  })
                } 
              }
            }
          })

                 
    }
     // Servicio para para mostrar emergencias
     static getEpicrisis(req, res) {
        return epicrisis                
        .findAll()
        .then(data => res.status(200).send(data));                       
    }

    //este servico es para mostrar las epicrisis del paciente segun el id de la internacion
    static Epicrisis_intenracion(req, res){                
       const { id_internacion } = req.params
       epicrisis.findAll({
           where: {id_internacion: id_internacion}
        }).then((data) => {
          res.status(200).json(data);
        });     
    }

    //ruta para poder actulizar en la tabla epicrisis
    static updateEpicrisis(req, res) {
     
      const { datos_clinicos,diagnostico_admicion,diagnostico_egreso,condicion_egreso,causa_egreso,examenes_complementario,tratamiento_quirurgico,tratamiento_medico,
        complicaciones,pronostico_vital, pronostico_funcional, control_tratamiento, recomendaciones } = req.body
        epicrisis.findAll({
          where: {id: req.params.id}
        }).then((data) => {
          console.log(data[0].estado_update, "  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>XX")
          if (data[0].estado_update == true){
            res.status(400).json({
              success:false,
              msg:" Este formulario ya se actualizo "
            })
          }else{
            var estado = 'true'
            return epicrisis
              .findByPk(req.params.id)
              .then((data) => {
                data.update({
                   
                  estado_update: estado,           
      
                  datos_clinicos: datos_clinicos || data.datos_clinicos,  
                  diagnostico_admicion: diagnostico_admicion || data.diagnostico_admicion,  
                  diagnostico_egreso: diagnostico_egreso || data.diagnostico_egreso,
      
                  condicion_egreso: condicion_egreso || data.condicion_egreso,  
                  causa_egreso: causa_egreso || data.causa_egreso,  
                  examenes_complementario: examenes_complementario || data.examenes_complementario, 
      
                  tratamiento_quirurgico: tratamiento_quirurgico || data.tratamiento_quirurgico, 
                  tratamiento_medico: tratamiento_medico || data.tratamiento_medico ,
                  complicaciones: complicaciones || data.complicaciones ,
                  
                  pronostico_vital: pronostico_vital || data.pronostico_vital,
                  pronostico_funcional: pronostico_funcional || data.pronostico_funcional,
                  control_tratamiento: control_tratamiento || data.control_tratamiento,
      
                  recomendaciones: recomendaciones || data.recomendaciones,
      
                })
                .then(update => {
                  res.status(200).send({
                    success: true,
                    msg: 'Se Modifico',
                    data: {                  
                      
                      datos_clinicos: datos_clinicos || update.datos_clinicos,  
                      diagnostico_admicion: diagnostico_admicion || update.diagnostico_admicion,  
                      diagnostico_egreso: diagnostico_egreso || update.diagnostico_egreso,
      
                      condicion_egreso: condicion_egreso || update.condicion_egreso,  
                      causa_egreso: causa_egreso || update.causa_egreso,  
                      examenes_complementario: examenes_complementario || update.examenes_complementario, 
      
                      tratamiento_quirurgico: tratamiento_quirurgico || update.tratamiento_quirurgico, 
                      tratamiento_medico: tratamiento_medico || update.tratamiento_medico ,
                      complicaciones: complicaciones || update.complicaciones ,
      
                      pronostico_vital: pronostico_vital || update.pronostico_vital,
                      pronostico_funcional: pronostico_funcional || update.pronostico_funcional,
                      control_tratamiento: control_tratamiento || update.control_tratamiento,
      
                      recomendaciones: recomendaciones || update.recomendaciones,
                    }
                  })
                })
                .catch(error => {
                  console.log(error)
                  res.status(400).json({
                    success:false,
                    msg:"No se pudo actualizar los datos"
                  })
                });
              })
              .catch(error => {
                console.log(error)
                res.status(500).json({
                  success:false,
                  msg:"No se puede actualizar los datos error de servidor"
                })
              });
          }
        });
     
    }

    // ruta para poder borrar epicrisis
    static deleteEpicrisis(req, res) {
      return epicrisis
        .findByPk(req.params.id)
        .then(data => {
          if(!data) {
            return res.status(400).send({
            message: 'Book Not Found',
            });
          }
          return data
            .destroy()
            .then(() => res.status(200).send({
              message: 'Successfully deleted'
            }))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error))
    }
}


setInterval( update_time, 60000000 )  

  function update_time (req,res){
    return epicrisis                
    .findAll({
      where: { estado_update : 'false' }
    })
    .then(data => {
      if(data != ""){
        for(var i = 0; i < data.length; i++){
          
          var estado_update = 'true'
          return epicrisis
            .findByPk(data[i].id)
            .then((data) => { 
              data.update({
                estado_update: estado_update || data.estado_update                  
              })
              .then(update => {
                console.log(update.estado_update)  
              })
              .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        }
      }
    });    
  }

export default Epicrisis