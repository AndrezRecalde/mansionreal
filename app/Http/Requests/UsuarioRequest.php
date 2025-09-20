<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;


class UsuarioRequest extends FormRequest
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
            'apellidos' => 'required',
            'nombres'   => 'required',
            'dni'       => ['required', Rule::unique('users')->ignore($this->request->get('id'))],
            'email'     => ['required', 'string', 'email', 'max:100', 'unique:users,email,' . $this->route('id')],
            'role'      => 'required'
        ];
    }

    public function messages(): array
    {
        return [
            'apellidos.required' => 'Los apellidos son obligatorios.',
            'nombres.required'   => 'Los nombres son obligatorios.',
            'dni.required'       => 'El DNI es obligatorio.',
            'dni.unique'         => 'El DNI ya está registrado.',
            'email.required'     => 'El email es obligatorio.',
            'email.email'        => 'El email no es válido.',
            'email.unique'       => 'El email ya está registrado.',
            'role.required'      => 'El rol es obligatorio.'
        ];
    }

     protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json(['errores' => $validator->errors()], 422));
    }
}
