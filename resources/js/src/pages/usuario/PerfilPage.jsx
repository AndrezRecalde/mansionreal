import {
    Avatar,
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Image,
    SimpleGrid,
    Stack,
    Tabs,
    Text,
    ThemeIcon,
    Paper,
    useMantineColorScheme,
} from "@mantine/core";
import { PrincipalSectionPage, TextSection, TitlePage } from "../../components";
import { useCajasStore, useTitleHook } from "../../hooks";
import {
    IconBookmarksFilled,
    IconKeyFilled,
    IconUser,
    IconShieldLock,
    IconId,
    IconMail,
    IconUserCircle,
    IconCheck,
    IconCash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
    BIENVENIDA,
    NOMBRE_SISTEMA,
    PAGE_TITLE,
} from "../../helpers/getPrefix";
import classes from "./modules/Perfil.module.css";
import bg from "../../assets/images/hotel_mansion_real.png";

const PerfilPage = () => {
    useTitleHook(PAGE_TITLE.PERFIL.TITLE);
    const navigate = useNavigate();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    const usuarioStr = localStorage.getItem("service_user");
    const usuario = usuarioStr ? JSON.parse(usuarioStr) : {};
    const { turnoActivo } = useCajasStore();
    //const authStoreStr = localStorage.getItem("auth-store");
    //const authStore = authStoreStr ? JSON.parse(authStoreStr) : {};
    //const permissions = authStore?.state?.permissions || [];

    const handleNavigateChangePassword = () => {
        navigate(PAGE_TITLE.PERFIL.NAVEGACIONES.CAMBIAR_CONTRASENA);
    };

    const handleNavigateGestionarReservas = () => {
        navigate(PAGE_TITLE.PERFIL.NAVEGACIONES.GESTIONAR_RESERVAS);
    };

    // Get initials for Avatar
    const getInitials = (nombres = "", apellidos = "") => {
        const firstLetter = nombres.charAt(0) || "";
        const secondLetter = apellidos.charAt(0) || "";
        return `${firstLetter}${secondLetter}`.toUpperCase();
    };

    return (
        <Container size="lg" my={20}>
            <PrincipalSectionPage
                title={PAGE_TITLE.PERFIL.TITLE_PAGE}
                description={PAGE_TITLE.PERFIL.DESCRIPCION_PAGE}
                icon={<IconUserCircle size={22} />}
            />
            <Divider my={10} mb={20} />
            <Card
                radius="md"
                shadow="sm"
                withBorder
                className={classes.card}
                style={{
                    padding: "0px",
                    borderRadius: "12px",
                    boxShadow: isDark
                        ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                        : "0 4px 20px rgba(0, 0, 0, 0.08)",
                    border: isDark ? "1px solid #373A40" : "none",
                }}
            >
                {/* Cover Image */}
                <div className={classes.coverContainer}>
                    <Image
                        src={bg}
                        alt="Imagen de portada"
                        className={classes.coverImage}
                    />
                </div>

                <div className={classes.profileSection}>
                    {/* Header Info (Avatar & Roles) */}
                    <div className={classes.avatarWrapper}>
                        <Group>
                            <Avatar
                                size={120}
                                radius="100%"
                                color="blue"
                                className={classes.avatar}
                            >
                                <Text size="40px" fw={700}>
                                    {getInitials(
                                        usuario?.nombres,
                                        usuario?.apellidos,
                                    )}
                                </Text>
                            </Avatar>
                            <div style={{ marginTop: "50px" }}>
                                <TextSection
                                    fz={18}
                                    fw={800}
                                    color={isDark ? "blue.4" : "blue.8"}
                                    style={{ letterSpacing: "1px" }}
                                >
                                    {usuario?.nombres} {usuario?.apellidos}
                                </TextSection>
                                <TextSection c="dimmed" fz="sm" fw={500}>
                                    {NOMBRE_SISTEMA}
                                </TextSection>
                            </div>
                        </Group>

                        <Group gap={8}>
                            {usuario?.roles?.length > 0 ? (
                                usuario.roles.map((rol, index) => (
                                    <Badge
                                        key={index}
                                        variant="light"
                                        size="lg"
                                        radius="xl"
                                        //color="blue"
                                    >
                                        {rol}
                                    </Badge>
                                ))
                            ) : (
                                <Badge variant="outline" color="gray" size="lg">
                                    Sin Rol Asignado
                                </Badge>
                            )}
                        </Group>
                    </div>

                    <Divider my="md" />

                    <div className={classes.contentWrapper}>
                        <Tabs
                            defaultValue="informacion"
                            variant="outline"
                            radius="md"
                        >
                            <Tabs.List mb="lg">
                                <Tabs.Tab
                                    value="informacion"
                                    leftSection={<IconUser size={18} />}
                                    color="blue"
                                >
                                    Información Personal
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value="permisos"
                                    leftSection={<IconShieldLock size={18} />}
                                    color="teal"
                                >
                                    Roles y Permisos
                                </Tabs.Tab>
                            </Tabs.List>

                            {/* TAB: Información Personal */}
                            <Tabs.Panel value="informacion">
                                <TitlePage order={4} mb="md">
                                    {BIENVENIDA}
                                </TitlePage>
                                <SimpleGrid
                                    cols={{ base: 1, sm: 2 }}
                                    spacing="xl"
                                >
                                    <Group wrap="nowrap">
                                        <ThemeIcon
                                            size={50}
                                            radius="md"
                                            variant="light"
                                            //color="indigo"
                                        >
                                            <IconUserCircle
                                                size={25}
                                                stroke={1.5}
                                            />
                                        </ThemeIcon>
                                        <div>
                                            <Text
                                                fz="xs"
                                                tt="uppercase"
                                                fw={600}
                                                c="dimmed"
                                            >
                                                {
                                                    PAGE_TITLE.PERFIL
                                                        .SECTION_LABELS
                                                        .NOMBRES_COMPLETOS
                                                }
                                            </Text>
                                            <Text fz="md" fw={500}>
                                                {usuario?.nombres}{" "}
                                                {usuario?.apellidos}
                                            </Text>
                                        </div>
                                    </Group>

                                    <Group wrap="nowrap">
                                        <ThemeIcon
                                            size={50}
                                            radius="md"
                                            variant="light"
                                            //color="grape"
                                        >
                                            <IconId size={25} stroke={1.5} />
                                        </ThemeIcon>
                                        <div>
                                            <Text
                                                fz="xs"
                                                tt="uppercase"
                                                fw={600}
                                                c="dimmed"
                                            >
                                                {
                                                    PAGE_TITLE.PERFIL
                                                        .SECTION_LABELS
                                                        .NUMERO_CEDULA
                                                }
                                            </Text>
                                            <Text fz="md" fw={500}>
                                                {usuario?.dni}
                                            </Text>
                                        </div>
                                    </Group>

                                    <Group wrap="nowrap">
                                        <ThemeIcon
                                            size={50}
                                            radius="md"
                                            variant="light"
                                            //color="pink"
                                        >
                                            <IconMail size={25} stroke={1.5} />
                                        </ThemeIcon>
                                        <div>
                                            <Text
                                                fz="xs"
                                                tt="uppercase"
                                                fw={600}
                                                c="dimmed"
                                            >
                                                {
                                                    PAGE_TITLE.PERFIL
                                                        .SECTION_LABELS.CORREO
                                                }
                                            </Text>
                                            <Text fz="md" fw={500}>
                                                {usuario?.email}
                                            </Text>
                                        </div>
                                    </Group>

                                    <Group wrap="nowrap">
                                        <ThemeIcon
                                            size={50}
                                            radius="md"
                                            variant="light"
                                            color={
                                                usuario?.activo ? "teal" : "red"
                                            }
                                        >
                                            <IconCheck size={25} stroke={1.5} />
                                        </ThemeIcon>
                                        <div>
                                            <Text
                                                fz="xs"
                                                tt="uppercase"
                                                fw={600}
                                                c="dimmed"
                                            >
                                                {
                                                    PAGE_TITLE.PERFIL
                                                        .SECTION_LABELS
                                                        .ESTADO_USUARIO
                                                }
                                            </Text>
                                            <Badge
                                                variant="dot"
                                                color={
                                                    usuario?.activo
                                                        ? "teal"
                                                        : "red"
                                                }
                                                radius="xs"
                                                size="md"
                                            >
                                                {usuario?.activo
                                                    ? "Usuario Activo"
                                                    : "No Activo"}
                                            </Badge>
                                        </div>
                                    </Group>
                                </SimpleGrid>

                                <SimpleGrid cols={{ base: 1, sm: 2 }} mt={50}>
                                    <Button
                                        size="md"
                                        variant="light"
                                        //color="blue"
                                        leftSection={
                                            <IconBookmarksFilled size={20} />
                                        }
                                        onClick={
                                            handleNavigateGestionarReservas
                                        }
                                        className
                                    >
                                        {
                                            PAGE_TITLE.PERFIL.BUTTONS
                                                .GESTIONAR_RESERVAS
                                        }
                                    </Button>
                                    <Button
                                        size="md"
                                        variant="default"
                                        leftSection={
                                            <IconKeyFilled size={20} />
                                        }
                                        onClick={handleNavigateChangePassword}
                                    >
                                        {
                                            PAGE_TITLE.PERFIL.BUTTONS
                                                .CAMBIAR_CONTRASENA
                                        }
                                    </Button>
                                </SimpleGrid>
                                {turnoActivo && (
                                    <Paper
                                        withBorder
                                        radius="md"
                                        p="md"
                                        mt="xl"
                                        bg={
                                            isDark
                                                ? "rgba(34, 139, 230, 0.05)"
                                                : "blue.0"
                                        }
                                    >
                                        <Group justify="space-between" mb="xs">
                                            <Group gap="sm">
                                                <ThemeIcon
                                                    color="blue"
                                                    variant="light"
                                                    size="lg"
                                                    radius="md"
                                                >
                                                    <IconCash size={20} />
                                                </ThemeIcon>
                                                <div>
                                                    <Text fw={700} fz="sm">
                                                        Sesión de Caja Activa -
                                                        {
                                                            turnoActivo.caja
                                                                ?.nombre
                                                        }
                                                    </Text>
                                                </div>
                                            </Group>
                                            <Badge
                                                variant="dot"
                                                color="teal"
                                                size="lg"
                                            >
                                                {turnoActivo.estado
                                                    ?.nombre_estado ||
                                                    "ABIERTA"}
                                            </Badge>
                                        </Group>
                                    </Paper>
                                )}
                            </Tabs.Panel>

                            {/* TAB: Roles y Permisos */}
                            <Tabs.Panel value="permisos">
                                <Stack>
                                    <Text fz="sm" c="dimmed" mb="sm">
                                        Lista de permisos y accesos autorizados
                                        para su cuenta en el sistema.
                                    </Text>

                                    {usuario.permissions &&
                                    usuario.permissions.length > 0 ? (
                                        <Group gap="xs">
                                            {usuario.permissions.map(
                                                (perm, idx) => (
                                                    <Badge
                                                        key={idx}
                                                        color="teal"
                                                        variant="dot"
                                                        size="md"
                                                        style={{
                                                            textTransform:
                                                                "none",
                                                        }}
                                                    >
                                                        {perm}
                                                    </Badge>
                                                ),
                                            )}
                                        </Group>
                                    ) : (
                                        <Text c="dimmed" fs="italic">
                                            No se encontraron permisos
                                            explícitos asignados.
                                        </Text>
                                    )}
                                </Stack>
                            </Tabs.Panel>
                        </Tabs>
                    </div>
                </div>
            </Card>
        </Container>
    );
};

export default PerfilPage;
