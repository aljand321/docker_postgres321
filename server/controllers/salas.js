import model from '../models';

const fetch = require('node-fetch');

const { Salas } = model;
const { Especialidad } = model;

//servicio para insertar salas con id de servicio
class Sala {
    static enviarSala(req, res){
        console.log(req.body, "esto es el cuerpo ")
        if(req.body.piso == ""){
            res.status(400).send("posrfavor introdusca un piso")
        }else{
          Especialidad.findAll({
            where: {nombre : req.body.nombre}
          })
          .then((datos) => {
            console.log(datos, " esto es datos")
            var id = datos[0].id;
            const { nombre, descripcionSala, piso } = req.body
            var  especialidadID  = id
            return Salas
            .create({
              nombre,
              descripcionSala,
              piso,
              especialidadID
            })
            .then(data => res.status(200).send({
                success: true,
                message: 'se inserto con exito',
                data
            }))
            .catch(error => res.status(400).send(error));
          })

        }

    }
    static enviarSala1(req, res){
      if (!req.body.nombre || !req.body.descripcionSala || !req.body.piso){
        res.status(400).send({
            success: false,
            msg: 'Todos los espacios son requeridos'
        })
    } else{
      fetch('http://localhost:4600/api/one_esp_nombre/'+req.body.nombre)
      .then(resp => resp.json())
      .then(resp =>{

        if(!resp){
          res.status(400).json({
            success: false,
            msg:"Esa especialidad no esta registrada"
          })
        }else{
          return Salas
          .findAll({
            where:{ nombre : req.body.nombre }
          })
          .then(sala => {
            if (sala != ""){
              for (var i = 0; i < sala.length; i++){
                if( sala[i].descripcionSala == req.body.descripcionSala ){
                  res.status(400).json({
                    success:false,
                    msg:"Ya existe la ubuacaión en esa descripción"
                  })
                }else{
                  const { nombre, descripcionSala, piso } = req.body
                  return Salas
                  .create({
                    nombre,
                    descripcionSala,
                    piso
                  
                  })
                  .then(data => {
                    res.status(200).json({
                      success: true,
                      msg: 'Datos Ingresados Correctamente.',
                      data
                    })
                  })
                  .catch(error => {
                    console.log(error)
                    res.status(400).json({
                      success:false,
                      msg:"No se pudo insertar correctamente",
                      error
                    })
                  });
                }
              }
            }else{
              const { nombre, descripcionSala, piso } = req.body
              return Salas
              .create({
                nombre,
                descripcionSala,
                piso
  
              })
              .then(data => {
                res.status(200).json({
                  success: true,
                  msg: 'Datos Ingresados Correctamente.',
                  data
                })
              })
              .catch(error => {
                console.log(error)
                res.status(400).json({
                  success:false,
                  msg:"No se pudo insertar correctamente",
                  error
                })
              });
            }
          })
          .catch(error => res.status(400).send(error));
           
        }
      }).
      catch( error => {
        console.log(error)
        res.status(500).json({
          success:false,
          msg:"No hay coneccion con el servidor",
          error
        })
      })

      /* const { nombre, descripcionSala, piso } = req.body
      return Salas
      .create({
        nombre,
        descripcionSala,
        piso
      })
        .then(data => res.status(200).send({
          success: true,
          message: 'se inserto con exito',
          data
      }))
      .catch(error => res.status(400).send(error)); */
    }


     /* fetch('http://localhost:4600/api/especialidad')
      .then(resp => resp.json())
      .then(resp =>{
          for(var i = 0; i< resp.length; i++){
            if(resp[i].nombre == req.body.nombre){

              var id = resp[i].id
              console.log(id , " id ")
              const { nombre, descripcionSala, piso } = req.body
              return Salas


          })
          .then(data => res.status(200).send({
              success: true,
              message: 'se inserto con exito',
              data
          }))
          .catch(error => res.status(400).send(error));
            }
          }
      })
      .catch(error => {
        console.error('Error:', error)
        res.send("no hay coneccion con el servidor");
      })
          /*console.log(datos[0].id)
          var id = datos[0].id;
          const { nombre, descripcionSala, piso } = req.body
          var  especialidadID  = id
          return Salas
          .create({
            nombre,
            descripcionSala,
            piso,
            especialidadID
          })
          .then(data => res.status(200).send({
              success: true,
              message: 'se inserto con exito',
              data
          }))
          .catch(error => res.status(400).send(error));*/


  }
    static listSala(req, res){
        return Salas
        .findAll()
        .then(sala => res.status(200).send(sala))
        .catch(error => res.status(400).send(error));
    }
     //para mostrar solo uno
    static one(req, res){
       var id = req.params.id;
       Salas.findAll({
           where: {id: id}
           //attributes: ['id', ['description', 'descripcion']]
         }).then((data) => {
           res.status(200).json(data);
         });
    }
    //para mostrar que salas tiene un servico
    static oneSala(req, res){
      var id = req.params.id;
      Salas.findAll({
          where: {especialidadID : id}
          //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
          res.status(200).json(data);
        });
   }

    //para mostrar que salas tiene un servico segun el nombre
    static oneSalaNombre(req, res){
      var especialidad = req.params.especialidad;
      Salas.findAll({
          where: {nombre : especialidad}
          //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
          res.status(200).json(data);
        });
   }

    static update(req, res) {
      const { nombre,descripcionSala, piso } = req.body
      return Salas
        .findByPk(req.params.id)
        .then((data) => {
          data.update({
            nombre: nombre || data.nombre,
            descripcionSala: descripcionSala || data.descripcionSala,
            piso: piso || data.piso
          })
          .then(update => {
            res.status(200).send({
              success:true,
              msg: 'Sala actualizada',
              data: {
                nombre: nombre || update.nombre,
                descripcionSala: descripcionSala || update.descripcionSala,
                piso: piso || update.piso
              }
            })
          })
          .catch(error => {
            console.log(error);
            res.status(400).json({
              success:false,
              msg:"No se pudo actualizar los datos"
            })
          });
        })
        .catch(error => {
          console.log(error);
          res.status(500).json({
            success:false,
            msg:"No se pudo actualizar los datos"
          });
        });
    }
      static del(req, res) {
        return Salas
          .findByPk(req.params.id)
          .then(data => {
            if(!data) {
              return res.status(400).send({
              message: 'Sala Not Found',
              });
            }
            return data
              .destroy()
              .then(() => res.status(200).send({
                message: 'Sala successfully deleted'
              }))
              .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error))
      }
}

export default Sala
