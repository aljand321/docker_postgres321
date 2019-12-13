import model from '../models';

const { Internaciones } = model;
const { PapeletaInternacion } = model;

const { Consultas } = model;
const { emergencia } = model;
const { Citas_Medicas } = model;
const { Pacientes } = model;

const { Camas } = model;
const { Salas } = model;

class Intern { 
  static Internacion(req,res){
    
    Pacientes.findAll({
      where: {numeroHistorial : req.body.historial}
    })
    .then((datos) => {
      if(datos ==""){
        res.status(400).json({
          success:false,
          msg:"Ese paciente no existe"
        })
      }else{
        
        const { historial, fechaIngreso, provieneDE, observacion, especialidad, sala, cama, doctor, diagnostico, id_especialidad, id_user } = req.body 
        if( !historial || isNaN(historial) || !fechaIngreso || !provieneDE || !especialidad || !sala || !cama || !doctor || !diagnostico ){
          if( !historial ){
            res.status(400).json({
              success:false,
              msg:"Historial no se esta mandando"
            })
          }else if (isNaN(historial)){
            res.status(400).json({
              success:false,
              msg:"Historial solo puede contener numeros"
            })
          }else if (!fechaIngreso){
            res.status(400).json({
              success:false,
              msg:"Fehca es obligatorio"
            })
          }else if(!provieneDE){
            res.status(400).json({
              success:false,
              msg:"Por favor indique el area de donde esta viniendo el paciente"
            })
          }else if (!especialidad){
            res.status(400).json({
              success:false,
              msg:"Inserte el area de internacion"
            })
          }else if (!sala){
            res.status(400).json({
              success:false,
              msg:"Inserte sala a la cual el paciente va estar internado"
            })
          }else if (!cama){
            res.status(400).json({
              success:false,
              msg:"Inserte la cama en la cual el paciente va estar internado"
            })
          }else if (!doctor){
            res.status(400).json({
              success:false,
              msg:"Inserte el nombre del doctor por favor"
            })
          }else if (!diagnostico){
            res.status(400).json({
              success:false,
              msg:"Inserte Diagnostico de prescripcion"
            })
          }
        }else{

          console.log(req.body);
         const { idCama } = req.params
          const { idPinternacion } = req.params
          var id_paciente = datos[0].id;
          return Internaciones
          .create({
            historial,
            fechaIngreso,
            provieneDE,
            observacion,
            especialidad,
            sala,
            cama,
            doctor,
            diagnostico,
            idCama,
            idPinternacion,
            id_paciente,
            id_especialidad,
            id_user
          })
          .then(data => {
            console.log(data, "<<<<<<<<<<<<<<<<                     <<<<<<<<<<<<<<<<<<< <<<<<<<<<<<<<<<< asda  <<<<<<<<<<<<<<<<<<<<<")
            res.status(200).json({
              success: true,
              msg: "Registrado en el area de " + especialidad,
              data
            })
          })
        }
        
      }
      
    })
    .catch(error => res.status(500).send(error))
      
  }
    // Servicio para para mostrar Internaciones
    static listInternaciones(req, res) {
        return Internaciones                
        .findAll()
        .then(data => res.status(200).send(data));                       
    } 


    //ruta para poder sacar una form internacion segun p internacion

    static One_form_Internacion(req, res){                
        const { id_Pinternacion } = req.params
        Internaciones.findAll({
           where: {idPinternacion: id_Pinternacion},
           //attributes: ['id', ['description', 'descripcion']]
           include:[
            { model: Camas, attributes:['id','numeroCama'],
           include:[
             {model:Salas, attributes:['id','descripcionSala']}
           ] }
          ]
         }).then((data) => {
           res.status(200).json(data);
         });     
    }

    static One_form_Internacion1(req, res){                
      const { id_Pinternacion } = req.params
      Internaciones.findAll({
         where: {id: id_Pinternacion},
         //attributes: ['id', ['description', 'descripcion']]
         include:[
          { model: Camas, attributes:['id','numeroCama'],
         include:[
           {model:Salas, attributes:['id','descripcionSala']}
         ] }
        ]
       }).then((data) => {
         res.status(200).json(data);
       });     
  }

