import { useState, useEffect, useCallback } from "react";
import {
    Tabs,
    Text,
    Button,
    Group,
    Modal,
    TextInput,
    MultiSelect,
    Badge,
    ActionIcon,
    Tooltip,
    Stack,
    Paper,
    Title,
    ThemeIcon,
    Box,
    Container,
    Divider,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import Swal from "sweetalert2";
import {
    IconShieldLock,
    IconKey,
    IconUsers,
    IconPlus,
    IconEdit,
    IconTrash,
    IconShield,
    IconCheck,
    IconX,
    IconCubePlus,
} from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_ES } from "mantine-react-table/locales/es/index.esm.mjs";
import { useRoleStore, usePermissionStore, useUsuarioStore } from "../../hooks";
import { TitlePage } from "../../components/elements/titles/TitlePage";
import { BtnSection } from "../../components";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
const notifyOk = (msg) =>
    notifications.show({
        title: "Éxito",
        message: msg,
        color: "teal",
        icon: <IconCheck size={16} />,
    });

const notifyErr = (msg) =>
    notifications.show({
        title: "Error",
        message: msg,
        color: "red",
        icon: <IconX size={16} />,
    });

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — Roles
// ─────────────────────────────────────────────────────────────────────────────
function TabRoles() {
    const {
        roles,
        permisos,
        cargando,
        fnCargarRoles,
        fnCrearRol,
        fnActualizarRol,
        fnEliminarRol,
        fnCargarPermisos,
        fnAsignarPermisos,
        fnLimpiarPermisosDeRol,
    } = useRoleStore();

    const [opened, { open, close }] = useDisclosure(false);
    const [permOpened, { open: openPerm, close: closePerm }] =
        useDisclosure(false);
    const [editando, setEditando] = useState(null);
    const [nombre, setNombre] = useState("");
    const [rolSeleccionado, setRolSeleccionado] = useState(null);
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fnCargarRoles();
        fnCargarPermisos();
    }, []);

    const handleOpenCreate = () => {
        setEditando(null);
        setNombre("");
        open();
    };

    const handleOpenEdit = (rol) => {
        setEditando(rol);
        setNombre(rol.name);
        open();
    };

    const handleOpenPermisos = useCallback(async (rol) => {
        setRolSeleccionado(rol);
        fnLimpiarPermisosDeRol();
        setPermisosSeleccionados([]);
        openPerm();
        await fnCargarPermisos();
        const { data } = await import("../../api/apiAxios").then((m) =>
            m.default.get(`/gerencia/rol/${rol.id}/permisos`),
        );
        setPermisosSeleccionados(data.permisos.map((p) => p.name));
    }, []);

    const handleSaveRol = async () => {
        if (!nombre.trim()) return;
        setSaving(true);
        try {
            if (editando) {
                await fnActualizarRol(editando.id, nombre);
                notifyOk("Rol actualizado correctamente");
            } else {
                await fnCrearRol(nombre);
                notifyOk("Rol creado correctamente");
            }
            close();
        } catch {
            notifyErr("Error al guardar el rol");
        } finally {
            setSaving(false);
        }
    };

    const handleSavePermisos = async () => {
        if (!rolSeleccionado) return;
        setSaving(true);
        try {
            await fnAsignarPermisos(rolSeleccionado.id, permisosSeleccionados);
            notifyOk("Permisos del rol actualizados");
            closePerm();
        } catch {
            notifyErr("Error al actualizar permisos");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (rol) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar el rol "${rol.name}"? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await fnEliminarRol(rol.id);
                notifyOk("Rol eliminado");
            } catch {
                notifyErr("No se pudo eliminar el rol");
            }
        }
    };

    const tabla = useMantineReactTable({
        columns: [
            //{ accessorKey: "id", header: "ID", size: 60 },
            { accessorKey: "name", header: "Nombre" },
        ],
        data: roles,
        state: { isLoading: cargando },
        localization: MRT_Localization_ES,
        enableRowActions: true,
        positionActionsColumn: "last",
        renderRowActions: ({ row }) => (
            <Group wrap="nowrap" gap={4}>
                <Tooltip label="Editar nombre">
                    <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleOpenEdit(row.original)}
                    >
                        <IconEdit size={16} />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Asignar permisos">
                    <ActionIcon
                        variant="subtle"
                        color="violet"
                        onClick={() => handleOpenPermisos(row.original)}
                    >
                        <IconShield size={16} />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Eliminar">
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(row.original)}
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        ),
        renderTopToolbarCustomActions: () => (
            <BtnSection
                IconSection={IconCubePlus}
                handleAction={handleOpenCreate}
            >
                Nuevo Rol
            </BtnSection>
        ),
    });

    return (
        <>
            <MantineReactTable table={tabla} />

            {/* Modal Crear / Editar Rol */}
            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Group gap={8}>
                        <ThemeIcon color="teal" variant="light">
                            <IconShieldLock size={18} />
                        </ThemeIcon>
                        <Text fw={600}>
                            {editando ? "Editar Rol" : "Nuevo Rol"}
                        </Text>
                    </Group>
                }
                centered
            >
                <Stack gap="md">
                    <TextInput
                        label="Nombre del Rol"
                        placeholder="Ej: SUPERVISOR"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value.toUpperCase())
                        }
                        required
                    />
                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={close}>
                            Cancelar
                        </Button>
                        <Button
                            color="teal"
                            loading={saving}
                            onClick={handleSaveRol}
                        >
                            Guardar
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Modal asignar permisos a rol */}
            <Modal
                opened={permOpened}
                onClose={closePerm}
                title={
                    <Group gap={8}>
                        <ThemeIcon color="violet" variant="light">
                            <IconShield size={18} />
                        </ThemeIcon>
                        <Text fw={600}>
                            Permisos de:{" "}
                            <Badge color="violet">
                                {rolSeleccionado?.name}
                            </Badge>
                        </Text>
                    </Group>
                }
                size="lg"
                centered
            >
                <Stack gap="md">
                    <MultiSelect
                        label="Selecciona los permisos del rol"
                        placeholder="Buscar permisos..."
                        data={permisos.map((p) => ({
                            value: p.name,
                            label: p.name,
                        }))}
                        value={permisosSeleccionados}
                        onChange={setPermisosSeleccionados}
                        searchable
                        clearable
                        nothingFoundMessage="Sin resultados"
                    />
                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={closePerm}>
                            Cancelar
                        </Button>
                        <Button
                            color="violet"
                            loading={saving}
                            onClick={handleSavePermisos}
                        >
                            Guardar Permisos
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — Permisos
// ─────────────────────────────────────────────────────────────────────────────
function TabPermisos() {
    const {
        permisos,
        cargando,
        fnCargarPermisos,
        fnCrearPermiso,
        fnActualizarPermiso,
        fnEliminarPermiso,
    } = usePermissionStore();

    const [opened, { open, close }] = useDisclosure(false);
    const [editando, setEditando] = useState(null);
    const [nombre, setNombre] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fnCargarPermisos();
    }, []);

    const handleOpenCreate = () => {
        setEditando(null);
        setNombre("");
        open();
    };

    const handleOpenEdit = (permiso) => {
        setEditando(permiso);
        setNombre(permiso.name);
        open();
    };

    const handleSave = async () => {
        if (!nombre.trim()) return;
        setSaving(true);
        try {
            if (editando) {
                await fnActualizarPermiso(editando.id, nombre);
                notifyOk("Permiso actualizado");
            } else {
                await fnCrearPermiso(nombre);
                notifyOk("Permiso creado");
            }
            close();
        } catch {
            notifyErr("Error al guardar permiso");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (permiso) => {
        const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: `¿Deseas eliminar el permiso "${permiso.name}"? Esta acción no se puede deshacer.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
        });

        if (result.isConfirmed) {
            try {
                await fnEliminarPermiso(permiso.id);
                notifyOk("Permiso eliminado");
            } catch {
                notifyErr("No se pudo eliminar el permiso");
            }
        }
    };

    const tabla = useMantineReactTable({
        columns: [
            //{ accessorKey: "id", header: "ID", size: 60 },
            { accessorKey: "name", header: "Nombre del Permiso" },
        ],
        data: permisos,
        state: { isLoading: cargando },
        localization: MRT_Localization_ES,
        enableRowActions: true,
        positionActionsColumn: "last",
        renderRowActions: ({ row }) => (
            <Group wrap="nowrap" gap={4}>
                <Tooltip label="Editar">
                    <ActionIcon
                        variant="subtle"
                        color="blue"
                        onClick={() => handleOpenEdit(row.original)}
                    >
                        <IconEdit size={16} />
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Eliminar">
                    <ActionIcon
                        variant="subtle"
                        color="red"
                        onClick={() => handleDelete(row.original)}
                    >
                        <IconTrash size={16} />
                    </ActionIcon>
                </Tooltip>
            </Group>
        ),
        renderTopToolbarCustomActions: () => (
            <BtnSection
                IconSection={IconCubePlus}
                handleAction={handleOpenCreate}
            >
                Nuevo Permiso
            </BtnSection>
        ),
    });

    return (
        <>
            <MantineReactTable table={tabla} />

            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Group gap={8}>
                        <ThemeIcon color="indigo" variant="light">
                            <IconKey size={18} />
                        </ThemeIcon>
                        <Text fw={600}>
                            {editando ? "Editar Permiso" : "Nuevo Permiso"}
                        </Text>
                    </Group>
                }
                centered
            >
                <Stack gap="md">
                    <TextInput
                        label="Nombre del Permiso"
                        description="Usa snake_case, ej: ver_facturas"
                        placeholder="ver_facturas"
                        value={nombre}
                        onChange={(e) =>
                            setNombre(e.target.value.toLowerCase())
                        }
                        required
                    />
                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={close}>
                            Cancelar
                        </Button>
                        <Button
                            color="indigo"
                            loading={saving}
                            onClick={handleSave}
                        >
                            Guardar
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — Usuarios con Roles y Permisos Directos
// ─────────────────────────────────────────────────────────────────────────────
function TabUsuarios() {
    const { usuarios, cargando, fnCargarUsuarios, fnAsignarPermisosDirectos } =
        useUsuarioStore();
    const { permisos, fnCargarPermisos } = usePermissionStore();

    const [opened, { open, close }] = useDisclosure(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fnCargarUsuarios();
        fnCargarPermisos();
    }, []);

    const handleOpenPermisos = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setPermisosSeleccionados(
            (usuario.permisos_directos || []).map((p) => p.name),
        );
        open();
    };

    const handleSavePermisos = async () => {
        if (!usuarioSeleccionado) return;
        setSaving(true);
        try {
            await fnAsignarPermisosDirectos(
                usuarioSeleccionado.id,
                permisosSeleccionados,
            );
            notifyOk("Permisos directos actualizados");
            close();
        } catch {
            notifyErr("Error al actualizar permisos");
        } finally {
            setSaving(false);
        }
    };

    const tabla = useMantineReactTable({
        columns: [
            { accessorKey: "nombres", header: "Nombres" },
            { accessorKey: "apellidos", header: "Apellidos" },
            { accessorKey: "dni", header: "DNI", size: 100 },
            {
                accessorKey: "role",
                header: "Rol",
                Cell: ({ cell }) =>
                    cell.getValue() ? (
                        <Badge color="blue" variant="light">
                            {cell.getValue()}
                        </Badge>
                    ) : (
                        <Badge color="gray" variant="outline">
                            Sin rol
                        </Badge>
                    ),
            },
            {
                accessorKey: "permisos_directos",
                header: "Permisos Directos",
                enableSorting: false,
                Cell: ({ cell }) => {
                    const perms = cell.getValue() || [];
                    if (perms.length === 0)
                        return (
                            <Text size="xs" c="dimmed">
                                Ninguno
                            </Text>
                        );
                    return (
                        <Group gap={4} wrap="wrap">
                            {perms.map((p) => (
                                <Badge
                                    key={p.name || p}
                                    size="xs"
                                    color="violet"
                                    variant="dot"
                                >
                                    {p.name || p}
                                </Badge>
                            ))}
                        </Group>
                    );
                },
            },
            {
                accessorKey: "activo",
                header: "Estado",
                size: 90,
                Cell: ({ cell }) => (
                    <Badge
                        color={cell.getValue() ? "green" : "red"}
                        variant="light"
                        size="sm"
                    >
                        {cell.getValue() ? "Activo" : "Inactivo"}
                    </Badge>
                ),
            },
        ],
        data: usuarios,
        state: { isLoading: cargando },
        localization: MRT_Localization_ES,
        enableRowActions: true,
        positionActionsColumn: "last",
        renderRowActions: ({ row }) => (
            <Tooltip label="Asignar permisos directos">
                <ActionIcon
                    variant="subtle"
                    color="violet"
                    onClick={() => handleOpenPermisos(row.original)}
                >
                    <IconKey size={16} />
                </ActionIcon>
            </Tooltip>
        ),
    });

    return (
        <>
            <MantineReactTable table={tabla} />

            <Modal
                opened={opened}
                onClose={close}
                title={
                    <Group gap={8}>
                        <ThemeIcon color="violet" variant="light">
                            <IconKey size={18} />
                        </ThemeIcon>
                        <Text fw={600}>
                            Permisos directos de:{" "}
                            <Badge color="blue" variant="light">
                                {usuarioSeleccionado?.nombres}{" "}
                                {usuarioSeleccionado?.apellidos}
                            </Badge>
                        </Text>
                    </Group>
                }
                size="lg"
                centered
            >
                <Stack gap="md">
                    {usuarioSeleccionado?.role && (
                        <Text size="sm" c="dimmed">
                            Rol actual:{" "}
                            <Badge color="blue" variant="light">
                                {usuarioSeleccionado.role}
                            </Badge>
                        </Text>
                    )}
                    <MultiSelect
                        label="Permisos directos asignados"
                        description="Los permisos directos se suman a los del rol asignado."
                        placeholder="Seleccionar permisos..."
                        data={permisos.map((p) => ({
                            value: p.name,
                            label: p.name,
                        }))}
                        value={permisosSeleccionados}
                        onChange={setPermisosSeleccionados}
                        searchable
                        clearable
                        nothingFoundMessage="Sin resultados"
                    />
                    <Group justify="flex-end">
                        <Button variant="subtle" onClick={close}>
                            Cancelar
                        </Button>
                        <Button
                            color="violet"
                            loading={saving}
                            onClick={handleSavePermisos}
                        >
                            Guardar Permisos
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
const RolesPermisosPage = () => {
    return (
        <Container size="xl">
            <TitlePage order={2} fw={700}>
                Roles &amp; Permisos
            </TitlePage>
            <Divider my={10} />

            <Tabs defaultValue="roles" variant="outline" radius="md">
                <Tabs.List mb="md">
                    <Tabs.Tab
                        value="roles"
                        leftSection={<IconShieldLock size={16} />}
                        fw={500}
                    >
                        Roles
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="permisos"
                        leftSection={<IconKey size={16} />}
                        fw={500}
                    >
                        Permisos
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="usuarios"
                        leftSection={<IconUsers size={16} />}
                        fw={500}
                    >
                        Usuarios
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="roles">
                    <Paper shadow="xs" radius="md" p="md" withBorder>
                        <TabRoles />
                    </Paper>
                </Tabs.Panel>

                <Tabs.Panel value="permisos">
                    <Paper shadow="xs" radius="md" p="md" withBorder>
                        <TabPermisos />
                    </Paper>
                </Tabs.Panel>

                <Tabs.Panel value="usuarios">
                    <Paper shadow="xs" radius="md" p="md" withBorder>
                        <TabUsuarios />
                    </Paper>
                </Tabs.Panel>
            </Tabs>
        </Container>
    );
};

export default RolesPermisosPage;
