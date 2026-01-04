<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ReservaRequest extends FormRequest
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
            'departamento_id'    => 'required|integer|exists:departamentos,id',
            'fecha_checkin'      => 'required|date|after_or_equal:today',
            'fecha_checkout'     => 'required|date|after:fecha_checkin',
            'total_noches'       =>  'required|integer|min:1',
            'total_adultos'      => '',
            'total_ninos'        => '',
            'total_mascotas'     => '',

        ];
    }

    public function messages(): array
    {
        return [
            'departamento_id.required'  => 'El ID del departamento es obligatorio.',
            'departamento_id.integer'   => 'El ID del departamento debe ser un número entero.',
            'departamento_id.exists'    => 'El ID del departamento no existe en la base de datos.',

            'fecha_checkin.required'    => 'La fecha de check-in es obligatoria.',
            'fecha_checkin.date'        => 'La fecha de check-in debe ser una fecha válida.',
            'fecha_checkin.after_or_equal' => 'La fecha de check-in no puede ser anterior a hoy.',

            'total_noches.required'   => 'El total de noches es obligatorio.',
            'total_noches.integer'    => 'El total de noches debe ser un número entero.',
            'total_noches.min'        => 'El total de noches debe ser al menos 1.',

            'fecha_checkout.required'   => 'La fecha de check-out es obligatoria.',
            'fecha_checkout.date'       => 'La fecha de check-out debe ser una fecha válida.',
            'fecha_checkout.after'      => 'La fecha de check-out debe ser posterior a la fecha de check-in.',


        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
