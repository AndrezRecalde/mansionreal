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

export const LimpiezaForm = ({ form }) => {
    const { fnAgregarLimpieza, activarLimpieza } = useLimpiezaStore();
    const { fnAbrirModalLimpieza } = useUiLimpieza();
    const { activarDepartamento, fnCambiarEstadoDepartamento } =
        useDepartamentoStore();
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (activarLimpieza === null) {
            console.log(form.getTransformedValues());
            fnAgregarLimpieza(form.getTransformedValues());
            fnCambiarEstadoDepartamento({
                id: activarDepartamento.id,
                nombre_estado: "LIMPIEZA",
            });
            Swal.fire(
                "¡Hecho!",
                `El departamento ${activarDepartamento.numero_departamento} está en limpieza.`,
                "success"
            );
        }
        fnAgregarLimpieza(form.getValues(), storageFields);
        form.reset();
        fnAbrirModalLimpieza(false);
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
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
