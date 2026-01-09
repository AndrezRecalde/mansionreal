import { useEffect } from "react";
import { Box, Stack, TextInput } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import {
    useDepartamentoStore,
    useLimpiezaStore,
    useStorageField,
    useUiLimpieza,
} from "../../../hooks";
import Swal from "sweetalert2";
import { Estados } from "../../../helpers/getPrefix";

export const LimpiezaForm = ({ form }) => {
    const { cargando, fnAgregarLimpieza, activarLimpieza } = useLimpiezaStore();
    const { fnAbrirModalLimpieza } = useUiLimpieza();
    const {
        activarDepartamento,
        fnCambiarEstadoDepartamento,
        fnAsignarDepartamento,
    } = useDepartamentoStore();
    const { storageFields } = useStorageField();

    useEffect(() => {
        if (activarLimpieza !== null) {
            form.setValues({
                id: activarLimpieza.id,
                personal_limpieza: activarLimpieza.personal_limpieza,
            });
        }

        return () => {
            form.reset();
        };
    }, [activarLimpieza]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const estado = activarDepartamento?.estado?.nombre_estado;
        const estadoUpper = estado ? estado.toString().toUpperCase() : null;
        const noPermitir = [Estados.OCUPADO, Estados.RESERVADO].map((s) =>
            s.toString().toUpperCase()
        );

        if (activarLimpieza === null) {
            //console.log(form.getTransformedValues());
            await fnAgregarLimpieza(form.getTransformedValues());

            if (estadoUpper && !noPermitir.includes(estadoUpper)) {
                //console.log("entro");
                await fnCambiarEstadoDepartamento({
                    id: activarDepartamento.id,
                    nombre_estado: "LIMPIEZA",
                });
            }
            Swal.fire(
                "¡Hecho!",
                `El departamento ${activarDepartamento.numero_departamento} está en limpieza.`,
                "success"
            );
        } else {
            await fnAgregarLimpieza(form.getValues(), storageFields);
        }
        form.reset();
        fnAbrirModalLimpieza(false);
        fnAsignarDepartamento(null);
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack
                bg="var(--mantine-color-body)"
                align="stretch"
                justify="center"
                gap="md"
            >
                <TextInput
                    label="Ingrese los nombres del personal de limpieza"
                    description="Ingrese los nombres de cada uno de los personal de limpieza asignado"
                    placeholder="Nombres del personal de limpieza"
                    {...form.getInputProps("personal_limpieza")}
                />
                <BtnSubmit loading={cargando}>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
