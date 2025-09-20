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
        Schema::create('tipos_departamentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_tipo', 100);
            $table->text('descripcion')->nullable();
            $table->unsignedBigInteger('inventario_id');
            $table->timestamps();

            $table->foreign('inventario_id')->references('id')->on('inventarios')->onDelete('cascade');

            $table->index('inventario_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tipos_departamentos');
    }
};
