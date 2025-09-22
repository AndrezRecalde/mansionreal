<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\DepartamentoRequest;
use App\Models\Departamento;
use App\Models\Estado;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;


class DepartamentoController extends Controller
{
    function getDepartamentos(): JsonResponse
    {
        $departamentos = Departamento::from('departamentos as d')
            ->select(
                'd.id',
                'd.numero_departamento',
                'td.id as tipo_departamento_id',
                'td.nombre_tipo as tipo_departamento',
                'td.descripcion',
                'd.capacidad',
                'i.precio_unitario as precio_noche',
                'e.nombre_estado as estado',
                'e.color as estado_color',
                'd.activo',
                DB::raw('(select count(*) from departamento_servicio where departamento_servicio.departamento_id = d.id) as servicios_count')
            )
            ->with(['imagenes', 'servicios'])
            ->leftJoin('tipos_departamentos as td', 'd.tipo_departamento_id', 'td.id')
            ->leftJoin('inventarios as i', 'td.inventario_id', '=', 'i.id')
            ->leftJoin('estados as e', 'd.estado_id', '=', 'e.id')
            ->orderBy('d.numero_departamento', 'ASC')
            ->get();

        return response()->json([
            'status' => HTTPStatus::Success,
            'departamentos' => $departamentos
        ]);
    }

