<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use App\Models\ClienteFacturacion;

class ClienteFacturacionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $clienteId = $this->route('id');

        return [
            'tipo_cliente' => [
                'required',
                Rule::in([
                    ClienteFacturacion::TIPO_CLIENTE_CONSUMIDOR_FINAL,
                    ClienteFacturacion::TIPO_CLIENTE_REGISTRADO
                ])
            ],
            'tipo_identificacion' => [
                'required',
                Rule::in([
                    ClienteFacturacion::TIPO_IDENTIFICACION_CEDULA,
                    ClienteFacturacion::TIPO_IDENTIFICACION_RUC,
                    ClienteFacturacion::TIPO_IDENTIFICACION_PASAPORTE,
                    ClienteFacturacion::TIPO_IDENTIFICACION_CF
                ])
            ],
            'identificacion' => [
                'required',
                'string',
                'max:20',
                Rule::unique('clientes_facturacion', 'identificacion')->ignore($clienteId)
            ],
            'nombres_completos' => 'required|string|max:300',
            'direccion' => 'nullable|string|max:500',
            'telefono' => 'nullable|string|max:15',
            'email' => 'nullable|email|max:100',
            'observaciones' => 'nullable|string|max:500',
            'activo' => 'sometimes|boolean',
        ];
    }

    public function messages(): array
    {
        return [
            'tipo_cliente.required' => 'El tipo de cliente es obligatorio',
            'tipo_cliente.in' => 'El tipo de cliente debe ser CONSUMIDOR_FINAL o CLIENTE_REGISTRADO',

            'tipo_identificacion.required' => 'El tipo de identificación es obligatorio',
            'tipo_identificacion.in' => 'El tipo de identificación no es válido',

            'identificacion.required' => 'La identificación (DNI/RUC/Pasaporte) es obligatoria',
            'identificacion.unique' => 'Ya existe un cliente con esa identificación',
            'identificacion.max' => 'La identificación no puede exceder 20 caracteres',

            'nombres_completos.required' => 'Los nombres completos son obligatorios',
            'nombres_completos.max' => 'Los nombres completos no pueden exceder 300 caracteres',

            'direccion.max' => 'La dirección no puede exceder 500 caracteres',

            'telefono.max' => 'El teléfono no puede exceder 15 caracteres',

            'email.email' => 'El formato del email es inválido',
            'email.max' => 'El email no puede exceder 100 caracteres',

            'observaciones.max' => 'Las observaciones no pueden exceder 500 caracteres',

            'activo.boolean' => 'El campo activo debe ser verdadero o falso',
        ];
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
