<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CalendarioReservasController;
use App\Http\Controllers\CategoriasController;
use App\Http\Controllers\ClienteFacturacionController;
use App\Http\Controllers\ConceptoPagoController;
use App\Http\Controllers\ConfiguracionIvaController;
use App\Http\Controllers\ConsumosController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\DepartamentoController;
use App\Http\Controllers\EstadiaController;
use App\Http\Controllers\FacturaController;
use App\Http\Controllers\GastosController;
use App\Http\Controllers\HuespedController;
use App\Http\Controllers\InventarioController;
use App\Http\Controllers\LimpiezaController;
use App\Http\Controllers\PagoController;
use App\Http\Controllers\CuentaVentaController;
use App\Http\Controllers\TurnoCajaController;
use App\Http\Controllers\CajaController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\ProvinciaController;
use App\Http\Controllers\ReservasController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SecuenciaFacturaController;
use App\Http\Controllers\ServiciosController;
use App\Http\Controllers\TiposDanoController;
use App\Http\Controllers\TiposDepartamentosController;
use App\Http\Controllers\UsuarioController;
use App\Http\Middleware\CheckPermission;
use App\Http\Middleware\CheckRole;
use App\Http\Middleware\CheckTurnoAbierto;
use Illuminate\Support\Facades\Route;

/* |-------------------------------------------------------------------------- | API Routes |-------------------------------------------------------------------------- */

// ============================================================================
// RUTAS PÚBLICAS
// ============================================================================

Route::get('/sanctum/csrf-cookie', function () {
    return response()->json(['csrfToken' => csrf_token()]);
});

Route::post('/auth/login', [AuthController::class , 'login']);

// ============================================================================
// RUTAS AUTENTICADAS (cualquier rol)
// ============================================================================

