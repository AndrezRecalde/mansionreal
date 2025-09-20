<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ConfiguracionIvaRequest extends FormRequest
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
            'descripcion'   => 'required|string|max:255',
            'tasa_iva'      => 'required|numeric|min:0|max:100',
            'fecha_inicio'  => 'required|date',
            'fecha_fin'     => 'required|date|after:fecha_inicio',
        ];
    }

    public function messages(): array
    {
        return [
            'descripcion.required'  => 'La descripción es obligatoria.',
            'descripcion.string'    => 'La descripción debe ser una cadena de texto.',
            'descripcion.max'       => 'La descripción no debe exceder los 255 caracteres.',
            'tasa_iva.required'     => 'La tasa de IVA es obligatoria.',
            'tasa_iva.numeric'      => 'La tasa de IVA debe ser un número.',
            'tasa_iva.min'          => 'La tasa de IVA no puede ser negativa.',
            'tasa_iva.max'          => 'La tasa de IVA no puede ser mayor a 100.',
            'fecha_inicio.required' => 'La fecha de inicio es obligatoria.',
            'fecha_inicio.date'     => 'La fecha de inicio no es una fecha válida.',
            'fecha_fin.required'    => 'La fecha de fin es obligatoria.',
            'fecha_fin.date'        => 'La fecha de fin no es una fecha válida.',
            'fecha_fin.after'       => 'La fecha de fin debe ser posterior a la fecha de inicio.',
        ];
    }

     protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
