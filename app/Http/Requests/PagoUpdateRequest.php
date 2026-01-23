<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class PagoUpdateRequest extends FormRequest
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
            'codigo_voucher'   => 'nullable|string|max:100',
            'concepto_pago_id' => 'required|exists:conceptos_pagos,id',
            'monto'            => 'required|numeric|min:0',
            'metodo_pago'      => 'required|in:EFECTIVO,TRANSFERENCIA,TARJETA,OTRO',
            'observaciones'    => 'nullable|string'
        ];
    }

    public function messages(): array
    {
        return [
            'concepto_pago_id.exists'   => 'El concepto de pago no existe.',
            'monto.numeric'             => 'El monto debe ser un valor numérico válido.',
            'metodo_pago.in'            => 'El método de pago no es válido.',
        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
