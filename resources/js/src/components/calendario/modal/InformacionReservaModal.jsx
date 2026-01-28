import {
    Modal,
    Stack,
    Group,
    Text,
    Badge,
    Divider,
    Box,
    Title,
    Paper,
    Table,
    SimpleGrid,
} from "@mantine/core";
import {
    IconCalendar,
    IconUser,
    IconBed,
    IconUsers,
    IconPaw,
    IconX,
    IconEye,
} from "@tabler/icons-react";
import { useMediaQuery } from "@mantine/hooks";
import { formatFechaModal, formatHora } from "../../../helpers/fnHelper";
import { BtnSection } from "../../elements/buttons/BtnServices";
import classes from "../modules/InformacionReservaModal.module.css";

const InfoRow = ({ label, value, icon: Icon }) => (
    <Group justify="space-between" wrap="nowrap" className={classes.infoRow}>
        <Group gap="xs" className={classes.infoLabel}>
            {Icon && <Icon size={16} className={classes.icon} />}
            <Text size="sm" c="dimmed" fw={500}>
                {label}
            </Text>
        </Group>
        <Text size="sm" fw={600} className={classes.infoValue}>
            {value}
        </Text>
    </Group>
);

const SeccionHuesped = ({ huesped }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <Box>
            <Group gap="xs" mb="sm">
                <IconUser size={18} />
                <Title order={isMobile ? 6 : 5}>Información del Huésped</Title>
            </Group>

            {isMobile ? (
                <Stack gap="xs">
                    <InfoRow
                        label="Huésped Anfitrión"
                        value={huesped?.nombres_completos}
                    />
                    <InfoRow label="DNI" value={huesped?.dni} />
                    <InfoRow label="Teléfono" value={huesped?.telefono} />
                    <InfoRow label="Correo" value={huesped?.email} />
                </Stack>
            ) : (
                <Table variant="vertical" layout="fixed" withTableBorder>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Th w={160}>Huésped Anfitrión</Table.Th>
                            <Table.Td>{huesped?.nombres_completos}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>DNI</Table.Th>
                            <Table.Td>{huesped?.dni}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Teléfono</Table.Th>
                            <Table.Td>{huesped?.telefono}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th>Correo</Table.Th>
                            <Table.Td>{huesped?.email}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            )}
        </Box>
    );
};

const SeccionDepartamento = ({ departamento }) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <Box>
            <Group gap="xs" mb="sm">
                <IconBed size={18} />
                <Title order={isMobile ? 6 : 5}>
                    Información del Departamento
                </Title>
            </Group>

            {isMobile ? (
                <Stack gap="xs">
                    <InfoRow
                        label="Departamento"
                        value={departamento?.numero}
                        icon={IconBed}
                    />
                    <InfoRow label="Tipo Departamento" value={departamento?.tipo} />
                </Stack>
            ) : (
                <Table variant="vertical" layout="fixed" withTableBorder>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Th>Tipo Departamento</Table.Th>
                            <Table.Td>{departamento?.tipo}</Table.Td>
                        </Table.Tr>
                        <Table.Tr>
                            <Table.Th w={160}>Departamento</Table.Th>
                            <Table.Td>{departamento?.numero}</Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>
            )}
        </Box>
    );
};

const StatCard = ({ icon: Icon, label, value, ...props }) => (
    <Paper p="sm" withBorder className={classes.statCard} {...props}>
        <Group gap={6} mb={4}>
            <Icon size={16} className={classes.statIcon} />
            <Text size="xs" c="dimmed" fw={500}>
                {label}
            </Text>
        </Group>
        <Box className={classes.statValue}>{value}</Box>
    </Paper>
);

