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
        Schema::create('imagenes_departamentos', function (Blueprint $table) {
            $table->id();
            $table->string('imagen_url');
            $table->unsignedBigInteger('departamento_id');
            $table->timestamps();

            $table->foreign('departamento_id')->references('id')->on('departamentos')->onDelete('cascade');

            $table->index('departamento_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('imagenes_departamentos');
    }
};
