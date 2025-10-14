import { Box, Fieldset, Group, Select, SimpleGrid, Stack } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { DateInput, YearPickerInput } from "@mantine/dates";
import { BtnSubmit, TextSection } from "../../../components";
import { useStorageField, useUsuarioStore } from "../../../hooks";
import { IconSearch } from "@tabler/icons-react";
import classes from "../modules/LabelsInput.module.css";
import dayjs from "dayjs";

export const FiltrarPorGerentes = ({
    titulo = "",
    cargando,
    fnHandleAction,
}) => {
    const { usuarios } = useUsuarioStore();
    const { fnSetStorageFields } = useStorageField();

    const form = useForm({
        initialValues: {
            p_fecha_inicio: "",
            p_fecha_fin: "",
            p_anio: new Date(),
            p_usuario_id: "",
        },
        validate: {
            p_anio: isNotEmpty("Por favor ingresar el año"),
        },
        transformValues: (values) => ({
            p_fecha_inicio: dayjs(values.p_fecha_inicio).isValid()
                ? dayjs(values.p_fecha_inicio).format("YYYY-MM-DD")
                : null,
            p_fecha_fin: dayjs(values.p_fecha_fin).isValid()
                ? dayjs(values.p_fecha_fin).add(1, "day").format("YYYY-MM-DD")
                : null,
            p_anio: values.p_anio.getFullYear(),
            p_usuario_id: Number(values.p_usuario_id) || null,
        }),
    });

    const { p_fecha_inicio } = form.values;

    const handleSubmit = (e) => {
        e.preventDefault();
        fnHandleAction(form.getTransformedValues());
        console.log(form.getTransformedValues());
        fnSetStorageFields(form.getTransformedValues());
        //form.reset();
    };

    return (
        <Fieldset
            mt={20}
            mb={20}
            legend={
                <TextSection tt="" fw={500} fz={16}>
                    {titulo}
                </TextSection>
            }
        >
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
                    <Group justify="flex-end">
                        <YearPickerInput
                            required
                            placeholder="Seleccione el año"
                            {...form.getInputProps("p_anio")}
                        />
                    </Group>
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }}>
                        <DateInput
                            withAsterisk
                            valueFormat="YYYY-MM-DD"
                            label="Fecha inicio"
                            placeholder="Seleccione fecha de inicio"
                            classNames={classes}
                            {...form.getInputProps("p_fecha_inicio")}
                        />
                        <DateInput
                            minDate={new Date(p_fecha_inicio)}
                            withAsterisk
                            valueFormat="YYYY-MM-DD"
                            label="Fecha final"
                            placeholder="Seleccione fecha de fin"
                            classNames={classes}
                            {...form.getInputProps("p_fecha_fin")}
                        />
                    </SimpleGrid>
                    <Select
                        searchable
                        clearable
                        label="Seleccione el gerente"
                        placeholder="Seleccione el gerente"
                        data={
                            usuarios.map((usuario) => ({
                                value: String(usuario.id),
                                label: `${usuario.nombres} ${usuario.apellidos}`,
                            })) || []
                        }
                        classNames={classes}
                        {...form.getInputProps("p_usuario_id")}
                    />

                    <BtnSubmit
                        mt={0}
                        mb={0}
                        IconSection={IconSearch}
                        loading={cargando}
                    >
                        Buscar
                    </BtnSubmit>
                </Stack>
            </Box>
        </Fieldset>
    );
};