const SeccionDetalles = ({ reserva }) => {
    return (
        <Box>
            <Group gap="xs" mb="sm">
                <IconCalendar size={18} />
                <Title order={5}>Detalles de la Reserva</Title>
            </Group>

            {/* Fechas y noches */}
            <SimpleGrid cols={{ base: 1, xs: 2, sm: 3 }} spacing="sm" mb="sm">
                <StatCard
                    icon={IconCalendar}
                    label="Check-in"
                    value={
                        <Stack gap={2}>
                            <Text size="sm" fw={600} lineClamp={1}>
                                {formatFechaModal(reserva.start)}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {formatHora(reserva.start)}
                            </Text>
                        </Stack>
                    }
                />
                <StatCard
                    icon={IconCalendar}
                    label="Check-out"
                    value={
                        <Stack gap={2}>
                            <Text size="sm" fw={600} lineClamp={1}>
                                {formatFechaModal(reserva.end)}
                            </Text>
                            <Text size="xs" c="dimmed">
                                {formatHora(reserva.end)}
                            </Text>
                        </Stack>
                    }
                />
                <StatCard
                    icon={IconBed}
                    label="Noches"
                    value={
                        <Text size="md" fw={600}>
                            {reserva.total_noches}
                        </Text>
                    }
                />
            </SimpleGrid>

            {/* Ocupantes */}
            <SimpleGrid cols={{ base: 3, sm: 3 }} spacing="sm">
                <StatCard
                    icon={IconUsers}
                    label="Adultos"
                    value={
                        <Text size="md" fw={600}>
                            {reserva.total_adultos}
                        </Text>
                    }
                />
                <StatCard
                    icon={IconUsers}
                    label="Niños"
                    value={
                        <Text size="md" fw={600}>
                            {reserva.total_ninos}
                        </Text>
                    }
                />
                <StatCard
                    icon={IconPaw}
                    label="Mascotas"
                    value={
                        <Text size="md" fw={600}>
                            {reserva.total_mascotas}
                        </Text>
                    }
                />
            </SimpleGrid>
        </Box>
    );
};

export const InformacionReservaModal = ({
    abrirModal,
    cerrarModal,
    abrirModalConsumos,
    reserva,
}) => {
    const isMobile = useMediaQuery("(max-width: 768px)");

    if (!reserva) return null;

    return (
        <Modal
            centered
            opened={abrirModal}
            onClose={cerrarModal}
            title={
                <Text fw={700} size={isMobile ? "md" : "lg"}>
                    Detalles de la Reserva
                </Text>
            }
            size="lg"
            fullScreen={isMobile}
            overlayProps={{
                opacity: 0.55,
                blur: 3,
            }}
            padding={{ base: "sm", sm: "md", md: "lg" }}
            classNames={{
                body: classes.modalBody,
                header: classes.modalHeader,
            }}
        >
            <Stack gap={{ base: "md", sm: "lg" }}>
                {/* Header info */}
                {isMobile ? (
                    <Stack gap="xs">
                        <InfoRow
                            label="Código"
                            value={reserva.codigo_reserva}
                        />
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed" fw={500}>
                                Estado
                            </Text>
                            <Badge
                                radius="sm"
                                variant="dot"
                                color={reserva.estado?.color || "gray"}
                            >
                                {reserva.estado?.nombre_estado}
                            </Badge>
                        </Group>
                    </Stack>
                ) : (
                    <Table variant="vertical" layout="fixed" withTableBorder>
                        <Table.Tbody>
                            <Table.Tr>
                                <Table.Th w={160}>Código</Table.Th>
                                <Table.Td>{reserva.codigo_reserva}</Table.Td>
                            </Table.Tr>
                            <Table.Tr>
                                <Table.Th>Estado</Table.Th>
                                <Table.Td bg={reserva.estado?.color || "gray"}>
                                    <Badge
                                        radius="sm"
                                        variant="filled"
                                        color={reserva.estado?.color || "gray"}
                                    >
                                        {reserva.estado?.nombre_estado}
                                    </Badge>
                                </Table.Td>
                            </Table.Tr>
                        </Table.Tbody>
                    </Table>
                )}

                <Divider />

                <SeccionHuesped huesped={reserva.huesped} />

                <Divider />

                <SeccionDepartamento departamento={reserva.departamento} />

                <Divider />

                <SeccionDetalles reserva={reserva} />

                {/* Botones */}
                <Group
                    justify="flex-end"
                    mt="md"
                    gap="sm"
                    className={classes.buttonGroup}
                >
                    <BtnSection
                        IconSection={IconEye}
                        handleAction={() => abrirModalConsumos(reserva)}
                        fullWidth={isMobile}
                        size={isMobile ? "md" : "sm"}
                    >
                        Ver Reserva
                    </BtnSection>
                    <BtnSection
                        IconSection={IconX}
                        variant="light"
                        handleAction={cerrarModal}
                        fullWidth={isMobile}
                        size={isMobile ? "md" : "sm"}
                    >
                        Cerrar
                    </BtnSection>
                </Group>
            </Stack>
        </Modal>
    );
};
