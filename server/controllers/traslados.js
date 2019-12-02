import model from '../models';

const { traslados } = model;
const { Pacientes } = model;
const { Internaciones } = model;


class Traslados {
    static create_traslado(req,res){
        const { historial,nombre_doctor,fecha_hora,enviado_de, operaciones,diagnostico_principal,otros_diagnosticos,causa_externa,id_internacio,id_medico,id_especialidad,hora } = req.body   
        
        const { id_paleta_internacion } = req.params

        if (id_internacio == "" || id_internacio == null){
            res.status(400).json({
                success: false,
                msg:"No se esta mandando el identificador de internacion"
            })
        }else{
            return Internaciones                
            .findAll({
                where : { id : id_internacio }
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
                        if (historial == "" || isNaN(historial) || nombre_doctor == "" || fecha_hora == "" || enviado_de == "" || diagnostico_principal == "" || id_internacio == "" || id_internacio == null || id_medico == "" || id_medico == null || id_especialidad == "" || id_especialidad == null || !hora ){
                            if(historial == "" || isNaN(historial)){
                                res.status(400).json({
                                    success: false,
                                    msg:"historial no se esta mandando o se esta mandando mal"
                                })
                            }else if (fecha_hora == ""){
                                res.status(400).json({
                                    success: false,
                                    msg:"Fecha y hora no es obligatorio"
                                })
                            }else if (enviado_de == ""){
                                res.status(400).json({
                                    success: false,
                                    msg:"No se esta enviando enviado de"
                                })
                            }else if (id_medico == "" || id_medico == null){
                                res.status(400).json({
                                    success: false,
                                    msg:"No se esta enviando el identificador del medico"
                                })
                            }else if (id_internacio == "" || id_internacio == null){
                                res.status(400).json({
                                    success: false,
                                    msg:"No se esta enviando el identificador de internacion"
                                })
                            }else if (id_especialidad == "" || id_especialidad == null){
                                res.status(400).json({
                                    success: false,
                                    msg:"Selecione area de traslado por favor"
                                })
                            }else if (!hora){
                                res.status(400).json({
                                    success: false,
                                    msg:"Hora es obligatorio"
                                })
                            }
                        }else{
                            return Pacientes                
                            .findAll({
                                where:{numeroHistorial:historial}
                            })
                            .then(data => {
                                if (data == ""){
                                    res.status(400).json({
                                        success:false,
                                        msg:"El numero de historail que esta mandando no pertenece a ningun paciente"
                                    })
                                }else{
                                    return traslados                
                                    .findAll({
                                        where:{ id_internacio : id_internacio }
                                    })
                                    .then(resp => {
                                        if(resp != ""){
                                            res.status(400).json({
                                                success : false,
                                                msg : "Ya se registro el traslado de este paciente"
                                            })
                                        }else{
                                            return traslados
                                            .create({
                                                historial,
                                                nombre_doctor,
                                                fecha_hora,
                                                hora,
                                                enviado_de,
                                                operaciones,
                                                diagnostico_principal,
                                                otros_diagnosticos,
                                                causa_externa,
                                                id_paleta_internacion,
                                                id_internacio,
                                                id_medico,
                                                id_especialidad
                                            })
                                            .then(data => {
                                                res.status(200).json({
                                                  success: true,
                                                  msg: "Se registraron los datos",
                                                  data
                                                })
                                            })
                                            .catch(error => {
                                                res.status(500).json({
                                                    success:false,
                                                    msg: "Algo salio mal con el servidor"
                                                })
                                            });
                                        }
                                    }); 
                                }
                            });   
                        }
                    }
                }
            })
        }
       

      
    
    }
    static list_traslados(req, res) {
        return traslados                
        .findAll()
        .then(data => res.status(200).send(data));                
    }

    //mostrar papeleta de internacion segun id
    static one_traslado(req, res) {
        const { id_traslado } = req.params
        return traslados                
        .findAll({
            where:{id: id_traslado}
        })
        .then(data => res.status(200).send(data));                
    }

    // ver traslado con el id de internacion
    static traslados_id_internacion(req, res) {
        const { id_internacio } = req.params
        return traslados                
        .findAll({
            where:{ id_internacio : id_internacio }
        })
        .then(data => res.status(200).send(data));                
    }

    static delete_traslado(req, res) {
        return traslados
        .findByPk(req.params.id)
        .then(data => {
          if (!data) {
            return res.status(400).send({
              message: 'no hay datos que eliminar',
            });
          }
          return data
            .destroy()
            .then(() => res.status(204).send({
                msg:'eliminado'
            }))
            .catch((error) => res.status(400).send(error));
        })
        .catch((error) => res.status(400).send(error));
    }
    //lis traslados especualidad
    static list_traslados_esp(req, res) {
        const { id_especialidad } = req.params
        return traslados                
        .findAll({
            where:{ id_especialidad : id_especialidad, estado : true }
        })
        .then(data => res.status(200).send(data));                
    }

    //list false traslado especialidad
    static list_traslados_esp_flase(req, res) {
        const { id_especialidad } = req.params
        return traslados                
        .findAll({
            where:{ id_especialidad : id_especialidad, estado : false }
        })
        .then(data => res.status(200).send(data));                
    }

    static estado_traslado(req,res){
        var estado = 'false';
        return traslados
        .findByPk(req.params.id_traslado)
        .then((data) => {
            data.update({
              estado : estado  || data.estado
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

    //ruta para poder actualizar un traslado
    static update_Traslado(req, res) {
     
        const {enviado_de, operaciones, diagnostico_principal,otros_diagnosticos,causa_externa,id_especialidad} = req.body
          traslados.findAll({
            where: {id: req.params.id}
          }).then((data) => {
            console.log(data[0].estado_upadte, "  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>XX")
            if (data[0].estado_upadte == false){
              res.status(400).json({
                success:false,
                msg:" Este formulario ya se actualizo "
              })
            }else{
              var estado = 'false'
              return traslados
                .findByPk(req.params.id)
                .then((data) => {
                  data.update({
                     
                    estado_upadte: estado,           
        
                    enviado_de: enviado_de || data.enviado_de,  
                    operaciones: operaciones || data.operaciones,  
                    diagnostico_principal: diagnostico_principal || data.diagnostico_principal,
        
                    otros_diagnosticos: otros_diagnosticos || data.otros_diagnosticos,  
                    causa_externa: causa_externa || data.causa_externa,  
                    id_especialidad: id_especialidad || data.id_especialidad
        
                  })
                  .then(update => {
                    res.status(200).send({
                      success: true,
                      msg: 'Se Modifico',
                      data: {                  
                        
                        enviado_de: enviado_de || update.enviado_de,  
                        operaciones: operaciones || update.operaciones,  
                        diagnostico_principal: diagnostico_principal || update.diagnostico_principal,
            
                        otros_diagnosticos: otros_diagnosticos || update.otros_diagnosticos,  
                        causa_externa: causa_externa || update.causa_externa,
                        id_especialidad: id_especialidad || update.id_especialidad
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
    

}
export default Traslados
