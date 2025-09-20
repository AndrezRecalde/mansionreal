<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class GastoRequest extends FormRequest
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
            'reserva_id'   => 'required|integer|exists:reservas,id',
            'descripcion'  => 'required|string|max:255',
            'monto'        => 'required|numeric|min:0',
            'tipo_dano_id' => 'nullable|integer|exists:tipos_danos,id',
        ];
    }

    public function messages(): array
    {
        return [
            'reserva_id.required'   => 'El campo reserva_id es obligatorio.',
            'reserva_id.integer'    => 'El campo reserva_id debe ser un número entero.',
            'reserva_id.exists'     => 'El campo reserva_id debe existir en la tabla reservas.',
            'descripcion.required'  => 'El campo descripcion es obligatorio.',
            'descripcion.string'    => 'El campo descripcion debe ser una cadena de texto.',
            'descripcion.max'       => 'El campo descripcion no debe exceder los 255 caracteres.',
            'monto.required'        => 'El campo monto es obligatorio.',
            'monto.numeric'         => 'El campo monto debe ser un número.',
            'monto.min'             => 'El campo monto debe ser al menos 0.',
            'tipo_dano_id.integer'  => 'El campo tipo_dano_id debe ser un número entero.',
            'tipo_dano_id.exists'   => 'El campo tipo_dano_id debe existir en la tabla tipos_danos.',
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
