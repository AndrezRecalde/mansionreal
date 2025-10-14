import { useEffect } from "react";
import { Box, Checkbox, Group, Stack } from "@mantine/core";
import { BtnSubmit, TextSection } from "../../../components";
import {
    useDepartamentoStore,
    useServicioStore,
    useUiDepartamento,
} from "../../../hooks";

export const DepartamentoServiciosForm = ({ form }) => {
    const { servicios } = useServicioStore();
    const { activarDepartamento, fnAgregarServiciosDepartamento, fnAsignarDepartamento } =
        useDepartamentoStore();
    const { fnDrawerAbrirServiciosDepartamento } = useUiDepartamento();

    useEffect(() => {
        if (activarDepartamento !== null) {
            form.setValues({
                departamento_id: activarDepartamento.id,
                servicios: activarDepartamento.servicios.map((s) =>
                    String(s.id)
                ),
            });
        }
    }, [activarDepartamento]);

    const handleSubmit = (e) => {
        e.preventDefault();
        fnAgregarServiciosDepartamento(form.getValues());
        fnDrawerAbrirServiciosDepartamento(false);
        fnAsignarDepartamento(null);
        console.log(form.getValues());
        form.reset();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Stack gap="md">
                {Object.entries(servicios).map(([nombre, tipos]) => (
                    <Group key={nombre} mb={15}>
                        <TextSection tt="" fw={700} fz={16}>
                            {nombre}
                        </TextSection>
                        <Checkbox.Group
                            value={form.values.servicios}
                            onChange={(value) =>
                                form.setFieldValue("servicios", value)
                            }
                        >
                            <Group>
                                {tipos.map((tipo) => (
                                    <Checkbox
                                        key={tipo.id}
                                        value={String(tipo.id)}
                                        label={tipo.tipo_servicio}
                                    />
                                ))}
                            </Group>
                        </Checkbox.Group>
                    </Group>
                ))}
                <BtnSubmit>Guardar</BtnSubmit>
            </Stack>
        </Box>
    );
};
