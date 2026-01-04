<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class InventarioRequest extends FormRequest
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
            'nombre_producto' => 'required|string|max:255',
            'descripcion'     => 'nullable|string',
            'precio_unitario' => 'required',
            'categoria_id'    => 'required|exists:categorias,id',
            'sin_stock'      => 'required|boolean',
            //'activo'         => 'boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre_producto.required' => 'El nombre del producto es obligatorio.',
            'nombre_producto.string'   => 'El nombre del producto debe ser una cadena de texto.',
            'nombre_producto.max'      => 'El nombre del producto no debe exceder los 255 caracteres.',
            'descripcion.string'       => 'La descripción debe ser una cadena de texto.',
            'precio_unitario.required' => 'El precio unitario es obligatorio.',
            'categoria_id.required'    => 'La categoría es obligatoria.',
            'categoria_id.exists'      => 'La categoría seleccionada no es válida.',
            'sin_stock.required'      => 'Elija si el producto cuenta con stock.',
            'sin_stock.boolean'       => 'El campo sin_stock debe ser verdadero o falso.',
            //'activo.boolean'           => 'El campo activo debe ser verdadero o falso.',
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
