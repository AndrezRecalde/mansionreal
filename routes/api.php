<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CalendarioReservasController;
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\ConceptoPagoController;
use App\Http\Controllers\ConfiguracionIvaController;
use App\Http\Controllers\ConsumosController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\EstadiaController;
use App\Http\Controllers\GastosController;
use App\Http\Controllers\HuespedController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\LimpiezaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\ProvinciaController;
use App\Http\Controllers\ReservasController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\ServiciosController;
use App\Http\Controllers\TipoReservaController;
use App\Http\Controllers\TiposDanoController;
use App\Http\Controllers\TiposDepartamentosController;
use App\Http\Controllers\UsuarioController;
use App\Http\Middleware\CheckRole;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/


Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});


Route::post('/auth/login', [AuthController::class, 'login']);

Route::get('/refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');
Route::get('/profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

/* Huespedes */
Route::get('/huespedes', [HuespedController::class, 'getHuespedes'])->middleware('auth:sanctum');

/* Provincias */
Route::get('/provincias', [ProvinciaController::class, 'getProvincias'])->middleware('auth:sanctum');

/* Categorias */
Route::post('/categorias', [CategoriasController::class, 'getCategorias'])->middleware('auth:sanctum');

/* Productos del Inventario */
Route::get('/productos/inventario', [InventarioController::class, 'getProductosInventario'])->middleware('auth:sanctum');


Route::group(['prefix' => 'gerencia', 'middleware' => ['auth:sanctum', CheckRole::class . ':ADMINISTRADOR|GERENTE']], function () {

    /* Dashboard KPIS */
    Route::post('/dashboard/resumen-kpi', [DashboardController::class, 'kpiResumen']);
    Route::post('/dashboard/huespedes-ganancias-por-mes', [DashboardController::class, 'huespedesYGananciasPorMes']);
    Route::post('/dashboard/ranking-productos', [DashboardController::class, 'productosMasConsumidos']);
    Route::post('/dashboard/ingresos-departamento', [DashboardController::class, 'ingresosPorTipoDepartamento']);
    Route::post('/dashboard/huespedes-recurrentes', [DashboardController::class, 'huespedesRecurrentes']);


    /* Usuarios */
    Route::get('/usuarios', [UsuarioController::class, 'getUsuarios']);
    Route::post('/usuario', [UsuarioController::class, 'store']);
    Route::put('/usuario/{id}', [UsuarioController::class, 'update']);
    Route::put('/usuario/{id}/password', [UsuarioController::class, 'updatePassword']);
    Route::put('/usuario/{id}/status', [UsuarioController::class, 'updateStatus']);

    /* Obtener Usuarios con GERENTE */
    Route::get('/usuarios/gerentes', [UsuarioController::class, 'getGerentes']);

    // Reporte de TODOS los gerentes
    Route::post('/reportes/pagos/gerentes', [UsuarioController::class, 'pagosPorGerente']);
    Route::post('/reportes/pagos/gerentes/pdf', [UsuarioController::class, 'exportarPagosPorGerentePDF']);

    // Reporte de un gerente específico
    //Route::post('/reportes/pagos/gerentes/{usuarioId}', [UsuarioController::class, 'pagosPorGerente']);

    /* Roles */
    Route::get('/roles', [RoleController::class, 'getRoles']);

    /* Categorias */
    Route::post('/categoria', [CategoriasController::class, 'store']);
    Route::put('/categoria/{id}', [CategoriasController::class, 'update']);
    Route::put('/categoria/{id}/status', [CategoriasController::class, 'updateStatus']);

    /* Configuracion Ivas */
    Route::post('/configuraciones-iva', [ConfiguracionIvaController::class, 'getConfiguracionesIva']);
    Route::post('/configuracion-iva', [ConfiguracionIvaController::class, 'store']);
    Route::put('/configuracion-iva/{id}', [ConfiguracionIvaController::class, 'update']);
    Route::put('/configuracion-iva/{id}/status', [ConfiguracionIvaController::class, 'updateStatus']);
    Route::get('/configuracion-iva/activa', [ConfiguracionIvaController::class, 'getConfiguracionIvaActiva']);

    /* Departamentos */
    Route::get('/departamentos', [DepartamentoController::class, 'getDepartamentos']);
    Route::post('/departamento', [DepartamentoController::class, 'store']);
    Route::post('/departamento/{id}', [DepartamentoController::class, 'update']);
    Route::get('/departamento/{id}', [DepartamentoController::class, 'show']);
    Route::post('/disponibilidad-departamentos', [DepartamentoController::class, 'obtenerDepartamentosDisponibles']);
    Route::post('/departamento-servicios', [DepartamentoController::class, 'agregarServiciosDepartamento']);

    /* Tipos de Departamentos */
    Route::get('/tipos-departamentos', [TiposDepartamentosController::class, 'getTiposDepartamentos']);
    Route::post('/tipo-departamento', [TiposDepartamentosController::class, 'store']);
    Route::put('/tipo-departamento/{id}', [TiposDepartamentosController::class, 'update']);

    /* Servicios */
    Route::get('/servicios', [ServiciosController::class, 'getServicios']);
    Route::get('/servicios-agrupados', [ServiciosController::class, 'getServiciosAgrupados']);
    Route::post('/servicio', [ServiciosController::class, 'store']);
    Route::put('/servicio/{id}', [ServiciosController::class, 'update']);


    /* Inventario */
    Route::post('/producto/inventario', [InventarioController::class, 'store']);
    Route::put('/producto/inventario/{id}', [InventarioController::class, 'update']);
    Route::put('/producto/inventario/{id}/status', [InventarioController::class, 'updateStatus']);
    Route::post('/producto/inventario/{id}/agregar-stock', [InventarioController::class, 'agregarStock']);
    Route::get('/producto/inventario/{id}/historial-movimientos', [InventarioController::class, 'historialMovimientos']);
    Route::post('/producto/inventario/reporte-movimientos', [InventarioController::class, 'reporteMovimientos']);

    /* Limpieza */
    Route::post('/limpieza', [LimpiezaController::class, 'store']);
    Route::put('/limpieza/{id}', [LimpiezaController::class, 'update']);
    Route::get('/limpieza/buscar', [LimpiezaController::class, 'buscarPorFecha']);

    /* Tipos Reservas */
    //Route::post('/tipos-reservas', [TipoReservaController::class, 'getTiposReservas']);


});


Route::group(['prefix' => 'general', 'middleware' => ['auth:sanctum', CheckRole::class . ':ADMINISTRADOR|GERENTE|RECEPCION|ASISTENTE']], function () {
    /* Calendario de reservas */
    Route::get('/calendario/reservas', [CalendarioReservasController::class, 'getReservasCalendario']);
    Route::get('/calendario/recursos-departamentos', [CalendarioReservasController::class, 'getDepartamentosRecursos']);
    Route::get('/calendario/estadisticas-ocupacion', [CalendarioReservasController::class, 'getEstadisticasOcupacion']);


    /* Departamentos */
    Route::get('/buscar-departamentos-disponibles', [DepartamentoController::class, 'getDisponibles']);

    /* Huespedes */
    Route::post('/huesped', [HuespedController::class, 'store']);
    Route::put('/huesped/{id}', [HuespedController::class, 'update']);
    Route::post('/huesped/buscar', [HuespedController::class, 'buscarHuespedPorDni']);

    /* Reservas */
    Route::post('/departamentos-disponibilidad', [DepartamentoController::class, 'consultarDisponibilidadDepartamentosPorFecha']); //INFO: Verificar si se usa

    /* Consumos */
    Route::post('/consumo-reserva', [ConsumosController::class, 'buscarConsumosPorReserva']);
    Route::post('/consumo', [ConsumosController::class, 'registrarConsumos']);
    Route::put('/consumo/{id}', [ConsumosController::class, 'update']);
    Route::delete('/consumo/{id}', [ConsumosController::class, 'delete']);
    Route::post('/reporte-consumos', [ConsumosController::class, 'reporteConsumosPorCategoria']);
    Route::post('/consumos/categoria/pdf', [ConsumosController::class, 'exportarReporteConsumosPDF']);


    /* Reservas */
    Route::post('/reserva/nueva', [ReservasController::class, 'store']);
    Route::put('/reserva/{id}', [ReservasController::class, 'update']);
    Route::put('/reserva/{id}/estado', [ReservasController::class, 'cambiarEstadoReserva']);
    Route::delete('/reserva/{id}', [ReservasController::class, 'eliminarReserva']);
    Route::post('/reservas/buscar', [ReservasController::class, 'buscarReservas']);
    Route::post('/reservas/{reserva}/cancelar', [ReservasController::class, 'cancelar']);

    /* Exportar PDF Reservas */
    Route::post('/exportar-nota-venta', [ReservasController::class, 'exportarNotaVentaPDF']);

    /* Estadias */
    Route::post('/estadias', [EstadiaController::class, 'getEstadias']);
    Route::post('/estadia/nueva', [EstadiaController::class, 'storeEstadia']);
    Route::put('/estadia/{id}', [EstadiaController::class, 'updateEstadia']);
    Route::post('/reporte-estadias', [EstadiaController::class, 'reporteEstadiasPorFechas']);
    Route::post('/reporte-estadias-pdf', [EstadiaController::class, 'exportConsumosEstadiasPDF']);

    /* Gastos */
    Route::post('/gastos', [GastosController::class, 'getGastos']);
    Route::post('/gasto', [GastosController::class, 'store']);
    Route::put('/gasto/{id}', [GastosController::class, 'update']);
    Route::delete('/gasto/{id}', [GastosController::class, 'delete']);

    /* Conceptos de pagos */
    Route::post('/conceptos-pagos', [ConceptoPagoController::class, 'getConceptosPagos']);

    /* Pagos */
    Route::post('/pagos', [PagoController::class, 'getPagos']);
    Route::get('/pagos/historial', [PagoController::class, 'getHistorialPagos']);
    Route::post('/reserva/{reservaId}/pago', [PagoController::class, 'store']);
    Route::put('/pago/{id}', [PagoController::class, 'update']);
    Route::delete('/pago/{id}', [PagoController::class, 'delete']);
    Route::post('/totales-pagos', [PagoController::class, 'getTotalesPorReserva']);

    /* Tipos de danos */
    Route::post('/tipos-dano', [TiposDanoController::class, 'getTiposDano']);

    /* Departamentos */
    Route::put('/departamento/{id}/status', [DepartamentoController::class, 'cambiarEstadoDepartamento']);
    Route::post('/reporte-departamentos', [DepartamentoController::class, 'reporteDepartamentosPorFechas']);
    Route::post('/reservas-reporte/pdf', [DepartamentoController::class, 'exportarKpiYDepartamentosPdf']);
    Route::post('/consumos-por-departamento/pdf', [DepartamentoController::class, 'exportConsumosPorDepartamentoPDF']);
});
