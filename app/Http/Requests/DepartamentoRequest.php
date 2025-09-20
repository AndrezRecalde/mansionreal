<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;


class DepartamentoRequest extends FormRequest
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
            'numero_departamento'   => ['required', Rule::unique('departamentos')->ignore($this->request->get('id'))],
            'tipo_departamento_id'  => 'required|exists:tipos_departamentos,id',
            'capacidad'             => 'required|integer|min:1',
            'imagenes'              => 'sometimes|array',
        ];
    }

    public function messages(): array
    {
        return [
            'numero_departamento.required'      => 'El número de departamento es obligatorio.',
            'numero_departamento.string'        => 'El número de departamento debe ser una cadena de texto.',
            'numero_departamento.max'           => 'El número de departamento no debe exceder los 10 caracteres.',
            'numero_departamento.unique'        => 'El número de departamento ya existe.',
            'tipo_departamento_id.required'     => 'El tipo de departamento es obligatorio.',
            'tipo_departamento_id.exists'       => 'El tipo de departamento seleccionado no es válido.',
            'capacidad.required'                => 'La capacidad es obligatoria.',
            'capacidad.integer'                 => 'La capacidad debe ser un número entero.',
            'capacidad.min'                     => 'La capacidad debe ser al menos 1.',
            'imagenes.array'                    => 'Las imágenes deben ser un arreglo.',
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
