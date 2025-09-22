import { useCallback, memo } from "react";
import {
    Badge,
    Card,
    Group,
    Image,
    Menu,
    SimpleGrid,
    Text,
    useMantineTheme,
    Button,
} from "@mantine/core";
import {
    useDepartamentoStore,
    useReservaDepartamentoStore,
    useUiReservaDepartamento,
} from "../../../hooks";
import {
    IconBookmarksFilled,
    IconRosetteDiscountCheckFilled,
    IconSettingsShare,
    IconSpray,
    IconChevronsRight,
    IconCash,
} from "@tabler/icons-react";
import classes from "../modules/DisponibilidadCard.module.css";
import Swal from "sweetalert2";

// Configuración de acciones para mantener el código limpio
const accionesDepartamento = {
    LIMPIEZA: {
        label: "Limpiar",
        icon: IconSpray,
        color: "orange",
        swal: {
            icon: "info",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en realizar <strong>limpieza</strong> en el <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "LIMPIEZA",
        },
    },
    MANTENIMIENTO: {
        label: "Mantenimiento",
        icon: IconSettingsShare,
        color: "gray",
        swal: {
            icon: "question",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en realizar <strong>mantenimiento</strong> en el <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "MANTENIMIENTO",
        },
    },
    RESERVA: {
        label: "Reservar",
        icon: IconBookmarksFilled,
        color: "indigo",
        swal: {
            icon: "info",
            title: "Reservar Departamento",
            getHtml: (d) =>
                `¿Confirmas en <strong>reservar</strong> el <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "OCUPADO",
        },
    },
    PAGADO: {
        label: "Finalizar Reserva",
        icon: IconCash,
        color: "teal",
        swal: {
            icon: "question",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en <strong>finalizar</strong> la reserva del <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "PAGADO",
        },
    },
    CANCELADO: {
        label: "Cancelar Reserva",
        icon: IconRosetteDiscountCheckFilled,
        color: "red",
        swal: {
            icon: "warning",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en <strong>cancelar</strong> la reserva del <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "CANCELADO",
        },
    },
    DISPONIBLE: {
        label: "Volver Disponible",
        icon: IconRosetteDiscountCheckFilled,
        color: "teal",
        swal: {
            icon: "question",
            title: "¿Estas seguro?",
            getHtml: (d) =>
                `¿Confirmas en volver a <strong>disponible</strong> el <b>Departamento ${d.numero_departamento}</b>?`,
            confirmButtonColor: "#1268e0",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, confirmo!",
            estado: "DISPONIBLE",
        },
    },
};

const getEstadoColor = (theme, estadoColor) => {
    if (theme.colors[estadoColor]) {
        return theme.colors[estadoColor][7];
    }
    return estadoColor;
};

const ReservaMenu = ({ departamento, theme, onFinalizarReserva }) => {
    // Determinar las opciones del menú según estado actual
    const menuItems = [];

    // Opciones basadas en el estado de la reserva
    ["PAGADO", "CANCELADO"].forEach((key) => {
        const { label, icon: Icon, color, swal } = accionesDepartamento[key];
        const { estado, getHtml, ...swalConfig } = swal;
        menuItems.push(
            <Menu.Item
                key={key}
                leftSection={<Icon size={18} color={theme.colors[color][7]} />}
                color={color}
                onClick={() => {
                    Swal.fire({
                        ...swalConfig,
                        html: getHtml(departamento),
                        showCancelButton: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            onFinalizarReserva({
                                id: departamento.reserva.id,
                                nombre_estado: estado,
                            });
                        }
                    });
                }}
            >
                {label}
            </Menu.Item>
        );
    });

    return (
        <Menu withArrow withinPortal width={200}>
            <Menu.Target>
                <Button
                    variant="light"
                    color="dark"
                    radius="sm"
                    style={{ flex: 1 }}
                    size="xs"
                    leftSection={<IconChevronsRight size={18} />}
                >
                    Acción Reserva
                </Button>
            </Menu.Target>
            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
    );
};

const DepartamentoMenu = ({ departamento, theme, onReservar, onEstado }) => {
    // Determinar las opciones del menú según estado actual
    const menuItems = [];

    // Limpieza y Mantenimiento siempre visibles
    ["LIMPIEZA", "MANTENIMIENTO"].forEach((key) => {
        const { label, icon: Icon, color, swal } = accionesDepartamento[key];
        const { estado, getHtml, ...swalConfig } = swal;
        menuItems.push(
            <Menu.Item
                key={key}
                leftSection={<Icon size={18} color={theme.colors[color][7]} />}
                color={color}
                onClick={() => {
                    Swal.fire({
                        ...swalConfig,
                        html: getHtml(departamento),
                        showCancelButton: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            onEstado({
                                id: departamento.id,
                                nombre_estado: estado,
                            });
                        }
                    });
                }}
            >
                {label}
            </Menu.Item>
        );
    });

    // Condicional: Reserva si disponible, Disponible si no
    if (departamento.estado === "DISPONIBLE") {
        const { label, icon: Icon, color } = accionesDepartamento.RESERVA;
        menuItems.push(
            <Menu.Item
                key="RESERVA"
                leftSection={<Icon size={18} color={theme.colors[color][5]} />}
                color={color}
                onClick={() => onReservar(departamento)}
            >
                {label}
            </Menu.Item>
        );
    } else {
        const {
            label,
            icon: Icon,
            color,
            swal,
        } = accionesDepartamento.DISPONIBLE;
        const { estado, getHtml, ...swalConfig } = swal;
        menuItems.push(
            <Menu.Item
                key="DISPONIBLE"
                leftSection={<Icon size={18} color={theme.colors[color][7]} />}
                color={color}
                onClick={() => {
                    Swal.fire({
                        ...swalConfig,
                        html: getHtml(departamento),
                        showCancelButton: true,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            onEstado({
                                id: departamento.id,
                                nombre_estado: estado,
                            });
                        }
                    });
                }}
            >
                {label}
            </Menu.Item>
        );
    }

    return (
        <Menu withArrow withinPortal width={200}>
            <Menu.Target>
                <Button
                    variant="light"
                    size="xs"
                    //px={10}
                    color="dark"
                    leftSection={<IconChevronsRight size={18} />}
                >
                    Departamento
                </Button>
            </Menu.Target>
            <Menu.Dropdown>{menuItems}</Menu.Dropdown>
        </Menu>
    );
};

const DepartamentoCard = memo(
    ({
        departamento,
        setOpened,
        theme,
        onReservar,
        onEstado,
        onFinalizarReserva,
        fnAsignarDepartamento
    }) => {
        const imagenSrc =
            departamento.imagenes.length > 0
                ? `/storage/${departamento.imagenes[0]}`
                : "https://via.placeholder.com/300x180?text=No+Image";

        const sectionBgColor = getEstadoColor(theme, departamento.estado.color);

        const hanldeRecibirConsumos = () => {
            // Lógica para recibir consumos (si es necesario)
            if (
                departamento.estado.nombre === "DISPONIBLE" ||
                departamento.estado.nombre === "LIMPIEZA" ||
                departamento.estado.nombre === "MANTENIMIENTO"
            ) {
                Swal.fire({
                    icon: "info",
                    title: "No se pueden recibir consumos",
                    text: `El departamento ${departamento.numero_departamento} está disponible. Cambie su estado para recibir consumos.`,
                    confirmButtonColor: "#1268e0",
                });
                return;
            } else {
                fnAsignarDepartamento(departamento);
                setOpened(true);
            }
        };

        return (
            <Card
                withBorder
                radius="sm"
                shadow="sm"
                className={classes.card}
                key={departamento.id}
            >
                <Card.Section
                    onDoubleClick={hanldeRecibirConsumos}
                    className={classes.section}
                >
                    <Image fit="cover" src={imagenSrc} height={150} />
                </Card.Section>
                {/* Segunda sección: fondo del color del estado, badge con texto blanco */}
                <Card.Section
                    withBorder
                    py="xs"
                    bg={sectionBgColor}
                    className={classes.section}
                >
                    <Badge
                        variant="filled"
                        color={departamento.estado.color}
                        size="lg"
                        radius="lg"
                        fullWidth
                        style={{
                            backgroundColor: "transparent",
                        }}
                    >
                        <Text fz="xs" fw={700}>
                            {departamento.estado.nombre}
                        </Text>
                    </Badge>
                </Card.Section>

                <Card.Section
                    inheritPadding
                    className={classes.section}
                    mt="xs"
                    mb="md"
                    onDoubleClick={hanldeRecibirConsumos}
                >
                    <Text
                        mt={10}
                        mb={20}
                        fz="md"
                        c="dimmed"
                        className={classes.label}
                    >
                        Departamento {departamento.numero_departamento}
                    </Text>
                    <Group gap={30}>
                        <div>
                            <Text fz="xl" fw={700} style={{ lineHeight: 1 }}>
                                ${departamento.precio_noche.toFixed(2)}
                            </Text>
                            <Text
                                fz="sm"
                                c="dimmed"
                                fw={500}
                                style={{ lineHeight: 1 }}
                                mt={3}
                            >
                                por noche
                            </Text>
                        </div>

                        {departamento.estado.nombre === "OCUPADO" ||
                        departamento.estado.nombre === "RESERVADO" ? (
                            <ReservaMenu
                                departamento={departamento}
                                theme={theme}
                                onFinalizarReserva={onFinalizarReserva}
                            />
                        ) : (
                            <Button
                                variant="light"
                                color="dark"
                                radius="sm"
                                style={{ flex: 1 }}
                                size="xs"
                                leftSection={<IconBookmarksFilled size={18} />}
                                disabled={
                                    departamento.estado.nombre !== "DISPONIBLE"
                                }
                                onClick={() => onReservar(departamento)}
                            >
                                Reservar
                            </Button>
                        )}
                    </Group>
                </Card.Section>

                <Card.Section withBorder inheritPadding py="xs">
                    <Group justify="space-between" grow>
                        <DepartamentoMenu
                            departamento={departamento}
                            theme={theme}
                            onReservar={onReservar}
                            onEstado={onEstado}
                        />
                    </Group>
                </Card.Section>
            </Card>
        );
    }
);

export const DisponibilidadCards = ({ setOpened }) => {
    const {
        departamentos,
        fnAsignarDepartamento,
        fnCambiarEstadoDepartamento,
    } = useDepartamentoStore();
    const { fnAbrirModalReservarDepartamento } = useUiReservaDepartamento();
    const { fnCambiarEstadoReserva } = useReservaDepartamentoStore();
    const theme = useMantineTheme();

    const handleReservarClick = useCallback(
        (selected) => {
            fnAsignarDepartamento(selected);
            fnAbrirModalReservarDepartamento(true);
        },
        [fnAsignarDepartamento, fnAbrirModalReservarDepartamento]
    );

    const handleEstadoClick = useCallback(
        ({ id, nombre_estado }) => {
            fnCambiarEstadoDepartamento({ id, nombre_estado });
        },
        [fnCambiarEstadoDepartamento]
    );

    const handleFinalizarReservaClick = useCallback(
        ({ id, nombre_estado }) => {
            fnCambiarEstadoReserva({ id, nombre_estado });
        },
        [fnCambiarEstadoDepartamento]
    );

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 4, lg: 4 }}>
            {departamentos.map((departamento) => (
                <DepartamentoCard
                    key={departamento.id}
                    departamento={departamento}
                    setOpened={setOpened}
                    theme={theme}
                    onReservar={handleReservarClick}
                    onEstado={handleEstadoClick}
                    onFinalizarReserva={handleFinalizarReservaClick}
                    fnAsignarDepartamento={fnAsignarDepartamento}
                />
            ))}
        </SimpleGrid>
    );
};
