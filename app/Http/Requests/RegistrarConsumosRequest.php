<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class RegistrarConsumosRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'consumos' => ['required', 'array', 'min:1'],
            'consumos.*.reserva_id' => ['required', 'integer', 'exists:reservas,id'],
            'consumos.*.inventario_id' => ['required', 'integer', 'exists:inventarios,id'],
            'consumos.*.cantidad' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages()
    {
        return [
            'consumos.required' => 'Debes enviar al menos un consumo.',
            'consumos.array' => 'El campo consumos debe ser un arreglo.',
            'consumos.*.reserva_id.required' => 'El campo reserva_id es obligatorio.',
            'consumos.*.reserva_id.exists' => 'La reserva seleccionada no existe.',
            'consumos.*.inventario_id.required' => 'El campo inventario_id es obligatorio.',
            'consumos.*.inventario_id.exists' => 'El inventario seleccionado no existe.',
            'consumos.*.cantidad.required' => 'El campo cantidad es obligatorio.',
            'consumos.*.cantidad.min' => 'La cantidad debe ser al menos 1.',
        ];
    }
}
