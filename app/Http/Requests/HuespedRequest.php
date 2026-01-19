<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;

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
            'nombres_completos' => 'required|string|max:250',
            'dni'           => ['required', Rule::unique('huespedes')->ignore($this->request->get('id'))],
            'telefono'      => 'nullable|string|max:20',
            'email'         => 'nullable|email|max:100',
            'activo'        => 'sometimes|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'nombres_completos.required' => 'El nombre completo es obligatorio.',
            'nombres_completos.string'   => 'El nombre completo debe ser una cadena de texto.',
            'nombres_completos.max'      => 'El nombre completo no debe exceder los 250 caracteres.',
            'dni.required'          => 'El DNI es obligatorio.',
            'dni.unique'            => 'El DNI ya existe.',
            'telefono.string'       => 'El teléfono debe ser una cadena de texto.',
            'telefono.max'          => 'El teléfono no debe exceder los 20 caracteres.',
            'email.email'           => 'El correo electrónico debe ser una dirección de correo válida.',
            'email.max'             => 'El correo electrónico no debe exceder los 100 caracteres.',
            'activo.boolean'        => 'El campo activo debe ser verdadero o falso.'
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
