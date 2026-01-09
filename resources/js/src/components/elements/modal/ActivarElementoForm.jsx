import { useEffect } from "react";
import { Box, Flex, Select, Stack } from "@mantine/core";
import { BtnSubmit, TextSection } from "../../../components";
import classes from "../../../components/elements/modules/LabelsInput.module.css"

export const ActivarElementoForm = ({
    form,
    elementoActivado,
    fnAsignarElementoActivado,
    IconSection,
    fnAbrirModal,
    fnHandleAction
}) => {
    useEffect(() => {
        if (elementoActivado && typeof elementoActivado === "object") {
            const [firstKey, firstValue] =
                Object.entries(elementoActivado)[1] ?? [];

            if (firstKey) {
                form.setValues({
                    id: elementoActivado.id,
                    nombre: firstValue,
                    activo: elementoActivado.activo?.toString() ?? "",
                });
            }
        }
    }, [elementoActivado]);

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(form.getTransformedValues());
        fnHandleAction(form.getTransformedValues());
        fnAsignarElementoActivado(null);
        fnAbrirModal(false);
        form.reset();
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
                <Flex
                    mih={30}
                    gap="md"
                    justify="center"
                    align="center"
                    direction="column"
                    wrap="wrap"
                >
                    <IconSection size={50} stroke={1.2} />
                    <TextSection tt="" fz={16}>
                        {`¿Está seguro que desea activar el elemento ${form.values.nombre}?`}
                    </TextSection>
                </Flex>
                <Select
                    required
                    data={[
                        { label: "Si", value: "1" },
                        { label: "No", value: "0" },
                    ]}
                    placeholder="¿Desea activar el elemento?"
                    label="Activar"
                    withAsterisk
                    {...form.getInputProps("activo")}
                    classNames={classes}
                />
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
