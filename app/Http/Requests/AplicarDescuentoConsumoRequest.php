<?php

namespace App\Http\Requests;

use App\Models\Consumo;
use Illuminate\Foundation\Http\FormRequest;

class AplicarDescuentoConsumoRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'descuento' => 'required|numeric|min:0',
            'tipo_descuento' => 'required|in:MONTO_FIJO,PORCENTAJE',
            'porcentaje_descuento' => 'required_if:tipo_descuento,PORCENTAJE|nullable|numeric|min:0|max:100',
            'motivo_descuento' => [
                'nullable',
                'string',
                'min:10',
                'max:200',
            ],
        ];
    }

    /**
     * ✅ Validación adicional después de las reglas básicas
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Obtener el consumo una sola vez
            $consumo = Consumo::find($this->route('id'));

            if (!$consumo) {
                $validator->errors()->add('consumo', 'Consumo no encontrado');
                return;
            }

            // Calcular porcentaje del descuento
            $porcentaje = $this->calcularPorcentajeDescuento($consumo);

            // Validar que el descuento no exceda el subtotal
            if ($this->tipo_descuento === 'MONTO_FIJO') {
                if ($this->descuento > $consumo->subtotal) {
                    $validator->errors()->add(
                        'descuento',
                        'El descuento no puede ser mayor al subtotal del consumo'
                    );
                }
            }

            // Validar motivo obligatorio para descuentos > 50%
            if ($porcentaje > 50 && empty($this->motivo_descuento)) {
                $validator->errors()->add(
                    'motivo_descuento',
                    'El motivo es obligatorio para descuentos mayores al 50%'
                );
            }

            // Validar que el consumo no esté facturado
            if ($consumo->esta_facturado) {
                $validator->errors()->add(
                    'consumo',
                    'No se puede aplicar descuento a un consumo ya facturado'
                );
            }
        });
    }

    /**
     * ✅ Método helper para calcular porcentaje
     */
    private function calcularPorcentajeDescuento(Consumo $consumo): float
    {
        if ($this->tipo_descuento === 'PORCENTAJE') {
            return (float) $this->porcentaje_descuento;
        }

        if ($this->tipo_descuento === 'MONTO_FIJO' && $consumo->subtotal > 0) {
            return ($this->descuento / $consumo->subtotal) * 100;
        }

        return 0;
    }

    /**
     * ✅ Mensajes personalizados
     */
    public function messages(): array
    {
        return [
            'descuento.required' => 'El monto del descuento es obligatorio',
            'descuento.numeric' => 'El descuento debe ser un número',
            'descuento.min' => 'El descuento debe ser mayor o igual a 0',
            'tipo_descuento.required' => 'El tipo de descuento es obligatorio',
            'tipo_descuento.in' => 'El tipo de descuento debe ser MONTO_FIJO o PORCENTAJE',
            'porcentaje_descuento.required_if' => 'El porcentaje es obligatorio cuando el tipo es PORCENTAJE',
            'porcentaje_descuento.numeric' => 'El porcentaje debe ser un número',
            'porcentaje_descuento.min' => 'El porcentaje debe ser mayor o igual a 0',
            'porcentaje_descuento.max' => 'El porcentaje no puede ser mayor a 100',
            'motivo_descuento.min' => 'El motivo debe tener al menos 10 caracteres',
            'motivo_descuento.max' => 'El motivo no puede exceder 200 caracteres',
        ];
    }

    /**
     * ✅ Atributos personalizados para mensajes
     */
    public function attributes(): array
    {
        return [
            'descuento' => 'descuento',
            'tipo_descuento' => 'tipo de descuento',
            'porcentaje_descuento' => 'porcentaje',
            'motivo_descuento' => 'motivo',
        ];
    }
}
