import model from '../models';
const sequelize = require('sequelize');
const Op = sequelize.Op;
const { Pacientes } = model;
const { alergias } = model;

  class Paciente {
    static registroPaciente(req, res) {
      const {   numeroHistorial,nombre,apellidop,apellidom, ci, fechanacimiento, 
        sexo, estadocivil, direccion, zona, telef, ocupacion, idiomas, lugranacimiento, 
        departameto, provincia, municipio,id_user,tipoSangre } = req.body

        if(!numeroHistorial || isNaN(numeroHistorial) || !nombre || !apellidop || !sexo){

          if(!numeroHistorial || isNaN(numeroHistorial)){
            res.status(400).json({
              success:false,
              msg:"El historial no se esta mandando o se esta mandando mal"
            })
          }else if (!nombre){
            res.status(400).json({
              success:false,
              msg:"Nombre es obligatorio"
            })
          }else if (!apellidop){
            res.status(400).json({
              success:false,
              msg:"Apellido paterno es Obligatorio"
            })
          }else if (!sexo){
            res.status(400).json({
              success:false,
              msg:"Inserte si es hombre o mujer"
            })
          }
        }else{
          return Pacientes
          .findAll({
           where:{numeroHistorial : numeroHistorial}
          })
          .then( resp => {
            if( resp == "" ){

              return Pacientes
              .findAll({
               where:{ci : ci}
              })
              .then( datas => {
                if(datas == ""){
                  return Pacientes
                  .create({
                    numeroHistorial,
                    nombre,
                    apellidop,
                    apellidom,
                    ci,
                    fechanacimiento,
                    sexo,
                    estadocivil,
                    direccion,
                    zona,
                    telef,
                    ocupacion,
                    idiomas,
                    lugranacimiento,
                    departameto,
                    provincia,
                    municipio,
                    id_user,
                    tipoSangre
                   })
                    .then(pacienteData => res.status(201).send({
                      success: true,
                      msg: 'Paciente Creado',
                      pacienteData
                    }))
                }else{
                  res.status(400).json({
                    success:false,
                    msg:"El C.I. ya existe"
                  })
                }
              })            
            }else{
              res.status(400).json({
                success:false,
                msg:"Se esta repitiendo el numero de historial"
              })
            }
          });
        }
        
    }
  static getPaciente(req, res) {
    return Pacientes
    .findAll({
      include:[
        {model:alergias }
      ]
    })
    .then(Pacientes => res.status(200).send(Pacientes));
  }
  // lista de pacientes
  static list_only_pacientes(req, res) {
    return Pacientes
    .findAll()
    .then(Pacientes => res.status(200).send(Pacientes));
  }
  // lista de paceintes solo nombre
  static list_pacientes_name(req, res) {
    return Pacientes
    .findAll({
      attributes:['numeroHistorial','nombre','apellidop','apellidom', 'ci']
    })
    .then(Pacientes => res.status(200).send(Pacientes));
  }

  // alergias
  static paciente_alergias(req, res) {
    const{ id_paciente } = req.params
    return alergias
    .findAll({
      where: { id_paciente: id_paciente }
    })
    .then(Pacientes => res.status(200).send(Pacientes));
  }

//Only paciente
  static OnlyPaciente(req, res){
    var id = req.params.id;  
    Pacientes.findAll({
      where: {numeroHistorial : id}
        //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
          res.status(200).json(data);
        });  
  }

  static paciente_id(req, res){
    var id = req.params.id;  
    Pacientes.findAll({
      where: {id : id}
        //attributes: ['id', ['description', 'descripcion']]
        }).then((data) => {
          res.status(200).json(data);
        });  
  }
  static update_paciente_data(req, res) {
    const { estadocivil,ocupacion,zona,telef,tipoSangre } = req.body    
      return Pacientes
      .findByPk(req.params.id_paciente)
      .then((data) => {
        data.update({
          estadocivil: estadocivil || data.estadocivil,
          zona: zona || data.zona,  
          telef: telef || data.telef,  
          ocupacion: ocupacion || data.ocupacion,
          tipoSangre: tipoSangre || data.tipoSangre
         
        })
        .then(update => {
          res.status(200).send({
            success:true,
            msg: 'Datos actualizados',
            data: {                  
              estadocivil: estadocivil || update.estadocivil,
              zona: zona || update.zona,  
              telef: telef || update.telef,  
              ocupacion: ocupacion || update.ocupacion,
              tipoSangre: tipoSangre || data.tipoSangre
         
            }
          })
        })
        .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
    
    
  }

  ///***filtros de pacientes */
  static filter_pacientes(req, res) {
    const { fecha_inicio, fecha_final }  = req.body
    if(!fecha_final || !fecha_inicio){
        res.status(400).json({
            success:false,
            msg:"Inserte fecha inicio y fecha final  para poder buscar un rago de fechas"
        })
    }else{
        var _q = Pacientes;
        _q.findAll({
        where: {[Op.and]: [{createdAt: {[Op.gte]: fecha_inicio }}, {createdAt: {[Op.lte]: fecha_final }}]},
        })
        .then(datas => {
            if(datas == ""){
                res.status(400).json({
                    success:false,
                    msg:"No hay nada que mostrar"
                })
            }else{
                res.status(200).json(datas)
            }
            
        }); 
    }
  }

  static list_paciente_r(req, res) {
    return Pacientes
    .findAll({
      attributes:['id','numeroHistorial', 'nombre', 'apellidop', 'apellidom', 'ci', 'fechanacimiento', 'sexo']
    })
    .then(Pacientes => res.status(200).send(Pacientes));
  }
}
        
export default Paciente;