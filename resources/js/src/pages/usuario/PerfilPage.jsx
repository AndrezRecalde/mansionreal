import { useMemo } from "react";
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
import classes from "./modules/Perfil.module.css";
import bg from "../../assets/images/hotel_mansion_real.jpg";
import { IconBookmarksFilled, IconKeyFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const PerfilPage = () => {
    useTitleHook("Perfil - Mansion Real");
    const navigate = useNavigate();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    const usuario = JSON.parse(localStorage.getItem("service_user") || "{}");

    const handleNavigateChangePassword = () => {
        navigate("/staff/cambiar-contrasena");
    };

    const handleNavigateGestionarReservas = () => {
        navigate("/gerencia/disponibilidad-departamento");
    };

    return (
        <Container size="md" my={20}>
            <TitlePage order={2}>Mi Perfil</TitlePage>
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
                    >
                        Mansión Real
                    </TextSection>
                    <Badge
                        fullWidth
                        variant="filled"
                        size="xl"
                        color="teal.7"
                        radius="lg"
                    >
                        <TextSection tt="" fw={600} fz={14}>
                            {usuario.role}
                        </TextSection>
                    </Badge>
                    <Divider />
                    <TitlePage order={3}>Bienvenido</TitlePage>
                    <Stack gap="md">
                        <div>
                            <TextSection tt="" fz={16} fw={500}>
                                {usuario.apellidos + " " + usuario.nombres}
                            </TextSection>
                            <TextSection tt="" fw={700} color="dimmed">
                                Nombres Completos
                            </TextSection>
                        </div>
                        <div>
                            <TextSection tt="" fz={16} fw={500}>
                                {usuario.dni}
                            </TextSection>
                            <TextSection tt="" fw={700} color="dimmed">
                                Numero cedula
                            </TextSection>
                        </div>
                        <div>
                            <TextSection tt="" fz={16} fw={500}>
                                {usuario.email}
                            </TextSection>
                            <TextSection tt="" fw={700} color="dimmed">
                                Correo
                            </TextSection>
                        </div>
                        <div>
                            <Badge variant="dot" color="teal" radius="xs">
                                {usuario.activo
                                    ? "Usuario Activo"
                                    : "No activo"}
                            </Badge>
                            <TextSection tt="" fw={700} color="dimmed">
                                Estado
                            </TextSection>
                        </div>
                    </Stack>

                    <Group grow mt="xl" gap="md">
                        <Button
                            size="sm"
                            variant="light"
                            color="teal"
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
                            Gestionar Reservas
                        </Button>
                        <Button
                            size="sm"
                            variant="default"
                            //color="orange"
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
                            Cambiar Contraseña
                        </Button>
                    </Group>
                </div>
            </Card>
        </Container>
    );
};

export default PerfilPage;
