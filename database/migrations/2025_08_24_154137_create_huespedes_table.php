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
        Schema::create('huespedes', function (Blueprint $table) {
            $table->id();
            $table->string('apellidos', 100);
            $table->string('nombres', 150);
            $table->string('dni', 15)->unique();
            $table->string('telefono', 15)->nullable();
            $table->string('email')->nullable();
            $table->text('direccion')->nullable();
            $table->unsignedBigInteger('provincia_id')->nullable();
            $table->timestamps();

            $table->foreign('provincia_id')->references('id')->on('provincias')->onDelete('cascade');

            $table->index('provincia_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('huespedes');
    }
};
