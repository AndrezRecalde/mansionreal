<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ServicioRequest extends FormRequest
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
            'nombre_servicio' => 'required|string|max:100',
            'tipo_servicio'   => 'required|string|max:80',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_servicio.required' => 'El nombre del servicio es obligatorio.',
            'nombre_servicio.string'   => 'El nombre del servicio debe ser una cadena de texto.',
            'nombre_servicio.max'      => 'El nombre del servicio no debe exceder los 100 caracteres.',
            'tipo_servicio.required'   => 'El tipo de servicio es obligatorio.',
            'tipo_servicio.string'     => 'El tipo de servicio debe ser una cadena de texto.',
            'tipo_servicio.max'        => 'El tipo de servicio no debe exceder los 80 caracteres.',
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
