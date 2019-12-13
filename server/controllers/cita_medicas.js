const fetch = require('node-fetch');
const sequelize = require('sequelize');
var sequelize1 = require("../models/index");
const Op = sequelize.Op;

import model from '../models';

const { Citas_Medicas } = model;
const { Pacientes } = model;

class Citas_medica {
    
    static reg_cita(req, res) {
     
      if(req.body.especialidad == null){
        res.status(400).json({
          success:false,
          msg : "Por favor selecione consultorio"
        })
      }else if(req.body.medico == null){
        res.status(400).json({
          success:false,
          msg : "Selecione medico por favor"
        })
      }else if(req.body.turno == null){
        res.status(400).json({
          success:false,
          msg : "Selecione turno por favor"
        })
      }else if(req.body.saldo_total == null || isNaN(req.body.saldo_total)){
        res.status(400).json({
          success:false,
          msg : "Saldo solo puede contener numeros"
        })
      }else if(req.body.hora == null){
        res.status(400).json({
          success:false,
          msg : "Por Favor inserte hora"
        })
      }      
      else{
        fetch('http://localhost:4600/api/nombreConsulta_especilidad/'+req.body.especialidad)
        .then(resp => resp.json())
        .catch(error => console.error('Error',error))
        .then(resp => {
          if(resp != ""){
            const { numero_ficha,estado,codigo_p,turno,medico,especialidad,hora,saldo_total,id_user,id_medico } = req.body
            const { id_Paciente } = req.params;
            var id_especialidad = resp[0].id
            return Citas_Medicas
              .create({
                numero_ficha,
                estado,            
                codigo_p,
                turno,
                medico,
                especialidad,
                hora,
                saldo_total,
                id_especialidad,
                id_Paciente,
                id_user,
                id_medico
              })
               .then(cita_pData => res.status(201).send({
                  success: true,
                  message: 'cita  creado',
                  cita_pData
              }))
            }else{
              res.status(400).json({
                success:false,
                msg : "Esa consulta no esta registrada en la base de datos"
              })
            }
          
        })
      }
        
    }
    static getCitas(req, res) {
      return Citas_Medicas
      .findAll()
      .then(Citas_Medicas => res.status(200).send(Citas_Medicas));
    }

    static reporte_citas(req, res) {
      /* const { turno } = req.params
      return Citas_Medicas
      .findAll({
        where:{turno: turno, }
      })
      .then(Citas_Medicas => res.status(200).send(Citas_Medicas)); */
      const { id_medico } = req.params;
      const { fecha_inicio, fecha_final, turno, id_esp } = req.body
      if(!fecha_inicio || !fecha_final || !turno || !id_esp ){
        console.log("todo obligado")
        res.status(400).json({
          success:false,
          msg:"Tdos los campos son obligatorios"
        })
      }else{
        console.log("todo paso")
        Citas_Medicas.findAll({
          where: {[Op.and]: [{id_medico: {[Op.eq]: id_medico}}, {turno: {[Op.eq]: turno}}, 
          {id_especialidad: {[Op.eq]: id_esp}}, {createdAt: {[Op.gte]: fecha_inicio}}, 
          {createdAt: {[Op.lte]: fecha_final}}]}
        })      
        .then(data => {
            res.status(200).json(data)       
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({
                success:false,
                msg: "no se pudo mostrar los datos",
                error:error
            })
        })   
      }   
    }

     //rescatar cita medica segun historial
      static oneCita(req, res){                
       var id = req.params.id;  
       Citas_Medicas.findAll({
           where: {codigo_p: id}
           //attributes: ['id', ['description', 'descripcion']]
         }).then((Citas) => {
           res.status(200).json(Citas);
         });     
      }
      //serv para mostrar una cita medica con su id
      static OnlyCita(req, res){                
        var id = req.params.id;  
        Citas_Medicas.findAll({
            where: {id: id}
            //attributes: ['id', ['description', 'descripcion']]
          }).then((Citas) => {
            res.status(200).json(Citas);
          });     
       }

