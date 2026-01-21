import { useEffect } from "react";
import { Box, NumberInput, Select, Stack, Textarea } from "@mantine/core";
import { BtnSubmit } from "../../../components";
import { useGastoStore, useTiposDanoStore, useUiGasto } from "../../../hooks";

export const GastoForm = ({ form }) => {
    const { activarGasto, fnAgregarGasto } = useGastoStore();
    const { fnAbrirModalGasto } = useUiGasto();
    const { tiposDano } = useTiposDanoStore();

    useEffect(() => {
        if (activarGasto !== null) {
            form.setValues({
                id: activarGasto.id || "",
                descripcion: activarGasto.descripcion || "",
                monto: activarGasto.monto || "",
                tipo_dano_id: activarGasto.tipo_dano_id
                    ? activarGasto.tipo_dano_id.toString()
                    : "",
            });
        }
    }, [activarGasto]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(form.getTransformedValues());
        fnAgregarGasto(form.getTransformedValues());
        form.reset();
        fnAbrirModalGasto(false);
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
                <Textarea
                    resize="vertical"
                    label="Descripción del gasto"
                    placeholder="Ingrese una descripción detallada del gasto extra"
                    minRows={3}
                    {...form.getInputProps("descripcion")}
                />
                <NumberInput
                    withAsterisk
                    label="Monto del gasto"
                    placeholder="Ingrese el monto del gasto"
                    min={0}
                    step={1}
                    {...form.getInputProps("monto")}
                />
                <Select
                    withAsterisk
                    searchable
                    label="Tipo de daño"
                    placeholder="Seleccione el tipo de daño"
                    data={tiposDano.map((tipo) => ({
                        value: tipo.id.toString(),
                        label: tipo.nombre_tipo_dano,
                    }))}
                    nothingFoundMessage="No se encontraron tipos de daño"
                    {...form.getInputProps("tipo_dano_id")}
                />
                <BtnSubmit>Registrar Pago</BtnSubmit>
            </Stack>
        </Box>
    );
};
