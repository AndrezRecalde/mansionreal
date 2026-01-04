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
import { formatFechaModal, formatHora } from "../../../helpers/fnHelper";
import { BtnSection } from "../../elements/buttons/BtnServices";

const SeccionHuesped = ({ huesped }) => (
    <Box>
        <Group gap="xs" mb="sm">
            <IconUser size={18} />
            <Title order={5}>Información del Huésped</Title>
        </Group>

        <Stack gap="xs">
            <Table variant="vertical" layout="fixed" withTableBorder>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th w={160}>Huesped Anfitrión</Table.Th>
                        <Table.Td>{huesped?.nombre_completo}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th>DNI:</Table.Th>
                        <Table.Td>{huesped?.dni}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th>Telefono</Table.Th>
                        <Table.Td>{huesped?.telefono}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th>Correo</Table.Th>
                        <Table.Td>{huesped?.email}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </Stack>
    </Box>
);

const SeccionDepartamento = ({ departamento }) => (
    <Box>
        <Group gap="xs" mb="sm">
            <IconBed size={18} />
            <Title order={5}>Información del Departamento</Title>
        </Group>

        <Stack gap="xs">
            <Table variant="vertical" layout="fixed" withTableBorder>
                <Table.Tbody>
                    <Table.Tr>
                        <Table.Th w={160}>Departamento: </Table.Th>
                        <Table.Td>{departamento?.numero}</Table.Td>
                    </Table.Tr>

                    <Table.Tr>
                        <Table.Th>Tipo:</Table.Th>
                        <Table.Td>{departamento?.tipo}</Table.Td>
                    </Table.Tr>
                </Table.Tbody>
            </Table>
        </Stack>
    </Box>
);

const SeccionDetalles = ({ reserva }) => (
    <Box>
        <Group gap="xs" mb="sm">
            <IconCalendar size={18} />
            <Title order={5}>Detalles de la Reserva</Title>
        </Group>

        <Group grow>
            <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed">
                    Check-in
                </Text>
                <Text size="sm" fw={500}>
                    {formatFechaModal(reserva.start)} - {formatHora(reserva.start)}
                </Text>
            </Paper>
            <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed">
                    Check-out
                </Text>
                <Text size="sm" fw={500}>
                    {formatFechaModal(reserva.end)} - {formatHora(reserva.end)}
                </Text>
            </Paper>
            <Paper p="sm" withBorder>
                <Text size="xs" c="dimmed">
                    Noches
                </Text>
                <Text size="sm" fw={500}>
                    {reserva.total_noches}
                </Text>
            </Paper>
        </Group>

        <Group grow mt="sm">
            <Paper p="sm" withBorder>
                <Group gap={4}>
                    <IconUsers size={14} />
                    <Text size="xs" c="dimmed">
                        Adultos
                    </Text>
                </Group>
                <Text size="sm" fw={500}>
                    {reserva.total_adultos}
                </Text>
            </Paper>
            <Paper p="sm" withBorder>
                <Group gap={4}>
                    <IconUsers size={14} />
                    <Text size="xs" c="dimmed">
                        Niños
                    </Text>
                </Group>
                <Text size="sm" fw={500}>
                    {reserva.total_ninos}
                </Text>
            </Paper>
            <Paper p="sm" withBorder>
                <Group gap={4}>
                    <IconPaw size={14} />
                    <Text size="xs" c="dimmed">
                        Mascotas
                    </Text>
                </Group>
                <Text size="sm" fw={500}>
                    {reserva.total_mascotas}
                </Text>
            </Paper>
        </Group>
    </Box>
);

export const InformacionReservaModal = ({
    abrirModal,
    cerrarModal,
    abrirModalConsumos,
    reserva,
}) => {
    if (!reserva) return null;

    return (
        <Modal
            opened={abrirModal}
            onClose={cerrarModal}
            title={
                <Group gap="xs">
                    <IconCalendar size={20} />
                    <Text fw={600}>Detalles de la Reserva</Text>
                </Group>
            }
            size="lg"
            centered
        >
            <Stack gap="md">
                <Table variant="vertical" layout="fixed" withTableBorder>
                    <Table.Tbody>
                        <Table.Tr>
                            <Table.Th w={160}>Codigo: </Table.Th>
                            <Table.Td>{reserva.codigo_reserva}</Table.Td>
                        </Table.Tr>

                        <Table.Tr>
                            <Table.Th>Estado:</Table.Th>
                            <Table.Td>
                                <Badge
                                    radius="sm"
                                    variant="dot"
                                    color={reserva.estado?.color || "gray"}
                                >
                                    {reserva.estado?.nombre_estado}
                                </Badge>
                            </Table.Td>
                        </Table.Tr>
                    </Table.Tbody>
                </Table>

                <Divider />

                <SeccionHuesped huesped={reserva.huesped} />

                <Divider />

                <SeccionDepartamento departamento={reserva.departamento} />

                <Divider />

                <SeccionDetalles reserva={reserva} />

                <Group justify="flex-end" mt="md">
                    <BtnSection
                        IconSection={IconEye}
                        handleAction={() => abrirModalConsumos(reserva)}
                    >
                        Ver Reserva
                    </BtnSection>
                    <BtnSection
                        IconSection={IconX}
                        variant="light"
                        handleAction={cerrarModal}
                    >
                        Cerrar
                    </BtnSection>
                </Group>
            </Stack>
        </Modal>
    );
};