    public function store(DepartamentoRequest $request): JsonResponse
    {
        try {
            $departamento = Departamento::create($request->validated());

            // Agregar imágenes si existen
            if ($request->hasFile('imagenesNuevas')) {
                foreach ($request->file('imagenesNuevas') as $imagen) {
                    // Guardar la imagen en storage/app/public/departamentos
                    $path = $imagen->store('departamentos', 'public');

                    // Guardar la ruta en la base de datos
                    $departamento->imagenes()->create([
                        'imagen_url' => $path
                    ]);
                }
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'   => HTTPStatus::Creacion
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }


    public function update(DepartamentoRequest $request, int $id): JsonResponse
    {
        try {
            $departamento = Departamento::find($id);
            if (!$departamento) {
                return response()->json([
                    'status' => 'error',
                    'msg'    => 'Departamento no encontrado'
                ], 404);
            }

            // Actualizar campos del departamento
            $departamento->update($request->validated());

            // --- IMÁGENES ---

            // 1️⃣ Eliminar imágenes que no están en "imagenesExistentes"
            $imagenesExistentes = $request->input('imagenesExistentes', []);
            $departamento->imagenes()
                ->whereNotIn('id', $imagenesExistentes)
                ->get()
                ->each(function ($img) {
                    // eliminar archivo físico si es necesario
                    Storage::disk('public')->delete($img->imagen_url);
                    $img->delete();
                });

            // 2️⃣ Subir nuevas imágenes si las hay
            if ($request->hasFile('imagenesNuevas')) {
                foreach ($request->file('imagenesNuevas') as $file) {
                    $path = $file->store('departamentos', 'public');
                    $departamento->imagenes()->create([
                        'imagen_url' => $path
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'msg'   => 'Departamento actualizado correctamente'
                //'data'   => $departamento->load('imagenes', 'servicios')
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => 'error',
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function agregarServiciosDepartamento(Request $request): JsonResponse
    {
        try {
            $departamento = Departamento::find($request->departamento_id);
            if (!$departamento) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'Departamento no encontrado'
                ], 404);
            }

            // Sincronizar servicios (agregar nuevos y eliminar los no seleccionados)
            $departamento->servicios()->sync($request->servicios);

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => 'Servicios actualizados correctamente',
                //'data'   => $departamento->load('servicios')
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }


    function show(int $id): JsonResponse
    {
        try {
            $departamento = Departamento::with(['tipoDepartamento', 'estado', 'imagenes', 'servicios'])
                ->find($id);
            if (!$departamento) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'Departamento no encontrado'
                ], 404);
            }

            return response()->json([
                'status' => HTTPStatus::Success,
                'data'   => $departamento
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function obtenerDepartamentosDisponibles(Request $request): JsonResponse
    {
        // Obtener los departamentos con o sin reservas con un scope de fechas
        try {
            $departamentos = Departamento::with(['tipoDepartamento', 'estado', 'servicios'])
                ->disponiblesEnFechas($request->fecha_checkin, $request->fecha_checkout)
                ->get();

            return response()->json([
                'status' => HTTPStatus::Success,
                'data'   => $departamentos
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function cambiarEstadoDepartamento(Request $request, int $id): JsonResponse
    {
        try {
            $departamento = Departamento::find($id);
            if (!$departamento) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'Departamento no encontrado'
                ], 404);
            }

            $estado = Estado::where('nombre_estado', $request->nombre_estado)
                ->first();

            if (!$estado) {
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => 'Estado no válido para departamento'
                ], 400);
            }

            $departamento->estado_id = $estado->id;
            $departamento->save();

            return response()->json([
                'status' => HTTPStatus::Success,
                'msg'    => 'Estado del departamento actualizado',
            ]);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }


    /* PARA LA VISTA PRINCIPAL DE LA DISPONIBILIDAD DE LOS DEPARTAMENTOS */
    public function consultarDisponibilidadDepartamentosPorFecha(Request $request)
    {
        $fecha = $request->fecha ?? date('Y-m-d');

        // 1. Estados activos RESERVA y DEPARTAMENTO
        $estadosReserva = \App\Models\Estado::where('activo', 1)
            ->where('tipo_estado', 'RESERVA')
            ->whereIn('nombre_estado', ['RESERVADO', 'CONFIRMADO'])
            ->pluck('id')
            ->toArray();

        $estadoDisponible = \App\Models\Estado::where('activo', 1)
            ->where('tipo_estado', 'DEPARTAMENTO')
            ->where('nombre_estado', 'DISPONIBLE')
            ->first();

        $estadoOcupado = \App\Models\Estado::where('activo', 1)
            ->where('tipo_estado', 'DEPARTAMENTO')
            ->where('nombre_estado', 'OCUPADO')
            ->first();

        // 2. Estados no disponibles por prioridad: LIMPIEZA y MANTENIMIENTO
        $estadosNoDisponibles = \App\Models\Estado::where('activo', 1)
            ->where('tipo_estado', 'DEPARTAMENTO')
            ->whereIn('nombre_estado', ['LIMPIEZA', 'MANTENIMIENTO'])
            ->get()
            ->keyBy('id');

        // 3. Traer departamentos con reservas que cruzan la fecha consultada
        $departamentos = \App\Models\Departamento::with([
            'imagenes',
            'tipoDepartamento',
            'reservas' => function ($q) use ($fecha, $estadosReserva) {
                $q->where('fecha_checkin', '<=', $fecha)
                    ->where('fecha_checkout', '>=', $fecha)
                    ->whereIn('estado_id', $estadosReserva);
            },
            'estado',
            'reservas.consumos'
        ])->get();

        // 4. Formatear la respuesta
        $resultado = $departamentos->map(function ($dpto) use ($estadoDisponible, $estadoOcupado, $estadosNoDisponibles) {
            // Prioridad: estado LIMPIEZA o MANTENIMIENTO
            if (isset($estadosNoDisponibles[$dpto->estado_id])) {
                $estadoDepto = $estadosNoDisponibles[$dpto->estado_id];
                return [
                    'id'                  => $dpto->id,
                    'numero_departamento' => $dpto->numero_departamento,
                    'imagenes'            => $dpto->imagenes->pluck('imagen_url'),

                    'tipo_departamento'   => $dpto->tipoDepartamento?->nombre_tipo,
                    'capacidad'           => $dpto->capacidad,
                    'precio_noche'        => $dpto->tipoDepartamento?->inventario?->precio_unitario,

                    'estado'              => [
                        'id'    => $estadoDepto->id,
                        'nombre' => $estadoDepto->nombre_estado,
                        'color' => $estadoDepto->color,
                    ],
                    'reserva'             => null,
                ];
            }

            // Lógica normal de reservas
            $reservada = $dpto->reservas->count() > 0;
            $reserva = $reservada ? $dpto->reservas->first() : null;

            return [
                'id'                  => $dpto->id,
                'numero_departamento' => $dpto->numero_departamento,
                'imagenes'            => $dpto->imagenes->pluck('imagen_url'),
                'tipo_departamento'   => $dpto->tipoDepartamento?->nombre_tipo,
                'capacidad'           => $dpto->capacidad,
                'precio_noche'        => $dpto->tipoDepartamento?->inventario?->precio_unitario,
                'estado'              => [
                    'id'    => $reservada ? $estadoOcupado->id : $estadoDisponible->id,
                    'nombre' => $reservada ? $estadoOcupado->nombre_estado : $estadoDisponible->nombre_estado,
                    'color' => $reservada ? $estadoOcupado->color : $estadoDisponible->color,
                ],
                'reserva'             => $reservada ? [
                    'id'             => $reserva->id,
                    'codigo_reserva' => $reserva->codigo_reserva,
                    'huesped'        => $reserva->huesped?->nombres . ' ' . $reserva->huesped?->apellidos,
                    'huesped_dni'    => $reserva->huesped?->dni,
                    'fecha_checkin'  => $reserva->fecha_checkin,
                    'fecha_checkout' => $reserva->fecha_checkout,
                    'total_noches'   => $reserva->total_noches,
                    'estado'         => [
                        'id'      => $reserva->estado?->id,
                        'nombre'  => $reserva->estado?->nombre_estado,
                        'color'   => $reserva->estado?->color,
                    ],
                    'consumos'      => $reserva->consumos ? $reserva->consumos->map(function ($consumo) {
                        return [
                            'id'          => $consumo->id,
                            'producto'    => $consumo->inventario?->nombre_producto,
                            'cantidad'    => $consumo->cantidad,
                            'subtotal'    => $consumo->subtotal,
                            'iva'         => $consumo->iva,
                            'total'       => $consumo->total,
                        ];
                    }) : null,
                ] : null,
            ];
        });

        return response()->json([
            'status' => HTTPStatus::Success,
            'departamentos'   => $resultado
        ], 200);
    }
}
