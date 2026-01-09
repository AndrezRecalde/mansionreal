import {
    Anchor,
    Box,
    Button,
    Center,
    Group,
    Paper,
    PasswordInput,
    rem,
    Stack,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconArrowLeft } from "@tabler/icons-react";
import { useUsuarioStore } from "../../../hooks/usuario/useUsuarioStore";
import { useNavigate } from "react-router-dom";
import { BtnSubmit } from "../../elements/buttons/BtnServices";

export const ContrasenaForm = () => {
    const usuario = JSON.parse(localStorage.getItem("service_user"));
    const navigate = useNavigate();
    const { cargando, fnCambiarPassword } = useUsuarioStore();
    const form = useForm({
        initialValues: {
            password: "",
            password_confirmation: "",
        },
        validate: {
            password_confirmation : (value, values) =>
                value !== values.password ? "Las contraseñas no coinciden" : null,
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getValues());
        fnCambiarPassword({
            id: usuario.id,
            password: form.getValues().password,
            password_confirmation: form.getValues().password_confirmation,
        });
        form.reset();
    };

    return (
        <Box
            component="form"
            onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
        >
            <Paper withBorder shadow="md" p={30} radius="md" mt="xl">
                <Stack>
                    <PasswordInput
                        label="Digita tu nueva contraseña"
                        {...form.getInputProps("password")}
                    />
                    <PasswordInput
                        label="Confirma tu nueva contraseña"
                        {...form.getInputProps("password_confirmation")}
                    />
                </Stack>
                <Group justify="space-between" mt="lg">
                    <Anchor
                        component="button"
                        onClick={() => navigate("/intranet/profile")}
                        c="dimmed"
                        size="sm"
                    >
                        <Center inline>
                            <IconArrowLeft
                                style={{ width: rem(12), height: rem(12) }}
                                stroke={1.5}
                            />
                            <Box ml={5}>Regresar a mi perfil</Box>
                        </Center>
                    </Anchor>
                    <BtnSubmit loading={cargando}>Cambiar contraseña</BtnSubmit>
                </Group>
            </Paper>
        </Box>
    );
};
