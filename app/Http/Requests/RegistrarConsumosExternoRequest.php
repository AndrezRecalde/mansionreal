<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistrarConsumosExternoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'consumos' => 'required|array|min:1',
            'consumos.*.inventario_id' => 'required|integer|exists:inventarios,id',
            'consumos.*.cantidad' => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'consumos.required' => 'Debe agregar al menos un producto.',
            'consumos.*.inventario_id.required' => 'Cada producto debe tener un inventario_id válido.',
            'consumos.*.inventario_id.exists' => 'Uno de los productos no existe en el inventario.',
            'consumos.*.cantidad.required' => 'Cada producto debe tener una cantidad.',
            'consumos.*.cantidad.min' => 'La cantidad mínima es 1.',
        ];
    }
}
