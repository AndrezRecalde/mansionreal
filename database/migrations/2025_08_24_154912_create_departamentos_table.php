<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('departamentos', function (Blueprint $table) {
            $table->id();
            $table->string('numero_departamento', 10)->unique();
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('tipo_departamento_id');
            $table->unsignedInteger('capacidad');
            $table->unsignedBigInteger('estado_id')->default(4);
            $table->boolean('activo')->default(true);
            $table->timestamps();

            $table->foreign('tipo_departamento_id')->references('id')->on('tipos_departamentos')->onDelete('cascade');
            $table->foreign('estado_id')->references('id')->on('estados')->onDelete('cascade');

            $table->index('tipo_departamento_id');
            $table->index('estado_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departamentos');
    }
};
