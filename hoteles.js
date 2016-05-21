var repoHTML = "<input type='text' name='repo' placeholder='Repositorio'  " +
    "class='repo' size='20' />" +
    "<input type='text' name='fich' placeholder='Nombre del fichero' " +
    "class='fich' size='20' /><br>" +
    "<button class='getRepo' type='button'>Guardar</button>" ;

var carHTML = "<input type='text' name='repo' placeholder='Repositorio' " +
              "class='repo1' size='20' />" +
              "<input type='text' name='fich' placeholder='Nombre del fichero' " +
              "class='fich1' size='20' /><br>" +
              "<button class='getfich' type='button'>Cargar</button>" ;
var github;
var myrepo;
var fichero;
var apiKey = 'AIzaSyDzM5k0TeFGorK0APMnYhXw0v64gw9zZmk';
var nombre_colecciones = [];
var marcadores = []
var availableTags = []
var arrayColecciones = new Array();
var arrayAlojados = new Array();
var miObjeto = new Object();
miObjeto.items = arrayColecciones
miObjeto.alojados = arrayAlojados

function show_accomodation(){

  var accomodation = accomodations[$(this).attr('no')];
  var direccion = accomodation.geoData.address;
  var url = accomodation.basicData.web;
  var lat = accomodation.geoData.latitude;
  var lon = accomodation.geoData.longitude;
  var name = accomodation.basicData.name;
  var desc = accomodation.basicData.body;
  var img = accomodation.multimedia.media;
  var existe = false;
  $(".clase1 span").attr({
    'style': "background-color: inherit"
  })
  $("span",this).attr({
    'style': "background-color: gray;color:white;"
  })
  if(img[0] != undefined){
      $('.desc2').html('<h2>' + name + '</h2>' + '<p>Address:'+ direccion + '</p>' + desc + '<img src="'+img[0].url+'">')
      descripcion = '<h2>' + name + '</h2>' + '<p>Direccion:'+ direccion + '</p>' + desc
      descripcion = descripcion + "<div id='myCarousel' class='carousel slide' data-ride='carousel'>"
      for (x=0;x<img.length;x++){
        if(x==0){
          descripcion = descripcion + '<div class="carousel-inner" role="listbox"><div class="item active">'
          descripcion = descripcion + '<img class="first-slide" src="'+img[x].url+'" alt="slide"></div>'
        }else{
          descripcion = descripcion + '<div class="item">'
          descripcion = descripcion + '<img class="first-slide" src="'+img[x].url+'" alt="slide"></div>'
        }
      }
      descripcion = descripcion + '</div> <a class="left carousel-control" href="#myCarousel" role="button" data-slide="prev">'
      descripcion = descripcion + '<span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span>'
      descripcion = descripcion + '<span class="sr-only">Previous</span></a><a class="right carousel-control" href="#myCarousel" role="button" data-slide="next">'
      descripcion = descripcion + '<span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></a></div>'
    }else{
      descripcion = '<h2>' + name + '</h2>' + '<p>Direccion:'+ direccion + '</p>' + desc
      $('.desc2').html(descripcion);
    }
    for(var i = 0; i < marcadores.length; i++){
        if(marcadores[i]._latlng.lat==lat && marcadores[i]._latlng.lng==lon){
            console.log("Encontrado");
            existe = true;
            marcadores[i].openPopup();
            break;
        }
    }
    if(existe == false){
      var marcador = L.marker([lat, lon]).addTo(map)
    	 .bindPopup('<li class="clase2" no="'+$(this).attr('no')+'">' + name + "</li><input type='button' value='Cerrar marcador'class='marker-delete-button'/>")
       .on("popupopen", onPopupOpen)
       .on("click",function(){
         var aux = $.parseHTML( this.getPopup()._content )
         var pepa = $(aux).attr('no');
         console.log(pepa);
         aux.f=show_accomodation;
         aux.f();
         //$(".clase2").click(show_accomodation)
       })
    	 .openPopup();
       marcadores.push(marcador);
    }
    map.setView([lat, lon], 11);
   $('.desc').html(descripcion);
   document.getElementById("mensaje").style.display = "none";
   makeApiCall(name, false , fichero, false);

};
function onPopupOpen() {

    var tempMarker = this;

    $(".marker-delete-button:visible").click(function () {
        map.removeLayer(tempMarker);
        var lat = tempMarker._latlng.lat
        var lon = tempMarker._latlng.lng
        for(var i = 0; i < marcadores.length; i++) {
           if(marcadores[i]._latlng.lat==lat && marcadores[i]._latlng.lng==lon){
               marcadores.splice(i, 1);
               break;
           }
       };

    });
}
function get_accomodations(){
  document.getElementById("cargar1").style.display = "none";
  document.getElementById("cargar2").style.display = "none";
  document.getElementById("cargar3").style.display = "none";
  document.getElementById("alojamientos").style.display = "block";
  document.getElementById("etiqueta2").style.display = "block";
  document.getElementById("etiqueta3").style.display = "block";
  document.getElementById("elementos").style.display = "block";
  document.getElementById("cuadro1").style.display = "block";
  document.getElementById("cuadro2").style.display = "block";
  $.getJSON("alojamientos.json", function(data) {
    accomodations = data.serviceList.service
    var list = ''
    list = list + '<ul>'
    for (var i = 0; i < accomodations.length; i++) {
      list = list + '<li class="clase1" no=' + i + '><span>' + accomodations[i].basicData.title + '</span></li>';
    }
    list = list + '</ul>';
    $('#list1').html(list);

    var lista = '<p>Elige tu hotel (arrastra a tu coleccion)</p>'

    for (var i = 0; i < accomodations.length; i++) {
      lista = lista + '<div id="" class="draggable ui-widget-content">' + accomodations[i].basicData.title + '</div>';
      availableTags.push(accomodations[i].basicData.title);
    }
    $('#list2').html(lista);
    $( ".draggable" ).draggable({revert: true, helper: 'clone'});
    $('.clase1').click(show_accomodation);
    $( "#alojamiento" ).autocomplete({
      source: availableTags
    });
  });
};
function add_collection(nombre, hoteles){

  var contenido = ""

  if(nombre != "" && (nombre_colecciones.indexOf(nombre) == -1)){
    var coleccion = new Object();
    coleccion.title = nombre
    coleccion.hoteles = [];
    arrayColecciones.push(coleccion);
    nombre_colecciones.push(nombre);
    for (z=0;z<arrayColecciones.length;z++){
      if(arrayColecciones[z].title == nombre){
          for (x=0;x<hoteles.length;x++){
            arrayColecciones[z].hoteles.push(hoteles[x]);
            contenido = contenido + hoteles[x] + "<br>"
          }
          break;
      }
    }
    $("#accordion").append("<div id='"+nombre+'Ac0r'+"'><h3>" + nombre + '</h3>'
    + '<div class="acordeon"><div id="'+nombre+ "dr0p" +'" class="droppable ui-widget-header"><p>Arrastra aqui</p>'
    +'<span style="color:black">'+contenido+'</span></div></div></div>');

    $("#colec").append("<div id='"+nombre+'Ac1r'+"'><h3>" + nombre + '</h3>'
    + '<div class="acordeon2"><p><u>Alojamientos:</u></p><span style="color:black">'+contenido+'</span></div></div></div>');
    $(function() {
      $( "#" + nombre + "Ac0r" ).accordion({active: false,collapsible: true});
      $( "#" + nombre + "Ac1r" ).accordion({active: false,collapsible: true});
    });

    $( "#" + nombre + "dr0p" ).droppable({
      drop: function( event, ui ) {
        var encontrado = false;
        for (x=0;x<arrayColecciones.length;x++){
          if(arrayColecciones[x].title == nombre){
            for(z=0;z<arrayColecciones[x].hoteles.length;z++){
              if(arrayColecciones[x].hoteles[z] == ui.draggable.text()){
                encontrado  = true;
                break;
              }
            }
            if(encontrado == false){
              arrayColecciones[x].hoteles.push(ui.draggable.text())
              break;
            }else{
              break;
            }
          }
        }
        if(encontrado == false){
            ui.draggable.css("background-color", "#ddd");
            $( ".droppable" ).attr({
                'style': "background: #fffa90;color: #777620;border: 1px solid #dad55e",
            });
            $( this ).addClass( "ui-state-highlight" ).find( "span" ).append( ui.draggable.text() + "<br>" );
            $("#"+nombre+"Ac1r").find("span").append(ui.draggable.text() + "<br>")
        }
      }
    });
  }
}
function getToken() {
    var valor = $(this).attr("id");
    var token = $("#token" + valor).val();
    console.log(valor);
    console.log ("guardar: "+token);
    github = new Github({
	     token: token,
	      auth: "oauth"
    });
    $(".borguar").empty();
    $(".repoform" + valor).html(repoHTML)
    $(".getRepo").click(getRepo);
};
function getToken1() {
  var valor = $(this).attr("id");
  var token = $("#token" + valor).val();
  console.log (token);
    github = new Github({
	     token: token,
	      auth: "oauth"
    });
    $(".borcar").empty();
    $(".repocargar" + valor).html(carHTML)
    $(".getfich").click(readFile);
};
function getRepo() {
    var reponame = $(".repo").val();
    fichero = $(".fich").val();
    console.log(reponame);
    console.log(fichero);
    myrepo = github.getRepo("arotena", reponame);
    myrepo.write('master', fichero,
        JSON.stringify(miObjeto),
        "Updating data", function(err) {
          if(err != null){
            alert("Ha ocurrido un error al guardar");
          }else{
            $( ".formulario" ).attr({
                        'style': "display:none;",
                      });
            $( ".draggable" ).attr({
                        'style': "background-color:#CCE5FF",
                      });
            $( ".droppable" ).attr({
                        'style': "background-color:#e9e9e9;color: #333333;border: 1px solid #dddddd;",
                      });
          }
     });

     $(".borguar").empty();
};
function cargar(){
  $(".borcar").empty();
  $( ".formucargar" ).attr({
              'style': "display:block;",
            });

  $( ".formulario" ).attr({
              'style': "display:none;",
            });
}
function readFile() {
  var reponame = $(".repo1").val();
  fichero = $(".fich1").val();
  var error = false;
  console.log(reponame);
  console.log(fichero);
  myrepo = github.getRepo("arotena", reponame);

  $("#colec").empty();
  $("#accordion").empty();
  nombre_colecciones = [];
  arrayColecciones.length = 0;
  arrayAlojados.length = 0;
  myrepo.read('master', fichero, function(err, data) {
      if(err != null){
        alert("Ha ocurrido un error al cargar los datos");
        error = true;
      }else{
          var obj = JSON.parse(data);
          $.each( obj.items, function( key, hotel) {
              add_collection(hotel.title,hotel.hoteles)
          });
          document.getElementById("colec").style.display = "block";
          $( ".formucargar" ).attr({
                      'style': "display:none;",
                    });
          $( ".leerfich" ).attr({
                      'style': "display:none;",
                    });
          $( ".anadir" ).attr({
                      'style': "display:block;",
                    });
          makeApiCall("", true, fichero,false);
       }
  });

    $(".borcar").empty();
};