Route::middleware('auth:sanctum')->group(function () {

    /* Auth */
    Route::get('/refresh', [AuthController::class , 'refresh']);
    Route::get('/profile', [AuthController::class , 'profile']);
    Route::post('/auth/logout', [AuthController::class , 'logout']);

    /* Cambiar contraseña - el usuario puede cambiar la suya */
    Route::put('/usuario/{id}/password', [UsuarioController::class , 'updatePassword']);

    /* Recursos comunes de lectura */
    Route::get('/huespedes', [HuespedController::class , 'getHuespedes']);
    Route::get('/provincias', [ProvinciaController::class , 'getProvincias']);
    Route::post('/categorias', [CategoriasController::class , 'getCategorias']);
    Route::get('/productos/inventario', [InventarioController::class , 'getProductosInventario']);
    Route::get('/tipos-departamentos', [TiposDepartamentosController::class , 'getTiposDepartamentos']);
    Route::get('/departamentos', [DepartamentoController::class , 'getDepartamentos']);
    Route::post('/tipos-dano', [TiposDanoController::class , 'getTiposDano']);
    Route::get('/configuracion-iva/activa', [ConfiguracionIvaController::class , 'getConfiguracionIvaActiva']);


    // ========================================================================
    // PREFIX: administracion — Acceso: ADMINISTRADOR
    // ========================================================================
    Route::prefix('administracion')
        ->middleware(CheckRole::class . ':ADMINISTRADOR')
        ->group(function () {
            /* ---- Usuarios ---- */
            Route::get('/usuarios', [UsuarioController::class , 'getUsuarios']);
            Route::post('/usuario', [UsuarioController::class , 'store']);
            Route::put('/usuario/{id}', [UsuarioController::class , 'update']);
            Route::put('/usuario/{id}/status', [UsuarioController::class , 'updateStatus']);

            /* ---- Permisos directos de usuario ---- */
            Route::get('/usuario/{id}/permisos', [UsuarioController::class , 'getPermisosDirectos']);
            Route::put('/usuario/{id}/permisos', [UsuarioController::class , 'asignarPermisosDirectos']);

            /* ---- Roles (CRUD) ---- */
            Route::get('/roles', [RoleController::class , 'getRoles']);
            Route::post('/rol', [RoleController::class , 'store']);
            Route::put('/rol/{id}', [RoleController::class , 'update']);
            Route::delete('/rol/{id}', [RoleController::class , 'destroy']);
            Route::get('/rol/{id}/permisos', [RoleController::class , 'getPermisosDeRol']);
            Route::put('/rol/{id}/permisos', [RoleController::class , 'asignarPermisos']);

            /* ---- Permisos (CRUD) ---- */
            Route::get('/permisos', [PermissionController::class , 'index']);
            Route::post('/permiso', [PermissionController::class , 'store']);
            Route::put('/permiso/{id}', [PermissionController::class , 'update']);
            Route::delete('/permiso/{id}', [PermissionController::class , 'destroy']);

            /* ---- Configuración IVA ---- */
            Route::post('/configuraciones-iva', [ConfiguracionIvaController::class , 'getConfiguracionesIva']);
            Route::post('/configuracion-iva', [ConfiguracionIvaController::class , 'store']);
            Route::put('/configuracion-iva/{id}', [ConfiguracionIvaController::class , 'update']);
            Route::put('/configuracion-iva/{id}/status', [ConfiguracionIvaController::class , 'updateStatus']);

            /* ---- Departamentos ---- */
            Route::post('/departamento', [DepartamentoController::class , 'store']);
            Route::post('/departamento/{id}', [DepartamentoController::class , 'update']);
            Route::get('/departamento/{id}', [DepartamentoController::class , 'show']);
            Route::post('/departamento-servicios', [DepartamentoController::class , 'agregarServiciosDepartamento']);

            /* ---- Tipos de Departamentos ---- */
            Route::post('/tipo-departamento', [TiposDepartamentosController::class , 'store']);
            Route::put('/tipo-departamento/{id}', [TiposDepartamentosController::class , 'update']);

            /* ---- Servicios ---- */
            Route::get('/servicios', [ServiciosController::class , 'getServicios']);
            Route::get('/servicios-agrupados', [ServiciosController::class , 'getServiciosAgrupados']);
            Route::post('/servicio', [ServiciosController::class , 'store']);
            Route::put('/servicio/{id}', [ServiciosController::class , 'update']);

        }
        );


        // ========================================================================
        // PREFIX: gerencia — Acceso: ADMINISTRADOR | GERENTE
        // ========================================================================
        Route::prefix('gerencia')
            ->middleware(CheckRole::class . ':ADMINISTRADOR|GERENTE')
            ->group(function () {

            /* ---- Dashboard KPIs ---- */
            Route::post('/dashboard/resumen-kpi', [DashboardController::class , 'kpiResumen']);
            Route::post('/dashboard/huespedes-ganancias-por-mes', [DashboardController::class , 'huespedesYGananciasPorMes']);
            Route::post('/dashboard/ranking-productos', [DashboardController::class , 'productosMasConsumidos']);
            Route::post('/dashboard/ingresos-departamento', [DashboardController::class , 'ingresosPorTipoDepartamento']);
            Route::post('/dashboard/huespedes-recurrentes', [DashboardController::class , 'huespedesRecurrentes']);

            /* ---- Limpieza ---- */
            Route::post('/limpieza', [LimpiezaController::class , 'store']);
            Route::put('/limpieza/{id}', [LimpiezaController::class , 'update']);
            Route::get('/limpieza/buscar', [LimpiezaController::class , 'buscarPorFecha']);

            /* ---- Reservas (gestión completa) ---- */
            Route::post('/reserva/nueva', [ReservasController::class , 'store']);
            Route::put('/reserva/{id}', [ReservasController::class , 'update']);
            Route::put('/reserva/{id}/estado', [ReservasController::class , 'cambiarEstadoReserva']);
            Route::delete('/reserva/{id}', [ReservasController::class , 'eliminarReserva']);
            Route::post('/reservas/{reserva}/cancelar', [ReservasController::class , 'cancelar']);

            /* ---- Calendario de Reservas ---- */
            Route::get('/calendario/reservas', [CalendarioReservasController::class , 'getReservasCalendario']);
            Route::get('/calendario/recursos-departamentos', [CalendarioReservasController::class , 'getDepartamentosRecursos']);
            Route::get('/calendario/estadisticas-ocupacion', [CalendarioReservasController::class , 'getEstadisticasOcupacion']);

            /* ---- Huéspedes ---- */
            Route::post('/huesped', [HuespedController::class , 'store']);
            Route::put('/huesped/{id}', [HuespedController::class , 'update']);
            Route::post('/huesped/buscar', [HuespedController::class , 'buscarHuespedPorDni']);

            /* ---- Descuentos en Consumos ---- */
            Route::post('/consumo/{id}/aplicar-descuento', [ConsumosController::class , 'aplicarDescuento']);
            Route::delete('/consumo/{id}/eliminar-descuento', [ConsumosController::class , 'eliminarDescuento']);

            /* ---- Reportes de Consumos ---- */
            Route::post('/reporte-consumos', [ConsumosController::class , 'reporteConsumosPorCategoria']);
            Route::post('/consumos/categoria/pdf', [ConsumosController::class , 'exportarReporteConsumosPDF']);

            /* ---- Buscar Reservas ---- */
            Route::post('/reservas/buscar', [ReservasController::class , 'buscarReservas']);

            /* ---- Exportar PDF Reservas ---- */
            Route::post('/exportar-nota-venta', [ReservasController::class , 'exportarNotaVentaPDF']);

            /* ---- Estadías ---- */
            Route::post('/estadia/nueva', [EstadiaController::class , 'storeEstadia']);
            Route::put('/estadia/{id}', [EstadiaController::class , 'updateEstadia']);
            Route::post('/reporte-estadias', [EstadiaController::class , 'reporteEstadiasPorFechas']);
            Route::post('/reporte-estadias-pdf', [EstadiaController::class , 'exportConsumosEstadiasPDF']);

            /* ---- Gastos ---- */
            Route::post('/gastos', [GastosController::class , 'getGastos']);
            Route::post('/gasto', [GastosController::class , 'store']);
            Route::put('/gasto/{id}', [GastosController::class , 'update']);
            Route::delete('/gasto/{id}', [GastosController::class , 'delete']);

            /* ---- Revisión de Departamentos ---- */
            Route::put('/departamento/{id}/status', [DepartamentoController::class , 'cambiarEstadoDepartamento']);
            Route::post('/reporte-departamentos', [DepartamentoController::class , 'reporteDepartamentosPorFechas']);
            Route::post('/reservas-reporte/pdf', [DepartamentoController::class , 'exportarKpiYDepartamentosPdf']);
            Route::post('/consumos-por-departamento/pdf', [DepartamentoController::class , 'exportConsumosPorDepartamentoPDF']);

        }
        );

        // ========================================================================
        // PREFIX: general — Acceso: ADMINISTRADOR | GERENTE | ASISTENTE
        // ========================================================================
        Route::prefix('general')
            ->middleware(CheckRole::class . ':ADMINISTRADOR|GERENTE|ASISTENTE')
            ->group(function () {

            /* ---- Categorías ---- */
            Route::middleware(CheckPermission::class . ':gestionar_categorias_inventario')->group(function () {
                    Route::post('/categoria', [CategoriasController::class , 'store']);
                    Route::put('/categoria/{id}', [CategoriasController::class , 'update']);
                    Route::put('/categoria/{id}/status', [CategoriasController::class , 'updateStatus']);
                }
                );

                /* ---- Inventario ---- */
                Route::middleware(CheckPermission::class . ':gestionar_productos_inventario')->group(function () {
                    Route::post('/producto/inventario', [InventarioController::class , 'store']);
                    Route::put('/producto/inventario/{id}', [InventarioController::class , 'update']);
                    Route::put('/producto/inventario/{id}/status', [InventarioController::class , 'updateStatus']);
                    Route::post('/producto/inventario/{id}/agregar-stock', [InventarioController::class , 'agregarStock']);
                }
                );
                Route::middleware(CheckPermission::class . ':ver_historial_movimientos_inventario')->group(function () {
                    Route::get('/producto/inventario/{id}/historial-movimientos', [InventarioController::class , 'historialMovimientos']);
                    Route::post('/producto/inventario/reporte-movimientos', [InventarioController::class , 'reporteMovimientos']);
                }
                );

                /* ---- Departamentos Disponibles ---- */
                Route::post('/disponibilidad-departamentos', [DepartamentoController::class , 'obtenerDepartamentosDisponibles']);
                Route::post('/departamentos-disponibilidad', [DepartamentoController::class , 'consultarDisponibilidadDepartamentosPorFecha']);
                Route::get('/buscar-departamentos-disponibles', [DepartamentoController::class , 'getDisponibles']);

                /* ---- Consumos (reserva) ---- */
                Route::get('/consumo-reserva', [ConsumosController::class , 'buscarConsumosPorReserva']);
                Route::post('/consumo', [ConsumosController::class , 'registrarConsumos']);
                Route::put('/consumo/{id}', [ConsumosController::class , 'update']);
                Route::delete('/consumo/{id}', [ConsumosController::class , 'delete']);

                /* ---- Estadías ---- */
                Route::post('/estadias', [EstadiaController::class , 'getEstadias']);

                /* ---- Conceptos de Pagos ---- */
                Route::post('/conceptos-pagos', [ConceptoPagoController::class , 'getConceptosPagos']);

                /* ---- Pagos ---- */
                Route::post('/pagos', [PagoController::class , 'getPagos']);
                Route::get('/pagos/historial', [PagoController::class , 'getHistorialPagos']);
                Route::post('/reserva/{reservaId}/pago', [PagoController::class , 'store']);
                Route::put('/pago/{id}', [PagoController::class , 'update']);
                Route::delete('/pago/{id}', [PagoController::class , 'delete']);
                Route::post('/totales-pagos', [PagoController::class , 'getTotalesPorReserva']);



                // ================================================================
                // VENTAS DE MOSTRADOR — Acceso: ADMIN|GERENTE libre, ASISTENTE con permiso
                // ================================================================
        
                /* ---- Consumos Externos ---- */
                Route::middleware(CheckPermission::class . ':ver_consumos_externos')->group(function () {
                    Route::get('/consumos-externos', [ConsumosController::class , 'buscarConsumosExternos']);
                    Route::post('/consumos-externos', [ConsumosController::class , 'registrarConsumosExterno']);
                }
                );

                /* ---- Pagos Externos ---- */
                Route::middleware(CheckPermission::class . ':ver_pagos_externos')->group(function () {
                    Route::get('/pagos-externos', [PagoController::class , 'getPagosExternos']);
                    Route::post('/pagos-externos', [PagoController::class , 'storeExterno']);
                }
                );

                /* ---- Cuentas Ventas de Mostrador ---- */
                Route::middleware(CheckPermission::class . ':ver_consumos_externos')->group(function () {
                    Route::get('/cuentas-ventas', [CuentaVentaController::class, 'index']);
                    Route::post('/cuentas-ventas', [CuentaVentaController::class, 'store'])->middleware(CheckTurnoAbierto::class);
                    Route::get('/cuentas-ventas/{id}', [CuentaVentaController::class, 'show']);
                    Route::post('/cuentas-ventas-historial', [CuentaVentaController::class, 'historial']);
                    Route::post('/cuentas-ventas/{id}/consumos', [CuentaVentaController::class, 'agregarConsumos']);
                    Route::put('/cuentas-ventas/{id}/consumos/{consumoId}', [CuentaVentaController::class, 'actualizarConsumo']);
                    Route::delete('/cuentas-ventas/{id}/consumos/{consumoId}', [CuentaVentaController::class, 'eliminarConsumo']);
                    
                    Route::put('/cuentas-ventas/{id}/consumos/{consumoId}/descuento', [CuentaVentaController::class, 'aplicarDescuentoConsumo']);
                    Route::delete('/cuentas-ventas/{id}/consumos/{consumoId}/descuento', [CuentaVentaController::class, 'removerDescuentoConsumo']);

                    Route::post('/cuentas-ventas/{id}/pagos', [CuentaVentaController::class, 'registrarPago'])->middleware(CheckTurnoAbierto::class);
                    Route::post('/cuentas-ventas/{id}/cerrar', [CuentaVentaController::class, 'cerrarCuenta'])->middleware(CheckTurnoAbierto::class);
                    Route::post('/cuentas-ventas/{id}/anular-factura', [CuentaVentaController::class, 'anularFacturaCuenta']);
                });

                /* ---- Turnos y Cajas (Asistente y Gerencia) ---- */
                Route::prefix('turnos-caja')->group(function () {
                    Route::get('/mi-turno', [TurnoCajaController::class, 'miTurno']);
                    Route::post('/abrir', [TurnoCajaController::class, 'abrir']);
                    Route::post('/movimientos', [TurnoCajaController::class, 'crearMovimiento'])->middleware(CheckTurnoAbierto::class);
                    Route::get('/reporte-cierre', [TurnoCajaController::class, 'reporteCierre']);
                    Route::post('/cerrar', [TurnoCajaController::class, 'cerrar']);
                    Route::get('/historial', [TurnoCajaController::class, 'historial'])->middleware(CheckRole::class . ':ADMINISTRADOR|GERENTE'); 
                });

                Route::middleware(CheckRole::class . ':ADMINISTRADOR|GERENTE')
                    ->prefix('cajas')
                    ->group(function () {
                        Route::get('/', [CajaController::class, 'index']);
                        Route::post('/', [CajaController::class, 'store']);
                        Route::put('/{id}', [CajaController::class, 'update']);
                        Route::patch('/{id}/toggle', [CajaController::class, 'toggleEstado']);
                        Route::delete('/{id}', [CajaController::class, 'destroy']);
                });

                /* ---- Totales Externos ---- */
                Route::middleware(CheckPermission::class . ':ver_totales_externos')->group(function () {
                    Route::post('/totales-externos', [PagoController::class , 'getTotalesExterno']);
                }
                );

                // ================================================================
                // CLIENTES DE FACTURACIÓN — Acceso: ADMINISTRADOR|GERENTE libre, ASISTENTE con permiso
                // ================================================================
                Route::middleware(CheckPermission::class . ':ver_clientes_facturacion')
                    ->prefix('clientes-facturacion')
                    ->group(function () {
                Route::get('/', [ClienteFacturacionController::class , 'index']);
                Route::get('/simple', [ClienteFacturacionController::class , 'listadoSimple']);
                Route::get('/consumidor-final', [ClienteFacturacionController::class , 'getConsumidorFinal']);
                Route::post('/buscar-identificacion', [ClienteFacturacionController::class , 'buscarPorIdentificacion']);
                Route::post('/buscar-nombre', [ClienteFacturacionController::class , 'buscarPorNombre']);
                Route::get('/prellenar-huesped/{huesped_id}', [ClienteFacturacionController::class , 'prellenarDesdeHuesped']);
                Route::get('/prellenar-reserva/{reserva_id}', [ClienteFacturacionController::class , 'prellenarDesdeReserva']);
                Route::post('/', [ClienteFacturacionController::class , 'store']);
                Route::get('/{id}', [ClienteFacturacionController::class , 'show']);
                Route::put('/{id}', [ClienteFacturacionController::class , 'update']);
                Route::patch('/{id}/toggle-estado', [ClienteFacturacionController::class , 'toggleEstado']);
                Route::get('/{id}/estadisticas', [ClienteFacturacionController::class , 'estadisticas']);
            }
            );

            // ================================================================
            // FACTURAS — Acceso: ADMINISTRADOR|GERENTE libre, ASISTENTE con permiso
            // ================================================================
            Route::middleware(CheckPermission::class . ':ver_facturas')
                ->prefix('facturas')
                ->group(function () {
                Route::get('/', [FacturaController::class , 'index']);
                Route::get('/{id}', [FacturaController::class , 'show']);
                Route::post('/generar', [FacturaController::class , 'generarFactura']);
                Route::post('/generar-externa', [FacturaController::class , 'generarFacturaExterna']);
                Route::post('/{id}/anular', [FacturaController::class , 'anularFactura']);
                Route::post('/consumos/{consumoId}/aplicar-descuento', [FacturaController::class , 'aplicarDescuentoConsumo']);
                Route::delete('/consumos/{consumoId}/eliminar-descuento', [FacturaController::class , 'eliminarDescuentoConsumo']);
                Route::post('/{id}/recalcular-totales', [FacturaController::class , 'recalcularTotales']);
                Route::get('/reserva/{reserva_id}', [FacturaController::class , 'getFacturaPorReserva']);
                Route::get('/verificar-reserva/{reserva_id}', [FacturaController::class , 'verificarPuedeFacturar']);
                Route::get('/{id}/pdf', [FacturaController::class , 'exportarPDF']);
                Route::get('/estadisticas/generales', [FacturaController::class , 'estadisticas']);
                Route::get('/reportes/cliente/{cliente_id}', [FacturaController::class , 'reportePorCliente']);
            }
            );

            // ================================================================
            // SECUENCIAS DE FACTURAS — Acceso: ADMINISTRADOR|GERENTE libre, ASISTENTE con permiso
            // ================================================================
            Route::middleware(CheckPermission::class . ':ver_secuencias_facturas')
                ->prefix('secuencias-facturas')
                ->group(function () {
                Route::get('/', [SecuenciaFacturaController::class , 'index']);
                Route::get('/activa', [SecuenciaFacturaController::class , 'getActiva']);
                Route::get('/{id}', [SecuenciaFacturaController::class , 'show']);
                Route::post('/', [SecuenciaFacturaController::class , 'store']);
                Route::put('/{id}', [SecuenciaFacturaController::class , 'update']);
                Route::patch('/{id}/toggle-estado', [SecuenciaFacturaController::class , 'toggleEstado']);
                Route::post('/{id}/reiniciar', [SecuenciaFacturaController::class , 'reiniciar']);
            }
            );
        }
        );

    });
