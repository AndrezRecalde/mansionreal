<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ConsumoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'inventario_id'   => $this->inventario->id,
            'nombre_producto' => $this->inventario->nombre_producto,
            'precio_unitario' => (float) $this->inventario->precio_unitario,
            'reserva_id'      => $this->reserva_id,
            'huesped'         => $this->reserva->huesped->nombres_completos,
            'cantidad'        => (int) $this->cantidad,

            // Montos
            'subtotal'        => (float) $this->subtotal,
            'tasa_iva'        => (float) $this->tasa_iva,
            'iva'             => (float) $this->iva,
            'total'           => (float) $this->total,

            // ✅ Campos de descuento
            'descuento'       => (float) $this->descuento,
            'tipo_descuento'  => $this->tipo_descuento,
            'porcentaje_descuento' => $this->porcentaje_descuento
                ? (float) $this->porcentaje_descuento
                : null,
            'motivo_descuento' => $this->motivo_descuento,
            'tiene_descuento' => (bool) $this->tiene_descuento,
            'usuario_descuento' => $this->usuario_descuento_nombre,

            // Metadata
            'fecha_creacion'  => $this->fecha_creacion,
            'esta_facturado'  => (bool) $this->esta_facturado,
            'factura_id'      => $this->factura_id,

            // Timestamps (opcional)
            'created_at'      => $this->created_at?->toISOString(),
            'updated_at'      => $this->updated_at?->toISOString(),

            // ✅ Relaciones cargadas (opcional)
            'inventario'      => $this->whenLoaded('inventario'),
            'usuario_registro_descuento' => $this->whenLoaded('usuarioRegistroDescuento', function () {
                return [
                    'id' => $this->usuarioRegistroDescuento->id,
                    'nombres' => $this->usuarioRegistroDescuento->nombres,
                    'apellidos' => $this->usuarioRegistroDescuento->apellidos,
                ];
            }),
        ];
    }
}
