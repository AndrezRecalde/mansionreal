<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ConsumoRequest extends FormRequest
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
            'reserva_id'    => 'required|exists:reservas,id',
            'inventario_id' => 'required|exists:inventarios,id',
            'cantidad'      => 'required|integer|min:1',
        ];
    }

    public function messages(): array
    {
        return [
            'reserva_id.required'    => 'El campo reserva_id es obligatorio.',
            'reserva_id.exists'      => 'El reserva_id proporcionado no existe.',
            'inventario_id.required' => 'El campo inventario_id es obligatorio.',
            'inventario_id.exists'   => 'El inventario_id proporcionado no existe.',
            'cantidad.required'      => 'El campo cantidad es obligatorio.',
            'cantidad.integer'       => 'El campo cantidad debe ser un número entero.',
            'cantidad.min'           => 'El campo cantidad debe ser al menos 1.',
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
