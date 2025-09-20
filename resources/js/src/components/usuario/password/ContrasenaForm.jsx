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

export const ContrasenaForm = () => {
    const form = useForm({
        initialValues: {
            paswrd: "",
            paswrd_confirmed: "",
        },
        validate: {
            paswrd_confirmed: (value, values) =>
                value !== values.paswrd ? "Las contraseñas no coinciden" : null,
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(form.getValues());
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
                        {...form.getInputProps("paswrd")}
                    />
                    <PasswordInput
                        label="Confirma tu nueva contraseña"
                        {...form.getInputProps("paswrd_confirmed")}
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
                    <Button type="submit">Cambiar contraseña</Button>
                </Group>
            </Paper>
        </Box>
    );
};
