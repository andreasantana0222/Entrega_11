const express = require('express');
const controller = require('./api/productos');
const handlebars = require('express-handlebars');

//libreria FS
const fs=require ('fs');


// creo una app de tipo express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.set("view engine", "ejs");
app.set("views", "./views");




// incorporo el router
const routerProducto = express.Router();
app.use('/api', routerProducto);

// indico donde estan los archivos estaticos
app.use(express.static('public'));

/// GET api/productos/listar-------------------------------------------------
routerProducto.get('/productos/listar',(req, res) => {
  try {
    //productos=controller.read();
    //console.log(productos.length);

    if(controller.read().length=0){
      res.type('json').send(JSON.stringify({error : 'no hay productos cargados'}, null, 2) + '\n');
    }else{
      res.type('json').send(JSON.stringify(controller.read(), null, 2) + '\n');
    }


    } catch (e) {
    console.error({error : 'no hay productos cargados'})
    res.status(500).send(JSON.stringify({error : 'no hay productos cargados'}));

  }
});



// GET api/mensajes/:id-------------------------------------------------
routerProducto.get('/mensajes/:id', async (req, res) => {

  try {

    if (req.params.id>controller.read().length || req.params.id<1){
      res.type('json').send(JSON.stringify({error : 'producto no encontrado'}, null, 2) + '\n');
    } else{
      let id=req.params.id-1;
      res.type('json').send(JSON.stringify(controller.read()[id], null, 2) + '\n');
    }
  } catch (e) {
    console.error({error : 'producto no encontrado'})
    res.status(500).send(JSON.stringify({error : 'producto no encontrado'}));
  }
});

// POST /api/productos/guardar-------------------------------------------------
routerProducto.post('/productos/guardar', async (req, res) => {

  try {
    let objeto=req.body;
    //return res.type('json').send(JSON.stringify(controller.save(objeto), null, 2) + '\n');
    controller.save(objeto);
    res.redirect('/api/productos/cargar');

  } catch (e) {
    console.error({error : 'error al guardar'})
    res.status(500).send(JSON.stringify({error : 'error al guardar'}));
  }

});


// PUT /api/productos/actualizar/:id-------------------------------------------------
routerProducto.put('/productos/actualizar/:id', async (req, res) => {

  try {

    if (req.params.id>controller.read().length || req.params.id<1){
      res.type('json').send(JSON.stringify({error : 'producto no encontrado'}, null, 2) + '\n');
    } else{
      let id=req.params.id;
      let objeto=req.body;
      return res.type('json').send(JSON.stringify(controller.update(id,objeto), null, 2) + '\n');
    }
  } catch (e) {
    console.error({error : 'producto no encontrado'})
    res.status(500).send(JSON.stringify({error : 'producto no encontrado'}));
  }
  });

  // DELETE /api/productos/borrar/:id-------------------------------------------------
  routerProducto.delete('/productos/borrar/:id', async (req, res) => {

    try {
      //console.log(`id ${req.params.id} `);
      //if (req.params.id>controller.read().length || req.params.id<1){
      if (req.params.id<1){
        res.type('json').send(JSON.stringify({error : 'producto no encontrado'}, null, 2) + '\n');
      } else{
        let id=req.params.id;
        //console.log(id);
        return res.type('json').send(JSON.stringify(controller.delete(id), null, 2) + '\n');
      }
    } catch (e) {
      console.error({error : 'producto no encontrado'})
      res.status(500).send(JSON.stringify({error : 'producto no encontrado'}));
    }
    });


/* ------------------------------------------------------------------*/
/* templates*/

/// GET api/productos/vista-------------------------------------------------
routerProducto.get('/productos/vista',(req, res) => {
  try {

    if(controller.read().length=0){
      res.type('json').send(JSON.stringify({error : 'no hay productos cargados'}, null, 2) + '\n');
    }else{
      //res.type('json').send(JSON.stringify(controller.read(), null, 2) + '\n');
      let data=controller.read();

        res.render('layouts/vistas', { hayProductos : true, productos:data});
    }


    } catch (e) {
    console.error({error : 'no hay productos cargados'})
    res.status(500).send(JSON.stringify({error : 'no hay productos cargados'}));

  }
});


// POST /api/productos/cargar-------------------------------------------------
routerProducto.get('/productos/cargar', async (req, res) => {

  try {
    //let objeto=req.body;
    //return res.type('json').send(JSON.stringify(controller.save(objeto), null, 2) + '\n');
      res.render('layouts/formulario');


  } catch (e) {
    console.error({error : 'error al guardar'})
    res.status(500).send(JSON.stringify({error : 'error al guardar'}));
  }

});


/* ------------------------------------------------------------------*/
/* FIN templates*/

// pongo a escuchar el servidor en el puerto indicado
const puerto = 8080;

const server = app.listen(puerto, () => {
    console.log(`servidor escuchando en http://localhost:${puerto}`);
});

// en caso de error, avisar
server.on('error', error => {
    console.log('error en el servidor:', error);
    res.status(500).send({error : 'ocurrió un error'});
});

//manejo de errores
app.use(function(err,req,res,next){
  console.error(err.stack);
  res.status(500).send({error : 'ocurrió un error'});
});
