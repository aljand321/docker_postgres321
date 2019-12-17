import model from '../models';

    const { Camas } = model;
    const { Salas } = model;

    class Cama {
      static sendCama(req, res){
        const { descripcion, numeroCama } = req.body
        if(!descripcion || !numeroCama){
          res.status(400).json({
            success:false,
            msg:"Todos los campos son obligatorios"
          })
        }else{
          return Camas                
            .findAll({
              where:{ salaID: req.params.salaID, numeroCama : numeroCama }
            })
            .then(data => {
              if(data != ""){
                res.status(400).json({
                  success:false,
                  msg:"Ya existe ese numero de cama"
                })
              }else{
                const  { salaID }  = req.params
                return Camas
                .create({            
                  descripcion,
                  numeroCama,
                  salaID               
                })
                .then(data => res.status(200).send({
                    success: true,
                    msg: "Se inseto una cama",
                    data
                }))
                .catch(error => {
                  console.log(error);
                  res.status(500).json({
                    success:false,
                    msg:"No se pudo insertar los datos",
                    error
                  })
                })
              }
            });
         
        }       
      }
        // Servicio para para mostrar todas las camas
        static getCamas(req, res) {
            return Camas                
            .findAll()
            .then(data => res.status(200).send(data));                       
        }
        // Servicio para mostar camas segun la sala que le corresponda 
        static only(req, res){                
        var id = req.params.id;  
        Camas.findAll({
           where: {salaID: id, estado: true}
           //attributes: ['id', ['description', 'descripcion']]
         }).then((data) => {
           res.status(200).json(data);
         });     
        }
        //servcio para mostrar una cama para que sea actualizado
        static onlyCama(req, res){                
            var id = req.params.id;  
            Camas.findAll({
               where: {id: id}
               //attributes: ['id', ['description', 'descripcion']]
             }).then((data) => {
               res.status(200).json(data);
             });     
            }
        //servcio para actualizar una cama    
        static updateCama(req, res) {
            const { descripcion, numeroCama } = req.body
            return Camas
              .findByPk(req.params.id)
              .then((data) => {
                data.update({
                    descripcion: descripcion || data.descripcion,
                    numeroCama: numeroCama || data.numeroCama                    
                })
                .then(update => {
                  res.status(200).send({
                    message: 'Sala actualizado',
                    data: {
                      
                        descripcion: descripcion || update.descripcion,
                        numeroCama: numeroCama || update.numeroCama
                    }
                  })
                })
                .catch(error => res.status(400).send(error));
              })
              .catch(error => res.status(400).send(error));
          }

        //Servicio para elminar una cama
        static delCama(req, res) {
          return Camas
            .findByPk(req.params.id)
            .then(data => {
              if(!data) {
                return res.status(400).send({
                message: 'Cama no existe',
                });
              }
              return data
                .destroy()
                .then(() => res.status(200).send({
                  message: 'Cama se elimino con Exito'
                }))
                .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error))
        }

        //ruta para poder cambiar el estado de la cama y poder añadir el paciente con su historial clinico
        static CamaEstado(req,res){
          const { idCama } = req.params;
          const { historial } = req.params;
          var estado ;
          return Camas
          .findByPk(idCama)
          .then((data) => {
            data.update({
              historial: historial || data.historial,
              estado : estado  || data.estado == false             
            })
            .then(update => {
              res.status(200).send({
                success: true,
                msg: 'Se actualizo el estado de cama',
                data : {
                  historial: historial || update.historial,
                  estado : estado  || update.estado 
                }
              })
              .catch(error => {
                res.status(500).json({
                  success:false,
                  msg: "Algo sucedio con el servidor",
                  error
                })
              })
            })
            .catch(error => {
              res.status(500).json({
                success:false,
                msg: "Algo sucedio con el servidor",
                error
              })
            })
          })
        }

        //ruta para poder actulizar el estado una cama a false y quitar de esa cama a null
      static Update_cama_estado(req,res){
        const { idCama } = req.params;  
        const { estado, historial } = req.body;  
        if(!estado || !historial){
          if(!estado){
            res.status(400).json({
              success:false,
              msg:"No se esta mandando el estado"
            })
          }else if(!historial){
            res.status(400).json({
              success:false,
              msg:"No se esta mandando el historial"
            })
          }
        }else{
          return Camas
          .findByPk(idCama)
          .then((data) => {
            data.update({
              historial: historial || data.historial,
              estado : estado  || data.estado             
            })
            .then(update => {
              res.status(200).send({
                success:true,
                msg: 'Se actualizo el estado de cama',
                data : {
                  historial: historial || update.historial,
                  estado : estado  || update.estado 
                }
              })
              .catch(error => {
                console.log(error)
                res.status(500).json({
                  success:false,
                  msg: "No se pudo actualizar falla de servidor"
                })
              })
            })
            .catch(error => {
              console.log(error)
                res.status(500).json({
                  success:false,
                  msg: "No se pudo actualizar falla de servidor"
                })
            })
          })
        }        
      }
    }

export default Cama