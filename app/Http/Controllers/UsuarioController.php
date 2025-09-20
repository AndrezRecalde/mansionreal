<?php

namespace App\Http\Controllers;

use App\Enums\HTTPStatus;
use App\Http\Requests\StatusRequest;
use App\Http\Requests\UserPassword;
use App\Http\Requests\UsuarioRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class UsuarioController extends Controller
{
    function getUsuarios(): JsonResponse
    {
        try {
            $usuarios = User::with('roles')->allowed()->get();
            return response()->json([
                'status' => HTTPStatus::Success,
                'usuarios'   => $usuarios
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $e->getMessage()
            ], 500);
        }
    }

    function store(UsuarioRequest $request): JsonResponse
    {
        try {
            DB::beginTransaction();
            $usuario = new User;
            $usuario->fill($request->validated());
            $usuario->user_id = auth()->id();
            $usuario->save();
            $usuario->assignRole($request->role);
            DB::commit();

            return response()->json(
                [
                    'status' => HTTPStatus::Success,
                    'msg'   => HTTPStatus::Creacion
                ],
                201
            );
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    function update(UsuarioRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $usuario = User::find($id);
            if ($usuario) {
                $usuario->update($request->validated());

                if ($request->filled('role')) {
                    $usuario->roles()->detach();
                    $usuario->assignRole($request->role);
                }
                DB::commit();
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg'    => HTTPStatus::Actualizado
                ], 201);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    public function updatePassword(UserPassword $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $usuario = User::find($id);
            if ($usuario) {
                $usuario->update($request->validated());
                DB::commit();
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg'    => HTTPStatus::Actualizado
                ], 201);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }

    public function updateStatus(StatusRequest $request, int $id): JsonResponse
    {
        try {
            DB::beginTransaction();
            $usuario = User::find($id);
            if ($usuario) {
                $usuario->update($request->validated());
                DB::commit();
                return response()->json([
                    'status' => HTTPStatus::Success,
                    'msg'    => HTTPStatus::Actualizado
                ], 201);
            } else {
                DB::rollBack();
                return response()->json([
                    'status' => HTTPStatus::Error,
                    'msg'    => HTTPStatus::NotFound
                ], 404);
            }
        } catch (\Throwable $th) {
            DB::rollBack();
            return response()->json([
                'status' => HTTPStatus::Error,
                'msg'    => $th->getMessage()
            ], 500);
        }
    }
}
