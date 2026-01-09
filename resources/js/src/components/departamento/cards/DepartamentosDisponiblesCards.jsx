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
    IconCodeCircle,
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

const ESTADOS_BLOQUEADOS = [
    ESTADOS.OCUPADO,
    ESTADOS.RESERVADO,
    ESTADOS.LIMPIEZA,
    ESTADOS.MANTENIMIENTO,
];

const ESTADOS_GESTION_CONSUMOS = [ESTADOS.OCUPADO, ESTADOS.RESERVADO];

// Subcomponente para la información del departamento
const DepartamentoInfo = ({ departamento }) => (
    <>
        <Group justify="space-between" mt="md">
            <div>
                <Text fw={500}>
                    Departamento - {departamento.numero_departamento}
                </Text>
                <Text fz="xs" c="dimmed">
                    Número Departamento
                </Text>
            </div>
            <Badge variant="outline">{departamento.tipo_departamento}</Badge>
        </Group>
        <Group gap={8} mb={-8} mt={5}>
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
const ReservaSection = ({ reserva }) => (
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
                          reserva.fecha_checkin
                      )} - ${formatFechaModal(reserva.fecha_checkout)}`
                    : "Sin Reserva"}
            </Text>
        </Center>
        <Center mt={10}>
            <IconCodeCircle size={16} className={classes.icon} stroke={1.5} />
            <Badge size="lg" radius="xl" variant="outline">{reserva?.codigo_reserva || "Sin Código"}</Badge>
        </Center>
    </Card.Section>
);

// Subcomponente para el badge de estado
const EstadoBadge = ({ estado, theme }) => {
    const backgroundColor = useMemo(
        () =>
            estado?.color
                ? getEstadoColor(theme, estado.color)
                : theme.colors.gray[2],
        [estado, theme]
    );

    return (
        <Card.Section
            withBorder
            className={classes.section}
            bg={backgroundColor}
        >
            <Badge
                variant="filled"
                color={estado?.color || "gray"}
                size="lg"
                radius="lg"
                fullWidth
                style={{ backgroundColor: "transparent" }}
            >
                {estado?.nombre_estado || "Sin Estado"}
            </Badge>
        </Card.Section>
    );
};

// Subcomponente para los botones de acción
const AccionesFooter = ({
    departamento,
    onHabilitar,
    onMantenimiento,
    onLimpiar,
}) => {
    const estadoActual = departamento.estado?.nombre_estado;
    const esLimpiezaOMantenimiento = [
        ESTADOS.LIMPIEZA,
        ESTADOS.MANTENIMIENTO,
    ].includes(estadoActual);
    const estaOcupadoOReservado = ESTADOS_BLOQUEADOS.includes(estadoActual);

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

    return (
        <Card withBorder radius="md" className={classes.card}>
            <Card.Section
                className={classes.imageSection}
                onDoubleClick={() => onAbrirConsumos(departamento)}
            >
                <Image
                    src={imageSrc}
                    alt={`departamento-${departamento.numero_departamento}`}
                    fallbackSrc="https://placehold.co/600x400? text=Placeholder"
                    fit="cover"
                    w="100%"
                    h={{ base: 90, sm: 90, md: 120 }}
                    styles={{ image: { objectPosition: "center" } }}
                />
            </Card.Section>

            <DepartamentoInfo departamento={departamento} />
            <ReservaSection reserva={departamento.reserva} />
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
                showConfirmButton: true,
            });
        }
    }, [mensaje]);

    useEffect(() => {
        if (errores !== undefined) {
            Swal.fire({
                icon: "error",
                text: errores,
                showConfirmButton: true,
            });
        }
    }, [errores]);

    // Handlers memoizados
    const handleAbrirConsumos = useCallback(
        (departamento) => {
            if (
                ESTADOS_GESTION_CONSUMOS.includes(
                    departamento.estado?.nombre_estado
                )
            ) {
                fnAsignarDepartamento(departamento);
                fnAbrirDrawerConsumosDepartamento(true);
            } else {
                Swal.fire({
                    icon: "info",
                    html: `Los consumos solo se pueden gestionar en departamentos con estado <strong>OCUPADO</strong> o <strong>RESERVADO</strong>. `,
                    showConfirmButton: true,
                });
            }
        },
        [fnAsignarDepartamento, fnAbrirDrawerConsumosDepartamento]
    );

    const handleMantenimientoDepartamento = useCallback(
        (departamento) => {
            Swal.fire({
                title: "¿Estás seguro? ",
                text: `¿Deseas poner en mantenimiento el departamento ${departamento.numero_departamento}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: theme.colors.red[6],
                cancelButtonColor: theme.colors.gray[6],
                confirmButtonText: "Sí, poner en mantenimiento",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fnCambiarEstadoDepartamento({
                        id: departamento.id,
                        nombre_estado: ESTADOS.MANTENIMIENTO,
                    });
                    Swal.fire(
                        "¡Hecho! ",
                        `El departamento ${departamento.numero_departamento} está en mantenimiento. `,
                        "success"
                    );
                }
            });
        },
        [fnCambiarEstadoDepartamento, theme]
    );

    const handleLimpiarDepartamento = useCallback(
        (departamento) => {
            Swal.fire({
                title: "¿Estás seguro? ",
                text: `¿Deseas limpiar el departamento ${departamento.numero_departamento}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: theme.colors.blue[6],
                cancelButtonColor: theme.colors.gray[6],
                confirmButtonText: "Sí, limpiar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fnAbrirModalLimpieza(true);
                    fnAsignarDepartamento(departamento);
                }
            });
        },
        [fnAbrirModalLimpieza, fnAsignarDepartamento, theme]
    );

    const handleDepartamentoDisponible = useCallback(
        (departamento) => {
            Swal.fire({
                title: "¿Estás seguro?",
                text: `¿Deseas habilitar el departamento ${departamento.numero_departamento}?`,
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: theme.colors.blue[6],
                cancelButtonColor: theme.colors.gray[6],
                confirmButtonText: "Sí, habilitar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fnCambiarEstadoDepartamento({
                        id: departamento.id,
                        nombre_estado: ESTADOS.DISPONIBLE,
                    });
                    Swal.fire(
                        "¡Hecho!",
                        `El departamento ${departamento.numero_departamento} está habilitado.`,
                        "success"
                    );
                }
            });
        },
        [fnCambiarEstadoDepartamento, theme]
    );

    // Renderizado condicional
    if (!departamentos.length) {
        return (
            <Center h={200}>
                <Text size="lg" c="dimmed">
                    No se han registrado departamentos
                </Text>
            </Center>
        );
    }

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }}>
            {departamentos.map((departamento) => (
                <DepartamentoCard
                    key={departamento.id}
                    usuario={usuario}
                    departamento={departamento}
                    onAbrirConsumos={handleAbrirConsumos}
                    onHabilitar={handleDepartamentoDisponible}
                    onMantenimiento={handleMantenimientoDepartamento}
                    onLimpiar={handleLimpiarDepartamento}
                    theme={theme}
                />
            ))}
        </SimpleGrid>
    );
};
