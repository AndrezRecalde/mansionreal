<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class SecuenciaFacturaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $isUpdate = $this->isMethod('PUT') || $this->isMethod('PATCH');

        return [
            // Solo requeridos en creación
            'establecimiento' => $isUpdate ? 'sometimes|string|size:3' : 'required|string|size:3',
            'punto_emision' => $isUpdate ? 'sometimes|string|size:3' : 'required|string|size:3',
            'secuencial_inicio' => $isUpdate ? 'sometimes|integer|min:1' : 'required|integer|min:1',
            'longitud_secuencial' => $isUpdate ? 'sometimes|integer|min:1|max:15' : 'required|integer|min:1|max:15',

            // Opcionales
            'secuencial_fin' => 'nullable|integer|min:1',
            'descripcion' => 'nullable|string|max:500',
            'activo' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'establecimiento.required' => 'El código de establecimiento es obligatorio',
            'establecimiento.size' => 'El código de establecimiento debe tener exactamente 3 dígitos',

            'punto_emision.required' => 'El código de punto de emisión es obligatorio',
            'punto_emision.size' => 'El código de punto de emisión debe tener exactamente 3 dígitos',

            'secuencial_inicio. required' => 'El secuencial inicial es obligatorio',
            'secuencial_inicio. integer' => 'El secuencial inicial debe ser un número entero',
            'secuencial_inicio.min' => 'El secuencial inicial debe ser al menos 1',

            'secuencial_fin.integer' => 'El secuencial final debe ser un número entero',
            'secuencial_fin.min' => 'El secuencial final debe ser al menos 1',

            'longitud_secuencial.required' => 'La longitud del secuencial es obligatoria',
            'longitud_secuencial.integer' => 'La longitud debe ser un número entero',
            'longitud_secuencial. min' => 'La longitud mínima es 1',
            'longitud_secuencial.max' => 'La longitud máxima es 15',

            'descripcion.max' => 'La descripción no puede exceder 500 caracteres',

            'activo.boolean' => 'El campo activo debe ser verdadero o falso',
        ];
    }

    /**
     * Validación adicional después de las reglas básicas
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar que el establecimiento y punto de emisión sean numéricos
            if ($this->establecimiento && ! is_numeric($this->establecimiento)) {
                $validator->errors()->add('establecimiento', 'El establecimiento debe contener solo números');
            }

            if ($this->punto_emision && !is_numeric($this->punto_emision)) {
                $validator->errors()->add('punto_emision', 'El punto de emisión debe contener solo números');
            }

            // Validar que secuencial_fin > secuencial_inicio
            if ($this->secuencial_fin && $this->secuencial_inicio) {
                if ($this->secuencial_fin < $this->secuencial_inicio) {
                    $validator->errors()->add('secuencial_fin', 'El secuencial final debe ser mayor al inicial');
                }
            }
        });
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        throw new HttpResponseException(
            response()->json([
                'status' => 'error',
                'errores' => $validator->errors()
            ], 422)
        );
    }
}
