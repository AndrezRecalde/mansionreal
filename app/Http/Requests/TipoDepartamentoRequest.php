<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class TipoDepartamentoRequest extends FormRequest
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
            'nombre_tipo' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_tipo.required' => 'El nombre del tipo de departamento es obligatorio.',
            'nombre_tipo.string'   => 'El nombre del tipo de departamento debe ser una cadena de texto.',
            'nombre_tipo.max'      => 'El nombre del tipo de departamento no debe exceder los 255 caracteres.',
            'descripcion.string'   => 'La descripción debe ser una cadena de texto.',
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
