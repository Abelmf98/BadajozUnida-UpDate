import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AppService} from "../../services/app.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalComponent} from "../modal/modal.component";
import {UsuarioService} from "../../services/usuario.service";
import * as L from 'leaflet';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})

export class CrearEventoComponent implements OnInit {
  forma!: FormGroup;
  modal = new ModalComponent();
  ubicaciones:any;
  subcategorias:any;
  idUbicacion:any;
  idSubcategoria:any;
  idUsuario:any;
  imagen:any;
  mapa!:L.Map;

  /**
   * @ignore
   */
  constructor(
    private formBuilder: FormBuilder,
    private appService: AppService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private usuarioService: UsuarioService
  ) {
    this.listadoUbicacion();
    this.listadoSubcategoria();
    this.idUsuario=usuarioService.getIdUsuarioActual();
  }

  /**
   * @ignore
   */
  ngOnInit(): void {
    this.crearFormulario();
    // inicio de mapa
    this.mapa = L.map('mapid').setView([38.8778900, -6.9706100], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors'
    }).addTo(this.mapa);

    var marker: any;

    console.log(L.map);
  }
  /**
   * Método encargado de capturar el evento del click sobre el mapa del formulario
   */
  capturarClick(marker: any, map: any){
    //destruir el marcador
    map.on('click', (ev: any) =>{
        var latlng = map.mouseEventToLatLng(ev.originalEvent);
        console.log(latlng.lat  + ', ' + latlng.lng);
        if (marker !=undefined){
          map.removeLayer(marker);
        }
        marker = L.marker([latlng.lat, latlng.lng]).addTo(map).openPopup();

        // this.forma.controls['idUbicacion'].clearValidators();
        // this.forma.controls['idUbicacion'].updateValueAndValidity();
        // setTimeout(()=> {this.forma.value.idUbicacion = [latlng.lat, latlng.lng]}, 1000)

        this.forma.patchValue({ //Introduce las coordenadas del mapa en el elemento del grupo del formulario
          idUbicacion: [latlng.lat, latlng.lng]
        })

        console.log(this.forma.value);
        console.log(this.forma);

        // 1 latitud 2 longitud
        // this.forma.value.idUbicacion = [latlng.lat, latlng.lng]
    });
  }
  /**
   * Cambia el centro del mapa
   * @param ubi 
   * @returns 
   */
  cambiarMapa(ubi : any){
    var id = ubi.target.value;
    var coordenadas : Array<number> = [];

    console.log(this.ubicaciones);
    if (id == "") { //previene error en caso de seleccionar ubicacion sin id
      return;
    }

    for (let i = 0; i < this.ubicaciones.length; i++) {
      if (this.ubicaciones[i].idUbicacion == id) {
        coordenadas = [this.ubicaciones[i].latitud, this.ubicaciones[i].longitud];
      }
    }

    this.mapa.remove();
    this.mapa = L.map('mapid').setView([coordenadas[0], coordenadas[1]], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright%22%3EOpenStreetMap</a> contributors'
    }).addTo(this.mapa);

    var marker: any;

    this.cambiarMarcador(marker, coordenadas);
  } 

  /**
   * Cambia el marcador en las coordenadas provistas
   * @param marker 
   * @param coordenadas 
   */
  cambiarMarcador(marker:any, coordenadas : any){
    if (marker != undefined) {
      this.mapa.removeLayer(marker);
    }
    marker = L.marker([coordenadas[0], coordenadas[1]]).addTo(this.mapa).openPopup();
  }

  /**
   * Inizializa los validadores del formulario.
   */
  crearFormulario() {
    this.forma = this.formBuilder.group({
      titulo: ['', [Validators.required, Validators.minLength(5),Validators.maxLength(50)]],
      imagen: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(200)]],
      fechaHora: [null, [Validators.required]],
      idSubcategoria: ['', [Validators.required]],
      idUbicacion: ['', [Validators.required]]
    });
  }

  /**
   * Lista todas las ubicaciones.
   */
  listadoUbicacion() {
    let datos = {
      tipo: 'listarUbicaciones',
    };

    this.appService.postQuery(datos).subscribe(
      (data) => {
        if (data['status'] != 'error') {
          this.ubicaciones = data;
        } else {
          console.log(data);
        }
      },
      async (errorServicio) => {
        console.log('he fallado');
        console.log(errorServicio);
      }
    );
  }


  /**
   * Muestra en pantalla las subcategorías.
   */
  listadoSubcategoria() {
    let datos = {
      tipo: 'listarSubcategoria',
    };
    this.appService.postQuery(datos).subscribe(
      (data) => {
        if (data['status'] != 'error') {
          this.subcategorias = data;
        } else {
          console.log(data);
        }
      },
      async (errorServicio) => {
        console.log('he fallado');
        console.log(errorServicio);
      }
    );
  }

  /**
   * Guarda el ID de una ubicación.
   * @param idUbicacion - ID de la ubicación
   */
  guardarIdUicacion(idUbicacion: any) {
    this.idUbicacion=idUbicacion;
  }

  /**
   * Guarda el ID de una subcategoría.
   * @param idSubcategoria - ID de la subcategoría
   */
  guardarIdSubcategoria(idSubcategoria: any) {
    this.idUbicacion=idSubcategoria;
  }

  /**
   * Guarda los datos del formulario.
   * @param forma - Datos del formulario
   * @returns void
   */
  guardar(forma: FormGroup){
    if (forma.invalid || forma.pending) {
      Object.values(forma.controls).forEach(control => {
        if (control instanceof FormGroup)
          this.guardar(control);
        control.markAsTouched();
      })
      return;
    }

    this.crearEvento(forma);
  }

  /**
   * Valida un campo del formulario.
   * @param campo1 - Campo del formulario
   * @returns Campo inválido y modificado
   */
  validar(campo1: string){
    let campo: any = this.forma.get(campo1);

    return !(campo.invalid && campo.touched);
  }

  /**
   * Crea un nuevo evento.
   * @param forma - Datos del evento
   */
  crearEvento(forma: any) {
    console.log(forma.value);
    let datos = forma.value;
    datos.tipo = 'crearEvento'
    datos.imagen= this.imagen;
    datos.idUsuario=this.idUsuario;
    this.appService.postQuery(datos).subscribe(
      (data) => {
        console.log(data);
        if (data['status'] != 'error') {
          console.log('data');
          this.modal.generateModal(
            'Éxito',
            `Evento creado con éxito.`,
            'De acuerdo',
            'success'
          );
          setTimeout(() => {
            this.router.navigate(['/mis-eventos']);
          }, 2000);
          //this.borrarForm();
        } else {
          this.modal.generateModal(
            `Algo salió mal`,
            `${data['result']['error_msg']}`,
            'De acuerdo',
            'error'
          );
          console.log(data);
        }
      },
      async (errorServicio) => {
        console.log('he fallado');
        console.log(errorServicio);
      }
    );
  }

  /**
   * Guardar imagen en base64 para enviarla al servidor..
   * @param event - Imagen
   */
  guardarFile(event: any) {
    this.imagen=event[0]['base64'];
  }

  /**
   * LLamar a añadir ubicación
   */

  /**
   * Comprueba que la fecha sea posterior a mañana.
   */

  get comprobarFecha() {
    let fechaHora = this.forma.get('fechaHora')?.value;
    if (fechaHora != null) {
      let fechaActual= new Date();
      let fechaHoraComprobar=Date.parse(fechaHora);
      fechaActual.setDate(fechaActual.getDate()+1)
      let fecha=Date.parse(`${fechaActual}`)
      return fecha < fechaHoraComprobar ? true : false;
    }
    return true;
  }

}


