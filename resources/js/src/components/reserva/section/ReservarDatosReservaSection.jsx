import { useEffect } from "react";
import {
    ActionIcon,
    Box,
    Card,
    Fieldset,
    Group,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { BtnSubmit, TextSection } from "../../../components";
import {
    useConfiguracionIvaStore,
    useDepartamentoStore,
    useReservaDepartamentoStore,
} from "../../../hooks";
import dayjs from "dayjs";

export const ReservarDatosReservaSection = ({
    classes,
    reservaForm,
    handleSubmitReserva,
    labelStyles,
}) => {
    const {
        departamentos_disponibles,
        activarDepartamento,
        fnAsignarDepartamento,
    } = useDepartamentoStore();
    const { activarTipoReserva } = useReservaDepartamentoStore();
    const { activarIva } = useConfiguracionIvaStore();

    const { fecha_checkin, departamento_id } = reservaForm.values;
    // Handlers para cada contador usando el form
    const changeAdults = (next) => {
        const value = Math.max(1, Math.min(300, next));
        reservaForm.setFieldValue("total_adultos", value);
    };

    const changeChildren = (next) => {
        const value = Math.max(0, Math.min(300, next));
        reservaForm.setFieldValue("total_ninos", value);
    };

    const changePets = (next) => {
        const value = Math.max(0, Math.min(20, next));
        reservaForm.setFieldValue("total_mascotas", value);
    };

    // Calcular total_noches al cambiar fecha_checkin o fecha_checkout
    const calcularNoches = (checkin, checkout) => {
        if (checkin && checkout) {
            // Normalizar a solo fecha (inicio del día) para evitar problemas con horas
            const fechaCheckin = dayjs(checkin).startOf("day");
            const fechaCheckout = dayjs(checkout).startOf("day");

            // Calcular diferencia en días
            const diffDays = fechaCheckout.diff(fechaCheckin, "day");

            // Solo establecer si es positivo (checkout debe ser después de checkin)
            reservaForm.setFieldValue(
                "total_noches",
                diffDays > 0 ? diffDays : 0,
            );
        } else {
            reservaForm.setFieldValue("total_noches", 0);
        }
    };

    // useEffect para escuchar cambios en fecha_checkin y fecha_checkout
    useEffect(() => {
        if (activarTipoReserva === "HOSPEDAJE") {
            calcularNoches(
                reservaForm.values.fecha_checkin,
                reservaForm.values.fecha_checkout,
            );
        }
    }, [
        reservaForm.values.fecha_checkin,
        reservaForm.values.fecha_checkout,
        activarTipoReserva,
    ]);

    // Calcular total_pago al cambiar total_noches
    useEffect(() => {
        if (activarTipoReserva === "HOSPEDAJE") {
            const subtotal =
                reservaForm.values.total_noches *
                activarDepartamento?.precio_noche;
            const iva = subtotal * (Number(activarIva) / 100);
            const totalPago = subtotal + iva;
            reservaForm.setFieldValue("total_pago", totalPago);
        }
    }, [
        reservaForm.values.total_noches,
        activarTipoReserva,
        activarDepartamento?.precio_noche,
        activarIva,
        departamento_id,
    ]);

    return (
        <Fieldset
            legend={
                <TextSection tt="" fz={16} fw={300}>
                    Datos de la Reserva
                </TextSection>
            }
        >
            <Box
                component="form"
                onSubmit={reservaForm.onSubmit((_, e) =>
                    handleSubmitReserva(e),
                )}
            >
                <Stack>
                    <SimpleGrid cols={{ base: 1, xs: 1, sm: 1, md: 2, lg: 2 }}>
                        <DateTimePicker
                            withAsterisk
                            clearable
                            valueFormat="YYYY-MM-DD HH:mm"
                            label="Desde"
                            placeholder="Seleccione fecha de entrada"
                            key={reservaForm.key("fecha_checkin")}
                            {...reservaForm.getInputProps("fecha_checkin")}
                            classNames={labelStyles}
                        />
                        <DateTimePicker
                            withAsterisk
                            clearable
                            valueFormat="YYYY-MM-DD HH:mm"
                            label="Hasta"
                            placeholder="Seleccione fecha de salida"
                            minDate={
                                fecha_checkin
                                    ? dayjs(fecha_checkin)
                                          .startOf("day")
                                          .toDate()
                                    : undefined
                            }
                            key={reservaForm.key("fecha_checkout")}
                            {...reservaForm.getInputProps("fecha_checkout")}
                            classNames={labelStyles}
                        />
                    </SimpleGrid>

                    {activarTipoReserva === "HOSPEDAJE" ? (
                        <>
                            <Select
                                label="Departamento"
                                placeholder="Seleccione departamento"
                                nothingFoundMessage="No se encontraron departamentos"
                                data={departamentos_disponibles.map(
                                    (departamento) => ({
                                        value: departamento.id.toString(),
                                        label: `${departamento.numero_departamento} ${departamento.nombre_tipo} - $${departamento.precio_noche} por noche`,
                                    }),
                                )}
                                key={reservaForm.key("departamento_id")}
                                onChange={(value) => {
                                    // Busca usando el nuevo valor (value) en lugar de reservaForm.values.departamento_id
                                    const departamentoSeleccionado =
                                        departamentos_disponibles.find(
                                            (dep) =>
                                                dep.id.toString() === value,
                                        );

                                    // Primero actualiza el formulario
                                    reservaForm.setFieldValue(
                                        "departamento_id",
                                        value,
                                    );

                                    // Luego asigna el departamento
                                    if (departamentoSeleccionado) {
                                        fnAsignarDepartamento(
                                            departamentoSeleccionado,
                                        );
                                    }
                                }}
                                value={reservaForm.values.departamento_id || ""}
                                error={reservaForm.errors.departamento_id}
                                required={activarTipoReserva === "HOSPEDAJE"}
                                classNames={labelStyles}
                            />
                            <SimpleGrid
                                cols={{ base: 1, xs: 1, sm: 1, md: 2, lg: 2 }}
                            >
                                <NumberInput
                                    disabled
                                    label="Total de noches"
                                    placeholder="Se calcula el total de noches"
                                    key={reservaForm.key("total_noches")}
                                    {...reservaForm.getInputProps(
                                        "total_noches",
                                    )}
                                    classNames={labelStyles}
                                />
                                <NumberInput
                                    disabled
                                    label="Total a pagar por noche"
                                    placeholder="Se calcula el total a pagar"
                                    key={reservaForm.key("total_pago")}
                                    {...reservaForm.getInputProps("total_pago")}
                                    classNames={labelStyles}
                                />
                            </SimpleGrid>
                        </>
                    ) : null}

                    <SimpleGrid
                        cols={{ base: 1, sm: 2, lg: 3 }}
                        spacing="md"
                        breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                        mt={20}
                    >
                        {/* Adultos */}
                        <Card className={classes.card} radius="md">
                            <div className={classes.info}>
                                <TextSection fz={15} fw={700} tt="">
                                    Adultos
                                </TextSection>
                                <TextSection tt="" fz={12} color="dimmed">
                                    Mayores de 12 años
                                </TextSection>
                            </div>
                            <Group spacing={8} className={classes.controls}>
                                <ActionIcon
                                    onClick={() =>
                                        changeAdults(
                                            reservaForm.values.total_adultos -
                                                1,
                                        )
                                    }
                                    className={classes.circleBtn}
                                    variant="outline"
                                >
                                    <IconMinus size="1rem" />
                                </ActionIcon>
                                <NumberInput
                                    hideControls
                                    variant="unstyled"
                                    key={reservaForm.key("total_adultos")}
                                    {...reservaForm.getInputProps(
                                        "total_adultos",
                                    )}
                                    min={0}
                                    max={300}
                                    clampBehavior="strict"
                                    styles={{
                                        input: {
                                            textAlign: "center",
                                            fontWeight: 600,
                                            fontSize: "1.1rem",
                                            width: "50px",
                                        },
                                    }}
                                />
                                <ActionIcon
                                    onClick={() =>
                                        changeAdults(
                                            reservaForm.values.total_adultos +
                                                1,
                                        )
                                    }
                                    className={classes.circleBtn}
                                    variant="filled"
                                >
                                    <IconPlus size="1rem" />
                                </ActionIcon>
                            </Group>
                        </Card>

                        {/* Niños */}
                        <Card className={classes.card} radius="md">
                            <div className={classes.info}>
                                <TextSection fz={15} fw={700} tt="">
                                    Niños
                                </TextSection>
                                <TextSection tt="" fz={12} color="dimmed">
                                    De 2 a 12 años
                                </TextSection>
                            </div>
                            <Group spacing={8} className={classes.controls}>
                                <ActionIcon
                                    onClick={() =>
                                        changeChildren(
                                            reservaForm.values.total_ninos - 1,
                                        )
                                    }
                                    className={classes.circleBtn}
                                    variant="outline"
                                >
                                    <IconMinus size="1rem" />
                                </ActionIcon>
                                <NumberInput
                                    hideControls
                                    variant="unstyled"
                                    key={reservaForm.key("total_ninos")}
                                    {...reservaForm.getInputProps(
                                        "total_ninos",
                                    )}
                                    min={0}
                                    max={300}
                                    clampBehavior="strict"
                                    styles={{
                                        input: {
                                            textAlign: "center",
                                            fontWeight: 600,
                                            fontSize: "1.1rem",
                                            width: "50px",
                                        },
                                    }}
                                />
                                <ActionIcon
                                    onClick={() =>
                                        changeChildren(
                                            reservaForm.values.total_ninos + 1,
                                        )
                                    }
                                    className={classes.circleBtn}
                                    variant="filled"
                                >
                                    <IconPlus size="1rem" />
                                </ActionIcon>
                            </Group>
                        </Card>

                        {/* Mascotas */}
                        <Card className={classes.card} radius="md">
                            <div className={classes.info}>
                                <TextSection fz={15} fw={700} tt="">
                                    Mascotas
                                </TextSection>
                                <TextSection tt="" fz={12} color="dimmed">
                                    Apto según alojamiento
                                </TextSection>
                            </div>
                            <Group spacing={8} className={classes.controls}>
                                <ActionIcon
                                    onClick={() =>
                                        changePets(
                                            reservaForm.values.total_mascotas -
                                                1,
                                        )
                                    }
                                    className={classes.circleBtn}
                                    variant="outline"
                                >
                                    <IconMinus size="1rem" />
                                </ActionIcon>
                                <NumberInput
                                    hideControls
                                    variant="unstyled"
                                    key={reservaForm.key("total_mascotas")}
                                    {...reservaForm.getInputProps(
                                        "total_mascotas",
                                    )}
                                    min={0}
                                    max={300}
                                    clampBehavior="strict"
                                    styles={{
                                        input: {
                                            textAlign: "center",
                                            fontWeight: 600,
                                            fontSize: "1.1rem",
                                            width: "50px",
                                        },
                                    }}
                                />
                                <ActionIcon
                                    onClick={() =>
                                        changePets(
                                            reservaForm.values.total_mascotas +
                                                1,
                                        )
                                    }
                                    className={classes.circleBtn}
                                    variant="filled"
                                >
                                    <IconPlus size="1rem" />
                                </ActionIcon>
                            </Group>
                        </Card>
                    </SimpleGrid>

                    <BtnSubmit>Reservar ahora</BtnSubmit>
                </Stack>
            </Box>
        </Fieldset>
    );
};
