import { useEffect } from "react";
import {
    ActionIcon,
    Box,
    Card,
    Fieldset,
    Group,
    NumberInput,
    SimpleGrid,
    Text,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconMinus, IconPlus } from "@tabler/icons-react";
import { BtnSubmit, TextSection } from "../..";
import { useDepartamentoStore } from "../../../hooks";

export const ReservarDatosReservaSection = ({
    classes,
    reservaForm,
    handleSubmitReserva,
}) => {
    const { activarDepartamento } = useDepartamentoStore();
    // Handlers para cada contador usando el form
    const changeAdults = (next) => {
        const value = Math.max(1, Math.min(10, next));
        reservaForm.setFieldValue("total_adultos", value);
    };

    const changeChildren = (next) => {
        const value = Math.max(0, Math.min(10, next));
        reservaForm.setFieldValue("total_ninos", value);
    };

    const changePets = (next) => {
        const value = Math.max(0, Math.min(5, next));
        reservaForm.setFieldValue("total_mascotas", value);
    };

    //Calcular total_noches al cambiar fecha_checkin o fecha_checkout
    const calcularNoches = (checkin, checkout) => {
        if (checkin && checkout) {
            const fechaCheckin = new Date(checkin);
            const fechaCheckout = new Date(checkout);
            const diffTime = Math.abs(fechaCheckout - fechaCheckin);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            reservaForm.setFieldValue("total_noches", diffDays);
        } else {
            reservaForm.setFieldValue("total_noches", 0);
        }
    };

    // useEffect para escuchar cambios en fecha_checkin y fecha_checkout
    useEffect(() => {
        calcularNoches(
            reservaForm.values.fecha_checkin,
            reservaForm.values.fecha_checkout
        );
    }, [reservaForm.values.fecha_checkin, reservaForm.values.fecha_checkout]);

    // Calcular total_pago al cambiar total_noches
    useEffect(() => {
        const totalPago =
            reservaForm.values.total_noches * activarDepartamento.precio_noche;
        reservaForm.setFieldValue("total_pago", totalPago);
    }, [reservaForm.values.total_noches]);

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
                    handleSubmitReserva(e)
                )}
            >
                <SimpleGrid cols={{ base: 1, xs: 1, sm: 1, md: 2, lg: 2 }}>
                    <DateInput
                        clearable
                        valueFormat="YYYY-MM-DD"
                        label="Desde"
                        placeholder="Seleccione fecha de entrada"
                        key={reservaForm.key("fecha_checkin")}
                        {...reservaForm.getInputProps("fecha_checkin")}
                    />
                    <DateInput
                        clearable
                        valueFormat="YYYY-MM-DD"
                        label="Hasta"
                        placeholder="Seleccione fecha de salida"
                        key={reservaForm.key("fecha_checkout")}
                        {...reservaForm.getInputProps("fecha_checkout")}
                    />
                    <NumberInput
                        disabled
                        label="Total de noches"
                        placeholder="Se calcula el total de noches"
                        key={reservaForm.key("total_noches")}
                        {...reservaForm.getInputProps("total_noches")}
                    />
                    <NumberInput
                        disabled
                        label="Total a pagar por noche(s/.)"
                        placeholder="Se calcula el total a pagar"
                        key={reservaForm.key("total_pago")}
                        {...reservaForm.getInputProps("total_pago")}
                    />
                </SimpleGrid>
                <SimpleGrid
                    cols={3}
                    spacing="md"
                    breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                    mt={20}
                >
                    {/* Adultos */}
                    <Card className={classes.card} radius="md">
                        <div className={classes.info}>
                            <Text className={classes.label}>Adultos</Text>
                            <Text className={classes.sub}>
                                Mayores de 12 años
                            </Text>
                        </div>
                        <Group spacing={8} className={classes.controls}>
                            <ActionIcon
                                onClick={() =>
                                    changeAdults(
                                        reservaForm.values.total_adultos - 1
                                    )
                                }
                                className={classes.circleBtn}
                                variant="outline"
                            >
                                <IconMinus size="1rem" />
                            </ActionIcon>
                            <div className={classes.counter}>
                                {reservaForm.values.total_adultos}
                            </div>
                            <ActionIcon
                                onClick={() =>
                                    changeAdults(
                                        reservaForm.values.total_adultos + 1
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
                            <Text className={classes.label}>Niños</Text>
                            <Text className={classes.sub}>De 2 a 12 años</Text>
                        </div>
                        <Group spacing={8} className={classes.controls}>
                            <ActionIcon
                                onClick={() =>
                                    changeChildren(
                                        reservaForm.values.total_ninos - 1
                                    )
                                }
                                className={classes.circleBtn}
                                variant="outline"
                            >
                                <IconMinus size="1rem" />
                            </ActionIcon>
                            <div className={classes.counter}>
                                {reservaForm.values.total_ninos}
                            </div>
                            <ActionIcon
                                onClick={() =>
                                    changeChildren(
                                        reservaForm.values.total_ninos + 1
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
                            <Text className={classes.label}>Mascotas</Text>
                            <Text className={classes.sub}>
                                Apto según alojamiento
                            </Text>
                        </div>
                        <Group spacing={8} className={classes.controls}>
                            <ActionIcon
                                onClick={() =>
                                    changePets(
                                        reservaForm.values.total_mascotas - 1
                                    )
                                }
                                className={classes.circleBtn}
                                variant="outline"
                            >
                                <IconMinus size="1rem" />
                            </ActionIcon>
                            <div className={classes.counter}>
                                {reservaForm.values.total_mascotas}
                            </div>
                            <ActionIcon
                                onClick={() =>
                                    changePets(
                                        reservaForm.values.total_mascotas + 1
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
            </Box>
        </Fieldset>
    );
};
