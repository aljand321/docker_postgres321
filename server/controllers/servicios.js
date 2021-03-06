import model from '../models';
//import { QueryInterface } from 'sequelize/types';

    const { Especialidad } = model;
    const { Salas } = model;
    const { Camas } = model;
    
    class Servicio {
        static serv(req, res) {
            const { nombre,sigla,descripcion } = req.body
                return Especialidad
                .create({
                  nombre,
                  sigla,
                  descripcion
                })
                .then(serviceData => res.status(200).send ({
                    success: true,
                    message: 'servicio successfully created',
                    serviceData
                }))
        }
        //para mostrar todo
        static ver(req, res) {
          return Especialidad
            .findAll()
            .then(serv => res.status(200).send(serv))
            .catch(error => res.status(400).send(error));
          }
        //para mostrar solo uno
        static listOne(req, res){                
          var id = req.params.id;  
          console.log(id + " este es");
          Especialidad.findAll({
              where: {id: id}
              //attributes: ['id', ['description', 'descripcion']]
            }).then((one) => {
              res.status(200).json(one);
            });     
        }
        static modify(req, res) {
          const { nombre,sigla,descripcion } = req.body
          return Especialidad
            .findByPk(req.params.id)
            .then((data) => {
              data.update({
                  nombre: nombre || data.nombre,
                  sigla: sigla || data.sigla,
                  descripcion: descripcion || data.descripcion
              })
              .then(update => {
                res.status(200).send({
                  message: 'Servcio actualizado',
                  data: {
                    nombre: nombre || update.nombre,
                    sigla: sigla || update.sigla,
                    descripcion: descripcion || update.descripcion
                  }
                })
              })
              .catch(error => res.status(400).send(error));
            })
            .catch(error => res.status(400).send(error));
        }
        static delete(req, res) {
          return Especialidad
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
        //servicio para traer de especialidad sus salas, de salas sus camas que tiene
        static dataESC(req,res){
          
          Especialidad.findAll({
            
            //attributes: ['id','estado','codigo_p','hora','especialidad'],
            include: [
              { model: Salas, 
                include:[ { model: Camas } ]
              }
            ]
          }).then(users => {
            res.status(200).send(users)
          })
      }

    }

    


    export default Servicio;