      //serv que muestra si es consulta medica o solo emergencia
      static citaLugar(req,res){
        var url = req.params.id;
        
        Citas_Medicas.findAll({
          where : { especialidad : url }
        })
        .then((data) => {
          res.status(200).send(data);
        })
      }
      //serv para traer datos de dos tablas cita medica y paciente
      static TwoTables(req,res){
        var url = req.params.id;
        console.log(url,"  <<<<<<<<<<<<<<<<esto quiero")
        Citas_Medicas.findAll({
          where : { especialidad : url, estado: "true" }, // el url es para identificar si es emergencia o consulta medica
          attributes: ['id','estado','codigo_p','hora','especialidad'],
          include: [
            {model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom'] }
          ]
        }).then(users => {
          res.status(200).send(users)
        })
      }
      //serv para traer datos de dos tablas cita medica y paciente
      static TwoTablesFalse(req,res){
        var url = req.params.id;
        Citas_Medicas.findAll({
          where : { especialidad : url, estado: "false" },
          attributes: ['id','estado','codigo_p','hora','especialidad'],
          include: [
            {model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom'] }
          ]
        }).then(users => {
          res.status(200).send(users)
        })
      }
      //serv para camviar el estado de cita_medica
      static estado(req,res){
        var estado1 = 'false';
        return Citas_Medicas
        .findByPk(req.params.id)
        .then((data) => {
          data.update({
            estado : estado1
          })
          .then(update => {
            res.status(200).send({
              message: 'se actualizo el estado',
              data : {
                estado : estado  || update.estado 
              }
            })
            .catch(error => res.status(400).send(error))
          })
          .catch(error => res.status(400).send(error))
        })
        /*var id = req.params.id;
        Citas_Medicas.findAll({
          where : { id : id }
        })
        .then((data) => {
          data.estado = false;
          var estado = data.estado;
          res.send(estado)
        })*/
      }

      //para sacar las citas del paciente
      static CitasPaciente(req, res){                
        var id = req.params.id;  
        Citas_Medicas.findAll({
            where: {id_Paciente: id}
            //attributes: ['id', ['description', 'descripcion']]
          }).then((Citas) => {
            res.status(200).json(Citas);
          });     
       }

       static updateCita(req, res) {
        const { estado,codigo_p,turno,medico,especialidad,hora,saldo_total,id_medico, estado_update } = req.body
        return Citas_Medicas
          .findByPk(req.params.id)
          .then((data) => {
            data.update({
              estado: estado || data.estado,
              estado_update: estado_update || data.estado_update,
              codigo_p: codigo_p || data.codigo_p,  
              turno: turno || data.turno,  
              medico: medico || data.medico,  
              especialidad: especialidad || data.especialidad,  
              hora: hora || data.hora,  
              saldo_total: saldo_total || data.saldo_total,
              id_medico:id_medico || data.id_medico  
            })
            .then(update => {
              res.status(200).send({
                message: 'Cita actualizado',
                data: {
                  
                  estado: estado || update.estado,
                  estado_update: estado_update || update.estado_update,
                  codigo_p: codigo_p || update.codigo_p,  
                  turno: turno || update.turno,  
                  medico: medico || update.medico,  
                  especialidad: especialidad || update.especialidad,  
                  hora: hora || update.hora,  
                  saldo_total: saldo_total || update.saldo_total,  
                  id_medico:id_medico || update.id_medico  

                }
              })
            })
            .catch(error => res.status(400).send(error));
          })
          .catch(error => res.status(400).send(error));
    }

      /*static OnlyCita(req, res){                
        var id = req.params.id;  
        Citas_Medicas.findAll({
            where: {codigo_p: id }
            //attributes: ['id', ['description', 'descripcion']]
          }).then((Citas) => {
            res.status(200).json(Citas);
          });     
       }*/
  static lista_pacienteDoctor(req,res){
    const { id_medico } = req.params
    Citas_Medicas.findAll({
      where : { id_medico : id_medico, estado: "true" }, // el url es para identificar si es emergencia o consulta medica
      //attributes: ['id','estado','codigo_p','hora','especialidad'],
      include: [
        {model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom'] }
      ]
    }).then(users => {
      
      res.status(200).send(users)
    })
  }

  static lista_pacienteDoctor_false(req,res){
    const { id_medico } = req.params
    Citas_Medicas.findAll({
      where : { id_medico : id_medico, estado: "false" }, // el url es para identificar si es emergencia o consulta medica
      //attributes: ['id','estado','codigo_p','hora','especialidad'],
      include: [
        {model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom'] }
      ]
    }).then(users => {
      res.status(200).send(users)
    })
  }
  //rutas para poder ver la lista de citas de emergencia
  static lista_emergencia (req,res){
    const { id_medico } = req.params
    Citas_Medicas.findAll({
      where : { id_medico : id_medico, estado: 'true', especialidad: 'CONSUL. EMERGENCIA' }, // el url es para identificar si es emergencia o consulta medica
      //attributes: ['id','estado','codigo_p','hora','especialidad'],
      include: [
        {model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom'] }
      ]
    }).then(users => {
      res.status(200).send(users)
    }) 
  }

  static lista_emergencia_false (req,res){
    const { id_medico } = req.params
    Citas_Medicas.findAll({
      where : { id_medico : id_medico, estado: 'false', especialidad: 'CONSUL. EMERGENCIA' }, // el url es para identificar si es emergencia o consulta medica
      //attributes: ['id','estado','codigo_p','hora','especialidad'],
      include: [
        {model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom'] }
      ]
    }).then(users => {
      res.status(200).send(users)
    }) 
  }

  static lista_consultas (req,res){
    const { id_medico } = req.params;
    const { fecha_inicio, fecha_final } = req.body
    if(!fecha_inicio || !fecha_final){
      res.status(400).json({
        success:false,
        msg:"Tdos los campos son obligatorios"
      })
    }else{
      Citas_Medicas.findAll({
        where: {[Op.and]: [{id_medico: {[Op.eq]: id_medico}}, {estado: {[Op.eq]: 'false'}}, 
        {especialidad: {[Op.eq]: 'CONSUL. EMERGENCIA'}}, {createdAt: {[Op.gte]: fecha_inicio}}, 
        {createdAt: {[Op.lte]: fecha_final}}]},
        include: [
          {model: Pacientes, attributes: ['id','nombre', 'apellidop','apellidom'] }
        ]
      })      
      .then(data => {
          res.status(200).json(data)       
      })
      .catch(error => {
          console.log(error)
          res.status(500).json({
              success:false,
              msg: "no se pudo mostrar los datos",
              error:error
          })
      })   
    }    
    
  }

  

  //pruebas
  static get_pruebas(req, res) {
    return Citas_Medicas
    .findAll({
      where: {
        estado: 'false',
        [Op.not]: [
          { especialidad: 'EMERGENCIA' },
          //{ array: { [Op.contains]: [3,4,5] } }
        ]
      }
    })
    .then(Citas_Medicas => res.status(200).send(Citas_Medicas));
  }

 

}


export default Citas_medica;
