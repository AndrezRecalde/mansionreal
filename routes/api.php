<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\ConfiguracionIvaController;
use App\Http\Controllers\ConsumosController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\GastosController;
use App\Http\Controllers\HuespedController;
use App\Http\Controllers\InventarioController;
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

/* Reservas */
Route::post('/departamentos-dispinibilidad', [DepartamentoController::class, 'consultarDisponibilidadDepartamentosPorFecha']);


/* Provincias */
Route::get('/provincias', [ProvinciaController::class, 'getProvincias'])->middleware('auth:sanctum');


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

    /* Roles */
    Route::get('/roles', [RoleController::class, 'getRoles']);

    /* Categorias */
    Route::post('/categorias', [CategoriasController::class, 'getCategorias']);
    Route::post('/categoria', [CategoriasController::class, 'store']);
    Route::put('/categoria/{id}', [CategoriasController::class, 'update']);
    Route::put('/categoria/{id}/status', [CategoriasController::class, 'updateStatus']);

    /* Configuracion Ivas */
    Route::post('/configuraciones-iva', [ConfiguracionIvaController::class, 'getConfiguracionesIva']);
    Route::post('/configuracion-iva', [ConfiguracionIvaController::class, 'store']);
    Route::put('/configuracion-iva/{id}', [ConfiguracionIvaController::class, 'update']);
    Route::put('/configuracion-iva/{id}/status', [ConfiguracionIvaController::class, 'updateStatus']);

    /* Departamentos */
    Route::get('/departamentos', [DepartamentoController::class, 'getDepartamentos']);
    Route::post('/departamento', [DepartamentoController::class, 'store']);
    Route::post('/departamento/{id}', [DepartamentoController::class, 'update']);
    Route::get('/departamento/{id}', [DepartamentoController::class, 'show']);
    Route::post('/disponibilidad-departamentos', [DepartamentoController::class, 'obtenerDepartamentosDisponibles']);
    Route::post('/departamento-servicios', [DepartamentoController::class, 'agregarServiciosDepartamento']);
    Route::put('/departamento/{id}/status', [DepartamentoController::class, 'cambiarEstadoDepartamento']);
    Route::post('/reporte-departamentos', [DepartamentoController::class, 'reporteDepartamentosPorFechas']);
    Route::post('/reservas-reporte/pdf', [DepartamentoController::class, 'exportarKpiYDepartamentosPdf']);
    Route::post('/consumos-por-departamento/pdf', [DepartamentoController::class, 'exportConsumosPorDepartamentoPDF']);


    /* Tipos de Departamentos */
    Route::get('/tipos-departamentos', [TiposDepartamentosController::class, 'getTiposDepartamentos']);
    Route::post('/tipo-departamento', [TiposDepartamentosController::class, 'store']);
    Route::put('/tipo-departamento/{id}', [TiposDepartamentosController::class, 'update']);

    /* Servicios */
    Route::get('/servicios', [ServiciosController::class, 'getServicios']);
    Route::get('/servicios-agrupados', [ServiciosController::class, 'getServiciosAgrupados']);
    Route::post('/servicio', [ServiciosController::class, 'store']);
    Route::put('/servicio/{id}', [ServiciosController::class, 'update']);

    /* Huespedes */
    Route::post('/huesped', [HuespedController::class, 'store']);
    Route::put('/huesped/{id}', [HuespedController::class, 'update']);
    Route::post('/huesped/buscar', [HuespedController::class, 'buscarHuespedPorDni']);

    /* Reservas */
    Route::post('/reserva/nueva', [ReservasController::class, 'store']);
    Route::put('/reserva/{id}', [ReservasController::class, 'update']);
    Route::put('/reserva/{id}/estado', [ReservasController::class, 'cambiarEstadoReserva']);
    Route::delete('/reserva/{id}', [ReservasController::class, 'eliminarReserva']);
    Route::post('/reservas/buscar', [ReservasController::class, 'buscarReservas']);

    /* Exportar PDF Reservas */
    Route::post('/exportar-nota-venta', [ReservasController::class, 'exportarNotaVentaPDF']);

    /* Consumos */
    Route::post('/consumo-reserva', [ConsumosController::class, 'buscarConsumosPorReserva']);
    Route::post('/consumo', [ConsumosController::class, 'registrarConsumos']);
    Route::put('/consumo/{id}', [ConsumosController::class, 'update']);
    Route::delete('/consumo/{id}', [ConsumosController::class, 'delete']);

    /* Gastos */
    Route::post('/gastos', [GastosController::class, 'getGastos']);
    Route::post('/gasto', [GastosController::class, 'store']);
    Route::put('/gasto/{id}', [GastosController::class, 'update']);
    Route::delete('/gasto/{id}', [GastosController::class, 'delete']);

    /* Tipos de danos */
    Route::post('/tipos-dano', [TiposDanoController::class, 'getTiposDano']);

    /* Inventario */
    Route::post('/productos/inventario', [InventarioController::class, 'getProductosInventario']);
    Route::post('/producto/inventario', [InventarioController::class, 'store']);
    Route::put('/producto/inventario/{id}', [InventarioController::class, 'update']);
    Route::put('/producto/inventario/{id}/status', [InventarioController::class, 'updateStatus']);


    /* Tipos Reservas */
    Route::post('/tipos-reservas', [TipoReservaController::class, 'getTiposReservas']);

});
