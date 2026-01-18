import {
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Group,
    Image,
    Stack,
    useMantineColorScheme,
} from "@mantine/core";
import { TextSection, TitlePage } from "../../components";
import { useTitleHook } from "../../hooks";
import { IconBookmarksFilled, IconKeyFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import {
    BIENVENIDA,
    NOMBRE_SISTEMA,
    PAGE_TITLE,
} from "../../helpers/getPrefix";
import classes from "./modules/Perfil.module.css";
import bg from "../../assets/images/hotel_mansion_real.jpg";

const PerfilPage = () => {
    useTitleHook(PAGE_TITLE.PERFIL.TITLE);
    const navigate = useNavigate();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    const usuario = JSON.parse(localStorage.getItem("service_user") || "{}");

    const handleNavigateChangePassword = () => {
        navigate(PAGE_TITLE.PERFIL.NAVEGACIONES.CAMBIAR_CONTRASENA);
    };

    const handleNavigateGestionarReservas = () => {
        navigate(PAGE_TITLE.PERFIL.NAVEGACIONES.GESTIONAR_RESERVAS);
    };

    return (
        <Container size="md" my={20}>
            <TitlePage order={2}>{PAGE_TITLE.PERFIL.TITLE_PAGE}</TitlePage>
            <Divider my={10} />
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
                    overflow: "hidden",
                }}
            >
                {/* Lado izquierdo */}
                <div className={classes.left}>
                    <Image
                        src={bg}
                        alt="Imagen de perfil"
                        className={classes.image}
                    />
                </div>

                {/* Lado derecho */}
                <div className={classes.right}>
                    <TextSection
                        ta="center"
                        fz={24}
                        fw={900}
                        color={isDark ? "blue.5" : "blue.7"}
                        style={{ letterSpacing: "2px" }}
                    >
                        {NOMBRE_SISTEMA}
                    </TextSection>
                    <Badge
                        fullWidth
                        variant="light"
                        size="xl"
                        radius="lg"
                        autoContrast
                    >
                        <TextSection tt="" fw={600} fz={14}>
                            {usuario.role}
                        </TextSection>
                    </Badge>
                    <Divider />
                    <TitlePage order={3}>{BIENVENIDA}</TitlePage>
                    <Stack gap="md">
                        <div>
                            <TextSection tt="" fz={16} fw={500}>
                                {usuario.apellidos + " " + usuario.nombres}
                            </TextSection>
                            <TextSection
                                fz={12}
                                fw={700}
                                color="dimmed"
                                style={{ letterSpacing: "0.5px" }}
                            >
                                {
                                    PAGE_TITLE.PERFIL.SECTION_LABELS
                                        .NOMBRES_COMPLETOS
                                }
                            </TextSection>
                        </div>
                        <div>
                            <TextSection tt="" fz={16} fw={500}>
                                {usuario.dni}
                            </TextSection>
                            <TextSection
                                fz={12}
                                fw={700}
                                color="dimmed"
                                style={{ letterSpacing: "0.5px" }}
                            >
                                {PAGE_TITLE.PERFIL.SECTION_LABELS.NUMERO_CEDULA}
                            </TextSection>
                        </div>
                        <div>
                            <TextSection tt="" fz={16} fw={500}>
                                {usuario.email}
                            </TextSection>
                            <TextSection
                                fz={12}
                                fw={700}
                                color="dimmed"
                                style={{ letterSpacing: "0.5px" }}
                            >
                                {PAGE_TITLE.PERFIL.SECTION_LABELS.CORREO}
                            </TextSection>
                        </div>
                        <div>
                            <Badge variant="dot" color="teal" radius="xs">
                                {usuario.activo
                                    ? "Usuario Activo"
                                    : "No activo"}
                            </Badge>
                            <TextSection
                                fz={12}
                                fw={700}
                                color="dimmed"
                                style={{ letterSpacing: "0.5px" }}
                            >
                                {
                                    PAGE_TITLE.PERFIL.SECTION_LABELS
                                        .ESTADO_USUARIO
                                }
                            </TextSection>
                        </div>
                    </Stack>

                    <Group grow mt="xl" gap="md">
                        <Button
                            size="sm"
                            variant="light"
                            leftSection={<IconBookmarksFilled size={25} />}
                            onClick={handleNavigateGestionarReservas}
                            styles={{
                                root: {
                                    height: "80px",
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "12px",
                                },
                                label: {
                                    whiteSpace: "normal",
                                    lineHeight: 1.3,
                                },
                                section: {
                                    marginRight: 0,
                                    marginBottom: 8,
                                },
                            }}
                        >
                            {PAGE_TITLE.PERFIL.BUTTONS.GESTIONAR_RESERVAS}
                        </Button>
                        <Button
                            size="sm"
                            variant="default"
                            leftSection={<IconKeyFilled size={25} />}
                            onClick={handleNavigateChangePassword}
                            styles={{
                                root: {
                                    height: "80px",
                                    display: "flex",
                                    flexDirection: "column",
                                    padding: "12px",
                                },
                                label: {
                                    whiteSpace: "normal",
                                    lineHeight: 1.3,
                                },
                                section: {
                                    marginRight: 0,
                                    marginBottom: 8,
                                },
                            }}
                        >
                            {PAGE_TITLE.PERFIL.BUTTONS.CAMBIAR_CONTRASENA}
                        </Button>
                    </Group>
                </div>
            </Card>
        </Container>
    );
};

export default PerfilPage;
