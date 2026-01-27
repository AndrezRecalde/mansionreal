import {
    Anchor,
    Box,
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
import { PAGE_TITLE } from "../../../helpers/getPrefix";

export const ContrasenaForm = ({ usuario }) => {
    const navigate = useNavigate();
    const { cargando, fnCambiarPassword } = useUsuarioStore();
    const form = useForm({
        initialValues: {
            password: "",
            password_confirmation: "",
        },
        validate: {
            password_confirmation: (value, values) =>
                value !== values.password
                    ? "Las contraseñas no coinciden"
                    : null,
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log(form.getValues());
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
                        label={
                            PAGE_TITLE.CAMBIO_CONTRASENA.INPUTS
                                .LABEL_NUEVA_CONTRASENA
                        }
                        {...form.getInputProps("password")}
                    />
                    <PasswordInput
                        label={
                            PAGE_TITLE.CAMBIO_CONTRASENA.INPUTS
                                .LABEL_CONFIRMAR_CONTRASENA
                        }
                        {...form.getInputProps("password_confirmation")}
                    />
                </Stack>
                <Group justify="space-between" mt="lg">
                    <Anchor
                        component="button"
                        onClick={() =>
                            navigate(
                                PAGE_TITLE.CAMBIO_CONTRASENA.NAVEGACIONES
                                    .REGRESAR_PERFIL,
                            )
                        }
                        c="dimmed"
                        size="sm"
                    >
                        <Center inline>
                            <IconArrowLeft
                                style={{ width: rem(12), height: rem(12) }}
                                stroke={1.5}
                            />
                            <Box ml={5}>
                                {
                                    PAGE_TITLE.CAMBIO_CONTRASENA.BUTTONS
                                        .REGRESAR_PERFIL
                                }
                            </Box>
                        </Center>
                    </Anchor>
                    <BtnSubmit loading={cargando}>
                        {
                            PAGE_TITLE.CAMBIO_CONTRASENA.BUTTONS
                                .CAMBIAR_CONTRASENA
                        }
                    </BtnSubmit>
                </Group>
            </Paper>
        </Box>
    );
};
