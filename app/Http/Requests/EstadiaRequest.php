<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class EstadiaRequest extends FormRequest
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
            'fecha_checkin'      => 'required|date|after_or_equal:today',
            'fecha_checkout'     => 'required|date|after_or_equal:fecha_checkin',
            'total_adultos'      => 'required',
            'total_ninos'        => 'required',
            'total_mascotas'     => 'required',
        ];
    }

    public function messages(): array
    {
        return [

            'fecha_checkin.required'    => 'La fecha de check-in es obligatoria.',
            'fecha_checkin.date'        => 'La fecha de check-in debe ser una fecha válida.',
            'fecha_checkin.after_or_equal' => 'La fecha de check-in no puede ser anterior a hoy.',

            'total_adultos.required'    =>  'El total de adultos es requerido',
            'total_ninos.required'    =>  'El total de adultos es requerido',
            'total_mascotas.required'    =>  'El total de adultos es requerido',

            'fecha_checkout.required'   => 'La fecha de check-out es obligatoria.',
            'fecha_checkout.date'       => 'La fecha de check-out debe ser una fecha válida.',
            'fecha_checkout.after_or_equal'  => 'La fecha de check-out debe ser posterior o igual a la fecha de check-in.',


        ];
    }

    protected function failedValidation(Validator $validator): HttpResponseException
    {
        /* $errors = (new ValidationException($validator))->errors(); */
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
