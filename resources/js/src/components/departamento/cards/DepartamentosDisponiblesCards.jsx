import { useEffect, useCallback, useMemo } from "react";
import {
    Badge,
    Box,
    Card,
    Center,
    Group,
    Image,
    SimpleGrid,
    Text,
    Tooltip,
    UnstyledButton,
    useMantineTheme,
} from "@mantine/core";
import { BtnSection } from "../../../components";
import {
    useDepartamentoStore,
    useReservaDepartamentoStore,
    useUiConsumo,
    useUiLimpieza,
} from "../../../hooks";
import {
    IconBuilding,
    IconCalendar,
    IconRotate2,
    IconSpray,
    IconTool,
    IconUser,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import classes from "./modules/DepartamentoDisponibiles.module.css";
import Swal from "sweetalert2";
import { formatFechaModal, getEstadoColor } from "../../../helpers/fnHelper";
import { Roles } from "../../../helpers/getPrefix";

dayjs.locale("es");

// Constantes
const ESTADOS = {
    OCUPADO: "OCUPADO",
    RESERVADO: "RESERVADO",
    DISPONIBLE: "DISPONIBLE",
    LIMPIEZA: "LIMPIEZA",
    MANTENIMIENTO: "MANTENIMIENTO",
};

const ESTADOS_GESTION_CONSUMOS = [ESTADOS.OCUPADO, ESTADOS.RESERVADO];

// Subcomponente para la información del departamento
const DepartamentoInfo = ({ departamento }) => (
    <>
        <Group justify="center">
            <Badge radius="sm" variant="light">
                {departamento.tipo_departamento} -{" "}
                {departamento.numero_departamento}
            </Badge>
            <Center>
                <IconBuilding size={16} className={classes.icon} stroke={1.5} />
                <Text size="xs">
                    capacidad: {departamento.capacidad} personas
                </Text>
            </Center>
        </Group>
    </>
);

// Subcomponente para la sección de reserva
const ReservaSection = ({
    reserva,
    onClickCodigoReserva,
    puedeGestionarConsumos,
}) => (
    <Card.Section className={classes.section} mt="sm">
        <Center>
            <IconUser size={16} className={classes.icon} stroke={1.5} />
            <Text size="sm">Huesped: {reserva?.huesped || "Sin Huesped"}</Text>
        </Center>
        <Center>
            <IconCalendar size={16} className={classes.icon} stroke={1.5} />
            <Text size="sm">
                {reserva
                    ? `${formatFechaModal(
                          reserva.fecha_checkin,
                      )} - ${formatFechaModal(reserva.fecha_checkout)}`
                    : "Sin Reserva"}
            </Text>
        </Center>
        <Center mt={10}>
            {reserva?.codigo_reserva && puedeGestionarConsumos ? (
                <Tooltip
                    label="Click para ver consumos del departamento"
                    position="bottom"
                    withArrow
                >
                    <UnstyledButton
                        onClick={onClickCodigoReserva}
                        style={{
                            transition:
                                "transform 0.2s ease, opacity 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.opacity = "0.8";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.opacity = "1";
                        }}
                    >
                        <Badge
                            size="lg"
                            radius="sm"
                            variant="outline"
                            style={{ cursor: "pointer" }}
                        >
                            # {reserva.codigo_reserva}
                        </Badge>
                    </UnstyledButton>
                </Tooltip>
            ) : (
                <Badge size="lg" radius="sm" variant="outline">
                    {reserva?.codigo_reserva || "Sin Código"}
                </Badge>
            )}
        </Center>
    </Card.Section>
);

// Subcomponente para el badge de estado
const EstadoBadge = ({ estado, theme }) => {
    const estadoColor = getEstadoColor(theme, estado?.color);

    return (
        <Card.Section withBorder className={classes.section} bg={estadoColor}>
            <Badge
                variant="filled"
                color={estado?.color}
                size="lg"
                radius="lg"
                fullWidth
                style={{ backgroundColor: "transparent" }}
            >
                {estado?.nombre_estado || "SIN ESTADO"}
            </Badge>
        </Card.Section>
    );
};

// Subcomponente para los botones de acción en el footer
const AccionesFooter = ({
    departamento,
    onHabilitar,
    onMantenimiento,
    onLimpiar,
}) => {
    const estaOcupadoOReservado = ESTADOS_GESTION_CONSUMOS.includes(
        departamento.estado?.nombre_estado,
    );

    const esLimpiezaOMantenimiento = [
        ESTADOS.LIMPIEZA,
        ESTADOS.MANTENIMIENTO,
    ].includes(departamento.estado?.nombre_estado);

    if (esLimpiezaOMantenimiento) {
        return (
            <Tooltip label="Departamento Disponible">
                <Box>
                    <BtnSection
                        fullWidth
                        handleAction={onHabilitar}
                        IconSection={IconRotate2}
                    >
                        Habilitar Departamento
                    </BtnSection>
                </Box>
            </Tooltip>
        );
    }

    return (
        <Group gap={15}>
            <Tooltip label="Mantenimiento Departamento">
                <Box>
                    <BtnSection
                        disabled={estaOcupadoOReservado}
                        handleAction={onMantenimiento}
                        IconSection={IconTool}
                    >
                        Mantenimiento
                    </BtnSection>
                </Box>
            </Tooltip>
            <Tooltip label="Limpiar Departamento">
                <Box>
                    <BtnSection
                        disabled={esLimpiezaOMantenimiento}
                        handleAction={onLimpiar}
                        IconSection={IconSpray}
                    >
                        Limpiar
                    </BtnSection>
                </Box>
            </Tooltip>
        </Group>
    );
};

// Componente de tarjeta individual
const DepartamentoCard = ({
    departamento,
    usuario,
    onAbrirConsumos,
    onHabilitar,
    onMantenimiento,
    onLimpiar,
    theme,
}) => {
    const imageSrc = useMemo(() => {
        return departamento.imagenes?.[0]
            ? `/storage/${departamento.imagenes[0]}`
            : "/images/default-departamento.jpg";
    }, [departamento.imagenes]);

    // Verificar si se pueden gestionar consumos
    const puedeGestionarConsumos = ESTADOS_GESTION_CONSUMOS.includes(
        departamento.estado?.nombre_estado,
    );

    const handleClickCodigoReserva = useCallback(() => {
        onAbrirConsumos(departamento);
    }, [departamento, onAbrirConsumos]);

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Card.Section
                className={classes.imageSection}
                onDoubleClick={() =>
                    puedeGestionarConsumos && onAbrirConsumos(departamento)
                }
                style={{
                    cursor: puedeGestionarConsumos ? "pointer" : "default",
                }}
            >
                <Image
                    src={imageSrc}
                    alt={`departamento-${departamento.numero_departamento}`}
                    fallbackSrc="https://placehold.co/600x400? text=Placeholder"
                    fit="cover"
                    w="100%"
                    h={{ base: 90, sm: 90, md: 120 }}
                />

                <DepartamentoInfo departamento={departamento} />
            </Card.Section>

            <ReservaSection
                reserva={departamento.reserva}
                onClickCodigoReserva={handleClickCodigoReserva}
                puedeGestionarConsumos={puedeGestionarConsumos}
            />
            <EstadoBadge estado={departamento.estado} theme={theme} />

            {usuario &&
            (usuario.role === Roles.ADMINISTRADOR ||
                usuario.role === Roles.GERENTE) ? (
                <Group justify="center">
                    <Card.Section className={classes.section} mt="sm">
                        <AccionesFooter
                            departamento={departamento}
                            onHabilitar={() => onHabilitar(departamento)}
                            onMantenimiento={() =>
                                onMantenimiento(departamento)
                            }
                            onLimpiar={() => onLimpiar(departamento)}
                        />
                    </Card.Section>
                </Group>
            ) : null}
        </Card>
    );
};