    //esto elimina for internacion
    static delete_internacion(req, res) {
        const { id } = req.params
        return Internaciones
          .findByPk(id)
          .then(Internaciones => {
            if(!Internaciones) {
              return res.status(400).send({
              message: 'NO hay nada que eliminar',
              });
            }
            return Internaciones
              .destroy()
              .then(() => res.status(200).send({
                message: 'Se elimino con exito'
              }))
              .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error))
    }

    static list_internacion_paciente(req, res){                
      const { id_especialidad, historial } = req.params
      Internaciones.findAll({
         where: {id_especialidad: id_especialidad, historial: historial},
         //attributes: ['id', ['description', 'descripcion']]
         include:[
           { model: Camas, attributes:['id','numeroCama'],
          include:[
            {model:Salas, attributes:['id','descripcionSala']}
          ] }
         ]
       }).then((data) => {
         res.status(200).json(data);
       });     
    }

    //actualizar form  internacio
    static update_form_internacion(req, res) {
      var idCama = req.body.cama
      const { observacion,especialidad,sala,cama,diagnostico } = req.body

      console.log(req.body, " <<<<<<<<<<<<<<<<<<<<<<<<<<<<")

      var estado_update = 'false'
      return Internaciones
        .findByPk(req.params.id)
        .then((data) => { 
          data.update({
            estado_update: estado_update || data.estado_update,
            observacion: observacion || data.observacion,
            especialidad: especialidad || data.especialidad, 
            sala: sala || data.sala,
            cama: cama || data.cama,
          
            diagnostico: diagnostico || data.diagnostico,
            idCama: idCama || data.idCama     
          })
          .then(update => {
            res.status(200).send({ 
              success:true,             
              msg: 'Actualizado',
              data: {
                estado_update: estado_update || update.estado_update,
                observacion: observacion || update.observacion,
                especialidad: especialidad || update.especialidad, 
                sala: sala || update.sala,
                cama: cama || update.cama,
              
                diagnostico: diagnostico || update.diagnostico,
                idCama: idCama || update.idCama       
              }
            })
          })
          .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    }
    static One_Internacion(req, res){                
      const { id } = req.params
      Internaciones.findAll({
         where: {id: id},
         //attributes: ['id', ['description', 'descripcion']]
       }).then((data) => {
         res.status(200).json(data);
       });     
    }

    // ruta para poder mostrar una lista segun especialidad
    static list_internacion_especialidad(req, res){                
      const { id_especialidad } = req.params
      Internaciones.findAll({
         where: {estado_alta:false, id_especialidad: id_especialidad},
         //attributes: ['id', ['description', 'descripcion']]
        include:[{
          model:Pacientes
        }]

       }).then((data) => {
         res.status(200).json(data);
       });     
    }
    
    static list_internacion_especialidad_false(req, res){                
      const { id_especialidad } = req.params
      Internaciones.findAll({
         where: { estado_alta:true, id_especialidad: id_especialidad},
         //attributes: ['id', ['description', 'descripcion']]
        include:[{
          model:Pacientes
        }]

       }).then((data) => {
         res.status(200).json(data);
       });     
    }
  //ruta para poder mostrar una internacion segun id
  static One_intern(req, res){                
    const { id } = req.params
    Internaciones.findAll({
       where: {id: id},
       //attributes: ['id', ['description', 'descripcion']]
       include:[
         { model: Camas, attributes:['id','numeroCama'],
        include:[
          {model:Salas, attributes:['id','descripcionSala']}
        ] }
       ]
     }).then((data) => {
       res.status(200).json(data);
     });     
  }

  static update_estado_alta(req, res) {
    const { estado_alta } = req.body
    if(estado_alta == ""){
      res.status(400).json({
        success:false,
        msg:"No se esta mandando el estado"
      })
    }else{
      return Internaciones
      .findByPk(req.params.id)
      .then((data) => { 
        data.update({
          estado_alta: estado_alta || data.estado_alta,
        })
        .then(update => {
          res.status(200).send({ 
            success:true,             
            msg: 'Actualizado',
            data: {
              estado_alta: estado_alta || update.estado_alta,      
            }
          })
        })
        .catch(error => {
          console.log(error)
          res.status(500).json({
            success:false,
            msg:"No se puede actualizar, algo paso con el servidor"
          })
        });
      })
      .catch(error => {
        console.log(error)
        res.status(500).json({
          success:false,
          msg:"No se puede actualizar, algo paso con el servidor"
        })
      });
    }
    
  }

  /* 
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
                                  Traslados
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
  */
  static Internacion_of_traslado(req,res){
    
    Pacientes.findAll({
      where: {numeroHistorial : req.body.historial}
    })
    .then((datos) => {
      if(datos ==""){
        res.status(400).json({
          success:false,
          msg:"Ese paciente no existe"
        })
      }else{

        const { historial, fechaIngreso, provieneDE, observacion, especialidad, sala, cama, doctor, diagnostico, id_especialidad, id_user } = req.body 
        if(historial == "" || isNaN(historial) || fechaIngreso == "" || provieneDE == "" || especialidad == "" || especialidad == null || sala == "" || cama == "" || doctor == "" || diagnostico == ""){
          if(historial == ""){
            res.status(400).json({
              success:false,
              msg:"Historial no se esta mandando"
            })
          }else if (isNaN(historial)){
            res.status(400).json({
              success:false,
              msg:"Historial solo puede contener numeros"
            })
          }else if (fechaIngreso == ""){
            res.status(400).json({
              success:false,
              msg:"Fehca es obligatorio"
            })
          }else if(provieneDE == ""){
            res.status(400).json({
              success:false,
              msg:"Por favor indique el area de donde esta viniendo el paciente"
            })
          }else if (especialidad == "" || especialidad == null){
            res.status(400).json({
              success:false,
              msg:"Inserte el area de internacion"
            })
          }else if (sala == ""){
            res.status(400).json({
              success:false,
              msg:"Inserte sala a la cual el paciente va estar internado"
            })
          }else if (cama == ""){
            res.status(400).json({
              success:false,
              msg:"Inserte la cama en la cual el paciente va estar internado"
            })
          }else if (doctor == ""){
            res.status(400).json({
              success:false,
              msg:"Inserte el nombre del doctor por favor"
            })
          }else if (diagnostico == ""){
            res.status(400).json({
              success:false,
              msg:"Inserte Diagnostico de prescripcion"
            })
          }
        }else{
          const { idCama } = req.params
          const { id_traslado } = req.params
          var id_paciente = datos[0].id;
          return Internaciones
          .create({
            historial,
            fechaIngreso,
            provieneDE,
            observacion,
            especialidad,
            sala,
            cama,
            doctor,
            diagnostico,
            idCama,
            id_traslado,
            id_paciente,
            id_especialidad,
            id_user
          })
          .then(data => {
            res.status(200).json({
              success: true,
              msg: "Registrado en el area de " + especialidad,
              data
            })
          })
        }

      }

    })
    .catch(error => res.status(500).send(error))
  }

  // one traslado of internacion 
  static one_intern_of_traslado(req, res) {
    const { id_traslado } = req.params
    return Internaciones                
    .findAll({
      where:{id_traslado: id_traslado},
      include:[
        { model: Camas, attributes:['id','numeroCama'],
       include:[
         {model:Salas, attributes:['id','descripcionSala']}
       ] }
      ]
    })
    .then(data => res.status(200).send(data));                       
  } 
 }


 setInterval( update_time, 60000 )  

  function update_time (req,res){
    return Internaciones                
    .findAll({
      where: { estado_update : 'true' }
    })
    .then(data => {
      if(data != ""){
        for(var i = 0; i < data.length; i++){
          
          var estado_update = 'false'
          return Internaciones
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
export default Intern