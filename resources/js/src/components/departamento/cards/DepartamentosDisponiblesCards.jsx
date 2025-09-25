import {
    ActionIcon,
    Badge,
    Card,
    Center,
    Group,
    Image,
    SimpleGrid,
    Text,
    Tooltip,
    useMantineTheme,
} from "@mantine/core";
import {
    useDepartamentoStore,
    useUiConsumo,
    useUiReservaDepartamento,
} from "../../../hooks";
import {
    IconBookmarksFilled,
    IconBuilding,
    IconCalendar,
    IconRotate2,
    IconSpray,
    IconTool,
    IconUser,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import "dayjs/locale/es"; // importar español
import classes from "./modules/DepartamentoDisponibiles.module.css";
import Swal from "sweetalert2";
dayjs.locale("es");

export const DepartamentosDisponiblesCards = () => {
    const {
        departamentos,
        fnAsignarDepartamento,
        fnCambiarEstadoDepartamento,
    } = useDepartamentoStore();
    const { fnAbrirModalReservarDepartamento } = useUiReservaDepartamento();
    const { fnAbrirDrawerConsumosDepartamento } = useUiConsumo();
    const theme = useMantineTheme();

    const getEstadoColor = (theme, estadoColor) => {
        if (theme.colors[estadoColor]) {
            return theme.colors[estadoColor][7];
        }
        return estadoColor;
    };

    const formatFecha = (fecha) =>
        dayjs(fecha)
            .locale("es")
            .format("DD-MMMM")
            .replace(/-./, (s) => s.toUpperCase());

    const handleAbrirConsumos = (departamento) => {
        if (["OCUPADO", "RESERVADO"].includes(departamento.estado.nombre)) {
            fnAsignarDepartamento(departamento);
            fnAbrirDrawerConsumosDepartamento(true);
        } else {
            Swal.fire({
                icon: "info",
                html: `Los consumos solo se pueden gestionar en departamentos con estado <strong>OCUPADO</strong> o <strong>RESERVADO</strong>.`,
                showConfirmButton: true,
            });
        }
    };

    const handleReservarDepartamento = (departamento) => {
        fnAsignarDepartamento(departamento);
        fnAbrirModalReservarDepartamento(true);
    };

    const handleMantenimientoDepartamento = (departamento) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas poner en mantenimiento el departamento ${departamento.numero_departamento}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: theme.colors.red[6],
            cancelButtonColor: theme.colors.gray[6],
            confirmButtonText: "Sí, poner en mantenimiento",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí puedes llamar a la función para cambiar el estado del departamento
                fnCambiarEstadoDepartamento({
                    id: departamento.id,
                    nombre_estado: "MANTENIMIENTO",
                });
                Swal.fire(
                    "¡Hecho!",
                    `El departamento ${departamento.numero_departamento} está en mantenimiento.`,
                    "success"
                );
            }
        });
    };

    const handleLimpiarDepartamento = (departamento) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas limpiar el departamento ${departamento.numero_departamento}?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: theme.colors.blue[6],
            cancelButtonColor: theme.colors.gray[6],
            confirmButtonText: "Sí, limpiar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                // Aquí puedes llamar a la función para cambiar el estado del departamento
                fnCambiarEstadoDepartamento({
                    id: departamento.id,
                    nombre_estado: "LIMPIEZA",
                });
                Swal.fire(
                    "¡Hecho!",
                    `El departamento ${departamento.numero_departamento} está en limpieza.`,
                    "success"
                );
            }
        });
    };

    const handleDepartamentoDisponible = (departamento) => {
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
                // Aquí puedes llamar a la función para cambiar el estado del departamento
                fnCambiarEstadoDepartamento({
                    id: departamento.id,
                    nombre_estado: "DISPONIBLE",
                });
                Swal.fire(
                    "¡Hecho!",
                    `El departamento ${departamento.numero_departamento} está en habilitado.`,
                    "success"
                );
            }
        });
    };

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }}>
            {departamentos.length > 0 ? (
                departamentos.map((departamento) => (
                    <Card
                        withBorder
                        radius="md"
                        className={classes.card}
                        key={departamento.id}
                    >
                        <Card.Section
                            className={classes.imageSection}
                            onDoubleClick={() =>
                                handleAbrirConsumos(departamento)
                            }
                        >
                            <Image
                                src={`/storage/${departamento.imagenes[0]}`}
                                alt={`departamento-${departamento.numero_departamento}`}
                                fit="cover"
                                w="100%"
                                h={{ base: 90, sm: 90, md: 120 }}
                                styles={{
                                    image: { objectPosition: "center" },
                                }}
                            />
                        </Card.Section>

                        <Group justify="space-between" mt="md">
                            <div>
                                <Text fw={500}>
                                    Departamento -{" "}
                                    {departamento.numero_departamento}
                                </Text>
                                <Text fz="xs" c="dimmed">
                                    Número Departamento
                                </Text>
                            </div>
                            <Badge variant="outline">
                                {departamento.tipo_departamento}
                            </Badge>
                        </Group>
                        <Group gap={8} mb={-8} mt={5}>
                            <Center>
                                <IconBuilding
                                    size={16}
                                    className={classes.icon}
                                    stroke={1.5}
                                />
                                <Text size="xs">
                                    capacidad: {departamento.capacidad} personas
                                </Text>
                            </Center>
                        </Group>
                        <Card.Section className={classes.section} mt="sm">
                            <Center>
                                <IconUser
                                    size={16}
                                    className={classes.icon}
                                    stroke={1.5}
                                />
                                <Text size="xs">
                                    Huesped:{" "}
                                    {departamento.reserva?.huesped ||
                                        "Sin Huesped"}
                                </Text>
                            </Center>
                            <Center>
                                <IconCalendar
                                    size={16}
                                    className={classes.icon}
                                    stroke={1.5}
                                />
                                <Text size="xs">
                                    {departamento.reserva
                                        ? `${formatFecha(
                                              departamento.reserva.fecha_checkin
                                          )} - ${formatFecha(
                                              departamento.reserva
                                                  .fecha_checkout
                                          )}`
                                        : "Sin Reserva"}
                                </Text>
                            </Center>
                        </Card.Section>
                        <Card.Section
                            withBorder
                            className={classes.section}
                            bg={getEstadoColor(
                                theme,
                                departamento.estado.color
                            )}
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
                                {departamento.estado.nombre}
                            </Badge>
                        </Card.Section>
                        <Card.Section className={classes.section_footer}>
                            <Group gap={20}>
                                <div>
                                    <Text
                                        fz="xl"
                                        fw={700}
                                        style={{ lineHeight: 1 }}
                                    >
                                        ${departamento.precio_noche}
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
                                <Group
                                    justify="space-between"
                                    gap={15}
                                    style={{ flex: 1 }}
                                >
                                    {["LIMPIEZA", "MANTENIMIENTO"].includes(
                                        departamento.estado.nombre
                                    ) ? (
                                        <Tooltip label="Departamento Disponible">
                                            <ActionIcon
                                                variant="default"
                                                size={42}
                                                aria-label="Departamento Disponible"
                                                onClick={() =>
                                                    handleDepartamentoDisponible(
                                                        departamento
                                                    )
                                                }
                                            >
                                                <IconRotate2 size={24} />
                                            </ActionIcon>
                                        </Tooltip>
                                    ) : (
                                        <Group gap={15}>
                                            <Tooltip label="Mantenimiento Departamento">
                                                <ActionIcon
                                                    disabled={
                                                        [
                                                            "OCUPADO",
                                                            "RESERVADO",
                                                            "LIMPIEZA",
                                                            "MANTENIMIENTO",
                                                        ].includes(
                                                            departamento.estado
                                                                .nombre
                                                        )
                                                            ? true
                                                            : false
                                                    }
                                                    variant="default"
                                                    size={42}
                                                    aria-label="Mantenimiento Departamento"
                                                    onClick={() =>
                                                        handleMantenimientoDepartamento(
                                                            departamento
                                                        )
                                                    }
                                                >
                                                    <IconTool size={24} />
                                                </ActionIcon>
                                            </Tooltip>
                                            <Tooltip label="Limpiar Departamento">
                                                <ActionIcon
                                                    disabled={
                                                        [
                                                            "OCUPADO",
                                                            "RESERVADO",
                                                            "LIMPIEZA",
                                                            "MANTENIMIENTO",
                                                        ].includes(
                                                            departamento.estado
                                                                .nombre
                                                        )
                                                            ? true
                                                            : false
                                                    }
                                                    variant="default"
                                                    size={42}
                                                    aria-label="Limpiar Departamento"
                                                    onClick={() =>
                                                        handleLimpiarDepartamento(
                                                            departamento
                                                        )
                                                    }
                                                >
                                                    <IconSpray size={24} />
                                                </ActionIcon>
                                            </Tooltip>
                                        </Group>
                                    )}
                                    <Tooltip label="Reservar Departamento">
                                        <ActionIcon
                                            disabled={
                                                [
                                                    "OCUPADO",
                                                    "RESERVADO",
                                                    "LIMPIEZA",
                                                    "MANTENIMIENTO",
                                                ].includes(
                                                    departamento.estado.nombre
                                                )
                                                    ? true
                                                    : false
                                            }
                                            variant="default"
                                            size={42}
                                            aria-label="Reservar Departamento"
                                            onClick={() =>
                                                handleReservarDepartamento(
                                                    departamento
                                                )
                                            }
                                        >
                                            <IconBookmarksFilled size={24} />
                                        </ActionIcon>
                                    </Tooltip>
                                </Group>
                            </Group>
                        </Card.Section>
                    </Card>
                ))
            ) : (
                <div>No se han registrado departamentos</div>
            )}
        </SimpleGrid>
    );
};
