<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PagoRequest extends FormRequest
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
            'pagos' => 'required|array|min:1',
            'pagos.*.codigo_voucher'   => 'required|string|max:50',
            'pagos.*.concepto_pago_id' => 'required|exists:conceptos_pagos,id',
            'pagos.*.monto'            => 'required|numeric|min:0',
            'pagos.*.metodo_pago'      => 'required|in:EFECTIVO,TRANSFERENCIA,TARJETA,OTRO',
            'pagos.*.observaciones'    => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'pagos.required' => 'Debe enviar al menos un pago.',
            'pagos.*.codigo_voucher.required' => 'El código de voucher es obligatorio.',
            'pagos.*.concepto_pago_id.exists' => 'El concepto de pago no existe.',
            'pagos.*.monto.numeric' => 'El monto debe ser un valor numérico válido.',
            'pagos.*.metodo_pago.in' => 'El método de pago no es válido.',
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
