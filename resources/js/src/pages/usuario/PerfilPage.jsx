import { useMemo } from "react";
import {
    Badge,
    Button,
    Card,
    Container,
    Divider,
    Image,
    Stack,
    Text,
    Title,
} from "@mantine/core";
import { TextSection, TitlePage } from "../../components";
import { useTitleHook } from "../../hooks";
import classes from "./modules/Perfil.module.css";
import bg from "../../assets/images/logo.png";

const PerfilPage = () => {
    useTitleHook("Perfil - Mansion Real");
    const usuario = useMemo(
        () => JSON.parse(localStorage.getItem("service_user")),
        []
    );
    return (
        <Container size="sm" my={20}>
            <TitlePage order={2}>Mi Perfil</TitlePage>
            <Divider my={10} />
            <Card className={classes.card} radius="md" shadow="sm" withBorder>
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
                    <Badge fullWidth variant="light" size="lg" color="orange" radius="xs">
                        <TextSection tt="" fw={600} fz={14}>{usuario.role}</TextSection>
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
                            <Text className={classes.label}>
                                { usuario.dni }
                            </Text>
                            <Text fw={700} fz="xs" c="dimmed">
                                Numero cedula
                            </Text>
                        </div>
                        <div>
                            <Text className={classes.label}>
                                { usuario.email }
                            </Text>
                            <Text fw={700} fz="xs" c="dimmed">
                                Correo
                            </Text>
                        </div>
                        <div>
                            <Badge variant="light" color="teal" radius="xs">
                                { usuario.activo ? "Usuario Activo" : "No activo" }
                            </Badge>
                            <Text fw={700} fz="xs" c="dimmed">
                                Estado
                            </Text>
                        </div>
                    </Stack>
                    <Button variant="default" color="teal" radius="xs">
                        Cambiar Contrasena
                    </Button>
                </div>
            </Card>
        </Container>
    );
};

export default PerfilPage;
