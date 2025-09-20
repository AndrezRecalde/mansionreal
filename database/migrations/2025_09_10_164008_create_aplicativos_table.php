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
        Schema::create('aplicativos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_aplicativo', 100);
            $table->string('descripcion_aplicativo', 255);
            $table->string('direccion_aplicativo', 255);
            $table->string('telefono_aplicativo', 20);
            $table->string('logo_aplicativo', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('aplicativos');
    }
};