// Componente principal
export const DepartamentosDisponiblesCards = ({ usuario }) => {
    const {
        departamentos,
        fnAsignarDepartamento,
        fnCambiarEstadoDepartamento,
    } = useDepartamentoStore();
    const { mensaje, errores } = useReservaDepartamentoStore();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const { fnAbrirModalLimpieza } = useUiLimpieza();
    const theme = useMantineTheme();

    // Efectos para mostrar mensajes
    useEffect(() => {
        if (mensaje !== undefined) {
            Swal.fire({
                icon: mensaje.status,
                text: mensaje.msg,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }, [mensaje]);

    useEffect(() => {
        if (errores) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: errores,
                showConfirmButton: false,
                timer: 1500,
            });
        }
    }, [errores]);

    // Manejador para abrir consumos (solo si está OCUPADO o RESERVADO)
    const handleAbrirConsumos = useCallback(
        (departamento) => {
            const puedeGestionarConsumos = ESTADOS_GESTION_CONSUMOS.includes(
                departamento.estado?.nombre_estado,
            );

            if (!puedeGestionarConsumos) {
                Swal.fire({
                    icon: "warning",
                    title: "Acción no permitida",
                    text: "Solo se pueden gestionar consumos en departamentos OCUPADOS o RESERVADOS",
                    confirmButtonText: "Entendido",
                });
                return;
            }

            fnAsignarDepartamento(departamento);
            fnAbrirDrawerConsumosDepartamento(true);
        },
        [fnAsignarDepartamento, fnAbrirDrawerConsumosDepartamento],
    );

    // Manejador para habilitar departamento
    const handleHabilitar = useCallback(
        (departamento) => {
            Swal.fire({
                title: "¿Habilitar Departamento?",
                text: `¿Deseas habilitar el departamento ${departamento.numero_departamento}?`,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, habilitar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fnCambiarEstadoDepartamento({
                        id: departamento.id,
                        nombre_estado: ESTADOS.DISPONIBLE,
                    });
                }
            });
        },
        [fnCambiarEstadoDepartamento],
    );

    // Manejador para mantenimiento
    const handleMantenimiento = useCallback(
        (departamento) => {
            Swal.fire({
                title: "¿Mantenimiento del Departamento?",
                text: `¿Deseas poner en mantenimiento el departamento ${departamento.numero_departamento}? `,
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Sí, mantenimiento",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fnCambiarEstadoDepartamento({
                        id: departamento.id,
                        nombre_estado: ESTADOS.MANTENIMIENTO,
                    });
                }
            });
        },
        [fnCambiarEstadoDepartamento],
    );

    // Manejador para limpiar
    const handleLimpiar = useCallback(
        (departamento) => {
            fnAsignarDepartamento(departamento);
            fnAbrirModalLimpieza(true);
        },
        [fnAsignarDepartamento, fnAbrirModalLimpieza],
    );

    return (
        <SimpleGrid
            cols={{ base: 1, sm: 2, md: 3, lg: 3 }}
            spacing={{ base: "xl", sm: "lg", md: "md" }}
            verticalSpacing={{ base: "xl", sm: "lg" }}
        >
            {departamentos.map((departamento) => (
                <DepartamentoCard
                    key={departamento.id}
                    departamento={departamento}
                    usuario={usuario}
                    onAbrirConsumos={handleAbrirConsumos}
                    onHabilitar={handleHabilitar}
                    onMantenimiento={handleMantenimiento}
                    onLimpiar={handleLimpiar}
                    theme={theme}
                />
            ))}
        </SimpleGrid>
    );
};
