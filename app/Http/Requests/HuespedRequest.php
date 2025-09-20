<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class HuespedRequest extends FormRequest
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
            'apellidos'     => 'required|string|max:100',
            'nombres'       => 'required|string|max:100',
            'dni'           => 'required|string|max:20|unique:huespedes,dni,' . $this->route('id'),
            'telefono'      => 'nullable|string|max:20',
            'email'         => 'nullable|email|max:100',
            'provincia_id'  => 'nullable|exists:provincias,id',
            'activo'        => 'sometimes|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'apellidos.required'    => 'Los apellidos son obligatorios.',
            'apellidos.string'      => 'Los apellidos deben ser una cadena de texto.',
            'apellidos.max'         => 'Los apellidos no deben exceder los 100 caracteres.',
            'nombres.required'      => 'Los nombres son obligatorios.',
            'nombres.string'        => 'Los nombres deben ser una cadena de texto.',
            'nombres.max'           => 'Los nombres no deben exceder los 100 caracteres.',
            'dni.required'          => 'El DNI es obligatorio.',
            'dni.string'            => 'El DNI debe ser una cadena de texto.',
            'dni.max'               => 'El DNI no debe exceder los 20 caracteres.',
            'dni.unique'            => 'El DNI ya existe.',
            'telefono.string'       => 'El teléfono debe ser una cadena de texto.',
            'telefono.max'          => 'El teléfono no debe exceder los 20 caracteres.',
            'email.email'           => 'El correo electrónico debe ser una dirección de correo válida.',
            'email.max'             => 'El correo electrónico no debe exceder los 100 caracteres.',
            'provincia_id.exists'   => 'La provincia seleccionada no es válida.',
            'activo.boolean'        => 'El campo activo debe ser verdadero o falso.'
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