function sacar_nombre(){
  var t2 = document.getElementById("nombre");
  add_collection(t2.value, "");
}

function sacar_id(){
  var id = document.getElementById("idplus");
  var alo = document.getElementById("alojamiento");
  var encontrado = false;
  var esta = false;
  if(id.value != "" && alo.value != ""){
      for (x=0;x<arrayAlojados.length;x++){
        if(arrayAlojados[x].title == alo.value){
          for (i=0;i<arrayAlojados[x].hospedados.length;i++){
            if(arrayAlojados[x].hospedados[i] == id.value){
              esta = true;
              break;
            }
          }
          if(esta == false){
            arrayAlojados[x].hospedados.push(id.value);
          }
          encontrado = true;
          break;
        }
      }
      if(encontrado == false){
        var user = new Object();
        user.title = alo.value//hotel
        user.hospedados = [];//id plus
        user.hospedados.push(id.value)
        arrayAlojados.push(user);

      }
      if(esta == false){
          gapi.client.setApiKey(apiKey);
          gapi.client.load('plus', 'v1', function() {
                var request = gapi.client.plus.people.get({
                  'userId': id.value
                  // For instance:
                  // 'userId': '+GregorioRobles'
                });
                request.execute(function(resp) {
                  var heading = document.createElement('h4');
                  var image = document.createElement('img');

                  image.src = resp.image.url;
                  heading.appendChild(image);
                  heading.appendChild(document.createTextNode(" " +resp.displayName+" ("+alo.value+")"));

                  document.getElementById('usuarios').appendChild(heading);
                });
          });
        }
    }
}
function save(){
  $(".borguar").empty();
  $( ".formulario" ).attr({
              'style': "display:block;",
            });
  $( ".formucargar" ).attr({
              'style': "display:none;",
            });

}
function makeApiCall(nombre_hotel, todos, namefich, vertodos) {
  gapi.client.setApiKey(apiKey);
  $("#usuarios").empty();
  myrepo.read('master', namefich, function(err, data) {
      var obj = JSON.parse(data);
      $.each( obj.alojados, function( key, huesped) {
          if(todos || huesped.title == nombre_hotel){
            if(todos == true){
              if(vertodos == false){
                var user = new Object();
                user.title = huesped.title//hotel
                user.hospedados = huesped.hospedados;//id plus
                arrayAlojados.push(user);
              }
            }
            gapi.client.load('plus', 'v1', function() {
              for (x=0;x<huesped.hospedados.length;x++){
                  var usuario = huesped.hospedados[x]

                  var request = gapi.client.plus.people.get({
                    'userId': usuario
                    // For instance:
                    // 'userId': '+GregorioRobles'
                  });
                  request.execute(function(resp) {
                    var heading = document.createElement('h4');
                    var image = document.createElement('img');

                    image.src = resp.image.url;
                    heading.appendChild(image);
                    heading.appendChild(document.createTextNode(" " +resp.displayName+" ("+huesped.title+")"));
                    document.getElementById('usuarios').appendChild(heading);
                  });
                }
            });
          }
      });
    });
}
$(document).ready(function() {
  map = L.map('map').setView([40.4175, -3.708], 11);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  $("#cargar1").click(get_accomodations);
  $("#cargar2").click(get_accomodations);
  $("#cargar3").click(get_accomodations);
  $("#boton").click(sacar_nombre);
  $(".formulario button").click(getToken);
  $(".formucargar button").click(getToken1);
  $(".leerfich").click(cargar);
  $(".guardar2").click(save);
  $("#newplus").click(sacar_id);
  $("#vertodos").click(function(){
    makeApiCall("", true, fichero,true);
  })
});
