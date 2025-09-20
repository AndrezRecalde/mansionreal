<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class CategoriaRequest extends FormRequest
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
            'nombre_categoria'  => 'required|string|max:255|unique:categorias,nombre_categoria,' . $this->route('id'),
            //'activo'            => 'sometimes|boolean'
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_categoria.required' => 'El nombre de la categoría es obligatorio.',
            'nombre_categoria.string'   => 'El nombre de la categoría debe ser una cadena de texto.',
            'nombre_categoria.max'      => 'El nombre de la categoría no debe exceder los 255 caracteres.',
            'nombre_categoria.unique'   => 'El nombre de la categoría ya existe.',
            //'activo.boolean'            => 'El campo activo debe ser verdadero o falso.'
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
