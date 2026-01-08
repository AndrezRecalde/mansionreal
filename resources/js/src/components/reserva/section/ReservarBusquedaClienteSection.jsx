import { useEffect } from "react";
import {
    Fieldset,
    Group,
    Paper,
    Text,
    ThemeIcon,
    Tooltip,
} from "@mantine/core";
import {
    useConfiguracionIvaStore,
    useHuespedStore,
    useReservaDepartamentoStore,
} from "../../../hooks";
import {
    ReservarBusquedaClienteForm,
    ReservarDatosClienteForm,
    TextSection,
} from "../../../components";
import { IconCheck, IconX } from "@tabler/icons-react";

export const ReservarBusquedaClienteSection = ({
    reservaForm,
    showDetails,
    setShowDetails,
    disabledInput,
    handleSubmitHuesped,
    labelStyles
}) => {
    const { nacionalidad } = reservaForm.values.huesped;
    const { activarHuesped, fnAsignarHuesped, cargando } = useHuespedStore();
    const { activarTipoReserva } = useReservaDepartamentoStore();
    const { fnCargarConfiguracionIvaActiva, fnAsignarIva } =
        useConfiguracionIvaStore();

    useEffect(() => {
        if (activarHuesped !== null) {
            console.log(activarTipoReserva);
            reservaForm.setValues({
                huesped: {
                    huesped_id: activarHuesped.id,
                    nombres: activarHuesped.nombres,
                    apellidos: activarHuesped.apellidos,
                    dni: activarHuesped.dni,
                    email: activarHuesped.email,
                    telefono: activarHuesped.telefono || "",
                    direccion: activarHuesped.direccion || "",
                    nacionalidad: activarHuesped.nacionalidad || "",
                },
            });
            fnAsignarHuesped(activarHuesped);
            setShowDetails(true);
            return;
        }
        // eslint-disable-next-line
    }, [activarHuesped]);

    // Cuando se presiona Limpiar
    const handleClear = () => {
        reservaForm.setValues({
            huesped: {
                huesped_id: "",
                nombres: "",
                apellidos: "",
                dni: "",
                email: "",
                telefono: "",
                direccion: "",
                nacionalidad: "",
            },
            tipo_reserva: activarTipoReserva,
            departamento_id: "",
            fecha_checkin: "",
            fecha_checkout: "",
            total_noches: 0,
            total_pago: 0,
            total_adultos: 1,
            total_ninos: 0,
            total_mascotas: 0,
        });
        fnAsignarHuesped(null);
        setShowDetails(false);
    };

    useEffect(() => {
        nacionalidad === "ECUATORIANO"
            ? fnCargarConfiguracionIvaActiva()
            : fnAsignarIva(0);

        return () => {
            fnAsignarIva(null);
        };
    }, [nacionalidad]);

    return (
        <Fieldset
            legend={
                <TextSection tt="" fz={16} fw={300}>
                    Datos del Cliente
                </TextSection>
            }
        >
            <>
                {nacionalidad ? (
                    <Tooltip
                        label={
                            nacionalidad === "ECUATORIANO"
                                ? "Cliente con nacionalidad ecuatoriana.  Obligado a pagar la tasa de IVA correspondiente al Ecuador"
                                : `Cliente con nacionalidad ${nacionalidad}. No está obligado a pagar la tasa de IVA`
                        }
                        multiline
                        w={320}
                        withArrow
                        transitionProps={{ transition: "fade", duration: 200 }}
                    >
                        <Paper
                            shadow="xs"
                            p="sm"
                            mb="md"
                            radius="md"
                            withBorder
                            style={{
                                cursor: "help",
                                borderColor:
                                    nacionalidad === "ECUATORIANO"
                                        ? "var(--mantine-color-corporate-blue-3)"
                                        : "var(--mantine-color-gray-3)",
                                backgroundColor:
                                    nacionalidad === "ECUATORIANO"
                                        ? "var(--mantine-color-corporate-blue-0)"
                                        : "var(--mantine-color-gray-0)",
                            }}
                        >
                            <Group gap="sm" wrap="nowrap">
                                <ThemeIcon
                                    size="lg"
                                    radius="md"
                                    variant="light"
                                    color={
                                        nacionalidad === "ECUATORIANO"
                                            ? "corporate-blue"
                                            : "red"
                                    }
                                >
                                    {nacionalidad === "ECUATORIANO" ? (
                                        <IconCheck size={20} stroke={2.5} />
                                    ) : (
                                        <IconX size={20} stroke={2.5} />
                                    )}
                                </ThemeIcon>
                                <div>
                                    <Text
                                        size="xs"
                                        c="dimmed"
                                        fw={500}
                                        tt="uppercase"
                                        lts={0.5}
                                    >
                                        Cliente
                                    </Text>
                                    <Text
                                        size="sm"
                                        fw={600}
                                        c={
                                            nacionalidad === "ECUATORIANO"
                                                ? "corporate-blue"
                                                : "gray.7"
                                        }
                                    >
                                        {nacionalidad === "ECUATORIANO"
                                            ? "IVA Activado"
                                            : "IVA Desactivado"}
                                    </Text>
                                </div>
                            </Group>
                        </Paper>
                    </Tooltip>
                ) : null}
                <ReservarBusquedaClienteForm
                    reservaForm={reservaForm}
                    showDetails={showDetails}
                    disabledInput={disabledInput}
                    cargando={cargando}
                    handleSubmitHuesped={handleSubmitHuesped}
                    handleClear={handleClear}
                    labelStyles={labelStyles}
                />
            </>
            <ReservarDatosClienteForm
                reservaForm={reservaForm}
                showDetails={showDetails}
                disabledInput={disabledInput}
                labelStyles={labelStyles}
            />
        </Fieldset>
    );
};
