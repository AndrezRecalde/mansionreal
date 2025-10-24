import { useMemo } from "react";
import {
    Badge,
    Card,
    Container,
    Divider,
    Group,
    Image,
    Stack,
    Text,
    Title,
    useMantineColorScheme,
} from "@mantine/core";
import { BtnSection, TextSection, TitlePage } from "../../components";
import { useTitleHook } from "../../hooks";
import classes from "./modules/Perfil.module.css";
import bg from "../../assets/images/logo.png";
import { IconBookmarksFilled, IconKeyFilled } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const PerfilPage = () => {
    const navigate = useNavigate();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === "dark";
    useTitleHook("Perfil - Mansion Real");
    const usuario = useMemo(
        () => JSON.parse(localStorage.getItem("service_user")),
        []
    );

    const handleNavigateChangePassword = () => {
        // Lógica para navegar a la página de cambio de contraseña
        navigate("/staff/cambiar-contrasena");
    };

    const handleNavigateGestionarReservas = () => {
        // Lógica para navegar a la página de gestión de reservas
        navigate("/gerencia/disponibilidad-departamento");
    }

    return (
        <Container size="sm" my={20}>
            <TitlePage order={2}>Mi Perfil</TitlePage>
            <Divider my={10} />
            <Card
                radius="md"
                shadow="sm"
                withBorder
                style={{
                    display: "flex",
                    flexDirection: "row",
                    padding: "20px",
                    borderRadius: "12px",
                    background: isDark
                        ? "linear-gradient(135deg, #1A1B1E 0%, #25262B 100%)"
                        : "linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)",
                    boxShadow: isDark
                        ? "0 4px 20px rgba(0, 0, 0, 0.4)"
                        : "0 4px 20px rgba(0, 0, 0, 0.08)",
                    border: isDark ? "1px solid #373A40" : "none",
                }}
            >
                {/* Lado izquierdo */}
                <div className={classes.left}>
                    <Image radius="md" fit="cover" src={bg} />
                </div>

                {/* Lado derecho */}
                <div className={classes.right}>
                    <Text
                        ta="center"
                        fz={25}
                        fw={900}
                        variant="gradient"
                        gradient={{ from: "blue", to: "cyan", deg: 90 }}
                    >
                        Hotel Mansion Real
                    </Text>
                    <Badge
                        fullWidth
                        variant="filled"
                        size="xl"
                        color="orange"
                        radius="xs"
                    >
                        <TextSection tt="" fw={600} fz={14}>
                            {usuario.role}
                        </TextSection>
                    </Badge>
                    <Divider />
                    <div>
                        <Title order={3}>Bienvenido</Title>
                    </div>
                    <Stack>
                        <div>
                            <Text className={classes.label}>
                                {usuario.apellidos + " " + usuario.nombres}
                            </Text>
                            <Text fw={700} fz="xs" c="dimmed">
                                Nombres Completos
                            </Text>
                        </div>
                        <div>
                            <Text className={classes.label}>{usuario.dni}</Text>
                            <Text fw={700} fz="xs" c="dimmed">
                                Numero cedula
                            </Text>
                        </div>
                        <div>
                            <Text className={classes.label}>
                                {usuario.email}
                            </Text>
                            <Text fw={700} fz="xs" c="dimmed">
                                Correo
                            </Text>
                        </div>
                        <div>
                            <Badge variant="filled" color="teal" radius="xs">
                                {usuario.activo
                                    ? "Usuario Activo"
                                    : "No activo"}
                            </Badge>
                            <Text fw={700} fz="xs" c="dimmed">
                                Estado
                            </Text>
                        </div>
                    </Stack>
                    <Group>
                        <BtnSection
                            mt={5}
                            variant="light"
                            fullWidth={true}
                            IconSection={IconBookmarksFilled}
                            handleAction={handleNavigateGestionarReservas}
                        >
                            Gestionar Reservas
                        </BtnSection>
                        <BtnSection
                            fullWidth={true}
                            IconSection={IconKeyFilled}
                            handleAction={handleNavigateChangePassword}
                        >
                            Cambiar Contrasena
                        </BtnSection>
                    </Group>
                </div>
            </Card>
        </Container>
    );
};

export default PerfilPage;
