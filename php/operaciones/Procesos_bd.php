<?php
include "../config/configuracionBD.php";
mysqli_report(MYSQLI_REPORT_STRICT); //Desactivar reportes de mysqli

/**
 *  Clase que realiza los procesos de la base de datos
 */
class Procesos_bd
{

  public $ultimoId; //nueva variable

  function __construct()
  {

    $this->mysqli = new mysqli(SERVIDOR, USUARIO, PASSWORD, DB);
  }

  /**
   * Se realiza la consulta con la base de datos
   * @param $consulta, $ubicacion
   * @return bool|mysqli_result|string returna el resultado tanto si fallo o si es correcto
   */
  public function consulta($consulta, $ubicacion = false)
  {
    try {

      $this->resultado = $this->mysqli->query($consulta);
      //nuevo condicional
      if ($ubicacion) {
        //$this->setUltimoId($this->resultado->insert_id);
        $this->setUltimoId($this->mysqli->insert_id);
        //return [$this->resultado, $this->getUltimoId()];
        return $this->getUltimoId();
      }
      return  $this->resultado;
    } catch (mysqli_sql_exception $e) {
      return $e->__toString();
    }
  }

  /**
   * Método para comprobar que se guarda la ubicación y se devuelve el id de la última posición guardada
   ** @return array[]|string retorna el resultado tanto si fallo o si es correcto
   */
  public function testUltimoId()
  {
    try {

      $this->resultado = $this->mysqli->query("INSERT INTO Ubicacion (nombre, direccion, latitud, longitud) 
      VALUES ('". "Pruebas7" ."', '". 'prueb' . "', ". 3.1 .", ". 2.1 .")");
      //nuevo condicional
      $this->setUltimoId($this->mysqli->insert_id);
      return  $this->getUltimoId();
    } catch (mysqli_sql_exception $e) {
      return $e->__toString();
    }
  }

  /**
   * Setea la variable $ultimoId
   * @param int ultimoId
   */
  public function setUltimoId($ultimoId)
  {
    $this->ultimoId = $ultimoId;
  }

  /**
   * Devuelve la variable $ultimoId
   * @return int
   */
  public function getUltimoId()
  {
    return $this->ultimoId;
  }

  /**
   * Obtiene una fila de resultados como un array asociativo, numérico, o ambos
   * @param $resultado
   * @return mixed
   */
  public function extraerFila($resultado)
  {
    return $resultado->fetch_array();
  }

  /**
   * @param $consulta
   * @param $tipo
   * @param $email
   * @return false|mysqli_result Devuelve 0 si ha fallado o el resultado si ha sido correcta
   */
  public function consultaPreparada($consulta, $tipo, $valor)
  {


    if (!$sentencia = $this->mysqli->prepare($consulta)) {
      return 0;
    }
    if (!$sentencia->bind_param("$tipo", $valor)) {
      return 0;
    }

    $result = $sentencia->execute();
    if ($result) {
      return  $sentencia->get_result();
    }
    return 0;
  }


  /**
   * Para comprobar cuantas filas han sido afectadas en la ultima consulta
   * @return int retorna las filas afectadas
   */
  public function filasAfectadas()
  {
    return $this->mysqli->affected_rows;
  }

  /**
   * Para comprobar cuantas filas han sido devueltas en el resultado de la ultima consulta
   * @param $resultado
   * @return mixed retorna el numero de filas obtenidas
   */
  public function  numeroFilas($resultado)
  {
    return $numeroFilas = $resultado->num_rows;
  }

  /**
   * Devuelve el id de la ultima consulta
   * @return mixed
   */
  public function ultimoInsert_id()
  {
    return $this->mysqli->insert_id;
  }

  /**
   * Parar saber el error de la ultima consulta
   * @return mixed
   */
  public function error()
  {

    return  $this->mysqli->error;
  }

  /**
   * Parar saber el mensaje de error de la ultima consulta
   * @return mixed
   */
  public function errno()
  {
    return  $this->mysqli->errno;
  }

  /**
   * Para cerrar la conexión con la base de datos
   *
   */
  public function cerrarConexion()
  {
    $this->mysqli->close();
  }
}
